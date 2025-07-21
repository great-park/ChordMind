package com.chordmind.harmony.repository

import com.chordmind.harmony.domain.QuizQuestion
import com.chordmind.harmony.domain.QuizType
import org.springframework.data.jpa.repository.JpaRepository

interface QuizQuestionRepository : JpaRepository<QuizQuestion, Long> {
    fun findByType(type: QuizType): List<QuizQuestion>
} 