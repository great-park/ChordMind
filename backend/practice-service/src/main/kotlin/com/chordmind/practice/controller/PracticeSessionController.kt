package com.chordmind.practice.controller

import com.chordmind.practice.dto.*
import com.chordmind.practice.service.PracticeSessionService
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/api/v1/practice-sessions")
class PracticeSessionController(
    private val practiceSessionService: PracticeSessionService
) {
    
    @PostMapping
    fun createPracticeSession(@RequestBody request: CreatePracticeSessionRequest): ResponseEntity<PracticeSessionResponse> {
        val response = practiceSessionService.createPracticeSession(request)
        return ResponseEntity.ok(response)
    }
    
    @PutMapping("/{sessionId}")
    fun updatePracticeSession(
        @PathVariable sessionId: Long,
        @RequestBody request: UpdatePracticeSessionRequest
    ): ResponseEntity<PracticeSessionResponse> {
        val response = practiceSessionService.updatePracticeSession(sessionId, request)
        return ResponseEntity.ok(response)
    }
    
    @GetMapping("/{sessionId}")
    fun getPracticeSession(@PathVariable sessionId: Long): ResponseEntity<PracticeSessionResponse> {
        val response = practiceSessionService.getPracticeSession(sessionId)
        return ResponseEntity.ok(response)
    }
    
    @GetMapping("/user/{userId}")
    fun getUserPracticeSessions(@PathVariable userId: Long): ResponseEntity<List<PracticeSessionSummary>> {
        val sessions = practiceSessionService.getUserPracticeSessions(userId)
        return ResponseEntity.ok(sessions)
    }
    
    @GetMapping("/user/{userId}/completed")
    fun getUserCompletedSessions(@PathVariable userId: Long): ResponseEntity<List<PracticeSessionSummary>> {
        val sessions = practiceSessionService.getUserCompletedSessions(userId)
        return ResponseEntity.ok(sessions)
    }
    
    @GetMapping("/user/{userId}/song/{songId}")
    fun getSongPracticeSessions(
        @PathVariable userId: Long,
        @PathVariable songId: String
    ): ResponseEntity<List<PracticeSessionSummary>> {
        val sessions = practiceSessionService.getSongPracticeSessions(userId, songId)
        return ResponseEntity.ok(sessions)
    }
    
    @GetMapping("/user/{userId}/stats")
    fun getUserStats(@PathVariable userId: Long): ResponseEntity<UserPracticeStats> {
        val stats = practiceSessionService.getUserStats(userId)
        return ResponseEntity.ok(stats)
    }
    
    @GetMapping("/health")
    fun health(): ResponseEntity<Map<String, String>> {
        return ResponseEntity.ok(mapOf("status" to "UP", "service" to "practice-service"))
    }
} 