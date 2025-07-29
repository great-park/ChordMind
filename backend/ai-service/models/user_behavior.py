from pydantic import BaseModel
from typing import List, Dict, Any, Optional
from datetime import datetime
from enum import Enum

class QuestionType(str, Enum):
    CHORD_NAME = "CHORD_NAME"
    PROGRESSION = "PROGRESSION"
    INTERVAL = "INTERVAL"
    SCALE = "SCALE"

class LearningStyle(str, Enum):
    INTUITIVE = "직관적 학습자"
    ANALYTICAL = "분석적 학습자"
    BASIC = "기초 학습자"
    BALANCED = "균형잡힌 학습자"

class UserBehavior(BaseModel):
    user_id: int
    question_type: QuestionType
    user_answer: str
    correct_answer: str
    is_correct: bool
    time_spent: int
    difficulty: int
    timestamp: datetime
    
    class Config:
        from_attributes = True

class BehaviorAnalysis(BaseModel):
    user_id: int
    total_attempts: int
    correct_answers: int
    accuracy: float
    average_time: float
    learning_style: LearningStyle
    improvement_rate: float
    time_patterns: Dict[str, Any]
    difficulty_preference: Dict[str, Any]
    learning_efficiency: float
    analysis_confidence: float
    
    class Config:
        from_attributes = True

class LearningPattern(BaseModel):
    pattern_type: str
    consistency_score: float
    efficiency_score: float
    improvement_trend: str
    recommendations: List[str]
    
    class Config:
        from_attributes = True 