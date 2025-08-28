import logging
from typing import Dict, List, Any, Optional
import json
import os
from datetime import datetime
from .corpus_integration import CorpusIntegrationService
from .harmony_ai import HarmonyAIService

class AICompositionService:
    """AI 작곡 어시스턴트 서비스"""
    
    def __init__(self):
        self.logger = logging.getLogger(__name__)
        
        # AI 서비스 초기화
        self.harmony_ai = HarmonyAIService()
        self.corpus_integration = CorpusIntegrationService()
        
        # AI 상태 확인
        self.ai_available = self.harmony_ai.is_ai_available()
        self.corpus_available = self.corpus_integration.corpus_available
        
        if self.ai_available:
            self.logger.info("AI Composition Service: Harmony AI 모델 사용 가능")
        else:
            self.logger.warning("AI Composition Service: Harmony AI 모델 사용 불가, 기본 로직 사용")
        
        if self.corpus_available:
            self.logger.info("AI Composition Service: When-in-Rome 코퍼스 사용 가능")
        else:
            self.logger.warning("AI Composition Service: When-in-Rome 코퍼스 사용 불가, 기본 데이터 사용")
        
        # 기본 데이터 (AI/코퍼스를 사용할 수 없을 때)
        self.fallback_harmony_patterns = self._load_fallback_harmony_patterns()
        self.fallback_melody_templates = self._load_fallback_melody_templates()
        self.fallback_modulation_guides = self._load_fallback_modulation_guides()
    
    def _load_harmony_patterns(self) -> Dict[str, List[Dict]]:
        """화성 진행 패턴을 로드합니다."""
        try:
            # When-in-Rome 코퍼스 기반 화성 패턴
            return {
                "classical": [
                    {
                        "name": "I-IV-V-I",
                        "chords": ["I", "IV", "V", "I"],
                        "difficulty": "beginner",
                        "description": "기본적인 화성 진행으로 많은 클래식 곡에서 사용",
                        "examples": ["Beethoven Symphony No.5", "Mozart Symphony No.40"]
                    },
                    {
                        "name": "ii-V-I",
                        "chords": ["ii", "V", "I"],
                        "difficulty": "intermediate",
                        "description": "재즈와 클래식에서 자주 사용되는 화성 진행",
                        "examples": ["Bach Prelude in C", "Chopin Nocturne"]
                    },
                    {
                        "name": "I-vi-ii-V",
                        "chords": ["I", "vi", "ii", "V"],
                        "difficulty": "intermediate",
                        "description": "감성적이고 부드러운 느낌의 진행",
                        "examples": ["Schubert Serenade", "Brahms Lullaby"]
                    }
                ],
                "jazz": [
                    {
                        "name": "ii7-V7-Imaj7",
                        "chords": ["ii7", "V7", "Imaj7"],
                        "difficulty": "intermediate",
                        "description": "재즈의 기본적인 2-5-1 진행",
                        "examples": ["Autumn Leaves", "Take Five"]
                    },
                    {
                        "name": "I7-IV7-iii7-VI7",
                        "chords": ["I7", "IV7", "iii7", "VI7"],
                        "difficulty": "advanced",
                        "description": "블루스 스타일의 화성 진행",
                        "examples": ["Blue Monk", "All Blues"]
                    }
                ],
                "pop": [
                    {
                        "name": "I-V-vi-IV",
                        "chords": ["I", "V", "vi", "IV"],
                        "difficulty": "beginner",
                        "description": "팝 음악에서 가장 인기 있는 진행",
                        "examples": ["Let It Be", "Someone Like You"]
                    },
                    {
                        "name": "vi-IV-I-V",
                        "chords": ["vi", "IV", "I", "V"],
                        "difficulty": "beginner",
                        "description": "감성적인 팝 발라드 진행",
                        "examples": ["Perfect", "All of Me"]
                    }
                ]
            }
        except Exception as e:
            self.logger.error(f"화성 패턴 로드 실패: {e}")
            return {}
    
    def _load_melody_templates(self) -> Dict[str, List[Dict]]:
        """멜로디 템플릿을 로드합니다."""
        return {
            "classical": [
                {
                    "name": "스케일 기반",
                    "description": "음계를 기반으로 한 자연스러운 멜로디",
                    "characteristics": ["단계적 진행", "부드러운 흐름", "기억하기 쉬움"],
                    "examples": ["Twinkle Twinkle", "Ode to Joy"]
                },
                {
                    "name": "아르페지오 기반",
                    "description": "화음의 구성음을 순차적으로 연주",
                    "characteristics": ["화성적 일관성", "기술적 연습", "아름다운 음향"],
                    "examples": ["Moonlight Sonata", "Für Elise"]
                }
            ],
            "jazz": [
                {
                    "name": "블루 노트",
                    "description": "블루스 스케일을 활용한 멜로디",
                    "characteristics": ["감성적 표현", "즉흥적 요소", "리듬감"],
                    "examples": ["Blue in Green", "So What"]
                }
            ],
            "pop": [
                {
                    "name": "후크 멜로디",
                    "description": "기억에 남는 짧고 강력한 멜로디",
                    "characteristics": ["반복성", "감정적 임팩트", "부르기 쉬움"],
                    "examples": ["Happy", "Uptown Funk"]
                }
            ]
        }
    
    def _load_modulation_guides(self) -> Dict[str, List[Dict]]:
        """조성 전환 가이드를 로드합니다."""
        return {
            "common_tone": [
                {
                    "name": "공통음 전조",
                    "description": "두 조성에서 공통되는 음을 통해 자연스럽게 전조",
                    "example": "C major → F major (C음이 공통)",
                    "difficulty": "beginner",
                    "steps": [
                        "공통음 찾기",
                        "새로운 조성의 화음으로 연결",
                        "새로운 조성에서 진행 완성"
                    ]
                }
            ],
            "pivot_chord": [
                {
                    "name": "피벗 화음 전조",
                    "description": "두 조성에서 공통되는 화음을 통해 전조",
                    "example": "C major의 IV → F major의 I",
                    "difficulty": "intermediate",
                    "steps": [
                        "피벗 화음 식별",
                        "새로운 조성에서의 기능 결정",
                        "부드러운 연결 진행"
                    ]
                }
            ],
            "chromatic": [
                {
                    "name": "반음계적 전조",
                    "description": "반음계적 진행을 통해 급격한 전조",
                    "example": "C major → C# major",
                    "difficulty": "advanced",
                    "steps": [
                        "반음계적 연결음 사용",
                        "새로운 조성의 도입",
                        "안정화 진행"
                    ]
                }
            ]
        }
    
    def suggest_harmony_progression(
        self, 
        style: str = "classical", 
        difficulty: str = "beginner",
        length: int = 4,
        mood: str = "neutral"
    ) -> Dict[str, Any]:
        """화성 진행을 제안합니다."""
        try:
            # 1순위: AI 모델 사용
            if self.ai_available:
                self.logger.info("AI 모델을 사용하여 화성 진행 생성")
                return self.harmony_ai.generate_ai_harmony_progression(
                    style=style, difficulty=difficulty, length=length, mood=mood
                )
            
            # 2순위: When-in-Rome 코퍼스 사용
            elif self.corpus_available:
                self.logger.info("When-in-Rome 코퍼스를 사용하여 화성 진행 생성")
                corpus_patterns = self.corpus_integration.get_harmony_patterns_from_corpus(style)
                
                if corpus_patterns and style in corpus_patterns and corpus_patterns[style]:
                    # 코퍼스에서 난이도에 맞는 패턴 선택
                    available_patterns = [
                        p for p in corpus_patterns[style] 
                        if p["difficulty"] == difficulty
                    ]
                    
                    if not available_patterns:
                        available_patterns = corpus_patterns[style]
                    
                    if available_patterns:
                        import random
                        selected_pattern = random.choice(available_patterns)
                        
                        # 길이에 맞게 확장
                        extended_chords = self._extend_chord_progression(
                            selected_pattern["chords"], length
                        )
                        
                        return {
                            "style": style,
                            "difficulty": difficulty,
                            "pattern_name": selected_pattern["name"],
                            "chords": extended_chords,
                            "description": selected_pattern["description"],
                            "examples": selected_pattern["examples"],
                            "mood": mood,
                            "source": "When-in-Rome Corpus",
                            "suggestions": self._generate_progression_suggestions(extended_chords, mood)
                        }
            
            # 3순위: 기본 데이터 사용
            self.logger.info("기본 데이터를 사용하여 화성 진행 생성")
            return self._generate_fallback_progression(style, difficulty, length, mood)
            
        except Exception as e:
            self.logger.error(f"화성 진행 제안 실패: {e}")
            return {"error": f"화성 진행 제안 중 오류 발생: {str(e)}"}
    
    def generate_melody(
        self, 
        harmony_progression: List[str], 
        style: str = "classical",
        rhythm_pattern: str = "simple"
    ) -> Dict[str, Any]:
        """화성 진행에 맞는 멜로디를 생성합니다."""
        try:
            # 화성 진행 분석
            key_signature = self._analyze_key_signature(harmony_progression)
            scale_notes = self._get_scale_notes(key_signature)
            
            # 스타일별 멜로디 생성 규칙
            if style == "classical":
                melody = self._generate_classical_melody(harmony_progression, scale_notes, rhythm_pattern)
            elif style == "jazz":
                melody = self._generate_jazz_melody(harmony_progression, scale_notes, rhythm_pattern)
            elif style == "pop":
                melody = self._generate_pop_melody(harmony_progression, scale_notes, rhythm_pattern)
            else:
                melody = self._generate_classical_melody(harmony_progression, scale_notes, rhythm_pattern)
            
            return {
                "melody": melody,
                "harmony_progression": harmony_progression,
                "style": style,
                "key_signature": key_signature,
                "rhythm_pattern": rhythm_pattern,
                "musical_analysis": self._analyze_melody(melody, harmony_progression)
            }
            
        except Exception as e:
            self.logger.error(f"멜로디 생성 실패: {e}")
            return {"error": f"멜로디 생성 중 오류 발생: {str(e)}"}
    
    def get_modulation_guide(
        self, 
        from_key: str, 
        to_key: str, 
        difficulty: str = "beginner"
    ) -> Dict[str, Any]:
        """조성 전환 가이드를 제공합니다."""
        try:
            # 전조 방법 찾기
            modulation_methods = []
            
            for method_type, methods in self.modulation_guides.items():
                for method in methods:
                    if method["difficulty"] == difficulty or difficulty == "all":
                        modulation_methods.append({
                            "type": method_type,
                            **method
                        })
            
            # 전조 난이도 분석
            modulation_difficulty = self._analyze_modulation_difficulty(from_key, to_key)
            
            # 구체적인 전조 예시 생성
            practical_examples = self._generate_modulation_examples(from_key, to_key, modulation_methods)
            
            return {
                "from_key": from_key,
                "to_key": to_key,
                "difficulty": difficulty,
                "modulation_methods": modulation_methods,
                "estimated_difficulty": modulation_difficulty,
                "practical_examples": practical_examples,
                "practice_tips": self._get_modulation_practice_tips(modulation_difficulty)
            }
            
        except Exception as e:
            self.logger.error(f"전조 가이드 생성 실패: {e}")
            return {"error": f"전조 가이드 생성 중 오류 발생: {str(e)}"}
    
    def _generate_progression_suggestions(self, chords: List[str], mood: str) -> List[str]:
        """화성 진행에 대한 추가 제안을 생성합니다."""
        suggestions = []
        
        if mood == "happy":
            suggestions.append("메이저 7th 화음을 추가하여 밝은 느낌을 강화하세요")
            suggestions.append("상행하는 베이스 라인을 사용하여 긍정적인 에너지를 표현하세요")
        elif mood == "sad":
            suggestions.append("마이너 7th 화음을 추가하여 감성적인 느낌을 강화하세요")
            suggestions.append("하행하는 베이스 라인을 사용하여 우울한 분위기를 표현하세요")
        elif mood == "mysterious":
            suggestions.append("감7화음을 사용하여 신비로운 분위기를 연출하세요")
            suggestions.append("반음계적 진행을 활용하여 긴장감을 조성하세요")
        
        return suggestions
    
    def _analyze_key_signature(self, harmony_progression: List[str]) -> str:
        """화성 진행에서 조성을 분석합니다."""
        # 간단한 조성 분석 (실제로는 더 복잡한 분석 필요)
        if "I" in harmony_progression:
            return "C"  # 기본값
        return "C"
    
    def _get_scale_notes(self, key_signature: str) -> List[str]:
        """조성에 따른 음계를 반환합니다."""
        scales = {
            "C": ["C", "D", "E", "F", "G", "A", "B"],
            "G": ["G", "A", "B", "C", "D", "E", "F#"],
            "F": ["F", "G", "A", "Bb", "C", "D", "E"]
        }
        return scales.get(key_signature, scales["C"])
    
    def _generate_classical_melody(self, harmony_progression: List[str], scale_notes: List[str], rhythm_pattern: str) -> List[Dict]:
        """클래식 스타일의 멜로디를 생성합니다."""
        melody = []
        
        for i, chord in enumerate(harmony_progression):
            # 각 화음에 2-4개의 음표 생성
            num_notes = 2 if rhythm_pattern == "simple" else 4
            
            chord_notes = []
            for j in range(num_notes):
                note = {
                    "pitch": scale_notes[j % len(scale_notes)],
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
    
    def _generate_jazz_melody(self, harmony_progression: List[str], scale_notes: List[str], rhythm_pattern: str) -> List[Dict]:
        """재즈 스타일의 멜로디를 생성합니다."""
        # 재즈 멜로디는 더 복잡한 리듬과 블루 노트 사용
        return self._generate_classical_melody(harmony_progression, scale_notes, rhythm_pattern)
    
    def _generate_pop_melody(self, harmony_progression: List[str], scale_notes: List[str], rhythm_pattern: str) -> List[Dict]:
        """팝 스타일의 멜로디를 생성합니다."""
        # 팝 멜로디는 단순하고 기억하기 쉬운 패턴
        return self._generate_classical_melody(harmony_progression, scale_notes, "simple")
    
    def _analyze_melody(self, melody: List[Dict], harmony_progression: List[str]) -> Dict[str, Any]:
        """생성된 멜로디를 분석합니다."""
        total_notes = sum(len(chord["notes"]) for chord in melody)
        pitch_range = self._calculate_pitch_range(melody)
        
        return {
            "total_notes": total_notes,
            "pitch_range": pitch_range,
            "rhythm_complexity": "simple" if total_notes <= 8 else "complex",
            "harmonic_consistency": "high" if len(melody) == len(harmony_progression) else "medium"
        }
    
    def _calculate_pitch_range(self, melody: List[Dict]) -> Dict[str, str]:
        """멜로디의 음역을 계산합니다."""
        all_pitches = []
        for chord in melody:
            for note in chord["notes"]:
                all_pitches.append(note["pitch"])
        
        if not all_pitches:
            return {"lowest": "C", "highest": "C"}
        
        # 간단한 음역 계산 (실제로는 더 정확한 계산 필요)
        return {"lowest": all_pitches[0], "highest": all_pitches[-1]}
    
    def _analyze_modulation_difficulty(self, from_key: str, to_key: str) -> str:
        """전조의 난이도를 분석합니다."""
        # 간단한 난이도 분석
        if from_key == to_key:
            return "none"
        elif abs(ord(from_key[0]) - ord(to_key[0])) <= 2:
            return "easy"
        elif abs(ord(from_key[0]) - ord(to_key[0])) <= 5:
            return "medium"
        else:
            return "hard"
    
    def _generate_modulation_examples(self, from_key: str, to_key: str, methods: List[Dict]) -> List[Dict]:
        """구체적인 전조 예시를 생성합니다."""
        examples = []
        
        for method in methods:
            example = {
                "method": method["name"],
                "description": method["description"],
                "progression": f"{from_key} → {to_key}",
                "steps": method["steps"]
            }
            examples.append(example)
        
        return examples
    
    def _get_modulation_practice_tips(self, difficulty: str) -> List[str]:
        """전조 연습 팁을 제공합니다."""
        tips = {
            "easy": [
                "공통음이 많은 조성부터 연습하세요",
                "천천히 연주하며 각 단계를 확인하세요"
            ],
            "medium": [
                "피벗 화음의 역할을 이해하세요",
                "연습 전에 계획을 세우고 진행하세요"
            ],
            "hard": [
                "단계별로 나누어 연습하세요",
                "메트로놈을 사용하여 정확한 타이밍을 연습하세요"
            ]
        }
        
        return tips.get(difficulty, ["기본적인 전조 연습부터 시작하세요"])
    
    def _extend_chord_progression(self, chords: List[str], target_length: int) -> List[str]:
        """화성 진행을 목표 길이에 맞게 확장합니다."""
        if target_length <= len(chords):
            return chords[:target_length]
        
        # 패턴을 반복하거나 확장
        extended_chords = chords * (target_length // len(chords))
        extended_chords.extend(chords[:target_length % len(chords)])
        return extended_chords
    
    def _generate_fallback_progression(self, style: str, difficulty: str, length: int, mood: str) -> Dict[str, Any]:
        """기본 데이터를 사용하여 화성 진행을 생성합니다."""
        if style not in self.fallback_harmony_patterns:
            return {"error": f"지원하지 않는 스타일: {style}"}
        
        available_patterns = [
            p for p in self.fallback_harmony_patterns[style] 
            if p["difficulty"] == difficulty
        ]
        
        if not available_patterns:
            available_patterns = self.fallback_harmony_patterns[style]
        
        import random
        selected_pattern = random.choice(available_patterns)
        
        extended_chords = self._extend_chord_progression(selected_pattern["chords"], length)
        
        return {
            "style": style,
            "difficulty": difficulty,
            "pattern_name": selected_pattern["name"],
            "chords": extended_chords,
            "description": selected_pattern["description"],
            "examples": selected_pattern["examples"],
            "mood": mood,
            "source": "Fallback Data",
            "suggestions": self._generate_progression_suggestions(extended_chords, mood)
        }
    
    def _load_fallback_harmony_patterns(self) -> Dict[str, List[Dict]]:
        """기본 화성 패턴을 로드합니다."""
        return {
            "classical": [
                {
                    "name": "I-IV-V-I",
                    "chords": ["I", "IV", "V", "I"],
                    "difficulty": "beginner",
                    "description": "기본적인 화성 진행으로 많은 클래식 곡에서 사용",
                    "examples": ["Beethoven Symphony No.5", "Mozart Symphony No.40"]
                }
            ],
            "jazz": [
                {
                    "name": "ii7-V7-Imaj7",
                    "chords": ["ii7", "V7", "Imaj7"],
                    "difficulty": "intermediate",
                    "description": "재즈의 기본적인 2-5-1 진행",
                    "examples": ["Autumn Leaves", "Take Five"]
                }
            ],
            "pop": [
                {
                    "name": "I-V-vi-IV",
                    "chords": ["I", "V", "vi", "IV"],
                    "difficulty": "beginner",
                    "description": "팝 음악에서 가장 인기 있는 진행",
                    "examples": ["Let It Be", "Someone Like You"]
                }
            ]
        }
    
    def _load_fallback_melody_templates(self) -> Dict[str, List[Dict]]:
        """기본 멜로디 템플릿을 로드합니다."""
        return {
            "classical": [
                {
                    "name": "스케일 기반",
                    "description": "음계를 기반으로 한 자연스러운 멜로디",
                    "characteristics": ["단계적 진행", "부드러운 흐름", "기억하기 쉬움"],
                    "examples": ["Twinkle Twinkle", "Ode to Joy"]
                }
            ]
        }
    
    def _load_fallback_modulation_guides(self) -> Dict[str, List[Dict]]:
        """기본 조성 전환 가이드를 로드합니다."""
        return {
            "common_tone": [
                {
                    "name": "공통음 전조",
                    "description": "두 조성에서 공통되는 음을 통해 자연스럽게 전조",
                    "example": "C major → F major (C음이 공통)",
                    "difficulty": "beginner",
                    "steps": [
                        "공통음 찾기",
                        "새로운 조성의 화음으로 연결",
                        "새로운 조성에서 진행 완성"
                    ]
                }
            ]
        }
    
    def get_service_status(self) -> Dict[str, Any]:
        """서비스 상태를 반환합니다."""
        return {
            "ai_available": self.ai_available,
            "corpus_available": self.corpus_available,
            "harmony_ai_status": self.harmony_ai.get_ai_status(),
            "service_mode": "AI Enhanced" if self.ai_available else "Corpus Based" if self.corpus_available else "Fallback"
        }
