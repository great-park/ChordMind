from pydantic import BaseModel
from typing import List, Dict, Any, Optional
from datetime import datetime
from enum import Enum

class DifficultyLevel(str, Enum):
    BEGINNER = "초급"
    INTERMEDIATE = "중급"
    ADVANCED = "고급"
    EXPERT = "전문가"

class LearningGoal(BaseModel):
    goal_id: str
    title: str
    description: str
    target_accuracy: float
    estimated_time: int  # 분 단위
    priority: int  # 1-5, 높을수록 우선순위 높음
    prerequisites: List[str]
    
    class Config:
        from_attributes = True

class LearningStep(BaseModel):
    step_id: str
    goal_id: str
    title: str
    description: str
    difficulty: DifficultyLevel
    estimated_time: int  # 분 단위
    order: int
    dependencies: List[str]
    
    class Config:
        from_attributes = True

class LearningPath(BaseModel):
    user_id: int
    learning_goals: List[LearningGoal]
    learning_steps: List[LearningStep]
    estimated_total_time: int  # 분 단위
    difficulty_progression: List[Dict[str, Any]]
    personalized_recommendations: List[str]
    confidence_score: float
    generated_at: datetime
    
    class Config:
        from_attributes = True

class WeakestArea(BaseModel):
    question_type: str
    attempts: int
    correct: int
    accuracy: float
    priority: int  # 1-5, 높을수록 우선순위 높음
    recommended_focus_time: int  # 분 단위
    
    class Config:
        from_attributes = True

class LearningRecommendation(BaseModel):
    recommendation_id: str
    title: str
    description: str
    priority: int
    estimated_time: int
    difficulty: DifficultyLevel
    learning_style: str
    target_areas: List[str]
    
    class Config:
        from_attributes = True 