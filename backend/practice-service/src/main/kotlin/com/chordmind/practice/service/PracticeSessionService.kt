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

    fun getUserRanking(userId: Long): UserRankingResponse? {
        val sessions = sessionRepository.findByUserId(userId)
        if (sessions.isEmpty()) return null
        
        val totalSessions = sessions.size
        val completedSessions = sessions.count { it.status == SessionStatus.COMPLETED }
        val allScores = sessions.flatMap { session ->
            progressRepository.findBySessionId(session.id!!).mapNotNull { it.score }
        }
        val averageScore = allScores.takeIf { it.isNotEmpty() }?.average() ?: 0.0
        val totalPracticeTime = sessions.sumOf { session ->
            val duration = if (session.endedAt != null) {
                java.time.Duration.between(session.startedAt, session.endedAt).toMinutes()
            } else {
                java.time.Duration.between(session.startedAt, LocalDateTime.now()).toMinutes()
            }
            duration.coerceAtLeast(0)
        }
        
        // 랭킹 점수 계산 (완료 세션 비율 * 평균 점수 * 연습 시간 가중치)
        val completionRate = if (totalSessions > 0) completedSessions.toDouble() / totalSessions else 0.0
        val score = completionRate * averageScore * (1 + totalPracticeTime / 1000.0) // 시간 가중치
        
        return UserRankingResponse(
            userId = userId,
            totalSessions = totalSessions,
            completedSessions = completedSessions,
            averageScore = averageScore,
            totalPracticeTime = totalPracticeTime,
            rank = 0, // 전체 랭킹에서 계산
            score = score
        )
    }

    fun getTopUsers(limit: Int = 10): List<UserRankingResponse> {
        val allUsers = sessionRepository.findAll().map { it.userId }.distinct()
        val rankings = allUsers.mapNotNull { userId -> getUserRanking(userId) }
        return rankings.sortedByDescending { it.score }.take(limit).mapIndexed { index, ranking ->
            ranking.copy(rank = index + 1)
        }
    }

    fun getAnalyticsUserSummary(userId: Long, from: LocalDateTime?, to: LocalDateTime?): AnalyticsUserSummaryResponse? {
        val sessions = sessionRepository.findByUserId(userId)
            .filter { (from == null || it.startedAt >= from) && (to == null || it.startedAt <= to) }
        if (sessions.isEmpty()) return null
        val totalSessions = sessions.size
        val completedSessions = sessions.count { it.status == SessionStatus.COMPLETED }
        val allScores = sessions.flatMap { session ->
            progressRepository.findBySessionId(session.id!!).mapNotNull { it.score }
        }
        val averageScore = allScores.takeIf { it.isNotEmpty() }?.average()
        val totalPracticeTime = sessions.sumOf { session ->
            val duration = if (session.endedAt != null) {
                java.time.Duration.between(session.startedAt, session.endedAt).toMinutes()
            } else {
                java.time.Duration.between(session.startedAt, LocalDateTime.now()).toMinutes()
            }
            duration.coerceAtLeast(0)
        }
        val firstSessionAt = sessions.minOfOrNull { it.startedAt }
        val lastSessionAt = sessions.maxOfOrNull { it.endedAt ?: it.startedAt }
        val recentGoals = sessions.sortedByDescending { it.startedAt }.take(5).mapNotNull { it.goal }
        return AnalyticsUserSummaryResponse(
            userId = userId,
            totalSessions = totalSessions,
            completedSessions = completedSessions,
            averageScore = averageScore,
            totalPracticeTime = totalPracticeTime,
            firstSessionAt = firstSessionAt,
            lastSessionAt = lastSessionAt,
            recentGoals = recentGoals
        )
    }

    fun getAnalyticsSessionSummary(sessionId: Long): AnalyticsSessionSummaryResponse? {
        val session = sessionRepository.findById(sessionId).orElse(null) ?: return null
        val progresses = progressRepository.findBySessionId(sessionId)
        val averageScore = progresses.mapNotNull { it.score }.takeIf { it.isNotEmpty() }?.average()
        return AnalyticsSessionSummaryResponse(
            sessionId = session.id!!,
            userId = session.userId,
            goal = session.goal,
            startedAt = session.startedAt,
            endedAt = session.endedAt,
            totalProgress = progresses.size,
            averageScore = averageScore,
            completed = session.status == SessionStatus.COMPLETED
        )
    }

    fun getAnalyticsUserTrend(userId: Long, period: String = "week"): AnalyticsUserTrendResponse? {
        val sessions = sessionRepository.findByUserId(userId)
        if (sessions.isEmpty()) return null
        val grouped = when (period) {
            "month" -> sessions.groupBy { it.startedAt.withDayOfMonth(1).toLocalDate() }
            else -> sessions.groupBy { it.startedAt.with(java.time.temporal.TemporalAdjusters.previousOrSame(java.time.DayOfWeek.MONDAY)).toLocalDate() }
        }
        val points = grouped.entries.sortedBy { it.key }.map { (date, group) ->
            val allScores = group.flatMap { session -> progressRepository.findBySessionId(session.id!!).mapNotNull { it.score } }
            TrendPoint(
                date = date.atStartOfDay(),
                sessionCount = group.size,
                averageScore = allScores.takeIf { it.isNotEmpty() }?.average()
            )
        }
        return AnalyticsUserTrendResponse(
            userId = userId,
            period = period,
            points = points
        )
    }

    fun getAdminPracticeSummary(): AdminPracticeSummaryResponse {
        val allSessions = sessionRepository.findAll()
        val allProgress = allSessions.flatMap { progressRepository.findBySessionId(it.id!!) }
        val userIds = allSessions.map { it.userId }.distinct()
        val totalUsers = userIds.size
        val totalSessions = allSessions.size
        val totalProgress = allProgress.size
        val averageSessionPerUser = if (totalUsers > 0) totalSessions.toDouble() / totalUsers else 0.0
        val allScores = allProgress.mapNotNull { it.score }
        val averageScore = allScores.takeIf { it.isNotEmpty() }?.average()
        val lastActivityAt = allProgress.maxOfOrNull { it.timestamp }
        return AdminPracticeSummaryResponse(
            totalUsers = totalUsers,
            totalSessions = totalSessions,
            totalProgress = totalProgress,
            averageSessionPerUser = averageSessionPerUser,
            averageScore = averageScore,
            lastActivityAt = lastActivityAt
        )
    }

    fun getAdminUserSummaries(): List<AdminUserSummary> {
        val allSessions = sessionRepository.findAll()
        val userIds = allSessions.map { it.userId }.distinct()
        return userIds.map { userId ->
            val sessions = allSessions.filter { it.userId == userId }
            val completedSessions = sessions.count { it.status == SessionStatus.COMPLETED }
            val allScores = sessions.flatMap { session -> progressRepository.findBySessionId(session.id!!).mapNotNull { it.score } }
            val averageScore = allScores.takeIf { it.isNotEmpty() }?.average()
            val lastSessionAt = sessions.maxOfOrNull { it.endedAt ?: it.startedAt }
            AdminUserSummary(
                userId = userId,
                totalSessions = sessions.size,
                completedSessions = completedSessions,
                averageScore = averageScore,
                lastSessionAt = lastSessionAt
            )
        }
    }

    fun getAdminSessionSummaries(): List<AdminSessionSummary> {
        val allSessions = sessionRepository.findAll()
        return allSessions.map { session ->
            val progresses = progressRepository.findBySessionId(session.id!!)
            val averageScore = progresses.mapNotNull { it.score }.takeIf { it.isNotEmpty() }?.average()
            AdminSessionSummary(
                sessionId = session.id!!,
                userId = session.userId,
                goal = session.goal,
                startedAt = session.startedAt,
                endedAt = session.endedAt,
                status = session.status.name,
                totalProgress = progresses.size,
                averageScore = averageScore
            )
        }
    }

    fun getAdminProgressSummaries(): List<AdminProgressSummary> {
        val allSessions = sessionRepository.findAll()
        return allSessions.flatMap { session ->
            progressRepository.findBySessionId(session.id!!).map { progress ->
                AdminProgressSummary(
                    progressId = progress.id!!,
                    sessionId = session.id!!,
                    userId = session.userId,
                    note = progress.note,
                    score = progress.score,
                    timestamp = progress.timestamp
                )
            }
        }
    }

    fun getGoalAchievementNotification(userId: Long, sessionId: Long): GoalAchievementNotification? {
        val session = sessionRepository.findById(sessionId).orElse(null) ?: return null
        if (session.userId != userId || session.status != SessionStatus.COMPLETED) return null
        val message = "축하합니다! 목표 '${session.goal ?: "(미지정)"}'를 달성하셨습니다."
        return GoalAchievementNotification(
            userId = userId,
            sessionId = sessionId,
            message = message,
            achievedAt = session.endedAt ?: LocalDateTime.now()
        )
    }

    fun getPracticeRecommendation(userId: Long): PracticeRecommendationResponse {
        val sessions = sessionRepository.findByUserId(userId)
        val recentGoals = sessions.sortedByDescending { it.startedAt }.mapNotNull { it.goal }.distinct().take(3)
        val recommended = if (recentGoals.isNotEmpty()) {
            listOf("${recentGoals.first()} 복습", "새로운 코드 진행", "즉흥 연주 도전")
        } else {
            listOf("기본 코드 연습 시작하기", "즉흥 연주 도전")
        }
        val message = "다음 목표를 추천합니다: ${recommended.joinToString(", ")}"
        return PracticeRecommendationResponse(
            userId = userId,
            recommendedGoals = recommended,
            message = message
        )
    }

    fun getPracticeFeedback(userId: Long, sessionId: Long, progressId: Long): PracticeFeedbackResponse? {
        val session = sessionRepository.findById(sessionId).orElse(null) ?: return null
        if (session.userId != userId) return null
        val progress = progressRepository.findBySessionId(sessionId).find { it.id == progressId } ?: return null
        val feedback = when {
            progress.score == null -> "점수가 입력되지 않았어요. 다음엔 점수도 기록해보세요!"
            progress.score >= 90 -> "훌륭해요! 거의 완벽에 가까운 연습입니다."
            progress.score >= 70 -> "좋아요! 조금만 더 연습하면 더 나아질 수 있어요."
            else -> "계속 도전해보세요! 연습이 실력을 만듭니다."
        }
        return PracticeFeedbackResponse(
            userId = userId,
            sessionId = sessionId,
            progressId = progressId,
            feedback = feedback
        )
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