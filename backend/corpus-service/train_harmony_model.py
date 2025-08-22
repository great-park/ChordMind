#!/usr/bin/env python3
"""
Harmony Transformer 모델 파인튜닝 스크립트 (개선된 버전)
"""

import sys
import os
import time
import json
from pathlib import Path

# 프로젝트 루트를 Python 경로에 추가
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from app.services.harmony_transformer import HarmonyTransformerService
from app.services.corpus_processor import CorpusProcessor
from app.core.config import settings

def analyze_corpus_quality(corpus_items):
    """코퍼스 품질 분석"""
    print("=== 코퍼스 품질 분석 ===")
    
    total_items = len(corpus_items)
    valid_items = 0
    total_measures = 0
    total_complexity = 0.0
    key_distribution = {}
    genre_distribution = {}
    
    for item in corpus_items:
        if hasattr(item, 'analysis_path') and item.analysis_path:
            valid_items += 1
            
            # 장르별 분포
            genre = getattr(item, 'genre', 'unknown')
            genre_distribution[genre] = genre_distribution.get(genre, 0) + 1
            
            # 분석 파일 읽기
            try:
                with open(item.analysis_path, 'r', encoding='utf-8') as f:
                    content = f.read()
                
                # 마디 수 계산
                lines = [line.strip() for line in content.split('\n') if line.strip().startswith('m')]
                total_measures += len(lines)
                
                # 키 분포
                for line in lines:
                    if ':' in line:
                        parts = line.split()
                        for part in parts:
                            if ':' in part and len(part.rstrip(':')) <= 3:
                                key = part.rstrip(':')
                                key_distribution[key] = key_distribution.get(key, 0) + 1
                                break
                
            except Exception as e:
                continue
    
    print(f"총 아이템: {total_items}")
    print(f"유효한 아이템: {valid_items} ({valid_items/total_items*100:.1f}%)")
    print(f"총 마디 수: {total_measures}")
    print(f"평균 마디/아이템: {total_measures/valid_items:.1f}" if valid_items > 0 else "평균 마디/아이템: 0")
    
    print(f"\n장르별 분포:")
    for genre, count in sorted(genre_distribution.items()):
        print(f"  {genre}: {count}개 ({count/valid_items*100:.1f}%)")
    
    print(f"\n주요 키 분포 (상위 10개):")
    sorted_keys = sorted(key_distribution.items(), key=lambda x: x[1], reverse=True)[:10]
    for key, count in sorted_keys:
        print(f"  {key}: {count}회")
    
    return {
        'total_items': total_items,
        'valid_items': valid_items,
        'total_measures': total_measures,
        'genre_distribution': genre_distribution,
        'key_distribution': key_distribution
    }

def train_harmony_model():
    """Harmony Transformer 모델 파인튜닝 (전체 데이터셋)"""
    print("=== Harmony Transformer 모델 파인튜닝 시작 (전체 데이터셋) ===")
    
    try:
        # 1. 서비스 초기화
        print("1. Harmony Transformer 서비스 초기화...")
        harmony_service = HarmonyTransformerService()
        
        # 2. 코퍼스 데이터 로드
        print("2. When-in-Rome 코퍼스 데이터 로드...")
        corpus_processor = CorpusProcessor(settings.WHEN_IN_ROME_CORPUS_PATH)
        
        scan_result = corpus_processor.scan_corpus()
        if not scan_result["success"]:
            raise Exception(scan_result["message"])
        
        corpus_items = corpus_processor.corpus_items
        print(f"   ✅ 코퍼스 로드 완료: {len(corpus_items)}개 아이템")
        
        # 3. 코퍼스 품질 분석
        quality_analysis = analyze_corpus_quality(corpus_items)
        
        # 4. 모델 로드
        print("\n3. 기본 모델 로드...")
        model_info = harmony_service.load_model()
        print(f"   ✅ 모델 로드 완료:")
        print(f"      - 모델명: {model_info['model_name']}")
        print(f"      - 디바이스: {model_info['device']}")
        print(f"      - 총 파라미터: {model_info['total_params']:,}")
        print(f"      - 학습 가능 파라미터: {model_info['trainable_params']:,}")
        
        # 5. 학습 데이터 준비
        print("\n4. 학습 데이터 준비...")
        training_data = harmony_service.prepare_training_data(corpus_items)
        print(f"   ✅ 학습 데이터 준비 완료:")
        print(f"      - 총 예시: {training_data['total_examples']}")
        print(f"      - 특성: {training_data['features']}")
        
        # 6. 모델 파인튜닝 시작
        print("\n5. 모델 파인튜닝 시작...")
        start_time = time.time()
        
        # 출력 디렉토리 설정
        timestamp = int(start_time)
        output_dir = f"models/harmony_transformer_full_{timestamp}"
        
        # 파인튜닝 실행
        training_result = harmony_service.start_training(training_data, output_dir)
        
        end_time = time.time()
        total_duration = end_time - start_time
        
        print(f"\n   ✅ 모델 파인튜닝 완료!")
        print(f"      - 출력 디렉토리: {training_result['output_dir']}")
        print(f"      - 총 소요 시간: {total_duration:.2f}초")
        print(f"      - 학습 요약:")
        summary = training_result['training_summary']
        print(f"        * 데이터셋 크기: {summary['dataset_size']}")
        print(f"        * 에포크 수: {summary['epochs']}")
        print(f"        * 배치 크기: {summary['batch_size']}")
        print(f"        * 학습 시간: {summary['training_time']:.2f}초")
        print(f"        * 최종 손실: {summary['final_loss']:.4f}")
        
        # 7. 파인튜닝된 모델 테스트
        print("\n6. 파인튜닝된 모델 테스트...")
        
        # 간단한 화성 진행 제안 생성
        test_contexts = [
            "m1 C:I | m2 G:V",
            "m1 F:IV | m2 C:I",
            "m1 Am:i | m2 E:V"
        ]
        
        for i, context in enumerate(test_contexts):
            try:
                suggestions = harmony_service.generate_harmony_suggestions(context, "classical", 2)
                print(f"   ✅ 테스트 {i+1} 성공: {context}")
                for j, suggestion in enumerate(suggestions[:2]):  # 상위 2개만
                    print(f"      제안 {j+1}: {suggestion['progression']}")
            except Exception as e:
                print(f"   ❌ 테스트 {i+1} 실패: {e}")
        
        # 8. 모델 저장
        print("\n7. 최종 모델 저장...")
        final_model_path = harmony_service.save_model()
        print(f"   ✅ 최종 모델 저장 완료: {final_model_path}")
        
        # 9. 결과 요약 저장
        results_summary = {
            'training_result': {
                'success': training_result['success'],
                'output_dir': training_result['output_dir'],
                'training_summary': training_result['training_summary']
            },
            'quality_analysis': quality_analysis,
            'total_duration': total_duration,
            'timestamp': timestamp
        }
        
        summary_file = f"{output_dir}/full_training_summary.json"
        with open(summary_file, 'w', encoding='utf-8') as f:
            json.dump(results_summary, f, ensure_ascii=False, indent=2)
        
        print(f"\n🎉 Harmony Transformer 모델 파인튜닝이 성공적으로 완료되었습니다!")
        print(f"모델 경로: {final_model_path}")
        print(f"상세 요약: {summary_file}")
        print("이제 이 모델을 사용하여 화성학 분석 및 제안을 생성할 수 있습니다.")
        
        return True
        
    except Exception as e:
        print(f"❌ 모델 파인튜닝 실패: {e}")
        import traceback
        traceback.print_exc()
        return False

def train_with_subset():
    """데이터셋의 일부로만 파인튜닝 (빠른 테스트용)"""
    print("=== Harmony Transformer 모델 파인튜닝 (서브셋) ===")
    
    try:
        # 1. 서비스 초기화
        print("1. Harmony Transformer 서비스 초기화...")
        harmony_service = HarmonyTransformerService()
        
        # 2. 코퍼스 데이터 로드 (일부만)
        print("2. When-in-Rome 코퍼스 데이터 로드 (일부)...")
        corpus_processor = CorpusProcessor(settings.WHEN_IN_ROME_CORPUS_PATH)
        
        scan_result = corpus_processor.scan_corpus()
        if not scan_result["success"]:
            raise Exception(scan_result["message"])
        
        # 처음 30개 아이템만 사용 (빠른 테스트)
        corpus_items = corpus_processor.corpus_items[:30]
        print(f"   ✅ 코퍼스 로드 완료: {len(corpus_items)}개 아이템 (전체 중 일부)")
        
        # 3. 코퍼스 품질 분석
        quality_analysis = analyze_corpus_quality(corpus_items)
        
        # 4. 모델 로드
        print("\n3. 기본 모델 로드...")
        model_info = harmony_service.load_model()
        print(f"   ✅ 모델 로드 완료: {model_info['model_name']}")
        
        # 5. 학습 데이터 준비
        print("\n4. 학습 데이터 준비...")
        training_data = harmony_service.prepare_training_data(corpus_items)
        print(f"   ✅ 학습 데이터 준비 완료: {training_data['total_examples']}개 예시")
        
        # 6. 모델 파인튜닝 시작 (빠른 설정)
        print("\n5. 모델 파인튜닝 시작 (빠른 설정)...")
        start_time = time.time()
        
        # 빠른 테스트를 위한 출력 디렉토리
        timestamp = int(start_time)
        output_dir = f"models/harmony_transformer_quick_{timestamp}"
        
        # 파인튜닝 실행
        training_result = harmony_service.start_training(training_data, output_dir)
        
        end_time = time.time()
        training_duration = end_time - start_time
        
        print(f"\n   ✅ 빠른 파인튜닝 완료!")
        print(f"      - 출력 디렉토리: {training_result['output_dir']}")
        print(f"      - 학습 시간: {training_duration:.2f}초")
        
        # 7. 간단한 테스트
        print("\n6. 간단한 테스트...")
        test_contexts = ["m1 C:I", "m1 F:IV", "m1 Am:i"]
        
        for i, context in enumerate(test_contexts):
            try:
                suggestions = harmony_service.generate_harmony_suggestions(context, "classical", 1)
                if suggestions:
                    print(f"   ✅ 테스트 {i+1} 성공: {context} → {suggestions[0]['progression']}")
                else:
                    print(f"   ⚠️  테스트 {i+1}: 제안 없음")
            except Exception as e:
                print(f"   ❌ 테스트 {i+1} 실패: {e}")
        
        # 8. 결과 요약 저장
        results_summary = {
            'training_result': {
                'success': training_result['success'],
                'output_dir': training_result['output_dir'],
                'training_summary': training_result['training_summary']
            },
            'quality_analysis': quality_analysis,
            'training_duration': training_duration,
            'timestamp': timestamp
        }
        
        summary_file = f"{output_dir}/quick_training_summary.json"
        with open(summary_file, 'w', encoding='utf-8') as f:
            json.dump(results_summary, f, ensure_ascii=False, indent=2)
        
        print(f"\n🎉 빠른 파인튜닝 테스트가 완료되었습니다!")
        print(f"상세 요약: {summary_file}")
        return True
        
    except Exception as e:
        print(f"❌ 빠른 파인튜닝 실패: {e}")
        import traceback
        traceback.print_exc()
        return False

def train_with_custom_size():
    """사용자 지정 크기로 파인튜닝"""
    print("=== Harmony Transformer 모델 파인튜닝 (사용자 지정 크기) ===")
    
    try:
        # 1. 서비스 초기화
        print("1. Harmony Transformer 서비스 초기화...")
        harmony_service = HarmonyTransformerService()
        
        # 2. 코퍼스 데이터 로드
        print("2. When-in-Rome 코퍼스 데이터 로드...")
        corpus_processor = CorpusProcessor(settings.WHEN_IN_ROME_CORPUS_PATH)
        
        scan_result = corpus_processor.scan_corpus()
        if not scan_result["success"]:
            raise Exception(scan_result["message"])
        
        total_items = len(corpus_processor.corpus_items)
        print(f"   ✅ 코퍼스 로드 완료: {total_items}개 아이템")
        
        # 3. 사용자 입력 받기
        print(f"\n사용 가능한 아이템 수: {total_items}")
        try:
            subset_size = int(input(f"사용할 아이템 수를 입력하세요 (1-{total_items}): "))
            if subset_size < 1 or subset_size > total_items:
                print(f"잘못된 입력입니다. 1-{total_items} 사이의 숫자를 입력하세요.")
                return False
        except ValueError:
            print("숫자를 입력하세요.")
            return False
        
        # 4. 선택된 아이템으로 학습
        corpus_items = corpus_processor.corpus_items[:subset_size]
        print(f"   선택된 아이템 수: {len(corpus_items)}개")
        
        # 5. 코퍼스 품질 분석
        quality_analysis = analyze_corpus_quality(corpus_items)
        
        # 6. 모델 로드
        print("\n3. 기본 모델 로드...")
        model_info = harmony_service.load_model()
        print(f"   ✅ 모델 로드 완료: {model_info['model_name']}")
        
        # 7. 학습 데이터 준비
        print("\n4. 학습 데이터 준비...")
        training_data = harmony_service.prepare_training_data(corpus_items)
        print(f"   ✅ 학습 데이터 준비 완료: {training_data['total_examples']}개 예시")
        
        # 8. 모델 파인튜닝 시작
        print("\n5. 모델 파인튜닝 시작...")
        start_time = time.time()
        
        timestamp = int(start_time)
        output_dir = f"models/harmony_transformer_custom_{subset_size}_{timestamp}"
        
        # 파인튜닝 실행
        training_result = harmony_service.start_training(training_data, output_dir)
        
        end_time = time.time()
        training_duration = end_time - start_time
        
        print(f"\n   ✅ 파인튜닝 완료!")
        print(f"      - 출력 디렉토리: {training_result['output_dir']}")
        print(f"      - 학습 시간: {training_duration:.2f}초")
        
        # 9. 결과 요약 저장
        results_summary = {
            'training_result': {
                'success': training_result['success'],
                'output_dir': training_result['output_dir'],
                'training_summary': training_result['training_summary']
            },
            'quality_analysis': quality_analysis,
            'training_duration': training_duration,
            'timestamp': timestamp,
            'subset_size': subset_size
        }
        
        summary_file = f"{output_dir}/custom_training_summary.json"
        with open(summary_file, 'w', encoding='utf-8') as f:
            json.dump(results_summary, f, ensure_ascii=False, indent=2)
        
        print(f"\n🎉 사용자 지정 크기 파인튜닝이 완료되었습니다!")
        print(f"상세 요약: {summary_file}")
        return True
        
    except Exception as e:
        print(f"❌ 사용자 지정 크기 파인튜닝 실패: {e}")
        import traceback
        traceback.print_exc()
        return False

if __name__ == "__main__":
    print("🎵 Harmony Transformer 모델 파인튜닝 시작")
    print("=" * 50)
    print("1. 전체 데이터셋으로 파인튜닝 (권장)")
    print("2. 서브셋으로 빠른 파인튜닝 (테스트용)")
    print("3. 사용자 지정 크기로 파인튜닝")
    print("4. 코퍼스 품질 분석만 실행")
    print("=" * 50)
    
    try:
        choice = input("선택하세요 (1-4): ").strip()
        
        if choice == "1":
            success = train_harmony_model()
        elif choice == "2":
            success = train_with_subset()
        elif choice == "3":
            success = train_with_custom_size()
        elif choice == "4":
            # 코퍼스 품질 분석만 실행
            print("=== 코퍼스 품질 분석만 실행 ===")
            corpus_processor = CorpusProcessor(settings.WHEN_IN_ROME_CORPUS_PATH)
            scan_result = corpus_processor.scan_corpus()
            if scan_result["success"]:
                analyze_corpus_quality(corpus_processor.corpus_items)
                success = True
            else:
                print(f"코퍼스 스캔 실패: {scan_result['message']}")
                success = False
        else:
            print("잘못된 선택입니다. 기본값으로 빠른 파인튜닝을 실행합니다.")
            success = train_with_subset()
        
        if success:
            print("\n🎉 파인튜닝이 성공적으로 완료되었습니다!")
            sys.exit(0)
        else:
            print("\n❌ 파인튜닝에 실패했습니다.")
            sys.exit(1)
            
    except KeyboardInterrupt:
        print("\n\n사용자에 의해 중단되었습니다.")
        sys.exit(0)
    except Exception as e:
        print(f"\n예상치 못한 오류가 발생했습니다: {e}")
        import traceback
        traceback.print_exc()
        sys.exit(1)
