package com.chordmind.practice.repository

import com.chordmind.practice.domain.PracticeSession
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Query
import org.springframework.data.repository.query.Param
import org.springframework.stereotype.Repository
import java.time.LocalDateTime

@Repository
interface PracticeSessionRepository : JpaRepository<PracticeSession, Long> {
    
    fun findByUserIdOrderByCreatedAtDesc(userId: Long): List<PracticeSession>
    
    fun findByUserIdAndSongIdOrderByCreatedAtDesc(userId: Long, songId: String): List<PracticeSession>
    
    fun findByUserIdAndCompletedTrueOrderByCreatedAtDesc(userId: Long): List<PracticeSession>
    
    @Query("SELECT COUNT(p) FROM PracticeSession p WHERE p.userId = :userId AND p.createdAt >= :startDate")
    fun countByUserIdAndCreatedAtAfter(@Param("userId") userId: Long, @Param("startDate") startDate: LocalDateTime): Long
    
    @Query("SELECT AVG(p.accuracy) FROM PracticeSession p WHERE p.userId = :userId AND p.completed = true")
    fun findAverageAccuracyByUserId(@Param("userId") userId: Long): Double?
    
    @Query("SELECT AVG(p.score) FROM PracticeSession p WHERE p.userId = :userId AND p.completed = true")
    fun findAverageScoreByUserId(@Param("userId") userId: Long): Double?
    
    @Query("SELECT MAX(p.accuracy) FROM PracticeSession p WHERE p.userId = :userId AND p.completed = true")
    fun findBestAccuracyByUserId(@Param("userId") userId: Long): Double?
    
    @Query("SELECT MAX(p.score) FROM PracticeSession p WHERE p.userId = :userId AND p.completed = true")
    fun findBestScoreByUserId(@Param("userId") userId: Long): Int?
} 