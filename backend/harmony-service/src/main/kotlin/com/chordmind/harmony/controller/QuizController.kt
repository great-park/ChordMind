package com.chordmind.harmony.controller

import com.chordmind.harmony.domain.QuizType
import com.chordmind.harmony.dto.QuizAnswerRequest
import com.chordmind.harmony.dto.QuizAnswerResult
import com.chordmind.harmony.domain.QuizQuestion
import com.chordmind.harmony.service.QuizService
import org.springframework.web.bind.annotation.*

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
} 