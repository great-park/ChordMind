# ChordMind

## 프로젝트 개요
- AI 기반 연주 분석, 피드백, 연습 기록, 게임/퀴즈 등 음악 학습 지원 서비스

## 주요 기술스택
- **Frontend**: Next.js (React)
- **Backend**: Spring Boot (Kotlin, MSA), Python (AI 분석)
- **DB**: PostgreSQL
- **Infra**: Docker, Docker Compose

## 실행 방법
1. 각 백엔드 서비스 디렉토리에서 JAR 빌드
   - 예시: `cd backend/user-service && ./gradlew build -x test`
2. 루트 디렉토리에서 도커 컴포즈 실행
   - `docker-compose up -d`

## 폴더 구조
```
ChordMind/
├── frontend/         # Next.js 프론트엔드
├── backend/          # 백엔드 마이크로서비스
│   ├── api-gateway/
│   ├── user-service/
│   ├── practice-service/
│   └── harmony-service/
├── docker-compose.yml
├── .gitignore
└── README.md
```

---

문의 및 기여는 언제든 환영합니다!
