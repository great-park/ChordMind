package com.chordmind.feedback.controller

import com.chordmind.feedback.dto.*
import com.chordmind.feedback.service.FeedbackService
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*
import java.time.LocalDateTime

@RestController
@RequestMapping("/api/feedback")
class FeedbackController(
    private val feedbackService: FeedbackService
) {

    // 피드백 생성
    @PostMapping
    fun createFeedback(
        @RequestHeader("X-User-ID") userId: Long,
        @RequestBody request: CreateFeedbackRequest
    ): ResponseEntity<ApiResponse<FeedbackResponse>> {
        val result = feedbackService.createFeedback(userId, request)
        return if (result.success) {
            ResponseEntity.ok(result)
        } else {
            ResponseEntity.badRequest().body(result)
        }
    }

    // 피드백 조회
    @GetMapping("/{feedbackId}")
    fun getFeedback(@PathVariable feedbackId: Long): ResponseEntity<ApiResponse<FeedbackResponse>> {
        val result = feedbackService.getFeedback(feedbackId)
        return if (result.success) {
            ResponseEntity.ok(result)
        } else {
            ResponseEntity.notFound().build()
        }
    }

    // 피드백 수정
    @PutMapping("/{feedbackId}")
    fun updateFeedback(
        @PathVariable feedbackId: Long,
        @RequestBody request: UpdateFeedbackRequest
    ): ResponseEntity<ApiResponse<FeedbackResponse>> {
        val result = feedbackService.updateFeedback(feedbackId, request)
        return if (result.success) {
            ResponseEntity.ok(result)
        } else {
            ResponseEntity.badRequest().body(result)
        }
    }

    // 피드백 해결
    @PostMapping("/{feedbackId}/resolve")
    fun resolveFeedback(
        @PathVariable feedbackId: Long,
        @RequestBody request: ResolveFeedbackRequest
    ): ResponseEntity<ApiResponse<FeedbackResponse>> {
        val result = feedbackService.resolveFeedback(feedbackId, request)
        return if (result.success) {
            ResponseEntity.ok(result)
        } else {
            ResponseEntity.badRequest().body(result)
        }
    }

    // 사용자별 피드백 목록 조회
    @GetMapping("/user/{userId}")
    fun getUserFeedbacks(
        @PathVariable userId: Long,
        @RequestParam(defaultValue = "0") page: Int,
        @RequestParam(defaultValue = "20") size: Int
    ): ResponseEntity<ApiResponse<FeedbackListResponse>> {
        val result = feedbackService.getUserFeedbacks(userId, page, size)
        return ResponseEntity.ok(result)
    }

    // 피드백 검색
    @GetMapping("/search")
    fun searchFeedbacks(
        @RequestParam(required = false) feedbackType: String?,
        @RequestParam(required = false) category: String?,
        @RequestParam(required = false) priority: String?,
        @RequestParam(required = false) status: String?,
        @RequestParam(required = false) rating: Int?,
        @RequestParam(required = false) keyword: String?,
        @RequestParam(required = false) fromDate: LocalDateTime?,
        @RequestParam(required = false) toDate: LocalDateTime?,
        @RequestParam(defaultValue = "0") page: Int,
        @RequestParam(defaultValue = "20") size: Int
    ): ResponseEntity<ApiResponse<FeedbackListResponse>> {
        val request = FeedbackSearchRequest(
            feedbackType = feedbackType?.let { com.chordmind.feedback.domain.FeedbackType.valueOf(it) },
            category = category,
            priority = priority?.let { com.chordmind.feedback.domain.FeedbackPriority.valueOf(it) },
            status = status?.let { com.chordmind.feedback.domain.FeedbackStatus.valueOf(it) },
            rating = rating,
            keyword = keyword,
            fromDate = fromDate,
            toDate = toDate
        )
        
        val result = feedbackService.searchFeedbacks(request, page, size)
        return ResponseEntity.ok(result)
    }

    // 피드백 통계 조회
    @GetMapping("/stats")
    fun getFeedbackStats(): ResponseEntity<ApiResponse<FeedbackStatsResponse>> {
        val result = feedbackService.getFeedbackStats()
        return ResponseEntity.ok(result)
    }

    // 사용자별 피드백 분석
    @GetMapping("/user/{userId}/analysis")
    fun getUserFeedbackAnalysis(@PathVariable userId: Long): ResponseEntity<ApiResponse<FeedbackAnalysisResponse>> {
        val result = feedbackService.getUserFeedbackAnalysis(userId)
        return ResponseEntity.ok(result)
    }

    // 피드백 삭제
    @DeleteMapping("/{feedbackId}")
    fun deleteFeedback(@PathVariable feedbackId: Long): ResponseEntity<ApiResponse<String>> {
        val result = feedbackService.deleteFeedback(feedbackId)
        return if (result.success) {
            ResponseEntity.ok(result)
        } else {
            ResponseEntity.badRequest().body(result)
        }
    }

    // 최근 피드백 조회
    @GetMapping("/recent")
    fun getRecentFeedbacks(
        @RequestParam(defaultValue = "10") limit: Int
    ): ResponseEntity<ApiResponse<List<FeedbackResponse>>> {
        val result = feedbackService.getRecentFeedbacks(limit)
        return ResponseEntity.ok(result)
    }

    // 상태별 피드백 개수 조회
    @GetMapping("/count/status/{status}")
    fun getFeedbackCountByStatus(
        @PathVariable status: String
    ): ResponseEntity<ApiResponse<Long>> {
        val feedbackStatus = com.chordmind.feedback.domain.FeedbackStatus.valueOf(status)
        val count = feedbackService.getFeedbackCountByStatus(feedbackStatus)
        return ResponseEntity.ok(ApiResponse.success(count))
    }

    // 피드백 타입별 목록 조회
    @GetMapping("/type/{feedbackType}")
    fun getFeedbacksByType(
        @PathVariable feedbackType: String,
        @RequestParam(defaultValue = "0") page: Int,
        @RequestParam(defaultValue = "20") size: Int
    ): ResponseEntity<ApiResponse<FeedbackListResponse>> {
        val type = com.chordmind.feedback.domain.FeedbackType.valueOf(feedbackType)
        val request = FeedbackSearchRequest(feedbackType = type)
        val result = feedbackService.searchFeedbacks(request, page, size)
        return ResponseEntity.ok(result)
    }

    // 우선순위별 피드백 목록 조회
    @GetMapping("/priority/{priority}")
    fun getFeedbacksByPriority(
        @PathVariable priority: String,
        @RequestParam(defaultValue = "0") page: Int,
        @RequestParam(defaultValue = "20") size: Int
    ): ResponseEntity<ApiResponse<FeedbackListResponse>> {
        val priorityEnum = com.chordmind.feedback.domain.FeedbackPriority.valueOf(priority)
        val request = FeedbackSearchRequest(priority = priorityEnum)
        val result = feedbackService.searchFeedbacks(request, page, size)
        return ResponseEntity.ok(result)
    }

    // 카테고리별 피드백 목록 조회
    @GetMapping("/category/{category}")
    fun getFeedbacksByCategory(
        @PathVariable category: String,
        @RequestParam(defaultValue = "0") page: Int,
        @RequestParam(defaultValue = "20") size: Int
    ): ResponseEntity<ApiResponse<FeedbackListResponse>> {
        val request = FeedbackSearchRequest(category = category)
        val result = feedbackService.searchFeedbacks(request, page, size)
        return ResponseEntity.ok(result)
    }
} 