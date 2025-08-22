import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import logging
import os
from pathlib import Path

from app.core.config import settings
from app.core.logging import setup_logging
from app.api.v1.api import api_router

# 로깅 설정
setup_logging()

# FastAPI 앱 생성
app = FastAPI(
    title=settings.APP_NAME,
    debug=settings.DEBUG,
    version="1.0.0"
)

# CORS 미들웨어 설정
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# API 라우터 포함
app.include_router(api_router, prefix="/api/v1")

@app.get("/")
async def root():
    """루트 엔드포인트"""
    return {
        "message": "ChordMind Corpus Service",
        "version": "1.0.0",
        "status": "running"
    }

@app.get("/health")
async def health_check():
    """헬스 체크 엔드포인트"""
    return {
        "status": "healthy",
        "service": "corpus-service"
    }

@app.on_event("startup")
async def startup_event():
    """애플리케이션 시작 시 실행되는 이벤트"""
    logger = logging.getLogger(__name__)
    logger.info("ChordMind Corpus Service 시작 중...")
    
    # When-in-Rome 코퍼스 경로 확인
    corpus_path = Path(settings.WHEN_IN_ROME_CORPUS_PATH)
    if not corpus_path.exists():
        logger.warning(f"When-in-Rome 코퍼스 경로가 존재하지 않습니다: {corpus_path}")
        logger.info("코퍼스 데이터가 없어도 서비스는 시작됩니다.")
    else:
        logger.info(f"When-in-Rome 코퍼스 경로 확인됨: {corpus_path}")
    
    # 필요한 디렉토리 생성
    os.makedirs(settings.AI_MODEL_CACHE_DIR, exist_ok=True)
    os.makedirs(settings.AI_MODEL_TRAINING_DIR, exist_ok=True)
    os.makedirs(settings.AI_MODEL_OUTPUT_DIR, exist_ok=True)
    
    logger.info("ChordMind Corpus Service 시작 완료")

@app.on_event("shutdown")
async def shutdown_event():
    """애플리케이션 종료 시 실행되는 이벤트"""
    logger = logging.getLogger(__name__)
    logger.info("ChordMind Corpus Service 종료 중...")

if __name__ == "__main__":
    uvicorn.run(
        "main:app",
        host=settings.SERVER_HOST,
        port=settings.SERVER_PORT,
        reload=settings.DEBUG,
        log_level=settings.LOG_LEVEL.lower()
    )
