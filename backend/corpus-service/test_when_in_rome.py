#!/usr/bin/env python3
"""
When-in-Rome 프로세서 테스트 스크립트
"""

import sys
import os
from pathlib import Path

# 프로젝트 루트를 Python 경로에 추가
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from app.services.when_in_rome_processor import WhenInRomeProcessor
from app.core.config import settings

def test_when_in_rome_processor():
    """When-in-Rome 프로세서 테스트"""
    print("=== When-in-Rome 프로세서 테스트 시작 ===")
    
    # 코퍼스 경로 확인
    corpus_path = Path(settings.WHEN_IN_ROME_CORPUS_PATH)
    print(f"코퍼스 경로: {corpus_path}")
    print(f"경로 존재 여부: {corpus_path.exists()}")
    
    if not corpus_path.exists():
        print("❌ 코퍼스 경로가 존재하지 않습니다!")
        print("When-in-Rome 레포지토리를 먼저 클론하세요:")
        print("cd .. && git clone https://github.com/MarkGotham/When-in-Rome.git")
        return False
    
    # 프로세서 초기화
    try:
        processor = WhenInRomeProcessor(str(corpus_path))
        print("✅ 프로세서 초기화 성공")
    except Exception as e:
        print(f"❌ 프로세서 초기화 실패: {e}")
        return False
    
    # 코퍼스 스캔
    try:
        print("\n코퍼스 스캔 중...")
        items = processor.scan_corpus()
        print(f"✅ 코퍼스 스캔 완료: {len(items)}개 아이템 발견")
        
        if items:
            print("\n=== 발견된 코퍼스 아이템 샘플 ===")
            for i, item in enumerate(items[:5]):  # 처음 5개만 표시
                print(f"{i+1}. {item.corpus}/{item.composer}/{item.work}/{item.movement}")
                print(f"   분석 파일: {item.analysis_path}")
                print(f"   악보 파일: {item.score_path}")
                print(f"   메타데이터: {item.metadata}")
                print()
            
            if len(items) > 5:
                print(f"... 및 {len(items) - 5}개 더")
        else:
            print("⚠️  코퍼스 아이템이 발견되지 않았습니다")
            
    except Exception as e:
        print(f"❌ 코퍼스 스캔 실패: {e}")
        return False
    
    # 통계 정보
    try:
        print("\n=== 코퍼스 통계 ===")
        stats = processor.get_statistics()
        for key, value in stats.items():
            print(f"{key}: {value}")
    except Exception as e:
        print(f"❌ 통계 정보 조회 실패: {e}")
    
    # 분석 파일 파싱 테스트
    if items:
        try:
            print("\n=== 분석 파일 파싱 테스트 ===")
            test_item = items[0]
            print(f"테스트 대상: {test_item.analysis_path}")
            
            work_analysis = processor.parse_analysis_file(test_item.analysis_path)
            print(f"✅ 파싱 성공:")
            print(f"  - 작곡가: {work_analysis.composer}")
            print(f"  - 제목: {work_analysis.title}")
            print(f"  - 조성: {work_analysis.key_signature}")
            print(f"  - 박자: {work_analysis.time_signature}")
            print(f"  - 형식: {work_analysis.form}")
            print(f"  - 총 마디: {work_analysis.total_measures}")
            print(f"  - 분석된 마디: {len(work_analysis.analysis)}")
            
            if work_analysis.analysis:
                print(f"\n  첫 번째 마디 분석:")
                first_measure = work_analysis.analysis[0]
                print(f"    - 마디: {first_measure.measure}")
                print(f"    - 로마 숫자: {first_measure.roman_numeral}")
                print(f"    - 키: {first_measure.key}")
                print(f"    - 인버전: {first_measure.inversion}")
                
        except Exception as e:
            print(f"❌ 분석 파일 파싱 실패: {e}")
    
    # 데이터 내보내기 테스트
    try:
        print("\n=== 데이터 내보내기 테스트 ===")
        
        # JSON 내보내기
        json_success = processor.export_to_json("test_export.json")
        print(f"JSON 내보내기: {'✅ 성공' if json_success else '❌ 실패'}")
        
        # CSV 내보내기
        csv_success = processor.export_to_csv("test_export.csv")
        print(f"CSV 내보내기: {'✅ 성공' if csv_success else '❌ 실패'}")
        
        # 테스트 파일 정리
        for test_file in ["test_export.json", "test_export.csv"]:
            if os.path.exists(test_file):
                os.remove(test_file)
                print(f"테스트 파일 정리: {test_file}")
                
    except Exception as e:
        print(f"❌ 데이터 내보내기 테스트 실패: {e}")
    
    print("\n=== When-in-Rome 프로세서 테스트 완료 ===")
    return True

if __name__ == "__main__":
    success = test_when_in_rome_processor()
    sys.exit(0 if success else 1)
