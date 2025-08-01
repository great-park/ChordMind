package com.chordmind.harmony.repository

import com.chordmind.harmony.domain.QuizResult
import com.chordmind.harmony.domain.QuizType
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Query
import org.springframework.data.repository.query.Param
import java.time.LocalDateTime

interface QuizResultRepository : JpaRepository<QuizResult, Long> {
    fun findByUserId(userId: Long): List<QuizResult>
    
    fun countByUserId(userId: Long): Long
    
    fun countByUserIdAndCorrectTrue(userId: Long): Long
    
    fun countByUserIdAndQuestionType(userId: Long, type: QuizType): Long
    
    fun countByUserIdAndQuestionTypeAndCorrectTrue(userId: Long, type: QuizType): Long
    
    fun findByUserIdAndAnsweredAtAfterOrderByAnsweredAt(userId: Long, fromDate: LocalDateTime): List<QuizResult>
    
    fun countByCorrectTrue(): Long

    @Query("""
        SELECT r.userId, COUNT(r.id) as score
        FROM QuizResult r
        WHERE r.answeredAt >= :from AND r.answeredAt < :to AND r.correct = true
        GROUP BY r.userId
        ORDER BY score DESC
    """)
    fun findRankings(from: LocalDateTime, to: LocalDateTime): List<Array<Any>>
} 