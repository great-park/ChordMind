package com.chordmind.harmony.repository

import com.chordmind.harmony.domain.QuizResult
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Query
import org.springframework.data.repository.query.Param
import org.springframework.stereotype.Repository
import java.time.LocalDateTime

@Repository
interface QuizResultRepository : JpaRepository<QuizResult, Long> {
    
    fun findByUserId(userId: Long): List<QuizResult>
    
    fun findByUserIdAndAnsweredAtBetween(
        userId: Long, 
        startDate: LocalDateTime, 
        endDate: LocalDateTime
    ): List<QuizResult>
    
    @Query("""
        SELECT r.userId, COUNT(r.id) as totalQuestions, SUM(CASE WHEN r.correct = true THEN 1 ELSE 0 END) as correctAnswers
        FROM QuizResult r 
        WHERE r.answeredAt BETWEEN :startDate AND :endDate
        GROUP BY r.userId
        ORDER BY correctAnswers DESC, totalQuestions DESC
    """)
    fun findRankingData(
        @Param("startDate") startDate: LocalDateTime,
        @Param("endDate") endDate: LocalDateTime
    ): List<Array<Any>>
    
    fun countByUserId(userId: Long): Long
    fun countByUserIdAndCorrectTrue(userId: Long): Long
    fun countByCorrectTrue(): Long
    fun countByUserIdAndQuestionType(userId: Long, questionType: String): Long
    fun countByUserIdAndQuestionTypeAndCorrectTrue(userId: Long, questionType: String): Long
    fun findByUserIdAndAnsweredAtAfterOrderByAnsweredAt(userId: Long, answeredAt: LocalDateTime): List<QuizResult>
}