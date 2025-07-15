# User Service

ChordMind의 사용자 관리 서비스입니다.

## 기능

- 회원가입/로그인
- 사용자 프로필 관리
- JWT 토큰 기반 인증
- 비밀번호 변경

## API 엔드포인트

### 인증
- `POST /api/users/signup` - 회원가입
- `POST /api/users/signin` - 로그인

### 사용자 관리
- `GET /api/users/{userId}` - 사용자 정보 조회
- `PUT /api/users/{userId}` - 사용자 정보 수정
- `POST /api/users/{userId}/change-password` - 비밀번호 변경

## 실행 방법

### 로컬 실행
```bash
./gradlew bootRun
```

### Docker 실행
```bash
docker build -t chordmind-user-service .
docker run -p 8081:8081 chordmind-user-service
```

## 데이터베이스

PostgreSQL을 사용합니다. 다음 환경변수를 설정하세요:

- `SPRING_DATASOURCE_URL`: 데이터베이스 URL
- `SPRING_DATASOURCE_USERNAME`: 데이터베이스 사용자명
- `SPRING_DATASOURCE_PASSWORD`: 데이터베이스 비밀번호
- `JWT_SECRET`: JWT 시크릿 키
- `JWT_EXPIRATION`: JWT 만료 시간 (밀리초) 