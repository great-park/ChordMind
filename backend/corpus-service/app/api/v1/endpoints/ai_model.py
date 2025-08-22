from fastapi import APIRouter, HTTPException, BackgroundTasks, Query
from typing import Dict, Any, Optional
import logging
import os
from pathlib import Path

from app.services.harmony_transformer import HarmonyTransformer
from app.services.corpus_processor import CorpusProcessor
from app.core.config import settings

logger = logging.getLogger(__name__)
router = APIRouter()

# 서비스 인스턴스들
try:
    harmony_transformer = HarmonyTransformer()
    logger.info("Harmony Transformer 초기화 성공")
except ImportError as e:
    logger.warning(f"PyTorch 및 Transformers가 설치되지 않았습니다. AI 모델 기능이 제한됩니다: {e}")
    harmony_transformer = None

corpus_processor = CorpusProcessor(settings.WHEN_IN_ROME_CORPUS_PATH)

@router.get("/load-model")
async def load_ai_model():
    """AI 모델 로드"""
    try:
        if not harmony_transformer:
            raise HTTPException(
                status_code=501, 
                detail="PyTorch 및 Transformers가 설치되지 않아 AI 모델 기능을 사용할 수 없습니다"
            )
        
        result = harmony_transformer.load_model()
        return {
            "success": True,
            "message": "AI 모델 로드 완료",
            "model_info": result
        }
    except Exception as e:
        logger.error(f"AI 모델 로드 실패: {e}")
        raise HTTPException(status_code=500, detail=f"AI 모델 로드 실패: {str(e)}")

@router.get("/model-info")
async def get_model_info():
    """AI 모델 정보 조회"""
    try:
        if not harmony_transformer:
            raise HTTPException(
                status_code=501, 
                detail="PyTorch 및 Transformers가 설치되지 않아 AI 모델 기능을 사용할 수 없습니다"
            )
        
        model_info = harmony_transformer.get_model_info()
        return {
            "success": True,
            "model_info": model_info
        }
    except Exception as e:
        logger.error(f"모델 정보 조회 실패: {e}")
        raise HTTPException(status_code=500, detail=f"모델 정보 조회 실패: {str(e)}")

@router.post("/prepare-training-data")
async def prepare_training_data():
    """AI 모델 학습 데이터 준비"""
    try:
        if not harmony_transformer:
            raise HTTPException(
                status_code=501, 
                detail="PyTorch 및 Transformers가 설치되지 않아 AI 모델 기능을 사용할 수 없습니다"
            )
        
        # 코퍼스 데이터를 학습용으로 변환
        training_data = harmony_transformer.prepare_training_data(corpus_processor.corpus_items)
        
        return {
            "success": True,
            "message": "학습 데이터 준비 완료",
            "training_data_info": training_data
        }
    except Exception as e:
        logger.error(f"학습 데이터 준비 실패: {e}")
        raise HTTPException(status_code=500, detail=f"학습 데이터 준비 실패: {str(e)}")

@router.post("/start-training")
async def start_model_training(background_tasks: BackgroundTasks):
    """AI 모델 파인튜닝 시작"""
    try:
        if not harmony_transformer:
            raise HTTPException(
                status_code=501, 
                detail="PyTorch 및 Transformers가 설치되지 않아 AI 모델 기능을 사용할 수 없습니다"
            )
        
        # 백그라운드에서 학습 시작
        background_tasks.add_task(harmony_transformer.start_training)
        
        return {
            "success": True,
            "message": "AI 모델 파인튜닝이 백그라운드에서 시작되었습니다"
        }
    except Exception as e:
        logger.error(f"모델 학습 시작 실패: {e}")
        raise HTTPException(status_code=500, detail=f"모델 학습 시작 실패: {str(e)}")

@router.get("/training-status")
async def get_training_status():
    """AI 모델 학습 상태 조회"""
    try:
        if not harmony_transformer:
            raise HTTPException(
                status_code=501, 
                detail="PyTorch 및 Transformers가 설치되지 않아 AI 모델 기능을 사용할 수 없습니다"
            )
        
        status = harmony_transformer.get_training_status()
        return {
            "success": True,
            "training_status": status
        }
    except Exception as e:
        logger.error(f"학습 상태 조회 실패: {e}")
        raise HTTPException(status_code=500, detail=f"학습 상태 조회 실패: {str(e)}")

@router.post("/generate-harmony-suggestion")
async def generate_harmony_suggestion(
    context: str = Query(..., description="화성 진행 컨텍스트"),
    style: str = Query("classical", description="음악 스타일"),
    length: int = Query(4, description="제안할 화성 진행 길이")
):
    """화성 진행 제안 생성"""
    try:
        if not harmony_transformer:
            raise HTTPException(
                status_code=501, 
                detail="PyTorch 및 Transformers가 설치되지 않아 AI 모델 기능을 사용할 수 없습니다"
            )
        
        suggestions = harmony_transformer.generate_harmony_suggestions(context, style, length)
        
        return {
            "success": True,
            "suggestions": suggestions
        }
    except Exception as e:
        logger.error(f"화성 진행 제안 생성 실패: {e}")
        raise HTTPException(status_code=500, detail=f"화성 진행 제안 생성 실패: {str(e)}")

@router.post("/analyze-harmony-progression")
async def analyze_harmony_progression(
    progression: str = Query(..., description="분석할 화성 진행")
):
    """화성 진행 분석"""
    try:
        if not harmony_transformer:
            raise HTTPException(
                status_code=501, 
                detail="PyTorch 및 Transformers가 설치되지 않아 AI 모델 기능을 사용할 수 없습니다"
            )
        
        analysis = harmony_transformer.analyze_harmony_progression(progression)
        
        return {
            "success": True,
            "analysis": analysis
        }
    except Exception as e:
        logger.error(f"화성 진행 분석 실패: {e}")
        raise HTTPException(status_code=500, detail=f"화성 진행 분석 실패: {str(e)}")

@router.get("/available-models")
async def get_available_models():
    """사용 가능한 AI 모델 목록"""
    try:
        if not harmony_transformer:
            raise HTTPException(
                status_code=501, 
                detail="PyTorch 및 Transformers가 설치되지 않아 AI 모델 기능을 사용할 수 없습니다"
            )
        
        models = harmony_transformer.get_available_models()
        return {
            "success": True,
            "available_models": models
        }
    except Exception as e:
        logger.error(f"사용 가능한 모델 목록 조회 실패: {e}")
        raise HTTPException(status_code=500, detail=f"사용 가능한 모델 목록 조회 실패: {str(e)}")

@router.post("/save-model")
async def save_current_model():
    """현재 AI 모델 저장"""
    try:
        if not harmony_transformer:
            raise HTTPException(
                status_code=501, 
                detail="PyTorch 및 Transformers가 설치되지 않아 AI 모델 기능을 사용할 수 없습니다"
            )
        
        result = harmony_transformer.save_model()
        return {
            "success": True,
            "message": "모델 저장 완료",
            "save_path": result
        }
    except Exception as e:
        logger.error(f"모델 저장 실패: {e}")
        raise HTTPException(status_code=500, detail=f"모델 저장 실패: {str(e)}")

@router.post("/batch-harmony-analysis")
async def batch_harmony_analysis(
    background_tasks: BackgroundTasks,
    corpus_items: Optional[list] = None
):
    """배치 화성 분석 수행"""
    try:
        if not harmony_transformer:
            raise HTTPException(
                status_code=501, 
                detail="PyTorch 및 Transformers가 설치되지 않아 AI 모델 기능을 사용할 수 없습니다"
            )
        
        # 백그라운드에서 배치 분석 수행
        background_tasks.add_task(harmony_transformer.batch_analysis, corpus_items)
        
        return {
            "success": True,
            "message": "배치 화성 분석이 백그라운드에서 시작되었습니다"
        }
    except Exception as e:
        logger.error(f"배치 화성 분석 시작 실패: {e}")
        raise HTTPException(status_code=500, detail=f"배치 화성 분석 시작 실패: {str(e)}")
