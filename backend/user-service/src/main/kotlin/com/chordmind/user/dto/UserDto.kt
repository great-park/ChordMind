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