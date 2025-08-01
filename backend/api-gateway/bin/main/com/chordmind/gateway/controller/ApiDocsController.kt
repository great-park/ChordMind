package com.chordmind.gateway.controller

import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController
import java.time.LocalDateTime

@RestController
@RequestMapping("/api-docs")
class ApiDocsController {

    @GetMapping
    fun getApiOverview(): ResponseEntity<Map<String, Any>> {
        return ResponseEntity.ok(
            mapOf(
                "title" to "ChordMind API Gateway",
                "version" to "1.0.0",
                "description" to "ChordMind 음악 학습 플랫폼 API Gateway",
                "timestamp" to LocalDateTime.now(),
                "services" to mapOf(
                    "user-service" to mapOf(
                        "baseUrl" to "/api/users",
                        "description" to "사용자 관리 서비스",
                        "endpoints" to listOf(
                            "POST /signup - 회원가입",
                            "POST /signin - 로그인",
                            "GET /{userId} - 사용자 정보 조회",
                            "PUT /{userId} - 사용자 정보 수정",
                            "GET /{userId}/profile - 프로필 조회",
                            "PUT /{userId}/profile - 프로필 수정",
                            "GET /{userId}/settings - 설정 조회",
                            "PUT /{userId}/settings - 설정 수정",
                            "GET /{userId}/stats - 통계 조회",
                            "GET /search - 사용자 검색"
                        )
                    ),
                    "practice-service" to mapOf(
                        "baseUrl" to "/api/practice",
                        "description" to "연습 세션 관리 서비스",
                        "endpoints" to listOf(
                            "POST /sessions - 세션 생성",
                            "GET /sessions/{sessionId} - 세션 조회",
                            "PUT /sessions/{sessionId} - 세션 수정",
                            "DELETE /sessions/{sessionId} - 세션 삭제",
                            "POST /sessions/{sessionId}/progress - 진행상황 추가",
                            "GET /sessions/{sessionId}/progress - 진행상황 조회",
                            "GET /analytics/user/{userId}/progress-trend - 진행 추세",
                            "GET /analytics/user/{userId}/skill-analysis - 스킬 분석",
                            "GET /analytics/user/{userId}/practice-patterns - 연습 패턴",
                            "GET /analytics/user/{userId}/goals - 목표 조회",
                            "POST /analytics/user/{userId}/goals - 목표 생성",
                            "GET /analytics/user/{userId}/achievements - 성취 조회",
                            "GET /analytics/user/{userId}/comparison - 사용자 비교",
                            "GET /analytics/global/leaderboard - 글로벌 리더보드",
                            "GET /analytics/global/trends - 글로벌 트렌드"
                        )
                    ),
                    "harmony-service" to mapOf(
                        "baseUrl" to "/api/harmony",
                        "description" to "화성학 및 퀴즈 서비스",
                        "endpoints" to listOf(
                            "GET /quizzes - 퀴즈 목록",
                            "GET /quizzes/{quizId} - 퀴즈 조회",
                            "POST /quizzes/{quizId}/submit - 퀴즈 제출",
                            "GET /quizzes/{quizId}/results - 퀴즈 결과",
                            "GET /analytics/user/{userId} - 사용자 분석",
                            "GET /ai/explanations - AI 설명"
                        )
                    ),
                    "ai-analysis-service" to mapOf(
                        "baseUrl" to "/api/analysis",
                        "description" to "AI 분석 서비스",
                        "endpoints" to listOf(
                            "POST /feedback - 개인화 피드백",
                            "POST /learning-path - 적응형 학습 경로",
                            "POST /hints - 스마트 힌트",
                            "POST /behavior-analysis - 행동 분석"
                        )
                    ),
                    "feedback-service" to mapOf(
                        "baseUrl" to "/api/feedback",
                        "description" to "피드백 관리 서비스",
                        "endpoints" to listOf(
                            "POST /feedback - 피드백 생성",
                            "GET /feedback/{feedbackId} - 피드백 조회",
                            "GET /feedback/user/{userId} - 사용자 피드백 목록"
                        )
                    ),
                    "game-service" to mapOf(
                        "baseUrl" to "/api/games",
                        "description" to "게임화 서비스",
                        "endpoints" to listOf(
                            "GET /challenges - 챌린지 목록",
                            "POST /challenges/{challengeId}/join - 챌린지 참여",
                            "GET /leaderboard - 리더보드",
                            "GET /achievements - 업적 목록"
                        )
                    )
                ),
                "authentication" to mapOf(
                    "type" to "JWT Bearer Token",
                    "header" to "Authorization: Bearer <token>",
                    "publicEndpoints" to listOf(
                        "/api/users/signin",
                        "/api/users/signup",
                        "/health",
                        "/actuator",
                        "/fallback"
                    )
                ),
                "rateLimiting" to mapOf(
                    "requestsPerSecond" to 10,
                    "burstCapacity" to 20,
                    "description" to "사용자별 요청 제한"
                ),
                "circuitBreaker" to mapOf(
                    "failureRateThreshold" to 50,
                    "waitDurationInOpenState" to 10000,
                    "permittedNumberOfCallsInHalfOpenState" to 3
                )
            )
        )
    }

    @GetMapping("/swagger")
    fun getSwaggerUrls(): ResponseEntity<Map<String, Any>> {
        return ResponseEntity.ok(
            mapOf(
                "swaggerUrls" to mapOf(
                    "user-service" to "http://user-service:8082/swagger-ui.html",
                    "practice-service" to "http://practice-service:8081/swagger-ui.html",
                    "harmony-service" to "http://harmony-service:8083/swagger-ui.html",
                    "ai-analysis-service" to "http://ai-analysis-service:8084/docs",
                    "feedback-service" to "http://feedback-service:8085/swagger-ui.html",
                    "game-service" to "http://game-service:8086/swagger-ui.html"
                ),
                "note" to "각 서비스의 Swagger UI는 내부 네트워크에서만 접근 가능합니다."
            )
        )
    }
} 