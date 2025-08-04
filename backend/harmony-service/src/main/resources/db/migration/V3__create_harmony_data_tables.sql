-- 화성학 퀴즈 데이터를 위한 테이블들
-- 하드코딩을 제거하고 DB 기반 데이터 관리

-- 코드 타입 테이블
CREATE TABLE chord_types (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(20) NOT NULL UNIQUE,
    symbol VARCHAR(10) NOT NULL,
    description TEXT,
    difficulty_level INT DEFAULT 1,
    intervals VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 음계 루트 테이블  
CREATE TABLE scale_roots (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(5) NOT NULL UNIQUE,
    degree INT NOT NULL,
    frequency DECIMAL(8,2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 화성 진행 패턴 테이블
CREATE TABLE progression_patterns (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    pattern VARCHAR(30) NOT NULL,
    description TEXT,
    genre VARCHAR(50),
    difficulty_level INT DEFAULT 1,
    popularity_score INT DEFAULT 50,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 음정 타입 테이블
CREATE TABLE interval_types (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(30) NOT NULL,
    semitones INT NOT NULL,
    quality VARCHAR(20),
    description TEXT,
    difficulty_level INT DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 스케일 타입 테이블
CREATE TABLE scale_types (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    pattern VARCHAR(30) NOT NULL,
    description TEXT,
    mode_number INT,
    difficulty_level INT DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 인덱스 생성
CREATE INDEX idx_chord_types_difficulty ON chord_types(difficulty_level);
CREATE INDEX idx_progression_patterns_difficulty ON progression_patterns(difficulty_level);
CREATE INDEX idx_progression_patterns_genre ON progression_patterns(genre);
CREATE INDEX idx_interval_types_difficulty ON interval_types(difficulty_level);
CREATE INDEX idx_scale_types_difficulty ON scale_types(difficulty_level);