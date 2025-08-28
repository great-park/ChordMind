from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Dict, Any, Optional
import uvicorn
import os
from dotenv import load_dotenv

from services.ai_composition import AICompositionService
from services.music_theory import MusicTheoryService
from services.practice_plan import PracticePlanService
from services.corpus_integration import CorpusIntegrationService
from services.harmony_ai import HarmonyAIService

load_dotenv()

app = FastAPI(
    title="ChordMind AI Service",
    description="AI 기반 음악 이론 학습 분석 및 추천 서비스",
    version="1.0.0"
)

# CORS 설정
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# AI 서비스 초기화
composition_service = AICompositionService()
theory_service = MusicTheoryService()
practice_plan_service = PracticePlanService()
corpus_integration_service = CorpusIntegrationService()
harmony_ai_service = HarmonyAIService()

# Pydantic 모델들
class HarmonyProgressionRequest(BaseModel):
    style: str = "classical"
    difficulty: str = "beginner"
    length: int = 4
    mood: str = "neutral"

class MelodyGenerationRequest(BaseModel):
    harmony_progression: List[str]
    style: str = "classical"
    rhythm_pattern: str = "simple"

class ModulationGuideRequest(BaseModel):
    from_key: str
    to_key: str
    difficulty: str = "beginner"

class LessonRequest(BaseModel):
    user_id: int
    lesson_id: str

class ProgressUpdateRequest(BaseModel):
    user_id: int
    lesson_id: str
    progress: int

class LessonCompletionRequest(BaseModel):
    user_id: int
    lesson_id: str
    score: int = 100

class PracticeAnalysisRequest(BaseModel):
    user_id: int
    practice_history: List[Dict[str, Any]]

class PracticePlanRequest(BaseModel):
    user_id: int
    analysis_result: Dict[str, Any]
    practice_time: int = 60
    focus_areas: Optional[List[str]] = None

class PracticeSessionRequest(BaseModel):
    user_id: int
    session_data: Dict[str, Any]
    analysis_type: str = "comprehensive"

@app.get("/")
async def root():
    return {"message": "ChordMind AI Service", "version": "1.0.0"}

@app.get("/health")
async def health_check():
    return {
        "status": "healthy", 
        "ai_services": {
            "composition": True,
            "theory": True,
            "practice_plan": True,
            "corpus_integration": True,
            "harmony_ai": True
        }
    }

# AI Composition API 엔드포인트들
@app.post("/api/ai/composition/harmony-progression")
async def suggest_harmony_progression(request: HarmonyProgressionRequest):
    """화성 진행 제안"""
    try:
        result = composition_service.suggest_harmony_progression(
            style=request.style,
            difficulty=request.difficulty,
            length=request.length,
            mood=request.mood
        )
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"화성 진행 제안 실패: {str(e)}")

@app.post("/api/ai/composition/generate-melody")
async def generate_melody(request: MelodyGenerationRequest):
    """멜로디 생성"""
    try:
        result = composition_service.generate_melody(
            harmony_progression=request.harmony_progression,
            style=request.style,
            rhythm_pattern=request.rhythm_pattern
        )
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"멜로디 생성 실패: {str(e)}")

@app.post("/api/ai/composition/modulation-guide")
async def get_modulation_guide(request: ModulationGuideRequest):
    """조성 전환 가이드"""
    try:
        result = composition_service.get_modulation_guide(
            from_key=request.from_key,
            to_key=request.to_key,
            difficulty=request.difficulty
        )
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"조성 전환 가이드 생성 실패: {str(e)}")

@app.get("/api/ai/composition/styles")
async def get_available_styles():
    """사용 가능한 음악 스타일"""
    styles = ["classical", "jazz", "pop", "baroque", "romantic"]
    return {"available_styles": styles}

@app.get("/api/ai/composition/difficulties")
async def get_available_difficulties():
    """사용 가능한 난이도"""
    difficulties = ["beginner", "intermediate", "advanced"]
    return {"available_difficulties": difficulties}

# Music Theory API 엔드포인트들
@app.get("/api/ai/theory/curriculum/{level}")
async def get_theory_curriculum(level: str):
    """음악 이론 커리큘럼"""
    try:
        curriculum = theory_service.get_curriculum(level)
        return {"curriculum": curriculum}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"커리큘럼 조회 실패: {str(e)}")

@app.get("/api/ai/theory/progression-patterns/{style}")
async def get_progression_patterns(style: str):
    """화성 진행 패턴"""
    try:
        patterns = theory_service.get_progression_patterns(style)
        return {"patterns": patterns}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"진행 패턴 조회 실패: {str(e)}")

@app.get("/api/ai/theory/modal-mixture/{technique}")
async def get_modal_mixture_guide(technique: str):
    """선법 혼합 가이드"""
    try:
        guide = theory_service.get_modal_mixture_guide(technique)
        return {"guide": guide}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"선법 혼합 가이드 조회 실패: {str(e)}")

@app.post("/api/ai/theory/start-lesson")
async def start_theory_lesson(request: LessonRequest):
    """음악 이론 레슨 시작"""
    try:
        result = theory_service.start_lesson(
            user_id=request.user_id,
            lesson_id=request.lesson_id
        )
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"레슨 시작 실패: {str(e)}")

@app.post("/api/ai/theory/complete-lesson")
async def complete_theory_lesson(request: LessonCompletionRequest):
    """음악 이론 레슨 완료"""
    try:
        result = theory_service.complete_lesson(
            user_id=request.user_id,
            lesson_id=request.lesson_id,
            score=request.score
        )
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"레슨 완료 실패: {str(e)}")

@app.post("/api/ai/theory/update-progress")
async def update_theory_progress(request: ProgressUpdateRequest):
    """음악 이론 레슨 진행도 업데이트"""
    try:
        result = theory_service.update_progress(
            user_id=request.user_id,
            lesson_id=request.lesson_id,
            progress=request.progress
        )
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"진행도 업데이트 실패: {str(e)}")

@app.get("/api/ai/theory/user-progress/{user_id}")
async def get_user_theory_progress(user_id: int):
    """사용자 음악 이론 학습 진도 조회"""
    try:
        result = theory_service.get_user_progress_summary(user_id)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"사용자 진도 조회 실패: {str(e)}")

@app.get("/api/ai/theory/levels")
async def get_theory_levels():
    """사용 가능한 음악 이론 레벨 조회"""
    levels = ["beginner", "intermediate", "advanced"]
    return {"available_levels": levels}

# Practice Plan API 엔드포인트들
@app.post("/api/ai/practice/analyze-performance")
async def analyze_practice_performance(request: PracticeAnalysisRequest):
    """연습 성과 AI 분석"""
    try:
        result = practice_plan_service.analyze_user_performance(
            user_id=request.user_id,
            practice_history=request.practice_history
        )
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"성과 분석 실패: {str(e)}")

@app.post("/api/ai/practice/generate-plan")
async def generate_practice_plan(request: PracticePlanRequest):
    """개인 맞춤 연습 계획 생성"""
    try:
        result = practice_plan_service.generate_personalized_plan(
            user_id=request.user_id,
            analysis_result=request.analysis_result,
            practice_time=request.practice_time,
            focus_areas=request.focus_areas
        )
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"연습 계획 생성 실패: {str(e)}")

@app.post("/api/ai/practice/track-progress")
async def track_practice_progress(request: PracticeSessionRequest):
    """연습 세션 진행 추적"""
    try:
        result = practice_plan_service.track_practice_progress(
            user_id=request.user_id,
            session_data=request.session_data
        )
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"진행 추적 실패: {str(e)}")

@app.get("/api/ai/practice/areas")
async def get_practice_areas():
    """사용 가능한 연습 영역 조회"""
    try:
        areas = ["harmony", "melody", "rhythm", "technique"]
        return {"available_areas": areas}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"연습 영역 조회 실패: {str(e)}")

# ===== 새로운 AI 서비스 API 엔드포인트 =====

@app.get("/api/ai/status")
async def get_ai_service_status():
    """AI 서비스의 전체 상태를 반환합니다."""
    try:
        status = {
            "composition_service": composition_service.get_service_status(),
            "harmony_ai": harmony_ai_service.get_ai_status(),
            "corpus_integration": {
                "available": corpus_integration_service.corpus_available,
                "status": "active" if corpus_integration_service.corpus_available else "inactive"
            }
        }
        return {"success": True, "data": status}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/ai/composition/enhanced-patterns")
async def get_enhanced_harmony_patterns(
    style: str = "classical",
    difficulty: str = "intermediate",
    length: int = 8,
    mood: str = "neutral"
):
    """고도화된 화성 패턴을 생성합니다."""
    try:
        result = harmony_ai_service._generate_enhanced_harmony_progression(
            style=style,
            difficulty=difficulty,
            length=length,
            mood=mood
        )
        return {"success": True, "data": result}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/ai/composition/ai-vs-enhanced")
async def compare_ai_vs_enhanced(
    style: str = "classical",
    difficulty: str = "intermediate",
    length: int = 6,
    mood: str = "neutral"
):
    """AI 모드와 고도화 모드를 비교합니다."""
    try:
        # AI 모드 결과
        ai_result = None
        if harmony_ai_service.is_ai_available():
            ai_result = harmony_ai_service.generate_ai_harmony_progression(
                style=style, difficulty=difficulty, length=length, mood=mood
            )
        
        # 고도화 모드 결과
        enhanced_result = harmony_ai_service._generate_enhanced_harmony_progression(
            style=style, difficulty=difficulty, length=length, mood=mood
        )
        
        comparison = {
            "ai_mode": ai_result,
            "enhanced_mode": enhanced_result,
            "comparison": {
                "ai_available": harmony_ai_service.is_ai_available(),
                "enhancements_applied": enhanced_result.get("enhancements", {}),
                "pattern_complexity": len(enhanced_result.get("chords", [])),
                "style_specific": enhanced_result.get("source") == "Enhanced Logic"
            }
        }
        
        return {"success": True, "data": comparison}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/ai/corpus/status")
async def get_corpus_status():
    """코퍼스 통합 상태를 반환합니다."""
    try:
        status = {
            "available": corpus_integration_service.corpus_available,
            "base_path": corpus_integration_service._get_corpus_base_path() if hasattr(corpus_integration_service, '_get_corpus_base_path') else "Unknown",
            "status": "active" if corpus_integration_service.corpus_available else "inactive"
        }
        return {"success": True, "data": status}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/ai/corpus/patterns/{style}")
async def get_corpus_patterns(style: str):
    """코퍼스에서 특정 스타일의 화성 패턴을 가져옵니다."""
    try:
        patterns = corpus_integration_service.get_harmony_patterns_from_corpus(style)
        return {"success": True, "data": patterns}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/ai/corpus/curriculum/{level}")
async def get_corpus_curriculum(level: str):
    """코퍼스에서 특정 레벨의 커리큘럼을 가져옵니다."""
    try:
        curriculum = corpus_integration_service.get_curriculum_from_corpus(level)
        return {"success": True, "data": curriculum}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/ai/harmony/advanced-analysis")
async def analyze_harmony_advanced(
    chord_progression: str,
    style: str = "classical"
):
    """고급 화성 분석을 수행합니다."""
    try:
        chords = chord_progression.split("-")
        result = harmony_ai_service.analyze_harmony_with_ai(chords, style)
        return {"success": True, "data": result}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/ai/harmony/modulation-guide")
async def get_modulation_guide(
    from_key: str,
    to_key: str,
    difficulty: str = "beginner",
    style: str = "classical"
):
    """조성 전환 가이드를 생성합니다."""
    try:
        result = harmony_ai_service.generate_ai_modulation_guide(
            from_key=from_key,
            to_key=to_key,
            difficulty=difficulty,
            style=style
        )
        return {"success": True, "data": result}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    port = int(os.getenv("PORT", 8082))
    host = os.getenv("HOST", "0.0.0.0")
    
    print(f"🚀 ChordMind AI Service 시작 중...")
    print(f"📍 서버 주소: http://{host}:{port}")
    print(f"📚 API 문서: http://{host}:{port}/docs")
    
    uvicorn.run(
        "main_simple:app",
        host=host,
        port=port,
        reload=True
    )
