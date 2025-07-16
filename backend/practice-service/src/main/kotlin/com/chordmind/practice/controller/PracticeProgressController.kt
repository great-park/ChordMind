package com.chordmind.practice.controller

import com.chordmind.practice.dto.*
import com.chordmind.practice.service.PracticeProgressService
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*
import java.time.LocalDateTime

@RestController
@RequestMapping("/api/practice-progress")
class PracticeProgressController(
    private val practiceProgressService: PracticeProgressService
) {
    @GetMapping("/search")
    fun searchProgresses(
        @RequestParam(required = false) sessionId: Long?,
        @RequestParam(required = false) note: String?,
        @RequestParam(required = false) scoreMin: Int?,
        @RequestParam(required = false) scoreMax: Int?,
        @RequestParam(required = false) timestampFrom: LocalDateTime?,
        @RequestParam(required = false) timestampTo: LocalDateTime?
    ): ResponseEntity<List<PracticeProgressResponse>> {
        val request = PracticeProgressSearchRequest(sessionId, note, scoreMin, scoreMax, timestampFrom, timestampTo)
        return ResponseEntity.ok(practiceProgressService.searchProgresses(request))
    }

    @PostMapping
    fun addProgress(@RequestBody request: CreatePracticeProgressRequest): ResponseEntity<PracticeProgressResponse> =
        ResponseEntity.ok(practiceProgressService.addProgress(request))

    @GetMapping("/session/{sessionId}")
    fun getProgressBySession(@PathVariable sessionId: Long): ResponseEntity<List<PracticeProgressResponse>> =
        ResponseEntity.ok(practiceProgressService.getProgressBySession(sessionId))

    @PatchMapping("/{progressId}")
    fun updateProgress(
        @PathVariable progressId: Long,
        @RequestBody request: UpdatePracticeProgressRequest
    ): ResponseEntity<PracticeProgressResponse> {
        val updated = practiceProgressService.updateProgress(progressId, request)
        return if (updated != null) ResponseEntity.ok(updated) else ResponseEntity.notFound().build()
    }

    @DeleteMapping("/{progressId}")
    fun deleteProgress(@PathVariable progressId: Long): ResponseEntity<Void> {
        return if (practiceProgressService.deleteProgress(progressId)) {
            ResponseEntity.noContent().build()
        } else {
            ResponseEntity.notFound().build()
        }
    }
} 