package com.chordmind.harmony.controller

import com.chordmind.harmony.domain.QuizType
import com.chordmind.harmony.dto.*
import com.chordmind.harmony.domain.QuizQuestion
import com.chordmind.harmony.service.QuizService
import org.springframework.web.bind.annotation.*
import org.springframework.http.ResponseEntity
import jakarta.validation.Valid
import java.time.LocalDate

@RestController
@RequestMapping("/api/harmony-quiz")
class QuizController(
    private val quizService: QuizService
) {
    @GetMapping("/random")
    fun getRandomQuestions(
        @RequestParam type: QuizType = QuizType.CHORD_NAME,
        @RequestParam(defaultValue = "5") count: Int
    ): List<QuizQuestion> = quizService.getRandomQuestions(type, count)

    @PostMapping("/answer")
    fun checkAnswer(@RequestBody request: QuizAnswerRequest): QuizAnswerResult =
        quizService.checkAnswer(request)

    @PostMapping("/result")
    fun saveQuizResult(@RequestBody @Valid request: QuizResultRequest): ResponseEntity<QuizResultResponse> {
        val result = quizService.saveQuizResult(request)
        return ResponseEntity.ok(result)
    }

    @GetMapping("/rankings")
    fun getQuizRankings(
        @RequestParam from: String,
        @RequestParam to: String
    ): ResponseEntity<List<QuizRankingDto>> {
        val fromDate = LocalDate.parse(from)
        val toDate = LocalDate.parse(to)
        val rankings = quizService.getQuizRankings(fromDate, toDate)
        return ResponseEntity.ok(rankings)
    }
} 