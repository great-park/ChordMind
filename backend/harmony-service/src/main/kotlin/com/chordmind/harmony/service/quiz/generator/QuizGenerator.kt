package com.chordmind.harmony.service.quiz.generator

import com.chordmind.harmony.domain.QuizQuestion
import com.chordmind.harmony.domain.QuizType

abstract class QuizGenerator {
    protected abstract val quizType: QuizType
    
    abstract fun generate(count: Int, maxDifficulty: Int): List<QuizQuestion>
    
    protected fun validateParameters(count: Int, maxDifficulty: Int) {
        require(count > 0) { "생성할 문제 수는 1개 이상이어야 합니다" }
        require(maxDifficulty > 0) { "최대 난이도는 1 이상이어야 합니다" }
    }
}