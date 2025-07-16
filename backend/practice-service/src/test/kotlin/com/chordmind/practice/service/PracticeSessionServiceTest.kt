package com.chordmind.practice.service

import com.chordmind.practice.domain.PracticeSession
import com.chordmind.practice.domain.PracticeProgress
import com.chordmind.practice.domain.SessionStatus
import com.chordmind.practice.dto.CreatePracticeSessionRequest
import com.chordmind.practice.dto.CreatePracticeProgressRequest
import com.chordmind.practice.repository.PracticeSessionRepository
import com.chordmind.practice.repository.PracticeProgressRepository
import org.junit.jupiter.api.Assertions.*
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.DisplayName
import org.mockito.kotlin.* // `mock`, `any`, `whenever`, `argForWhich`
import java.time.LocalDateTime
import java.util.*

class PracticeSessionServiceTest {
    private lateinit var sessionRepository: PracticeSessionRepository
    private lateinit var progressRepository: PracticeProgressRepository
    private lateinit var service: PracticeSessionService

    @BeforeEach
    fun setUp() {
        // Initialize mocks using Mockito-Kotlin's mock() function
        sessionRepository = mock()
        progressRepository = mock()
        // Pass the mocked repositories to the service
        service = PracticeSessionService(sessionRepository, progressRepository)
    }

    @Test
    fun `세션 생성`() {
        // Given
        val request = CreatePracticeSessionRequest(userId = 1L, goal = "코드 연습")
        // Define the fully initialized PracticeSession object that the repository.save() will return
        val savedSession = PracticeSession(
            id = 1L, // Simulate ID being assigned by the database
            userId = request.userId,
            startedAt = LocalDateTime.now(), // Use current time or a fixed time for consistency
            endedAt = null, // New session, so endedAt is null
            status = SessionStatus.IN_PROGRESS, // Default status
            goal = request.goal
        )
        // Stub the save method to return the predefined savedSession
        whenever(sessionRepository.save(any<PracticeSession>())).thenReturn(savedSession)

        // When
        val result = service.createSession(request)

        // Then
        assertNotNull(result) // Ensure the service returns a non-null object
        assertEquals(1L, result.id)
        assertEquals(1L, result.userId)
        assertEquals("코드 연습", result.goal)
        assertEquals(SessionStatus.IN_PROGRESS, result.status)
        assertNotNull(result.startedAt) // Check that startedAt is set
        assertNull(result.endedAt) // Check that endedAt is null for a new session

        // Verify that save was called with an object containing correct initial data
        verify(sessionRepository).save(argForWhich {
            this.userId == request.userId && this.goal == request.goal && this.status == SessionStatus.IN_PROGRESS && this.endedAt == null
        })
    }

    @Test
    fun `세션 단건 조회`() {
        // Given
        val session = PracticeSession(id = 2L, userId = 1L, goal = "즉흥 연주",
            startedAt = LocalDateTime.now(), endedAt = null, status = SessionStatus.IN_PROGRESS) // Fully initialized
        whenever(sessionRepository.findById(2L)).thenReturn(Optional.of(session))

        // When
        val result = service.getSession(2L)

        // Then
        assertNotNull(result)
        assertEquals(2L, result!!.id)
        assertEquals("즉흥 연주", result.goal)
        assertEquals(SessionStatus.IN_PROGRESS, result.status)
        assertNotNull(result.startedAt)
        assertNull(result.endedAt)
        verify(sessionRepository).findById(2L)
    }

    @Test
    fun `세션 단건 조회_사용자 없음`() {
        // Given
        whenever(sessionRepository.findById(99L)).thenReturn(Optional.empty())

        // When
        val result = service.getSession(99L)

        // Then
        assertNull(result) // Assuming getSession returns null if not found
        verify(sessionRepository).findById(99L)
    }

    @Test
    fun `세션 종료`() {
        // Given
        val session = PracticeSession(id = 3L, userId = 1L, goal = "스케일 연습",
            startedAt = LocalDateTime.now(), endedAt = null, status = SessionStatus.IN_PROGRESS) // Initial state
        // Mock findById to return the initial session
        whenever(sessionRepository.findById(3L)).thenReturn(Optional.of(session))

        // Define the PracticeSession object that the repository.save() will return after ending
        val completedSession = session.copy(
            status = SessionStatus.COMPLETED,
            endedAt = LocalDateTime.now() // Simulate endedAt being set
        )
        // Stub save to return the completed session
        whenever(sessionRepository.save(any<PracticeSession>())).thenReturn(completedSession)

        // When
        val result = service.endSession(3L)

        // Then
        assertNotNull(result)
        assertEquals(SessionStatus.COMPLETED, result!!.status)
        assertNotNull(result.endedAt) // Ensure endedAt is now set
        assertEquals(3L, result.id) // Ensure other properties are still correct

        // Verify save was called with the session having updated status and endedAt
        verify(sessionRepository).save(argForWhich {
            this.id == 3L && this.status == SessionStatus.COMPLETED && this.endedAt != null
        })
    }

    @Test
    fun `세션 종료_사용자 없음`() {
        // Given
        whenever(sessionRepository.findById(99L)).thenReturn(Optional.empty())

        // When
        val result = service.endSession(99L)

        // Then
        assertNull(result) // Assuming endSession returns null if session not found
        verify(sessionRepository).findById(99L)
        verify(sessionRepository, never()).save(any()) // Ensure save is not called
    }

    @Test
    fun `진행상황 기록 추가`() {
        // Given
        val request = CreatePracticeProgressRequest(sessionId = 1L, note = "오늘은 30분 연습", score = 90)
        // Define the fully initialized PracticeProgress object that the repository.save() will return
        val savedProgress = PracticeProgress(
            id = 10L, // Simulate ID being assigned
            sessionId = request.sessionId,
            timestamp = LocalDateTime.now(), // Default timestamp
            note = request.note,
            score = request.score
        )
        // Stub the save method to return the predefined savedProgress
        whenever(progressRepository.save(any<PracticeProgress>())).thenReturn(savedProgress)

        // When
        val result = service.addProgress(request)

        // Then
        assertNotNull(result) // Ensure the service returns a non-null object
        assertEquals(10L, result.id)
        assertEquals(1L, result.sessionId)
        assertEquals("오늘은 30분 연습", result.note)
        assertEquals(90, result.score)
        assertNotNull(result.timestamp) // Check that timestamp is set

        // Verify save was called with the correct initial data
        verify(progressRepository).save(argForWhich {
            this.sessionId == request.sessionId && this.note == request.note && this.score == request.score
        })
    }
}