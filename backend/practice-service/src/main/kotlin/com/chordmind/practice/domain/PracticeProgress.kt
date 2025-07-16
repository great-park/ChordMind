package com.chordmind.practice.domain

import jakarta.persistence.*
import java.time.LocalDateTime

@Entity
data class PracticeProgress(
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Long? = null,
    val sessionId: Long,
    val timestamp: LocalDateTime = LocalDateTime.now(),
    val note: String,
    val score: Int? = null
) 