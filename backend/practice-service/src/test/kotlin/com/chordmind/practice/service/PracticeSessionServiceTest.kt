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
import org.mockito.kotlin.*
import java.time.LocalDateTime
import java.util.*

class PracticeSessionServiceTest {
    private lateinit var sessionRepository: PracticeSessionRepository
    private lateinit var progressRepository: PracticeProgressRepository
    private lateinit var service: PracticeSessionService

    @BeforeEach
    fun setUp() {
        sessionRepository = mock()
        service = PracticeSessionService(sessionRepository)
    }

    @Test
    fun `세션 생성`() {
        val request = CreatePracticeSessionRequest(userId = 1L, goal = "코드 연습")
        val savedSession = PracticeSession(
            id = 1L,
            userId = request.userId,
            startedAt = LocalDateTime.now(),
            endedAt = null,
            status = SessionStatus.IN_PROGRESS,
            goal = request.goal
        )
        whenever(sessionRepository.save(any<PracticeSession>())).thenReturn(savedSession)

        val result = service.createSession(request)

        assertNotNull(result)
        assertEquals(1L, result.id)
        assertEquals(1L, result.userId)
        assertEquals("코드 연습", result.goal)
        assertEquals(SessionStatus.IN_PROGRESS, result.status)
        assertNotNull(result.startedAt)
        assertNull(result.endedAt)

        verify(sessionRepository).save(argForWhich {
            this.userId == request.userId && this.goal == request.goal && this.status == SessionStatus.IN_PROGRESS && this.endedAt == null
        })
    }

    @Test
    fun `세션 단건 조회`() {
        val session = PracticeSession(id = 2L, userId = 1L, goal = "즉흥 연주",
            startedAt = LocalDateTime.now(), endedAt = null, status = SessionStatus.IN_PROGRESS)
        whenever(sessionRepository.findById(2L)).thenReturn(Optional.of(session))

        val result = service.getSession(2L)

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
        whenever(sessionRepository.findById(99L)).thenReturn(Optional.empty())

        val result = service.getSession(99L)

        assertNull(result)
        verify(sessionRepository).findById(99L)
    }

    @Test
    fun `세션 종료`() {
        val session = PracticeSession(id = 3L, userId = 1L, goal = "스케일 연습",
            startedAt = LocalDateTime.now(), endedAt = null, status = SessionStatus.IN_PROGRESS)
        whenever(sessionRepository.findById(3L)).thenReturn(Optional.of(session))

        val completedSession = session.copy(
            status = SessionStatus.COMPLETED,
            endedAt = LocalDateTime.now()
        )
        whenever(sessionRepository.save(any<PracticeSession>())).thenReturn(completedSession)

        val result = service.endSession(3L)

        assertNotNull(result)
        assertEquals(SessionStatus.COMPLETED, result!!.status)
        assertNotNull(result.endedAt)
        assertEquals(3L, result.id)

        verify(sessionRepository).save(argForWhich {
            this.id == 3L && this.status == SessionStatus.COMPLETED && this.endedAt != null
        })
    }

    @Test
    fun `세션 종료_사용자 없음`() {
        whenever(sessionRepository.findById(99L)).thenReturn(Optional.empty())

        val result = service.endSession(99L)

        assertNull(result)
        verify(sessionRepository).findById(99L)
        verify(sessionRepository, never()).save(any())
    }
}