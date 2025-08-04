package com.chordmind.practice.domain

import jakarta.persistence.*
import java.time.LocalDateTime

@Entity
data class PracticeSession(
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Long? = null,
    
    val userId: Long,
    
    val startedAt: LocalDateTime = LocalDateTime.now(),
    val endedAt: LocalDateTime? = null,
    
    @Enumerated(EnumType.STRING)
    val status: PracticeSessionStatus = PracticeSessionStatus.NOT_STARTED,
    
    @Enumerated(EnumType.STRING)
    val sessionType: SessionType = SessionType.getDefault(),
    
    @Enumerated(EnumType.STRING)
    val difficulty: SessionDifficulty = SessionDifficulty.getDefault(),
    
    val goal: String? = null,
    val targetDurationMinutes: Int? = null,
    val actualDurationMinutes: Int? = null,
    
    @Enumerated(EnumType.STRING)
    val performanceGrade: PerformanceGrade? = null,
    
    val totalQuestions: Int = 0,
    val correctAnswers: Int = 0,
    val averageResponseTime: Double? = null, // 초 단위
    
    val notes: String? = null // 세션 후 메모
) {
    /**
     * 정확도 계산 (백분율)
     */
    val accuracyPercentage: Double
        get() = if (totalQuestions > 0) (correctAnswers.toDouble() / totalQuestions) * 100 else 0.0
    
    /**
     * 세션이 활성 상태인지 확인
     */
    val isActive: Boolean
        get() = status.isActive
    
    /**
     * 세션이 완료 상태인지 확인
     */
    val isCompleted: Boolean
        get() = status.isCompleted
    
    /**
     * 목표 시간 대비 실제 시간 비율
     */
    val timeEfficiency: Double?
        get() = if (targetDurationMinutes != null && actualDurationMinutes != null && targetDurationMinutes > 0) {
            actualDurationMinutes.toDouble() / targetDurationMinutes
        } else null
}

// 하위 호환성을 위한 기존 enum 유지
enum class SessionStatus { IN_PROGRESS, COMPLETED } 