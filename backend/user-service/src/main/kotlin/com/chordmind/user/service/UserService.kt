package com.chordmind.user.service

import com.chordmind.user.domain.User
import com.chordmind.user.domain.UserRole
import com.chordmind.user.dto.*
import com.chordmind.user.repository.UserRepository
import org.springframework.security.crypto.password.PasswordEncoder
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import java.time.LocalDateTime
import com.fasterxml.jackson.databind.ObjectMapper

@Service
open class UserService(
    private val userRepository: UserRepository,
    private val passwordEncoder: PasswordEncoder,
    private val jwtService: JwtService,
    private val objectMapper: ObjectMapper
) {
    
    fun signUp(request: SignUpRequest): ApiResponse<UserResponse> {
        // 이메일 중복 확인
        if (userRepository.existsByEmail(request.email)) {
            return ApiResponse.error("이미 존재하는 이메일입니다.")
        }
        
        // 비밀번호 암호화
        val encodedPassword = passwordEncoder.encode(request.password)
        
        // 사용자 생성
        val user = User(
            email = request.email,
            password = encodedPassword,
            name = request.name,
            nickname = request.nickname
        )
        
        val savedUser = userRepository.save(user)
        return ApiResponse.success(savedUser.toUserResponse())
    }
    
    fun signIn(request: SignInRequest): ApiResponse<SignInResponse> {
        val user = userRepository.findByEmailAndEnabled(request.email, true)
            .orElse(null) ?: return ApiResponse.error("존재하지 않는 사용자입니다.")
        
        // 비밀번호 확인
        if (!passwordEncoder.matches(request.password, user.password)) {
            return ApiResponse.error("비밀번호가 일치하지 않습니다.")
        }
        
        // 마지막 로그인 시간 업데이트
        val updatedUser = user.copy(lastLoginAt = LocalDateTime.now())
        userRepository.save(updatedUser)
        
        // JWT 토큰 생성
        val token = jwtService.generateToken(user.email)
        
        return ApiResponse.success(SignInResponse(token, updatedUser.toUserResponse()))
    }
    
    fun getUserById(userId: Long): ApiResponse<UserResponse> {
        val user = userRepository.findById(userId)
            .orElse(null) ?: return ApiResponse.error("사용자를 찾을 수 없습니다.")
        
        return ApiResponse.success(user.toUserResponse())
    }
    
    fun updateUser(userId: Long, request: UpdateUserRequest): ApiResponse<UserResponse> {
        val user = userRepository.findById(userId)
            .orElse(null) ?: return ApiResponse.error("사용자를 찾을 수 없습니다.")
        
        val updatedUser = user.copy(
            name = request.name ?: user.name,
            nickname = request.nickname,
            profileImageUrl = request.profileImageUrl,
            updatedAt = LocalDateTime.now()
        )
        
        val savedUser = userRepository.save(updatedUser)
        return ApiResponse.success(savedUser.toUserResponse())
    }
    
    fun changePassword(userId: Long, request: ChangePasswordRequest): ApiResponse<String> {
        val user = userRepository.findById(userId)
            .orElse(null) ?: return ApiResponse.error("사용자를 찾을 수 없습니다.")
        
        // 현재 비밀번호 확인
        if (!passwordEncoder.matches(request.currentPassword, user.password)) {
            return ApiResponse.error("현재 비밀번호가 일치하지 않습니다.")
        }
        
        // 새 비밀번호 암호화
        val encodedNewPassword = passwordEncoder.encode(request.newPassword)
        
        val updatedUser = user.copy(
            password = encodedNewPassword,
            updatedAt = LocalDateTime.now()
        )
        
        userRepository.save(updatedUser)
        return ApiResponse.success("비밀번호가 성공적으로 변경되었습니다.")
    }
    
    // 새로운 기능들 추가
    
    fun getUserProfile(userId: Long): ApiResponse<UserProfileResponse> {
        val user = userRepository.findById(userId)
            .orElse(null) ?: return ApiResponse.error("사용자를 찾을 수 없습니다.")
        
        return ApiResponse.success(user.toUserProfileResponse())
    }
    
    fun updateUserProfile(userId: Long, request: UpdateUserProfileRequest): ApiResponse<UserProfileResponse> {
        val user = userRepository.findById(userId)
            .orElse(null) ?: return ApiResponse.error("사용자를 찾을 수 없습니다.")
        
        val updatedUser = user.copy(
            name = request.name ?: user.name,
            nickname = request.nickname,
            profileImageUrl = request.profileImageUrl,
            bio = request.bio,
            location = request.location,
            website = request.website,
            socialLinks = request.socialLinks?.let { objectMapper.writeValueAsString(it) },
            updatedAt = LocalDateTime.now()
        )
        
        val savedUser = userRepository.save(updatedUser)
        return ApiResponse.success(savedUser.toUserProfileResponse())
    }
    
    fun getUserSettings(userId: Long): ApiResponse<UserSettingsResponse> {
        val user = userRepository.findById(userId)
            .orElse(null) ?: return ApiResponse.error("사용자를 찾을 수 없습니다.")
        
        return ApiResponse.success(user.toUserSettingsResponse())
    }
    
    fun updateUserSettings(userId: Long, request: UpdateUserSettingsRequest): ApiResponse<UserSettingsResponse> {
        val user = userRepository.findById(userId)
            .orElse(null) ?: return ApiResponse.error("사용자를 찾을 수 없습니다.")
        
        val updatedUser = user.copy(
            // 기존 JSON 설정은 유지하되, 새로운 Enum 필드들로 대체
            notificationSettings = request.notificationSettings?.let { objectMapper.writeValueAsString(it) } ?: user.notificationSettings,
            // 새로운 Enum 기반 설정들
            themeMode = request.themeMode ?: user.themeMode,
            colorScheme = request.colorScheme ?: user.colorScheme,
            fontSize = request.fontSize ?: user.fontSize,
            language = request.language ?: user.language,
            learningStyle = request.learningStyle ?: user.learningStyle,
            difficultyPreference = request.difficultyPreference ?: user.difficultyPreference,
            sessionLength = request.sessionLength ?: user.sessionLength,
            profileVisibility = request.profileVisibility ?: user.profileVisibility,
            activityVisibility = request.activityVisibility ?: user.activityVisibility,
            contactVisibility = request.contactVisibility ?: user.contactVisibility,
            securityLevel = request.securityLevel ?: user.securityLevel,
            updatedAt = LocalDateTime.now()
        )
        
        val savedUser = userRepository.save(updatedUser)
        return ApiResponse.success(savedUser.toUserSettingsResponse())
    }
    
    fun getUserStats(userId: Long): ApiResponse<UserStatsResponse> {
        val user = userRepository.findById(userId)
            .orElse(null) ?: return ApiResponse.error("사용자를 찾을 수 없습니다.")
        
        return ApiResponse.success(user.toUserStatsResponse())
    }
    
    fun searchUsers(request: UserSearchRequest, page: Int, size: Int): ApiResponse<PageResponse<UserResponse>> {
        val users = userRepository.searchUsers(request.name, request.email, request.role)
        val totalElements = users.size.toLong()
        val totalPages = if (size == 0) 1 else ((totalElements + size - 1) / size).toInt()
        val paged = if (size == 0) users else users.drop(page * size).take(size)
        
        val pageResponse = PageResponse(
            content = paged.map { it.toUserResponse() },
            page = page,
            size = size,
            totalElements = totalElements,
            totalPages = totalPages
        )
        
        return ApiResponse.success(pageResponse)
    }
    
    fun deactivateUser(userId: Long): ApiResponse<String> {
        val user = userRepository.findById(userId)
            .orElse(null) ?: return ApiResponse.error("사용자를 찾을 수 없습니다.")
        
        val updatedUser = user.copy(enabled = false, updatedAt = LocalDateTime.now())
        userRepository.save(updatedUser)
        
        return ApiResponse.success("사용자가 비활성화되었습니다.")
    }
    
    fun activateUser(userId: Long): ApiResponse<String> {
        val user = userRepository.findById(userId)
            .orElse(null) ?: return ApiResponse.error("사용자를 찾을 수 없습니다.")
        
        val updatedUser = user.copy(enabled = true, updatedAt = LocalDateTime.now())
        userRepository.save(updatedUser)
        
        return ApiResponse.success("사용자가 활성화되었습니다.")
    }
    
    fun getUserActivity(userId: Long, from: LocalDateTime?, to: LocalDateTime?): ApiResponse<List<UserActivityResponse>> {
        val user = userRepository.findById(userId)
            .orElse(null) ?: return ApiResponse.error("사용자를 찾을 수 없습니다.")
        
        // 실제로는 별도의 활동 테이블에서 조회해야 하지만, 여기서는 시뮬레이션
        val activities = listOf(
            UserActivityResponse(
                id = 1L,
                activityType = "login",
                description = "로그인",
                metadata = mapOf("ip" to "127.0.0.1"),
                timestamp = LocalDateTime.now()
            )
        )
        
        return ApiResponse.success(activities)
    }
    
    private fun User.toUserResponse() = UserResponse(
        id = id!!,
        email = email,
        name = name,
        nickname = nickname,
        role = role,
        profileImageUrl = profileImageUrl,
        createdAt = createdAt,
        lastLoginAt = lastLoginAt
    )
    
    private fun User.toUserProfileResponse() = UserProfileResponse(
        id = id!!,
        email = email,
        name = name,
        nickname = nickname,
        profileImageUrl = profileImageUrl,
        bio = bio,
        location = location,
        website = website,
        socialLinks = socialLinks?.let { objectMapper.readValue(it, Map::class.java) as Map<String, String> },
        preferences = preferences?.let { objectMapper.readValue(it, Map::class.java) as Map<String, Any> },
        createdAt = createdAt,
        updatedAt = updatedAt
    )
    
    private fun User.toUserSettingsResponse() = UserSettingsResponse(
        id = id!!,
        email = email,
        notificationSettings = notificationSettings?.let { objectMapper.readValue(it, NotificationSettings::class.java) } ?: NotificationSettings(),
        // 새로운 Enum 기반 설정들
        themeMode = themeMode,
        colorScheme = colorScheme,
        fontSize = fontSize,
        language = language,
        learningStyle = learningStyle,
        difficultyPreference = difficultyPreference,
        sessionLength = sessionLength,
        profileVisibility = profileVisibility,
        activityVisibility = activityVisibility,
        contactVisibility = contactVisibility,
        securityLevel = securityLevel,
        updatedAt = updatedAt
    )
    
    private fun User.toUserStatsResponse() = UserStatsResponse(
        id = id!!,
        email = email,
        totalPracticeTime = totalPracticeTime,
        totalSessions = totalSessions,
        averageSessionTime = averageSessionTime,
        completionRate = completionRate,
        improvementRate = improvementRate,
        streakDays = streakDays,
        achievements = emptyList(), // 실제로는 별도 테이블에서 조회
        lastUpdated = updatedAt
    )
} 