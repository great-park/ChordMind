package com.chordmind.harmony.controller

import com.chordmind.harmony.dto.QuizResultRequest
import com.chordmind.harmony.dto.QuizResultResponse
import com.chordmind.harmony.dto.QuizRankingDto
import com.chordmind.harmony.service.QuizResultService
import org.springframework.format.annotation.DateTimeFormat
import org.springframework.web.bind.annotation.*
import java.time.LocalDateTime

@RestController
@RequestMapping("/api/harmony-quiz")
class QuizResultController(
    private val quizResultService: QuizResultService
) {
    @PostMapping("/result")
    fun saveResult(@RequestBody request: QuizResultRequest): QuizResultResponse =
        quizResultService.saveResult(request)

    @GetMapping("/rankings")
    fun getRankings(
        @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) from: LocalDateTime,
        @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) to: LocalDateTime
    ): List<QuizRankingDto> = quizResultService.getRankings(from, to)
} 