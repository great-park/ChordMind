package com.chordmind.harmony.config

import com.chordmind.harmony.client.AIClient
import org.springframework.boot.test.context.TestConfiguration
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Primary

/**
 * 테스트용 설정
 * AI 서비스 의존성을 스텁으로 대체하여 테스트 격리
 */
@TestConfiguration
class TestConfig {

    @Bean
    @Primary
    fun stubAIClient(): AIClient {
        return object : AIClient(
            restTemplate = org.springframework.web.client.RestTemplate(),
            objectMapper = com.fasterxml.jackson.databind.ObjectMapper(),
            aiServiceUrl = "http://test-ai-service"
        ) {
            override fun generatePersonalizedFeedback(
                userId: Long,
                questionType: String,
                userAnswer: String,
                correctAnswer: String,
                isCorrect: Boolean,
                previousAnswers: List<String>
            ): String {
                return if (isCorrect) {
                    "🎉 정답입니다! 잘하셨네요."
                } else {
                    "💡 아쉽네요. 정답은 $correctAnswer 입니다."
                }
            }
        }
    }
}