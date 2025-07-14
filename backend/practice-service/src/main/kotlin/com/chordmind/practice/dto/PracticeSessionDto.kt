package com.chordmind.practice.dto

import java.time.LocalDateTime

data class CreatePracticeSessionRequest(
    val userId: Long,
    val songId: String,
    val songTitle: String,
    val artist: String,
    val difficulty: String,
    val tempo: Int,
    val key: String
)

data class UpdatePracticeSessionRequest(
    val duration: Int,
    val accuracy: Double,
    val score: Int,
    val mistakes: Int,
    val completed: Boolean
)

data class PracticeSessionResponse(
    val id: Long,
    val userId: Long,
    val songId: String,
    val songTitle: String,
    val artist: String,
    val difficulty: String,
    val tempo: Int,
    val key: String,
    val duration: Int,
    val accuracy: Double,
    val score: Int,
    val mistakes: Int,
    val completed: Boolean,
    val createdAt: LocalDateTime,
    val updatedAt: LocalDateTime
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