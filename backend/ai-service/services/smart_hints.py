import asyncio
from typing import Dict, List, Any, Optional
import logging
from datetime import datetime
import httpx

from ai_engine import AIEngine

class SmartHintsService:
    def __init__(self, ai_engine: AIEngine):
        self.ai_engine = ai_engine
        self.logger = logging.getLogger(__name__)
        self.harmony_service_url = "http://localhost:8081"
        
        # 힌트 데이터베이스
        self.hint_database = {
            "CHORD_NAME": {
                1: [
                    "화음의 기본 구성음을 생각해보세요.",
                    "3음과 5음의 관계를 확인해보세요.",
                    "화음의 성격(장/단)을 먼저 판단해보세요."
                ],
                2: [
                    "화음의 구성음을 순서대로 나열해보세요.",
                    "7화음의 경우 7음이 추가됩니다.",
                    "sus4, sus2 등의 변형 화음을 주의하세요."
                ],
                3: [
                    "복합 화음의 구조를 분석해보세요.",
                    "화음의 기능적 역할을 고려해보세요.",
                    "고급 화음 이론을 적용해보세요."
                ]
            },
            "PROGRESSION": {
                1: [
                    "기본 진행 패턴을 기억해보세요.",
                    "I-IV-V 진행을 먼저 확인해보세요.",
                    "화음의 기능을 생각해보세요."
                ],
                2: [
                    "2-5-1 진행 패턴을 확인해보세요.",
                    "대리 화음의 사용을 고려해보세요.",
                    "화음 연결의 원리를 적용해보세요."
                ],
                3: [
                    "고급 진행 패턴을 분석해보세요.",
                    "조성 변화를 고려해보세요.",
                    "복합적 화음 진행을 이해해보세요."
                ]
            },
            "INTERVAL": {
                1: [
                    "음정의 기본 거리를 세어보세요.",
                    "반음과 온음의 관계를 확인해보세요.",
                    "음정의 성격(장/단)을 판단해보세요."
                ],
                2: [
                    "복합 음정의 계산법을 적용해보세요.",
                    "음정의 전위를 고려해보세요.",
                    "조화적 음정의 특성을 이해해보세요."
                ],
                3: [
                    "고급 음정 이론을 적용해보세요.",
                    "음정의 기능적 역할을 분석해보세요.",
                    "복합적 음정 관계를 이해해보세요."
                ]
            },
            "SCALE": {
                1: [
                    "음계의 기본 패턴을 기억해보세요.",
                    "온음과 반음의 배치를 확인해보세요.",
                    "장음계와 단음계의 차이를 생각해보세요."
                ],
                2: [
                    "모드의 특성을 이해해보세요.",
                    "음계의 변형을 고려해보세요.",
                    "조성의 관계를 분석해보세요."
                ],
                3: [
                    "고급 음계 이론을 적용해보세요.",
                    "복합 음계의 구조를 분석해보세요.",
                    "음계의 기능적 역할을 이해해보세요."
                ]
            }
        }
    
    async def generate_hints(
        self,
        user_id: int,
        question_type: str,
        difficulty: int,
        show_detailed: bool = False
    ) -> Dict[str, Any]:
        """스마트 힌트를 생성합니다."""
        try:
            # 사용자 성과 분석
            user_accuracy = await self._get_user_accuracy(user_id, question_type)
            
            # AI 엔진을 통한 스마트 힌트 생성
            ai_hints = self.ai_engine.generate_smart_hints(
                user_history=await self._get_user_history(user_id),
                question_type=question_type,
                difficulty=difficulty,
                user_accuracy=user_accuracy
            )
            
            # 기본 힌트와 AI 힌트 결합
            base_hints = self._get_base_hints(question_type, difficulty)
            all_hints = base_hints + ai_hints
            
            # 사용자 수준에 맞게 힌트 조정
            adjusted_hints = self._adjust_hints_for_user(
                all_hints, user_accuracy, difficulty, show_detailed
            )
            
            return {
                "hints": adjusted_hints,
                "total_hints": len(adjusted_hints),
                "user_accuracy": user_accuracy,
                "difficulty_level": difficulty,
                "show_detailed": show_detailed,
                "generated_at": datetime.now().isoformat()
            }
            
        except Exception as e:
            self.logger.error(f"스마트 힌트 생성 실패: {str(e)}")
            return self._generate_fallback_hints(question_type, difficulty)
    
    async def _get_user_accuracy(self, user_id: int, question_type: str) -> float:
        """사용자의 특정 문제 유형에 대한 정확도를 가져옵니다."""
        try:
            user_history = await self._get_user_history(user_id)
            
            if not user_history:
                return 0.0
            
            type_history = [h for h in user_history if h.get("question_type") == question_type]
            
            if not type_history:
                return 0.0
            
            correct_count = sum(1 for h in type_history if h.get("is_correct", False))
            total_count = len(type_history)
            
            return correct_count / total_count if total_count > 0 else 0.0
            
        except Exception as e:
            self.logger.error(f"사용자 정확도 조회 실패: {str(e)}")
            return 0.0
    
    async def _get_user_history(self, user_id: int) -> List[Dict[str, Any]]:
        """사용자의 학습 히스토리를 가져옵니다."""
        try:
            async with httpx.AsyncClient() as client:
                response = await client.get(
                    f"{self.harmony_service_url}/api/quiz/results/user/{user_id}",
                    timeout=10.0
                )
                
                if response.status_code == 200:
                    return response.json()
                else:
                    self.logger.warning(f"사용자 히스토리 조회 실패: {response.status_code}")
                    return []
                    
        except Exception as e:
            self.logger.error(f"사용자 히스토리 조회 중 오류: {str(e)}")
            return []
    
    def _get_base_hints(self, question_type: str, difficulty: int) -> List[str]:
        """기본 힌트를 가져옵니다."""
        hints = self.hint_database.get(question_type, {}).get(difficulty, [])
        return hints.copy()
    
    def _adjust_hints_for_user(
        self, 
        hints: List[str], 
        user_accuracy: float, 
        difficulty: int,
        show_detailed: bool
    ) -> List[str]:
        """사용자 수준에 맞게 힌트를 조정합니다."""
        adjusted_hints = []
        
        # 사용자 정확도에 따른 힌트 수 조정
        if user_accuracy >= 0.8:
            # 높은 정확도: 힌트 수 줄임
            max_hints = 2
        elif user_accuracy >= 0.6:
            # 중간 정확도: 적당한 힌트 수
            max_hints = 3
        else:
            # 낮은 정확도: 더 많은 힌트
            max_hints = 4
        
        # 난이도에 따른 조정
        if difficulty == 1:
            max_hints = min(max_hints + 1, 5)  # 초급: 더 많은 힌트
        elif difficulty == 3:
            max_hints = max(max_hints - 1, 1)  # 고급: 더 적은 힌트
        
        # 상세 모드일 때 더 많은 힌트
        if show_detailed:
            max_hints = min(max_hints + 2, len(hints))
        
        # 힌트 선택 및 조정
        selected_hints = hints[:max_hints]
        
        for hint in selected_hints:
            # 사용자 정확도에 따른 힌트 내용 조정
            if user_accuracy < 0.5:
                # 낮은 정확도: 더 구체적인 힌트
                adjusted_hint = f"💡 {hint} (기본 개념을 다시 확인해보세요)"
            elif user_accuracy < 0.7:
                # 중간 정확도: 일반적인 힌트
                adjusted_hint = f"💡 {hint}"
            else:
                # 높은 정확도: 간단한 힌트
                adjusted_hint = f"💡 {hint}"
            
            adjusted_hints.append(adjusted_hint)
        
        return adjusted_hints
    
    def _generate_fallback_hints(self, question_type: str, difficulty: int) -> Dict[str, Any]:
        """기본 힌트를 생성합니다."""
        base_hints = self._get_base_hints(question_type, difficulty)
        
        return {
            "hints": base_hints[:2],  # 기본 힌트 2개만 제공
            "total_hints": min(len(base_hints), 2),
            "user_accuracy": 0.0,
            "difficulty_level": difficulty,
            "show_detailed": False,
            "generated_at": datetime.now().isoformat()
        }
    
    async def get_hint_effectiveness(self, user_id: int, question_type: str) -> Dict[str, Any]:
        """힌트의 효과성을 분석합니다."""
        try:
            user_history = await self._get_user_history(user_id)
            
            if not user_history:
                return {"effectiveness": 0.0, "analysis": "데이터 부족"}
            
            # 힌트 사용 전후 성과 비교
            type_history = [h for h in user_history if h.get("question_type") == question_type]
            
            if len(type_history) < 10:
                return {"effectiveness": 0.0, "analysis": "충분한 데이터 없음"}
            
            # 간단한 효과성 분석 (실제로는 더 복잡한 분석 필요)
            mid_point = len(type_history) // 2
            first_half = type_history[:mid_point]
            second_half = type_history[mid_point:]
            
            first_accuracy = sum(1 for h in first_half if h.get("is_correct", False)) / len(first_half)
            second_accuracy = sum(1 for h in second_half if h.get("is_correct", False)) / len(second_half)
            
            effectiveness = second_accuracy - first_accuracy
            
            return {
                "effectiveness": effectiveness,
                "analysis": f"힌트 사용 후 정확도 변화: {effectiveness:.2f}",
                "first_half_accuracy": first_accuracy,
                "second_half_accuracy": second_accuracy
            }
            
        except Exception as e:
            self.logger.error(f"힌트 효과성 분석 실패: {str(e)}")
            return {"effectiveness": 0.0, "analysis": "분석 실패"}
    
    async def generate_contextual_hints(
        self, 
        user_id: int, 
        question_type: str, 
        current_question: str,
        user_progress: Dict[str, Any]
    ) -> List[str]:
        """문맥에 맞는 힌트를 생성합니다."""
        try:
            # 현재 문제의 특성 분석
            question_features = self._analyze_question_features(current_question, question_type)
            
            # 사용자 진행 상황 분석
            progress_analysis = self._analyze_user_progress(user_progress)
            
            # 문맥 기반 힌트 생성
            contextual_hints = self._generate_contextual_hints_logic(
                question_features, progress_analysis, question_type
            )
            
            return contextual_hints
            
        except Exception as e:
            self.logger.error(f"문맥 힌트 생성 실패: {str(e)}")
            return self._get_base_hints(question_type, 1)[:1]  # 기본 힌트 1개
    
    def _analyze_question_features(self, question: str, question_type: str) -> Dict[str, Any]:
        """문제의 특성을 분석합니다."""
        features = {
            "length": len(question),
            "complexity": "basic",
            "keywords": [],
            "question_type": question_type
        }
        
        # 문제 복잡도 분석
        if len(question) > 100:
            features["complexity"] = "advanced"
        elif len(question) > 50:
            features["complexity"] = "intermediate"
        
        # 키워드 추출 (간단한 구현)
        keywords = ["화음", "진행", "음정", "음계", "조성", "모드"]
        features["keywords"] = [kw for kw in keywords if kw in question]
        
        return features
    
    def _analyze_user_progress(self, user_progress: Dict[str, Any]) -> Dict[str, Any]:
        """사용자 진행 상황을 분석합니다."""
        return {
            "current_streak": user_progress.get("current_streak", 0),
            "total_attempts": user_progress.get("total_attempts", 0),
            "recent_accuracy": user_progress.get("recent_accuracy", 0.0),
            "time_spent": user_progress.get("time_spent", 0)
        }
    
    def _generate_contextual_hints_logic(
        self, 
        question_features: Dict[str, Any], 
        progress_analysis: Dict[str, Any],
        question_type: str
    ) -> List[str]:
        """문맥 기반 힌트 생성 로직"""
        hints = []
        
        # 진행 상황에 따른 힌트
        if progress_analysis["current_streak"] > 5:
            hints.append("연속 정답이 많습니다! 이번 문제도 집중해서 풀어보세요.")
        elif progress_analysis["recent_accuracy"] < 0.5:
            hints.append("최근 정확도가 낮습니다. 기본 개념을 다시 확인해보세요.")
        
        # 문제 복잡도에 따른 힌트
        if question_features["complexity"] == "advanced":
            hints.append("복잡한 문제입니다. 단계별로 분석해보세요.")
        elif question_features["complexity"] == "basic":
            hints.append("기본 문제입니다. 차근차근 풀어보세요.")
        
        # 문제 유형별 특화 힌트
        type_hints = self._get_base_hints(question_type, 1)
        if type_hints:
            hints.append(type_hints[0])
        
        return hints 