package com.chordmind.harmony.controller

import com.chordmind.harmony.domain.QuizQuestion
import com.chordmind.harmony.domain.QuizType
import com.chordmind.harmony.dto.QuizQuestionRequest
import com.chordmind.harmony.service.AdminService
import com.chordmind.harmony.service.QuizGeneratorService
import io.swagger.v3.oas.annotations.Operation
import io.swagger.v3.oas.annotations.tags.Tag
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/api/admin/quiz")
@Tag(name = "Admin Quiz Management", description = "관리자용 퀴즈 문제 관리 API")
class AdminController(
    private val adminService: AdminService,
    private val quizGeneratorService: QuizGeneratorService
) {
    
    @PostMapping
    @Operation(summary = "퀴즈 문제 생성", description = "새로운 퀴즈 문제를 생성합니다.")
    fun createQuestion(@RequestBody request: QuizQuestionRequest): ResponseEntity<QuizQuestion> {
        val question = adminService.createQuestion(request)
        return ResponseEntity.ok(question)
    }
    
    @GetMapping
    @Operation(summary = "퀴즈 문제 목록 조회", description = "모든 퀴즈 문제를 조회합니다.")
    fun getAllQuestions(
        @RequestParam(required = false) type: QuizType?,
        @RequestParam(defaultValue = "0") page: Int,
        @RequestParam(defaultValue = "20") size: Int
    ): ResponseEntity<Map<String, Any>> {
        val result = adminService.getAllQuestions(type, page, size)
        return ResponseEntity.ok(result)
    }
    
    @GetMapping("/{id}")
    @Operation(summary = "퀴즈 문제 상세 조회", description = "특정 퀴즈 문제의 상세 정보를 조회합니다.")
    fun getQuestion(@PathVariable id: Long): ResponseEntity<QuizQuestion> {
        val question = adminService.getQuestion(id)
        return ResponseEntity.ok(question)
    }
    
    @PutMapping("/{id}")
    @Operation(summary = "퀴즈 문제 수정", description = "기존 퀴즈 문제를 수정합니다.")
    fun updateQuestion(
        @PathVariable id: Long,
        @RequestBody request: QuizQuestionRequest
    ): ResponseEntity<QuizQuestion> {
        val question = adminService.updateQuestion(id, request)
        return ResponseEntity.ok(question)
    }
    
    @DeleteMapping("/{id}")
    @Operation(summary = "퀴즈 문제 삭제", description = "퀴즈 문제를 삭제합니다.")
    fun deleteQuestion(@PathVariable id: Long): ResponseEntity<Unit> {
        adminService.deleteQuestion(id)
        return ResponseEntity.ok().build()
    }
    
    @PostMapping("/{id}/choices")
    @Operation(summary = "퀴즈 선택지 추가", description = "기존 퀴즈에 선택지를 추가합니다.")
    fun addChoice(
        @PathVariable id: Long,
        @RequestBody choiceText: String
    ): ResponseEntity<QuizQuestion> {
        val question = adminService.addChoice(id, choiceText)
        return ResponseEntity.ok(question)
    }
    
    @DeleteMapping("/{questionId}/choices/{choiceId}")
    @Operation(summary = "퀴즈 선택지 삭제", description = "퀴즈의 특정 선택지를 삭제합니다.")
    fun deleteChoice(
        @PathVariable questionId: Long,
        @PathVariable choiceId: Long
    ): ResponseEntity<QuizQuestion> {
        val question = adminService.deleteChoice(questionId, choiceId)
        return ResponseEntity.ok(question)
    }
    
    @PostMapping("/generate")
    @Operation(summary = "퀴즈 문제 자동 생성", description = "지정된 타입과 개수만큼 퀴즈 문제를 자동으로 생성합니다.")
    fun generateQuestions(
        @RequestParam type: QuizType,
        @RequestParam(defaultValue = "10") count: Int
    ): ResponseEntity<List<QuizQuestion>> {
        val questions = quizGeneratorService.generateAndSaveQuestions(type, count)
        return ResponseEntity.ok(questions)
    }
    
    @PostMapping("/generate/all")
    @Operation(summary = "모든 타입 퀴즈 문제 자동 생성", description = "모든 타입의 퀴즈 문제를 자동으로 생성합니다.")
    fun generateAllQuestions(
        @RequestParam(defaultValue = "5") countPerType: Int
    ): ResponseEntity<Map<String, List<QuizQuestion>>> {
        val result = mutableMapOf<String, List<QuizQuestion>>()
        
        QuizType.values().forEach { type ->
            val questions = quizGeneratorService.generateAndSaveQuestions(type, countPerType)
            result[type.name] = questions
        }
        
        return ResponseEntity.ok(result)
    }
} 