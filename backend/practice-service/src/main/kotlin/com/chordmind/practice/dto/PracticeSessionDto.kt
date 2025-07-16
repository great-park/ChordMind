package com.chordmind.practice.dto

import com.chordmind.practice.domain.SessionStatus
import java.time.LocalDateTime

// 연습 세션 생성 요청
data class CreatePracticeSessionRequest(
    val userId: Long,
    val goal: String? = null
)

// 연습 세션 응답
data class PracticeSessionResponse(
    val id: Long,
    val userId: Long,
    val startedAt: LocalDateTime,
    val endedAt: LocalDateTime?,
    val status: SessionStatus,
    val goal: String?
)

data class PracticeSessionSummary(
    val id: Long,
    val songTitle: String,
    val artist: String,
    val difficulty: String,
    val accuracy: Double,
    val score: Int,
    val completed: Boolean,
    val createdAt: LocalDateTime
)

// 연습 세션 정보 수정 요청
data class UpdatePracticeSessionRequest(
    val goal: String? = null,
    val status: SessionStatus? = null,
    val endedAt: LocalDateTime? = null
)

// 사용자별 연습 요약/통계 응답
data class UserPracticeSummaryResponse(
    val userId: Long,
    val totalSessions: Int,
    val completedSessions: Int,
    val averageScore: Double?,
    val averageProgressScore: Double?,
    val lastSessionAt: LocalDateTime?
)

// 연습 세션 검색/필터 요청 DTO
data class PracticeSessionSearchRequest(
    val userId: Long? = null,
    val goal: String? = null,
    val status: SessionStatus? = null,
    val startedAtFrom: LocalDateTime? = null,
    val startedAtTo: LocalDateTime? = null
)

// 진행상황 검색/필터 요청 DTO
data class PracticeProgressSearchRequest(
    val sessionId: Long? = null,
    val note: String? = null,
    val scoreMin: Int? = null,
    val scoreMax: Int? = null,
    val timestampFrom: LocalDateTime? = null,
    val timestampTo: LocalDateTime? = null
) 