package com.chordmind.user.service

import com.chordmind.user.domain.User
import com.chordmind.user.domain.UserRole
import com.chordmind.user.dto.*
import com.chordmind.user.repository.UserRepository
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.extension.ExtendWith
import org.mockito.InjectMocks
import org.mockito.Mock
import org.mockito.junit.jupiter.MockitoExtension
import org.mockito.kotlin.*
import org.springframework.security.crypto.password.PasswordEncoder
import java.time.LocalDateTime
import java.util.Optional
import com.fasterxml.jackson.databind.ObjectMapper

@ExtendWith(MockitoExtension::class)
class UserServiceTest {

    @Mock
    private lateinit var userRepository: UserRepository
    @Mock
    private lateinit var passwordEncoder: PasswordEncoder
    @Mock
    private lateinit var jwtService: JwtService
    @Mock
    private lateinit var objectMapper: ObjectMapper
    @InjectMocks
    private lateinit var userService: UserService

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
        // save(any<User>()) stubbing 제거
    }

    @Test
    fun `signUp should create new user successfully`() {
        // Given
        whenever(userRepository.existsByEmail(signUpRequest.email)).thenReturn(false)
        whenever(passwordEncoder.encode(signUpRequest.password)).thenReturn("encodedPassword")
        whenever(userRepository.save(any<User>())).thenAnswer { invocation ->
            val user = invocation.getArgument<User>(0)
            user.copy(id = 1L)
        }

        // When
        val result = userService.signUp(signUpRequest)

        // Then
        assert(result.success)
        assert(result.data != null)
        assert(result.data!!.email == signUpRequest.email)
        assert(result.data!!.name == signUpRequest.name)
        verify(userRepository).existsByEmail(signUpRequest.email)
        verify(passwordEncoder).encode(signUpRequest.password)
        verify(userRepository).save(any<User>())
    }

    @Test
    fun `signUp should fail when email already exists`() {
        // Given
        whenever(userRepository.existsByEmail(signUpRequest.email)).thenReturn(true)

        // When
        val result = userService.signUp(signUpRequest)

        // Then
        assert(!result.success)
        assert(result.message == "이미 존재하는 이메일입니다.")

        verify(userRepository).existsByEmail(signUpRequest.email)
        verify(userRepository, never()).save(any())
    }

    @Test
    fun `signIn should succeed with valid credentials`() {
        // Given
        whenever(userRepository.findByEmailAndEnabled(signInRequest.email, true))
            .thenReturn(java.util.Optional.of(testUser))
        whenever(passwordEncoder.matches(signInRequest.password, testUser.password))
            .thenReturn(true)
        whenever(jwtService.generateToken(testUser.email)).thenReturn("jwt-token")
        whenever(userRepository.save(any<User>())).thenReturn(testUser)

        // When
        val result = userService.signIn(signInRequest)

        // Then
        assert(result.success)
        assert(result.data != null)
        assert(result.data!!.token == "jwt-token")
        assert(result.data!!.user.email == testUser.email)

        verify(userRepository).findByEmailAndEnabled(signInRequest.email, true)
        verify(passwordEncoder).matches(signInRequest.password, testUser.password)
        verify(jwtService).generateToken(testUser.email)
        verify(userRepository).save(any<User>())
    }

    @Test
    fun `signIn should fail when user does not exist`() {
        // Given
        whenever(userRepository.findByEmailAndEnabled(signInRequest.email, true))
            .thenReturn(java.util.Optional.empty())

        // When
        val result = userService.signIn(signInRequest)

        // Then
        assert(!result.success)
        assert(result.message == "존재하지 않는 사용자입니다.")

        verify(userRepository).findByEmailAndEnabled(signInRequest.email, true)
        verify(passwordEncoder, never()).matches(any(), any())
    }

    @Test
    fun `signIn should fail when password is incorrect`() {
        // Given
        whenever(userRepository.findByEmailAndEnabled(signInRequest.email, true))
            .thenReturn(java.util.Optional.of(testUser))
        whenever(passwordEncoder.matches(signInRequest.password, testUser.password))
            .thenReturn(false)

        // When
        val result = userService.signIn(signInRequest)

        // Then
        assert(!result.success)
        assert(result.message == "비밀번호가 일치하지 않습니다.")

        verify(userRepository).findByEmailAndEnabled(signInRequest.email, true)
        verify(passwordEncoder).matches(signInRequest.password, testUser.password)
        verify(jwtService, never()).generateToken(any())
    }

    @Test
    fun `getUserById should return user when exists`() {
        // Given
        whenever(userRepository.findById(1L)).thenReturn(java.util.Optional.of(testUser))

        // When
        val result = userService.getUserById(1L)

        // Then
        assert(result.success)
        assert(result.data != null)
        assert(result.data!!.id == testUser.id)
        assert(result.data!!.email == testUser.email)

        verify(userRepository).findById(1L)
    }

    @Test
    fun `getUserById should fail when user does not exist`() {
        // Given
        whenever(userRepository.findById(1L)).thenReturn(java.util.Optional.empty())

        // When
        val result = userService.getUserById(1L)

        // Then
        assert(!result.success)
        assert(result.message == "사용자를 찾을 수 없습니다.")

        verify(userRepository).findById(1L)
    }

    @Test
    fun `updateUser should update user successfully`() {
        // Given
        val updateRequest = UpdateUserRequest(
            name = "Updated Name",
            nickname = "updatednick",
            profileImageUrl = "https://example.com/image.jpg"
        )

        whenever(userRepository.findById(1L)).thenReturn(java.util.Optional.of(testUser))
        whenever(userRepository.save(any<User>())).thenReturn(testUser.copy(
            name = updateRequest.name!!,
            nickname = updateRequest.nickname,
            profileImageUrl = updateRequest.profileImageUrl
        ))

        // When
        val result = userService.updateUser(1L, updateRequest)

        // Then
        assert(result.success)
        assert(result.data != null)

        verify(userRepository).findById(1L)
        verify(userRepository).save(any<User>())
    }

    @Test
    fun `changePassword should succeed with correct current password`() {
        // Given
        val changePasswordRequest = ChangePasswordRequest(
            currentPassword = "oldPassword",
            newPassword = "newPassword"
        )

        whenever(userRepository.findById(1L)).thenReturn(java.util.Optional.of(testUser))
        whenever(passwordEncoder.matches(changePasswordRequest.currentPassword, testUser.password))
            .thenReturn(true)
        whenever(passwordEncoder.encode(changePasswordRequest.newPassword))
            .thenReturn("encodedNewPassword")
        whenever(userRepository.save(any<User>())).thenAnswer { invocation ->
            val user = invocation.getArgument<User>(0)
            user.copy(id = 1L)
        }

        // When
        val result = userService.changePassword(1L, changePasswordRequest)

        // Then
        assert(result.success)
        assert(result.data == "비밀번호가 성공적으로 변경되었습니다.")

        verify(userRepository).findById(1L)
        verify(passwordEncoder).matches(changePasswordRequest.currentPassword, testUser.password)
        verify(passwordEncoder).encode(changePasswordRequest.newPassword)
        verify(userRepository).save(any<User>())
    }

    @Test
    fun `changePassword should fail with incorrect current password`() {
        // Given
        val changePasswordRequest = ChangePasswordRequest(
            currentPassword = "wrongPassword",
            newPassword = "newPassword"
        )

        whenever(userRepository.findById(1L)).thenReturn(java.util.Optional.of(testUser))
        whenever(passwordEncoder.matches(changePasswordRequest.currentPassword, testUser.password))
            .thenReturn(false)

        // When
        val result = userService.changePassword(1L, changePasswordRequest)

        // Then
        assert(!result.success)
        assert(result.message == "현재 비밀번호가 일치하지 않습니다.")

        verify(userRepository).findById(1L)
        verify(passwordEncoder).matches(changePasswordRequest.currentPassword, testUser.password)
        verify(passwordEncoder, never()).encode(any())
        verify(userRepository, never()).save(any())
    }
}