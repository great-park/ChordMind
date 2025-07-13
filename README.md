# ChordMind 서비스 기획 및 개발 방향

## 서비스 개요
- **실시간 AI 연주 분석**: 사용자가 연주(오디오/미디) 업로드 또는 마이크로 실시간 입력
- **AI 코칭/추천**: 맞춤형 피드백(박자, 코드, 리듬, 스케일 등)
- **연습 기록 및 분석**: 연습 시간, 곡/스케일/코드별 통계, 성장 그래프, 취약점 분석
- **게임/퀴즈/챌린지**: 리듬 게임, 코드/스케일 맞추기, 즉흥 연주 챌린지
- **화성학 관련 코칭**: 연주 분석, 이론 설명, 코드/스케일 추천

## 주요 사용 시나리오
- 사용자가 연주(오디오/미디) 업로드 또는 실시간 마이크 입력
- AI가 연주를 분석하여 실시간 피드백 및 코칭 제공
- 연습 기록이 자동 저장되고, 성장/취약점 분석 제공
- 사용자는 게임/퀴즈/챌린지로 실력 점검 및 동기 부여
- 화성학 기반의 고급 코칭 및 추천 제공

---

## 기술/아키텍처 방향

- **프론트엔드**: 웹앱(React/Next.js)
- **백엔드**: MSA(Microservice Architecture) 기반, Spring Cloud
  - 각 마이크로서비스: Spring Boot + Kotlin
  - AI 분석 서비스: Python (FastAPI/Flask 등)
- **DB**: PostgreSQL, MongoDB 등
- **실시간 처리**: WebSocket, WebRTC 등

---

## 프로젝트 폴더 구조

```
ChordMind/
├── frontend/                    # React/Next.js 웹앱
│   ├── src/
│   │   ├── components/         # 재사용 가능한 컴포넌트
│   │   ├── pages/             # 페이지 컴포넌트
│   │   ├── hooks/             # 커스텀 훅
│   │   ├── services/          # API 호출 서비스
│   │   ├── types/             # TypeScript 타입 정의
│   │   └── utils/             # 유틸리티 함수
│   ├── public/                # 정적 파일
│   └── package.json
├── backend/                    # 백엔드 마이크로서비스들
│   ├── api-gateway/           # Spring Cloud Gateway
│   │   ├── src/main/kotlin/
│   │   └── build.gradle.kts
│   ├── user-service/          # 사용자 관리 서비스
│   │   ├── src/main/kotlin/
│   │   └── build.gradle.kts
│   ├── practice-service/      # 연습 기록 관리 서비스
│   │   ├── src/main/kotlin/
│   │   └── build.gradle.kts
│   ├── feedback-service/      # 피드백/코칭 서비스
│   │   ├── src/main/kotlin/
│   │   └── build.gradle.kts
│   ├── game-service/          # 게임/퀴즈 서비스
│   │   ├── src/main/kotlin/
│   │   └── build.gradle.kts
│   ├── harmony-service/       # 화성학 분석 서비스
│   │   ├── src/main/kotlin/
│   │   └── build.gradle.kts
│   └── ai-analysis-service/   # AI 분석 서비스 (Python)
│       ├── src/
│       │   ├── app/           # FastAPI 애플리케이션
│       │   ├── models/        # AI 모델
│       │   ├── services/      # 분석 서비스
│       │   └── utils/         # 유틸리티
│       ├── requirements.txt
│       └── Dockerfile
├── shared/                    # 공통 라이브러리/설정
│   ├── proto/                 # gRPC 프로토콜 정의
│   ├── config/                # 공통 설정
│   └── docker/                # Docker 설정
├── docs/                      # 문서
│   ├── api/                   # API 문서
│   ├── architecture/          # 아키텍처 문서
│   └── deployment/            # 배포 가이드
├── scripts/                   # 빌드/배포 스크립트
├── docker-compose.yml         # 로컬 개발 환경
├── .gitignore
└── README.md
```

---

## 시스템 아키텍처(초안)

```
graph TD
  A["Web Frontend (React)"] -- REST/WebSocket --> B["API Gateway (Spring Cloud Gateway)"]
  B -- REST --> C["User/Practice Service (Spring Boot/Kotlin)"]
  B -- REST --> D["Feedback/Coaching Service (Spring Boot/Kotlin)"]
  B -- REST --> E["Game/Quiz Service (Spring Boot/Kotlin)"]
  B -- REST --> F["Harmony/Analysis Service (Spring Boot/Kotlin)"]
  B -- REST --> G["AI Analysis Service (Python)"]
  G -- gRPC/REST --> F
  C -- DB --> H["DB (PostgreSQL/MongoDB 등)"]
  D -- DB --> H
  E -- DB --> H
  F -- DB --> H
```

---

## 1차 개발(MVP) 범위

1. **연주 업로드/입력 → AI 분석 → 피드백 제공**
   - 프론트: 파일 업로드/마이크 입력 UI, 결과 표시
   - 백엔드: API Gateway, User/Practice Service, AI Analysis Service
   - DB: 사용자, 연습 기록, 분석 결과 저장
2. **기본 피드백/코칭**
   - AI 분석 결과 기반 간단한 텍스트 피드백
3. **연습 기록 저장/조회**
   - 연습 기록 리스트, 간단한 통계

---

## 다음 단계

1. 서비스별 역할/인터페이스 정의
2. 프로젝트 폴더 구조/레포 분리 설계
3. API 명세(프론트↔게이트웨이↔각 서비스) 초안
4. 1차 서비스(Practice, AI Analysis)부터 개발 시작

---

## 확인 및 논의할 사항

1. **레포 구조**
   - 모노레포(한 레포에 모든 서비스) vs 멀티레포(서비스별 분리) 중 선호하는 방식?
2. **DB**
   - 각 서비스별 DB 분리(권장) vs 통합 DB 중 어떤 방식?
3. **AI 분석 서비스**
   - 처음엔 단순한 rule-based 분석(예: librosa, pretty_midi 등 Python 라이브러리)으로 시작해도 괜찮은지?

---

추가 의견이나 요청사항이 있으면 언제든 말씀해 주세요!
