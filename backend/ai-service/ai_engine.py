import numpy as np
import pandas as pd
from sklearn.ensemble import RandomForestClassifier, GradientBoostingRegressor
from sklearn.preprocessing import StandardScaler
from sklearn.cluster import KMeans
from sklearn.decomposition import PCA
# import tensorflow as tf  # 시뮬레이션 모드에서는 제외
# from transformers import pipeline, AutoTokenizer, AutoModel  # 시뮬레이션 모드에서는 제외
# import torch  # 시뮬레이션 모드에서는 제외
# from sentence_transformers import SentenceTransformer  # 시뮬레이션 모드에서는 제외
import joblib
import os
from typing import Dict, List, Any, Optional, Tuple
import logging
from datetime import datetime, timedelta

class AIEngine:
    def __init__(self):
        self.logger = logging.getLogger(__name__)
        self.models = {}
        self.scalers = {}
        self.tokenizer = None
        self.sentence_model = None
        self.text_generator = None
        self.is_initialized = False
        self.initialize_models()
    
    def initialize_models(self):
        """AI 모델들을 초기화합니다."""
        try:
            # 실제 AI 모델 대신 시뮬레이션 모드로 초기화
            self.text_generator = None
            self.sentence_model = None
            self.tokenizer = None
            
            # 학습 데이터 기반 모델들
            self._initialize_ml_models()
            
            self.is_initialized = True
            self.logger.info("AI 엔진 초기화 완료 (시뮬레이션 모드)")
            
        except Exception as e:
            self.logger.error(f"AI 엔진 초기화 실패: {str(e)}")
            self.is_initialized = False
    
    def _initialize_ml_models(self):
        """머신러닝 모델들을 초기화합니다."""
        # 사용자 행동 분류 모델
        self.models['behavior_classifier'] = RandomForestClassifier(
            n_estimators=100,
            max_depth=10,
            random_state=42
        )
        
        # 학습 성과 예측 모델
        self.models['performance_predictor'] = GradientBoostingRegressor(
            n_estimators=100,
            max_depth=5,
            random_state=42
        )
        
        # 난이도 추천 모델
        self.models['difficulty_recommender'] = RandomForestClassifier(
            n_estimators=50,
            max_depth=8,
            random_state=42
        )
        
        # 스케일러들
        self.scalers['feature_scaler'] = StandardScaler()
        self.scalers['time_scaler'] = StandardScaler()
    
    def is_ready(self) -> bool:
        """AI 엔진이 준비되었는지 확인합니다."""
        return self.is_initialized
    
    def generate_personalized_feedback(
        self,
        question_type: str,
        user_answer: str,
        correct_answer: str,
        is_correct: bool,
        user_history: List[Dict],
        time_spent: Optional[int] = None
    ) -> Dict[str, Any]:
        """개인화된 피드백을 생성합니다."""
        try:
            # 사용자 성과 분석
            performance_analysis = self._analyze_user_performance(user_history, question_type)
            
            # 텍스트 생성 프롬프트 구성
            prompt = self._create_feedback_prompt(
                question_type, user_answer, correct_answer, 
                is_correct, performance_analysis, time_spent
            )
            
            # AI를 통한 피드백 생성
            generated_feedback = self._generate_text(prompt, max_length=200)
            
            # 학습 스타일 분석
            learning_style = self._analyze_learning_style(user_history)
            
            # 개선 제안 생성
            improvement_suggestions = self._generate_improvement_suggestions(
                performance_analysis, learning_style
            )
            
            return {
                "feedback": generated_feedback,
                "learning_style": learning_style,
                "performance_analysis": performance_analysis,
                "improvement_suggestions": improvement_suggestions,
                "confidence_score": self._calculate_confidence_score(performance_analysis),
                "generated_at": datetime.now().isoformat()
            }
            
        except Exception as e:
            self.logger.error(f"피드백 생성 실패: {str(e)}")
            return self._generate_fallback_feedback(is_correct, correct_answer)
    
    def generate_adaptive_questions(
        self,
        user_history: List[Dict],
        question_type: str,
        count: int = 1
    ) -> List[Dict[str, Any]]:
        """적응형 문제를 생성합니다."""
        try:
            # 사용자 성과 분석
            performance = self._analyze_user_performance(user_history, question_type)
            
            # 적응형 난이도 결정
            adaptive_difficulty = self._determine_adaptive_difficulty(performance)
            
            # 문제 패턴 선택
            question_pattern = self._select_question_pattern(performance, question_type)
            
            # AI를 통한 문제 생성
            questions = []
            for i in range(count):
                question = self._generate_adaptive_question(
                    question_type, adaptive_difficulty, question_pattern, performance
                )
                questions.append(question)
            
            return questions
            
        except Exception as e:
            self.logger.error(f"적응형 문제 생성 실패: {str(e)}")
            return self._generate_fallback_questions(question_type, count)
    
    def generate_smart_hints(
        self,
        user_history: List[Dict],
        question_type: str,
        difficulty: int,
        user_accuracy: float
    ) -> List[str]:
        """스마트 힌트를 생성합니다."""
        try:
            # 기본 힌트 생성
            base_hints = self._generate_base_hints(question_type, difficulty)
            
            # 사용자 성과에 따른 힌트 조정
            adaptive_hints = self._adapt_hints_to_user(base_hints, user_accuracy, user_history)
            
            # AI를 통한 추가 힌트 생성
            ai_hints = self._generate_ai_hints(question_type, difficulty, user_accuracy)
            
            return adaptive_hints + ai_hints
            
        except Exception as e:
            self.logger.error(f"스마트 힌트 생성 실패: {str(e)}")
            return self._generate_fallback_hints(question_type, difficulty)
    
    def analyze_user_behavior(self, user_history: List[Dict]) -> Dict[str, Any]:
        """사용자 행동을 분석합니다."""
        try:
            # 특성 추출
            features = self._extract_behavior_features(user_history)
            
            # 클러스터링을 통한 학습 패턴 분석
            learning_pattern = self._analyze_learning_pattern(features)
            
            # 시간 패턴 분석
            time_patterns = self._analyze_time_patterns(user_history)
            
            # 난이도 선호도 분석
            difficulty_preference = self._analyze_difficulty_preference(user_history)
            
            # 개선률 계산
            improvement_rate = self._calculate_improvement_rate(user_history)
            
            # 학습 효율성 계산
            learning_efficiency = self._calculate_learning_efficiency(user_history)
            
            return {
                "learning_pattern": learning_pattern,
                "time_patterns": time_patterns,
                "difficulty_preference": difficulty_preference,
                "improvement_rate": improvement_rate,
                "learning_efficiency": learning_efficiency,
                "behavior_features": features,
                "analysis_confidence": self._calculate_analysis_confidence(features)
            }
            
        except Exception as e:
            self.logger.error(f"행동 분석 실패: {str(e)}")
            return self._generate_fallback_behavior_analysis()
    
    def generate_learning_path(
        self,
        user_stats: Dict[str, Any],
        weakest_areas: List[Dict],
        user_behavior: Dict[str, Any]
    ) -> Dict[str, Any]:
        """개인화된 학습 경로를 생성합니다."""
        try:
            # 학습 목표 설정
            learning_goals = self._set_learning_goals(user_stats, weakest_areas)
            
            # 학습 단계 계획
            learning_steps = self._plan_learning_steps(learning_goals, user_behavior)
            
            # 예상 시간 계산
            estimated_time = self._calculate_estimated_time(learning_steps, user_behavior)
            
            # 난이도 진행 계획
            difficulty_progression = self._plan_difficulty_progression(user_stats)
            
            # AI를 통한 개인화된 추천
            personalized_recommendations = self._generate_personalized_recommendations(
                user_stats, weakest_areas, user_behavior
            )
            
            return {
                "learning_goals": learning_goals,
                "learning_steps": learning_steps,
                "estimated_time": estimated_time,
                "difficulty_progression": difficulty_progression,
                "personalized_recommendations": personalized_recommendations,
                "confidence_score": self._calculate_path_confidence(user_stats)
            }
            
        except Exception as e:
            self.logger.error(f"학습 경로 생성 실패: {str(e)}")
            return self._generate_fallback_learning_path()
    
    def _analyze_user_performance(self, user_history: List[Dict], question_type: str) -> Dict[str, Any]:
        """사용자 성과를 분석합니다."""
        if not user_history:
            return {"accuracy": 0.0, "total_attempts": 0, "recent_performance": []}
        
        type_history = [h for h in user_history if h.get("type") == question_type]
        
        if not type_history:
            return {"accuracy": 0.0, "total_attempts": 0, "recent_performance": []}
        
        correct_count = sum(1 for h in type_history if h.get("correct", False))
        total_count = len(type_history)
        accuracy = correct_count / total_count if total_count > 0 else 0.0
        
        recent_performance = [h.get("correct", False) for h in type_history[-5:]]
        
        return {
            "accuracy": accuracy,
            "total_attempts": total_count,
            "recent_performance": recent_performance,
            "correct_count": correct_count,
            "average_time": np.mean([h.get("time_spent", 0) for h in type_history]) if type_history else 0
        }
    
    def _create_feedback_prompt(
        self,
        question_type: str,
        user_answer: str,
        correct_answer: str,
        is_correct: bool,
        performance_analysis: Dict[str, Any],
        time_spent: Optional[int] = None
    ) -> str:
        """피드백 생성을 위한 프롬프트를 생성합니다."""
        prompt = f"""
        음악 이론 학습 피드백을 생성해주세요.
        
        문제 유형: {question_type}
        사용자 답변: {user_answer}
        정답: {correct_answer}
        정답 여부: {'맞음' if is_correct else '틀림'}
        사용자 정확도: {performance_analysis.get('accuracy', 0.0):.2f}
        총 시도 횟수: {performance_analysis.get('total_attempts', 0)}
        소요 시간: {time_spent}초
        
        다음을 포함한 개인화된 피드백을 생성해주세요:
        1. 정답/오답에 대한 설명
        2. 음악적 개념 설명
        3. 개선 방향 제시
        4. 격려의 메시지
        """
        return prompt
    
    def _generate_text(self, prompt: str, max_length: int = 200) -> str:
        """AI를 사용하여 텍스트를 생성합니다."""
        try:
            if self.text_generator:
                result = self.text_generator(
                    prompt,
                    max_length=max_length,
                    num_return_sequences=1,
                    temperature=0.7
                )
                return result[0]['generated_text']
            else:
                # 시뮬레이션 모드: 프롬프트 기반으로 간단한 텍스트 생성
                return self._generate_simulation_text(prompt)
        except Exception as e:
            self.logger.error(f"텍스트 생성 실패: {str(e)}")
            return self._generate_fallback_text(prompt)
    
    def _generate_simulation_text(self, prompt: str) -> str:
        """시뮬레이션 모드에서 텍스트를 생성합니다."""
        if "맞음" in prompt or "정답" in prompt:
            return "정답입니다! 훌륭한 이해를 보여주고 있습니다. 계속해서 이런 수준을 유지해보세요."
        elif "틀림" in prompt or "틀렸" in prompt:
            return "틀렸지만 괜찮습니다. 실수는 학습의 일부입니다. 정답을 확인하고 다시 시도해보세요."
        elif "화음" in prompt:
            return "화음에 대한 이해가 점점 좋아지고 있습니다. 기본 구성음을 잘 기억하고 있네요."
        elif "진행" in prompt:
            return "화음 진행에 대한 이해가 향상되고 있습니다. 기능적 관계를 잘 파악하고 계시네요."
        else:
            return "음악 이론 학습에 대한 열정이 보입니다. 꾸준한 연습이 실력 향상의 핵심입니다."
    
    def _analyze_learning_style(self, user_history: List[Dict]) -> str:
        """학습 스타일을 분석합니다."""
        if not user_history:
            return "기초 학습자"
        
        times = [h.get("time_spent", 0) for h in user_history]
        accuracies = [h.get("correct", False) for h in user_history]
        
        avg_time = np.mean(times) if times else 0
        avg_accuracy = np.mean(accuracies) if accuracies else 0
        
        if avg_time < 30 and avg_accuracy > 0.8:
            return "직관적 학습자"
        elif avg_time > 60 and avg_accuracy > 0.7:
            return "분석적 학습자"
        elif avg_accuracy < 0.5:
            return "기초 학습자"
        else:
            return "균형잡힌 학습자"
    
    def _determine_adaptive_difficulty(self, performance: Dict[str, Any]) -> int:
        """적응형 난이도를 결정합니다."""
        accuracy = performance.get("accuracy", 0.0)
        recent_performance = performance.get("recent_performance", [])
        
        if accuracy >= 0.9 and all(recent_performance):
            return 3  # 고급
        elif accuracy >= 0.7 and sum(recent_performance) >= 3:
            return 2  # 중급
        elif accuracy >= 0.5:
            return 2  # 중급
        else:
            return 1  # 초급
    
    def _extract_behavior_features(self, user_history: List[Dict]) -> np.ndarray:
        """행동 특성을 추출합니다."""
        if not user_history:
            return np.array([])
        
        features = []
        for history in user_history:
            feature_vector = [
                history.get("time_spent", 0),
                int(history.get("correct", False)),
                history.get("difficulty", 1),
                len(history.get("user_answer", "")),
                len(history.get("correct_answer", ""))
            ]
            features.append(feature_vector)
        
        return np.array(features)
    
    def _analyze_learning_pattern(self, features: np.ndarray) -> str:
        """학습 패턴을 분석합니다."""
        if len(features) < 5:
            return "데이터 부족"
        
        try:
            # PCA를 통한 차원 축소
            pca = PCA(n_components=2)
            reduced_features = pca.fit_transform(features)
            
            # K-means 클러스터링
            kmeans = KMeans(n_clusters=3, random_state=42)
            clusters = kmeans.fit_predict(reduced_features)
            
            # 클러스터 분석
            cluster_sizes = np.bincount(clusters)
            dominant_cluster = np.argmax(cluster_sizes)
            
            patterns = ["일관적", "다양함", "불규칙"]
            return patterns[dominant_cluster]
            
        except Exception as e:
            self.logger.error(f"학습 패턴 분석 실패: {str(e)}")
            return "분석 불가"
    
    def _calculate_improvement_rate(self, user_history: List[Dict]) -> float:
        """개선률을 계산합니다."""
        if len(user_history) < 10:
            return 0.0
        
        mid_point = len(user_history) // 2
        first_half = user_history[:mid_point]
        second_half = user_history[mid_point:]
        
        first_accuracy = np.mean([h.get("correct", False) for h in first_half])
        second_accuracy = np.mean([h.get("correct", False) for h in second_half])
        
        if first_accuracy > 0:
            return ((second_accuracy - first_accuracy) / first_accuracy) * 100
        return 0.0
    
    def _calculate_learning_efficiency(self, user_history: List[Dict]) -> float:
        """학습 효율성을 계산합니다."""
        if not user_history:
            return 0.0
        
        correct_answers = sum(1 for h in user_history if h.get("correct", False))
        total_attempts = len(user_history)
        avg_time = np.mean([h.get("time_spent", 0) for h in user_history])
        
        if total_attempts > 0 and avg_time > 0:
            return (correct_answers / total_attempts) / (avg_time / 60.0)
        return 0.0
    
    def _generate_fallback_feedback(self, is_correct: bool, correct_answer: str) -> Dict[str, Any]:
        """기본 피드백을 생성합니다."""
        if is_correct:
            feedback = f"정답입니다! {correct_answer}에 대한 이해가 좋습니다."
        else:
            feedback = f"틀렸습니다. 정답은 {correct_answer}입니다. 다시 한번 학습해보세요."
        
        return {
            "feedback": feedback,
            "learning_style": "기본",
            "performance_analysis": {"accuracy": 0.0},
            "improvement_suggestions": ["계속 연습하세요"],
            "confidence_score": 0.5,
            "generated_at": datetime.now().isoformat()
        }
    
    def _generate_fallback_text(self, prompt: str) -> str:
        """기본 텍스트를 생성합니다."""
        if "맞음" in prompt:
            return "정답입니다! 훌륭한 이해를 보여주고 있습니다."
        else:
            return "틀렸지만 괜찮습니다. 실수는 학습의 일부입니다. 다시 시도해보세요."
    
    def _calculate_confidence_score(self, performance_analysis: Dict[str, Any]) -> float:
        """신뢰도 점수를 계산합니다."""
        accuracy = performance_analysis.get("accuracy", 0.0)
        total_attempts = performance_analysis.get("total_attempts", 0)
        
        # 데이터가 많을수록, 정확도가 높을수록 신뢰도 증가
        confidence = min(accuracy * 0.7 + min(total_attempts / 10, 0.3), 1.0)
        return confidence
    
    def _generate_fallback_behavior_analysis(self) -> Dict[str, Any]:
        """기본 행동 분석을 생성합니다."""
        return {
            "learning_pattern": "분석 불가",
            "time_patterns": {"average_time": 0},
            "difficulty_preference": {"preference": "기본"},
            "improvement_rate": 0.0,
            "learning_efficiency": 0.0,
            "analysis_confidence": 0.0
        } 
    
    def _select_question_pattern(self, performance: Dict[str, Any], question_type: str) -> str:
        """문제 패턴을 선택합니다."""
        accuracy = performance.get("accuracy", 0.0)
        
        if accuracy < 0.5:
            return "basic"
        elif accuracy < 0.8:
            return "intermediate"
        else:
            return "advanced"
    
    def _generate_adaptive_question(
        self, 
        question_type: str, 
        difficulty: int, 
        pattern: str, 
        performance: Dict[str, Any]
    ) -> Dict[str, Any]:
        """적응형 문제를 생성합니다."""
        # 시뮬레이션 모드: 간단한 문제 생성
        question_templates = {
            "CHORD_NAME": {
                "basic": "다음 화음의 이름은 무엇인가요?",
                "intermediate": "주어진 화음의 정확한 이름을 선택하세요.",
                "advanced": "복합 화음의 정확한 명칭을 판단하세요."
            },
            "PROGRESSION": {
                "basic": "기본 화음 진행을 완성하세요.",
                "intermediate": "적절한 화음 진행을 선택하세요.",
                "advanced": "고급 화음 진행 패턴을 분석하세요."
            }
        }
        
        template = question_templates.get(question_type, {}).get(pattern, "기본 문제")
        
        return {
            "id": f"adaptive_{question_type}_{difficulty}_{pattern}",
            "question_type": question_type,
            "question": template,
            "options": ["A", "B", "C", "D"],
            "correct_answer": "A",
            "difficulty": difficulty,
            "explanation": f"적응형 {question_type} 문제입니다."
        }
    
    def _generate_fallback_questions(self, question_type: str, count: int) -> List[Dict[str, Any]]:
        """기본 문제를 생성합니다."""
        questions = []
        for i in range(count):
            questions.append({
                "id": f"fallback_{i}",
                "question_type": question_type,
                "question": f"기본 {question_type} 문제 {i+1}",
                "options": ["A", "B", "C", "D"],
                "correct_answer": "A",
                "difficulty": 1,
                "explanation": "기본 문제입니다."
            })
        return questions 