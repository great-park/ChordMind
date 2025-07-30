import os
import psycopg2
from psycopg2.extras import RealDictCursor
from typing import Dict, List, Any, Optional
import logging
from datetime import datetime
import json

class DatabaseManager:
    def __init__(self):
        self.logger = logging.getLogger(__name__)
        self.connection = None
        self._validate_environment()
        self.connect()
    
    def _validate_environment(self):
        """데이터베이스 연결에 필요한 환경 변수를 검증합니다."""
        required_vars = ['DB_HOST', 'DB_USER', 'DB_PASSWORD']
        missing_vars = []
        
        for var in required_vars:
            if not os.getenv(var):
                missing_vars.append(var)
        
        if missing_vars:
            raise ValueError(f"데이터베이스 연결에 필요한 환경 변수가 설정되지 않았습니다: {', '.join(missing_vars)}")
    
    def connect(self):
        """데이터베이스에 연결합니다."""
        try:
            self.connection = psycopg2.connect(
                host=os.getenv('DB_HOST', 'your_db_host'),
                port=os.getenv('DB_PORT', '5432'),
                database=os.getenv('DB_NAME', 'chordmind_ai'),
                user=os.getenv('DB_USER', 'your_db_user'),
                password=os.getenv('DB_PASSWORD', 'your_secure_password')
            )
            self.logger.info("데이터베이스 연결 성공")
        except Exception as e:
            self.logger.error(f"데이터베이스 연결 실패: {str(e)}")
            self.connection = None
    
    def get_cursor(self):
        """커서를 반환합니다."""
        if self.connection and not self.connection.closed:
            return self.connection.cursor(cursor_factory=RealDictCursor)
        else:
            self.connect()
            return self.connection.cursor(cursor_factory=RealDictCursor) if self.connection else None
    
    def execute_query(self, query: str, params: tuple = None) -> List[Dict[str, Any]]:
        """쿼리를 실행하고 결과를 반환합니다."""
        cursor = self.get_cursor()
        if not cursor:
            return []
        
        try:
            cursor.execute(query, params)
            if query.strip().upper().startswith('SELECT'):
                return [dict(row) for row in cursor.fetchall()]
            else:
                self.connection.commit()
                return []
        except Exception as e:
            self.logger.error(f"쿼리 실행 실패: {str(e)}")
            if self.connection:
                self.connection.rollback()
            return []
        finally:
            cursor.close()
    
    def insert_feedback(self, feedback_data: Dict[str, Any]) -> bool:
        """피드백을 저장합니다."""
        query = """
        INSERT INTO ai_feedback (
            user_id, question_type, user_answer, correct_answer, is_correct,
            time_spent, difficulty, feedback_text, learning_style,
            performance_analysis, improvement_suggestions, confidence_score
        ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
        """
        
        params = (
            feedback_data['user_id'],
            feedback_data['question_type'],
            feedback_data['user_answer'],
            feedback_data['correct_answer'],
            feedback_data['is_correct'],
            feedback_data.get('time_spent'),
            feedback_data.get('difficulty'),
            feedback_data['feedback_text'],
            feedback_data.get('learning_style'),
            json.dumps(feedback_data.get('performance_analysis', {})),
            feedback_data.get('improvement_suggestions', []),
            feedback_data.get('confidence_score', 0.0)
        )
        
        result = self.execute_query(query, params)
        return len(result) == 0  # INSERT는 결과가 없어야 성공
    
    def get_feedback_history(self, user_id: int, limit: int = 10) -> List[Dict[str, Any]]:
        """사용자의 피드백 히스토리를 가져옵니다."""
        query = """
        SELECT * FROM ai_feedback 
        WHERE user_id = %s 
        ORDER BY created_at DESC 
        LIMIT %s
        """
        
        return self.execute_query(query, (user_id, limit))
    
    def insert_hints(self, hints_data: Dict[str, Any]) -> bool:
        """힌트를 저장합니다."""
        query = """
        INSERT INTO ai_hints (
            user_id, question_type, difficulty, hints, user_accuracy, show_detailed
        ) VALUES (%s, %s, %s, %s, %s, %s)
        """
        
        params = (
            hints_data['user_id'],
            hints_data['question_type'],
            hints_data['difficulty'],
            hints_data['hints'],
            hints_data.get('user_accuracy', 0.0),
            hints_data.get('show_detailed', False)
        )
        
        result = self.execute_query(query, params)
        return len(result) == 0
    
    def insert_learning_path(self, learning_path_data: Dict[str, Any]) -> bool:
        """학습 경로를 저장합니다."""
        query = """
        INSERT INTO learning_paths (
            user_id, learning_goals, learning_steps, estimated_total_time,
            difficulty_progression, personalized_recommendations, confidence_score,
            include_weakest_areas, include_time_estimate, max_recommendations
        ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
        """
        
        params = (
            learning_path_data['user_id'],
            json.dumps(learning_path_data['learning_goals']),
            json.dumps(learning_path_data['learning_steps']),
            learning_path_data['estimated_total_time'],
            json.dumps(learning_path_data.get('difficulty_progression', [])),
            learning_path_data.get('personalized_recommendations', []),
            learning_path_data.get('confidence_score', 0.0),
            learning_path_data.get('include_weakest_areas', True),
            learning_path_data.get('include_time_estimate', True),
            learning_path_data.get('max_recommendations', 5)
        )
        
        result = self.execute_query(query, params)
        return len(result) == 0
    
    def insert_behavior_analysis(self, analysis_data: Dict[str, Any]) -> bool:
        """행동 분석을 저장합니다."""
        query = """
        INSERT INTO user_behavior_analysis (
            user_id, analysis_type, learning_pattern, time_patterns,
            difficulty_preference, improvement_rate, learning_efficiency,
            analysis_confidence, time_analysis, difficulty_analysis,
            persistence_analysis, improvement_trend, efficiency_analysis
        ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
        """
        
        params = (
            analysis_data['user_id'],
            analysis_data.get('analysis_type', 'comprehensive'),
            analysis_data.get('learning_pattern'),
            json.dumps(analysis_data.get('time_patterns', {})),
            json.dumps(analysis_data.get('difficulty_preference', {})),
            analysis_data.get('improvement_rate', 0.0),
            analysis_data.get('learning_efficiency', 0.0),
            analysis_data.get('analysis_confidence', 0.0),
            json.dumps(analysis_data.get('time_analysis', {})),
            json.dumps(analysis_data.get('difficulty_analysis', {})),
            json.dumps(analysis_data.get('persistence_analysis', {})),
            json.dumps(analysis_data.get('improvement_trend', {})),
            json.dumps(analysis_data.get('efficiency_analysis', {}))
        )
        
        result = self.execute_query(query, params)
        return len(result) == 0
    
    def insert_adaptive_question(self, question_data: Dict[str, Any]) -> bool:
        """적응형 문제를 저장합니다."""
        query = """
        INSERT INTO adaptive_questions (
            user_id, question_type, question_text, options, correct_answer,
            difficulty, explanation, adaptive_difficulty, question_pattern
        ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)
        """
        
        params = (
            question_data['user_id'],
            question_data['question_type'],
            question_data['question_text'],
            question_data['options'],
            question_data['correct_answer'],
            question_data['difficulty'],
            question_data.get('explanation'),
            question_data.get('adaptive_difficulty'),
            question_data.get('question_pattern')
        )
        
        result = self.execute_query(query, params)
        return len(result) == 0
    
    def get_user_performance_stats(self, user_id: int) -> Dict[str, Any]:
        """사용자의 성과 통계를 가져옵니다."""
        query = """
        SELECT 
            COUNT(*) as total_attempts,
            COUNT(CASE WHEN is_correct THEN 1 END) as correct_attempts,
            AVG(CASE WHEN is_correct THEN 1.0 ELSE 0.0 END) as accuracy,
            AVG(time_spent) as average_time,
            question_type,
            AVG(confidence_score) as avg_confidence
        FROM ai_feedback 
        WHERE user_id = %s 
        GROUP BY question_type
        """
        
        results = self.execute_query(query, (user_id,))
        
        if not results:
            return {
                "total_attempts": 0,
                "correct_attempts": 0,
                "accuracy": 0.0,
                "average_time": 0,
                "type_stats": {}
            }
        
        total_attempts = sum(row['total_attempts'] for row in results)
        correct_attempts = sum(row['correct_attempts'] for row in results)
        overall_accuracy = correct_attempts / total_attempts if total_attempts > 0 else 0.0
        average_time = sum(row['average_time'] or 0 for row in results) / len(results)
        
        type_stats = {}
        for row in results:
            type_stats[row['question_type']] = {
                "attempts": row['total_attempts'],
                "correct": row['correct_attempts'],
                "accuracy": row['accuracy'],
                "average_time": row['average_time'],
                "avg_confidence": row['avg_confidence']
            }
        
        return {
            "total_attempts": total_attempts,
            "correct_attempts": correct_attempts,
            "accuracy": overall_accuracy,
            "average_time": average_time,
            "type_stats": type_stats
        }
    
    def get_service_config(self, service_name: str, config_key: str) -> Optional[str]:
        """서비스 설정을 가져옵니다."""
        query = """
        SELECT config_value FROM ai_service_config 
        WHERE service_name = %s AND config_key = %s AND is_active = true
        """
        
        results = self.execute_query(query, (service_name, config_key))
        return results[0]['config_value'] if results else None
    
    def close(self):
        """데이터베이스 연결을 닫습니다."""
        if self.connection and not self.connection.closed:
            self.connection.close()
            self.logger.info("데이터베이스 연결 종료") 