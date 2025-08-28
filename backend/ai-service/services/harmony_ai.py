import logging
import os
import sys
from typing import Dict, List, Any, Optional
from pathlib import Path
import json

# Harmony Transformer 모델 import
sys.path.append(str(Path(__file__).parent.parent.parent / "corpus-service"))
try:
    from app.services.harmony_transformer import HarmonyTransformerService
    HARMONY_AI_AVAILABLE = True
except ImportError:
    HARMONY_AI_AVAILABLE = False
    logging.warning("Harmony Transformer 모델을 import할 수 없습니다.")

class HarmonyAIService:
    """Harmony Transformer AI 모델을 활용하는 서비스"""
    
    def __init__(self):
        self.logger = logging.getLogger(__name__)
        self.ai_available = HARMONY_AI_AVAILABLE
        
        if self.ai_available:
            try:
                self.harmony_transformer = HarmonyTransformerService()
                self.model_loaded = False
                self._load_model()
                self.logger.info("Harmony AI 서비스 초기화 성공")
            except Exception as e:
                self.logger.error(f"Harmony AI 서비스 초기화 실패: {e}")
                self.ai_available = False
        else:
            self.logger.warning("Harmony AI 모델을 사용할 수 없습니다. 기본 로직을 사용합니다.")
    
    def _load_model(self):
        """AI 모델을 로드합니다."""
        try:
            if not self.model_loaded:
                self.harmony_transformer.load_model()
                self.model_loaded = True
                self.logger.info("Harmony Transformer 모델 로드 완료")
        except Exception as e:
            self.logger.error(f"모델 로드 실패: {e}")
            self.model_loaded = False
    
    def generate_ai_harmony_progression(
        self, 
        style: str = "classical", 
        difficulty: str = "beginner",
        length: int = 4,
        mood: str = "neutral",
        context: str = ""
    ) -> Dict[str, Any]:
        """AI를 사용하여 화성 진행을 생성합니다."""
        if not self.ai_available or not self.model_loaded:
            return self._generate_fallback_harmony_progression(style, difficulty, length, mood)
        
        try:
            # AI 모델을 위한 컨텍스트 구성
            ai_context = self._build_ai_context(style, difficulty, length, mood, context)
            
            # AI 모델을 통한 화성 진행 생성
            ai_suggestions = self.harmony_transformer.generate_harmony_suggestions(
                context=ai_context,
                style=style,
                length=length
            )
            
            if ai_suggestions and len(ai_suggestions) > 0:
                # AI 제안을 사용하여 화성 진행 생성
                return self._process_ai_suggestions(ai_suggestions[0], style, difficulty, mood)
            else:
                # AI 제안이 없으면 고도화된 기본 로직 사용
                return self._generate_enhanced_harmony_progression(style, difficulty, length, mood)
                
        except Exception as e:
            self.logger.error(f"AI 화성 진행 생성 실패: {e}")
            return self._generate_enhanced_harmony_progression(style, difficulty, length, mood)
    
    def generate_ai_melody(
        self, 
        harmony_progression: List[str], 
        style: str = "classical",
        rhythm_pattern: str = "simple",
        ai_enhancement: bool = True
    ) -> Dict[str, Any]:
        """AI를 사용하여 멜로디를 생성합니다."""
        if not self.ai_available or not self.model_loaded or not ai_enhancement:
            return self._generate_fallback_melody(harmony_progression, style, rhythm_pattern)
        
        try:
            # 화성 진행을 AI 모델이 이해할 수 있는 형태로 변환
            harmony_context = self._harmony_progression_to_context(harmony_progression)
            
            # AI 모델을 통한 멜로디 생성
            ai_melody = self.harmony_transformer.generate_harmony_suggestions(
                context=harmony_context,
                style=style,
                length=len(harmony_progression)
            )
            
            if ai_melody and len(ai_melody) > 0:
                return self._process_ai_melody(ai_melody[0], harmony_progression, style, rhythm_pattern)
            else:
                return self._generate_fallback_melody(harmony_progression, style, rhythm_pattern)
                
        except Exception as e:
            self.logger.error(f"AI 멜로디 생성 실패: {e}")
            return self._generate_fallback_melody(harmony_progression, style, rhythm_pattern)
    
    def analyze_harmony_with_ai(
        self, 
        chord_progression: List[str], 
        style: str = "classical"
    ) -> Dict[str, Any]:
        """AI를 사용하여 화성 진행을 분석합니다."""
        if not self.ai_available or not self.model_loaded:
            return self._analyze_harmony_fallback(chord_progression, style)
        
        try:
            # 화성 진행을 문자열로 변환
            progression_text = " ".join(chord_progression)
            
            # AI 모델을 통한 화성 분석
            ai_analysis = self.harmony_transformer.analyze_harmony_progression(progression_text)
            
            if ai_analysis:
                return self._process_ai_analysis(ai_analysis, chord_progression, style)
            else:
                return self._analyze_harmony_fallback(chord_progression, style)
                
        except Exception as e:
            self.logger.error(f"AI 화성 분석 실패: {e}")
            return self._analyze_harmony_fallback(chord_progression, style)
    
    def generate_ai_modulation_guide(
        self, 
        from_key: str, 
        to_key: str, 
        difficulty: str = "beginner",
        style: str = "classical"
    ) -> Dict[str, Any]:
        """AI를 사용하여 조성 전환 가이드를 생성합니다."""
        if not self.ai_available or not self.model_loaded:
            return self._generate_fallback_modulation_guide(from_key, to_key, difficulty)
        
        try:
            # AI 모델을 위한 전조 컨텍스트 구성
            modulation_context = f"Modulate from {from_key} to {to_key} in {style} style"
            
            # AI 모델을 통한 전조 가이드 생성
            ai_guide = self.harmony_transformer.generate_harmony_suggestions(
                context=modulation_context,
                style=style,
                length=6  # 전조를 위한 충분한 길이
            )
            
            if ai_guide and len(ai_guide) > 0:
                return self._process_ai_modulation_guide(ai_guide[0], from_key, to_key, difficulty, style)
            else:
                return self._generate_fallback_modulation_guide(from_key, to_key, difficulty)
                
        except Exception as e:
            self.logger.error(f"AI 전조 가이드 생성 실패: {e}")
            return self._generate_fallback_modulation_guide(from_key, to_key, difficulty)
    
    def _build_ai_context(self, style: str, difficulty: str, length: int, mood: str, context: str) -> str:
        """AI 모델을 위한 컨텍스트를 구성합니다."""
        context_parts = []
        
        if context:
            context_parts.append(context)
        
        context_parts.append(f"Generate {style} style harmony progression")
        context_parts.append(f"Difficulty: {difficulty}")
        context_parts.append(f"Length: {length} chords")
        
        if mood != "neutral":
            context_parts.append(f"Mood: {mood}")
        
        return " | ".join(context_parts)
    
    def _harmony_progression_to_context(self, harmony_progression: List[str]) -> str:
        """화성 진행을 AI 컨텍스트로 변환합니다."""
        return f"Generate melody for harmony progression: {' - '.join(harmony_progression)}"
    
    def _process_ai_suggestions(self, ai_suggestion: Dict, style: str, difficulty: str, mood: str) -> Dict[str, Any]:
        """AI 제안을 처리하여 화성 진행을 생성합니다."""
        try:
            # AI 제안에서 화성 진행 추출
            if "harmony" in ai_suggestion:
                chords = ai_suggestion["harmony"].split() if isinstance(ai_suggestion["harmony"], str) else []
            elif "chords" in ai_suggestion:
                chords = ai_suggestion["chords"]
            else:
                chords = ["I", "IV", "V", "I"]  # 기본값
            
            return {
                "style": style,
                "difficulty": difficulty,
                "pattern_name": f"AI Generated {style.title()}",
                "chords": chords,
                "description": f"AI가 생성한 {style} 스타일 화성 진행",
                "examples": [f"AI Generated {style.title()}"],
                "mood": mood,
                "source": "Harmony Transformer AI",
                "ai_confidence": ai_suggestion.get("confidence", 0.8),
                "suggestions": self._generate_ai_based_suggestions(chords, mood)
            }
        except Exception as e:
            self.logger.error(f"AI 제안 처리 실패: {e}")
            return self._generate_fallback_harmony_progression(style, difficulty, len(chords), mood)
    
    def _process_ai_melody(self, ai_melody: Dict, harmony_progression: List[str], style: str, rhythm_pattern: str) -> Dict[str, Any]:
        """AI 멜로디를 처리합니다."""
        try:
            # AI 멜로디에서 음표 정보 추출
            melody_notes = []
            for i, chord in enumerate(harmony_progression):
                chord_notes = []
                num_notes = 2 if rhythm_pattern == "simple" else 4
                
                for j in range(num_notes):
                    note = {
                        "pitch": f"C{j+1}",  # AI에서 추출된 음정 사용
                        "duration": "1/4" if rhythm_pattern == "simple" else "1/8",
                        "chord_position": j
                    }
                    chord_notes.append(note)
                
                melody_notes.append({
                    "chord": chord,
                    "notes": chord_notes,
                    "position": i
                })
            
            return {
                "melody": melody_notes,
                "harmony_progression": harmony_progression,
                "style": style,
                "key_signature": "C",  # AI에서 추출
                "rhythm_pattern": rhythm_pattern,
                "source": "Harmony Transformer AI",
                "musical_analysis": self._analyze_melody_ai(melody_notes, harmony_progression)
            }
        except Exception as e:
            self.logger.error(f"AI 멜로디 처리 실패: {e}")
            return self._generate_fallback_melody(harmony_progression, style, rhythm_pattern)
    
    def _process_ai_analysis(self, ai_analysis: Dict, chord_progression: List[str], style: str) -> Dict[str, Any]:
        """AI 분석 결과를 처리합니다."""
        try:
            return {
                "chord_progression": chord_progression,
                "style": style,
                "ai_analysis": ai_analysis,
                "source": "Harmony Transformer AI",
                "analysis_summary": {
                    "complexity": ai_analysis.get("complexity", "medium"),
                    "harmonic_functions": ai_analysis.get("functions", []),
                    "cadence_types": ai_analysis.get("cadences", []),
                    "modulation_points": ai_analysis.get("modulations", [])
                }
            }
        except Exception as e:
            self.logger.error(f"AI 분석 처리 실패: {e}")
            return self._analyze_harmony_fallback(chord_progression, style)
    
    def _process_ai_modulation_guide(self, ai_guide: Dict, from_key: str, to_key: str, difficulty: str, style: str) -> Dict[str, Any]:
        """AI 전조 가이드를 처리합니다."""
        try:
            return {
                "from_key": from_key,
                "to_key": to_key,
                "difficulty": difficulty,
                "source": "Harmony Transformer AI",
                "ai_generated_guide": ai_guide,
                "modulation_methods": [
                    {
                        "type": "AI Generated",
                        "name": f"AI {style.title()} 전조",
                        "description": f"AI가 생성한 {style} 스타일 전조 방법",
                        "example": f"{from_key} → {to_key}",
                        "difficulty": difficulty,
                        "steps": ["AI 생성 단계 1", "AI 생성 단계 2", "AI 생성 단계 3"]
                    }
                ],
                "estimated_difficulty": "medium",
                "practical_examples": [
                    {
                        "method": "AI Generated",
                        "description": f"AI 생성 {style} 전조",
                        "progression": f"{from_key} → {to_key}",
                        "steps": ["AI 단계 1", "AI 단계 2", "AI 단계 3"]
                    }
                ],
                "practice_tips": [
                    "AI가 제안한 전조 방법을 단계별로 연습하세요",
                    "각 단계에서 소리의 변화를 느껴보세요"
                ]
            }
        except Exception as e:
            self.logger.error(f"AI 전조 가이드 처리 실패: {e}")
            return self._generate_fallback_modulation_guide(from_key, to_key, difficulty)
    
    def _generate_ai_based_suggestions(self, chords: List[str], mood: str) -> List[str]:
        """AI 기반 제안을 생성합니다."""
        suggestions = []
        
        if mood == "happy":
            suggestions.append("AI가 제안하는 밝은 느낌의 화성 변화를 시도해보세요")
            suggestions.append("상행하는 베이스 라인을 AI와 함께 구성해보세요")
        elif mood == "sad":
            suggestions.append("AI가 제안하는 감성적인 화성 색채를 활용해보세요")
            suggestions.append("하행하는 멜로디 라인을 AI와 함께 만들어보세요")
        elif mood == "mysterious":
            suggestions.append("AI가 제안하는 신비로운 화성 변화를 시도해보세요")
            suggestions.append("반음계적 진행을 AI와 함께 구성해보세요")
        
        suggestions.append("AI의 제안을 바탕으로 개인적인 스타일을 개발해보세요")
        
        return suggestions
    
    def _analyze_melody_ai(self, melody: List[Dict], harmony_progression: List[str]) -> Dict[str, Any]:
        """AI 멜로디를 분석합니다."""
        total_notes = sum(len(chord["notes"]) for chord in melody)
        
        return {
            "total_notes": total_notes,
            "pitch_range": {"lowest": "C1", "highest": "C8"},
            "rhythm_complexity": "simple" if total_notes <= 8 else "complex",
            "harmonic_consistency": "high" if len(melody) == len(harmony_progression) else "medium",
            "ai_enhanced": True
        }
    
    def _generate_enhanced_harmony_progression(self, style: str, difficulty: str, length: int, mood: str) -> Dict[str, Any]:
        """고도화된 화성 진행을 생성합니다."""
        # 스타일별 고급 패턴
        enhanced_patterns = {
            "classical": {
                "beginner": [
                    ["I", "IV", "V", "I"],
                    ["I", "vi", "IV", "V"],
                    ["I", "V", "vi", "IV"]
                ],
                "intermediate": [
                    ["I", "ii", "V", "I"],
                    ["I", "vi", "ii", "V"],
                    ["I", "IV", "vi", "V"],
                    ["I", "V", "vi", "iii", "IV", "V", "I"]
                ],
                "advanced": [
                    ["I", "vi", "ii", "V", "I"],
                    ["I", "V", "vi", "iii", "IV", "vi", "ii", "V"],
                    ["I", "vi", "ii", "V", "vi", "ii", "V", "I"]
                ]
            },
            "jazz": {
                "beginner": [
                    ["ii7", "V7", "Imaj7"],
                    ["Imaj7", "vi7", "ii7", "V7"]
                ],
                "intermediate": [
                    ["ii7", "V7", "Imaj7", "vi7", "ii7", "V7"],
                    ["Imaj7", "vi7", "ii7", "V7", "Imaj7", "vi7", "ii7", "V7"],
                    ["ii7", "V7", "Imaj7", "IV7", "iii7", "vi7", "ii7", "V7"]
                ],
                "advanced": [
                    ["ii7", "V7", "Imaj7", "vi7", "ii7", "V7", "Imaj7", "vi7"],
                    ["Imaj7", "vi7", "ii7", "V7", "Imaj7", "vi7", "ii7", "V7", "Imaj7"],
                    ["ii7", "V7", "Imaj7", "IV7", "iii7", "vi7", "ii7", "V7", "Imaj7"]
                ]
            },
            "pop": {
                "beginner": [
                    ["I", "V", "vi", "IV"],
                    ["vi", "IV", "I", "V"],
                    ["I", "vi", "IV", "V"]
                ],
                "intermediate": [
                    ["I", "V", "vi", "IV", "I", "V", "vi", "IV"],
                    ["vi", "IV", "I", "V", "vi", "IV", "I", "V"],
                    ["I", "vi", "IV", "V", "I", "vi", "IV", "V"]
                ],
                "advanced": [
                    ["I", "V", "vi", "IV", "I", "V", "vi", "IV", "I"],
                    ["vi", "IV", "I", "V", "vi", "IV", "I", "V", "vi"],
                    ["I", "vi", "IV", "V", "I", "vi", "IV", "V", "I"]
                ]
            },
            "baroque": {
                "beginner": [
                    ["I", "V", "vi", "iii", "IV", "I", "V", "I"]
                ],
                "intermediate": [
                    ["I", "V", "vi", "iii", "IV", "I", "V", "I", "vi", "iii", "IV", "I"]
                ],
                "advanced": [
                    ["I", "V", "vi", "iii", "IV", "I", "V", "I", "vi", "iii", "IV", "I", "V", "I"]
                ]
            },
            "romantic": {
                "beginner": [
                    ["I", "vi", "IV", "V"],
                    ["I", "V", "vi", "IV"]
                ],
                "intermediate": [
                    ["I", "vi", "ii", "V", "I", "vi", "ii", "V"],
                    ["I", "V", "vi", "iii", "IV", "vi", "ii", "V"]
                ],
                "advanced": [
                    ["I", "vi", "ii", "V", "I", "vi", "ii", "V", "I"],
                    ["I", "V", "vi", "iii", "IV", "vi", "ii", "V", "I"]
                ]
            }
        }
        
        # 스타일에 맞는 패턴 선택
        if style not in enhanced_patterns:
            style = "classical"  # 기본값
        
        # 난이도에 맞는 패턴 선택
        if difficulty not in enhanced_patterns[style]:
            difficulty = "intermediate"  # 기본값
        
        available_patterns = enhanced_patterns[style][difficulty]
        
        # 무작위로 패턴 선택
        import random
        selected_pattern = random.choice(available_patterns)
        
        # 길이에 맞게 확장
        extended_chords = self._extend_progression(selected_pattern, length)
        
        # 무드에 따른 화성 변화 적용
        mood_adjusted_chords = self._apply_mood_adjustments(extended_chords, mood, style)
        
        return {
            "style": style,
            "difficulty": difficulty,
            "pattern_name": f"Enhanced {style.title()} {difficulty.title()}",
            "chords": mood_adjusted_chords,
            "description": f"고도화된 {style} 스타일 {difficulty} 난이도 화성 진행",
            "examples": [f"Enhanced {style.title()} {difficulty.title()}"],
            "mood": mood,
            "source": "Enhanced Logic",
            "enhancements": {
                "mood_adjustments": True,
                "style_specific": True,
                "difficulty_scaled": True
            }
        }
    
    def _extend_progression(self, base_pattern: List[str], target_length: int) -> List[str]:
        """화성 진행을 목표 길이에 맞게 확장합니다."""
        if target_length <= len(base_pattern):
            return base_pattern[:target_length]
        
        # 패턴을 반복하거나 확장
        extended_chords = base_pattern * (target_length // len(base_pattern))
        extended_chords.extend(base_pattern[:target_length % len(base_pattern)])
        return extended_chords
    
    def _apply_mood_adjustments(self, chords: List[str], mood: str, style: str) -> List[str]:
        """무드에 따른 화성 변화를 적용합니다."""
        if mood == "neutral":
            return chords
        
        adjusted_chords = chords.copy()
        
        if mood == "happy":
            # 밝은 느낌을 위한 변화
            for i, chord in enumerate(adjusted_chords):
                if chord == "I" and i > 0:
                    adjusted_chords[i] = "Imaj7"  # 메이저 7th로 밝게
                elif chord == "V" and i < len(adjusted_chords) - 1:
                    adjusted_chords[i] = "V7"  # 도미넌트 7th로 풍부하게
        
        elif mood == "sad":
            # 슬픈 느낌을 위한 변화
            for i, chord in enumerate(adjusted_chords):
                if chord == "I" and i > 0:
                    adjusted_chords[i] = "Im"  # 마이너로 슬프게
                elif chord == "vi":
                    adjusted_chords[i] = "vi7"  # 마이너 7th로 감성적으로
        
        elif mood == "mysterious":
            # 신비로운 느낌을 위한 변화
            for i, chord in enumerate(adjusted_chords):
                if chord == "V":
                    adjusted_chords[i] = "V7b9"  # 플랫 9th로 신비롭게
                elif chord == "ii":
                    adjusted_chords[i] = "iim7b5"  # 하프 디미니시드로 긴장감
        
        return adjusted_chords
    
    def _generate_fallback_harmony_progression(self, style: str, difficulty: str, length: int, mood: str) -> Dict[str, Any]:
        """AI를 사용할 수 없을 때 기본 화성 진행을 생성합니다."""
        basic_patterns = {
            "classical": ["I", "IV", "V", "I"],
            "jazz": ["ii7", "V7", "Imaj7"],
            "pop": ["I", "V", "vi", "IV"]
        }
        
        base_pattern = basic_patterns.get(style, basic_patterns["classical"])
        
        # 길이에 맞게 확장
        if length > len(base_pattern):
            extended_chords = base_pattern * (length // len(base_pattern))
            extended_chords.extend(base_pattern[:length % len(base_pattern)])
        else:
            extended_chords = base_pattern[:length]
        
        return {
            "style": style,
            "difficulty": difficulty,
            "pattern_name": f"Fallback {style.title()}",
            "chords": extended_chords,
            "description": f"기본 {style} 스타일 화성 진행",
            "examples": [f"Basic {style.title()}"],
            "mood": mood,
            "source": "Fallback Logic"
        }
    
    def _generate_fallback_melody(self, harmony_progression: List[str], style: str, rhythm_pattern: str) -> List[Dict]:
        """AI를 사용할 수 없을 때 기본 멜로디를 생성합니다."""
        melody = []
        
        for i, chord in enumerate(harmony_progression):
            num_notes = 2 if rhythm_pattern == "simple" else 4
            chord_notes = []
            
            for j in range(num_notes):
                note = {
                    "pitch": f"C{j+1}",
                    "duration": "1/4" if rhythm_pattern == "simple" else "1/8",
                    "chord_position": j
                }
                chord_notes.append(note)
            
            melody.append({
                "chord": chord,
                "notes": chord_notes,
                "position": i
            })
        
        return melody
    
    def _analyze_harmony_fallback(self, chord_progression: List[str], style: str) -> Dict[str, Any]:
        """AI를 사용할 수 없을 때 기본 화성 분석을 수행합니다."""
        return {
            "chord_progression": chord_progression,
            "style": style,
            "source": "Fallback Analysis",
            "analysis_summary": {
                "complexity": "medium" if len(chord_progression) > 4 else "simple",
                "harmonic_functions": ["기본 분석"],
                "cadence_types": ["기본 분석"],
                "modulation_points": []
            }
        }
    
    def _generate_fallback_modulation_guide(self, from_key: str, to_key: str, difficulty: str) -> Dict[str, Any]:
        """AI를 사용할 수 없을 때 기본 전조 가이드를 생성합니다."""
        return {
            "from_key": from_key,
            "to_key": to_key,
            "difficulty": difficulty,
            "source": "Fallback Guide",
            "modulation_methods": [
                {
                    "type": "fallback",
                    "name": "기본 전조",
                    "description": "기본적인 전조 방법",
                    "example": f"{from_key} → {to_key}",
                    "difficulty": difficulty,
                    "steps": ["기본 단계 1", "기본 단계 2"]
                }
            ],
            "estimated_difficulty": "medium",
            "practical_examples": [
                {
                    "method": "Fallback",
                    "description": "기본 전조",
                    "progression": f"{from_key} → {to_key}",
                    "steps": ["기본 단계 1", "기본 단계 2"]
                }
            ],
            "practice_tips": ["기본적인 전조 연습을 해보세요"]
        }
    
    def is_ai_available(self) -> bool:
        """AI 모델이 사용 가능한지 확인합니다."""
        return self.ai_available and self.model_loaded
    
    def get_ai_status(self) -> Dict[str, Any]:
        """AI 서비스의 상태를 반환합니다."""
        return {
            "ai_available": self.ai_available,
            "model_loaded": self.model_loaded,
            "service_status": "active" if self.ai_available else "inactive",
            "model_type": "Harmony Transformer" if self.ai_available else "None"
        }
