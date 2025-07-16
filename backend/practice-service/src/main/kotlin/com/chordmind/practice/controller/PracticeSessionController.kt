package com.chordmind.practice.controller

import com.chordmind.practice.dto.*
import com.chordmind.practice.service.PracticeSessionService
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/api/practice-sessions")
class PracticeSessionController(
    private val practiceSessionService: PracticeSessionService
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

    @PostMapping("/{sessionId}/end")
    fun endSession(@PathVariable sessionId: Long): ResponseEntity<PracticeSessionResponse> {
        val session = practiceSessionService.endSession(sessionId)
        return if (session != null) ResponseEntity.ok(session) else ResponseEntity.notFound().build()
    }

    @PostMapping("/{sessionId}/progress")
    fun addProgress(
        @PathVariable sessionId: Long,
        @RequestBody request: CreatePracticeProgressRequest
    ): ResponseEntity<PracticeProgressResponse> =
        ResponseEntity.ok(practiceSessionService.addProgress(request.copy(sessionId = sessionId)))

    @GetMapping("/{sessionId}/progress")
    fun getProgressBySession(@PathVariable sessionId: Long): ResponseEntity<List<PracticeProgressResponse>> =
        ResponseEntity.ok(practiceSessionService.getProgressBySession(sessionId))
} 