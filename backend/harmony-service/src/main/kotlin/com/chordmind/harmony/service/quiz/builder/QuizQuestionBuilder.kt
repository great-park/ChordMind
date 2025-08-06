package com.chordmind.harmony.service.quiz.builder

import com.chordmind.harmony.domain.QuizChoice
import com.chordmind.harmony.domain.QuizQuestion
import com.chordmind.harmony.domain.QuizType

class QuizQuestionBuilder {
    private var type: QuizType? = null
    private var question: String = ""
    private var answer: String = ""
    private var explanation: String = ""
    private var difficulty: Int = 1
    private val choices = mutableListOf<String>()

    fun type(type: QuizType) = apply { this.type = type }
    fun question(question: String) = apply { this.question = question }
    fun answer(answer: String) = apply { this.answer = answer }
    fun explanation(explanation: String) = apply { this.explanation = explanation }
    fun difficulty(difficulty: Int) = apply { this.difficulty = difficulty }
    fun choices(choices: List<String>) = apply { 
        this.choices.clear()
        this.choices.addAll(choices) 
    }

    fun build(): QuizQuestion {
        requireNotNull(type) { "QuizType은 필수입니다" }
        require(question.isNotBlank()) { "질문은 필수입니다" }
        require(answer.isNotBlank()) { "정답은 필수입니다" }
        require(choices.isNotEmpty()) { "선택지는 필수입니다" }

        val quizQuestion = QuizQuestion(
            type = type!!,
            question = question,
            answer = answer,
            explanation = explanation,
            difficulty = difficulty
        )

        choices.forEach { choiceText ->
            quizQuestion.addChoice(QuizChoice(text = choiceText))
        }

        return quizQuestion
    }
}