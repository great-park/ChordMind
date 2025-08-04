package com.chordmind.harmony.client

import com.fasterxml.jackson.databind.ObjectMapper
import org.springframework.beans.factory.annotation.Value
import org.springframework.http.HttpEntity
import org.springframework.http.HttpHeaders
import org.springframework.http.HttpMethod
import org.springframework.http.MediaType
import org.springframework.stereotype.Component
import org.springframework.web.client.RestTemplate
import org.springframework.web.client.HttpClientErrorException
import org.springframework.web.client.ResourceAccessException
import org.slf4j.LoggerFactory

/**
 * Python AI 서비스와 통신하는 클라이언트
 * MSA 아키텍처에 따라 AI 기능은 별도 서비스에서 처리
 */
@Component
open class AIClient(
    private val restTemplate: RestTemplate,
    private val objectMapper: ObjectMapper,
    @Value("\${ai.service.url:http://localhost:8088}") private val aiServiceUrl: String
) {
    private val logger = LoggerFactory.getLogger(AIClient::class.java)

    /**
     * AI 기반 개인화된 피드백 생성
     */
    open fun generatePersonalizedFeedback(
        userId: Long,
        questionType: String,
        userAnswer: String,
        correctAnswer: String,
        isCorrect: Boolean,
        previousAnswers: List<String> = emptyList()
    ): String {
        return try {
            val request = mapOf(
                "user_id" to userId,
                "question_type" to questionType,
                "user_answer" to userAnswer,
                "correct_answer" to correctAnswer,
                "is_correct" to isCorrect,
                "previous_answers" to previousAnswers
            )
            
            val response = makeRequest<Map<String, Any>>("/api/personalized-feedback", request)
            response["feedback"] as? String ?: "AI 피드백을 생성할 수 없습니다."
            
        } catch (e: Exception) {
            logger.warn("AI 피드백 생성 실패: ${e.message}")
            generateFallbackFeedback(questionType, userAnswer, correctAnswer, isCorrect)
        }
    }

    /**
     * AI 기반 적응형 문제 생성
     */
    fun generateAdaptiveQuestion(
        userId: Long,
        questionType: String,
        userHistory: List<Map<String, Any>>
    ): Map<String, Any>? {
        return try {
            val request = mapOf(
                "user_id" to userId,
                "question_type" to questionType,
                "user_history" to userHistory
            )
            
            makeRequest<Map<String, Any>>("/api/adaptive-question", request)
            
        } catch (e: Exception) {
            logger.warn("적응형 문제 생성 실패: ${e.message}")
            null
        }
    }

    /**
     * AI 기반 스마트 힌트 생성
     */
    fun generateSmartHint(
        userId: Long,
        questionType: String,
        question: String,
        userProgress: Map<String, Any>
    ): String {
        return try {
            val request = mapOf(
                "user_id" to userId,
                "question_type" to questionType,
                "question" to question,
                "user_progress" to userProgress
            )
            
            val response = makeRequest<Map<String, Any>>("/api/smart-hint", request)
            response["hint"] as? String ?: "힌트를 생성할 수 없습니다."
            
        } catch (e: Exception) {
            logger.warn("스마트 힌트 생성 실패: ${e.message}")
            generateFallbackHint(questionType, question)
        }
    }

    /**
     * AI 기반 학습 경로 생성
     */
    fun generateLearningPath(
        userId: Long,
        userStats: Map<String, Any>,
        weakestAreas: List<String>
    ): Map<String, Any> {
        return try {
            val request = mapOf(
                "user_id" to userId,
                "user_stats" to userStats,
                "weakest_areas" to weakestAreas
            )
            
            makeRequest<Map<String, Any>>("/api/learning-path", request)
            
        } catch (e: Exception) {
            logger.warn("학습 경로 생성 실패: ${e.message}")
            generateFallbackLearningPath(weakestAreas)
        }
    }

    /**
     * AI 기반 사용자 행동 분석
     */
    fun analyzeBehavior(
        userId: Long,
        userHistory: List<Map<String, Any>>
    ): Map<String, Any> {
        return try {
            val request = mapOf(
                "user_id" to userId,
                "user_history" to userHistory
            )
            
            makeRequest<Map<String, Any>>("/api/behavior-analysis", request)
            
        } catch (e: Exception) {
            logger.warn("행동 분석 실패: ${e.message}")
            generateFallbackBehaviorAnalysis()
        }
    }

    /**
     * HTTP 요청 공통 처리
     */
    private inline fun <reified T> makeRequest(endpoint: String, request: Any): T {
        val headers = HttpHeaders().apply {
            contentType = MediaType.APPLICATION_JSON
            set("X-Service-Name", "harmony-service")
        }
        
        val entity = HttpEntity(request, headers)
        val url = "$aiServiceUrl$endpoint"
        
        logger.debug("AI 서비스 호출: $url")
        
        val response = restTemplate.exchange(
            url,
            HttpMethod.POST,
            entity,
            String::class.java
        )
        
        return objectMapper.readValue(response.body, T::class.java)
    }

    /**
     * AI 서비스 실패 시 기본 피드백 생성
     */
    private fun generateFallbackFeedback(
        questionType: String,
        userAnswer: String,
        correctAnswer: String,
        isCorrect: Boolean
    ): String {
        return if (isCorrect) {
            when (questionType.uppercase()) {
                "CHORD_NAME" -> "🎉 정답입니다! $correctAnswer 코드를 정확히 인식하셨네요."
                "PROGRESSION" -> "🎉 맞습니다! $correctAnswer 진행을 잘 파악하셨습니다."
                "INTERVAL" -> "🎉 훌륭합니다! $correctAnswer 음정을 정확히 알고 계시네요."
                "SCALE" -> "🎉 정답입니다! $correctAnswer 스케일을 잘 알고 계시네요."
                else -> "🎉 정답입니다!"
            }
        } else {
            when (questionType.uppercase()) {
                "CHORD_NAME" -> "💡 정답은 $correctAnswer 입니다. $userAnswer 과(와) 헷갈리기 쉬운 코드군요."
                "PROGRESSION" -> "💡 정답은 $correctAnswer 입니다. 화성 진행을 더 연습해보세요."
                "INTERVAL" -> "💡 정답은 $correctAnswer 입니다. 음정 구별을 더 연습해보세요."
                "SCALE" -> "💡 정답은 $correctAnswer 입니다. 스케일 패턴을 복습해보세요."
                else -> "💡 정답은 $correctAnswer 입니다."
            }
        }
    }

    /**
     * AI 서비스 실패 시 기본 힌트 생성
     */
    private fun generateFallbackHint(questionType: String, question: String): String {
        return when (questionType.uppercase()) {
            "CHORD_NAME" -> "🔍 코드의 구성음을 차근차근 들어보세요. 루트음부터 시작해서 3도, 5도 음을 찾아보세요."
            "PROGRESSION" -> "🔍 각 코드 간의 관계를 생각해보세요. 로마 숫자로 표현된 기능을 파악해보세요."
            "INTERVAL" -> "🔍 두 음 사이의 거리를 세어보세요. 반음 단위로 계산해보면 도움이 됩니다."
            "SCALE" -> "🔍 스케일의 패턴을 기억해보세요. 전음과 반음의 배열을 확인해보세요."
            else -> "🔍 천천히 다시 한 번 들어보시고 분석해보세요."
        }
    }

    /**
     * AI 서비스 실패 시 기본 학습 경로 생성
     */
    private fun generateFallbackLearningPath(weakestAreas: List<String>): Map<String, Any> {
        val recommendations = if (weakestAreas.isNotEmpty()) {
            weakestAreas.take(3).map { area ->
                when (area.uppercase()) {
                    "CHORD_NAME" -> "코드 이름 인식 연습을 더 해보세요"
                    "PROGRESSION" -> "화성 진행 패턴을 복습해보세요"
                    "INTERVAL" -> "음정 구별 연습을 반복해보세요"
                    "SCALE" -> "스케일 구조를 다시 학습해보세요"
                    else -> "$area 영역을 집중적으로 연습해보세요"
                }
            }
        } else {
            listOf("기본기를 탄탄히 다져보세요", "꾸준한 연습이 중요합니다")
        }

        return mapOf(
            "recommendations" to recommendations,
            "estimated_time" to "30-45분",
            "difficulty_level" to "중급",
            "next_steps" to listOf("기초 이론 복습", "실전 문제 풀이", "오답 분석")
        )
    }

    /**
     * AI 서비스 실패 시 기본 행동 분석 생성
     */
    private fun generateFallbackBehaviorAnalysis(): Map<String, Any> {
        return mapOf(
            "learning_style" to "균형잡힌 학습자",
            "strengths" to listOf("꾸준한 학습", "문제 해결 의지"),
            "weaknesses" to listOf("분석이 필요한 영역이 있습니다"),
            "recommendations" to listOf("기본기 강화", "반복 학습", "실전 응용"),
            "confidence_level" to 0.7,
            "learning_efficiency" to 0.75
        )
    }
}