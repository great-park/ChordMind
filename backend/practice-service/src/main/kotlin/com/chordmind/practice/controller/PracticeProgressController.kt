package com.chordmind.practice.controller

import com.chordmind.practice.dto.CreatePracticeProgressRequest
import com.chordmind.practice.dto.PracticeProgressResponse
import com.chordmind.practice.dto.UpdatePracticeProgressRequest
import com.chordmind.practice.service.PracticeProgressService
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/api/practice-progress")
class PracticeProgressController(
    private val practiceProgressService: PracticeProgressService
) {
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