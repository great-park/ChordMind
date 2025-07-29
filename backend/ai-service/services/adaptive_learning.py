import asyncio
from typing import Dict, List, Any, Optional
import logging
from datetime import datetime
import httpx
import random

from ai_engine import AIEngine
from models.learning_analysis import LearningGoal, LearningStep, LearningPath, WeakestArea

class AdaptiveLearningService:
    def __init__(self, ai_engine: AIEngine):
        self.ai_engine = ai_engine
        self.logger = logging.getLogger(__name__)
        self.harmony_service_url = "http://localhost:8081"
    
    async def generate_questions(
        self,
        user_id: int,
        question_type: str,
        count: int = 1
    ) -> List[Dict[str, Any]]:
        """적응형 문제를 생성합니다."""
        try:
            # 사용자 히스토리 가져오기
            user_history = await self._get_user_history(user_id)
            
            # AI 엔진을 통한 적응형 문제 생성
            adaptive_questions = self.ai_engine.generate_adaptive_questions(
                user_history=user_history,
                question_type=question_type,
                count=count
            )
            
            return adaptive_questions
            
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
            # 사용자 통계 가져오기
            user_stats = await self._get_user_stats(user_id)
            
            # 약점 영역 분석
            weakest_areas = []
            if include_weakest_areas:
                weakest_areas = await self._analyze_weakest_areas(user_id)
            
            # 사용자 행동 분석
            user_behavior = await self._analyze_user_behavior(user_id)
            
            # AI 엔진을 통한 학습 경로 생성
            learning_path = self.ai_engine.generate_learning_path(
                user_stats=user_stats,
                weakest_areas=weakest_areas,
                user_behavior=user_behavior
            )
            
            return learning_path
            
        except Exception as e:
            self.logger.error(f"학습 경로 생성 실패: {str(e)}")
            return self._generate_fallback_learning_path(user_id)
    
    async def generate_recommendations(self, user_id: int) -> List[Dict[str, Any]]:
        """학습 추천을 생성합니다."""
        try:
            # 사용자 성과 분석
            performance_analysis = await self._analyze_user_performance(user_id)
            
            # 약점 영역 분석
            weakest_areas = await self._analyze_weakest_areas(user_id)
            
            # 개인화된 추천 생성
            recommendations = self._generate_personalized_recommendations(
                performance_analysis, weakest_areas
            )
            
            return recommendations
            
        except Exception as e:
            self.logger.error(f"학습 추천 생성 실패: {str(e)}")
            return self._generate_fallback_recommendations()
    
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
    
    async def _get_user_stats(self, user_id: int) -> Dict[str, Any]:
        """사용자 통계를 가져옵니다."""
        try:
            async with httpx.AsyncClient() as client:
                response = await client.get(
                    f"{self.harmony_service_url}/api/analytics/user/{user_id}/stats",
                    timeout=10.0
                )
                
                if response.status_code == 200:
                    return response.json()
                else:
                    self.logger.warning(f"사용자 통계 조회 실패: {response.status_code}")
                    return self._generate_default_stats()
                    
        except Exception as e:
            self.logger.error(f"사용자 통계 조회 중 오류: {str(e)}")
            return self._generate_default_stats()
    
    async def _analyze_weakest_areas(self, user_id: int) -> List[WeakestArea]:
        """사용자의 약점 영역을 분석합니다."""
        try:
            user_history = await self._get_user_history(user_id)
            
            if not user_history:
                return []
            
            # 문제 유형별 성과 분석
            type_performance = {}
            for record in user_history:
                question_type = record.get("question_type", "UNKNOWN")
                if question_type not in type_performance:
                    type_performance[question_type] = {
                        "attempts": 0,
                        "correct": 0,
                        "total_time": 0
                    }
                
                type_performance[question_type]["attempts"] += 1
                if record.get("is_correct", False):
                    type_performance[question_type]["correct"] += 1
                type_performance[question_type]["total_time"] += record.get("time_spent", 0)
            
            # 약점 영역 식별
            weakest_areas = []
            for question_type, performance in type_performance.items():
                accuracy = performance["correct"] / performance["attempts"]
                avg_time = performance["total_time"] / performance["attempts"]
                
                # 낮은 정확도나 긴 소요 시간을 약점으로 판단
                priority = 1
                if accuracy < 0.6:
                    priority = 5
                elif accuracy < 0.8:
                    priority = 3
                
                if avg_time > 60:  # 60초 이상 소요
                    priority = min(priority + 2, 5)
                
                weakest_areas.append(WeakestArea(
                    question_type=question_type,
                    attempts=performance["attempts"],
                    correct=performance["correct"],
                    accuracy=accuracy,
                    priority=priority,
                    recommended_focus_time=int((1 - accuracy) * 30)  # 30분 단위로 추천
                ))
            
            # 우선순위 순으로 정렬
            weakest_areas.sort(key=lambda x: x.priority, reverse=True)
            return weakest_areas
            
        except Exception as e:
            self.logger.error(f"약점 영역 분석 실패: {str(e)}")
            return []
    
    async def _analyze_user_behavior(self, user_id: int) -> Dict[str, Any]:
        """사용자 행동을 분석합니다."""
        try:
            user_history = await self._get_user_history(user_id)
            
            if not user_history:
                return self._generate_default_behavior()
            
            # AI 엔진을 통한 행동 분석
            behavior_analysis = self.ai_engine.analyze_user_behavior(user_history)
            
            return behavior_analysis
            
        except Exception as e:
            self.logger.error(f"사용자 행동 분석 실패: {str(e)}")
            return self._generate_default_behavior()
    
    async def _analyze_user_performance(self, user_id: int) -> Dict[str, Any]:
        """사용자 성과를 분석합니다."""
        try:
            user_history = await self._get_user_history(user_id)
            
            if not user_history:
                return {"overall_accuracy": 0.0, "total_attempts": 0}
            
            total_attempts = len(user_history)
            correct_attempts = sum(1 for record in user_history if record.get("is_correct", False))
            overall_accuracy = correct_attempts / total_attempts if total_attempts > 0 else 0.0
            
            return {
                "overall_accuracy": overall_accuracy,
                "total_attempts": total_attempts,
                "correct_attempts": correct_attempts,
                "average_time": sum(record.get("time_spent", 0) for record in user_history) / total_attempts
            }
            
        except Exception as e:
            self.logger.error(f"사용자 성과 분석 실패: {str(e)}")
            return {"overall_accuracy": 0.0, "total_attempts": 0}
    
    def _generate_personalized_recommendations(
        self, 
        performance_analysis: Dict[str, Any], 
        weakest_areas: List[WeakestArea]
    ) -> List[Dict[str, Any]]:
        """개인화된 추천을 생성합니다."""
        recommendations = []
        
        # 성과 기반 추천
        accuracy = performance_analysis.get("overall_accuracy", 0.0)
        if accuracy < 0.6:
            recommendations.append({
                "type": "기초 복습",
                "title": "기본 개념 복습",
                "description": "정확도가 낮으므로 기본 개념부터 다시 학습하세요.",
                "priority": 5,
                "estimated_time": 30
            })
        elif accuracy < 0.8:
            recommendations.append({
                "type": "중급 연습",
                "title": "실전 연습 강화",
                "description": "더 많은 연습을 통해 실력을 향상시키세요.",
                "priority": 3,
                "estimated_time": 45
            })
        else:
            recommendations.append({
                "type": "고급 도전",
                "title": "고급 문제 도전",
                "description": "높은 정확도를 보이므로 더 어려운 문제에 도전해보세요.",
                "priority": 2,
                "estimated_time": 60
            })
        
        # 약점 영역 기반 추천
        for area in weakest_areas[:3]:  # 상위 3개 약점
            recommendations.append({
                "type": "약점 보완",
                "title": f"{area.question_type} 집중 학습",
                "description": f"{area.question_type} 영역의 정확도가 {area.accuracy:.1%}로 낮습니다.",
                "priority": area.priority,
                "estimated_time": area.recommended_focus_time
            })
        
        return recommendations
    
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
            "user_id": user_id,
            "learning_goals": [
                {
                    "goal_id": "basic_goal",
                    "title": "기본 음악 이론 학습",
                    "description": "음악 이론의 기본 개념을 학습합니다.",
                    "target_accuracy": 0.8,
                    "estimated_time": 60,
                    "priority": 3,
                    "prerequisites": []
                }
            ],
            "learning_steps": [
                {
                    "step_id": "step_1",
                    "goal_id": "basic_goal",
                    "title": "화음 기초",
                    "description": "기본 화음들을 학습합니다.",
                    "difficulty": "초급",
                    "estimated_time": 20,
                    "order": 1,
                    "dependencies": []
                }
            ],
            "estimated_total_time": 60,
            "difficulty_progression": [{"step": 1, "difficulty": "초급"}],
            "personalized_recommendations": ["기본 개념부터 차근차근 학습하세요."],
            "confidence_score": 0.5,
            "generated_at": datetime.now().isoformat()
        }
    
    def _generate_fallback_recommendations(self) -> List[Dict[str, Any]]:
        """기본 추천을 생성합니다."""
        return [
            {
                "type": "기본 학습",
                "title": "음악 이론 기초",
                "description": "음악 이론의 기본 개념을 학습하세요.",
                "priority": 3,
                "estimated_time": 30
            }
        ]
    
    def _generate_default_stats(self) -> Dict[str, Any]:
        """기본 통계를 생성합니다."""
        return {
            "total_attempts": 0,
            "correct_attempts": 0,
            "overall_accuracy": 0.0,
            "average_time": 0
        }
    
    def _generate_default_behavior(self) -> Dict[str, Any]:
        """기본 행동 분석을 생성합니다."""
        return {
            "learning_pattern": "분석 불가",
            "time_patterns": {"average_time": 0},
            "difficulty_preference": {"preference": "기본"},
            "improvement_rate": 0.0,
            "learning_efficiency": 0.0,
            "analysis_confidence": 0.0
        } 