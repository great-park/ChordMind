package com.chordmind.user.service

import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Test
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.test.context.TestPropertySource
import org.springframework.test.util.ReflectionTestUtils
import java.util.*

@SpringBootTest
@TestPropertySource(properties = [
    "jwt.secret=test-jwt-secret-key-for-testing-only",
    "jwt.expiration=3600000"
])
class JwtServiceTest {
    
    private lateinit var jwtService: JwtService

    private val testEmail = "test@example.com"
    private val testSecret = "test-jwt-secret-key-for-testing-only"
    private val testExpiration = 3600000L // 1시간

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
} 