import logging
import os
import sys
from typing import Dict, List, Any, Optional
from pathlib import Path

# When-in-Rome 코퍼스 처리기 import
sys.path.append(str(Path(__file__).parent.parent.parent / "corpus-service"))
try:
    from app.services.when_in_rome_processor import WhenInRomeProcessor
    from app.services.corpus_processor import CorpusProcessor
    CORPUS_AVAILABLE = True
except ImportError:
    CORPUS_AVAILABLE = False
    logging.warning("When-in-Rome 코퍼스 처리기를 import할 수 없습니다.")

class CorpusIntegrationService:
    """When-in-Rome 코퍼스와 AI 서비스를 통합하는 서비스"""
    
    def __init__(self):
        self.logger = logging.getLogger(__name__)
        self.corpus_available = CORPUS_AVAILABLE
        
        if self.corpus_available:
            try:
                # 코퍼스 기본 경로 설정
                corpus_base_path = self._get_corpus_base_path()
                
                self.corpus_processor = CorpusProcessor(corpus_base_path)
                self.when_in_rome_processor = WhenInRomeProcessor(corpus_base_path)
                self.logger.info("When-in-Rome 코퍼스 통합 성공")
            except Exception as e:
                self.logger.error(f"코퍼스 처리기 초기화 실패: {e}")
                self.corpus_available = False
        else:
            self.logger.warning("코퍼스 처리기를 사용할 수 없습니다. 기본 데이터를 사용합니다.")
    
    def _get_corpus_base_path(self) -> str:
        """코퍼스 기본 경로를 가져옵니다."""
        # 여러 가능한 경로를 시도
        possible_paths = [
            # 상대 경로 (AI 서비스에서)
            "../When-in-Rome/Corpus",
            "../When-in-Rome",
            # 절대 경로 (프로젝트 루트 기준)
            str(Path(__file__).parent.parent.parent / "When-in-Rome" / "Corpus"),
            str(Path(__file__).parent.parent.parent / "When-in-Rome"),
            # 환경 변수
            os.getenv("WHEN_IN_ROME_CORPUS_PATH", ""),
            # 현재 작업 디렉토리 기준
            "./When-in-Rome/Corpus",
            "./When-in-Rome"
        ]
        
        for path in possible_paths:
            if path and os.path.exists(path):
                self.logger.info(f"코퍼스 경로 발견: {path}")
                return path
        
        # 기본 경로 반환 (존재하지 않을 수 있음)
        default_path = str(Path(__file__).parent.parent.parent / "When-in-Rome" / "Corpus")
        self.logger.warning(f"코퍼스 경로를 찾을 수 없습니다. 기본 경로 사용: {default_path}")
        return default_path
    
    def get_harmony_patterns_from_corpus(self, style: str = "all") -> Dict[str, List[Dict]]:
        """코퍼스에서 화성 패턴을 추출합니다."""
        if not self.corpus_available:
            return self._get_fallback_harmony_patterns()
        
        try:
            # 코퍼스에서 화성 진행 패턴 추출
            corpus_data = self.corpus_processor.get_corpus_data()
            
            patterns = {
                "classical": [],
                "jazz": [],
                "pop": [],
                "baroque": [],
                "romantic": []
            }
            
            for item in corpus_data:
                if "harmony_analysis" in item:
                    harmony = item["harmony_analysis"]
                    
                    # 스타일 분류 (간단한 규칙 기반)
                    style_category = self._classify_musical_style(item)
                    
                    if style_category in patterns:
                        pattern = {
                            "id": f"corpus_{item.get('id', 'unknown')}",
                            "name": item.get("title", "Unknown"),
                            "chords": harmony.get("chord_progression", []),
                            "difficulty": self._assess_difficulty(harmony),
                            "description": f"코퍼스에서 추출된 {style_category} 스타일 화성 진행",
                            "examples": [item.get("title", "Unknown")],
                            "source": "When-in-Rome Corpus",
                            "analysis": {
                                "key_signature": harmony.get("key_signature"),
                                "time_signature": harmony.get("time_signature"),
                                "harmonic_functions": harmony.get("harmonic_functions", []),
                                "cadence_types": harmony.get("cadence_types", [])
                            }
                        }
                        patterns[style_category].append(pattern)
            
            # 스타일별 필터링
            if style != "all" and style in patterns:
                return {style: patterns[style]}
            
            return patterns
            
        except Exception as e:
            self.logger.error(f"코퍼스에서 화성 패턴 추출 실패: {e}")
            return self._get_fallback_harmony_patterns()
    
    def get_melody_templates_from_corpus(self, style: str = "all") -> Dict[str, List[Dict]]:
        """코퍼스에서 멜로디 템플릿을 추출합니다."""
        if not self.corpus_available:
            return self._get_fallback_melody_templates()
        
        try:
            corpus_data = self.corpus_processor.get_corpus_data()
            
            templates = {
                "classical": [],
                "jazz": [],
                "pop": [],
                "baroque": [],
                "romantic": []
            }
            
            for item in corpus_data:
                if "melody_analysis" in item:
                    melody = item["melody_analysis"]
                    style_category = self._classify_musical_style(item)
                    
                    if style_category in templates:
                        template = {
                            "id": f"melody_{item.get('id', 'unknown')}",
                            "name": f"{item.get('title', 'Unknown')} 멜로디",
                            "description": f"코퍼스에서 추출된 {style_category} 스타일 멜로디",
                            "characteristics": melody.get("characteristics", []),
                            "examples": [item.get("title", "Unknown")],
                            "source": "When-in-Rome Corpus",
                            "analysis": {
                                "scale_type": melody.get("scale_type"),
                                "rhythm_pattern": melody.get("rhythm_pattern"),
                                "contour": melody.get("contour"),
                                "intervals": melody.get("intervals", [])
                            }
                        }
                        templates[style_category].append(template)
            
            if style != "all" and style in templates:
                return {style: templates[style]}
            
            return templates
            
        except Exception as e:
            self.logger.error(f"코퍼스에서 멜로디 템플릿 추출 실패: {e}")
            return self._get_fallback_melody_templates()
    
    def get_curriculum_from_corpus(self, level: str = "beginner") -> List[Dict]:
        """코퍼스에서 커리큘럼을 생성합니다."""
        if not self.corpus_available:
            return self._get_fallback_curriculum(level)
        
        try:
            corpus_data = self.corpus_processor.get_corpus_data()
            
            # 난이도별 곡 분류
            difficulty_groups = self._group_by_difficulty(corpus_data)
            
            if level not in difficulty_groups:
                return []
            
            curriculum = []
            for i, item in enumerate(difficulty_groups[level]):
                lesson = {
                    "id": f"corpus_lesson_{level}_{i+1:03d}",
                    "title": f"{item.get('title', 'Unknown')} 분석",
                    "description": f"코퍼스 기반 {level} 레벨 학습",
                    "topics": self._extract_topics_from_item(item),
                    "estimated_time": self._estimate_lesson_time(item, level),
                    "difficulty": self._map_difficulty_to_number(level),
                    "prerequisites": [],
                    "examples": [item.get("title", "Unknown")],
                    "exercises": self._generate_exercises_from_item(item),
                    "source": "When-in-Rome Corpus",
                    "corpus_data": {
                        "composer": item.get("composer"),
                        "period": item.get("period"),
                        "genre": item.get("genre")
                    }
                }
                curriculum.append(lesson)
            
            return curriculum
            
        except Exception as e:
            self.logger.error(f"코퍼스에서 커리큘럼 생성 실패: {e}")
            return self._get_fallback_curriculum(level)
    
    def get_progression_patterns_from_corpus(self, style: str = "classical") -> List[Dict]:
        """코퍼스에서 진행 패턴을 추출합니다."""
        if not self.corpus_available:
            return self._get_fallback_progression_patterns(style)
        
        try:
            corpus_data = self.corpus_processor.get_corpus_data()
            
            patterns = []
            for item in corpus_data:
                if "harmony_analysis" in item and self._matches_style(item, style):
                    harmony = item["harmony_analysis"]
                    
                    pattern = {
                        "id": f"prog_{item.get('id', 'unknown')}",
                        "name": f"{item.get('title', 'Unknown')} 패턴",
                        "description": f"코퍼스에서 추출된 {style} 스타일 화성 진행",
                        "progression": harmony.get("chord_progression", []),
                        "characteristics": self._extract_characteristics(item),
                        "examples": [item.get("title", "Unknown")],
                        "difficulty": self._assess_difficulty(harmony),
                        "practice_tips": self._generate_practice_tips(harmony),
                        "source": "When-in-Rome Corpus",
                        "analysis": {
                            "harmonic_functions": harmony.get("harmonic_functions", []),
                            "cadence_types": harmony.get("cadence_types", []),
                            "modulation_points": harmony.get("modulation_points", [])
                        }
                    }
                    patterns.append(pattern)
            
            return patterns
            
        except Exception as e:
            self.logger.error(f"코퍼스에서 진행 패턴 추출 실패: {e}")
            return self._get_fallback_progression_patterns(style)
    
    def _classify_musical_style(self, item: Dict) -> str:
        """음악 스타일을 분류합니다."""
        composer = item.get("composer", "").lower()
        period = item.get("period", "").lower()
        genre = item.get("genre", "").lower()
        
        # 작곡가 기반 분류
        if any(name in composer for name in ["bach", "handel", "vivaldi"]):
            return "baroque"
        elif any(name in composer for name in ["mozart", "haydn", "beethoven"]):
            return "classical"
        elif any(name in composer for name in ["chopin", "schubert", "schumann"]):
            return "romantic"
        elif any(name in composer for name in ["miles", "coltrane", "monk"]):
            return "jazz"
        else:
            # 장르 기반 분류
            if "jazz" in genre:
                return "jazz"
            elif "pop" in genre or "rock" in genre:
                return "pop"
            elif "classical" in genre:
                return "classical"
            else:
                return "classical"  # 기본값
    
    def _assess_difficulty(self, harmony: Dict) -> str:
        """화성의 난이도를 평가합니다."""
        chord_progression = harmony.get("chord_progression", [])
        harmonic_functions = harmony.get("harmonic_functions", [])
        
        # 간단한 난이도 평가
        if len(chord_progression) <= 4 and len(harmonic_functions) <= 2:
            return "beginner"
        elif len(chord_progression) <= 8 and len(harmonic_functions) <= 4:
            return "intermediate"
        else:
            return "advanced"
    
    def _group_by_difficulty(self, corpus_data: List[Dict]) -> Dict[str, List[Dict]]:
        """코퍼스 데이터를 난이도별로 그룹화합니다."""
        groups = {"beginner": [], "intermediate": [], "advanced": []}
        
        for item in corpus_data:
            if "harmony_analysis" in item:
                difficulty = self._assess_difficulty(item["harmony_analysis"])
                groups[difficulty].append(item)
        
        return groups
    
    def _extract_topics_from_item(self, item: Dict) -> List[str]:
        """아이템에서 학습 주제를 추출합니다."""
        topics = []
        
        if "harmony_analysis" in item:
            harmony = item["harmony_analysis"]
            if "harmonic_functions" in harmony:
                topics.append(f"{', '.join(harmony['harmonic_functions'])} 이해")
            if "cadence_types" in harmony:
                topics.append(f"{', '.join(harmony['cadence_types'])} 분석")
        
        if "melody_analysis" in item:
            melody = item["melody_analysis"]
            if "scale_type" in melody:
                topics.append(f"{melody['scale_type']} 스케일 활용")
        
        return topics or ["음악적 구조 분석", "화성 진행 이해"]
    
    def _estimate_lesson_time(self, item: Dict, level: str) -> int:
        """레슨 시간을 추정합니다."""
        base_time = {"beginner": 20, "intermediate": 35, "advanced": 50}
        complexity_factor = len(item.get("harmony_analysis", {}).get("chord_progression", [])) / 4
        
        return int(base_time[level] * complexity_factor)
    
    def _map_difficulty_to_number(self, level: str) -> int:
        """난이도를 숫자로 매핑합니다."""
        mapping = {"beginner": 1, "intermediate": 3, "advanced": 5}
        return mapping.get(level, 1)
    
    def _generate_exercises_from_item(self, item: Dict) -> List[str]:
        """아이템에서 연습 문제를 생성합니다."""
        exercises = []
        
        if "harmony_analysis" in item:
            exercises.append("화성 진행 패턴 분석하기")
            exercises.append("화성 기능 식별하기")
        
        if "melody_analysis" in item:
            exercises.append("멜로디 구조 분석하기")
            exercises.append("스케일 패턴 인식하기")
        
        exercises.append("전체적인 음악적 구조 파악하기")
        
        return exercises
    
    def _matches_style(self, item: Dict, target_style: str) -> bool:
        """아이템이 타겟 스타일과 일치하는지 확인합니다."""
        item_style = self._classify_musical_style(item)
        return item_style == target_style
    
    def _extract_characteristics(self, item: Dict) -> List[str]:
        """아이템의 특징을 추출합니다."""
        characteristics = []
        
        if "harmony_analysis" in item:
            harmony = item["harmony_analysis"]
            if "harmonic_functions" in harmony:
                characteristics.append("화성적 일관성")
            if "cadence_types" in harmony:
                characteristics.append("명확한 종지")
        
        if "melody_analysis" in item:
            characteristics.append("멜로디적 표현")
        
        return characteristics or ["전통적인 구조", "음악적 완성도"]
    
    def _generate_practice_tips(self, harmony: Dict) -> List[str]:
        """화성 분석을 바탕으로 연습 팁을 생성합니다."""
        tips = []
        
        chord_progression = harmony.get("chord_progression", [])
        if len(chord_progression) > 6:
            tips.append("긴 진행을 작은 구문으로 나누어 연습하세요")
        
        if "secondary_dominants" in str(harmony):
            tips.append("보조 도미넌트의 해결을 주의 깊게 연습하세요")
        
        if "modulation" in str(harmony):
            tips.append("전조 지점을 명확히 파악하고 연습하세요")
        
        tips.append("각 화음의 기능을 이해하며 연주하세요")
        
        return tips
    
    def _get_fallback_harmony_patterns(self) -> Dict[str, List[Dict]]:
        """코퍼스를 사용할 수 없을 때 기본 화성 패턴을 반환합니다."""
        return {
            "classical": [
                {
                    "id": "fallback_001",
                    "name": "기본 I-IV-V 진행",
                    "chords": ["I", "IV", "V", "I"],
                    "difficulty": "beginner",
                    "description": "기본적인 화성 진행",
                    "examples": ["기본 연습"],
                    "source": "Fallback Data"
                }
            ]
        }
    
    def _get_fallback_melody_templates(self) -> Dict[str, List[Dict]]:
        """코퍼스를 사용할 수 없을 때 기본 멜로디 템플릿을 반환합니다."""
        return {
            "classical": [
                {
                    "id": "fallback_melody_001",
                    "name": "기본 스케일",
                    "description": "기본적인 스케일 연습",
                    "characteristics": ["단순한 구조"],
                    "examples": ["기본 연습"],
                    "source": "Fallback Data"
                }
            ]
        }
    
    def _get_fallback_curriculum(self, level: str) -> List[Dict]:
        """코퍼스를 사용할 수 없을 때 기본 커리큘럼을 반환합니다."""
        return [
            {
                "id": f"fallback_{level}_001",
                "title": f"{level} 레벨 기본 학습",
                "description": "기본적인 음악 이론 학습",
                "topics": ["기본 개념"],
                "estimated_time": 30,
                "difficulty": 1,
                "prerequisites": [],
                "examples": ["기본 연습"],
                "exercises": ["기본 연습"],
                "source": "Fallback Data"
            }
        ]
    
    def _get_fallback_progression_patterns(self, style: str) -> List[Dict]:
        """코퍼스를 사용할 수 없을 때 기본 진행 패턴을 반환합니다."""
        return [
            {
                "id": f"fallback_prog_{style}_001",
                "name": f"{style} 기본 패턴",
                "description": f"{style} 스타일 기본 진행",
                "progression": ["I", "IV", "V", "I"],
                "characteristics": ["기본 구조"],
                "examples": ["기본 연습"],
                "difficulty": "beginner",
                "practice_tips": ["기본 연습"],
                "source": "Fallback Data"
            }
        ]
