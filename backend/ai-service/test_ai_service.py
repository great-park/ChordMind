import pytest
import asyncio
from unittest.mock import Mock, patch
import sys
import os

# 프로젝트 루트를 Python 경로에 추가
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from ai_engine import AIEngine
from services.personalized_feedback import PersonalizedFeedbackService
from services.adaptive_learning import AdaptiveLearningService
from services.smart_hints import SmartHintsService
from services.behavior_analysis import BehaviorAnalysisService

class TestAIEngine:
    def setup_method(self):
        self.ai_engine = AIEngine()
    
    def test_ai_engine_initialization(self):
        """AI 엔진 초기화 테스트"""
        assert self.ai_engine is not None
        # 실제 모델 로딩은 시간이 걸리므로 기본값 확인
        assert hasattr(self.ai_engine, 'is_initialized')
    
    def test_generate_personalized_feedback(self):
        """개인화된 피드백 생성 테스트"""
        user_history = [
            {"question_type": "CHORD_NAME", "is_correct": True, "time_spent": 30},
            {"question_type": "CHORD_NAME", "is_correct": False, "time_spent": 60}
        ]
        
        feedback = self.ai_engine.generate_personalized_feedback(
            question_type="CHORD_NAME",
            user_answer="C",
            correct_answer="C major",
            is_correct=False,
            user_history=user_history,
            time_spent=45
        )
        
        assert isinstance(feedback, dict)
        assert "feedback" in feedback
        assert "learning_style" in feedback
        assert "performance_analysis" in feedback
    
    def test_generate_adaptive_questions(self):
        """적응형 문제 생성 테스트"""
        user_history = [
            {"question_type": "CHORD_NAME", "is_correct": True, "time_spent": 30},
            {"question_type": "CHORD_NAME", "is_correct": False, "time_spent": 60}
        ]
        
        questions = self.ai_engine.generate_adaptive_questions(
            user_history=user_history,
            question_type="CHORD_NAME",
            count=2
        )
        
        assert isinstance(questions, list)
        assert len(questions) == 2
        for question in questions:
            assert "question" in question
            assert "options" in question
            assert "correct_answer" in question
    
    def test_analyze_user_behavior(self):
        """사용자 행동 분석 테스트"""
        user_history = [
            {"question_type": "CHORD_NAME", "is_correct": True, "time_spent": 30},
            {"question_type": "CHORD_NAME", "is_correct": False, "time_spent": 60},
            {"question_type": "PROGRESSION", "is_correct": True, "time_spent": 45}
        ]
        
        analysis = self.ai_engine.analyze_user_behavior(user_history)
        
        assert isinstance(analysis, dict)
        assert "learning_pattern" in analysis
        assert "time_patterns" in analysis
        assert "difficulty_preference" in analysis

class TestPersonalizedFeedbackService:
    def setup_method(self):
        self.ai_engine = AIEngine()
        self.service = PersonalizedFeedbackService(self.ai_engine)
    
    @pytest.mark.asyncio
    async def test_generate_feedback(self):
        """피드백 생성 서비스 테스트"""
        with patch.object(self.service, '_get_user_history') as mock_get_history:
            mock_get_history.return_value = [
                {"question_type": "CHORD_NAME", "is_correct": True, "time_spent": 30}
            ]
            
            feedback = await self.service.generate_feedback(
                user_id=1,
                question_type="CHORD_NAME",
                user_answer="C",
                correct_answer="C major",
                is_correct=False,
                time_spent=45
            )
            
            assert isinstance(feedback, dict)
            assert "success" in feedback
            assert "feedback" in feedback
    
    @pytest.mark.asyncio
    async def test_get_user_history(self):
        """사용자 히스토리 조회 테스트"""
        with patch('httpx.AsyncClient.get') as mock_get:
            mock_response = Mock()
            mock_response.status_code = 200
            mock_response.json.return_value = [
                {"question_type": "CHORD_NAME", "is_correct": True}
            ]
            mock_get.return_value = mock_response
            
            history = await self.service._get_user_history(1)
            
            assert isinstance(history, list)
            assert len(history) == 1

class TestAdaptiveLearningService:
    def setup_method(self):
        self.ai_engine = AIEngine()
        self.service = AdaptiveLearningService(self.ai_engine)
    
    @pytest.mark.asyncio
    async def test_generate_questions(self):
        """적응형 문제 생성 서비스 테스트"""
        with patch.object(self.service, '_get_user_history') as mock_get_history:
            mock_get_history.return_value = [
                {"question_type": "CHORD_NAME", "is_correct": True, "time_spent": 30}
            ]
            
            questions = await self.service.generate_questions(
                user_id=1,
                question_type="CHORD_NAME",
                count=2
            )
            
            assert isinstance(questions, list)
            assert len(questions) == 2
    
    @pytest.mark.asyncio
    async def test_analyze_weakest_areas(self):
        """약점 영역 분석 테스트"""
        with patch.object(self.service, '_get_user_history') as mock_get_history:
            mock_get_history.return_value = [
                {"question_type": "CHORD_NAME", "is_correct": True, "time_spent": 30},
                {"question_type": "CHORD_NAME", "is_correct": False, "time_spent": 60},
                {"question_type": "PROGRESSION", "is_correct": False, "time_spent": 90}
            ]
            
            weakest_areas = await self.service._analyze_weakest_areas(1)
            
            assert isinstance(weakest_areas, list)
            for area in weakest_areas:
                assert hasattr(area, 'question_type')
                assert hasattr(area, 'accuracy')
                assert hasattr(area, 'priority')

class TestSmartHintsService:
    def setup_method(self):
        self.ai_engine = AIEngine()
        self.service = SmartHintsService(self.ai_engine)
    
    @pytest.mark.asyncio
    async def test_generate_hints(self):
        """스마트 힌트 생성 테스트"""
        with patch.object(self.service, '_get_user_accuracy') as mock_get_accuracy:
            mock_get_accuracy.return_value = 0.7
            
            hints = await self.service.generate_hints(
                user_id=1,
                question_type="CHORD_NAME",
                difficulty=2,
                show_detailed=True
            )
            
            assert isinstance(hints, dict)
            assert "hints" in hints
            assert "total_hints" in hints
            assert "user_accuracy" in hints
    
    def test_get_base_hints(self):
        """기본 힌트 조회 테스트"""
        hints = self.service._get_base_hints("CHORD_NAME", 1)
        
        assert isinstance(hints, list)
        assert len(hints) > 0
        assert all(isinstance(hint, str) for hint in hints)
    
    def test_adjust_hints_for_user(self):
        """사용자별 힌트 조정 테스트"""
        hints = ["힌트 1", "힌트 2", "힌트 3", "힌트 4"]
        
        adjusted = self.service._adjust_hints_for_user(
            hints, 0.8, 2, False
        )
        
        assert isinstance(adjusted, list)
        assert len(adjusted) <= len(hints)
        assert all("💡" in hint for hint in adjusted)

class TestBehaviorAnalysisService:
    def setup_method(self):
        self.ai_engine = AIEngine()
        self.service = BehaviorAnalysisService(self.ai_engine)
    
    @pytest.mark.asyncio
    async def test_analyze_behavior(self):
        """행동 분석 테스트"""
        with patch.object(self.service, '_get_user_history') as mock_get_history:
            mock_get_history.return_value = [
                {"question_type": "CHORD_NAME", "is_correct": True, "time_spent": 30},
                {"question_type": "CHORD_NAME", "is_correct": False, "time_spent": 60}
            ]
            
            analysis = await self.service.analyze_behavior(
                user_id=1,
                analysis_type="comprehensive"
            )
            
            assert isinstance(analysis, dict)
            assert "learning_pattern" in analysis
            assert "time_patterns" in analysis
    
    def test_analyze_time_patterns(self):
        """시간 패턴 분석 테스트"""
        user_history = [
            {"time_spent": 30},
            {"time_spent": 60},
            {"time_spent": 45}
        ]
        
        patterns = self.service._analyze_time_patterns(user_history)
        
        assert isinstance(patterns, dict)
        assert "average_time" in patterns
        assert "time_distribution" in patterns
        assert patterns["average_time"] == 45.0
    
    def test_analyze_accuracy_patterns(self):
        """정확도 패턴 분석 테스트"""
        user_history = [
            {"is_correct": True},
            {"is_correct": False},
            {"is_correct": True}
        ]
        
        patterns = self.service._analyze_accuracy_patterns(user_history)
        
        assert isinstance(patterns, dict)
        assert "overall_accuracy" in patterns
        assert "accuracy_trend" in patterns
        assert patterns["overall_accuracy"] == 2/3

if __name__ == "__main__":
    pytest.main([__file__, "-v"]) 