package com.chordmind.practice.service

import com.chordmind.practice.domain.PracticeSession
import com.chordmind.practice.dto.*
import com.chordmind.practice.repository.PracticeSessionRepository
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import java.time.LocalDateTime

@Service
@Transactional
class PracticeSessionService(
    private val practiceSessionRepository: PracticeSessionRepository
) {
    
    fun createPracticeSession(request: CreatePracticeSessionRequest): PracticeSessionResponse {
        val practiceSession = PracticeSession(
            userId = request.userId,
            songId = request.songId,
            songTitle = request.songTitle,
            artist = request.artist,
            difficulty = request.difficulty,
            tempo = request.tempo,
            key = request.key,
            duration = 0,
            accuracy = 0.0,
            score = 0,
            mistakes = 0,
            completed = false
        )
        
        val savedSession = practiceSessionRepository.save(practiceSession)
        return mapToResponse(savedSession)
    }
    
    fun updatePracticeSession(sessionId: Long, request: UpdatePracticeSessionRequest): PracticeSessionResponse {
        val session = practiceSessionRepository.findById(sessionId)
            .orElseThrow { RuntimeException("Practice session not found with id: $sessionId") }
        
        val updatedSession = session.copy(
            duration = request.duration,
            accuracy = request.accuracy,
            score = request.score,
            mistakes = request.mistakes,
            completed = request.completed,
            updatedAt = LocalDateTime.now()
        )
        
        val savedSession = practiceSessionRepository.save(updatedSession)
        return mapToResponse(savedSession)
    }
    
    fun getPracticeSession(sessionId: Long): PracticeSessionResponse {
        val session = practiceSessionRepository.findById(sessionId)
            .orElseThrow { RuntimeException("Practice session not found with id: $sessionId") }
        return mapToResponse(session)
    }
    
    fun getUserPracticeSessions(userId: Long): List<PracticeSessionSummary> {
        val sessions = practiceSessionRepository.findByUserIdOrderByCreatedAtDesc(userId)
        return sessions.map { mapToSummary(it) }
    }
    
    fun getUserCompletedSessions(userId: Long): List<PracticeSessionSummary> {
        val sessions = practiceSessionRepository.findByUserIdAndCompletedTrueOrderByCreatedAtDesc(userId)
        return sessions.map { mapToSummary(it) }
    }
    
    fun getSongPracticeSessions(userId: Long, songId: String): List<PracticeSessionSummary> {
        val sessions = practiceSessionRepository.findByUserIdAndSongIdOrderByCreatedAtDesc(userId, songId)
        return sessions.map { mapToSummary(it) }
    }
    
    fun getUserStats(userId: Long): UserPracticeStats {
        val completedSessions = practiceSessionRepository.findByUserIdAndCompletedTrueOrderByCreatedAtDesc(userId)
        
        if (completedSessions.isEmpty()) {
            return UserPracticeStats(
                userId = userId,
                totalSessions = 0,
                totalPracticeTime = 0,
                averageAccuracy = 0.0,
                averageScore = 0,
                bestAccuracy = 0.0,
                bestScore = 0,
                lastPracticedAt = null
            )
        }
        
        val totalSessions = completedSessions.size
        val totalPracticeTime = completedSessions.sumOf { it.duration } / 60 // Convert to minutes
        val averageAccuracy = completedSessions.map { it.accuracy }.average()
        val averageScore = completedSessions.map { it.score }.average().toInt()
        val bestAccuracy = completedSessions.maxOf { it.accuracy }
        val bestScore = completedSessions.maxOf { it.score }
        val lastPracticedAt = completedSessions.maxOfOrNull { it.createdAt }
        
        return UserPracticeStats(
            userId = userId,
            totalSessions = totalSessions,
            totalPracticeTime = totalPracticeTime,
            averageAccuracy = averageAccuracy,
            averageScore = averageScore,
            bestAccuracy = bestAccuracy,
            bestScore = bestScore,
            lastPracticedAt = lastPracticedAt
        )
    }
    
    private fun mapToResponse(session: PracticeSession): PracticeSessionResponse {
        return PracticeSessionResponse(
            id = session.id!!,
            userId = session.userId,
            songId = session.songId,
            songTitle = session.songTitle,
            artist = session.artist,
            difficulty = session.difficulty,
            tempo = session.tempo,
            key = session.key,
            duration = session.duration,
            accuracy = session.accuracy,
            score = session.score,
            mistakes = session.mistakes,
            completed = session.completed,
            createdAt = session.createdAt,
            updatedAt = session.updatedAt
        )
    }
    
    private fun mapToSummary(session: PracticeSession): PracticeSessionSummary {
        return PracticeSessionSummary(
            id = session.id!!,
            songTitle = session.songTitle,
            artist = session.artist,
            difficulty = session.difficulty,
            accuracy = session.accuracy,
            score = session.score,
            completed = session.completed,
            createdAt = session.createdAt
        )
    }
} 