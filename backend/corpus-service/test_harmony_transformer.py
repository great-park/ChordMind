#!/usr/bin/env python3
"""
Harmony Transformer 서비스 테스트 스크립트
"""

import sys
import os
from pathlib import Path

# 프로젝트 루트를 Python 경로에 추가
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from app.services.harmony_transformer import HarmonyTransformerService
from app.services.corpus_processor import CorpusProcessor
from app.core.config import settings

def test_harmony_transformer():
    """Harmony Transformer 서비스 테스트"""
    print("=== Harmony Transformer 서비스 테스트 시작 ===")
    
    # 서비스 초기화
    try:
        harmony_service = HarmonyTransformerService()
        print("✅ Harmony Transformer 서비스 초기화 성공")
    except Exception as e:
        print(f"❌ Harmony Transformer 서비스 초기화 실패: {e}")
        return False
    
    # 모델 로드 테스트
    try:
        print("\n모델 로드 중...")
        model_info = harmony_service.load_model()
        print(f"✅ 모델 로드 성공:")
        print(f"  - 모델명: {model_info['model_name']}")
        print(f"  - 디바이스: {model_info['device']}")
        print(f"  - 총 파라미터: {model_info['total_params']:,}")
        print(f"  - 학습 가능 파라미터: {model_info['trainable_params']:,}")
    except Exception as e:
        print(f"❌ 모델 로드 실패: {e}")
        return False
    
    # 코퍼스 데이터 준비 테스트
    try:
        print("\n코퍼스 데이터 준비 중...")
        corpus_processor = CorpusProcessor(settings.WHEN_IN_ROME_CORPUS_PATH)
        
        # 코퍼스 스캔
        scan_result = corpus_processor.scan_corpus()
        if not scan_result["success"]:
            raise Exception(scan_result["message"])
        
        corpus_items = corpus_processor.corpus_items
        print(f"✅ 코퍼스 데이터 로드 완료: {len(corpus_items)}개 아이템")
        
        # 학습 데이터 준비
        training_data = harmony_service.prepare_training_data(corpus_items)
        print(f"✅ 학습 데이터 준비 완료:")
        print(f"  - 총 예시: {training_data['total_examples']}")
        print(f"  - 특성: {training_data['features']}")
        
    except Exception as e:
        print(f"❌ 코퍼스 데이터 준비 실패: {e}")
        return False
    
    # 화성 진행 제안 생성 테스트
    try:
        print("\n화성 진행 제안 생성 테스트...")
        context = "m1 C:I | m2 G:V"
        suggestions = harmony_service.generate_harmony_suggestions(context, "classical", 2)
        
        print(f"✅ 화성 진행 제안 생성 성공:")
        for i, suggestion in enumerate(suggestions):
            print(f"  제안 {i+1}:")
            print(f"    - 진행: {suggestion['progression']}")
            print(f"    - 확신도: {suggestion['confidence']}")
            print(f"    - 스타일: {suggestion['style']}")
            print(f"    - 설명: {suggestion['explanation']}")
        
    except Exception as e:
        print(f"❌ 화성 진행 제안 생성 실패: {e}")
        return False
    
    # 화성 진행 분석 테스트
    try:
        print("\n화성 진행 분석 테스트...")
        progression = "m1 C:I | m2 G:V | m3 C:I"
        analysis = harmony_service.analyze_harmony_progression(progression)
        
        print(f"✅ 화성 진행 분석 성공:")
        print(f"  - 진행: {analysis['progression']}")
        print(f"  - 화성 기능: {analysis['functions']}")
        print(f"  - 종지 패턴: {analysis['cadence_patterns']}")
        print(f"  - 전조 분석: {analysis['modulation_analysis']}")
        print(f"  - 복잡도 점수: {analysis['complexity_score']:.2f}")
        
    except Exception as e:
        print(f"❌ 화성 진행 분석 실패: {e}")
        return False
    
    # 모델 정보 조회 테스트
    try:
        print("\n모델 정보 조회 테스트...")
        model_info = harmony_service.get_model_info()
        
        print(f"✅ 모델 정보 조회 성공:")
        print(f"  - 모델명: {model_info['model_name']}")
        print(f"  - 디바이스: {model_info['device']}")
        print(f"  - 모델 타입: {model_info['model_type']}")
        print(f"  - 총 파라미터: {model_info['total_params']:,}")
        print(f"  - 학습 가능 파라미터: {model_info['trainable_params']:,}")
        
    except Exception as e:
        print(f"❌ 모델 정보 조회 실패: {e}")
        return False
    
    # 사용 가능한 모델 목록 테스트
    try:
        print("\n사용 가능한 모델 목록 조회 테스트...")
        available_models = harmony_service.get_available_models()
        
        print(f"✅ 사용 가능한 모델 목록 조회 성공:")
        if available_models:
            for model in available_models:
                print(f"  - {model['name']} ({model['type']})")
                print(f"    경로: {model['path']}")
                print(f"    파일: {model['files']}")
        else:
            print("  - 사용 가능한 모델이 없습니다")
        
    except Exception as e:
        print(f"❌ 사용 가능한 모델 목록 조회 실패: {e}")
        return False
    
    # 학습 상태 조회 테스트
    try:
        print("\n학습 상태 조회 테스트...")
        training_status = harmony_service.get_training_status()
        
        print(f"✅ 학습 상태 조회 성공:")
        print(f"  - 상태: {training_status['status']}")
        print(f"  - 현재 에포크: {training_status['current_epoch']}")
        print(f"  - 총 에포크: {training_status['total_epochs']}")
        print(f"  - 손실: {training_status['loss']:.4f}")
        print(f"  - 진행률: {training_status['progress']:.2f}")
        
    except Exception as e:
        print(f"❌ 학습 상태 조회 실패: {e}")
        return False
    
    print("\n=== Harmony Transformer 서비스 테스트 완료 ===")
    return True

def test_training_pipeline():
    """학습 파이프라인 테스트"""
    print("\n=== 학습 파이프라인 테스트 시작 ===")
    
    try:
        # 서비스 초기화
        harmony_service = HarmonyTransformerService()
        corpus_processor = CorpusProcessor(settings.WHEN_IN_ROME_CORPUS_PATH)
        
        # 코퍼스 데이터 로드
        scan_result = corpus_processor.scan_corpus()
        if not scan_result["success"]:
            raise Exception(scan_result["message"])
        
        corpus_items = corpus_processor.corpus_items[:10]  # 처음 10개만 테스트
        
        # 모델 로드
        harmony_service.load_model()
        
        # 학습 데이터 준비
        training_data = harmony_service.prepare_training_data(corpus_items)
        
        print(f"✅ 학습 파이프라인 준비 완료:")
        print(f"  - 코퍼스 아이템: {len(corpus_items)}개")
        print(f"  - 학습 예시: {training_data['total_examples']}개")
        print(f"  - 데이터셋 특성: {training_data['features']}")
        
        # 실제 학습은 시간이 오래 걸리므로 여기서는 준비만 확인
        print("  - 학습 데이터가 성공적으로 준비되었습니다")
        print("  - 실제 학습을 시작하려면 harmony_service.start_training(training_data)를 호출하세요")
        
        return True
        
    except Exception as e:
        print(f"❌ 학습 파이프라인 테스트 실패: {e}")
        return False

if __name__ == "__main__":
    print("Harmony Transformer 서비스 테스트 시작")
    
    # 기본 서비스 테스트
    service_success = test_harmony_transformer()
    
    if service_success:
        # 학습 파이프라인 테스트
        training_success = test_training_pipeline()
        
        if training_success:
            print("\n🎉 모든 테스트가 성공적으로 완료되었습니다!")
            print("이제 Harmony Transformer를 사용하여 화성학 학습 및 생성이 가능합니다.")
        else:
            print("\n⚠️  학습 파이프라인 테스트에 실패했습니다.")
    else:
        print("\n❌ Harmony Transformer 서비스 테스트에 실패했습니다.")
    
    sys.exit(0 if service_success else 1)
