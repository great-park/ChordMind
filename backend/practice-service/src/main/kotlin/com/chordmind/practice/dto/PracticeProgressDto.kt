package com.chordmind.practice.dto

import java.time.LocalDateTime

// 연습 진행상황 기록 요청
data class CreatePracticeProgressRequest(
    val sessionId: Long,
    val note: String,
    val score: Int? = null
)

// 연습 진행상황 응답
data class PracticeProgressResponse(
    val id: Long,
    val sessionId: Long,
    val timestamp: LocalDateTime,
    val note: String,
    val score: Int?
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

// 진행상황 정보 수정 요청
data class UpdatePracticeProgressRequest(
    val note: String? = null,
    val score: Int? = null
) 