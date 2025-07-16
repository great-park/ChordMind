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
    fun getSessionSummary(@PathVariable sessionId: Long): ResponseEntity<PracticeSessionSummary> {
        val summary = practiceSessionService.getSessionSummary(sessionId)
        return if (summary != null) ResponseEntity.ok(summary) else ResponseEntity.notFound().build()
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
        @RequestParam(required = false) startedAtTo: LocalDateTime?
    ): ResponseEntity<List<PracticeSessionResponse>> {
        val request = PracticeSessionSearchRequest(userId, goal, status, startedAtFrom, startedAtTo)
        return ResponseEntity.ok(practiceSessionService.searchSessions(request))
    }
} 