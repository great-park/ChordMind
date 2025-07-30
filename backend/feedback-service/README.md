# Feedback Service

ChordMind 음악 학습 플랫폼의 피드백 관리 서비스입니다.

## 주요 기능

### 📝 피드백 관리
- **피드백 생성**: 다양한 타입의 피드백 생성
- **피드백 조회**: 사용자별, 세션별 피드백 조회
- **피드백 수정**: 피드백 내용 및 상태 수정
- **피드백 해결**: 관리자용 피드백 해결 기능

### 🔍 검색 및 필터링
- **다중 조건 검색**: 타입, 카테고리, 우선순위, 상태별 검색
- **키워드 검색**: 제목 및 내용 기반 검색
- **날짜 범위 검색**: 기간별 피드백 조회
- **평점 기반 검색**: 평점별 피드백 필터링

### 📊 통계 및 분석
- **전체 통계**: 전체 피드백 통계 정보
- **사용자별 분석**: 개인별 피드백 분석
- **만족도 추적**: 평점 기반 만족도 분석
- **활동 추적**: 최근 피드백 활동 기록

## API 엔드포인트

### 피드백 관리
- `POST /api/feedback` - 피드백 생성
- `GET /api/feedback/{feedbackId}` - 피드백 조회
- `PUT /api/feedback/{feedbackId}` - 피드백 수정
- `DELETE /api/feedback/{feedbackId}` - 피드백 삭제
- `POST /api/feedback/{feedbackId}/resolve` - 피드백 해결

### 피드백 조회
- `GET /api/feedback/user/{userId}` - 사용자별 피드백 목록
- `GET /api/feedback/search` - 피드백 검색
- `GET /api/feedback/recent` - 최근 피드백 조회

### 통계 및 분석
- `GET /api/feedback/stats` - 전체 피드백 통계
- `GET /api/feedback/user/{userId}/analysis` - 사용자별 피드백 분석

## 설정

### 환경 변수

`.env` 파일을 생성하고 다음 환경 변수를 설정하세요:

```bash
# 서버 설정
SERVER_PORT=8085
SPRING_APPLICATION_NAME=feedback-service

# 데이터베이스 설정
DB_HOST=localhost
DB_PORT=5432
DB_NAME=chordmind_feedback
DB_USER=postgres
DB_PASSWORD=password

# Eureka 설정
EUREKA_SERVICE_URL=http://localhost:8761/eureka/

# JWT 설정
JWT_SECRET=your-secure-jwt-secret
JWT_EXPIRATION=86400000
```

## 실행 방법

### 1. 의존성 설치
```bash
./gradlew build
```

### 2. 환경 설정
```bash
cp env.example .env
# .env 파일을 편집하여 필요한 설정을 변경
```

### 3. 서비스 실행
```bash
./gradlew bootRun
```

## 피드백 타입

- **BUG_REPORT**: 버그 신고
- **FEATURE_REQUEST**: 기능 요청
- **IMPROVEMENT**: 개선 제안
- **COMPLAINT**: 불만 사항
- **PRAISE**: 칭찬
- **QUESTION**: 질문
- **SUGGESTION**: 제안

## 우선순위

- **LOW**: 낮음
- **MEDIUM**: 보통
- **HIGH**: 높음
- **URGENT**: 긴급

## 상태 관리

- **PENDING**: 대기 중
- **IN_PROGRESS**: 처리 중
- **RESOLVED**: 해결됨
- **REJECTED**: 거부됨
- **CLOSED**: 종료됨 