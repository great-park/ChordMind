package com.chordmind.gateway.controller

import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestMethod
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController
import java.time.LocalDateTime

@RestController
@RequestMapping("/fallback")
class FallbackController {

    @GetMapping("/practice")
    fun practiceFallback(): ResponseEntity<Map<String, Any>> {
        return ResponseEntity.ok(
            mapOf(
                "message" to "Practice service is temporarily unavailable",
                "timestamp" to LocalDateTime.now(),
                "service" to "practice-service"
            )
        )
    }

    @GetMapping("/analysis")
    fun analysisFallback(): ResponseEntity<Map<String, Any>> {
        return ResponseEntity.ok(
            mapOf(
                "message" to "AI Analysis service is temporarily unavailable",
                "timestamp" to LocalDateTime.now(),
                "service" to "ai-analysis-service"
            )
        )
    }

    @RequestMapping(value=["/users"], method=[RequestMethod.GET, RequestMethod.POST, RequestMethod.PUT, RequestMethod.DELETE, RequestMethod.PATCH, RequestMethod.OPTIONS])
    fun usersFallback(): ResponseEntity<Map<String, Any>> {
        return ResponseEntity.ok(
            mapOf(
                "message" to "User service is temporarily unavailable",
                "timestamp" to LocalDateTime.now(),
                "service" to "user-service"
            )
        )
    }

    @GetMapping("/feedback")
    fun feedbackFallback(): ResponseEntity<Map<String, Any>> {
        return ResponseEntity.ok(
            mapOf(
                "message" to "Feedback service is temporarily unavailable",
                "timestamp" to LocalDateTime.now(),
                "service" to "feedback-service"
            )
        )
    }

    @GetMapping("/games")
    fun gamesFallback(): ResponseEntity<Map<String, Any>> {
        return ResponseEntity.ok(
            mapOf(
                "message" to "Game service is temporarily unavailable",
                "timestamp" to LocalDateTime.now(),
                "service" to "game-service"
            )
        )
    }

    @GetMapping("/harmony")
    fun harmonyFallback(): ResponseEntity<Map<String, Any>> {
        return ResponseEntity.ok(
            mapOf(
                "message" to "Harmony service is temporarily unavailable",
                "timestamp" to LocalDateTime.now(),
                "service" to "harmony-service"
            )
        )
    }
} 