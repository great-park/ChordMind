from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Dict, Any, Optional
import uvicorn
import os
from dotenv import load_dotenv

from ai_engine import AIEngine
from models.user_behavior import UserBehavior
from models.learning_analysis import LearningAnalysis
from services.personalized_feedback import PersonalizedFeedbackService
from services.adaptive_learning import AdaptiveLearningService
from services.smart_hints import SmartHintsService
from services.behavior_analysis import BehaviorAnalysisService
from database.database import DatabaseManager

load_dotenv()

def validate_environment_variables():
    """필수 환경 변수를 검증합니다."""
    required_vars = [
        'DB_HOST',
        'DB_USER', 
        'DB_PASSWORD',
        'HARMONY_SERVICE_URL'
    ]
    
    missing_vars = []
    for var in required_vars:
        if not os.getenv(var):
            missing_vars.append(var)
    
    if missing_vars:
        raise ValueError(f"필수 환경 변수가 설정되지 않았습니다: {', '.join(missing_vars)}")

# 환경 변수 검증
try:
    validate_environment_variables()
except ValueError as e:
    print(f"환경 변수 오류: {e}")
    print("env.example 파일을 참고하여 .env 파일을 생성하세요.")
    exit(1)

app = FastAPI(
    title="ChordMind AI Service",
    description="AI 기반 음악 이론 학습 분석 및 추천 서비스",
    version="1.0.0"
)

# CORS 설정
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 데이터베이스 매니저 초기화
db_manager = DatabaseManager()

# AI 엔진 초기화
ai_engine = AIEngine()

# 서비스 초기화 (DB 매니저 전달)
feedback_service = PersonalizedFeedbackService(ai_engine, db_manager)
adaptive_service = AdaptiveLearningService(ai_engine, db_manager)
hints_service = SmartHintsService(ai_engine, db_manager)
behavior_service = BehaviorAnalysisService(ai_engine, db_manager)

# Pydantic 모델들
class FeedbackRequest(BaseModel):
    user_id: int
    question_type: str
    user_answer: str
    correct_answer: str
    is_correct: bool
    time_spent: Optional[int] = None
    difficulty: Optional[int] = None

class AdaptiveQuestionRequest(BaseModel):
    user_id: int
    question_type: str
    count: int = 1

class SmartHintsRequest(BaseModel):
    user_id: int
    question_type: str
    difficulty: int
    show_detailed: bool = False

class LearningPathRequest(BaseModel):
    user_id: int
    include_weakest_areas: bool = True
    include_time_estimate: bool = True
    max_recommendations: int = 5

class BehaviorAnalysisRequest(BaseModel):
    user_id: int
    analysis_type: str = "comprehensive"

@app.get("/")
async def root():
    return {"message": "ChordMind AI Service", "version": "1.0.0"}

@app.get("/health")
async def health_check():
    return {
        "status": "healthy", 
        "ai_engine": ai_engine.is_ready(),
        "database": db_manager.connection is not None and not db_manager.connection.closed
    }

@app.post("/api/ai/personalized-feedback")
async def generate_personalized_feedback(request: FeedbackRequest):
    """개인화된 피드백 생성"""
    try:
        feedback = await feedback_service.generate_feedback(
            user_id=request.user_id,
            question_type=request.question_type,
            user_answer=request.user_answer,
            correct_answer=request.correct_answer,
            is_correct=request.is_correct,
            time_spent=request.time_spent,
            difficulty=request.difficulty
        )
        return feedback
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"피드백 생성 실패: {str(e)}")

@app.post("/api/ai/adaptive-question")
async def generate_adaptive_question(request: AdaptiveQuestionRequest):
    """적응형 문제 생성"""
    try:
        questions = await adaptive_service.generate_questions(
            user_id=request.user_id,
            question_type=request.question_type,
            count=request.count
        )
        return {"questions": questions}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"적응형 문제 생성 실패: {str(e)}")

@app.post("/api/ai/smart-hints")
async def generate_smart_hints(request: SmartHintsRequest):
    """스마트 힌트 생성"""
    try:
        hints = await hints_service.generate_hints(
            user_id=request.user_id,
            question_type=request.question_type,
            difficulty=request.difficulty,
            show_detailed=request.show_detailed
        )
        return hints
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"스마트 힌트 생성 실패: {str(e)}")

@app.get("/api/ai/learning-path/{user_id}")
async def generate_learning_path(user_id: int, request: LearningPathRequest):
    """개인화된 학습 경로 생성"""
    try:
        learning_path = await adaptive_service.generate_learning_path(
            user_id=user_id,
            include_weakest_areas=request.include_weakest_areas,
            include_time_estimate=request.include_time_estimate,
            max_recommendations=request.max_recommendations
        )
        return learning_path
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"학습 경로 생성 실패: {str(e)}")

@app.get("/api/ai/behavior-analysis/{user_id}")
async def analyze_user_behavior(user_id: int, request: BehaviorAnalysisRequest):
    """사용자 행동 분석"""
    try:
        analysis = await behavior_service.analyze_behavior(
            user_id=user_id,
            analysis_type=request.analysis_type
        )
        return analysis
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"행동 분석 실패: {str(e)}")

@app.get("/api/ai/learning-recommendations/{user_id}")
async def generate_learning_recommendations(user_id: int):
    """학습 추천 생성"""
    try:
        recommendations = await adaptive_service.generate_recommendations(user_id)
        return {"recommendations": recommendations}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"학습 추천 생성 실패: {str(e)}")

@app.post("/api/ai/analyze-learning-patterns/{user_id}")
async def analyze_learning_patterns(user_id: int):
    """학습 패턴 분석"""
    try:
        patterns = await behavior_service.analyze_learning_patterns(user_id)
        return patterns
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"학습 패턴 분석 실패: {str(e)}")

@app.get("/api/ai/feedback-history/{user_id}")
async def get_feedback_history(user_id: int, limit: int = 10):
    """사용자 피드백 히스토리 조회"""
    try:
        history = await feedback_service.get_feedback_history(user_id, limit)
        return {"feedback_history": history}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"피드백 히스토리 조회 실패: {str(e)}")

@app.get("/api/ai/performance-stats/{user_id}")
async def get_performance_stats(user_id: int):
    """사용자 성과 통계 조회"""
    try:
        stats = db_manager.get_user_performance_stats(user_id)
        return stats
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"성과 통계 조회 실패: {str(e)}")

if __name__ == "__main__":
    port = int(os.getenv("PORT", 8082))
    host = os.getenv("HOST", "0.0.0.0")
    
    uvicorn.run(
        "main:app",
        host=host,
        port=port,
        reload=True
    ) 