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

    fun searchSessions(request: PracticeSessionSearchRequest, page: Int = 0, size: Int = 20): PageResponse<PracticeSessionResponse> {
        val all = sessionRepository.findAll()
        val filtered = all.filter { session ->
            (request.userId == null || session.userId == request.userId) &&
            (request.goal == null || session.goal?.contains(request.goal, ignoreCase = true) == true) &&
            (request.status == null || session.status == request.status) &&
            (request.startedAtFrom == null || session.startedAt >= request.startedAtFrom) &&
            (request.startedAtTo == null || session.startedAt <= request.startedAtTo)
        }
        val totalElements = filtered.size.toLong()
        val totalPages = if (size == 0) 1 else ((totalElements + size - 1) / size).toInt()
        val paged = if (size == 0) filtered else filtered.drop(page * size).take(size)
        return PageResponse(
            content = paged.map { it.toResponse() },
            page = page,
            size = size,
            totalElements = totalElements,
            totalPages = totalPages
        )
    }

    fun getUserPracticeSummary(userId: Long): UserPracticeSummaryResponse {
        val sessions = sessionRepository.findByUserId(userId)
        val totalSessions = sessions.size
        val completedSessions = sessions.count { it.status == SessionStatus.COMPLETED }
        val completedScores = sessions.filter { it.status == SessionStatus.COMPLETED }
            .flatMap { progressRepository.findBySessionId(it.id!!).mapNotNull { p -> p.score } }
        val averageScore = completedScores.takeIf { it.isNotEmpty() }?.average()
        val allScores = sessions.flatMap { session ->
            progressRepository.findBySessionId(session.id!!).mapNotNull { it.score }
        }
        val averageProgressScore = allScores.takeIf { it.isNotEmpty() }?.average()
        val lastSessionAt = sessions.maxOfOrNull { it.endedAt ?: it.startedAt }
        return UserPracticeSummaryResponse(
            userId = userId,
            totalSessions = totalSessions,
            completedSessions = completedSessions,
            averageScore = averageScore,
            averageProgressScore = averageProgressScore,
            lastSessionAt = lastSessionAt
        )
    }

    fun getSessionSummary(sessionId: Long): PracticeSessionSummary? {
        val session = sessionRepository.findById(sessionId).orElse(null) ?: return null
        val progresses = progressRepository.findBySessionId(sessionId)
        val scores = progresses.mapNotNull { it.score }
        val accuracy = if (scores.isNotEmpty()) scores.average() else 0.0
        val score = if (scores.isNotEmpty()) scores.last() else 0
        return PracticeSessionSummary(
            id = session.id!!,
            songTitle = session.goal ?: "-",
            artist = "-",
            difficulty = "-",
            accuracy = accuracy,
            score = score,
            completed = session.status == SessionStatus.COMPLETED,
            createdAt = session.startedAt
        )
    }

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
    fun deleteSession(sessionId: Long): Boolean {
        return if (sessionRepository.existsById(sessionId)) {
            sessionRepository.deleteById(sessionId)
            true
        } else {
            false
        }
    }

    private fun PracticeSession.toResponse() = PracticeSessionResponse(
        id = id!!,
        userId = userId,
        startedAt = startedAt,
        endedAt = endedAt,
        status = status,
        goal = goal
    )
}

private fun List<Double?>.averageOrNull(): Double? = this.filterNotNull().takeIf { it.isNotEmpty() }?.average() 