-- AI 서비스 데이터베이스 스키마

-- 사용자 피드백 테이블
CREATE TABLE IF NOT EXISTS ai_feedback (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL,
    question_type VARCHAR(50) NOT NULL,
    user_answer TEXT NOT NULL,
    correct_answer TEXT NOT NULL,
    is_correct BOOLEAN NOT NULL,
    time_spent INTEGER,
    difficulty INTEGER,
    feedback_text TEXT NOT NULL,
    learning_style VARCHAR(100),
    performance_analysis JSONB,
    improvement_suggestions TEXT[],
    confidence_score DECIMAL(3,2),
    generated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- AI 힌트 테이블
CREATE TABLE IF NOT EXISTS ai_hints (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL,
    question_type VARCHAR(50) NOT NULL,
    difficulty INTEGER NOT NULL,
    hints TEXT[] NOT NULL,
    user_accuracy DECIMAL(3,2),
    show_detailed BOOLEAN DEFAULT FALSE,
    generated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 학습 경로 테이블
CREATE TABLE IF NOT EXISTS learning_paths (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL,
    learning_goals JSONB NOT NULL,
    learning_steps JSONB NOT NULL,
    estimated_total_time INTEGER NOT NULL,
    difficulty_progression JSONB,
    personalized_recommendations TEXT[],
    confidence_score DECIMAL(3,2),
    include_weakest_areas BOOLEAN DEFAULT TRUE,
    include_time_estimate BOOLEAN DEFAULT TRUE,
    max_recommendations INTEGER DEFAULT 5,
    generated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 사용자 행동 분석 테이블
CREATE TABLE IF NOT EXISTS user_behavior_analysis (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL,
    analysis_type VARCHAR(50) DEFAULT 'comprehensive',
    learning_pattern VARCHAR(100),
    time_patterns JSONB,
    difficulty_preference JSONB,
    improvement_rate DECIMAL(5,2),
    learning_efficiency DECIMAL(5,2),
    analysis_confidence DECIMAL(3,2),
    time_analysis JSONB,
    difficulty_analysis JSONB,
    persistence_analysis JSONB,
    improvement_trend JSONB,
    efficiency_analysis JSONB,
    generated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 적응형 문제 테이블
CREATE TABLE IF NOT EXISTS adaptive_questions (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL,
    question_type VARCHAR(50) NOT NULL,
    question_text TEXT NOT NULL,
    options TEXT[] NOT NULL,
    correct_answer TEXT NOT NULL,
    difficulty INTEGER NOT NULL,
    explanation TEXT,
    adaptive_difficulty INTEGER,
    question_pattern VARCHAR(50),
    performance_based BOOLEAN DEFAULT TRUE,
    generated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- AI 서비스 설정 테이블
CREATE TABLE IF NOT EXISTS ai_service_config (
    id SERIAL PRIMARY KEY,
    service_name VARCHAR(100) NOT NULL,
    config_key VARCHAR(100) NOT NULL,
    config_value TEXT NOT NULL,
    description TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(service_name, config_key)
);

-- 인덱스 생성
CREATE INDEX IF NOT EXISTS idx_ai_feedback_user_id ON ai_feedback(user_id);
CREATE INDEX IF NOT EXISTS idx_ai_feedback_question_type ON ai_feedback(question_type);
CREATE INDEX IF NOT EXISTS idx_ai_feedback_created_at ON ai_feedback(created_at);

CREATE INDEX IF NOT EXISTS idx_ai_hints_user_id ON ai_hints(user_id);
CREATE INDEX IF NOT EXISTS idx_ai_hints_question_type ON ai_hints(question_type);

CREATE INDEX IF NOT EXISTS idx_learning_paths_user_id ON learning_paths(user_id);
CREATE INDEX IF NOT EXISTS idx_learning_paths_created_at ON learning_paths(created_at);

CREATE INDEX IF NOT EXISTS idx_user_behavior_analysis_user_id ON user_behavior_analysis(user_id);
CREATE INDEX IF NOT EXISTS idx_user_behavior_analysis_created_at ON user_behavior_analysis(created_at);

CREATE INDEX IF NOT EXISTS idx_adaptive_questions_user_id ON adaptive_questions(user_id);
CREATE INDEX IF NOT EXISTS idx_adaptive_questions_question_type ON adaptive_questions(question_type);

-- 초기 설정 데이터
INSERT INTO ai_service_config (service_name, config_key, config_value, description) VALUES
('ai_engine', 'model_type', 'simulation', 'AI 모델 타입 (simulation/production)'),
('ai_engine', 'confidence_threshold', '0.7', '신뢰도 임계값'),
('feedback_service', 'max_history_count', '100', '최대 피드백 히스토리 개수'),
('adaptive_learning', 'difficulty_adjustment_rate', '0.1', '난이도 조정 비율'),
('smart_hints', 'max_hints_per_question', '5', '문제당 최대 힌트 개수'),
('behavior_analysis', 'analysis_window_days', '30', '행동 분석 기간 (일)')
ON CONFLICT (service_name, config_key) DO NOTHING; 