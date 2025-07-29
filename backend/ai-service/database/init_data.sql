-- AI 서비스 초기 데이터

-- 샘플 피드백 데이터
INSERT INTO ai_feedback (user_id, question_type, user_answer, correct_answer, is_correct, time_spent, difficulty, feedback_text, learning_style, confidence_score) VALUES
(1, 'CHORD_NAME', 'Cmaj7', 'Cmaj7', true, 25, 1, '정답입니다! Cmaj7에 대한 이해가 좋습니다.', '직관적 학습자', 0.85),
(1, 'CHORD_NAME', 'Am7', 'Cmaj7', false, 45, 1, '틀렸습니다. 정답은 Cmaj7입니다. 화음의 구성음을 다시 확인해보세요.', '분석적 학습자', 0.65),
(1, 'PROGRESSION', 'G7', 'G7', true, 30, 2, '훌륭합니다! 화음 진행에 대한 이해가 향상되고 있습니다.', '균형잡힌 학습자', 0.90),
(2, 'INTERVAL', 'Perfect 5th', 'Perfect 5th', true, 20, 1, '정확합니다! 음정에 대한 이해가 좋습니다.', '직관적 학습자', 0.88),
(2, 'SCALE', 'C Major', 'C Major', true, 35, 1, '정답입니다! 음계에 대한 기본 개념을 잘 이해하고 있습니다.', '기초 학습자', 0.75);

-- 샘플 힌트 데이터
INSERT INTO ai_hints (user_id, question_type, difficulty, hints, user_accuracy, show_detailed) VALUES
(1, 'CHORD_NAME', 1, ARRAY['화음의 기본 구성음을 생각해보세요.', '3음과 5음의 관계를 확인해보세요.'], 0.75, false),
(1, 'CHORD_NAME', 2, ARRAY['화음의 구성음을 순서대로 나열해보세요.', '7화음의 경우 7음이 추가됩니다.'], 0.65, true),
(2, 'PROGRESSION', 1, ARRAY['기본 진행 패턴을 기억해보세요.', 'I-IV-V 진행을 먼저 확인해보세요.'], 0.80, false);

-- 샘플 학습 경로 데이터
INSERT INTO learning_paths (user_id, learning_goals, learning_steps, estimated_total_time, difficulty_progression, personalized_recommendations, confidence_score) VALUES
(1, 
 '[{"goal_id": "basic_chords", "title": "기본 화음 학습", "description": "기본 화음들을 학습합니다.", "target_accuracy": 0.8, "estimated_time": 60, "priority": 3}]',
 '[{"step_id": "step_1", "goal_id": "basic_chords", "title": "화음 기초", "description": "기본 화음들을 학습합니다.", "difficulty": "초급", "estimated_time": 20, "order": 1}]',
 60,
 '[{"step": 1, "difficulty": "초급"}]',
 ARRAY['기본 개념부터 차근차근 학습하세요.'],
 0.75
);

-- 샘플 행동 분석 데이터
INSERT INTO user_behavior_analysis (user_id, analysis_type, learning_pattern, improvement_rate, learning_efficiency, analysis_confidence, time_patterns, difficulty_preference) VALUES
(1, 'comprehensive', '균형잡힌 학습자', 15.5, 0.025, 0.82, 
 '{"average_time": 35.5, "time_distribution": {"빠름 (0-30초)": 3, "보통 (31-60초)": 2, "느림 (61초 이상)": 1}}',
 '{"preferred_difficulty": 2, "difficulty_range": [1, 3]}'),
(2, 'comprehensive', '직관적 학습자', 22.3, 0.035, 0.88,
 '{"average_time": 28.0, "time_distribution": {"빠름 (0-30초)": 4, "보통 (31-60초)": 1, "느림 (61초 이상)": 0}}',
 '{"preferred_difficulty": 2, "difficulty_range": [1, 2]}');

-- 샘플 적응형 문제 데이터
INSERT INTO adaptive_questions (user_id, question_type, question_text, options, correct_answer, difficulty, explanation, adaptive_difficulty, question_pattern) VALUES
(1, 'CHORD_NAME', '다음 화음의 이름은 무엇인가요?', ARRAY['Dm7', 'Fmaj7', 'G7', 'Am7'], 'Dm7', 2, '적응형 CHORD_NAME 문제입니다.', 2, 'intermediate'),
(1, 'PROGRESSION', '기본 화음 진행을 완성하세요.', ARRAY['G7', 'Am', 'F', 'C'], 'G7', 1, '적응형 PROGRESSION 문제입니다.', 1, 'basic'),
(2, 'INTERVAL', '주어진 음정의 정확한 이름을 선택하세요.', ARRAY['Major 3rd', 'Perfect 4th', 'Perfect 5th', 'Minor 6th'], 'Perfect 5th', 2, '적응형 INTERVAL 문제입니다.', 2, 'intermediate'); 