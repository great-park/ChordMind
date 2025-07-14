package com.chordmind.practice.domain

import jakarta.persistence.*
import java.time.LocalDateTime

@Entity
@Table(name = "practice_sessions")
data class PracticeSession(
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Long? = null,
    
    @Column(nullable = false)
    val userId: Long,
    
    @Column(nullable = false)
    val songId: String,
    
    @Column(nullable = false)
    val songTitle: String,
    
    @Column(nullable = false)
    val artist: String,
    
    @Column(nullable = false)
    val difficulty: String,
    
    @Column(nullable = false)
    val tempo: Int,
    
    @Column(nullable = false)
    val key: String,
    
    @Column(nullable = false)
    val duration: Int, // seconds
    
    @Column(nullable = false)
    val accuracy: Double,
    
    @Column(nullable = false)
    val score: Int,
    
    @Column(nullable = false)
    val mistakes: Int,
    
    @Column(nullable = false)
    val completed: Boolean = false,
    
    @Column(nullable = false)
    val createdAt: LocalDateTime = LocalDateTime.now(),
    
    @Column(nullable = false)
    val updatedAt: LocalDateTime = LocalDateTime.now()
) 