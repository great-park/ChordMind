package com.chordmind.practice.domain

import jakarta.persistence.*
import java.time.LocalDateTime

@Entity
@Table(name = "practice_progress")
data class PracticeProgress(
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Long? = null,
    
    @Column(nullable = false)
    val userId: Long,
    
    @Column(nullable = false)
    val songId: String,
    
    @Column(nullable = false)
    val totalSessions: Int = 0,
    
    @Column(nullable = false)
    val totalPracticeTime: Int = 0, // minutes
    
    @Column(nullable = false)
    val bestAccuracy: Double = 0.0,
    
    @Column(nullable = false)
    val bestScore: Int = 0,
    
    @Column(nullable = false)
    val averageAccuracy: Double = 0.0,
    
    @Column(nullable = false)
    val averageScore: Int = 0,
    
    @Column(nullable = false)
    val lastPracticedAt: LocalDateTime? = null,
    
    @Column(nullable = false)
    val createdAt: LocalDateTime = LocalDateTime.now(),
    
    @Column(nullable = false)
    val updatedAt: LocalDateTime = LocalDateTime.now()
) 