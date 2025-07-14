package com.chordmind.practice.dto

import java.time.LocalDateTime

data class PracticeProgressResponse(
    val id: Long,
    val userId: Long,
    val songId: String,
    val totalSessions: Int,
    val totalPracticeTime: Int,
    val bestAccuracy: Double,
    val bestScore: Int,
    val averageAccuracy: Double,
    val averageScore: Int,
    val lastPracticedAt: LocalDateTime?,
    val createdAt: LocalDateTime,
    val updatedAt: LocalDateTime
)

data class UserPracticeStats(
    val userId: Long,
    val totalSessions: Int,
    val totalPracticeTime: Int,
    val averageAccuracy: Double,
    val averageScore: Int,
    val bestAccuracy: Double,
    val bestScore: Int,
    val lastPracticedAt: LocalDateTime?
)

data class SongPracticeStats(
    val songId: String,
    val songTitle: String,
    val artist: String,
    val totalSessions: Int,
    val totalPracticeTime: Int,
    val bestAccuracy: Double,
    val bestScore: Int,
    val averageAccuracy: Double,
    val averageScore: Int,
    val lastPracticedAt: LocalDateTime?
) 