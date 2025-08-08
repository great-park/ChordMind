package com.chordmind.feedback.service

import com.chordmind.feedback.domain.Feedback
import com.chordmind.feedback.domain.FeedbackPriority
import com.chordmind.feedback.domain.FeedbackStatus
import com.chordmind.feedback.domain.FeedbackType
import com.chordmind.feedback.domain.FeedbackCategory
import com.chordmind.feedback.dto.*
import com.chordmind.feedback.repository.FeedbackRepository
import com.fasterxml.jackson.databind.ObjectMapper
import com.fasterxml.jackson.core.type.TypeReference
import org.springframework.data.domain.Page
import org.springframework.data.domain.PageRequest
import org.springframework.data.domain.Pageable
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import java.time.LocalDateTime

@Service
@Transactional
class FeedbackService(
    private val feedbackRepository: FeedbackRepository,
    private val objectMapper: ObjectMapper
) {

    // 피드백 생성
    fun createFeedback(userId: Long, request: CreateFeedbackRequest): ApiResponse<FeedbackResponse> {
        val categoryEnum: FeedbackCategory = enumValues<FeedbackCategory>()
            .find { it.name.equals(request.category, ignoreCase = true) || it.displayName == request.category }
            ?: FeedbackCategory.GENERAL
        val feedback = Feedback(
            userId = userId,
            sessionId = request.sessionId,
            feedbackType = request.feedbackType,
            category = categoryEnum,
            title = request.title,
            content = request.content,
            rating = request.rating,
            priority = request.priority,
            tags = request.tags?.let { objectMapper.writeValueAsString(it) },
            metadata = request.metadata?.let { objectMapper.writeValueAsString(it) }
        )
        
        val savedFeedback = feedbackRepository.save(feedback)
        return ApiResponse.success(savedFeedback.toFeedbackResponse())
    }

    // 피드백 조회
    fun getFeedback(feedbackId: Long): ApiResponse<FeedbackResponse> {
        val feedback = feedbackRepository.findById(feedbackId)
            .orElse(null) ?: return ApiResponse.error("피드백을 찾을 수 없습니다.")
        
        return ApiResponse.success(feedback.toFeedbackResponse())
    }

    // 피드백 수정
    fun updateFeedback(feedbackId: Long, request: UpdateFeedbackRequest): ApiResponse<FeedbackResponse> {
        val feedback = feedbackRepository.findById(feedbackId)
            .orElse(null) ?: return ApiResponse.error("피드백을 찾을 수 없습니다.")
        
        val updatedFeedback = feedback.copy(
            title = request.title ?: feedback.title,
            content = request.content ?: feedback.content,
            rating = request.rating,
            priority = request.priority ?: feedback.priority,
            status = request.status ?: feedback.status,
            tags = request.tags?.let { objectMapper.writeValueAsString(it) } ?: feedback.tags,
            metadata = request.metadata?.let { objectMapper.writeValueAsString(it) } ?: feedback.metadata,
            updatedAt = LocalDateTime.now()
        )
        
        val savedFeedback = feedbackRepository.save(updatedFeedback)
        return ApiResponse.success(savedFeedback.toFeedbackResponse())
    }

    // 피드백 해결
    fun resolveFeedback(feedbackId: Long, request: ResolveFeedbackRequest): ApiResponse<FeedbackResponse> {
        val feedback = feedbackRepository.findById(feedbackId)
            .orElse(null) ?: return ApiResponse.error("피드백을 찾을 수 없습니다.")
        
        val updatedFeedback = feedback.copy(
            status = request.status,
            resolutionNotes = request.resolutionNotes,
            resolvedAt = if (request.status in listOf(FeedbackStatus.RESOLVED, FeedbackStatus.CLOSED)) LocalDateTime.now() else null,
            updatedAt = LocalDateTime.now()
        )
        
        val savedFeedback = feedbackRepository.save(updatedFeedback)
        return ApiResponse.success(savedFeedback.toFeedbackResponse())
    }

    // 사용자별 피드백 목록 조회
    fun getUserFeedbacks(userId: Long, page: Int, size: Int): ApiResponse<FeedbackListResponse> {
        val pageable = PageRequest.of(page, size)
        val feedbacks = feedbackRepository.findByUserId(userId, pageable)
        
        val response = FeedbackListResponse(
            feedbacks = feedbacks.content.map { it.toFeedbackResponse() },
            totalElements = feedbacks.totalElements,
            totalPages = feedbacks.totalPages,
            currentPage = page,
            pageSize = size
        )
        
        return ApiResponse.success(response)
    }

    // 피드백 검색
    fun searchFeedbacks(request: FeedbackSearchRequest, page: Int, size: Int): ApiResponse<FeedbackListResponse> {
        val pageable = PageRequest.of(page, size)
        val feedbacks: Page<Feedback> = when {
            request.feedbackType != null -> feedbackRepository.findByFeedbackType(request.feedbackType, pageable)
            request.category != null -> feedbackRepository.findByCategory(request.category, pageable)
            request.priority != null -> feedbackRepository.findByPriority(request.priority, pageable)
            request.status != null -> feedbackRepository.findByStatus(request.status, pageable)
            request.fromDate != null && request.toDate != null -> 
                feedbackRepository.findByCreatedAtBetween(request.fromDate, request.toDate, pageable)
            request.keyword != null -> 
                feedbackRepository.findByUserIdAndKeyword(1L, request.keyword, pageable) // userId는 실제로는 인증에서 가져와야 함
            else -> feedbackRepository.findAll(pageable)
        }
        
        val response = FeedbackListResponse(
            feedbacks = feedbacks.content.map { it.toFeedbackResponse() },
            totalElements = feedbacks.totalElements,
            totalPages = feedbacks.totalPages,
            currentPage = page,
            pageSize = size
        )
        
        return ApiResponse.success(response)
    }

    // 피드백 통계 조회
    fun getFeedbackStats(): ApiResponse<FeedbackStatsResponse> {
        val totalFeedbacks = feedbackRepository.getTotalFeedbackCount()
        val pendingFeedbacks = feedbackRepository.getFeedbackCountByStatus(FeedbackStatus.PENDING)
        val resolvedFeedbacks = feedbackRepository.getFeedbackCountByStatus(FeedbackStatus.RESOLVED)
        val averageRating = feedbackRepository.getOverallAverageRating() ?: 0.0
        
        val recentFeedbacks = feedbackRepository.findTop10ByOrderByCreatedAtDesc()
            .map { it.toFeedbackResponse() }
        
        val stats = FeedbackStatsResponse(
            totalFeedbacks = totalFeedbacks,
            pendingFeedbacks = pendingFeedbacks,
            resolvedFeedbacks = resolvedFeedbacks,
            averageRating = averageRating,
            feedbacksByType = mapOf(), // 실제로는 집계 쿼리 결과를 매핑해야 함
            feedbacksByPriority = mapOf(), // 실제로는 집계 쿼리 결과를 매핑해야 함
            feedbacksByStatus = mapOf(), // 실제로는 집계 쿼리 결과를 매핑해야 함
            recentFeedbacks = recentFeedbacks
        )
        
        return ApiResponse.success(stats)
    }

    // 사용자별 피드백 분석
    fun getUserFeedbackAnalysis(userId: Long): ApiResponse<FeedbackAnalysisResponse> {
        val totalFeedbacks = feedbackRepository.countByUserId(userId)
        val averageRating = feedbackRepository.getAverageRatingByUserId(userId) ?: 0.0
        val recentFeedbacks = feedbackRepository.findTop10ByUserIdOrderByCreatedAtDesc(userId)
        
        val analysis = FeedbackAnalysisResponse(
            userId = userId,
            totalFeedbacks = totalFeedbacks,
            averageRating = averageRating,
            mostCommonType = FeedbackType.FEATURE_REQUEST, // 실제로는 집계 쿼리 결과를 사용해야 함
            mostCommonCategory = "일반", // 실제로는 집계 쿼리 결과를 사용해야 함
            satisfactionTrend = "stable", // 실제로는 시간별 분석을 해야 함
            recentActivity = recentFeedbacks.map { feedback ->
                FeedbackActivity(
                    feedbackId = feedback.id!!,
                    action = "created",
                    timestamp = feedback.createdAt,
                    details = "피드백 생성"
                )
            }
        )
        
        return ApiResponse.success(analysis)
    }

    // 피드백 삭제
    fun deleteFeedback(feedbackId: Long): ApiResponse<String> {
        val feedback = feedbackRepository.findById(feedbackId)
            .orElse(null) ?: return ApiResponse.error("피드백을 찾을 수 없습니다.")
        
        feedbackRepository.delete(feedback)
        return ApiResponse.success("피드백이 삭제되었습니다.")
    }

    // 피드백 상태별 개수 조회
    fun getFeedbackCountByStatus(status: FeedbackStatus): Long {
        return feedbackRepository.getFeedbackCountByStatus(status)
    }

    // 최근 피드백 조회
    fun getRecentFeedbacks(limit: Int = 10): ApiResponse<List<FeedbackResponse>> {
        val feedbacks = feedbackRepository.findTop10ByOrderByCreatedAtDesc()
            .take(limit)
            .map { it.toFeedbackResponse() }
        
        return ApiResponse.success(feedbacks)
    }

    private fun Feedback.toFeedbackResponse() = FeedbackResponse(
        id = id!!,
        userId = userId,
        sessionId = sessionId,
        feedbackType = feedbackType,
        category = category.name,
        title = title,
        content = content,
        rating = rating,
        priority = priority,
        status = status,
        tags = tags?.let { json ->
            object : TypeReference<List<String>>() {}
        }?.let { typeRef -> objectMapper.readValue(tags, typeRef) },
        metadata = metadata?.let { json ->
            object : TypeReference<Map<String, Any>>() {}
        }?.let { typeRef -> objectMapper.readValue(metadata, typeRef) },
        createdAt = createdAt,
        updatedAt = updatedAt,
        resolvedAt = resolvedAt,
        resolvedBy = resolvedBy,
        resolutionNotes = resolutionNotes
    )
} 