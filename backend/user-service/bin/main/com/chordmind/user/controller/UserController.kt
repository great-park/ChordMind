package com.chordmind.user.controller

import com.chordmind.user.dto.*
import com.chordmind.user.service.UserService
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*
import java.time.LocalDateTime

@RestController
@RequestMapping("/api/users")
class UserController(
    private val userService: UserService
) {
    
    @PostMapping("/signup")
    fun signUp(@RequestBody request: SignUpRequest): ResponseEntity<ApiResponse<UserResponse>> {
        val result = userService.signUp(request)
        return if (result.success) {
            ResponseEntity.ok(result)
        } else {
            ResponseEntity.badRequest().body(result)
        }
    }
    
    @PostMapping("/signin")
    fun signIn(@RequestBody request: SignInRequest): ResponseEntity<ApiResponse<SignInResponse>> {
        val result = userService.signIn(request)
        return if (result.success) {
            ResponseEntity.ok(result)
        } else {
            ResponseEntity.badRequest().body(result)
        }
    }
    
    @GetMapping("/{userId}")
    fun getUser(@PathVariable userId: Long): ResponseEntity<ApiResponse<UserResponse>> {
        val result = userService.getUserById(userId)
        return if (result.success) {
            ResponseEntity.ok(result)
        } else {
            ResponseEntity.notFound().build()
        }
    }
    
    @PutMapping("/{userId}")
    fun updateUser(
        @PathVariable userId: Long,
        @RequestBody request: UpdateUserRequest
    ): ResponseEntity<ApiResponse<UserResponse>> {
        val result = userService.updateUser(userId, request)
        return if (result.success) {
            ResponseEntity.ok(result)
        } else {
            ResponseEntity.badRequest().body(result)
        }
    }
    
    @PostMapping("/{userId}/change-password")
    fun changePassword(
        @PathVariable userId: Long,
        @RequestBody request: ChangePasswordRequest
    ): ResponseEntity<ApiResponse<String>> {
        val result = userService.changePassword(userId, request)
        return if (result.success) {
            ResponseEntity.ok(result)
        } else {
            ResponseEntity.badRequest().body(result)
        }
    }
    
    // 새로운 기능들 추가
    
    @GetMapping("/{userId}/profile")
    fun getUserProfile(@PathVariable userId: Long): ResponseEntity<ApiResponse<UserProfileResponse>> {
        val result = userService.getUserProfile(userId)
        return if (result.success) {
            ResponseEntity.ok(result)
        } else {
            ResponseEntity.notFound().build()
        }
    }
    
    @PutMapping("/{userId}/profile")
    fun updateUserProfile(
        @PathVariable userId: Long,
        @RequestBody request: UpdateUserProfileRequest
    ): ResponseEntity<ApiResponse<UserProfileResponse>> {
        val result = userService.updateUserProfile(userId, request)
        return if (result.success) {
            ResponseEntity.ok(result)
        } else {
            ResponseEntity.badRequest().body(result)
        }
    }
    
    @GetMapping("/{userId}/settings")
    fun getUserSettings(@PathVariable userId: Long): ResponseEntity<ApiResponse<UserSettingsResponse>> {
        val result = userService.getUserSettings(userId)
        return if (result.success) {
            ResponseEntity.ok(result)
        } else {
            ResponseEntity.notFound().build()
        }
    }
    
    @PutMapping("/{userId}/settings")
    fun updateUserSettings(
        @PathVariable userId: Long,
        @RequestBody request: UpdateUserSettingsRequest
    ): ResponseEntity<ApiResponse<UserSettingsResponse>> {
        val result = userService.updateUserSettings(userId, request)
        return if (result.success) {
            ResponseEntity.ok(result)
        } else {
            ResponseEntity.badRequest().body(result)
        }
    }
    
    @GetMapping("/{userId}/stats")
    fun getUserStats(@PathVariable userId: Long): ResponseEntity<ApiResponse<UserStatsResponse>> {
        val result = userService.getUserStats(userId)
        return if (result.success) {
            ResponseEntity.ok(result)
        } else {
            ResponseEntity.notFound().build()
        }
    }
    
    @GetMapping("/search")
    fun searchUsers(
        @RequestParam(required = false) name: String?,
        @RequestParam(required = false) email: String?,
        @RequestParam(required = false) role: String?,
        @RequestParam(defaultValue = "0") page: Int,
        @RequestParam(defaultValue = "20") size: Int
    ): ResponseEntity<ApiResponse<PageResponse<UserResponse>>> {
        val request = UserSearchRequest(name, email, role)
        val result = userService.searchUsers(request, page, size)
        return ResponseEntity.ok(result)
    }
    
    @PostMapping("/{userId}/deactivate")
    fun deactivateUser(@PathVariable userId: Long): ResponseEntity<ApiResponse<String>> {
        val result = userService.deactivateUser(userId)
        return if (result.success) {
            ResponseEntity.ok(result)
        } else {
            ResponseEntity.badRequest().body(result)
        }
    }
    
    @PostMapping("/{userId}/activate")
    fun activateUser(@PathVariable userId: Long): ResponseEntity<ApiResponse<String>> {
        val result = userService.activateUser(userId)
        return if (result.success) {
            ResponseEntity.ok(result)
        } else {
            ResponseEntity.badRequest().body(result)
        }
    }
    
    @GetMapping("/{userId}/activity")
    fun getUserActivity(
        @PathVariable userId: Long,
        @RequestParam(required = false) from: LocalDateTime?,
        @RequestParam(required = false) to: LocalDateTime?
    ): ResponseEntity<ApiResponse<List<UserActivityResponse>>> {
        val result = userService.getUserActivity(userId, from, to)
        return if (result.success) {
            ResponseEntity.ok(result)
        } else {
            ResponseEntity.notFound().build()
        }
    }
} 