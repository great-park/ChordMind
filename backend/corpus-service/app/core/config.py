from pydantic_settings import BaseSettings
from typing import List, Optional
import os

class Settings(BaseSettings):
    # 기본 앱 설정
    APP_NAME: str = "ChordMind Corpus Service"
    DEBUG: bool = False
    SERVER_HOST: str = "0.0.0.0"
    SERVER_PORT: int = 8000
    
    # When-in-Rome 코퍼스 설정
    WHEN_IN_ROME_CORPUS_PATH: str = "../When-in-Rome/Corpus"
    
    # AI 모델 설정
    AI_MODEL_CACHE_DIR: str = "models/cache"
    AI_MODEL_TRAINING_DIR: str = "models/training"
    AI_MODEL_OUTPUT_DIR: str = "models/output"
    
    # Harmony Transformer 설정
    HT_MODEL_NAME: str = "microsoft/DialoGPT-medium"  # 기본 모델
    HT_MAX_LENGTH: int = 512
    HT_BATCH_SIZE: int = 8
    HT_LEARNING_RATE: float = 5e-5
    HT_EPOCHS: int = 3
    
    # 로깅 설정
    LOG_LEVEL: str = "INFO"
    LOG_FILE: str = "logs/corpus_service.log"
    
    # CORS 설정
    CORS_ORIGINS: List[str] = [
        "http://localhost:3000",
        "http://localhost:3001",
        "http://127.0.0.1:3000",
        "http://127.0.0.1:3001"
    ]
    
    # 파일 업로드 설정
    MAX_FILE_SIZE: int = 50 * 1024 * 1024  # 50MB
    ALLOWED_EXTENSIONS: List[str] = ['.mxl', '.xml', '.mid', '.midi', '.txt', '.rntxt']
    
    class Config:
        env_file = ".env"
        case_sensitive = True

# 설정 인스턴스 생성
settings = Settings()

# 필요한 디렉토리 생성
os.makedirs(settings.AI_MODEL_CACHE_DIR, exist_ok=True)
os.makedirs(settings.AI_MODEL_TRAINING_DIR, exist_ok=True)
os.makedirs(settings.AI_MODEL_OUTPUT_DIR, exist_ok=True)
os.makedirs(os.path.dirname(settings.LOG_FILE), exist_ok=True)
