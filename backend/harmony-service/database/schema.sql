-- Harmony Service 데이터베이스 스키마

-- 퀴즈 타입 ENUM 생성
CREATE TYPE quiz_type AS ENUM ('CHORD_NAME', 'PROGRESSION', 'INTERVAL', 'SCALE');

-- 퀴즈 문제 테이블
CREATE TABLE IF NOT EXISTS quiz_question (
    id BIGSERIAL PRIMARY KEY,
    type quiz_type NOT NULL,
    question TEXT NOT NULL,
    image_url VARCHAR(500),
    answer VARCHAR(255) NOT NULL,
    explanation TEXT,
    difficulty INTEGER DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 퀴즈 선택지 테이블
CREATE TABLE IF NOT EXISTS quiz_choice (
    id BIGSERIAL PRIMARY KEY,
    text VARCHAR(255) NOT NULL,
    question_id BIGINT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (question_id) REFERENCES quiz_question(id) ON DELETE CASCADE
);

-- 퀴즈 결과 테이블
CREATE TABLE IF NOT EXISTS quiz_result (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL,
    question_id BIGINT NOT NULL,
    selected VARCHAR(255) NOT NULL,
    correct BOOLEAN NOT NULL,
    answered_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (question_id) REFERENCES quiz_question(id) ON DELETE CASCADE
);

-- 인덱스 생성
CREATE INDEX IF NOT EXISTS idx_quiz_question_type ON quiz_question(type);
CREATE INDEX IF NOT EXISTS idx_quiz_question_difficulty ON quiz_question(difficulty);
CREATE INDEX IF NOT EXISTS idx_quiz_choice_question_id ON quiz_choice(question_id);
CREATE INDEX IF NOT EXISTS idx_quiz_result_user_id ON quiz_result(user_id);
CREATE INDEX IF NOT EXISTS idx_quiz_result_question_id ON quiz_result(question_id);
CREATE INDEX IF NOT EXISTS idx_quiz_result_answered_at ON quiz_result(answered_at);

-- 초기 데이터 삽입
INSERT INTO quiz_question (type, question, answer, explanation, difficulty) VALUES
('CHORD_NAME', '다음 코드의 이름은 무엇인가요?', 'C major', 'C major 코드는 C, E, G 음으로 구성됩니다.', 1),
('CHORD_NAME', '다음 코드의 이름은 무엇인가요?', 'A minor', 'A minor 코드는 A, C, E 음으로 구성됩니다.', 1),
('PROGRESSION', 'I-IV-V 진행에서 C major 키의 코드들은 무엇인가요?', 'C-F-G', 'C major 키에서 I-IV-V 진행은 C major, F major, G major입니다.', 2),
('INTERVAL', 'C에서 E까지의 음정은 무엇인가요?', 'Major 3rd', 'C에서 E까지는 장3도(Major 3rd)입니다.', 2),
('SCALE', 'C major 스케일의 음들은 무엇인가요?', 'C-D-E-F-G-A-B', 'C major 스케일은 C, D, E, F, G, A, B, C로 구성됩니다.', 1)
ON CONFLICT DO NOTHING;

-- 선택지 데이터 삽입
INSERT INTO quiz_choice (text, question_id) VALUES
('C major', 1),
('D major', 1),
('E major', 1),
('F major', 1),
('A minor', 2),
('B minor', 2),
('C minor', 2),
('D minor', 2),
('C-F-G', 3),
('C-G-F', 3),
('F-C-G', 3),
('G-C-F', 3),
('Major 3rd', 4),
('Minor 3rd', 4),
('Perfect 4th', 4),
('Perfect 5th', 4),
('C-D-E-F-G-A-B', 5),
('C-D-E-F-G-A-B-C', 5),
('D-E-F-G-A-B-C', 5),
('E-F-G-A-B-C-D', 5)
ON CONFLICT DO NOTHING; 