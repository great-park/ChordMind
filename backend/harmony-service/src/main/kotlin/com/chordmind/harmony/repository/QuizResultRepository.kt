package com.chordmind.harmony.repository

import com.chordmind.harmony.domain.QuizResult
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Query
import java.time.LocalDateTime

interface QuizResultRepository : JpaRepository<QuizResult, Long> {
    fun findByUserId(userId: Long): List<QuizResult>

    @Query("""
        SELECT r.userId, COUNT(r.id) as score
        FROM QuizResult r
        WHERE r.answeredAt >= :from AND r.answeredAt < :to AND r.correct = true
        GROUP BY r.userId
        ORDER BY score DESC
    """)
    fun findRankings(from: LocalDateTime, to: LocalDateTime): List<Array<Any>>
} 