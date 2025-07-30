# API Gateway

ChordMind 음악 학습 플랫폼의 API Gateway 서비스입니다.

## 주요 기능

### 🔐 인증 및 보안
- **JWT 토큰 검증**: 모든 요청에 대한 JWT 토큰 검증
- **공개 경로**: 로그인, 회원가입 등 인증이 필요하지 않은 경로 설정
- **CORS 설정**: 프론트엔드와의 안전한 통신

### 🚦 라우팅 및 로드 밸런싱
- **서비스 라우팅**: 각 마이크로서비스로의 요청 라우팅
- **로드 밸런싱**: Spring Cloud LoadBalancer를 통한 로드 밸런싱
- **서비스 디스커버리**: Eureka를 통한 서비스 자동 발견

### 🛡️ 장애 처리
- **Circuit Breaker**: Resilience4j를 사용한 서킷 브레이커
- **Fallback**: 서비스 장애 시 대체 응답 제공
- **재시도 로직**: 일시적 장애에 대한 자동 재시도

### ⚡ 성능 최적화
- **Rate Limiting**: Redis를 사용한 요청 제한
- **캐싱**: 응답 캐싱으로 성능 향상
- **압축**: 요청/응답 압축

### 📊 모니터링 및 로깅
- **요청/응답 로깅**: 모든 요청과 응답에 대한 상세 로깅
- **메트릭 수집**: Prometheus 메트릭 수집
- **헬스 체크**: 서비스 상태 모니터링
- **성능 모니터링**: 응답 시간, 처리량 등 모니터링

## API 엔드포인트

### 인증이 필요한 엔드포인트
모든 API 요청에는 `Authorization: Bearer <JWT_TOKEN>` 헤더가 필요합니다.

### 공개 엔드포인트
- `POST /api/users/signup` - 회원가입
- `POST /api/users/signin` - 로그인
- `GET /health` - 게이트웨이 상태 확인
- `GET /actuator/**` - 모니터링 엔드포인트

### 서비스별 라우팅
- `/api/users/**` → User Service
- `/api/practice/**` → Practice Service
- `/api/harmony/**` → Harmony Service
- `/api/analysis/**` → AI Analysis Service
- `/api/feedback/**` → Feedback Service
- `/api/games/**` → Game Service

## 설정

### 환경 변수

`.env` 파일을 생성하고 다음 환경 변수를 설정하세요:

```bash
# 서버 설정
SERVER_PORT=8080

# Redis 설정
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=
REDIS_DATABASE=0

# JWT 설정
JWT_SECRET=your-secure-jwt-secret
JWT_EXPIRATION=86400000

# 로깅 설정
LOGGING_LEVEL_GATEWAY=INFO
LOGGING_LEVEL_CHORDMIND=DEBUG
```

### Rate Limiting 설정

```yaml
rate-limit:
  default:
    requests-per-second: 10
    burst-capacity: 20
  user-service:
    requests-per-second: 20
    burst-capacity: 40
```

### Circuit Breaker 설정

```yaml
spring:
  cloud:
    circuitbreaker:
      resilience4j:
        instances:
          practice-service-circuit-breaker:
            sliding-window-size: 10
            failure-rate-threshold: 50
            wait-duration-in-open-state: 10000
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

### 4. Docker 실행
```bash
docker build -t chordmind-api-gateway .
docker run -p 8080:8080 chordmind-api-gateway
```

## 모니터링

### 헬스 체크
- `GET /health` - 게이트웨이 상태
- `GET /health/services` - 모든 서비스 상태
- `GET /health/metrics` - 성능 메트릭

### API 문서
- `GET /api-docs` - API 개요
- `GET /api-docs/swagger` - Swagger UI 링크

### Actuator 엔드포인트
- `GET /actuator/health` - 상세 헬스 정보
- `GET /actuator/metrics` - 메트릭 정보
- `GET /actuator/gateway` - 게이트웨이 정보
- `GET /actuator/circuitbreakers` - 서킷 브레이커 상태

## 로그

### 로그 레벨
- `INFO`: 일반적인 요청/응답 로그
- `DEBUG`: 상세한 디버깅 정보
- `ERROR`: 오류 및 예외 정보

### 로그 형식
```
2024-01-01 12:00:00 [http-nio-8080-exec-1] INFO  c.c.g.filter.LoggingFilter - === REQUEST LOG ===
Timestamp: 2024-01-01T12:00:00
Method: GET
Path: /api/users/1
User-Agent: Mozilla/5.0...
IP: 127.0.0.1
User-ID: 123
==================
```

## 보안

### JWT 토큰 검증
- 모든 보호된 엔드포인트에 대해 JWT 토큰 검증
- 토큰 만료 시 401 Unauthorized 응답
- 유효하지 않은 토큰 시 401 Unauthorized 응답

### CORS 설정
```yaml
globalcors:
  cors-configurations:
    '[/**]':
      allowed-origins:
        - "http://localhost:3000"
        - "https://chordmind.com"
      allowed-methods:
        - GET, POST, PUT, DELETE, OPTIONS
```

## 성능 최적화

### Rate Limiting
- 사용자별 요청 제한
- 서비스별 차별화된 제한 설정
- Redis를 사용한 분산 환경 지원

### Circuit Breaker
- 서비스 장애 시 자동 차단
- 장애 복구 시 자동 재개
- 설정 가능한 임계값

### 캐싱
- 정적 리소스 캐싱
- API 응답 캐싱
- Redis를 사용한 분산 캐싱

## 문제 해결

### 일반적인 문제

1. **서비스 연결 실패**
   - 서비스가 실행 중인지 확인
   - 네트워크 연결 상태 확인
   - 서비스 디스커버리 상태 확인

2. **인증 오류**
   - JWT 토큰이 유효한지 확인
   - 토큰 만료 시간 확인
   - 토큰 형식 확인

3. **Rate Limiting 오류**
   - 요청 빈도 확인
   - Redis 연결 상태 확인
   - Rate Limiting 설정 확인

### 로그 확인
```bash
# 실시간 로그 확인
tail -f logs/api-gateway.log

# 오류 로그 확인
grep ERROR logs/api-gateway.log
```

## 개발 가이드

### 새로운 필터 추가
```kotlin
@Component
class CustomFilter : GlobalFilter, Ordered {
    override fun filter(exchange: ServerWebExchange, chain: GatewayFilterChain): Mono<Void> {
        // 필터 로직 구현
        return chain.filter(exchange)
    }
    
    override fun getOrder(): Int = Ordered.HIGHEST_PRECEDENCE + 100
}
```

### 새로운 라우트 추가
```yaml
spring:
  cloud:
    gateway:
      routes:
        - id: new-service
          uri: lb://new-service
          predicates:
            - Path=/api/new/**
          filters:
            - StripPrefix=1
            - name: CircuitBreaker
              args:
                name: new-service-circuit-breaker
                fallbackUri: forward:/fallback/new
``` 