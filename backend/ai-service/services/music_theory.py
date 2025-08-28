import logging
from typing import Dict, List, Any, Optional
import json
import os
from datetime import datetime

class MusicTheoryService:
    """음악 이론 학습 시스템 서비스"""
    
    def __init__(self):
        self.logger = logging.getLogger(__name__)
        self.curriculum = self._load_curriculum()
        self.progression_patterns = self._load_progression_patterns()
        self.modal_mixture_guides = self._load_modal_mixture_guides()
        self.user_progress = {}  # 사용자별 학습 진도 추적
    
    def _load_curriculum(self) -> Dict[str, List[Dict]]:
        """체계적 커리큘럼을 로드합니다."""
        return {
            "beginner": [
                {
                    "id": "bt_001",
                    "title": "기본 화성학 입문",
                    "description": "3화음과 기본 화성 진행의 이해",
                    "topics": [
                        "3화음의 구성과 종류",
                        "I-IV-V 진행의 이해",
                        "기본적인 화성 해석"
                    ],
                    "estimated_time": 30,
                    "difficulty": 1,
                    "prerequisites": [],
                    "examples": ["Twinkle Twinkle", "Mary Had a Little Lamb"],
                    "exercises": [
                        "3화음 인식하기",
                        "기본 진행 연주하기",
                        "화성 분석하기"
                    ]
                },
                {
                    "id": "bt_002",
                    "title": "음계와 조성",
                    "description": "메이저와 마이너 스케일의 이해",
                    "topics": [
                        "메이저 스케일의 구조",
                        "마이너 스케일의 종류",
                        "조성의 개념과 표기"
                    ],
                    "estimated_time": 45,
                    "difficulty": 2,
                    "prerequisites": ["bt_001"],
                    "examples": ["C Major Scale", "A Minor Scale"],
                    "exercises": [
                        "스케일 연주하기",
                        "조성 구분하기",
                        "스케일 패턴 인식하기"
                    ]
                }
            ],
            "intermediate": [
                {
                    "id": "it_001",
                    "title": "7화음과 확장 화성",
                    "description": "7화음과 9화음의 이해와 활용",
                    "topics": [
                        "7화음의 종류와 구성",
                        "9화음과 확장 화성",
                        "화성의 색채와 기능"
                    ],
                    "estimated_time": 60,
                    "difficulty": 3,
                    "prerequisites": ["bt_001", "bt_002"],
                    "examples": ["ii7-V7-Imaj7", "Dominant 7th Resolution"],
                    "exercises": [
                        "7화음 구성하기",
                        "확장 화성 연주하기",
                        "화성 색채 분석하기"
                    ]
                },
                {
                    "id": "it_002",
                    "title": "화성 진행 패턴",
                    "description": "고급 화성 진행과 패턴 분석",
                    "topics": [
                        "Circle of Fifths",
                        "Secondary Dominants",
                        "Modal Interchange"
                    ],
                    "estimated_time": 75,
                    "difficulty": 4,
                    "prerequisites": ["it_001"],
                    "examples": ["Autumn Leaves", "All the Things You Are"],
                    "exercises": [
                        "Circle of Fifths 연습",
                        "Secondary Dominants 분석",
                        "Modal Interchange 패턴 찾기"
                    ]
                }
            ],
            "advanced": [
                {
                    "id": "at_001",
                    "title": "고급 화성 기법",
                    "description": "복잡한 화성과 현대적 기법",
                    "topics": [
                        "Altered Dominants",
                        "Diminished Harmony",
                        "Whole Tone Scale"
                    ],
                    "estimated_time": 90,
                    "difficulty": 5,
                    "prerequisites": ["it_002"],
                    "examples": ["Giant Steps", "Confirmation"],
                    "exercises": [
                        "Altered Dominants 구성하기",
                        "Diminished Harmony 분석하기",
                        "Whole Tone Scale 활용하기"
                    ]
                }
            ]
        }
    
    def _load_progression_patterns(self) -> Dict[str, List[Dict]]:
        """진행 패턴 연습 자료를 로드합니다."""
        return {
            "classical": [
                {
                    "id": "cp_001",
                    "name": "바흐 스타일",
                    "description": "바로크 시대의 전형적인 화성 진행",
                    "progression": ["I", "V", "vi", "iii", "IV", "I", "V", "I"],
                    "characteristics": ["대위법적 진행", "화성적 일관성", "종교적 분위기"],
                    "examples": ["Bach Prelude in C", "Bach Chorales"],
                    "difficulty": "intermediate",
                    "practice_tips": [
                        "각 화음의 베이스 라인을 명확히 연주하세요",
                        "대위법적 움직임을 느끼며 연주하세요",
                        "템포를 천천히 유지하며 정확성을 연습하세요"
                    ]
                },
                {
                    "id": "cp_002",
                    "name": "베토벤 스타일",
                    "description": "고전주의 시대의 역동적인 화성 진행",
                    "progression": ["I", "V", "vi", "IV", "I", "V", "I"],
                    "characteristics": ["강한 리듬감", "명확한 구문", "감정적 표현"],
                    "examples": ["Beethoven Symphony No.5", "Beethoven Piano Sonata No.8"],
                    "difficulty": "intermediate",
                    "practice_tips": [
                        "강세와 약세를 명확히 구분하세요",
                        "각 구문의 시작과 끝을 명확히 하세요",
                        "감정적 변화를 표현하며 연주하세요"
                    ]
                }
            ],
            "jazz": [
                {
                    "id": "jp_001",
                    "name": "재즈 스탠다드",
                    "description": "전형적인 재즈 화성 진행",
                    "progression": ["ii7", "V7", "Imaj7", "vi7", "ii7", "V7", "Imaj7"],
                    "characteristics": ["7화음의 풍부함", "블루 노트", "스윙 리듬"],
                    "examples": ["Autumn Leaves", "Take Five"],
                    "difficulty": "intermediate",
                    "practice_tips": [
                        "7화음의 색채를 느끼며 연주하세요",
                        "블루 노트를 활용한 멜로디를 만들어보세요",
                        "스윙 리듬의 느낌을 연습하세요"
                    ]
                }
            ],
            "pop": [
                {
                    "id": "pp_001",
                    "name": "팝 발라드",
                    "description": "감성적인 팝 음악의 화성 진행",
                    "progression": ["I", "V", "vi", "IV", "I", "V", "vi", "IV"],
                    "characteristics": ["단순한 구조", "감성적 멜로디", "기억하기 쉬움"],
                    "examples": ["Perfect", "All of Me"],
                    "difficulty": "beginner",
                    "practice_tips": [
                        "감정을 담아 부드럽게 연주하세요",
                        "멜로디와 화성의 조화를 느끼세요",
                        "자연스러운 흐름을 유지하세요"
                    ]
                }
            ]
        }
    
    def _load_modal_mixture_guides(self) -> Dict[str, List[Dict]]:
        """모달 믹스처 가이드를 로드합니다."""
        return {
            "borrowed_chords": [
                {
                    "id": "bc_001",
                    "name": "평행 마이너에서 차용",
                    "description": "메이저 조성에서 평행 마이너의 화음을 차용",
                    "example": "C Major에서 C Minor의 iv, bVI, bVII 사용",
                    "difficulty": "intermediate",
                    "usage": "감성적이고 부드러운 느낌을 원할 때",
                    "examples": ["Beethoven Symphony No.5", "Mozart Symphony No.40"],
                    "practice_steps": [
                        "평행 마이너 스케일 연습하기",
                        "차용 화음의 소리 느끼기",
                        "메이저-마이너 전환 연습하기"
                    ]
                }
            ],
            "modal_interchange": [
                {
                    "id": "mi_001",
                    "name": "관계 마이너에서 차용",
                    "description": "메이저 조성에서 관계 마이너의 화음을 차용",
                    "example": "C Major에서 A Minor의 화음 사용",
                    "difficulty": "intermediate",
                    "usage": "자연스러운 전조나 색채 변화를 원할 때",
                    "examples": ["Bach Chorales", "Chopin Nocturnes"],
                    "practice_steps": [
                        "관계 마이너 스케일 연습하기",
                        "차용 화음의 연결 연습하기",
                        "전조 효과 느끼기"
                    ]
                }
            ],
            "chromatic_alteration": [
                {
                    "id": "ca_001",
                    "name": "반음계적 변화",
                    "description": "화음의 구성음을 반음계적으로 변화",
                    "example": "Major 7th → Dominant 7th",
                    "difficulty": "advanced",
                    "usage": "긴장감이나 색채 변화를 원할 때",
                    "examples": ["Jazz Standards", "Modern Pop"],
                    "practice_steps": [
                        "반음계적 변화의 소리 느끼기",
                        "긴장과 해결의 흐름 연습하기",
                        "색채 변화의 효과 연습하기"
                    ]
                }
            ]
        }
    
    def get_curriculum(
        self, 
        level: str = "beginner", 
        user_id: Optional[int] = None
    ) -> Dict[str, Any]:
        """사용자 수준에 맞는 커리큘럼을 제공합니다."""
        try:
            if level not in self.curriculum:
                return {"error": f"지원하지 않는 레벨: {level}"}
            
            # 사용자 진도 확인
            user_progress = self._get_user_progress(user_id) if user_id else {}
            
            # 레벨별 커리큘럼 제공
            level_curriculum = self.curriculum[level]
            
            # 사용자 진도에 따른 완료 상태 추가
            for lesson in level_curriculum:
                lesson_id = lesson["id"]
                lesson["completed"] = user_progress.get(lesson_id, {}).get("completed", False)
                lesson["progress_percentage"] = user_progress.get(lesson_id, {}).get("progress", 0)
                lesson["last_practiced"] = user_progress.get(lesson_id, {}).get("last_practiced")
            
            return {
                "level": level,
                "total_lessons": len(level_curriculum),
                "completed_lessons": sum(1 for l in level_curriculum if l["completed"]),
                "curriculum": level_curriculum,
                "estimated_total_time": sum(l["estimated_time"] for l in level_curriculum)
            }
            
        except Exception as e:
            self.logger.error(f"커리큘럼 조회 실패: {e}")
            return {"error": f"커리큘럼 조회 중 오류 발생: {str(e)}"}
    
    def get_progression_patterns(
        self, 
        style: str = "classical", 
        difficulty: str = "all"
    ) -> Dict[str, Any]:
        """화성 진행 패턴을 제공합니다."""
        try:
            if style not in self.progression_patterns:
                return {"error": f"지원하지 않는 스타일: {style}"}
            
            # 난이도별 필터링
            if difficulty == "all":
                patterns = self.progression_patterns[style]
            else:
                patterns = [
                    p for p in self.progression_patterns[style] 
                    if p["difficulty"] == difficulty
                ]
            
            return {
                "style": style,
                "difficulty": difficulty,
                "patterns": patterns,
                "total_patterns": len(patterns)
            }
            
        except Exception as e:
            self.logger.error(f"진행 패턴 조회 실패: {e}")
            return {"error": f"진행 패턴 조회 중 오류 발생: {str(e)}"}
    
    def get_modal_mixture_guide(
        self, 
        technique: str = "all", 
        difficulty: str = "all"
    ) -> Dict[str, Any]:
        """모달 믹스처 가이드를 제공합니다."""
        try:
            # 기법별 필터링
            if technique == "all":
                guides = []
                for tech_guides in self.modal_mixture_guides.values():
                    guides.extend(tech_guides)
            else:
                guides = self.modal_mixture_guides.get(technique, [])
            
            # 난이도별 필터링
            if difficulty != "all":
                guides = [g for g in guides if g["difficulty"] == difficulty]
            
            return {
                "technique": technique,
                "difficulty": difficulty,
                "guides": guides,
                "total_guides": len(guides)
            }
            
        except Exception as e:
            self.logger.error(f"모달 믹스처 가이드 조회 실패: {e}")
            return {"error": f"모달 믹스처 가이드 조회 중 오류 발생: {str(e)}"}
    
    def start_lesson(
        self, 
        user_id: int, 
        lesson_id: str
    ) -> Dict[str, Any]:
        """레슨을 시작합니다."""
        try:
            # 레슨 정보 찾기
            lesson = self._find_lesson(lesson_id)
            if not lesson:
                return {"error": f"레슨을 찾을 수 없습니다: {lesson_id}"}
            
            # 사용자 진도 초기화
            if user_id not in self.user_progress:
                self.user_progress[user_id] = {}
            
            if lesson_id not in self.user_progress[user_id]:
                self.user_progress[user_id][lesson_id] = {
                    "started": True,
                    "started_at": datetime.now().isoformat(),
                    "completed": False,
                    "progress": 0,
                    "practice_sessions": []
                }
            
            return {
                "lesson": lesson,
                "user_progress": self.user_progress[user_id][lesson_id],
                "message": "레슨이 시작되었습니다."
            }
            
        except Exception as e:
            self.logger.error(f"레슨 시작 실패: {e}")
            return {"error": f"레슨 시작 중 오류 발생: {str(e)}"}
    
    def complete_lesson(
        self, 
        user_id: int, 
        lesson_id: str, 
        score: int = 100
    ) -> Dict[str, Any]:
        """레슨을 완료합니다."""
        try:
            if user_id not in self.user_progress or lesson_id not in self.user_progress[user_id]:
                return {"error": "레슨을 먼저 시작해야 합니다."}
            
            # 레슨 완료 처리
            self.user_progress[user_id][lesson_id].update({
                "completed": True,
                "completed_at": datetime.now().isoformat(),
                "progress": 100,
                "final_score": score
            })
            
            return {
                "lesson_id": lesson_id,
                "completed": True,
                "score": score,
                "message": "레슨을 완료했습니다!"
            }
            
        except Exception as e:
            self.logger.error(f"레슨 완료 실패: {e}")
            return {"error": f"레슨 완료 중 오류 발생: {str(e)}"}
    
    def update_progress(
        self, 
        user_id: int, 
        lesson_id: str, 
        progress: int
    ) -> Dict[str, Any]:
        """레슨 진행도를 업데이트합니다."""
        try:
            if user_id not in self.user_progress or lesson_id not in self.user_progress[user_id]:
                return {"error": "레슨을 먼저 시작해야 합니다."}
            
            # 진행도 업데이트
            self.user_progress[user_id][lesson_id]["progress"] = min(100, max(0, progress))
            self.user_progress[user_id][lesson_id]["last_updated"] = datetime.now().isoformat()
            
            return {
                "lesson_id": lesson_id,
                "progress": self.user_progress[user_id][lesson_id]["progress"],
                "message": "진행도가 업데이트되었습니다."
            }
            
        except Exception as e:
            self.logger.error(f"진행도 업데이트 실패: {e}")
            return {"error": f"진행도 업데이트 중 오류 발생: {str(e)}"}
    
    def get_user_progress_summary(self, user_id: int) -> Dict[str, Any]:
        """사용자의 전체 학습 진도를 요약합니다."""
        try:
            if user_id not in self.user_progress:
                return {"user_id": user_id, "total_progress": 0, "lessons": []}
            
            user_lessons = self.user_progress[user_id]
            total_lessons = len(user_lessons)
            completed_lessons = sum(1 for l in user_lessons.values() if l.get("completed", False))
            total_progress = sum(l.get("progress", 0) for l in user_lessons.values())
            average_progress = total_progress / total_lessons if total_lessons > 0 else 0
            
            return {
                "user_id": user_id,
                "total_lessons": total_lessons,
                "completed_lessons": completed_lessons,
                "in_progress_lessons": total_lessons - completed_lessons,
                "total_progress": total_progress,
                "average_progress": round(average_progress, 2),
                "completion_rate": round((completed_lessons / total_lessons) * 100, 2) if total_lessons > 0 else 0,
                "lessons": list(user_lessons.values())
            }
            
        except Exception as e:
            self.logger.error(f"사용자 진도 요약 조회 실패: {e}")
            return {"error": f"사용자 진도 요약 조회 중 오류 발생: {str(e)}"}
    
    def _find_lesson(self, lesson_id: str) -> Optional[Dict]:
        """레슨 ID로 레슨을 찾습니다."""
        for level_lessons in self.curriculum.values():
            for lesson in level_lessons:
                if lesson["id"] == lesson_id:
                    return lesson
        return None
    
    def _get_user_progress(self, user_id: Optional[int]) -> Dict:
        """사용자의 진도를 반환합니다."""
        if user_id is None or user_id not in self.user_progress:
            return {}
        return self.user_progress[user_id]
