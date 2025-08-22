from fastapi import APIRouter
from app.api.v1.endpoints import corpus, ai_model

api_router = APIRouter()

# 코퍼스 관련 엔드포인트
api_router.include_router(
    corpus.router,
    prefix="/corpus",
    tags=["corpus"]
)

# AI 모델 관련 엔드포인트
api_router.include_router(
    ai_model.router,
    prefix="/ai-model",
    tags=["ai-model"]
)
