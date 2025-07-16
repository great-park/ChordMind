package com.chordmind.user.service

import com.chordmind.user.domain.User
import com.chordmind.user.domain.UserRole
import com.chordmind.user.dto.*
import com.chordmind.user.repository.UserRepository
import org.springframework.security.crypto.password.PasswordEncoder
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import java.time.LocalDateTime

open class UserService(
    private val userRepository: UserRepository,
    private val passwordEncoder: PasswordEncoder,
    private val jwtService: JwtService
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
} 