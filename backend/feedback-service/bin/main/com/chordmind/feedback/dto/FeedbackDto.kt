package com.chordmind.feedback.dto

import com.chordmind.feedback.domain.Feedback
import com.chordmind.feedback.domain.FeedbackPriority
import com.chordmind.feedback.domain.FeedbackStatus
import com.chordmind.feedback.domain.FeedbackType
import java.time.LocalDateTime

// 피드백 생성 요청
data class CreateFeedbackRequest(
    val sessionId: Long? = null,
    val feedbackType: FeedbackType,
    val category: String,
    val title: String,
    val content: String,
    val rating: Int? = null,
    val priority: FeedbackPriority = FeedbackPriority.MEDIUM,
    val tags: List<String>? = null,
    val metadata: Map<String, Any>? = null
)

// 피드백 수정 요청
data class UpdateFeedbackRequest(
    val title: String? = null,
    val content: String? = null,
    val rating: Int? = null,
    val priority: FeedbackPriority? = null,
    val status: FeedbackStatus? = null,
    val tags: List<String>? = null,
    val metadata: Map<String, Any>? = null
)

// 피드백 해결 요청
data class ResolveFeedbackRequest(
    val status: FeedbackStatus,
    val resolutionNotes: String? = null
)

// 피드백 응답
data class FeedbackResponse(
    val id: Long,
    val userId: Long,
    val sessionId: Long?,
    val feedbackType: FeedbackType,
    val category: String,
    val title: String,
    val content: String,
    val rating: Int?,
    val priority: FeedbackPriority,
    val status: FeedbackStatus,
    val tags: List<String>?,
    val metadata: Map<String, Any>?,
    val createdAt: LocalDateTime,
    val updatedAt: LocalDateTime,
    val resolvedAt: LocalDateTime?,
    val resolvedBy: Long?,
    val resolutionNotes: String?
)

// 피드백 목록 응답
data class FeedbackListResponse(
    val feedbacks: List<FeedbackResponse>,
    val totalElements: Long,
    val totalPages: Int,
    val currentPage: Int,
    val pageSize: Int
)

// 피드백 통계 응답
data class FeedbackStatsResponse(
    val totalFeedbacks: Long,
    val pendingFeedbacks: Long,
    val resolvedFeedbacks: Long,
    val averageRating: Double,
    val feedbacksByType: Map<FeedbackType, Long>,
    val feedbacksByPriority: Map<FeedbackPriority, Long>,
    val feedbacksByStatus: Map<FeedbackStatus, Long>,
    val recentFeedbacks: List<FeedbackResponse>
)

// 피드백 검색 요청
data class FeedbackSearchRequest(
    val feedbackType: FeedbackType? = null,
    val category: String? = null,
    val priority: FeedbackPriority? = null,
    val status: FeedbackStatus? = null,
    val rating: Int? = null,
    val tags: List<String>? = null,
    val fromDate: LocalDateTime? = null,
    val toDate: LocalDateTime? = null,
    val keyword: String? = null
)

// API 응답 래퍼
data class ApiResponse<T>(
    val success: Boolean,
    val message: String,
    val data: T? = null
) {
    companion object {
        fun <T> success(data: T, message: String = "Success") = ApiResponse(true, message, data)
        fun <T> error(message: String) = ApiResponse<T>(false, message)
    }
}

// 피드백 분석 응답
data class FeedbackAnalysisResponse(
    val userId: Long,
    val totalFeedbacks: Long,
    val averageRating: Double,
    val mostCommonType: FeedbackType,
    val mostCommonCategory: String,
    val satisfactionTrend: String, // "improving", "declining", "stable"
    val recentActivity: List<FeedbackActivity>
)

// 피드백 활동
data class FeedbackActivity(
    val feedbackId: Long,
    val action: String, // "created", "updated", "resolved"
    val timestamp: LocalDateTime,
    val details: String
)

// 피드백 템플릿
data class FeedbackTemplate(
    val id: String,
    val name: String,
    val description: String,
    val category: String,
    val fields: List<FeedbackField>,
    val isActive: Boolean
)

// 피드백 필드
data class FeedbackField(
    val name: String,
    val type: String, // "text", "number", "select", "textarea"
    val required: Boolean,
    val options: List<String>? = null,
    val placeholder: String? = null
)

// 피드백 알림 설정
data class FeedbackNotificationSettings(
    val userId: Long,
    val emailNotifications: Boolean = true,
    val pushNotifications: Boolean = true,
    val feedbackUpdates: Boolean = true,
    val resolutionNotifications: Boolean = true,
    val weeklyDigest: Boolean = false
) 