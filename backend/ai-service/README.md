# AI Service

ChordMind AI 기반 음악 이론 학습 분석 및 추천 서비스

## 환경 설정

### 1. 환경 변수 설정

`.env` 파일을 생성하고 다음 환경 변수를 설정하세요:

```bash
# 서버 설정
PORT=8082
HOST=0.0.0.0

# 데이터베이스 설정
DB_HOST=your_db_host
DB_PORT=5432
DB_NAME=chordmind_ai
DB_USER=your_db_user
DB_PASSWORD=your_secure_password

# Harmony 서비스 URL
HARMONY_SERVICE_URL=http://your_harmony_service_host:8081

# AI 엔진 설정
AI_MODEL_TYPE=simulation
AI_CONFIDENCE_THRESHOLD=0.7

# 로깅 설정
LOG_LEVEL=INFO
LOG_FORMAT=%(asctime)s - %(name)s - %(levelname)s - %(message)s

# 서비스 설정
MAX_HISTORY_COUNT=100
DIFFICULTY_ADJUSTMENT_RATE=0.1
MAX_HINTS_PER_QUESTION=5
ANALYSIS_WINDOW_DAYS=30
```

### 2. 필수 환경 변수

다음 환경 변수는 반드시 설정해야 합니다:

- `DB_HOST`: 데이터베이스 호스트
- `DB_USER`: 데이터베이스 사용자명
- `DB_PASSWORD`: 데이터베이스 비밀번호
- `HARMONY_SERVICE_URL`: Harmony 서비스 URL

### 3. 설치 및 실행

```bash
# 의존성 설치
pip install -r requirements.txt

# 서버 실행
python main.py
```

## 주요 기능

- 개인화된 피드백 생성
- 적응형 학습 경로 생성
- 스마트 힌트 제공
- 사용자 행동 분석
- 학습 성과 예측

## API 문서

서버 실행 후 `http://localhost:8082/docs`에서 API 문서를 확인할 수 있습니다. 