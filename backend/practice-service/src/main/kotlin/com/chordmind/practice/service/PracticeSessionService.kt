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
        if (sessions.isEmpty()) return null
        
        val filteredSessions = sessions.filter { session ->
            (from == null || session.startedAt >= from) &&
            (to == null || session.startedAt <= to)
        }
        
        val totalSessions = filteredSessions.size
        val completedSessions = filteredSessions.count { it.status == SessionStatus.COMPLETED }
        val totalPracticeTime = filteredSessions.sumOf { session ->
            val duration = if (session.endedAt != null) {
                java.time.Duration.between(session.startedAt, session.endedAt).toMinutes()
            } else {
                java.time.Duration.between(session.startedAt, LocalDateTime.now()).toMinutes()
            }
            duration.coerceAtLeast(0)
        }
        val averageSessionTime = if (totalSessions > 0) totalPracticeTime.toDouble() / totalSessions else 0.0
        val completionRate = if (totalSessions > 0) (completedSessions.toDouble() / totalSessions) * 100 else 0.0
        val improvementRate = calculateImprovementRate(filteredSessions)
        val lastSessionAt = sessions.maxOfOrNull { it.endedAt ?: it.startedAt }
        val streakDays = calculateStreakDays(sessions)
        val achievements = listOf("첫 연습", "일주일 연속", "화음 마스터")
        
        return AnalyticsUserSummaryResponse(
            userId = userId,
            totalSessions = totalSessions,
            completedSessions = completedSessions,
            totalPracticeTime = totalPracticeTime,
            averageSessionTime = averageSessionTime,
            completionRate = completionRate,
            improvementRate = improvementRate,
            lastSessionAt = lastSessionAt,
            streakDays = streakDays,
            achievements = achievements
        )
    }

    fun getAnalyticsSessionSummary(sessionId: Long): AnalyticsSessionSummaryResponse? {
        val session = sessionRepository.findById(sessionId).orElse(null) ?: return null
        val progresses = progressRepository.findBySessionId(sessionId)
        val averageScore = progresses.mapNotNull { it.score }.takeIf { it.isNotEmpty() }?.average() ?: 0.0
        val duration = session.endedAt?.let { 
            java.time.Duration.between(session.startedAt, it).toMinutes() 
        } ?: java.time.Duration.between(session.startedAt, LocalDateTime.now()).toMinutes()
        val improvementRate = calculateSessionImprovementRate(progresses)
        val difficultyLevel = determineDifficultyLevel(averageScore)
        val focusAreas = listOf("화음 진행", "음정 인식")
        
        return AnalyticsSessionSummaryResponse(
            sessionId = session.id!!,
            userId = session.userId,
            duration = duration,
            progressCount = progresses.size,
            averageScore = averageScore,
            improvementRate = improvementRate,
            difficultyLevel = difficultyLevel,
            focusAreas = focusAreas
        )
    }

    fun getAnalyticsUserTrend(userId: Long, period: String = "week"): AnalyticsUserTrendResponse? {
        val sessions = sessionRepository.findByUserId(userId)
        if (sessions.isEmpty()) return null
        
        val grouped = when (period) {
            "month" -> sessions.groupBy { it.startedAt.withDayOfMonth(1).toLocalDate() }
            else -> sessions.groupBy { it.startedAt.with(java.time.temporal.TemporalAdjusters.previousOrSame(java.time.DayOfWeek.MONDAY)).toLocalDate() }
        }
        
        val dataPoints = grouped.entries.sortedBy { it.key }.map { (date, group) ->
            val allScores = group.flatMap { session -> progressRepository.findBySessionId(session.id!!).mapNotNull { it.score } }
            TrendDataPoint(
                date = date.atStartOfDay(),
                value = allScores.takeIf { it.isNotEmpty() }?.average() ?: 0.0,
                label = "평균 점수"
            )
        }
        
        val overallTrend = if (dataPoints.size >= 2) {
            val first = dataPoints.first().value
            val last = dataPoints.last().value
            if (last > first) "improving" else if (last < first) "declining" else "stable"
        } else "stable"
        
        val trendStrength = if (dataPoints.size >= 2) {
            val first = dataPoints.first().value
            val last = dataPoints.last().value
            kotlin.math.abs(last - first) / 100.0
        } else 0.0
        
        return AnalyticsUserTrendResponse(
            userId = userId,
            period = period,
            dataPoints = dataPoints,
            overallTrend = overallTrend,
            trendStrength = trendStrength
        )
    }
    
    private fun calculateImprovementRate(sessions: List<PracticeSession>): Double {
        if (sessions.size < 2) return 0.0
        val sortedSessions = sessions.sortedBy { it.startedAt }
        val firstScores = progressRepository.findBySessionId(sortedSessions.first().id!!).mapNotNull { it.score }
        val lastScores = progressRepository.findBySessionId(sortedSessions.last().id!!).mapNotNull { it.score }
        
        val firstAvg = firstScores.average()
        val lastAvg = lastScores.average()
        
        return if (firstAvg > 0) ((lastAvg - firstAvg) / firstAvg) * 100 else 0.0
    }
    
    private fun calculateStreakDays(sessions: List<PracticeSession>): Int {
        val dailySessions = sessions.groupBy { it.startedAt.toLocalDate() }
        val sortedDates = dailySessions.keys.sorted()
        
        var currentStreak = 0
        var longestStreak = 0
        var currentDate = sortedDates.firstOrNull()
        
        while (currentDate != null) {
            if (dailySessions.containsKey(currentDate)) {
                currentStreak++
                longestStreak = maxOf(longestStreak, currentStreak)
            } else {
                currentStreak = 0
            }
            currentDate = currentDate.plusDays(1)
            if (currentDate > sortedDates.last()) break
        }
        
        return longestStreak
    }
    
    private fun calculateSessionImprovementRate(progresses: List<PracticeProgress>): Double {
        if (progresses.size < 2) return 0.0
        val sortedProgresses = progresses.sortedBy { it.timestamp }
        val firstScore = sortedProgresses.first().score ?: 0
        val lastScore = sortedProgresses.last().score ?: 0
        
        return if (firstScore > 0) ((lastScore - firstScore).toDouble() / firstScore) * 100 else 0.0
    }
    
    private fun determineDifficultyLevel(averageScore: Double): String {
        return when {
            averageScore >= 80 -> "고급"
            averageScore >= 60 -> "중급"
            else -> "초급"
        }
    }

    fun getAdminPracticeSummary(): AdminPracticeSummaryResponse {
        val allSessions = sessionRepository.findAll()
        val userIds = allSessions.map { it.userId }.distinct()
        val totalUsers = userIds.size
        val totalSessions = allSessions.size

        val now = LocalDateTime.now()
        val sevenDaysAgo = now.minusDays(7)
        val activeUsers = allSessions.filter { session ->
            val hasRecentSession = (session.endedAt ?: session.startedAt).isAfter(sevenDaysAgo)
            val hasRecentProgress = progressRepository.findBySessionId(session.id!!).any { it.timestamp.isAfter(sevenDaysAgo) }
            hasRecentSession || hasRecentProgress
        }.map { it.userId }.distinct().size

        val totalPracticeTime = allSessions.sumOf { session ->
            val duration = session.endedAt?.let { java.time.Duration.between(session.startedAt, it).toMinutes() }
                ?: java.time.Duration.between(session.startedAt, now).toMinutes()
            duration.coerceAtLeast(0)
        }
        val averageSessionTime = if (totalSessions > 0) totalPracticeTime.toDouble() / totalSessions else 0.0

        val popularGoals = allSessions.mapNotNull { it.goal }
            .groupingBy { it }
            .eachCount()
            .entries
            .sortedByDescending { it.value }
            .take(3)
            .map { it.key }

        val trendingSkills = listOf("화음 진행", "음정 인식", "리듬")

        return AdminPracticeSummaryResponse(
            totalUsers = totalUsers,
            activeUsers = activeUsers,
            totalSessions = totalSessions,
            averageSessionTime = averageSessionTime,
            popularGoals = popularGoals,
            trendingSkills = trendingSkills
        )
    }

    fun getAdminUserSummaries(): List<AdminUserSummary> {
        val allSessions = sessionRepository.findAll()
        val userIds = allSessions.map { it.userId }.distinct()
        return userIds.map { userId ->
            val sessions = allSessions.filter { it.userId == userId }
            val allScores = sessions.flatMap { session ->
                progressRepository.findBySessionId(session.id!!).mapNotNull { it.score }
            }
            val averageScore = allScores.takeIf { it.isNotEmpty() }?.average() ?: 0.0
            val lastActiveAt = sessions.maxOfOrNull { it.endedAt ?: it.startedAt } ?: LocalDateTime.MIN
            val totalPracticeTime = sessions.sumOf { session ->
                val end = session.endedAt ?: LocalDateTime.now()
                java.time.Duration.between(session.startedAt, end).toMinutes().coerceAtLeast(0)
            }
            AdminUserSummary(
                userId = userId,
                username = "User$userId",
                totalSessions = sessions.size,
                totalPracticeTime = totalPracticeTime,
                averageScore = averageScore,
                lastActiveAt = lastActiveAt
            )
        }
    }

    fun getAdminSessionSummaries(): List<AdminSessionSummary> {
        val allSessions = sessionRepository.findAll()
        return allSessions.map { session ->
            val progresses = progressRepository.findBySessionId(session.id!!)
            val avgScore = progresses.mapNotNull { it.score }.average().let { if (it.isNaN()) 0.0 else it }
            val duration = session.endedAt?.let { java.time.Duration.between(session.startedAt, it).toMinutes() }
                ?: java.time.Duration.between(session.startedAt, LocalDateTime.now()).toMinutes()
            AdminSessionSummary(
                sessionId = session.id,
                userId = session.userId,
                username = "User${session.userId}",
                startedAt = session.startedAt,
                endedAt = session.endedAt,
                duration = duration,
                score = avgScore,
                status = session.status.name
            )
        }
    }

    fun getAdminProgressSummaries(): List<AdminProgressSummary> {
        val allSessions = sessionRepository.findAll()
        val allProgress = allSessions.flatMap { progressRepository.findBySessionId(it.id!!) }

        val totalProgress = allProgress.size
        val averageScore = allProgress.mapNotNull { it.score }.average().let { if (it.isNaN()) 0.0 else it }
        val improvementRate = allSessions.map { session ->
            val progresses = progressRepository.findBySessionId(session.id!!)
            calculateSessionImprovementRate(progresses)
        }.filter { !it.isNaN() }.average().let { if (it.isNaN()) 0.0 else it }

        val topPerformers = getAdminUserSummaries().sortedByDescending { it.averageScore }.take(5)
        val recentActivity = getAdminSessionSummaries().sortedByDescending { it.startedAt }.take(10)

        return listOf(
            AdminProgressSummary(
                totalProgress = totalProgress,
                averageScore = averageScore,
                improvementRate = improvementRate,
                topPerformers = topPerformers,
                recentActivity = recentActivity
            )
        )
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
    
    // 새로운 분석 및 통계 메서드들 추가
    
    fun getUserProgressTrend(userId: Long, days: Int): ProgressTrendResponse {
        val sessions = sessionRepository.findByUserId(userId)
        val fromDate = LocalDateTime.now().minusDays(days.toLong())
        val recentSessions = sessions.filter { it.startedAt >= fromDate }
        
        val trendData = recentSessions.groupBy { it.startedAt.toLocalDate() }
            .map { (date, daySessions) ->
                val totalTime = daySessions.sumOf { session ->
                    val duration = session.endedAt?.let { it.toEpochSecond(java.time.ZoneOffset.UTC) - session.startedAt.toEpochSecond(java.time.ZoneOffset.UTC) } ?: 0
                    duration / 60 // 분 단위로 변환
                }
                val avgScore = daySessions.flatMap { session ->
                    progressRepository.findBySessionId(session.id!!).mapNotNull { it.score }
                }.average()
                
                ProgressDataPoint(
                    date = date.atStartOfDay(),
                    practiceTime = totalTime,
                    sessions = daySessions.size,
                    averageScore = avgScore,
                    completionRate = daySessions.count { it.status == SessionStatus.COMPLETED }.toDouble() / daySessions.size
                )
            }
            .sortedBy { it.date }
        
        val overallTrend = if (trendData.size >= 2) {
            val first = trendData.first().averageScore
            val last = trendData.last().averageScore
            if (last > first) "improving" else if (last < first) "declining" else "stable"
        } else "stable"
        
        val improvementRate = if (trendData.size >= 2) {
            val first = trendData.first().averageScore
            val last = trendData.last().averageScore
            if (first > 0) ((last - first) / first) * 100 else 0.0
        } else 0.0
        
        return ProgressTrendResponse(
            userId = userId,
            period = days,
            trendData = trendData,
            overallTrend = overallTrend,
            improvementRate = improvementRate,
            consistencyScore = calculateConsistencyScoreFromTrend(trendData)
        )
    }
    
    fun getUserSkillAnalysis(userId: Long): SkillAnalysisResponse {
        
        val skills = listOf(
            SkillData("기본 화음", 75.0, 90.0, 83.3, 120, 15),
            SkillData("화음 진행", 60.0, 85.0, 70.6, 90, 12),
            SkillData("음정 인식", 80.0, 95.0, 84.2, 150, 18),
            SkillData("리듬 감각", 65.0, 80.0, 81.3, 100, 14)
        )
        
        val strengths = skills.filter { it.progress > 80 }.map { it.skillName }
        val weaknesses = skills.filter { it.progress < 70 }.map { it.skillName }
        
        val recommendations = when {
            weaknesses.isNotEmpty() -> weaknesses.map { "집중적으로 연습하세요: $it" }
            strengths.size >= 3 -> listOf("고급 과정으로 진행하세요")
            else -> listOf("균형잡힌 학습을 계속하세요")
        }
        
        val overallLevel = when {
            skills.all { it.progress >= 80 } -> "고급"
            skills.all { it.progress >= 60 } -> "중급"
            else -> "초급"
        }
        
        return SkillAnalysisResponse(
            userId = userId,
            skills = skills,
            strengths = strengths,
            weaknesses = weaknesses,
            recommendations = recommendations,
            overallLevel = overallLevel
        )
    }
    
    fun getUserPracticePatterns(userId: Long): PracticePatternsResponse {
        val sessions = sessionRepository.findByUserId(userId)
        
        val timePatterns = TimePatterns(
            preferredTimeSlots = listOf("오후 2-4시", "저녁 7-9시"),
            averageSessionDuration = sessions.map { session ->
                session.endedAt?.let { 
                    (it.toEpochSecond(java.time.ZoneOffset.UTC) - session.startedAt.toEpochSecond(java.time.ZoneOffset.UTC)) / 60.0
                } ?: 30.0
            }.average(),
            longestStreak = calculateLongestStreak(sessions),
            consistencyScore = calculateConsistencyScoreFromSessions(sessions)
        )
        
        val sessionPatterns = SessionPatterns(
            typicalSessionLength = 45.0,
            breakFrequency = 0.2,
            focusAreas = listOf("화음 진행", "음정 인식"),
            difficultyProgression = "점진적"
        )
        
        val improvementPatterns = ImprovementPatterns(
            learningCurve = "안정적 상승",
            plateauPeriods = emptyList(),
            breakthroughPoints = listOf(LocalDateTime.now().minusDays(7)),
            overallProgress = 75.0
        )
        
        return PracticePatternsResponse(
            userId = userId,
            timePatterns = timePatterns,
            sessionPatterns = sessionPatterns,
            improvementPatterns = improvementPatterns,
            recommendations = listOf("일정한 시간에 연습하세요", "약점 영역을 집중적으로 연습하세요")
        )
    }
    
    fun getUserGoals(userId: Long): List<GoalResponse> {
        return listOf(
            GoalResponse(
                id = 1L,
                userId = userId,
                title = "일일 연습 목표",
                description = "하루 30분 연습하기",
                targetDate = LocalDateTime.now().plusDays(30),
                targetValue = 30.0,
                currentValue = 25.0,
                progress = 83.3,
                status = "active",
                createdAt = LocalDateTime.now().minusDays(5)
            ),
            GoalResponse(
                id = 2L,
                userId = userId,
                title = "화음 진행 마스터",
                description = "기본 화음 진행 완벽하게 연주하기",
                targetDate = LocalDateTime.now().plusDays(60),
                targetValue = 90.0,
                currentValue = 75.0,
                progress = 83.3,
                status = "active",
                createdAt = LocalDateTime.now().minusDays(10)
            )
        )
    }
    
    fun createUserGoal(userId: Long, request: CreateGoalRequest): GoalResponse {
        return GoalResponse(
            id = System.currentTimeMillis(),
            userId = userId,
            title = request.title,
            description = request.description,
            targetDate = request.targetDate,
            targetValue = request.targetValue,
            currentValue = 0.0,
            progress = 0.0,
            status = "active",
            createdAt = LocalDateTime.now()
        )
    }
    
    fun getUserAchievements(userId: Long): List<AchievementResponse> {
        return listOf(
            AchievementResponse(
                id = "first_session",
                userId = userId,
                name = "첫 연습",
                description = "첫 번째 연습 세션을 완료했습니다",
                icon = "🎵",
                category = "participation",
                earnedAt = LocalDateTime.now().minusDays(10),
                rarity = "common"
            ),
            AchievementResponse(
                id = "streak_7",
                userId = userId,
                name = "일주일 연속",
                description = "7일 연속으로 연습했습니다",
                icon = "🔥",
                category = "consistency",
                earnedAt = LocalDateTime.now().minusDays(3),
                rarity = "rare"
            )
        )
    }
    
    fun getUserComparison(userId: Long, compareWithUserId: Long?): UserComparisonResponse {
        val userStats = UserStats(
            totalPracticeTime = 180L,
            totalSessions = 15,
            averageScore = 75.0,
            completionRate = 80.0,
            improvementRate = 15.0,
            streakDays = 7
        )
        
        val compareStats = compareWithUserId?.let {
            UserStats(
                totalPracticeTime = 200L,
                totalSessions = 18,
                averageScore = 78.0,
                completionRate = 85.0,
                improvementRate = 12.0,
                streakDays = 5
            )
        }
        
        val differences = compareStats?.let {
            ComparisonDifferences(
                practiceTimeDiff = userStats.totalPracticeTime - it.totalPracticeTime,
                sessionsDiff = userStats.totalSessions - it.totalSessions,
                scoreDiff = userStats.averageScore - it.averageScore,
                completionRateDiff = userStats.completionRate - it.completionRate,
                improvementRateDiff = userStats.improvementRate - it.improvementRate
            )
        } ?: ComparisonDifferences(0, 0, 0.0, 0.0, 0.0)
        
        return UserComparisonResponse(
            userId = userId,
            compareWithUserId = compareWithUserId,
            userStats = userStats,
            compareStats = compareStats,
            differences = differences,
            percentile = 75.0
        )
    }
    
    @Suppress("UNUSED_PARAMETER")
    fun getGlobalLeaderboard(limit: Int, period: String?): List<LeaderboardEntryResponse> {
        return (1..limit).map { rank ->
            LeaderboardEntryResponse(
                rank = rank,
                userId = rank.toLong(),
                username = "User$rank",
                score = 100.0 - (rank * 2.0),
                totalPracticeTime = 300L - (rank * 10L),
                sessions = 25 - rank,
                achievements = 8 - (rank / 2)
            )
        }
    }
    
    fun getGlobalTrends(): GlobalTrendsResponse {
        return GlobalTrendsResponse(
            totalUsers = 1250,
            activeUsers = 850,
            totalPracticeTime = 45000L,
            averageSessionTime = 35.5,
            popularGoals = listOf("일일 연습", "화음 마스터", "음정 인식"),
            trendingSkills = listOf("재즈 화성학", "고급 화음 진행", "이론과 실습"),
            period = "이번 주"
        )
    }
    
    private fun calculateConsistencyScoreFromTrend(trendData: List<ProgressDataPoint>): Double {
        if (trendData.size < 2) return 0.0
        val variances = trendData.zipWithNext().map { (first, second) ->
            kotlin.math.abs(second.averageScore - first.averageScore)
        }
        val averageVariance = variances.average()
        return (100.0 - averageVariance).coerceIn(0.0, 100.0)
    }
    
    private fun calculateConsistencyScoreFromSessions(sessions: List<PracticeSession>): Double {
        if (sessions.size < 2) return 0.0
        val dailySessions = sessions.groupBy { it.startedAt.toLocalDate() }
        val sessionCounts = dailySessions.values.map { it.size }
        val averageSessions = sessionCounts.average()
        val variance = sessionCounts.map { kotlin.math.abs(it - averageSessions) }.average()
        return (100.0 - variance).coerceIn(0.0, 100.0)
    }
    
    private fun calculateLongestStreak(sessions: List<PracticeSession>): Int {
        val dailySessions = sessions.groupBy { it.startedAt.toLocalDate() }
        val sortedDates = dailySessions.keys.sorted()
        
        var currentStreak = 0
        var longestStreak = 0
        var currentDate = sortedDates.firstOrNull()
        
        while (currentDate != null) {
            if (dailySessions.containsKey(currentDate)) {
                currentStreak++
                longestStreak = maxOf(longestStreak, currentStreak)
            } else {
                currentStreak = 0
            }
            currentDate = currentDate.plusDays(1)
            if (currentDate > sortedDates.last()) break
        }
        
        return longestStreak
    }
} 