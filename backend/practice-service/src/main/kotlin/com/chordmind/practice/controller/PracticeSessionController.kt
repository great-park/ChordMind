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
} 