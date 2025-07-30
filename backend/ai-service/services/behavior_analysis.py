import httpx
import logging
from datetime import datetime, timedelta
from typing import Dict, List, Any, Optional
import os

from ai_engine import AIEngine
from database.database import DatabaseManager

class BehaviorAnalysisService:
    def __init__(self, ai_engine: AIEngine, db_manager: DatabaseManager):
        self.ai_engine = ai_engine
        self.db_manager = db_manager
        self.logger = logging.getLogger(__name__)
        self.harmony_service_url = os.getenv("HARMONY_SERVICE_URL", "http://your_harmony_service_host:8081")
    
    async def analyze_behavior(
        self, 
        user_id: int, 
        analysis_type: str = "comprehensive"
    ) -> Dict[str, Any]:
        """사용자 행동을 분석합니다."""
        try:
            # 사용자 히스토리 조회
            user_history = await self._get_user_history(user_id)
            
            if not user_history:
                self.logger.warning(f"사용자 {user_id}의 히스토리가 없어 기본 분석을 생성합니다.")
                return self._generate_fallback_analysis(user_id)
            
            # AI 엔진을 통한 행동 분석
            analysis_result = self.ai_engine.analyze_user_behavior(
                user_history=user_history,
                analysis_type=analysis_type
            )
            
            # 분석 결과를 데이터베이스에 저장
            await self._save_behavior_analysis(user_id, analysis_result, analysis_type)
            
            return analysis_result
            
        except Exception as e:
            self.logger.error(f"행동 분석 실패: {str(e)}")
            return self._generate_fallback_analysis(user_id)
    
    async def analyze_learning_patterns(self, user_id: int) -> Dict[str, Any]:
        """학습 패턴을 분석합니다."""
        try:
            # 사용자 히스토리 조회
            user_history = await self._get_user_history(user_id)
            
            if not user_history:
                return {"patterns": [], "analysis": "데이터 부족"}
            
            # 학습 패턴 분석
            patterns = self._perform_comprehensive_analysis(user_history)
            
            return {
                "patterns": patterns,
                "analysis": "학습 패턴 분석 완료",
                "user_id": user_id,
                "analyzed_at": datetime.now().isoformat()
            }
            
        except Exception as e:
            self.logger.error(f"학습 패턴 분석 실패: {str(e)}")
            return {"patterns": [], "analysis": "분석 실패"}
    
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
    
    async def _save_behavior_analysis(self, user_id: int, analysis_result: Dict[str, Any], analysis_type: str):
        """행동 분석 결과를 데이터베이스에 저장합니다."""
        try:
            analysis_data = {
                "user_id": user_id,
                "analysis_type": analysis_type,
                "learning_pattern": analysis_result.get("learning_pattern", ""),
                "time_patterns": analysis_result.get("time_patterns", {}),
                "difficulty_preference": analysis_result.get("difficulty_preference", {}),
                "improvement_rate": analysis_result.get("improvement_rate", 0.0),
                "learning_efficiency": analysis_result.get("learning_efficiency", 0.0),
                "analysis_confidence": analysis_result.get("analysis_confidence", 0.0),
                "time_analysis": analysis_result.get("time_analysis", {}),
                "difficulty_analysis": analysis_result.get("difficulty_analysis", {}),
                "persistence_analysis": analysis_result.get("persistence_analysis", {}),
                "improvement_trend": analysis_result.get("improvement_trend", {}),
                "efficiency_analysis": analysis_result.get("efficiency_analysis", {})
            }
            
            success = self.db_manager.insert_behavior_analysis(analysis_data)
            if success:
                self.logger.info(f"행동 분석 저장 완료: 사용자 {user_id}")
            else:
                self.logger.error(f"행동 분석 저장 실패: 사용자 {user_id}")
                
        except Exception as e:
            self.logger.error(f"행동 분석 저장 실패: {str(e)}")
    
    def _perform_comprehensive_analysis(self, user_history: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        """종합적인 학습 패턴 분석을 수행합니다."""
        patterns = []
        
        # 시간 패턴 분석
        time_patterns = self._analyze_time_patterns(user_history)
        if time_patterns:
            patterns.append({
                "type": "time_pattern",
                "title": "시간 패턴 분석",
                "data": time_patterns,
                "description": "학습 시간대와 소요 시간 패턴"
            })
        
        # 정확도 패턴 분석
        accuracy_patterns = self._analyze_accuracy_patterns(user_history)
        if accuracy_patterns:
            patterns.append({
                "type": "accuracy_pattern",
                "title": "정확도 패턴 분석",
                "data": accuracy_patterns,
                "description": "문제 타입별 정확도 패턴"
            })
        
        # 문제 타입 패턴 분석
        type_patterns = self._analyze_type_patterns(user_history)
        if type_patterns:
            patterns.append({
                "type": "type_pattern",
                "title": "문제 타입 패턴 분석",
                "data": type_patterns,
                "description": "선호하는 문제 타입과 성과"
            })
        
        # 학습 스타일 분석
        learning_style = self._analyze_learning_style(user_history)
        if learning_style:
            patterns.append({
                "type": "learning_style",
                "title": "학습 스타일 분석",
                "data": learning_style,
                "description": "개인화된 학습 스타일 특성"
            })
        
        return patterns
    
    def _analyze_time_patterns(self, user_history: List[Dict[str, Any]]) -> Dict[str, Any]:
        """시간 패턴을 분석합니다."""
        try:
            if not user_history:
                return {}
            
            # 평균 소요 시간 계산
            time_spent_list = [h.get("time_spent", 0) for h in user_history if h.get("time_spent")]
            avg_time = sum(time_spent_list) / len(time_spent_list) if time_spent_list else 0
            
            # 시간 분포 분석
            fast_count = sum(1 for t in time_spent_list if t <= 30)
            medium_count = sum(1 for t in time_spent_list if 30 < t <= 60)
            slow_count = sum(1 for t in time_spent_list if t > 60)
            
            return {
                "average_time": avg_time,
                "time_distribution": {
                    "빠름 (0-30초)": fast_count,
                    "보통 (31-60초)": medium_count,
                    "느림 (61초 이상)": slow_count
                },
                "total_attempts": len(time_spent_list)
            }
            
        except Exception as e:
            self.logger.error(f"시간 패턴 분석 실패: {str(e)}")
            return {}
    
    def _analyze_accuracy_patterns(self, user_history: List[Dict[str, Any]]) -> Dict[str, Any]:
        """정확도 패턴을 분석합니다."""
        try:
            if not user_history:
                return {}
            
            # 전체 정확도
            correct_count = sum(1 for h in user_history if h.get("is_correct", False))
            total_count = len(user_history)
            overall_accuracy = correct_count / total_count if total_count > 0 else 0
            
            # 타입별 정확도
            type_accuracy = {}
            for history in user_history:
                question_type = history.get("question_type", "unknown")
                is_correct = history.get("is_correct", False)
                
                if question_type not in type_accuracy:
                    type_accuracy[question_type] = {"correct": 0, "total": 0}
                
                type_accuracy[question_type]["total"] += 1
                if is_correct:
                    type_accuracy[question_type]["correct"] += 1
            
            # 정확도 계산
            for question_type in type_accuracy:
                correct = type_accuracy[question_type]["correct"]
                total = type_accuracy[question_type]["total"]
                type_accuracy[question_type]["accuracy"] = correct / total if total > 0 else 0
            
            return {
                "overall_accuracy": overall_accuracy,
                "type_accuracy": type_accuracy,
                "total_attempts": total_count,
                "correct_attempts": correct_count
            }
            
        except Exception as e:
            self.logger.error(f"정확도 패턴 분석 실패: {str(e)}")
            return {}
    
    def _analyze_type_patterns(self, user_history: List[Dict[str, Any]]) -> Dict[str, Any]:
        """문제 타입 패턴을 분석합니다."""
        try:
            if not user_history:
                return {}
            
            # 타입별 시도 횟수
            type_counts = {}
            for history in user_history:
                question_type = history.get("question_type", "unknown")
                type_counts[question_type] = type_counts.get(question_type, 0) + 1
            
            # 가장 많이 시도한 타입
            most_attempted = max(type_counts.items(), key=lambda x: x[1]) if type_counts else ("unknown", 0)
            
            return {
                "type_counts": type_counts,
                "most_attempted_type": most_attempted[0],
                "most_attempted_count": most_attempted[1],
                "total_types": len(type_counts)
            }
            
        except Exception as e:
            self.logger.error(f"타입 패턴 분석 실패: {str(e)}")
            return {}
    
    def _analyze_learning_style(self, user_history: List[Dict[str, Any]]) -> Dict[str, Any]:
        """학습 스타일을 분석합니다."""
        try:
            if not user_history:
                return {}
            
            # 평균 소요 시간
            time_spent_list = [h.get("time_spent", 0) for h in user_history if h.get("time_spent")]
            avg_time = sum(time_spent_list) / len(time_spent_list) if time_spent_list else 0
            
            # 전체 정확도
            correct_count = sum(1 for h in user_history if h.get("is_correct", False))
            total_count = len(user_history)
            accuracy = correct_count / total_count if total_count > 0 else 0
            
            # 학습 스타일 판단
            if avg_time <= 30 and accuracy >= 0.8:
                learning_style = "빠른 직관형"
            elif avg_time <= 45 and accuracy >= 0.7:
                learning_style = "균형잡힌 학습자"
            elif avg_time > 60 and accuracy < 0.6:
                learning_style = "신중한 학습자"
            else:
                learning_style = "일반 학습자"
            
            return {
                "learning_style": learning_style,
                "average_time": avg_time,
                "accuracy": accuracy,
                "total_attempts": total_count
            }
            
        except Exception as e:
            self.logger.error(f"학습 스타일 분석 실패: {str(e)}")
            return {}
    
    def _generate_fallback_analysis(self, user_id: int) -> Dict[str, Any]:
        """기본 분석을 생성합니다."""
        return {
            "learning_pattern": "기본 학습자",
            "time_patterns": {
                "average_time": 45.0,
                "time_distribution": {"빠름 (0-30초)": 0, "보통 (31-60초)": 1, "느림 (61초 이상)": 0},
                "total_attempts": 1
            },
            "difficulty_preference": {
                "preferred_difficulty": 1,
                "difficulty_range": [1, 2]
            },
            "improvement_rate": 0.0,
            "learning_efficiency": 0.0,
            "analysis_confidence": 0.5,
            "user_id": user_id,
            "analysis_type": "fallback"
        } 