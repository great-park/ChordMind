import asyncio
from typing import Dict, List, Any, Optional
import logging
from datetime import datetime, timedelta
import httpx
import numpy as np
from collections import defaultdict

from ai_engine import AIEngine

class BehaviorAnalysisService:
    def __init__(self, ai_engine: AIEngine):
        self.ai_engine = ai_engine
        self.logger = logging.getLogger(__name__)
        self.harmony_service_url = "http://localhost:8081"
    
    async def analyze_behavior(
        self,
        user_id: int,
        analysis_type: str = "comprehensive"
    ) -> Dict[str, Any]:
        """사용자 행동을 분석합니다."""
        try:
            # 사용자 히스토리 가져오기
            user_history = await self._get_user_history(user_id)
            
            if not user_history:
                return self._generate_empty_analysis(user_id)
            
            # AI 엔진을 통한 행동 분석
            behavior_analysis = self.ai_engine.analyze_user_behavior(user_history)
            
            # 추가 분석
            if analysis_type == "comprehensive":
                additional_analysis = await self._perform_comprehensive_analysis(user_history)
                behavior_analysis.update(additional_analysis)
            
            return behavior_analysis
            
        except Exception as e:
            self.logger.error(f"행동 분석 실패: {str(e)}")
            return self._generate_fallback_analysis(user_id)
    
    async def analyze_learning_patterns(self, user_id: int) -> Dict[str, Any]:
        """학습 패턴을 분석합니다."""
        try:
            user_history = await self._get_user_history(user_id)
            
            if not user_history:
                return {"patterns": [], "analysis": "데이터 부족"}
            
            # 시간 패턴 분석
            time_patterns = self._analyze_time_patterns(user_history)
            
            # 정확도 패턴 분석
            accuracy_patterns = self._analyze_accuracy_patterns(user_history)
            
            # 문제 유형별 패턴 분석
            type_patterns = self._analyze_type_patterns(user_history)
            
            # 학습 스타일 분석
            learning_style = self._analyze_learning_style(user_history)
            
            return {
                "time_patterns": time_patterns,
                "accuracy_patterns": accuracy_patterns,
                "type_patterns": type_patterns,
                "learning_style": learning_style,
                "overall_pattern": self._determine_overall_pattern(time_patterns, accuracy_patterns),
                "recommendations": self._generate_pattern_recommendations(
                    time_patterns, accuracy_patterns, learning_style
                )
            }
            
        except Exception as e:
            self.logger.error(f"학습 패턴 분석 실패: {str(e)}")
            return {"patterns": [], "analysis": "분석 실패"}
    
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
    
    async def _perform_comprehensive_analysis(self, user_history: List[Dict[str, Any]]) -> Dict[str, Any]:
        """종합적인 분석을 수행합니다."""
        try:
            # 시간대별 분석
            time_analysis = self._analyze_time_distribution(user_history)
            
            # 난이도 선호도 분석
            difficulty_analysis = self._analyze_difficulty_preference(user_history)
            
            # 학습 지속성 분석
            persistence_analysis = self._analyze_learning_persistence(user_history)
            
            # 개선 추세 분석
            improvement_trend = self._analyze_improvement_trend(user_history)
            
            # 학습 효율성 분석
            efficiency_analysis = self._analyze_learning_efficiency(user_history)
            
            return {
                "time_analysis": time_analysis,
                "difficulty_analysis": difficulty_analysis,
                "persistence_analysis": persistence_analysis,
                "improvement_trend": improvement_trend,
                "efficiency_analysis": efficiency_analysis
            }
            
        except Exception as e:
            self.logger.error(f"종합 분석 실패: {str(e)}")
            return {}
    
    def _analyze_time_patterns(self, user_history: List[Dict[str, Any]]) -> Dict[str, Any]:
        """시간 패턴을 분석합니다."""
        if not user_history:
            return {"average_time": 0, "time_distribution": {}}
        
        times = [h.get("time_spent", 0) for h in user_history]
        
        # 시간 분포 분석
        time_ranges = {
            "빠름 (0-30초)": len([t for t in times if t <= 30]),
            "보통 (31-60초)": len([t for t in times if 31 <= t <= 60]),
            "느림 (61초 이상)": len([t for t in times if t > 60])
        }
        
        return {
            "average_time": np.mean(times),
            "median_time": np.median(times),
            "time_distribution": time_ranges,
            "fastest_time": min(times),
            "slowest_time": max(times)
        }
    
    def _analyze_accuracy_patterns(self, user_history: List[Dict[str, Any]]) -> Dict[str, Any]:
        """정확도 패턴을 분석합니다."""
        if not user_history:
            return {"overall_accuracy": 0, "accuracy_trend": []}
        
        # 전체 정확도
        correct_count = sum(1 for h in user_history if h.get("is_correct", False))
        total_count = len(user_history)
        overall_accuracy = correct_count / total_count if total_count > 0 else 0
        
        # 최근 10개 문제의 정확도 추세
        recent_history = user_history[-10:] if len(user_history) >= 10 else user_history
        accuracy_trend = []
        
        for i in range(len(recent_history)):
            window = recent_history[:i+1]
            window_accuracy = sum(1 for h in window if h.get("is_correct", False)) / len(window)
            accuracy_trend.append(window_accuracy)
        
        return {
            "overall_accuracy": overall_accuracy,
            "accuracy_trend": accuracy_trend,
            "correct_count": correct_count,
            "total_count": total_count,
            "recent_accuracy": accuracy_trend[-1] if accuracy_trend else 0
        }
    
    def _analyze_type_patterns(self, user_history: List[Dict[str, Any]]) -> Dict[str, Any]:
        """문제 유형별 패턴을 분석합니다."""
        if not user_history:
            return {"type_preferences": {}, "type_performance": {}}
        
        type_stats = defaultdict(lambda: {"attempts": 0, "correct": 0, "total_time": 0})
        
        for record in user_history:
            question_type = record.get("question_type", "UNKNOWN")
            type_stats[question_type]["attempts"] += 1
            if record.get("is_correct", False):
                type_stats[question_type]["correct"] += 1
            type_stats[question_type]["total_time"] += record.get("time_spent", 0)
        
        # 유형별 성과 계산
        type_performance = {}
        for question_type, stats in type_stats.items():
            accuracy = stats["correct"] / stats["attempts"] if stats["attempts"] > 0 else 0
            avg_time = stats["total_time"] / stats["attempts"] if stats["attempts"] > 0 else 0
            
            type_performance[question_type] = {
                "accuracy": accuracy,
                "average_time": avg_time,
                "attempts": stats["attempts"],
                "correct": stats["correct"]
            }
        
        # 선호도 계산 (시도 횟수 기반)
        total_attempts = sum(stats["attempts"] for stats in type_stats.values())
        type_preferences = {}
        for question_type, stats in type_stats.items():
            preference = stats["attempts"] / total_attempts if total_attempts > 0 else 0
            type_preferences[question_type] = preference
        
        return {
            "type_preferences": type_preferences,
            "type_performance": type_performance
        }
    
    def _analyze_learning_style(self, user_history: List[Dict[str, Any]]) -> str:
        """학습 스타일을 분석합니다."""
        if not user_history:
            return "분석 불가"
        
        times = [h.get("time_spent", 0) for h in user_history]
        accuracies = [h.get("is_correct", False) for h in user_history]
        
        avg_time = np.mean(times)
        avg_accuracy = np.mean(accuracies)
        
        # 학습 스타일 분류
        if avg_time < 30 and avg_accuracy > 0.8:
            return "직관적 학습자"
        elif avg_time > 60 and avg_accuracy > 0.7:
            return "분석적 학습자"
        elif avg_accuracy < 0.5:
            return "기초 학습자"
        else:
            return "균형잡힌 학습자"
    
    def _analyze_time_distribution(self, user_history: List[Dict[str, Any]]) -> Dict[str, Any]:
        """시간 분포를 분석합니다."""
        if not user_history:
            return {"peak_hours": [], "study_duration": 0}
        
        # 시간대별 분석 (실제로는 timestamp가 필요)
        # 여기서는 간단한 분석만 수행
        return {
            "peak_hours": ["오전", "오후"],  # 기본값
            "study_duration": len(user_history) * 5,  # 추정치
            "session_frequency": len(user_history) / max(1, len(set([h.get("date", "2024-01-01") for h in user_history])))
        }
    
    def _analyze_difficulty_preference(self, user_history: List[Dict[str, Any]]) -> Dict[str, Any]:
        """난이도 선호도를 분석합니다."""
        if not user_history:
            return {"preferred_difficulty": 1, "difficulty_range": [1, 1]}
        
        difficulties = [h.get("difficulty", 1) for h in user_history]
        
        return {
            "preferred_difficulty": int(np.mean(difficulties)),
            "difficulty_range": [min(difficulties), max(difficulties)],
            "difficulty_distribution": {
                "초급": len([d for d in difficulties if d == 1]),
                "중급": len([d for d in difficulties if d == 2]),
                "고급": len([d for d in difficulties if d == 3])
            }
        }
    
    def _analyze_learning_persistence(self, user_history: List[Dict[str, Any]]) -> Dict[str, Any]:
        """학습 지속성을 분석합니다."""
        if not user_history:
            return {"persistence_score": 0, "consistency": "낮음"}
        
        # 연속 학습 일수 계산 (간단한 구현)
        total_attempts = len(user_history)
        persistence_score = min(total_attempts / 10, 1.0)  # 10문제당 0.1점
        
        if persistence_score >= 0.8:
            consistency = "높음"
        elif persistence_score >= 0.5:
            consistency = "보통"
        else:
            consistency = "낮음"
        
        return {
            "persistence_score": persistence_score,
            "consistency": consistency,
            "total_attempts": total_attempts
        }
    
    def _analyze_improvement_trend(self, user_history: List[Dict[str, Any]]) -> Dict[str, Any]:
        """개선 추세를 분석합니다."""
        if len(user_history) < 10:
            return {"trend": "데이터 부족", "improvement_rate": 0}
        
        mid_point = len(user_history) // 2
        first_half = user_history[:mid_point]
        second_half = user_history[mid_point:]
        
        first_accuracy = sum(1 for h in first_half if h.get("is_correct", False)) / len(first_half)
        second_accuracy = sum(1 for h in second_half if h.get("is_correct", False)) / len(second_half)
        
        improvement_rate = second_accuracy - first_accuracy
        
        if improvement_rate > 0.1:
            trend = "상승"
        elif improvement_rate < -0.1:
            trend = "하락"
        else:
            trend = "안정"
        
        return {
            "trend": trend,
            "improvement_rate": improvement_rate,
            "first_half_accuracy": first_accuracy,
            "second_half_accuracy": second_accuracy
        }
    
    def _analyze_learning_efficiency(self, user_history: List[Dict[str, Any]]) -> Dict[str, Any]:
        """학습 효율성을 분석합니다."""
        if not user_history:
            return {"efficiency_score": 0, "efficiency_level": "낮음"}
        
        correct_count = sum(1 for h in user_history if h.get("is_correct", False))
        total_time = sum(h.get("time_spent", 0) for h in user_history)
        
        if total_time > 0:
            efficiency_score = (correct_count / len(user_history)) / (total_time / 60)  # 정확도/시간(분)
        else:
            efficiency_score = 0
        
        if efficiency_score > 0.02:
            efficiency_level = "높음"
        elif efficiency_score > 0.01:
            efficiency_level = "보통"
        else:
            efficiency_level = "낮음"
        
        return {
            "efficiency_score": efficiency_score,
            "efficiency_level": efficiency_level,
            "correct_per_minute": efficiency_score
        }
    
    def _determine_overall_pattern(
        self, 
        time_patterns: Dict[str, Any], 
        accuracy_patterns: Dict[str, Any]
    ) -> str:
        """전체 패턴을 결정합니다."""
        avg_time = time_patterns.get("average_time", 0)
        accuracy = accuracy_patterns.get("overall_accuracy", 0)
        
        if avg_time < 30 and accuracy > 0.8:
            return "고효율 학습자"
        elif avg_time > 60 and accuracy > 0.7:
            return "신중한 학습자"
        elif accuracy < 0.5:
            return "기초 학습자"
        else:
            return "균형잡힌 학습자"
    
    def _generate_pattern_recommendations(
        self, 
        time_patterns: Dict[str, Any], 
        accuracy_patterns: Dict[str, Any],
        learning_style: str
    ) -> List[str]:
        """패턴 기반 추천을 생성합니다."""
        recommendations = []
        
        avg_time = time_patterns.get("average_time", 0)
        accuracy = accuracy_patterns.get("overall_accuracy", 0)
        
        if avg_time < 20:
            recommendations.append("문제를 더 천천히 풀어보세요. 정확도가 중요합니다.")
        
        if avg_time > 90:
            recommendations.append("시간 효율성을 높이기 위해 빠른 판단을 연습해보세요.")
        
        if accuracy < 0.6:
            recommendations.append("기본 개념을 다시 복습해보세요.")
        
        if learning_style == "기초 학습자":
            recommendations.append("단계별로 차근차근 학습해보세요.")
        elif learning_style == "직관적 학습자":
            recommendations.append("이론적 배경도 함께 학습해보세요.")
        
        return recommendations
    
    def _generate_empty_analysis(self, user_id: int) -> Dict[str, Any]:
        """빈 분석 결과를 생성합니다."""
        return {
            "user_id": user_id,
            "analysis": "데이터 부족",
            "learning_pattern": "분석 불가",
            "time_patterns": {"average_time": 0},
            "difficulty_preference": {"preference": "기본"},
            "improvement_rate": 0.0,
            "learning_efficiency": 0.0,
            "analysis_confidence": 0.0
        }
    
    def _generate_fallback_analysis(self, user_id: int) -> Dict[str, Any]:
        """기본 분석 결과를 생성합니다."""
        return {
            "user_id": user_id,
            "analysis": "분석 실패",
            "learning_pattern": "분석 불가",
            "time_patterns": {"average_time": 0},
            "difficulty_preference": {"preference": "기본"},
            "improvement_rate": 0.0,
            "learning_efficiency": 0.0,
            "analysis_confidence": 0.0
        } 