package com.chordmind.practice.controller

import com.chordmind.practice.dto.*
import com.chordmind.practice.service.PracticeSessionService
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*
import java.time.LocalDateTime
import com.chordmind.practice.domain.SessionStatus

@RestController
@RequestMapping("/api/practice-sessions")
class PracticeSessionController(
    private val practiceSessionService: PracticeSessionService,
    private val practiceProgressService: com.chordmind.practice.service.PracticeProgressService
) {
    @PostMapping
    fun createSession(@RequestBody request: CreatePracticeSessionRequest): ResponseEntity<PracticeSessionResponse> =
        ResponseEntity.ok(practiceSessionService.createSession(request))

    @GetMapping("/{sessionId}")
    fun getSession(@PathVariable sessionId: Long): ResponseEntity<PracticeSessionResponse> {
        val session = practiceSessionService.getSession(sessionId)
        return if (session != null) ResponseEntity.ok(session) else ResponseEntity.notFound().build()
    }

    @GetMapping("/user/{userId}")
    fun getSessionsByUser(@PathVariable userId: Long): ResponseEntity<List<PracticeSessionResponse>> =
        ResponseEntity.ok(practiceSessionService.getSessionsByUser(userId))

    @GetMapping("/user/{userId}/summary")
    fun getUserPracticeSummary(@PathVariable userId: Long): ResponseEntity<UserPracticeSummaryResponse> =
        ResponseEntity.ok(practiceSessionService.getUserPracticeSummary(userId))

    @GetMapping("/{sessionId}/summary")
    fun getSessionSummary(@PathVariable sessionId: Long): ResponseEntity<CommonResponse<PracticeSessionSummary>> {
        val summary = practiceSessionService.getSessionSummary(sessionId)
        return if (summary != null) ResponseEntity.ok(CommonResponse(success = true, data = summary))
        else ResponseEntity.status(404).body(CommonResponse(success = false, error = "Session not found"))
    }

    @PostMapping("/{sessionId}/end")
    fun endSession(@PathVariable sessionId: Long): ResponseEntity<PracticeSessionResponse> {
        val session = practiceSessionService.endSession(sessionId)
        return if (session != null) ResponseEntity.ok(session) else ResponseEntity.notFound().build()
    }

    @PatchMapping("/{sessionId}")
    fun updateSession(
        @PathVariable sessionId: Long,
        @RequestBody request: UpdatePracticeSessionRequest
    ): ResponseEntity<PracticeSessionResponse> {
        val updated = practiceSessionService.updateSession(sessionId, request)
        return if (updated != null) ResponseEntity.ok(updated) else ResponseEntity.notFound().build()
    }

    @DeleteMapping("/{sessionId}")
    fun deleteSession(@PathVariable sessionId: Long): ResponseEntity<Void> {
        return if (practiceSessionService.deleteSession(sessionId)) {
            ResponseEntity.noContent().build()
        } else {
            ResponseEntity.notFound().build()
        }
    }

    @GetMapping("/search")
    fun searchSessions(
        @RequestParam(required = false) userId: Long?,
        @RequestParam(required = false) goal: String?,
        @RequestParam(required = false) status: SessionStatus?,
        @RequestParam(required = false) startedAtFrom: LocalDateTime?,
        @RequestParam(required = false) startedAtTo: LocalDateTime?,
        @RequestParam(defaultValue = "0") page: Int,
        @RequestParam(defaultValue = "20") size: Int
    ): ResponseEntity<CommonResponse<PageResponse<PracticeSessionResponse>>> {
        val request = PracticeSessionSearchRequest(userId, goal, status, startedAtFrom, startedAtTo)
        val result = practiceSessionService.searchSessions(request, page, size)
        return ResponseEntity.ok(CommonResponse(success = true, data = result))
    }

    @GetMapping("/ranking/user/{userId}")
    fun getUserRanking(@PathVariable userId: Long): ResponseEntity<CommonResponse<UserRankingResponse>> {
        val ranking = practiceSessionService.getUserRanking(userId)
        return if (ranking != null) ResponseEntity.ok(CommonResponse(success = true, data = ranking))
        else ResponseEntity.status(404).body(CommonResponse(success = false, error = "User ranking not found"))
    }

    @GetMapping("/ranking/top")
    fun getTopUsers(@RequestParam(defaultValue = "10") limit: Int): ResponseEntity<CommonResponse<List<UserRankingResponse>>> {
        val rankings = practiceSessionService.getTopUsers(limit)
        return ResponseEntity.ok(CommonResponse(success = true, data = rankings))
    }

    @GetMapping("/analytics/user/{userId}/summary")
    fun getAnalyticsUserSummary(
        @PathVariable userId: Long,
        @RequestParam(required = false) from: LocalDateTime?,
        @RequestParam(required = false) to: LocalDateTime?
    ): ResponseEntity<CommonResponse<AnalyticsUserSummaryResponse>> {
        val summary = practiceSessionService.getAnalyticsUserSummary(userId, from, to)
        return if (summary != null) ResponseEntity.ok(CommonResponse(success = true, data = summary))
        else ResponseEntity.status(404).body(CommonResponse(success = false, error = "User analytics not found"))
    }

    @GetMapping("/analytics/session/{sessionId}/summary")
    fun getAnalyticsSessionSummary(@PathVariable sessionId: Long): ResponseEntity<CommonResponse<AnalyticsSessionSummaryResponse>> {
        val summary = practiceSessionService.getAnalyticsSessionSummary(sessionId)
        return if (summary != null) ResponseEntity.ok(CommonResponse(success = true, data = summary))
        else ResponseEntity.status(404).body(CommonResponse(success = false, error = "Session analytics not found"))
    }

    @GetMapping("/analytics/user/{userId}/trend")
    fun getAnalyticsUserTrend(
        @PathVariable userId: Long,
        @RequestParam(defaultValue = "week") period: String
    ): ResponseEntity<CommonResponse<AnalyticsUserTrendResponse>> {
        val trend = practiceSessionService.getAnalyticsUserTrend(userId, period)
        return if (trend != null) ResponseEntity.ok(CommonResponse(success = true, data = trend))
        else ResponseEntity.status(404).body(CommonResponse(success = false, error = "User trend not found"))
    }

    @GetMapping("/admin/summary")
    fun getAdminPracticeSummary(): ResponseEntity<CommonResponse<AdminPracticeSummaryResponse>> {
        val summary = practiceSessionService.getAdminPracticeSummary()
        return ResponseEntity.ok(CommonResponse(success = true, data = summary))
    }

    @GetMapping("/admin/users")
    fun getAdminUserSummaries(): ResponseEntity<CommonResponse<List<AdminUserSummary>>> {
        val users = practiceSessionService.getAdminUserSummaries()
        return ResponseEntity.ok(CommonResponse(success = true, data = users))
    }

    @GetMapping("/admin/sessions")
    fun getAdminSessionSummaries(): ResponseEntity<CommonResponse<List<AdminSessionSummary>>> {
        val sessions = practiceSessionService.getAdminSessionSummaries()
        return ResponseEntity.ok(CommonResponse(success = true, data = sessions))
    }

    @GetMapping("/admin/progress")
    fun getAdminProgressSummaries(): ResponseEntity<CommonResponse<List<AdminProgressSummary>>> {
        val progresses = practiceSessionService.getAdminProgressSummaries()
        return ResponseEntity.ok(CommonResponse(success = true, data = progresses))
    }
} 