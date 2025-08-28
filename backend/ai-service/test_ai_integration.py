#!/usr/bin/env python3
"""
AI 기반 서비스 통합 테스트 스크립트
"""

import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from services.ai_composition import AICompositionService
from services.corpus_integration import CorpusIntegrationService
from services.harmony_ai import HarmonyAIService

def test_ai_integration():
    """AI 기반 서비스 통합을 테스트합니다."""
    print("🤖 AI 기반 서비스 통합 테스트 시작\n")
    
    # 1. Harmony AI 서비스 테스트
    print("="*50)
    print("1. Harmony AI 서비스 테스트")
    print("="*50)
    
    try:
        harmony_ai = HarmonyAIService()
        print(f"✅ Harmony AI 서비스 초기화 성공")
        print(f"   AI 사용 가능: {harmony_ai.is_ai_available()}")
        print(f"   AI 상태: {harmony_ai.get_ai_status()}")
    except Exception as e:
        print(f"❌ Harmony AI 서비스 초기화 실패: {e}")
    
    # 2. 코퍼스 통합 서비스 테스트
    print("\n" + "="*50)
    print("2. 코퍼스 통합 서비스 테스트")
    print("="*50)
    
    try:
        corpus_integration = CorpusIntegrationService()
        print(f"✅ 코퍼스 통합 서비스 초기화 성공")
        print(f"   코퍼스 사용 가능: {corpus_integration.corpus_available}")
    except Exception as e:
        print(f"❌ 코퍼스 통합 서비스 초기화 실패: {e}")
    
    # 3. AI Composition 서비스 테스트
    print("\n" + "="*50)
    print("3. AI Composition 서비스 테스트")
    print("="*50)
    
    try:
        composition_service = AICompositionService()
        print(f"✅ AI Composition 서비스 초기화 성공")
        
        # 서비스 상태 확인
        status = composition_service.get_service_status()
        print(f"   AI 사용 가능: {status['ai_available']}")
        print(f"   코퍼스 사용 가능: {status['corpus_available']}")
        print(f"   서비스 모드: {status['service_mode']}")
        
        # AI 기반 화성 진행 생성 테스트
        print("\n🎵 AI 기반 화성 진행 생성 테스트")
        result = composition_service.suggest_harmony_progression(
            style="classical",
            difficulty="intermediate",
            length=6,
            mood="happy"
        )
        
        if "error" in result:
            print(f"❌ 화성 진행 생성 실패: {result['error']}")
        else:
            print(f"✅ 화성 진행 생성 성공")
            print(f"   패턴: {result['pattern_name']}")
            print(f"   화성: {' - '.join(result['chords'])}")
            print(f"   소스: {result['source']}")
            print(f"   설명: {result['description']}")
        
    except Exception as e:
        print(f"❌ AI Composition 서비스 초기화 실패: {e}")
    
    # 4. 다양한 스타일 테스트
    print("\n" + "="*50)
    print("4. 다양한 스타일 테스트")
    print("="*50)
    
    styles = ["classical", "jazz", "pop"]
    difficulties = ["beginner", "intermediate"]
    
    for style in styles:
        for difficulty in difficulties:
            try:
                print(f"\n🎵 {style.title()} 스타일, {difficulty} 난이도")
                result = composition_service.suggest_harmony_progression(
                    style=style,
                    difficulty=difficulty,
                    length=4,
                    mood="neutral"
                )
                
                if "error" not in result:
                    print(f"   ✅ 성공: {' - '.join(result['chords'])} (소스: {result['source']})")
                else:
                    print(f"   ❌ 실패: {result['error']}")
                    
            except Exception as e:
                print(f"   ❌ 오류: {e}")
    
    print("\n🎉 AI 기반 서비스 통합 테스트 완료!")

def test_ai_vs_fallback():
    """AI 모드와 폴백 모드의 차이를 테스트합니다."""
    print("\n" + "="*50)
    print("AI vs 폴백 모드 비교 테스트")
    print("="*50)
    
    try:
        composition_service = AICompositionService()
        
        # 동일한 요청으로 AI와 폴백 모드 비교
        request_params = {
            "style": "classical",
            "difficulty": "intermediate",
            "length": 6,
            "mood": "mysterious"
        }
        
        print("🎵 동일한 요청으로 AI vs 폴백 모드 비교")
        result = composition_service.suggest_harmony_progression(**request_params)
        
        if "error" not in result:
            print(f"   결과: {' - '.join(result['chords'])}")
            print(f"   소스: {result['source']}")
            print(f"   패턴: {result['pattern_name']}")
            
            if "ai_confidence" in result:
                print(f"   AI 신뢰도: {result['ai_confidence']}")
        else:
            print(f"   오류: {result['error']}")
            
    except Exception as e:
        print(f"❌ 비교 테스트 실패: {e}")

if __name__ == "__main__":
    test_ai_integration()
    test_ai_vs_fallback()
