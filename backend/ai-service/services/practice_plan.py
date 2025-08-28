import logging
from typing import Dict, List, Any, Optional
import json
import os
from datetime import datetime, timedelta
import random

class PracticePlanService:
    """개인 맞춤 연습 계획 서비스"""
    
    def __init__(self):
        self.logger = logging.getLogger(__name__)
        self.practice_areas = self._load_practice_areas()
        self.exercise_templates = self._load_exercise_templates()
        self.user_practice_data = {}  # 사용자별 연습 데이터
        self.ai_diagnosis_models = self._initialize_ai_models()
    
    def _load_practice_areas(self) -> Dict[str, List[Dict]]:
        """연습 영역을 로드합니다."""
        return {
            "harmony": [
                {
                    "id": "h_001",
                    "name": "기본 화성 진행",
                    "description": "I-IV-V, ii-V-I 등 기본적인 화성 진행",
                    "difficulty": "beginner",
                    "estimated_time": 20,
                    "focus_points": ["화음 인식", "진행 패턴", "베이스 라인"],
                    "prerequisites": []
                }
            ],
            "melody": [
                {
                    "id": "m_001",
                    "name": "스케일 연습",
                    "description": "메이저, 마이너, 블루스 스케일 연습",
                    "difficulty": "beginner",
                    "estimated_time": 15,
                    "focus_points": ["정확한 음정", "리듬감", "표현력"],
                    "prerequisites": []
                }
            ]
        }
    
    def _load_exercise_templates(self) -> Dict[str, List[Dict]]:
        """연습 템플릿을 로드합니다."""
        return {
            "daily_warmup": [
                {
                    "id": "warmup_001",
                    "name": "손가락 워밍업",
                    "duration": 10,
                    "exercises": ["스케일 연주", "아르페지오", "손가락 독립성"],
                    "intensity": "low"
                }
            ]
        }
    
    def _initialize_ai_models(self) -> Dict[str, Any]:
        """AI 진단 모델을 초기화합니다."""
        return {
            "difficulty_assessment": "random_forest",
            "progress_prediction": "gradient_boosting",
            "recommendation_engine": "collaborative_filtering"
        }
    
    def analyze_user_performance(
        self, 
        user_id: int, 
        practice_history: List[Dict]
    ) -> Dict[str, Any]:
        """사용자의 연습 성과를 AI로 분석합니다."""
        try:
            if not practice_history:
                return self._generate_default_analysis()
            
            # 연습 데이터 분석
            total_practice_time = sum(session.get("duration", 0) for session in practice_history)
            average_session_length = total_practice_time / len(practice_history) if practice_history else 0
            
            # 영역별 성과 분석
            area_performance = self._analyze_area_performance(practice_history)
            
            # 개선 영역 식별
            improvement_areas = self._identify_improvement_areas(area_performance)
            
            # 난이도 평가
            current_level = self._assess_current_level(area_performance, total_practice_time)
            
            return {
                "user_id": user_id,
                "analysis_date": datetime.now().isoformat(),
                "overall_performance": {
                    "total_practice_time": total_practice_time,
                    "average_session_length": round(average_session_length, 2),
                    "total_sessions": len(practice_history),
                    "consistency_score": self._calculate_consistency_score(practice_history)
                },
                "area_performance": area_performance,
                "improvement_areas": improvement_areas,
                "current_level": current_level,
                "recommendations": [
                    "기본적인 화성학 학습을 시작하세요",
                    "정기적인 연습 습관을 만들어보세요"
                ]
            }
            
        except Exception as e:
            self.logger.error(f"사용자 성과 분석 실패: {e}")
            return {"error": f"성과 분석 중 오류 발생: {str(e)}"}
    
    def generate_personalized_plan(
        self, 
        user_id: int, 
        analysis_result: Dict[str, Any],
        practice_time: int = 60,
        focus_areas: Optional[List[str]] = None
    ) -> Dict[str, Any]:
        """개인 맞춤형 연습 계획을 생성합니다."""
        try:
            # 분석 결과에서 정보 추출
            improvement_areas = analysis_result.get("improvement_areas", [])
            current_level = analysis_result.get("current_level", "beginner")
            
            # 연습 계획 생성
            daily_plan = self._create_daily_plan(
                improvement_areas, current_level, practice_time, focus_areas
            )
            
            return {
                "user_id": user_id,
                "generated_date": datetime.now().isoformat(),
                "plan_duration": "7 days",
                "daily_practice_time": practice_time,
                "focus_areas": focus_areas or improvement_areas,
                "daily_plan": daily_plan
            }
            
        except Exception as e:
            self.logger.error(f"개인 맞춤 계획 생성 실패: {e}")
            return {"error": f"계획 생성 중 오류 발생: {str(e)}"}
    
    def track_practice_progress(
        self, 
        user_id: int, 
        session_data: Dict[str, Any]
    ) -> Dict[str, Any]:
        """연습 세션의 진행 상황을 추적합니다."""
        try:
            # 사용자 데이터 초기화
            if user_id not in self.user_practice_data:
                self.user_practice_data[user_id] = {
                    "sessions": [],
                    "current_plan": None,
                    "progress_history": []
                }
            
            # 세션 데이터 저장
            session_id = f"session_{len(self.user_practice_data[user_id]['sessions']) + 1}"
            session_data["session_id"] = session_id
            session_data["timestamp"] = datetime.now().isoformat()
            
            self.user_practice_data[user_id]["sessions"].append(session_data)
            
            return {
                "session_id": session_id,
                "message": "진행 상황이 기록되었습니다.",
                "overall_progress": self._get_overall_progress(user_id)
            }
            
        except Exception as e:
            self.logger.error(f"진행 추적 실패: {e}")
            return {"error": f"진행 추적 중 오류 발생: {str(e)}"}
    
    def get_progress_analytics(
        self, 
        user_id: int, 
        time_range: str = "30d"
    ) -> Dict[str, Any]:
        """사용자의 연습 진행 상황을 분석합니다."""
        try:
            if user_id not in self.user_practice_data:
                return {"user_id": user_id, "no_data": True}
            
            user_data = self.user_practice_data[user_id]
            
            # 시간 범위에 따른 데이터 필터링
            filtered_sessions = self._filter_sessions_by_time(
                user_data["sessions"], time_range
            )
            
            # 진행도 통계
            progress_stats = self._calculate_progress_statistics(filtered_sessions)
            
            # 영역별 성과 추이
            area_trends = self._analyze_area_trends(filtered_sessions)
            
            # 목표 달성 현황
            goal_status = self._analyze_goal_status(user_data, time_range)
            
            # 개선 추이
            improvement_trends = self._analyze_improvement_trends(filtered_sessions)
            
            return {
                "user_id": user_id,
                "time_range": time_range,
                "analysis_date": datetime.now().isoformat(),
                "progress_statistics": progress_stats,
                "area_trends": area_trends,
                "goal_status": goal_status,
                "improvement_trends": improvement_trends,
                "recommendations": self._generate_analytics_recommendations(
                    progress_stats, area_trends, goal_status
                )
            }
            
        except Exception as e:
            self.logger.error(f"진행 분석 실패: {e}")
            return {"error": f"진행 분석 중 오류 발생: {str(e)}"}
    
    def _generate_default_analysis(self) -> Dict[str, Any]:
        """기본 분석 결과를 생성합니다."""
        return {
            "overall_performance": {
                "total_practice_time": 0,
                "average_session_length": 0,
                "total_sessions": 0,
                "consistency_score": 0
            },
            "area_performance": {
                "harmony": {"score": 0, "level": "beginner"},
                "melody": {"score": 0, "level": "beginner"}
            },
            "improvement_areas": ["harmony", "melody"],
            "current_level": "beginner"
        }
    
    def _analyze_area_performance(self, practice_history: List[Dict]) -> Dict[str, Dict]:
        """영역별 성과를 분석합니다."""
        area_scores = {
            "harmony": {"total_time": 0, "sessions": 0, "difficulty": 0},
            "melody": {"total_time": 0, "sessions": 0, "difficulty": 0}
        }
        
        for session in practice_history:
            area = session.get("area", "general")
            if area in area_scores:
                area_scores[area]["total_time"] += session.get("duration", 0)
                area_scores[area]["sessions"] += 1
                area_scores[area]["difficulty"] += session.get("difficulty", 1)
        
        # 점수 계산
        for area, data in area_scores.items():
            if data["sessions"] > 0:
                data["score"] = min(100, (data["total_time"] / 60) * 10)
                data["level"] = self._calculate_level(data["score"])
            else:
                data["score"] = 0
                data["level"] = "beginner"
        
        return area_scores
    
    def _identify_improvement_areas(self, area_performance: Dict) -> List[str]:
        """개선이 필요한 영역을 식별합니다."""
        improvement_areas = []
        
        for area, data in area_performance.items():
            if data["score"] < 70:
                improvement_areas.append(area)
        
        return improvement_areas[:2]  # 상위 2개 영역
    
    def _assess_current_level(self, area_performance: Dict, total_time: int) -> str:
        """현재 수준을 평가합니다."""
        average_score = sum(data["score"] for data in area_performance.values()) / 2
        
        if total_time < 300 or average_score < 40:
            return "beginner"
        elif average_score < 70:
            return "intermediate"
        else:
            return "advanced"
    
    def _calculate_consistency_score(self, practice_history: List[Dict]) -> float:
        """연습 일관성 점수를 계산합니다."""
        if len(practice_history) < 2:
            return 0.0
        
        # 간단한 일관성 점수 계산
        return 75.0  # 기본값
    
    def _create_daily_plan(
        self, 
        improvement_areas: List[str], 
        current_level: str, 
        practice_time: int, 
        focus_areas: Optional[List[str]]
    ) -> Dict[str, Any]:
        """일일 연습 계획을 생성합니다."""
        if not focus_areas:
            focus_areas = improvement_areas
        
        # 워밍업 시간 할당
        warmup_time = min(15, practice_time // 4)
        main_practice_time = practice_time - warmup_time
        
        # 영역별 시간 분배
        area_time_allocation = {}
        for area in focus_areas:
            area_time_allocation[area] = main_practice_time // len(focus_areas)
        
        # 일일 계획 구성
        daily_plan = {
            "warmup": {
                "duration": warmup_time,
                "exercises": ["기본 스케일", "간단한 아르페지오"]
            },
            "main_practice": {}
        }
        
        for area, allocated_time in area_time_allocation.items():
            daily_plan["main_practice"][area] = {
                "duration": allocated_time,
                "exercises": [f"{area} 영역 연습"]
            }
        
        return daily_plan
    
    def _get_overall_progress(self, user_id: int) -> Dict[str, Any]:
        """전체 진행도를 조회합니다."""
        if user_id not in self.user_practice_data:
            return {"total_sessions": 0, "total_time": 0}
        
        sessions = self.user_practice_data[user_id]["sessions"]
        
        if not sessions:
            return {"total_sessions": 0, "total_time": 0}
        
        total_time = sum(s.get("duration", 0) for s in sessions)
        
        return {
            "total_sessions": len(sessions),
            "total_time": total_time,
            "last_session": sessions[-1].get("timestamp") if sessions else None
        }
    
    def _filter_sessions_by_time(
        self, 
        sessions: List[Dict], 
        time_range: str
    ) -> List[Dict]:
        """시간 범위에 따라 세션을 필터링합니다."""
        now = datetime.now()
        
        if time_range == "7d":
            cutoff_date = now - timedelta(days=7)
        elif time_range == "30d":
            cutoff_date = now - timedelta(days=30)
        elif time_range == "90d":
            cutoff_date = now - timedelta(days=90)
        else:
            return sessions
        
        filtered_sessions = []
        for session in sessions:
            session_date = datetime.fromisoformat(session.get("timestamp", "2024-01-01T12:00:00"))
            if session_date >= cutoff_date:
                filtered_sessions.append(session)
        
        return filtered_sessions
    
    def _calculate_progress_statistics(self, sessions: List[Dict]) -> Dict[str, Any]:
        """진행도 통계를 계산합니다."""
        if not sessions:
            return {"total_sessions": 0, "total_time": 0, "average_score": 0}
        
        total_time = sum(s.get("duration", 0) for s in sessions)
        total_score = sum(s.get("score", 0) for s in sessions)
        
        return {
            "total_sessions": len(sessions),
            "total_time": total_time,
            "average_score": round(total_score / len(sessions), 2),
            "best_session_score": max((s.get("score", 0) for s in sessions), default=0),
            "longest_session": max((s.get("duration", 0) for s in sessions), default=0)
        }
    
    def _analyze_area_trends(self, sessions: List[Dict]) -> Dict[str, List[Dict]]:
        """영역별 성과 추이를 분석합니다."""
        area_data = {}
        
        for session in sessions:
            area = session.get("area", "general")
            if area not in area_data:
                area_data[area] = []
            
            area_data[area].append({
                "timestamp": session.get("timestamp"),
                "score": session.get("score", 0),
                "duration": session.get("duration", 0)
            })
        
        # 각 영역별 추이 계산
        trends = {}
        for area, data in area_data.items():
            if len(data) >= 2:
                # 간단한 선형 추세 계산
                first_score = data[0]["score"]
                last_score = data[-1]["score"]
                trend_direction = "improving" if last_score > first_score else "declining" if last_score < first_score else "stable"
                
                trends[area] = {
                    "trend_direction": trend_direction,
                    "score_change": round(last_score - first_score, 2),
                    "sessions_count": len(data),
                    "average_score": round(sum(d["score"] for d in data) / len(data), 2)
                }
            else:
                trends[area] = {
                    "trend_direction": "insufficient_data",
                    "score_change": 0,
                    "sessions_count": len(data),
                    "average_score": data[0]["score"] if data else 0
                }
        
        return trends
    
    def _analyze_goal_status(self, user_data: Dict, time_range: str) -> Dict[str, Any]:
        """목표 달성 현황을 분석합니다."""
        # 간단한 목표 달성 분석
        return {
            "daily_goals_achieved": random.randint(3, 7),  # 시뮬레이션
            "weekly_goals_achieved": random.randint(2, 5),
            "monthly_goals_achieved": random.randint(1, 3),
            "overall_achievement_rate": random.randint(70, 95)
        }
    
    def _analyze_improvement_trends(self, sessions: List[Dict]) -> Dict[str, Any]:
        """개선 추이를 분석합니다."""
        if len(sessions) < 2:
            return {"trend": "insufficient_data", "improvement_rate": 0}
        
        # 간단한 개선률 계산
        first_week_scores = [s.get("score", 0) for s in sessions[:len(sessions)//2]]
        last_week_scores = [s.get("score", 0) for s in sessions[len(sessions)//2:]]
        
        if not first_week_scores or not last_week_scores:
            return {"trend": "insufficient_data", "improvement_rate": 0}
        
        first_avg = sum(first_week_scores) / len(first_week_scores)
        last_avg = sum(last_week_scores) / len(last_week_scores)
        
        improvement_rate = ((last_avg - first_avg) / first_avg * 100) if first_avg > 0 else 0
        
        return {
            "trend": "improving" if improvement_rate > 0 else "declining" if improvement_rate < 0 else "stable",
            "improvement_rate": round(improvement_rate, 2),
            "first_week_average": round(first_avg, 2),
            "last_week_average": round(last_avg, 2)
        }
    
    def _generate_analytics_recommendations(
        self, 
        progress_stats: Dict, 
        area_trends: Dict, 
        goal_status: Dict
    ) -> List[str]:
        """분석 결과를 바탕으로 권장사항을 생성합니다."""
        recommendations = []
        
        # 진행도 기반 권장사항
        if progress_stats.get("average_score", 0) < 60:
            recommendations.append("연습의 질을 높이기 위해 더 집중적인 연습을 해보세요")
        
        if progress_stats.get("total_time", 0) < 300:  # 5시간 미만
            recommendations.append("연습 시간을 늘려보세요. 일관성이 중요합니다")
        
        # 영역별 추세 기반 권장사항
        for area, trend in area_trends.items():
            if trend["trend_direction"] == "declining":
                recommendations.append(f"{area} 영역의 연습을 강화해보세요")
        
        # 목표 달성 기반 권장사항
        if goal_status.get("overall_achievement_rate", 0) < 80:
            recommendations.append("목표를 조금씩 낮춰서 단계적으로 달성해보세요")
        
        return recommendations[:3]  # 상위 3개 권장사항만 반환
    
    def _calculate_level(self, score: float) -> str:
        """점수를 기반으로 수준을 계산합니다."""
        if score < 30:
            return "beginner"
        elif score < 70:
            return "intermediate"
        else:
            return "advanced"
