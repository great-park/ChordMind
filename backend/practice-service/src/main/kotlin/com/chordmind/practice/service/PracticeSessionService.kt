package com.chordmind.practice.service

import com.chordmind.practice.domain.PracticeSession
import com.chordmind.practice.domain.PracticeProgress
import com.chordmind.practice.domain.SessionStatus
import com.chordmind.practice.dto.*
import com.chordmind.practice.repository.PracticeSessionRepository
import com.chordmind.practice.repository.PracticeProgressRepository
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import java.time.LocalDateTime

@Service
class PracticeSessionService(
    private val sessionRepository: PracticeSessionRepository,
    private val progressRepository: PracticeProgressRepository
) {
    @Transactional
    fun createSession(request: CreatePracticeSessionRequest): PracticeSessionResponse {
        val session = PracticeSession(
            userId = request.userId,
            goal = request.goal
        )
        val saved = sessionRepository.save(session)
        return saved.toResponse()
    }

    fun getSession(sessionId: Long): PracticeSessionResponse? =
        sessionRepository.findById(sessionId).orElse(null)?.toResponse()

    fun getSessionsByUser(userId: Long): List<PracticeSessionResponse> =
        sessionRepository.findByUserId(userId).map { it.toResponse() }

    @Transactional
    fun endSession(sessionId: Long): PracticeSessionResponse? {
        val session = sessionRepository.findById(sessionId).orElse(null) ?: return null
        val ended = session.copy(
            endedAt = LocalDateTime.now(),
            status = SessionStatus.COMPLETED
        )
        return sessionRepository.save(ended).toResponse()
    }

    @Transactional
    fun updateSession(sessionId: Long, request: UpdatePracticeSessionRequest): PracticeSessionResponse? {
        val session = sessionRepository.findById(sessionId).orElse(null) ?: return null
        val updated = session.copy(
            goal = request.goal ?: session.goal,
            status = request.status ?: session.status,
            endedAt = request.endedAt ?: session.endedAt
        )
        return sessionRepository.save(updated).toResponse()
    }

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

    // Entity -> DTO 변환 확장 함수
    private fun PracticeSession.toResponse() = PracticeSessionResponse(
        id = id!!,
        userId = userId,
        startedAt = startedAt,
        endedAt = endedAt,
        status = status,
        goal = goal
    )

    private fun PracticeProgress.toResponse() = PracticeProgressResponse(
        id = id!!,
        sessionId = sessionId,
        timestamp = timestamp,
        note = note,
        score = score
    )
} 