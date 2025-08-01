package com.chordmind.user.dto

import com.chordmind.user.domain.User
import com.chordmind.user.domain.UserRole
import java.time.LocalDateTime

// 회원가입 요청
data class SignUpRequest(
    val email: String,
    val password: String,
    val name: String,
    val nickname: String? = null
)

// 로그인 요청
data class SignInRequest(
    val email: String,
    val password: String
)

// 로그인 응답
data class SignInResponse(
    val token: String,
    val user: UserResponse
)

// 사용자 정보 응답
data class UserResponse(
    val id: Long,
    val email: String,
    val name: String,
    val nickname: String?,
    val role: UserRole,
    val profileImageUrl: String?,
    val createdAt: LocalDateTime,
    val lastLoginAt: LocalDateTime?
)

// 사용자 정보 수정 요청
data class UpdateUserRequest(
    val name: String? = null,
    val nickname: String? = null,
    val profileImageUrl: String? = null
)

// 비밀번호 변경 요청
data class ChangePasswordRequest(
    val currentPassword: String,
    val newPassword: String
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

// 새로운 기능들 추가

// 사용자 프로필 응답
data class UserProfileResponse(
    val id: Long,
    val email: String,
    val name: String,
    val nickname: String?,
    val profileImageUrl: String?,
    val bio: String?,
    val location: String?,
    val website: String?,
    val socialLinks: Map<String, String>?,
    val preferences: Map<String, Any>?,
    val createdAt: LocalDateTime,
    val updatedAt: LocalDateTime
)

// 사용자 프로필 수정 요청
data class UpdateUserProfileRequest(
    val name: String? = null,
    val nickname: String? = null,
    val profileImageUrl: String? = null,
    val bio: String? = null,
    val location: String? = null,
    val website: String? = null,
    val socialLinks: Map<String, String>? = null
)

// 사용자 설정 응답
data class UserSettingsResponse(
    val id: Long,
    val email: String,
    val notificationSettings: NotificationSettings,
    val privacySettings: PrivacySettings,
    val learningSettings: LearningSettings,
    val themeSettings: ThemeSettings,
    val updatedAt: LocalDateTime
)

// 사용자 설정 수정 요청
data class UpdateUserSettingsRequest(
    val notificationSettings: NotificationSettings? = null,
    val privacySettings: PrivacySettings? = null,
    val learningSettings: LearningSettings? = null,
    val themeSettings: ThemeSettings? = null
)

// 알림 설정
data class NotificationSettings(
    val emailNotifications: Boolean = true,
    val pushNotifications: Boolean = true,
    val practiceReminders: Boolean = true,
    val achievementNotifications: Boolean = true,
    val weeklyReports: Boolean = false
)

// 개인정보 설정
data class PrivacySettings(
    val profileVisibility: String = "public", // public, friends, private
    val showProgress: Boolean = true,
    val showAchievements: Boolean = true,
    val allowFriendRequests: Boolean = true
)

// 학습 설정
data class LearningSettings(
    val difficultyLevel: String = "intermediate", // beginner, intermediate, advanced
    val practiceGoal: Int = 30, // 분 단위
    val preferredTopics: List<String> = emptyList(),
    val autoProgress: Boolean = true
)

// 테마 설정
data class ThemeSettings(
    val theme: String = "light", // light, dark, auto
    val fontSize: String = "medium", // small, medium, large
    val colorScheme: String = "default" // default, high-contrast, colorblind-friendly
)

// 사용자 통계 응답
data class UserStatsResponse(
    val id: Long,
    val email: String,
    val totalPracticeTime: Long, // 분 단위
    val totalSessions: Int,
    val averageSessionTime: Double,
    val completionRate: Double,
    val improvementRate: Double,
    val streakDays: Int,
    val achievements: List<Achievement>,
    val lastUpdated: LocalDateTime
)

// 성취
data class Achievement(
    val id: String,
    val name: String,
    val description: String,
    val icon: String,
    val earnedAt: LocalDateTime
)

// 사용자 검색 요청
data class UserSearchRequest(
    val name: String? = null,
    val email: String? = null,
    val role: String? = null
)

// 페이징 응답
data class PageResponse<T>(
    val content: List<T>,
    val page: Int,
    val size: Int,
    val totalElements: Long,
    val totalPages: Int
)

// 사용자 활동 응답
data class UserActivityResponse(
    val id: Long,
    val activityType: String, // login, practice, achievement, etc.
    val description: String,
    val metadata: Map<String, Any>?,
    val timestamp: LocalDateTime
) 