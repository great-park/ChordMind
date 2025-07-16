package com.chordmind.practice.service

import com.chordmind.practice.domain.PracticeProgress
import com.chordmind.practice.dto.CreatePracticeProgressRequest
import com.chordmind.practice.dto.PracticeProgressResponse
import com.chordmind.practice.dto.UpdatePracticeProgressRequest
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

    fun searchProgresses(request: com.chordmind.practice.dto.PracticeProgressSearchRequest): List<PracticeProgressResponse> {
        val all = progressRepository.findAll()
        return all.filter { progress ->
            (request.sessionId == null || progress.sessionId == request.sessionId) &&
            (request.note == null || progress.note.contains(request.note, ignoreCase = true)) &&
            (request.scoreMin == null || (progress.score ?: 0) >= request.scoreMin) &&
            (request.scoreMax == null || (progress.score ?: 0) <= request.scoreMax) &&
            (request.timestampFrom == null || progress.timestamp >= request.timestampFrom) &&
            (request.timestampTo == null || progress.timestamp <= request.timestampTo)
        }.map { it.toResponse() }
    }

    @Transactional
    fun updateProgress(progressId: Long, request: UpdatePracticeProgressRequest): PracticeProgressResponse? {
        val progress = progressRepository.findById(progressId).orElse(null) ?: return null
        val updated = progress.copy(
            note = request.note ?: progress.note,
            score = request.score ?: progress.score
        )
        return progressRepository.save(updated).toResponse()
    }

    @Transactional
    fun deleteProgress(progressId: Long): Boolean {
        return if (progressRepository.existsById(progressId)) {
            progressRepository.deleteById(progressId)
            true
        } else {
            false
        }
    }

    private fun PracticeProgress.toResponse() = PracticeProgressResponse(
        id = id!!,
        sessionId = sessionId,
        timestamp = timestamp,
        note = note,
        score = score
    )
} 