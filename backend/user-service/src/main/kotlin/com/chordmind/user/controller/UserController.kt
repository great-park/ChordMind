package com.chordmind.user.controller

import com.chordmind.user.dto.*
import com.chordmind.user.service.UserService
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*

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
} 