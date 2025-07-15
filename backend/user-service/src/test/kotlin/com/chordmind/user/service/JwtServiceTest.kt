package com.chordmind.user.service

import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.extension.ExtendWith
import org.mockito.InjectMocks
import org.mockito.junit.jupiter.MockitoExtension
import org.springframework.test.util.ReflectionTestUtils
import java.util.*

@ExtendWith(MockitoExtension::class)
class JwtServiceTest {

    @InjectMocks
    private lateinit var jwtService: JwtService

    private val testEmail = "test@example.com"
    private val testSecret = "chordmind-jwt-secret-key-2024-very-long-and-secure"
    private val testExpiration = 86400000L // 24시간

    @BeforeEach
    fun setUp() {
        ReflectionTestUtils.setField(jwtService, "secret", testSecret)
        ReflectionTestUtils.setField(jwtService, "expiration", testExpiration)
    }

    @Test
    fun `generateToken should create valid token`() {
        // When
        val token = jwtService.generateToken(testEmail)

        // Then
        assert(token.isNotEmpty())
        assert(jwtService.validateToken(token))
        assert(jwtService.extractEmail(token) == testEmail)
    }

    @Test
    fun `validateToken should return true for valid token`() {
        // Given
        val token = jwtService.generateToken(testEmail)

        // When
        val isValid = jwtService.validateToken(token)

        // Then
        assert(isValid)
    }

    @Test
    fun `validateToken should return false for invalid token`() {
        // Given
        val invalidToken = "invalid.token.here"

        // When
        val isValid = jwtService.validateToken(invalidToken)

        // Then
        assert(!isValid)
    }

    @Test
    fun `extractEmail should return correct email from valid token`() {
        // Given
        val token = jwtService.generateToken(testEmail)

        // When
        val extractedEmail = jwtService.extractEmail(token)

        // Then
        assert(extractedEmail == testEmail)
    }

    @Test
    fun `extractEmail should return null for invalid token`() {
        // Given
        val invalidToken = "invalid.token.here"

        // When
        val extractedEmail = jwtService.extractEmail(invalidToken)

        // Then
        assert(extractedEmail == null)
    }

    @Test
    fun `extractExpiration should return valid date from token`() {
        // Given
        val token = jwtService.generateToken(testEmail)

        // When
        val expiration = jwtService.extractExpiration(token)

        // Then
        assert(expiration != null)
        assert(expiration!!.after(Date()))
    }

    @Test
    fun `isTokenExpired should return false for valid token`() {
        // Given
        val token = jwtService.generateToken(testEmail)

        // When
        val isExpired = jwtService.isTokenExpired(token)

        // Then
        assert(!isExpired)
    }

    @Test
    fun `isTokenExpired should return true for invalid token`() {
        // Given
        val invalidToken = "invalid.token.here"

        // When
        val isExpired = jwtService.isTokenExpired(invalidToken)

        // Then
        assert(isExpired)
    }

    @Test
    fun `tokens should be unique for different emails`() {
        // Given
        val email1 = "user1@example.com"
        val email2 = "user2@example.com"

        // When
        val token1 = jwtService.generateToken(email1)
        val token2 = jwtService.generateToken(email2)

        // Then
        assert(token1 != token2)
        assert(jwtService.extractEmail(token1) == email1)
        assert(jwtService.extractEmail(token2) == email2)
    }
} 