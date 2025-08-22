from fastapi import APIRouter, HTTPException, Query, UploadFile, File, BackgroundTasks
from fastapi.responses import FileResponse
from typing import List, Optional, Dict, Any
import logging
import os
from pathlib import Path

from app.services.corpus_processor import CorpusProcessor
from app.core.config import settings

logger = logging.getLogger(__name__)
router = APIRouter()

# 코퍼스 프로세서 인스턴스
corpus_processor = CorpusProcessor(settings.WHEN_IN_ROME_CORPUS_PATH)

@router.get("/scan")
async def scan_corpus():
    """코퍼스 스캔 및 데이터 로드"""
    try:
        result = corpus_processor.scan_corpus()
        if result["success"]:
            return result
        else:
            raise HTTPException(status_code=500, detail=result["message"])
    except Exception as e:
        logger.error(f"코퍼스 스캔 실패: {e}")
        raise HTTPException(status_code=500, detail=f"코퍼스 스캔 실패: {str(e)}")

@router.get("/items")
async def get_corpus_items(
    genre: Optional[str] = Query(None, description="장르로 필터링"),
    composer: Optional[str] = Query(None, description="작곡가로 필터링"),
    page: int = Query(1, ge=1, description="페이지 번호"),
    size: int = Query(50, ge=1, le=100, description="페이지 크기")
):
    """코퍼스 아이템 조회 (필터링 및 페이징 지원)"""
    try:
        result = corpus_processor.get_corpus_items(genre, composer)
        if not result["success"]:
            raise HTTPException(status_code=500, detail=result["message"])
        
        items = result["items"]
        total = result["total"]
        
        # 페이징 적용
        start_idx = (page - 1) * size
        end_idx = start_idx + size
        paginated_items = items[start_idx:end_idx]
        
        return {
            "items": paginated_items,
            "total": total,
            "page": page,
            "size": size,
            "total_pages": (total + size - 1) // size
        }
    except Exception as e:
        logger.error(f"코퍼스 아이템 조회 실패: {e}")
        raise HTTPException(status_code=500, detail=f"코퍼스 아이템 조회 실패: {str(e)}")

@router.get("/statistics")
async def get_corpus_statistics():
    """코퍼스 통계 정보 조회"""
    try:
        result = corpus_processor.get_corpus_statistics()
        if result["success"]:
            return result["statistics"]
        else:
            raise HTTPException(status_code=500, detail=result["message"])
    except Exception as e:
        logger.error(f"통계 정보 조회 실패: {e}")
        raise HTTPException(status_code=500, detail=f"통계 정보 조회 실패: {str(e)}")

@router.get("/process-score/{score_path:path}")
async def process_score(score_path: str):
    """악보 파일 처리 및 화성 분석"""
    try:
        # 전체 경로 구성
        full_score_path = os.path.join(settings.WHEN_IN_ROME_CORPUS_PATH, score_path)
        
        if not os.path.exists(full_score_path):
            raise HTTPException(status_code=404, detail="악보 파일을 찾을 수 없습니다")
        
        result = corpus_processor.process_score(full_score_path)
        if result["success"]:
            return result
        else:
            raise HTTPException(status_code=400, detail=result["message"])
    except Exception as e:
        logger.error(f"악보 처리 실패: {e}")
        raise HTTPException(status_code=500, detail=f"악보 처리 실패: {str(e)}")

@router.get("/export")
async def export_corpus_data(
    format: str = Query("json", description="내보내기 형식 (json 또는 csv)")
):
    """코퍼스 데이터 내보내기"""
    try:
        if format not in ["json", "csv"]:
            raise HTTPException(status_code=400, detail="지원하지 않는 형식입니다. json 또는 csv를 사용하세요")
        
        result = corpus_processor.export_corpus_data(format)
        if result["success"]:
            return result
        else:
            raise HTTPException(status_code=500, detail=result["message"])
    except Exception as e:
        logger.error(f"데이터 내보내기 실패: {e}")
        raise HTTPException(status_code=500, detail=f"데이터 내보내기 실패: {str(e)}")

@router.get("/download/{format}")
async def download_corpus_data(format: str):
    """코퍼스 데이터 다운로드"""
    try:
        if format not in ["json", "csv"]:
            raise HTTPException(status_code=400, detail="지원하지 않는 형식입니다")
        
        # 파일 경로 생성
        filename = f"corpus_export_{format}"
        if format == "json":
            file_path = f"{filename}.json"
        else:
            file_path = f"{filename}.csv"
        
        # 파일이 존재하는지 확인
        if not os.path.exists(file_path):
            raise HTTPException(status_code=404, detail="내보내기 파일을 찾을 수 없습니다")
        
        return FileResponse(
            path=file_path,
            filename=f"corpus_export.{format}",
            media_type="application/octet-stream"
        )
    except Exception as e:
        logger.error(f"파일 다운로드 실패: {e}")
        raise HTTPException(status_code=500, detail=f"파일 다운로드 실패: {str(e)}")

@router.post("/upload")
async def upload_corpus_file(
    file: UploadFile = File(...),
    target_directory: str = Query(..., description="업로드할 대상 디렉토리")
):
    """새로운 코퍼스 파일 업로드"""
    try:
        # 파일 확장자 검증
        allowed_extensions = ['.mxl', '.xml', '.mid', '.midi', '.txt', '.rntxt']
        file_extension = Path(file.filename).suffix.lower()
        
        if file_extension not in allowed_extensions:
            raise HTTPException(
                status_code=400, 
                detail=f"지원하지 않는 파일 형식입니다. 허용된 형식: {', '.join(allowed_extensions)}"
            )
        
        # 대상 디렉토리 경로 구성
        target_path = os.path.join(settings.WHEN_IN_ROME_CORPUS_PATH, target_directory)
        
        # 디렉토리가 존재하지 않으면 생성
        os.makedirs(target_path, exist_ok=True)
        
        # 파일 저장
        file_path = os.path.join(target_path, file.filename)
        with open(file_path, "wb") as buffer:
            content = await file.read()
            buffer.write(content)
        
        logger.info(f"파일 업로드 완료: {file_path}")
        
        return {
            "success": True,
            "message": "파일 업로드 완료",
            "file_path": file_path,
            "file_size": len(content)
        }
    except Exception as e:
        logger.error(f"파일 업로드 실패: {e}")
        raise HTTPException(status_code=500, detail=f"파일 업로드 실패: {str(e)}")

@router.get("/search")
async def search_corpus(query: str = Query(..., description="검색어")):
    """코퍼스 검색"""
    try:
        if not query.strip():
            raise HTTPException(status_code=400, detail="검색어를 입력하세요")
        
        result = corpus_processor.search_corpus(query)
        if result["success"]:
            return result
        else:
            raise HTTPException(status_code=500, detail=result["message"])
    except Exception as e:
        logger.error(f"코퍼스 검색 실패: {e}")
        raise HTTPException(status_code=500, detail=f"코퍼스 검색 실패: {str(e)}")

@router.get("/genres")
async def get_genres():
    """사용 가능한 장르 목록 조회"""
    try:
        genres = corpus_processor.get_genres()
        return {"genres": genres, "total": len(genres)}
    except Exception as e:
        logger.error(f"장르 목록 조회 실패: {e}")
        raise HTTPException(status_code=500, detail=f"장르 목록 조회 실패: {str(e)}")

@router.get("/composers")
async def get_composers(genre: Optional[str] = Query(None, description="특정 장르의 작곡가만 조회")):
    """사용 가능한 작곡가 목록 조회"""
    try:
        composers = corpus_processor.get_composers(genre)
        return {"composers": composers, "total": len(composers), "filtered_by_genre": genre}
    except Exception as e:
        logger.error(f"작곡가 목록 조회 실패: {e}")
        raise HTTPException(status_code=500, detail=f"작곡가 목록 조회 실패: {str(e)}")
