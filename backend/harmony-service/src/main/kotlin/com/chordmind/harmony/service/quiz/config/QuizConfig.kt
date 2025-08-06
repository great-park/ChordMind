package com.chordmind.harmony.service.quiz.config

import com.chordmind.harmony.domain.QuizType

object QuizConfig {
    const val DEFAULT_CHOICE_COUNT = 4

    private val questionTemplates = mapOf(
        QuizType.CHORD_NAME to "다음 코드의 이름은 무엇인가요? 🎵",
        QuizType.PROGRESSION to "다음 화성 진행의 이름은 무엇인가요? 🎼",
        QuizType.INTERVAL to "다음 음정의 이름은 무엇인가요? 🎼",
        QuizType.SCALE to "다음 스케일의 이름은 무엇인가요? 🎵"
    )

    fun getQuestionTemplate(type: QuizType): String {
        return questionTemplates[type] ?: "문제를 풀어보세요"
    }

    fun formatExplanation(answer: String, description: String?): String {
        return if (description.isNullOrBlank()) {
            "${answer}입니다."
        } else {
            "${answer}는 ${description}입니다."
        }
    }
}