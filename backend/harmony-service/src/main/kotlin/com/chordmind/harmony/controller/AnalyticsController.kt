package com.chordmind.harmony.controller

import com.chordmind.harmony.service.AnalyticsService
import com.chordmind.harmony.service.analytics.dto.response.*
import io.swagger.v3.oas.annotations.Operation
import io.swagger.v3.oas.annotations.tags.Tag
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/api/analytics")
@Tag(name = "Analytics", description = "사용자 성과 분석 API")
class AnalyticsController(
    private val analyticsService: AnalyticsService
) {
    
    @GetMapping("/user/{userId}/stats")
    @Operation(summary = "사용자 통계 조회", description = "특정 사용자의 퀴즈 통계를 조회합니다.")
    fun getUserStats(@PathVariable userId: Long): ResponseEntity<UserStatsResponse> {
        val stats = analyticsService.getUserStats(userId)
        return ResponseEntity.ok(stats)
    }
    
    @GetMapping("/user/{userId}/progress")
    @Operation(summary = "사용자 진행 상황 조회", description = "특정 사용자의 진행 상황을 조회합니다.")
    fun getUserProgress(
        @PathVariable userId: Long,
        @RequestParam(defaultValue = "30") days: Int
    ): ResponseEntity<List<ProgressResponse>> {
        val progress = analyticsService.getUserProgress(userId, days)
        return ResponseEntity.ok(progress)
    }
    
    @GetMapping("/user/{userId}/difficulty")
    @Operation(summary = "난이도별 분석", description = "사용자의 난이도별 성과를 분석합니다.")
    fun getDifficultyAnalysis(@PathVariable userId: Long): ResponseEntity<DifficultyAnalysisResponse> {
        val analysis = analyticsService.getDifficultyAnalysis(userId)
        return ResponseEntity.ok(analysis)
    }
    
    @GetMapping("/user/{userId}/weakest-areas")
    @Operation(summary = "약점 영역 분석", description = "사용자의 약점 영역을 분석합니다.")
    fun getWeakestAreas(@PathVariable userId: Long): ResponseEntity<List<WeakAreaResponse>> {
        val areas = analyticsService.getWeakestAreas(userId)
        return ResponseEntity.ok(areas)
    }
    
    @GetMapping("/user/{userId}/recommendations")
    @Operation(summary = "학습 추천", description = "사용자에게 맞춤형 학습 추천을 제공합니다.")
    fun getRecommendations(@PathVariable userId: Long): ResponseEntity<List<String>> {
        val recommendations = analyticsService.getRecommendations(userId)
        return ResponseEntity.ok(recommendations)
    }
    
    @GetMapping("/global")
    @Operation(summary = "전체 통계", description = "전체 사용자의 통계를 조회합니다.")
    fun getGlobalStats(): ResponseEntity<GlobalStatsResponse> {
        val stats = analyticsService.getGlobalStats()
        return ResponseEntity.ok(stats)
    }
    
    @GetMapping("/user/{userId}/study-plan")
    @Operation(summary = "학습 계획 생성", description = "사용자의 약점을 기반으로 학습 계획을 생성합니다.")
    fun getStudyPlan(@PathVariable userId: Long): ResponseEntity<StudyPlanResponse> {
        val plan = analyticsService.getStudyPlan(userId)
        return ResponseEntity.ok(plan)
    }
    
    @GetMapping("/user/{userId}/trends")
    @Operation(summary = "학습 트렌드 분석", description = "사용자의 학습 트렌드를 분석합니다.")
    fun getLearningTrends(
        @PathVariable userId: Long,
        @RequestParam(defaultValue = "30") days: Int
    ): ResponseEntity<LearningTrendsResponse> {
        val trends = analyticsService.getLearningTrends(userId, days)
        return ResponseEntity.ok(trends)
    }
} 