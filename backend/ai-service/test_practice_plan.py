#!/usr/bin/env python3
"""
Practice Plan Service 테스트 스크립트
"""

import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from services.practice_plan import PracticePlanService

def test_practice_plan_service():
    """Practice Plan Service의 모든 기능을 테스트합니다."""
    print("🎯 Practice Plan Service 테스트 시작\n")
    
    # 서비스 초기화
    try:
        practice_plan_service = PracticePlanService()
        print("✅ Practice Plan Service 초기화 성공")
    except Exception as e:
        print(f"❌ Practice Plan Service 초기화 실패: {e}")
        return
    
    print("\n" + "="*50)
    print("1. AI 성과 분석 테스트")
    print("="*50)
    
    # AI 성과 분석 테스트
    test_performance_analysis(practice_plan_service)
    
    print("\n" + "="*50)
    print("2. 개인 맞춤 연습 계획 생성 테스트")
    print("="*50)
    
    # 개인 맞춤 연습 계획 생성 테스트
    test_personalized_plan_generation(practice_plan_service)
    
    print("\n" + "="*50)
    print("3. 연습 진행 추적 테스트")
    print("="*50)
    
    # 연습 진행 추적 테스트
    test_progress_tracking(practice_plan_service)
    
    print("\n🎉 모든 테스트 완료!")

def test_performance_analysis(service):
    """AI 성과 분석 기능을 테스트합니다."""
    user_id = 1
    
    print("📊 빈 연습 기록으로 성과 분석")
    result = service.analyze_user_performance(user_id, [])
    print_result("빈 기록 분석", result)
    
    print("\n📊 샘플 연습 기록으로 성과 분석")
    sample_history = [
        {
            "area": "harmony",
            "duration": 45,
            "difficulty": 2,
            "timestamp": "2024-01-01T10:00:00"
        },
        {
            "area": "melody",
            "duration": 30,
            "difficulty": 1,
            "timestamp": "2024-01-02T14:00:00"
        },
        {
            "area": "harmony",
            "duration": 60,
            "difficulty": 3,
            "timestamp": "2024-01-03T16:00:00"
        }
    ]
    
    result = service.analyze_user_performance(user_id, sample_history)
    print_result("샘플 기록 분석", result)

def test_personalized_plan_generation(service):
    """개인 맞춤 연습 계획 생성 기능을 테스트합니다."""
    user_id = 1
    
    # 분석 결과 시뮬레이션
    analysis_result = {
        "improvement_areas": ["harmony", "melody"],
        "current_level": "intermediate"
    }
    
    print("📋 60분 연습 계획 생성")
    result = service.generate_personalized_plan(
        user_id=user_id,
        analysis_result=analysis_result,
        practice_time=60
    )
    print_result("60분 계획", result)
    
    print("\n📋 90분 연습 계획 생성 (특정 영역 집중)")
    result = service.generate_personalized_plan(
        user_id=user_id,
        analysis_result=analysis_result,
        practice_time=90,
        focus_areas=["harmony"]
    )
    print_result("90분 계획 (화성 집중)", result)

def test_progress_tracking(service):
    """연습 진행 추적 기능을 테스트합니다."""
    user_id = 1
    
    print("📈 첫 번째 연습 세션 기록")
    session_data_1 = {
        "area": "harmony",
        "duration": 45,
        "difficulty": 2,
        "exercises": ["I-IV-V 진행", "ii-V-I 진행"]
    }
    
    result = service.track_practice_progress(user_id, session_data_1)
    print_result("첫 번째 세션", result)
    
    print("\n📈 두 번째 연습 세션 기록")
    session_data_2 = {
        "area": "melody",
        "duration": 30,
        "difficulty": 1,
        "exercises": ["C Major 스케일", "아르페지오"]
    }
    
    result = service.track_practice_progress(user_id, session_data_2)
    print_result("두 번째 세션", result)
    
    print("\n📈 세 번째 연습 세션 기록")
    session_data_3 = {
        "area": "harmony",
        "duration": 60,
        "difficulty": 3,
        "exercises": ["7화음 진행", "확장 화성"]
    }
    
    result = service.track_practice_progress(user_id, session_data_3)
    print_result("세 번째 세션", result)

def print_result(test_name, result):
    """테스트 결과를 출력합니다."""
    if "error" in result:
        print(f"❌ {test_name}: {result['error']}")
    else:
        print(f"✅ {test_name}: 성공")
        
        if "overall_performance" in result:
            perf = result["overall_performance"]
            print(f"   총 연습 시간: {perf['total_practice_time']}분")
            print(f"   총 세션 수: {perf['total_sessions']}")
            print(f"   일관성 점수: {perf['consistency_score']}")
        
        if "area_performance" in result:
            print(f"   영역별 성과:")
            for area, data in result["area_performance"].items():
                print(f"     {area}: {data['score']}점 ({data['level']})")
        
        if "improvement_areas" in result:
            print(f"   개선 영역: {', '.join(result['improvement_areas'])}")
        
        if "current_level" in result:
            print(f"   현재 수준: {result['current_level']}")
        
        if "daily_plan" in result:
            plan = result["daily_plan"]
            print(f"   워밍업: {plan['warmup']['duration']}분")
            print(f"   메인 연습: {len(plan['main_practice'])}개 영역")
        
        if "session_id" in result:
            print(f"   세션 ID: {result['session_id']}")
        
        if "overall_progress" in result:
            progress = result["overall_progress"]
            print(f"   총 세션: {progress['total_sessions']}")
            print(f"   총 시간: {progress['total_time']}분")

if __name__ == "__main__":
    test_practice_plan_service()
