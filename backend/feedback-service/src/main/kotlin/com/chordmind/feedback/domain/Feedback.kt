package com.chordmind.feedback.domain

import jakarta.persistence.*
import java.time.LocalDateTime

@Entity
@Table(name = "feedbacks")
data class Feedback(
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Long? = null,
    
    @Column(name = "user_id", nullable = false)
    val userId: Long,
    
    @Column(name = "session_id")
    val sessionId: Long? = null,
    
    @Enumerated(EnumType.STRING)
    @Column(name = "feedback_type", nullable = false)
    val feedbackType: FeedbackType,
    
    @Enumerated(EnumType.STRING)
    @Column(name = "category", nullable = false)
    val category: FeedbackCategory,
    
    @Column(name = "title", nullable = false)
    val title: String,
    
    @Column(name = "content", columnDefinition = "TEXT", nullable = false)
    val content: String,
    
    @Column(name = "rating")
    val rating: Int? = null, // 1-5 점수
    
    @Enumerated(EnumType.STRING)
    @Column(name = "priority", nullable = false)
    val priority: FeedbackPriority = FeedbackPriority.MEDIUM,
    
    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    val status: FeedbackStatus = FeedbackStatus.PENDING,
    
    @Enumerated(EnumType.STRING)
    @Column(name = "severity")
    val severity: FeedbackSeverity = FeedbackSeverity.getDefault(),
    
    @Enumerated(EnumType.STRING)
    @Column(name = "source")
    val source: FeedbackSource = FeedbackSource.getDefault(),
    
    @Enumerated(EnumType.STRING)
    @Column(name = "assignment_status")
    val assignmentStatus: AssignmentStatus = AssignmentStatus.UNASSIGNED,
    
    @Column(name = "tags")
    val tags: String? = null, // JSON 형태로 저장 (FeedbackTag enum 리스트)
    
    @Column(name = "metadata", columnDefinition = "JSONB")
    val metadata: String? = null, // JSON 형태로 저장
    
    @Column(name = "created_at", nullable = false)
    val createdAt: LocalDateTime = LocalDateTime.now(),
    
    @Column(name = "updated_at", nullable = false)
    val updatedAt: LocalDateTime = LocalDateTime.now(),
    
    @Column(name = "resolved_at")
    val resolvedAt: LocalDateTime? = null,
    
    @Column(name = "resolved_by")
    val resolvedBy: Long? = null,
    
    @Column(name = "resolution_notes", columnDefinition = "TEXT")
    val resolutionNotes: String? = null,
    
    @Enumerated(EnumType.STRING)
    @Column(name = "user_satisfaction")
    val userSatisfaction: FeedbackSatisfaction? = null, // 해결 후 사용자 만족도
    
    @Column(name = "estimated_effort_hours")
    val estimatedEffortHours: Double? = null, // 예상 작업 시간
    
    @Column(name = "actual_effort_hours")
    val actualEffortHours: Double? = null // 실제 작업 시간
)

enum class FeedbackType {
    BUG_REPORT,        // 버그 신고
    FEATURE_REQUEST,    // 기능 요청
    IMPROVEMENT,        // 개선 제안
    COMPLAINT,          // 불만 사항
    PRAISE,            // 칭찬
    QUESTION,          // 질문
    SUGGESTION         // 제안
}

enum class FeedbackPriority {
    LOW,        // 낮음
    MEDIUM,     // 보통
    HIGH,       // 높음
    URGENT      // 긴급
}

enum class FeedbackStatus {
    PENDING,    // 대기 중
    IN_PROGRESS, // 처리 중
    RESOLVED,   // 해결됨
    REJECTED,   // 거부됨
    CLOSED      // 종료됨
} 