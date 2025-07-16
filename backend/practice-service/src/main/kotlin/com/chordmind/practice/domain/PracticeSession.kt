package com.chordmind.practice.domain

import jakarta.persistence.*
import java.time.LocalDateTime

@Entity
data class PracticeSession(
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Long? = null,
    val userId: Long,
    val startedAt: LocalDateTime = LocalDateTime.now(),
    val endedAt: LocalDateTime? = null,
    @Enumerated(EnumType.STRING)
    val status: SessionStatus = SessionStatus.IN_PROGRESS,
    val goal: String? = null
)

enum class SessionStatus { IN_PROGRESS, COMPLETED } 