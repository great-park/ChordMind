package com.chordmind.harmony.controller

import com.chordmind.harmony.domain.QuizType
import com.chordmind.harmony.service.AIExplanationService
import com.chordmind.harmony.service.AnalyticsService
import io.swagger.v3.oas.annotations.Operation
import io.swagger.v3.oas.annotations.tags.Tag
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*
import java.time.LocalDateTime

@RestController
@RequestMapping("/api/ai")
@Tag(name = "AI Features", description = "AI 기반 학습 기능 API")
class AIController(
    private val aiExplanationService: AIExplanationService,
    private val analyticsService: AnalyticsService
) {
    
    @PostMapping("/personalized-feedback")
    @Operation(summary = "개인화된 피드백 생성", description = "사용자의 학습 이력을 기반으로 개인화된 피드백을 생성합니다.")
    fun generatePersonalizedFeedback(
        @RequestParam userId: Long,
        @RequestParam questionType: QuizType,
        @RequestParam userAnswer: String,
        @RequestParam correctAnswer: String,
        @RequestParam isCorrect: Boolean
    ): ResponseEntity<Map<String, Any>> {
        try {
            // 사용자 이력 조회 (실제로는 데이터베이스에서 조회)
            val userHistory = getUserHistory(userId)
            
            val feedback = aiExplanationService.generatePersonalizedFeedback(
                userId = userId,
                questionType = questionType,
                userAnswer = userAnswer,
                correctAnswer = correctAnswer,
                isCorrect = isCorrect,
                userHistory = userHistory
            )
            
            return ResponseEntity.ok(mapOf(
                "feedback" to feedback,
                "timestamp" to LocalDateTime.now(),
                "userId" to userId
            ))
        } catch (e: Exception) {
            return ResponseEntity.badRequest().body(mapOf(
                "error" to "개인화된 피드백 생성에 실패했습니다.",
                "message" to (e.message ?: "알 수 없는 오류")
            ))
        }
    }
    
    @GetMapping("/learning-path/{userId}")
    @Operation(summary = "개인화된 학습 경로 생성", description = "사용자의 성과를 분석하여 맞춤형 학습 경로를 생성합니다.")
    fun generateLearningPath(@PathVariable userId: Long): ResponseEntity<Map<String, Any>> {
        try {
            val userStats = analyticsService.getUserStats(userId)
            val learningPath = aiExplanationService.generateLearningPath(userId, userStats)
            
            return ResponseEntity.ok(mapOf(
                "learningPath" to learningPath,
                "userId" to userId,
                "generatedAt" to LocalDateTime.now()
            ))
        } catch (e: Exception) {
            return ResponseEntity.badRequest().body(mapOf(
                "error" to "학습 경로 생성에 실패했습니다.",
                "message" to (e.message ?: "알 수 없는 오류")
            ))
        }
    }
    
    @PostMapping("/adaptive-question")
    @Operation(summary = "적응형 문제 생성", description = "사용자의 성과를 분석하여 적절한 난이도의 문제를 생성합니다.")
    fun generateAdaptiveQuestion(
        @RequestParam userId: Long,
        @RequestParam questionType: QuizType
    ): ResponseEntity<Map<String, Any>> {
        try {
            val userHistory = getUserHistory(userId)
            val adaptiveQuestion = aiExplanationService.generateAdaptiveQuestion(userHistory, questionType)
            
            return ResponseEntity.ok(mapOf(
                "adaptiveQuestion" to adaptiveQuestion,
                "userId" to userId,
                "generatedAt" to LocalDateTime.now()
            ))
        } catch (e: Exception) {
            return ResponseEntity.badRequest().body(mapOf(
                "error" to "적응형 문제 생성에 실패했습니다.",
                "message" to (e.message ?: "알 수 없는 오류")
            ))
        }
    }
    
    @GetMapping("/behavior-analysis/{userId}")
    @Operation(summary = "사용자 행동 분석", description = "사용자의 학습 패턴과 행동을 분석합니다.")
    fun analyzeUserBehavior(@PathVariable userId: Long): ResponseEntity<Map<String, Any>> {
        try {
            val userHistory = getUserHistory(userId)
            val behaviorAnalysis = aiExplanationService.analyzeUserBehavior(userHistory)
            
            return ResponseEntity.ok(mapOf(
                "behaviorAnalysis" to behaviorAnalysis,
                "userId" to userId,
                "analyzedAt" to LocalDateTime.now()
            ))
        } catch (e: Exception) {
            return ResponseEntity.badRequest().body(mapOf(
                "error" to "사용자 행동 분석에 실패했습니다.",
                "message" to (e.message ?: "알 수 없는 오류")
            ))
        }
    }
    
    @PostMapping("/smart-hints")
    @Operation(summary = "스마트 힌트 생성", description = "사용자의 성과와 문제 유형에 맞는 스마트 힌트를 생성합니다.")
    fun generateSmartHints(
        @RequestParam userId: Long,
        @RequestParam questionType: QuizType,
        @RequestParam difficulty: Int
    ): ResponseEntity<Map<String, Any>> {
        try {
            val userHistory = getUserHistory(userId)
            val userPerformance = aiExplanationService.analyzeUserPerformance(userHistory, questionType)
            
            // 사용자 성과에 따른 힌트 조정
            val baseHints = when (questionType) {
                QuizType.CHORD_NAME -> when (difficulty) {
                    1 -> listOf("3화음의 기본 구조를 생각해보세요", "장조는 밝고, 단조는 어둡습니다")
                    2 -> listOf("7화음의 구조를 분석해보세요", "서스펜션 코드의 특징을 기억하세요")
                    3 -> listOf("복합 화성의 구조를 파악하세요", "고급 화성학 이론을 적용하세요")
                    else -> emptyList()
                }
                QuizType.PROGRESSION -> when (difficulty) {
                    1 -> listOf("기본 화성 진행을 기억하세요", "I-IV-V 진행을 생각해보세요")
                    2 -> listOf("재즈 진행의 특징을 분석하세요", "2-5-1 진행을 기억하세요")
                    3 -> listOf("복합 화성 진행을 파악하세요", "고급 화성학 이론을 적용하세요")
                    else -> emptyList()
                }
                QuizType.INTERVAL -> when (difficulty) {
                    1 -> listOf("음정의 기본 개념을 기억하세요", "완전음정과 불완전음정을 구분하세요")
                    2 -> listOf("복합음정의 구조를 분석하세요", "화성적 기능을 고려하세요")
                    3 -> listOf("고급 음정 이론을 적용하세요", "색채적 기능을 분석하세요")
                    else -> emptyList()
                }
                QuizType.SCALE -> when (difficulty) {
                    1 -> listOf("음계의 기본 구조를 기억하세요", "장음계와 단음계를 구분하세요")
                    2 -> listOf("모드의 특징을 분석하세요", "색채적 기능을 고려하세요")
                    3 -> listOf("고급 스케일 이론을 적용하세요", "복합 스케일을 분석하세요")
                    else -> emptyList()
                }
            }
            
            // 사용자 성과에 따른 힌트 개수 조정
            val accuracy = userPerformance["accuracy"] as? Double ?: 0.0
            val adjustedHints = when {
                accuracy < 0.3 -> baseHints.take(3) // 더 많은 힌트
                accuracy < 0.6 -> baseHints.take(2) // 적당한 힌트
                else -> baseHints.take(1) // 최소한의 힌트
            }
            
            return ResponseEntity.ok(mapOf(
                "hints" to adjustedHints,
                "difficulty" to difficulty,
                "questionType" to questionType,
                "userAccuracy" to accuracy,
                "generatedAt" to LocalDateTime.now()
            ))
        } catch (e: Exception) {
            return ResponseEntity.badRequest().body(mapOf(
                "error" to "스마트 힌트 생성에 실패했습니다.",
                "message" to (e.message ?: "알 수 없는 오류")
            ))
        }
    }
    
    @GetMapping("/learning-recommendations/{userId}")
    @Operation(summary = "학습 추천 생성", description = "사용자의 성과를 분석하여 개인화된 학습 추천을 생성합니다.")
    fun generateLearningRecommendations(@PathVariable userId: Long): ResponseEntity<Map<String, Any>> {
        try {
            val userStats = analyticsService.getUserStats(userId)
            val weakestAreas = analyticsService.getWeakestAreas(userId)
            val recommendations = analyticsService.getRecommendations(userId)
            
            val learningStyle = determineLearningStyle(userStats)
            val nextSteps = generateNextSteps(weakestAreas, userStats)
            
            return ResponseEntity.ok(mapOf(
                "recommendations" to recommendations,
                "learningStyle" to learningStyle,
                "nextSteps" to nextSteps,
                "weakestAreas" to weakestAreas,
                "userId" to userId,
                "generatedAt" to LocalDateTime.now()
            ))
        } catch (e: Exception) {
            return ResponseEntity.badRequest().body(mapOf(
                "error" to "학습 추천 생성에 실패했습니다.",
                "message" to (e.message ?: "알 수 없는 오류")
            ))
        }
    }
    
    private fun getUserHistory(userId: Long): List<Map<String, Any>> {
        // 실제로는 데이터베이스에서 조회
        // 여기서는 샘플 데이터 반환
        return listOf(
            mapOf(
                "type" to QuizType.CHORD_NAME,
                "correct" to true,
                "timeSpent" to 30L,
                "difficulty" to 1
            ),
            mapOf(
                "type" to QuizType.PROGRESSION,
                "correct" to false,
                "timeSpent" to 45L,
                "difficulty" to 2
            ),
            mapOf(
                "type" to QuizType.INTERVAL,
                "correct" to true,
                "timeSpent" to 25L,
                "difficulty" to 1
            )
        )
    }
    
    private fun determineLearningStyle(userStats: Map<String, Any>): String {
        val accuracy = userStats["accuracy"] as? Double ?: 0.0
        val totalAttempts = userStats["totalAttempts"] as? Long ?: 0L
        
        return when {
            accuracy > 0.8 && totalAttempts > 50 -> "고급 학습자"
            accuracy > 0.6 && totalAttempts > 20 -> "중급 학습자"
            accuracy > 0.4 -> "초급 학습자"
            else -> "기초 학습자"
        }
    }
    
    private fun generateNextSteps(weakestAreas: List<Map<String, Any>>, userStats: Map<String, Any>): List<String> {
        val nextSteps = mutableListOf<String>()
        
        weakestAreas.forEach { area ->
            val type = area["type"] as? String ?: ""
            when (type) {
                "CHORD_NAME" -> nextSteps.add("코드 구성 원리 학습")
                "PROGRESSION" -> nextSteps.add("화성 진행 패턴 연습")
                "INTERVAL" -> nextSteps.add("음정 관계 이해")
                "SCALE" -> nextSteps.add("음계 구조 분석")
            }
        }
        
        val accuracy = userStats["accuracy"] as? Double ?: 0.0
        when {
            accuracy < 0.5 -> nextSteps.add("기본 개념 복습")
            accuracy < 0.7 -> nextSteps.add("중급 문제 연습")
            else -> nextSteps.add("고급 문제 도전")
        }
        
        return nextSteps
    }
} 