package com.chordmind.user.domain

import jakarta.persistence.*
import java.time.LocalDateTime

data class User(
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Long? = null,
    
    @Column(unique = true, nullable = false)
    val email: String,
    
    @Column(nullable = false)
    val password: String,
    
    @Column(nullable = false)
    val name: String,
    
    @Column(name = "nickname")
    val nickname: String? = null,
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    val role: UserRole = UserRole.USER,
    
    @Column(name = "profile_image_url")
    val profileImageUrl: String? = null,
    
    @Column(name = "created_at", nullable = false)
    val createdAt: LocalDateTime = LocalDateTime.now(),
    
    @Column(name = "updated_at", nullable = false)
    val updatedAt: LocalDateTime = LocalDateTime.now(),
    
    @Column(name = "last_login_at")
    val lastLoginAt: LocalDateTime? = null,
    
    @Column(nullable = false)
    val enabled: Boolean = true,
    
    // 새로운 필드들 추가
    
    @Column(name = "bio", columnDefinition = "TEXT")
    val bio: String? = null,
    
    @Column(name = "location")
    val location: String? = null,
    
    @Column(name = "website")
    val website: String? = null,
    
    @Column(name = "social_links", columnDefinition = "JSONB")
    val socialLinks: String? = null, // JSON 형태로 저장
    
    @Column(name = "preferences", columnDefinition = "JSONB")
    val preferences: String? = null, // JSON 형태로 저장
    
    @Column(name = "notification_settings", columnDefinition = "JSONB")
    val notificationSettings: String? = null, // JSON 형태로 저장
    
    @Column(name = "privacy_settings", columnDefinition = "JSONB")
    val privacySettings: String? = null, // JSON 형태로 저장
    
    @Column(name = "learning_settings", columnDefinition = "JSONB")
    val learningSettings: String? = null, // JSON 형태로 저장
    
    @Column(name = "theme_settings", columnDefinition = "JSONB")
    val themeSettings: String? = null, // JSON 형태로 저장
    
    @Column(name = "total_practice_time")
    val totalPracticeTime: Long = 0, // 분 단위
    
    @Column(name = "total_sessions")
    val totalSessions: Int = 0,
    
    @Column(name = "average_session_time")
    val averageSessionTime: Double = 0.0,
    
    @Column(name = "completion_rate")
    val completionRate: Double = 0.0,
    
    @Column(name = "improvement_rate")
    val improvementRate: Double = 0.0,
    
    @Column(name = "streak_days")
    val streakDays: Int = 0,
    
    @Column(name = "last_activity_at")
    val lastActivityAt: LocalDateTime? = null
)

enum class UserRole {
    USER, ADMIN
} 