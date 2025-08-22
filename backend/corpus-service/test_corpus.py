#!/usr/bin/env python3
"""
코퍼스 서비스 테스트 스크립트
"""

import asyncio
import logging
from pathlib import Path
import json

# 로깅 설정
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

async def test_corpus_service():
    """코퍼스 서비스 테스트"""
    
    # 테스트 데이터 디렉토리 생성
    test_corpus_dir = Path("data/corpus/when-in-rome")
    test_corpus_dir.mkdir(parents=True, exist_ok=True)
    
    # 테스트 코퍼스 구조 생성
    test_structure = {
        "classical": {
            "beethoven": {
                "piano_sonatas": {
                    "op27_no2": {
                        "score.mxl": "fake_score_data",
                        "analysis.txt": "I - V - I\nPerfect Cadence",
                        "analysis_automatic.rntxt": "I - V - I"
                    }
                }
            }
        },
        "jazz": {
            "miles_davis": {
                "kind_of_blue": {
                    "so_what": {
                        "score.mxl": "fake_jazz_score",
                        "analysis.txt": "Dm7 - G7 - Cmaj7\nii-V-I progression",
                        "analysis_automatic.rntxt": "ii7 - V7 - Imaj7"
                    }
                }
            }
        }
    }
    
    # 테스트 구조 생성
    for genre, composers in test_structure.items():
        genre_dir = test_corpus_dir / genre
        genre_dir.mkdir(exist_ok=True)
        
        for composer, sets in composers.items():
            composer_dir = genre_dir / composer
            composer_dir.mkdir(exist_ok=True)
            
            for set_name, movements in sets.items():
                set_dir = composer_dir / set_name
                set_dir.mkdir(exist_ok=True)
                
                for movement, files in movements.items():
                    movement_dir = set_dir / movement
                    movement_dir.mkdir(exist_ok=True)
                    
                    for filename, content in files.items():
                        file_path = movement_dir / filename
                        with open(file_path, 'w', encoding='utf-8') as f:
                            f.write(content)
    
    logger.info("테스트 코퍼스 구조 생성 완료")
    
    # 코퍼스 프로세서 테스트
    try:
        from app.services.corpus_processor import CorpusProcessor
        
        processor = CorpusProcessor(str(test_corpus_dir))
        
        # 코퍼스 스캔
        logger.info("코퍼스 스캔 테스트 시작...")
        corpus_items = processor.scan_corpus()
        logger.info(f"스캔된 아이템 수: {len(corpus_items)}")
        
        # 통계 정보
        stats = processor.get_statistics()
        logger.info(f"통계 정보: {json.dumps(stats, indent=2, ensure_ascii=False)}")
        
        # 데이터 내보내기 테스트
        logger.info("데이터 내보내기 테스트...")
        json_success = processor.export_to_json("data/corpus_test_export.json")
        csv_success = processor.export_to_csv("data/corpus_test_export.csv")
        
        logger.info(f"JSON 내보내기: {'성공' if json_success else '실패'}")
        logger.info(f"CSV 내보내기: {'성공' if csv_success else '실패'}")
        
        return True
        
    except Exception as e:
        logger.error(f"코퍼스 서비스 테스트 실패: {e}")
        return False

async def test_harmony_transformer():
    """Harmony Transformer 테스트"""
    
    try:
        from app.services.harmony_transformer import HarmonyTransformer
        
        # 모델 초기화 (실제 모델 다운로드는 하지 않음)
        transformer = HarmonyTransformer()
        logger.info("Harmony Transformer 초기화 성공")
        
        # 모델 정보
        model_info = transformer.get_model_info()
        logger.info(f"모델 정보: {model_info}")
        
        return True
        
    except Exception as e:
        logger.error(f"Harmony Transformer 테스트 실패: {e}")
        return False

async def main():
    """메인 테스트 함수"""
    logger.info("코퍼스 서비스 테스트 시작")
    
    # 코퍼스 서비스 테스트
    corpus_success = await test_corpus_service()
    
    # Harmony Transformer 테스트
    transformer_success = await test_harmony_transformer()
    
    # 결과 요약
    logger.info("=" * 50)
    logger.info("테스트 결과 요약")
    logger.info("=" * 50)
    logger.info(f"코퍼스 서비스: {'성공' if corpus_success else '실패'}")
    logger.info(f"Harmony Transformer: {'성공' if transformer_success else '실패'}")
    
    if corpus_success and transformer_success:
        logger.info("모든 테스트 통과!")
        return True
    else:
        logger.error("일부 테스트 실패")
        return False

if __name__ == "__main__":
    asyncio.run(main())
