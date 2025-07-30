import httpx
import logging
from datetime import datetime
from typing import Dict, List, Any, Optional
import os

from ai_engine import AIEngine
from database.database import DatabaseManager

class AdaptiveLearningService:
    def __init__(self, ai_engine: AIEngine, db_manager: DatabaseManager):
        self.ai_engine = ai_engine
        self.db_manager = db_manager
        self.logger = logging.getLogger(__name__)
        self.harmony_service_url = os.getenv("HARMONY_SERVICE_URL", "http://your_harmony_service_host:8081")
    
    async def generate_questions(
        self, 
        user_id: int, 
        question_type: str, 
        count: int = 1
    ) -> List[Dict[str, Any]]:
        """사용자 수준에 맞는 적응형 문제를 생성합니다."""
        try:
            # 사용자 히스토리 조회
            user_history = await self._get_user_history(user_id)
            
            if not user_history:
                self.logger.warning(f"사용자 {user_id}의 히스토리가 없어 기본 문제를 생성합니다.")
                return self._generate_fallback_questions(question_type, count)
            
            # AI 엔진을 통한 적응형 문제 생성
            questions = self.ai_engine.generate_adaptive_questions(
                user_history=user_history,
                question_type=question_type,
                count=count
            )
            
            # 생성된 문제들을 데이터베이스에 저장
            for question in questions:
                await self._save_adaptive_question(user_id, question)
            
            return questions
            
        except Exception as e:
            self.logger.error(f"적응형 문제 생성 실패: {str(e)}")
            return self._generate_fallback_questions(question_type, count)
    
    async def generate_learning_path(
        self, 
        user_id: int,
        include_weakest_areas: bool = True,
        include_time_estimate: bool = True,
        max_recommendations: int = 5
    ) -> Dict[str, Any]:
        """개인화된 학습 경로를 생성합니다."""
        try:
            # 사용자 성과 통계 조회
            user_stats = self.db_manager.get_user_performance_stats(user_id)
            
            if not user_stats or user_stats.get("total_attempts", 0) == 0:
                self.logger.warning(f"사용자 {user_id}의 성과 데이터가 없어 기본 학습 경로를 생성합니다.")
                return self._generate_fallback_learning_path(user_id)
            
            # AI 엔진을 통한 학습 경로 생성
            learning_path = self.ai_engine.generate_learning_path(
                user_id=user_id,
                user_stats=user_stats,
                include_weakest_areas=include_weakest_areas,
                include_time_estimate=include_time_estimate,
                max_recommendations=max_recommendations
            )
            
            # 학습 경로를 데이터베이스에 저장
            await self._save_learning_path(user_id, learning_path)
            
            return learning_path
            
        except Exception as e:
            self.logger.error(f"학습 경로 생성 실패: {str(e)}")
            return self._generate_fallback_learning_path(user_id)
    
    async def generate_recommendations(self, user_id: int) -> List[Dict[str, Any]]:
        """학습 추천을 생성합니다."""
        try:
            # 사용자 성과 통계 조회
            user_stats = self.db_manager.get_user_performance_stats(user_id)
            
            if not user_stats or user_stats.get("total_attempts", 0) == 0:
                return self._generate_fallback_recommendations()
            
            # AI 엔진을 통한 추천 생성
            recommendations = self.ai_engine.generate_learning_recommendations(
                user_id=user_id,
                user_stats=user_stats
            )
            
            return recommendations
            
        except Exception as e:
            self.logger.error(f"학습 추천 생성 실패: {str(e)}")
            return self._generate_fallback_recommendations()
    
    async def analyze_weakest_areas(self, user_id: int) -> List[Dict[str, Any]]:
        """사용자의 약점 영역을 분석합니다."""
        try:
            # 사용자 성과 통계 조회
            user_stats = self.db_manager.get_user_performance_stats(user_id)
            
            if not user_stats or user_stats.get("total_attempts", 0) == 0:
                return []
            
            type_stats = user_stats.get("type_stats", {})
            weakest_areas = []
            
            for question_type, stats in type_stats.items():
                accuracy = stats.get("accuracy", 0.0)
                if accuracy < 0.7:  # 70% 미만을 약점으로 간주
                    weakest_areas.append({
                        "question_type": question_type,
                        "accuracy": accuracy,
                        "attempts": stats.get("attempts", 0),
                        "recommendations": self._get_recommendations_for_type(question_type)
                    })
            
            # 정확도 순으로 정렬
            weakest_areas.sort(key=lambda x: x["accuracy"])
            
            return weakest_areas
            
        except Exception as e:
            self.logger.error(f"약점 영역 분석 실패: {str(e)}")
            return []
    
    async def _get_user_history(self, user_id: int) -> List[Dict[str, Any]]:
        """사용자의 퀴즈 히스토리를 가져옵니다."""
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
    
    async def _save_adaptive_question(self, user_id: int, question: Dict[str, Any]):
        """적응형 문제를 데이터베이스에 저장합니다."""
        try:
            question_data = {
                "user_id": user_id,
                "question_type": question.get("question_type", ""),
                "question_text": question.get("question", ""),
                "options": question.get("options", []),
                "correct_answer": question.get("correct_answer", ""),
                "difficulty": question.get("difficulty", 1),
                "explanation": question.get("explanation", ""),
                "adaptive_difficulty": question.get("adaptive_difficulty", 1),
                "question_pattern": question.get("pattern", "")
            }
            
            success = self.db_manager.insert_adaptive_question(question_data)
            if success:
                self.logger.info(f"적응형 문제 저장 완료: 사용자 {user_id}")
            else:
                self.logger.error(f"적응형 문제 저장 실패: 사용자 {user_id}")
                
        except Exception as e:
            self.logger.error(f"적응형 문제 저장 실패: {str(e)}")
    
    async def _save_learning_path(self, user_id: int, learning_path: Dict[str, Any]):
        """학습 경로를 데이터베이스에 저장합니다."""
        try:
            learning_path_data = {
                "user_id": user_id,
                "learning_goals": learning_path.get("learning_goals", []),
                "learning_steps": learning_path.get("learning_steps", []),
                "estimated_total_time": learning_path.get("estimated_total_time", 0),
                "difficulty_progression": learning_path.get("difficulty_progression", []),
                "personalized_recommendations": learning_path.get("personalized_recommendations", []),
                "confidence_score": learning_path.get("confidence_score", 0.0)
            }
            
            success = self.db_manager.insert_learning_path(learning_path_data)
            if success:
                self.logger.info(f"학습 경로 저장 완료: 사용자 {user_id}")
            else:
                self.logger.error(f"학습 경로 저장 실패: 사용자 {user_id}")
                
        except Exception as e:
            self.logger.error(f"학습 경로 저장 실패: {str(e)}")
    
    def _get_recommendations_for_type(self, question_type: str) -> List[str]:
        """문제 타입별 추천을 반환합니다."""
        recommendations = {
            "CHORD_NAME": [
                "기본 화음 구성원리를 학습하세요",
                "화음의 구성음을 순서대로 기억하세요",
                "7화음의 추가 구성원을 이해하세요"
            ],
            "PROGRESSION": [
                "기본 화음 진행 패턴을 학습하세요",
                "I-IV-V 진행을 먼저 마스터하세요",
                "화음 진행의 기능적 관계를 이해하세요"
            ],
            "INTERVAL": [
                "음정의 기본 개념을 학습하세요",
                "완전음정과 장단음정을 구분하세요",
                "음정의 구성음을 이해하세요"
            ],
            "SCALE": [
                "음계의 기본 구조를 학습하세요",
                "장음계와 단음계의 차이를 이해하세요",
                "음계의 구성음을 순서대로 기억하세요"
            ]
        }
        
        return recommendations.get(question_type, ["기본 학습을 권장합니다"])
    
    def _generate_fallback_questions(self, question_type: str, count: int) -> List[Dict[str, Any]]:
        """기본 문제를 생성합니다."""
        questions = []
        for i in range(count):
            questions.append({
                "id": f"fallback_{i}",
                "question_type": question_type,
                "question": f"기본 {question_type} 문제 {i+1}",
                "options": ["A", "B", "C", "D"],
                "correct_answer": "A",
                "difficulty": 1,
                "explanation": "기본 문제입니다."
            })
        return questions
    
    def _generate_fallback_learning_path(self, user_id: int) -> Dict[str, Any]:
        """기본 학습 경로를 생성합니다."""
        return {
            "learning_goals": [
                {
                    "goal_id": "basic_learning",
                    "title": "기본 음악 이론 학습",
                    "description": "기본 개념부터 차근차근 학습합니다.",
                    "target_accuracy": 0.8,
                    "estimated_time": 60,
                    "priority": 1
                }
            ],
            "learning_steps": [
                {
                    "step_id": "step_1",
                    "goal_id": "basic_learning",
                    "title": "기본 개념 학습",
                    "description": "음악 이론의 기본 개념을 학습합니다.",
                    "difficulty": "초급",
                    "estimated_time": 30,
                    "order": 1
                }
            ],
            "estimated_total_time": 60,
            "difficulty_progression": [{"step": 1, "difficulty": "초급"}],
            "personalized_recommendations": ["기본 개념부터 차근차근 학습하세요."],
            "confidence_score": 0.5
        }
    
    def _generate_fallback_recommendations(self) -> List[Dict[str, Any]]:
        """기본 추천을 생성합니다."""
        return [
            {
                "type": "basic_learning",
                "title": "기본 음악 이론 학습",
                "description": "기본 개념부터 차근차근 학습하세요.",
                "priority": 1,
                "estimated_time": 60
            }
        ] 