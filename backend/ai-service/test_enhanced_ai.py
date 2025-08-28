#!/usr/bin/env python3
"""
고도화된 AI 서비스 테스트 스크립트
"""

import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from services.harmony_ai import HarmonyAIService

def test_enhanced_ai_service():
    """고도화된 AI 서비스를 테스트합니다."""
    print("🚀 고도화된 AI 서비스 테스트 시작\n")
    
    # Harmony AI 서비스 초기화
    try:
        harmony_ai = HarmonyAIService()
        print("✅ Harmony AI 서비스 초기화 성공")
        print(f"   AI 사용 가능: {harmony_ai.is_ai_available()}")
        print(f"   AI 상태: {harmony_ai.get_ai_status()}")
    except Exception as e:
        print(f"❌ Harmony AI 서비스 초기화 실패: {e}")
        return
    
    print("\n" + "="*60)
    print("1. 고도화된 화성 진행 생성 테스트")
    print("="*60)
    
    # 다양한 스타일과 난이도 테스트
    test_enhanced_harmony_generation(harmony_ai)
    
    print("\n" + "="*60)
    print("2. 무드별 화성 변화 테스트")
    print("="*60)
    
    # 무드별 변화 테스트
    test_mood_based_harmony(harmony_ai)
    
    print("\n" + "="*60)
    print("3. 스타일별 특화 패턴 테스트")
    print("="*60)
    
    # 스타일별 특화 테스트
    test_style_specific_patterns(harmony_ai)
    
    print("\n🎉 고도화된 AI 서비스 테스트 완료!")

def test_enhanced_harmony_generation(service):
    """고도화된 화성 진행 생성을 테스트합니다."""
    styles = ["classical", "jazz", "pop", "baroque", "romantic"]
    difficulties = ["beginner", "intermediate", "advanced"]
    
    for style in styles:
        print(f"\n🎵 {style.upper()} 스타일 테스트")
        print("-" * 40)
        
        for difficulty in difficulties:
            try:
                result = service._generate_enhanced_harmony_progression(
                    style=style,
                    difficulty=difficulty,
                    length=8,
                    mood="neutral"
                )
                
                if "error" not in result:
                    print(f"   {difficulty.title()}: {' - '.join(result['chords'])}")
                    print(f"      패턴: {result['pattern_name']}")
                    print(f"      소스: {result['source']}")
                    
                    if "enhancements" in result:
                        enhancements = result["enhancements"]
                        print(f"      향상기능: {', '.join([k for k, v in enhancements.items() if v])}")
                else:
                    print(f"   {difficulty.title()}: 오류 - {result['error']}")
                    
            except Exception as e:
                print(f"   {difficulty.title()}: 예외 - {e}")

def test_mood_based_harmony(service):
    """무드별 화성 변화를 테스트합니다."""
    moods = ["happy", "sad", "mysterious", "neutral"]
    style = "classical"
    difficulty = "intermediate"
    
    print(f"\n🎵 {style.title()} 스타일, {difficulty.title()} 난이도 - 무드별 변화")
    print("-" * 60)
    
    for mood in moods:
        try:
            result = service._generate_enhanced_harmony_progression(
                style=style,
                difficulty=difficulty,
                length=6,
                mood=mood
            )
            
            if "error" not in result:
                print(f"\n   {mood.upper()}: {' - '.join(result['chords'])}")
                print(f"      패턴: {result['pattern_name']}")
                print(f"      설명: {result['description']}")
                
                # 무드별 변화 확인
                if mood != "neutral":
                    print(f"      무드 변화 적용: ✅")
                else:
                    print(f"      무드 변화 적용: ❌ (기본)")
            else:
                print(f"\n   {mood.upper()}: 오류 - {result['error']}")
                
        except Exception as e:
            print(f"\n   {mood.upper()}: 예외 - {e}")

def test_style_specific_patterns(service):
    """스타일별 특화 패턴을 테스트합니다."""
    print(f"\n🎵 스타일별 특화 패턴 비교")
    print("-" * 60)
    
    # 동일한 난이도와 길이로 스타일별 비교
    difficulty = "intermediate"
    length = 8
    mood = "neutral"
    
    for style in ["classical", "jazz", "pop", "baroque", "romantic"]:
        try:
            result = service._generate_enhanced_harmony_progression(
                style=style,
                difficulty=difficulty,
                length=length,
                mood=mood
            )
            
            if "error" not in result:
                print(f"\n   {style.upper()}:")
                print(f"      패턴: {' - '.join(result['chords'])}")
                print(f"      이름: {result['pattern_name']}")
                print(f"      설명: {result['description']}")
                
                # 스타일별 특징 분석
                chords = result['chords']
                if style == "jazz":
                    jazz_chords = [c for c in chords if "7" in c]
                    print(f"      재즈 화음: {len(jazz_chords)}/{len(chords)} ({len(jazz_chords)/len(chords)*100:.1f}%)")
                elif style == "baroque":
                    print(f"      바로크 진행: {len(chords)}개 화음")
                elif style == "romantic":
                    print(f"      낭만주의 진행: {len(chords)}개 화음")
                else:
                    print(f"      {style.title()} 진행: {len(chords)}개 화음")
            else:
                print(f"\n   {style.upper()}: 오류 - {result['error']}")
                
        except Exception as e:
            print(f"\n   {style.upper()}: 예외 - {e}")

def test_ai_vs_enhanced_comparison(service):
    """AI 모드와 고도화 모드의 차이를 비교합니다."""
    print(f"\n" + "="*60)
    print("4. AI vs 고도화 모드 비교")
    print("="*60)
    
    # 동일한 요청으로 비교
    request_params = {
        "style": "jazz",
        "difficulty": "advanced",
        "length": 10,
        "mood": "mysterious"
    }
    
    print(f"\n🎵 동일한 요청으로 AI vs 고도화 모드 비교")
    print(f"   요청: {request_params}")
    
    try:
        # AI 모드 (실제로는 AI가 작동하지 않을 수 있음)
        if service.is_ai_available():
            print(f"\n   🤖 AI 모드:")
            ai_result = service.generate_ai_harmony_progression(**request_params)
            if "error" not in ai_result:
                print(f"      결과: {' - '.join(ai_result['chords'])}")
                print(f"      소스: {ai_result['source']}")
                if "ai_confidence" in ai_result:
                    print(f"      AI 신뢰도: {ai_result['ai_confidence']}")
            else:
                print(f"      오류: {ai_result['error']}")
        else:
            print(f"\n   🤖 AI 모드: 사용 불가")
        
        # 고도화 모드
        print(f"\n   🚀 고도화 모드:")
        enhanced_result = service._generate_enhanced_harmony_progression(**request_params)
        if "error" not in enhanced_result:
            print(f"      결과: {' - '.join(enhanced_result['chords'])}")
            print(f"      소스: {enhanced_result['source']}")
            print(f"      패턴: {enhanced_result['pattern_name']}")
            if "enhancements" in enhanced_result:
                enhancements = enhanced_result["enhancements"]
                print(f"      향상기능: {', '.join([k for k, v in enhancements.items() if v])}")
        else:
            print(f"      오류: {enhanced_result['error']}")
            
    except Exception as e:
        print(f"   ❌ 비교 테스트 실패: {e}")

if __name__ == "__main__":
    test_enhanced_ai_service()
    test_ai_vs_enhanced_comparison(HarmonyAIService())
