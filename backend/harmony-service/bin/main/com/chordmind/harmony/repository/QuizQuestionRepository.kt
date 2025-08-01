package com.chordmind.harmony.repository

import com.chordmind.harmony.domain.QuizQuestion
import com.chordmind.harmony.domain.QuizType
import org.springframework.data.domain.Page
import org.springframework.data.domain.Pageable
import org.springframework.data.jpa.repository.JpaRepository

interface QuizQuestionRepository : JpaRepository<QuizQuestion, Long> {
    fun findByType(type: QuizType): List<QuizQuestion>
    fun findByType(type: QuizType, pageable: Pageable): Page<QuizQuestion>
    fun countByType(type: QuizType): Long
    fun findByDifficulty(difficulty: Int): List<QuizQuestion>
} 