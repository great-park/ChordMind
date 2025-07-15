package com.chordmind.user.controller

import com.chordmind.user.domain.User
import com.chordmind.user.domain.UserRole
import com.chordmind.user.dto.*
import com.chordmind.user.service.UserService
import com.fasterxml.jackson.databind.ObjectMapper
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Test
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest
import org.springframework.boot.test.mock.mockito.MockBean
import org.springframework.http.MediaType
import org.springframework.test.web.servlet.MockMvc
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*
import org.springframework.test.web.servlet.result.MockMvcResultMatchers.*
import java.time.LocalDateTime

@WebMvcTest(UserController::class)
class UserControllerTest {

    @Autowired
    private lateinit var mockMvc: MockMvc

    @MockBean
    private lateinit var userService: UserService

    @Autowired
    private lateinit var objectMapper: ObjectMapper

    private lateinit var testUser: User
    private lateinit var signUpRequest: SignUpRequest
    private lateinit var signInRequest: SignInRequest

    @BeforeEach
    fun setUp() {
        testUser = User(
            id = 1L,
            email = "test@example.com",
            password = "encodedPassword",
            name = "Test User",
            nickname = "testuser",
            role = UserRole.USER,
            createdAt = LocalDateTime.now(),
            updatedAt = LocalDateTime.now()
        )

        signUpRequest = SignUpRequest(
            email = "newuser@example.com",
            password = "password123",
            name = "New User",
            nickname = "newuser"
        )

        signInRequest = SignInRequest(
            email = "test@example.com",
            password = "password123"
        )
    }

    @Test
    fun `signUp should return 200 when successful`() {
        // Given
        val userResponse = UserResponse(
            id = 1L,
            email = signUpRequest.email,
            name = signUpRequest.name,
            nickname = signUpRequest.nickname,
            role = UserRole.USER,
            profileImageUrl = null,
            createdAt = LocalDateTime.now(),
            lastLoginAt = null
        )
        val apiResponse = ApiResponse.success(userResponse, "회원가입이 완료되었습니다.")

        // When & Then
        mockMvc.perform(
            post("/api/users/signup")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(signUpRequest))
        )
            .andExpect(status().isOk)
            .andExpect(jsonPath("$.success").value(true))
            .andExpect(jsonPath("$.data.email").value(signUpRequest.email))
            .andExpect(jsonPath("$.data.name").value(signUpRequest.name))
    }

    @Test
    fun `signUp should return 400 when email already exists`() {
        // Given
        val apiResponse = ApiResponse.error<UserResponse>("이미 존재하는 이메일입니다.")

        // When & Then
        mockMvc.perform(
            post("/api/users/signup")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(signUpRequest))
        )
            .andExpect(status().isBadRequest)
            .andExpect(jsonPath("$.success").value(false))
            .andExpect(jsonPath("$.message").value("이미 존재하는 이메일입니다."))
    }

    @Test
    fun `signIn should return 200 when successful`() {
        // Given
        val userResponse = UserResponse(
            id = 1L,
            email = signInRequest.email,
            name = "Test User",
            nickname = "testuser",
            role = UserRole.USER,
            profileImageUrl = null,
            createdAt = LocalDateTime.now(),
            lastLoginAt = LocalDateTime.now()
        )
        val signInResponse = SignInResponse("jwt-token", userResponse)
        val apiResponse = ApiResponse.success(signInResponse, "로그인이 완료되었습니다.")

        // When & Then
        mockMvc.perform(
            post("/api/users/signin")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(signInRequest))
        )
            .andExpect(status().isOk)
            .andExpect(jsonPath("$.success").value(true))
            .andExpect(jsonPath("$.data.token").value("jwt-token"))
            .andExpect(jsonPath("$.data.user.email").value(signInRequest.email))
    }

    @Test
    fun `signIn should return 400 when credentials are invalid`() {
        // Given
        val apiResponse = ApiResponse.error<SignInResponse>("비밀번호가 일치하지 않습니다.")

        // When & Then
        mockMvc.perform(
            post("/api/users/signin")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(signInRequest))
        )
            .andExpect(status().isBadRequest)
            .andExpect(jsonPath("$.success").value(false))
            .andExpect(jsonPath("$.message").value("비밀번호가 일치하지 않습니다."))
    }

    @Test
    fun `getUser should return 200 when user exists`() {
        // Given
        val userResponse = UserResponse(
            id = 1L,
            email = "test@example.com",
            name = "Test User",
            nickname = "testuser",
            role = UserRole.USER,
            profileImageUrl = null,
            createdAt = LocalDateTime.now(),
            lastLoginAt = null
        )
        val apiResponse = ApiResponse.success(userResponse)

        // When & Then
        mockMvc.perform(
            get("/api/users/1")
        )
            .andExpect(status().isOk)
            .andExpect(jsonPath("$.success").value(true))
            .andExpect(jsonPath("$.data.id").value(1))
            .andExpect(jsonPath("$.data.email").value("test@example.com"))
    }

    @Test
    fun `getUser should return 404 when user does not exist`() {
        // Given
        val apiResponse = ApiResponse.error<UserResponse>("사용자를 찾을 수 없습니다.")

        // When & Then
        mockMvc.perform(
            get("/api/users/999")
        )
            .andExpect(status().isNotFound)
    }

    @Test
    fun `updateUser should return 200 when successful`() {
        // Given
        val updateRequest = UpdateUserRequest(
            name = "Updated Name",
            nickname = "updatednick",
            profileImageUrl = "https://example.com/image.jpg"
        )
        val userResponse = UserResponse(
            id = 1L,
            email = "test@example.com",
            name = updateRequest.name!!,
            nickname = updateRequest.nickname,
            role = UserRole.USER,
            profileImageUrl = updateRequest.profileImageUrl,
            createdAt = LocalDateTime.now(),
            lastLoginAt = null
        )
        val apiResponse = ApiResponse.success(userResponse)

        // When & Then
        mockMvc.perform(
            put("/api/users/1")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(updateRequest))
        )
            .andExpect(status().isOk)
            .andExpect(jsonPath("$.success").value(true))
            .andExpect(jsonPath("$.data.name").value(updateRequest.name))
            .andExpect(jsonPath("$.data.nickname").value(updateRequest.nickname))
    }

    @Test
    fun `changePassword should return 200 when successful`() {
        // Given
        val changePasswordRequest = ChangePasswordRequest(
            currentPassword = "oldPassword",
            newPassword = "newPassword"
        )
        val apiResponse = ApiResponse.success("비밀번호가 성공적으로 변경되었습니다.")

        // When & Then
        mockMvc.perform(
            post("/api/users/1/change-password")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(changePasswordRequest))
        )
            .andExpect(status().isOk)
            .andExpect(jsonPath("$.success").value(true))
            .andExpect(jsonPath("$.data").value("비밀번호가 성공적으로 변경되었습니다."))
    }

    @Test
    fun `changePassword should return 400 when current password is incorrect`() {
        // Given
        val changePasswordRequest = ChangePasswordRequest(
            currentPassword = "wrongPassword",
            newPassword = "newPassword"
        )
        val apiResponse = ApiResponse.error<String>("현재 비밀번호가 일치하지 않습니다.")

        // When & Then
        mockMvc.perform(
            post("/api/users/1/change-password")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(changePasswordRequest))
        )
            .andExpect(status().isBadRequest)
            .andExpect(jsonPath("$.success").value(false))
            .andExpect(jsonPath("$.message").value("현재 비밀번호가 일치하지 않습니다."))
    }
} 