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
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    val status: UserStatus = UserStatus.ACTIVE,
    
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
    
    // 프라이버시 설정을 Enum으로 개선
    @Enumerated(EnumType.STRING)
    @Column(name = "profile_visibility")
    val profileVisibility: ProfileVisibility = ProfileVisibility.getDefault(),
    
    @Enumerated(EnumType.STRING)
    @Column(name = "activity_visibility")
    val activityVisibility: ActivityVisibility = ActivityVisibility.getDefault(),
    
    @Enumerated(EnumType.STRING)
    @Column(name = "contact_visibility")
    val contactVisibility: ContactVisibility = ContactVisibility.getDefault(),
    
    @Enumerated(EnumType.STRING)
    @Column(name = "security_level")
    val securityLevel: SecurityLevel = SecurityLevel.getDefault(),
    
    // 학습 설정을 Enum으로 개선
    @Enumerated(EnumType.STRING)
    @Column(name = "learning_style")
    val learningStyle: LearningStyle? = null, // AI가 분석 후 설정
    
    @Enumerated(EnumType.STRING)
    @Column(name = "difficulty_preference")
    val difficultyPreference: DifficultyPreference = DifficultyPreference.getDefault(),
    
    @Enumerated(EnumType.STRING)
    @Column(name = "session_length")
    val sessionLength: SessionLength = SessionLength.getDefault(),
    
    // 테마 설정을 Enum으로 개선
    @Enumerated(EnumType.STRING)
    @Column(name = "theme_mode")
    val themeMode: ThemeMode = ThemeMode.getDefault(),
    
    @Enumerated(EnumType.STRING)
    @Column(name = "color_scheme")
    val colorScheme: ColorScheme = ColorScheme.getDefault(),
    
    @Enumerated(EnumType.STRING)
    @Column(name = "font_size")
    val fontSize: FontSize = FontSize.getDefault(),
    
    @Enumerated(EnumType.STRING)
    @Column(name = "language")
    val language: Language = Language.getDefault(),
    
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