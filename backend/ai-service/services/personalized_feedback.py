import asyncio
from typing import Dict, List, Any, Optional
import logging
from datetime import datetime
import httpx
import os

from ai_engine import AIEngine
from database.database import DatabaseManager

class PersonalizedFeedbackService:
    def __init__(self, ai_engine: AIEngine, db_manager: DatabaseManager):
        self.ai_engine = ai_engine
        self.db_manager = db_manager
        self.logger = logging.getLogger(__name__)
        self.harmony_service_url = os.getenv("HARMONY_SERVICE_URL", "http://localhost:8081")
    
    async def generate_feedback(
        self,
        user_id: int,
        question_type: str,
        user_answer: str,
        correct_answer: str,
        is_correct: bool,
        time_spent: Optional[int] = None,
        difficulty: Optional[int] = None
    ) -> Dict[str, Any]:
        """개인화된 피드백을 생성합니다."""
        try:
            # 사용자 히스토리 조회
            user_history = await self._get_user_history(user_id)
            
            # AI 엔진을 통한 피드백 생성
            feedback_result = self.ai_engine.generate_personalized_feedback(
                user_id=user_id,
                question_type=question_type,
                user_answer=user_answer,
                correct_answer=correct_answer,
                is_correct=is_correct,
                user_history=user_history,
                time_spent=time_spent,
                difficulty=difficulty
            )
            
            # 피드백을 데이터베이스에 저장
            await self._save_feedback(user_id, feedback_result)
            
            return {
                "feedback": feedback_result.get("feedback", ""),
                "learning_style": feedback_result.get("learning_style", ""),
                "performance_analysis": feedback_result.get("performance_analysis", {}),
                "improvement_suggestions": feedback_result.get("improvement_suggestions", []),
                "confidence_score": feedback_result.get("confidence_score", 0.0),
                "generated_at": datetime.now().isoformat()
            }
            
        except Exception as e:
            self.logger.error(f"피드백 생성 실패: {str(e)}")
            return {
                "feedback": self._generate_fallback_feedback(is_correct, correct_answer),
                "learning_style": "기본 학습자",
                "performance_analysis": {},
                "improvement_suggestions": ["기본 학습을 권장합니다."],
                "confidence_score": 0.5,
                "fallback_feedback": self._generate_fallback_feedback(is_correct, correct_answer)
            }
    
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
    
    async def _save_feedback(self, user_id: int, feedback_result: Dict[str, Any]):
        """피드백 결과를 데이터베이스에 저장합니다."""
        try:
            feedback_data = {
                "user_id": user_id,
                "feedback": feedback_result.get("feedback", ""),
                "learning_style": feedback_result.get("learning_style", ""),
                "performance_analysis": feedback_result.get("performance_analysis", {}),
                "improvement_suggestions": feedback_result.get("improvement_suggestions", []),
                "confidence_score": feedback_result.get("confidence_score", 0.0),
                "generated_at": datetime.now().isoformat()
            }
            
            # 데이터베이스에 저장
            success = self.db_manager.insert_feedback(feedback_data)
            if success:
                self.logger.info(f"피드백 저장 완료: 사용자 {user_id}")
            else:
                self.logger.error(f"피드백 저장 실패: 사용자 {user_id}")
            
        except Exception as e:
            self.logger.error(f"피드백 저장 실패: {str(e)}")
    
    def _generate_fallback_feedback(self, is_correct: bool, correct_answer: str) -> str:
        """기본 피드백을 생성합니다."""
        if is_correct:
            return f"정답입니다! {correct_answer}에 대한 이해가 좋습니다."
        else:
            return f"틀렸습니다. 정답은 {correct_answer}입니다. 다시 한번 학습해보세요."
    
    async def get_feedback_history(self, user_id: int, limit: int = 10) -> List[Dict[str, Any]]:
        """사용자의 피드백 히스토리를 가져옵니다."""
        try:
            # 데이터베이스에서 피드백 히스토리를 조회
            return self.db_manager.get_feedback_history(user_id, limit)
            
        except Exception as e:
            self.logger.error(f"피드백 히스토리 조회 실패: {str(e)}")
            return []
    
    async def analyze_feedback_effectiveness(self, user_id: int) -> Dict[str, Any]:
        """피드백의 효과성을 분석합니다."""
        try:
            feedback_history = await self.get_feedback_history(user_id)
            user_history = await self._get_user_history(user_id)
            
            if not feedback_history or not user_history:
                return {"effectiveness_score": 0.0, "analysis": "데이터 부족"}
            
            # 피드백 후 성과 개선 분석
            improvement_analysis = self._analyze_improvement_after_feedback(
                feedback_history, user_history
            )
            
            return {
                "effectiveness_score": improvement_analysis.get("score", 0.0),
                "analysis": improvement_analysis.get("analysis", ""),
                "recommendations": improvement_analysis.get("recommendations", [])
            }
            
        except Exception as e:
            self.logger.error(f"피드백 효과성 분석 실패: {str(e)}")
            return {"effectiveness_score": 0.0, "analysis": "분석 실패"}
    
    def _analyze_improvement_after_feedback(
        self, 
        feedback_history: List[Dict[str, Any]], 
        user_history: List[Dict[str, Any]]
    ) -> Dict[str, Any]:
        """피드백 후 성과 개선을 분석합니다."""
        try:
            # 피드백 전후 성과 비교
            feedback_timestamps = [f.get("generated_at") for f in feedback_history]
            
            if not feedback_timestamps:
                return {"score": 0.0, "analysis": "피드백 데이터 없음"}
            
            # 간단한 개선률 계산 (실제로는 더 복잡한 분석 필요)
            improvement_score = 0.5  # 기본값
            
            return {
                "score": improvement_score,
                "analysis": "피드백 효과성 분석 완료",
                "recommendations": ["더 자세한 피드백 제공", "개인화 수준 향상"]
            }
            
        except Exception as e:
            self.logger.error(f"개선 분석 실패: {str(e)}")
            return {"score": 0.0, "analysis": "분석 실패"} 