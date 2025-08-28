#!/usr/bin/env python3
"""
Music Theory Service 테스트 스크립트
"""

import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from services.music_theory import MusicTheoryService

def test_music_theory_service():
    """Music Theory Service의 모든 기능을 테스트합니다."""
    print("📚 Music Theory Service 테스트 시작\n")
    
    # 서비스 초기화
    try:
        theory_service = MusicTheoryService()
        print("✅ Music Theory Service 초기화 성공")
    except Exception as e:
        print(f"❌ Music Theory Service 초기화 실패: {e}")
        return
    
    print("\n" + "="*50)
    print("1. 커리큘럼 조회 테스트")
    print("="*50)
    
    # 커리큘럼 조회 테스트
    test_curriculum(theory_service)
    
    print("\n" + "="*50)
    print("2. 진행 패턴 조회 테스트")
    print("="*50)
    
    # 진행 패턴 조회 테스트
    test_progression_patterns(theory_service)
    
    print("\n" + "="*50)
    print("3. 모달 믹스처 가이드 테스트")
    print("="*50)
    
    # 모달 믹스처 가이드 테스트
    test_modal_mixture_guides(theory_service)
    
    print("\n" + "="*50)
    print("4. 레슨 관리 테스트")
    print("="*50)
    
    # 레슨 관리 테스트
    test_lesson_management(theory_service)
    
    print("\n" + "="*50)
    print("5. 사용자 진도 추적 테스트")
    print("="*50)
    
    # 사용자 진도 추적 테스트
    test_user_progress_tracking(theory_service)
    
    print("\n🎉 모든 테스트 완료!")

def test_curriculum(service):
    """커리큘럼 조회 기능을 테스트합니다."""
    print("📖 초급 커리큘럼 조회")
    result = service.get_curriculum(level="beginner")
    print_result("초급 커리큘럼", result)
    
    print("\n📖 중급 커리큘럼 조회")
    result = service.get_curriculum(level="intermediate")
    print_result("중급 커리큘럼", result)
    
    print("\n📖 고급 커리큘럼 조회")
    result = service.get_curriculum(level="advanced")
    print_result("고급 커리큘럼", result)
    
    print("\n📖 사용자별 커리큘럼 조회 (사용자 ID: 1)")
    result = service.get_curriculum(level="beginner", user_id=1)
    print_result("사용자별 커리큘럼", result)

def test_progression_patterns(service):
    """진행 패턴 조회 기능을 테스트합니다."""
    print("🎵 클래식 진행 패턴 조회")
    result = service.get_progression_patterns(style="classical")
    print_result("클래식 패턴", result)
    
    print("\n🎵 재즈 진행 패턴 조회")
    result = service.get_progression_patterns(style="jazz")
    print_result("재즈 패턴", result)
    
    print("\n🎵 팝 진행 패턴 조회")
    result = service.get_progression_patterns(style="pop")
    print_result("팝 패턴", result)
    
    print("\n🎵 중급 난이도 클래식 패턴만 조회")
    result = service.get_progression_patterns(style="classical", difficulty="intermediate")
    print_result("중급 클래식", result)

def test_modal_mixture_guides(service):
    """모달 믹스처 가이드 조회 기능을 테스트합니다."""
    print("🎼 차용 화음 가이드 조회")
    result = service.get_modal_mixture_guide(technique="borrowed_chords")
    print_result("차용 화음", result)
    
    print("\n🎼 모달 인터체인지 가이드 조회")
    result = service.get_modal_mixture_guide(technique="modal_interchange")
    print_result("모달 인터체인지", result)
    
    print("\n🎼 반음계적 변화 가이드 조회")
    result = service.get_modal_mixture_guide(technique="chromatic_alteration")
    print_result("반음계적 변화", result)
    
    print("\n🎼 모든 기법 가이드 조회")
    result = service.get_modal_mixture_guide(technique="all")
    print_result("모든 기법", result)

def test_lesson_management(service):
    """레슨 관리 기능을 테스트합니다."""
    user_id = 1
    lesson_id = "bt_001"
    
    print(f"🎯 레슨 시작 (사용자: {user_id}, 레슨: {lesson_id})")
    result = service.start_lesson(user_id=user_id, lesson_id=lesson_id)
    print_result("레슨 시작", result)
    
    print(f"\n📊 진행도 업데이트 (진행도: 50%)")
    result = service.update_progress(user_id=user_id, lesson_id=lesson_id, progress=50)
    print_result("진행도 업데이트", result)
    
    print(f"\n🎉 레슨 완료 (점수: 85)")
    result = service.complete_lesson(user_id=user_id, lesson_id=lesson_id, score=85)
    print_result("레슨 완료", result)

def test_user_progress_tracking(service):
    """사용자 진도 추적 기능을 테스트합니다."""
    user_id = 1
    
    print(f"📈 사용자 진도 요약 (사용자: {user_id})")
    result = service.get_user_progress_summary(user_id)
    print_result("진도 요약", result)
    
    # 추가 레슨 진행
    print(f"\n🎯 추가 레슨 진행 (레슨: it_001)")
    service.start_lesson(user_id=user_id, lesson_id="it_001")
    service.update_progress(user_id=user_id, lesson_id="it_001", progress=30)
    
    print(f"\n📈 업데이트된 진도 요약")
    result = service.get_user_progress_summary(user_id)
    print_result("업데이트된 진도", result)

def print_result(test_name, result):
    """테스트 결과를 출력합니다."""
    if "error" in result:
        print(f"❌ {test_name}: {result['error']}")
    else:
        print(f"✅ {test_name}: 성공")
        
        if "curriculum" in result:
            print(f"   총 레슨 수: {result['total_lessons']}")
            print(f"   완료된 레슨: {result['completed_lessons']}")
            print(f"   예상 총 시간: {result['estimated_total_time']}분")
        
        if "patterns" in result:
            print(f"   총 패턴 수: {result['total_patterns']}")
        
        if "guides" in result:
            print(f"   총 가이드 수: {result['total_guides']}")
        
        if "lesson" in result:
            print(f"   레슨 제목: {result['lesson']['title']}")
            print(f"   예상 시간: {result['lesson']['estimated_time']}분")
        
        if "progress" in result:
            print(f"   현재 진행도: {result['progress']}%")
        
        if "completed" in result:
            print(f"   완료 여부: {'완료' if result['completed'] else '진행 중'}")
            if "score" in result:
                print(f"   최종 점수: {result['score']}점")

if __name__ == "__main__":
    test_music_theory_service()
