package com.chordmind.practice.service

import com.chordmind.practice.domain.PracticeProgress
import com.chordmind.practice.dto.CreatePracticeProgressRequest
import com.chordmind.practice.dto.PracticeProgressResponse
import com.chordmind.practice.repository.PracticeProgressRepository
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional

@Service
class PracticeProgressService(
    private val progressRepository: PracticeProgressRepository
) {
    @Transactional
    fun addProgress(request: CreatePracticeProgressRequest): PracticeProgressResponse {
        val progress = PracticeProgress(
            sessionId = request.sessionId,
            note = request.note,
            score = request.score
        )
        val saved = progressRepository.save(progress)
        return saved.toResponse()
    }

    fun getProgressBySession(sessionId: Long): List<PracticeProgressResponse> =
        progressRepository.findBySessionId(sessionId).map { it.toResponse() }

    private fun PracticeProgress.toResponse() = PracticeProgressResponse(
        id = id!!,
        sessionId = sessionId,
        timestamp = timestamp,
        note = note,
        score = score
    )
} 