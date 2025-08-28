#!/usr/bin/env python3
"""
AI Composition Service 테스트 스크립트
"""

import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from services.ai_composition import AICompositionService

def test_ai_composition_service():
    """AI Composition Service의 모든 기능을 테스트합니다."""
    print("🎼 AI Composition Service 테스트 시작\n")
    
    # 서비스 초기화
    try:
        composition_service = AICompositionService()
        print("✅ AI Composition Service 초기화 성공")
    except Exception as e:
        print(f"❌ AI Composition Service 초기화 실패: {e}")
        return
    
    print("\n" + "="*50)
    print("1. 화성 진행 제안 테스트")
    print("="*50)
    
    # 화성 진행 제안 테스트
    test_harmony_progression(composition_service)
    
    print("\n" + "="*50)
    print("2. 멜로디 생성 테스트")
    print("="*50)
    
    # 멜로디 생성 테스트
    test_melody_generation(composition_service)
    
    print("\n" + "="*50)
    print("3. 조성 전환 가이드 테스트")
    print("="*50)
    
    # 조성 전환 가이드 테스트
    test_modulation_guide(composition_service)
    
    print("\n" + "="*50)
    print("4. 에러 처리 테스트")
    print("="*50)
    
    # 에러 처리 테스트
    test_error_handling(composition_service)
    
    print("\n🎉 모든 테스트 완료!")

def test_harmony_progression(service):
    """화성 진행 제안 기능을 테스트합니다."""
    print("🎵 클래식 스타일 화성 진행 제안 (초급)")
    result = service.suggest_harmony_progression(
        style="classical",
        difficulty="beginner",
        length=4,
        mood="happy"
    )
    print_result("클래식 초급", result)
    
    print("\n🎵 재즈 스타일 화성 진행 제안 (중급)")
    result = service.suggest_harmony_progression(
        style="jazz",
        difficulty="intermediate",
        length=6,
        mood="mysterious"
    )
    print_result("재즈 중급", result)
    
    print("\n🎵 팝 스타일 화성 진행 제안 (초급)")
    result = service.suggest_harmony_progression(
        style="pop",
        difficulty="beginner",
        length=8,
        mood="sad"
    )
    print_result("팝 초급", result)

def test_melody_generation(service):
    """멜로디 생성 기능을 테스트합니다."""
    # 클래식 스타일 멜로디 생성
    print("🎵 클래식 스타일 멜로디 생성")
    harmony_progression = ["I", "IV", "V", "I"]
    result = service.generate_melody(
        harmony_progression=harmony_progression,
        style="classical",
        rhythm_pattern="simple"
    )
    print_result("클래식 멜로디", result)
    
    # 재즈 스타일 멜로디 생성
    print("\n🎵 재즈 스타일 멜로디 생성")
    result = service.generate_melody(
        harmony_progression=harmony_progression,
        style="jazz",
        rhythm_pattern="complex"
    )
    print_result("재즈 멜로디", result)

def test_modulation_guide(service):
    """조성 전환 가이드 기능을 테스트합니다."""
    print("🎵 C major → F major 전조 가이드 (초급)")
    result = service.get_modulation_guide(
        from_key="C",
        to_key="F",
        difficulty="beginner"
    )
    print_result("C→F 전조", result)
    
    print("\n🎵 G major → D major 전조 가이드 (중급)")
    result = service.get_modulation_guide(
        from_key="G",
        to_key="D",
        difficulty="intermediate"
    )
    print_result("G→D 전조", result)
    
    print("\n🎵 모든 난이도 전조 가이드")
    result = service.get_modulation_guide(
        from_key="C",
        to_key="G",
        difficulty="all"
    )
    print_result("모든 난이도", result)

def test_error_handling(service):
    """에러 처리 기능을 테스트합니다."""
    print("🎵 지원하지 않는 스타일 테스트")
    result = service.suggest_harmony_progression(style="invalid_style")
    print_result("잘못된 스타일", result)
    
    print("\n🎵 빈 화성 진행 테스트")
    result = service.generate_melody(harmony_progression=[])
    print_result("빈 진행", result)

def print_result(test_name, result):
    """테스트 결과를 출력합니다."""
    if "error" in result:
        print(f"❌ {test_name}: {result['error']}")
    else:
        print(f"✅ {test_name}: 성공")
        if "chords" in result:
            print(f"   화성 진행: {' - '.join(result['chords'])}")
        if "melody" in result:
            print(f"   멜로디 생성: {len(result['melody'])}개 화음")
        if "modulation_methods" in result:
            print(f"   전조 방법: {len(result['modulation_methods'])}개")

if __name__ == "__main__":
    test_ai_composition_service()
