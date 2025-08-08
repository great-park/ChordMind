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
import com.chordmind.practice.dto.PracticeSessionSearchRequest

class PracticeSessionServiceTest {
    private lateinit var sessionRepository: PracticeSessionRepository
    private lateinit var progressRepository: PracticeProgressRepository
    private lateinit var service: PracticeSessionService

    @BeforeEach
    fun setUp() {
        sessionRepository = mock()
        progressRepository = mock()
        service = PracticeSessionService(sessionRepository, progressRepository)
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

    @Test
    fun `사용자별 연습 요약 통계`() {
        val userId = 1L
        val sessions = listOf(
            PracticeSession(id = 1L, userId = userId, status = SessionStatus.COMPLETED, startedAt = LocalDateTime.now().minusDays(2), endedAt = LocalDateTime.now().minusDays(2), goal = "A"),
            PracticeSession(id = 2L, userId = userId, status = SessionStatus.IN_PROGRESS, startedAt = LocalDateTime.now().minusDays(1), goal = "B")
        )
        val progresses1 = listOf(
            PracticeProgress(id = 1L, sessionId = 1L, note = "A", score = 80, timestamp = LocalDateTime.now().minusDays(2)),
            PracticeProgress(id = 2L, sessionId = 1L, note = "B", score = 90, timestamp = LocalDateTime.now().minusDays(2))
        )
        val progresses2 = listOf(
            PracticeProgress(id = 3L, sessionId = 2L, note = "C", score = 70, timestamp = LocalDateTime.now().minusDays(1))
        )
        whenever(sessionRepository.findByUserId(userId)).thenReturn(sessions)
        whenever(progressRepository.findBySessionId(1L)).thenReturn(progresses1)
        whenever(progressRepository.findBySessionId(2L)).thenReturn(progresses2)

        val result = service.getUserPracticeSummary(userId)
        assertEquals(userId, result.userId)
        assertEquals(2, result.totalSessions)
        assertEquals(1, result.completedSessions)
        assertEquals(85.0, result.averageScore)
        assertEquals(80.0, result.averageProgressScore)
        assertNotNull(result.lastSessionAt)
    }

    @Test
    fun `사용자별 세션 목록 조회`() {
        val userId = 1L
        val sessions = listOf(
            PracticeSession(id = 1L, userId = userId, goal = "A", startedAt = LocalDateTime.now(), status = SessionStatus.IN_PROGRESS),
            PracticeSession(id = 2L, userId = userId, goal = "B", startedAt = LocalDateTime.now(), status = SessionStatus.COMPLETED)
        )
        whenever(sessionRepository.findByUserId(userId)).thenReturn(sessions)

        val result = service.getSessionsByUser(userId)
        assertEquals(2, result.size)
        assertEquals("A", result[0].goal)
        assertEquals("B", result[1].goal)
    }

    @Test
    fun `사용자별 세션 목록 조회_빈 리스트`() {
        val userId = 2L
        whenever(sessionRepository.findByUserId(userId)).thenReturn(emptyList())
        val result = service.getSessionsByUser(userId)
        assertTrue(result.isEmpty())
    }

    @Test
    fun `세션 정보 수정`() {
        val sessionId = 10L
        val session = PracticeSession(id = sessionId, userId = 1L, goal = "old", startedAt = LocalDateTime.now(), status = SessionStatus.IN_PROGRESS)
        whenever(sessionRepository.findById(sessionId)).thenReturn(Optional.of(session))
        val updatedSession = session.copy(goal = "new", status = SessionStatus.COMPLETED)
        whenever(sessionRepository.save(any<PracticeSession>())).thenReturn(updatedSession)

        val request = com.chordmind.practice.dto.UpdatePracticeSessionRequest(goal = "new", status = SessionStatus.COMPLETED, endedAt = null)
        val result = service.updateSession(sessionId, request)
        assertNotNull(result)
        assertEquals("new", result!!.goal)
        assertEquals(SessionStatus.COMPLETED, result.status)
    }

    @Test
    fun `세션 정보 수정_존재하지 않는 세션`() {
        whenever(sessionRepository.findById(999L)).thenReturn(Optional.empty())
        val request = com.chordmind.practice.dto.UpdatePracticeSessionRequest(goal = "new", status = SessionStatus.COMPLETED, endedAt = null)
        val result = service.updateSession(999L, request)
        assertNull(result)
    }

    @Test
    fun `세션 정보 수정_goal, status, endedAt이 null이면 기존 값 유지`() {
        val sessionId = 11L
        val session = PracticeSession(id = sessionId, userId = 1L, goal = "oldGoal", startedAt = LocalDateTime.now(), status = SessionStatus.IN_PROGRESS, endedAt = null)
        whenever(sessionRepository.findById(sessionId)).thenReturn(Optional.of(session))
        val updatedSession = session.copy()
        whenever(sessionRepository.save(any<PracticeSession>())).thenReturn(updatedSession)
        val request = com.chordmind.practice.dto.UpdatePracticeSessionRequest(goal = null, status = null, endedAt = null)
        val result = service.updateSession(sessionId, request)
        assertNotNull(result)
        assertEquals("oldGoal", result!!.goal)
        assertEquals(SessionStatus.IN_PROGRESS, result.status)
        assertNull(result.endedAt)
    }

    @Test
    fun `세션 삭제_존재하는 세션`() {
        whenever(sessionRepository.existsById(1L)).thenReturn(true)
        doNothing().whenever(sessionRepository).deleteById(1L)
        val result = service.deleteSession(1L)
        assertTrue(result)
        verify(sessionRepository).deleteById(1L)
    }

    @Test
    fun `세션 삭제_존재하지 않는 세션`() {
        whenever(sessionRepository.existsById(999L)).thenReturn(false)
        val result = service.deleteSession(999L)
        assertFalse(result)
        verify(sessionRepository, never()).deleteById(any())
    }

    @Test
    fun `사용자별 연습 요약 통계_빈 데이터`() {
        val userId = 100L
        whenever(sessionRepository.findByUserId(userId)).thenReturn(emptyList())
        val result = service.getUserPracticeSummary(userId)
        assertEquals(userId, result.userId)
        assertEquals(0, result.totalSessions)
        assertEquals(0, result.completedSessions)
        assertNull(result.averageScore)
        assertNull(result.averageProgressScore)
        assertNull(result.lastSessionAt)
    }

    @Test
    fun `세션별 연습 요약 통계`() {
        val sessionId = 100L
        val session = PracticeSession(id = sessionId, userId = 1L, goal = "테스트 목표", startedAt = LocalDateTime.now().minusDays(1), status = SessionStatus.COMPLETED)
        val progresses = listOf(
            PracticeProgress(id = 1L, sessionId = sessionId, note = "A", score = 80, timestamp = LocalDateTime.now().minusHours(2)),
            PracticeProgress(id = 2L, sessionId = sessionId, note = "B", score = 90, timestamp = LocalDateTime.now().minusHours(1))
        )
        whenever(sessionRepository.findById(sessionId)).thenReturn(Optional.of(session))
        whenever(progressRepository.findBySessionId(sessionId)).thenReturn(progresses)

        val result = service.getSessionSummary(sessionId)
        assertNotNull(result)
        assertEquals(sessionId, result!!.id)
        assertEquals("테스트 목표", result.songTitle)
        assertEquals(85.0, result.accuracy)
        assertEquals(90, result.score)
        assertTrue(result.completed)
        assertEquals(session.startedAt, result.createdAt)
    }

    @Test
    fun `세션별 연습 요약 통계_진행상황 없음`() {
        val sessionId = 101L
        val session = PracticeSession(id = sessionId, userId = 1L, goal = "목표", startedAt = LocalDateTime.now(), status = SessionStatus.IN_PROGRESS)
        whenever(sessionRepository.findById(sessionId)).thenReturn(Optional.of(session))
        whenever(progressRepository.findBySessionId(sessionId)).thenReturn(emptyList())
        val result = service.getSessionSummary(sessionId)
        assertNotNull(result)
        assertEquals(0.0, result!!.accuracy)
        assertEquals(0, result.score)
        assertFalse(result.completed)
    }

    @Test
    fun `세션별 연습 요약 통계_세션 없음`() {
        whenever(sessionRepository.findById(999L)).thenReturn(Optional.empty())
        val result = service.getSessionSummary(999L)
        assertNull(result)
    }

    @Test
    fun `toResponse id가 null이면 NPE`() {
        val session = PracticeSession(id = null, userId = 1L, goal = "test", startedAt = LocalDateTime.now(), status = SessionStatus.IN_PROGRESS)
        val method = PracticeSessionService::class.java.getDeclaredMethod("toResponse", PracticeSession::class.java)
        method.isAccessible = true
        val ex = assertThrows(java.lang.reflect.InvocationTargetException::class.java) {
            method.invoke(service, session)
        }
        assertTrue(ex.cause is NullPointerException)
    }

    @Test
    fun `세션 검색 - goal, status, 기간 필터`() {
        val now = LocalDateTime.now()
        val sessions = listOf(
            PracticeSession(id = 1L, userId = 1L, goal = "코드 연습", startedAt = now.minusDays(2), status = SessionStatus.IN_PROGRESS),
            PracticeSession(id = 2L, userId = 1L, goal = "즉흥 연주", startedAt = now.minusDays(1), status = SessionStatus.COMPLETED),
            PracticeSession(id = 3L, userId = 2L, goal = "코드 연습", startedAt = now, status = SessionStatus.COMPLETED)
        )
        whenever(sessionRepository.findAll()).thenReturn(sessions)
        val req1 = PracticeSessionSearchRequest(goal = "코드", status = null, startedAtFrom = null, startedAtTo = null)
        val result1 = service.searchSessions(req1)
        assertEquals(2, result1.content.size)
        val req2 = PracticeSessionSearchRequest(status = SessionStatus.COMPLETED)
        val result2 = service.searchSessions(req2)
        assertEquals(2, result2.content.size)
        val req3 = PracticeSessionSearchRequest(startedAtFrom = now.minusDays(1), startedAtTo = now)
        val result3 = service.searchSessions(req3)
        assertEquals(2, result3.content.size)
        val req4 = PracticeSessionSearchRequest(userId = 1L)
        val result4 = service.searchSessions(req4)
        assertEquals(2, result4.content.size)
        val req5 = PracticeSessionSearchRequest(goal = "즉흥", status = SessionStatus.COMPLETED)
        val result5 = service.searchSessions(req5)
        assertEquals(1, result5.content.size)
        assertEquals("즉흥 연주", result5.content[0].goal)
    }

    @Test
    fun `사용자 랭킹 계산`() {
        val userId = 1L
        val now = LocalDateTime.now()
        val sessions = listOf(
            PracticeSession(id = 1L, userId = userId, startedAt = now.minusHours(2), endedAt = now.minusHours(1), status = SessionStatus.COMPLETED, goal = "A"),
            PracticeSession(id = 2L, userId = userId, startedAt = now.minusHours(1), endedAt = now, status = SessionStatus.IN_PROGRESS, goal = "B")
        )
        val progresses1 = listOf(
            PracticeProgress(id = 1L, sessionId = 1L, note = "A", score = 80, timestamp = now.minusHours(2)),
            PracticeProgress(id = 2L, sessionId = 1L, note = "B", score = 90, timestamp = now.minusHours(1))
        )
        val progresses2 = listOf(
            PracticeProgress(id = 3L, sessionId = 2L, note = "C", score = 70, timestamp = now.minusMinutes(30))
        )
        whenever(sessionRepository.findByUserId(userId)).thenReturn(sessions)
        whenever(progressRepository.findBySessionId(1L)).thenReturn(progresses1)
        whenever(progressRepository.findBySessionId(2L)).thenReturn(progresses2)
        val result = service.getUserRanking(userId)
        assertNotNull(result)
        assertEquals(userId, result!!.userId)
        assertEquals(2, result.totalSessions)
        assertEquals(1, result.completedSessions)
        assertNotNull(result.averageScore)
        assertEquals(80.0, result.averageScore!!, 0.1)
        assertTrue(result.totalPracticeTime > 0)
        assertTrue(result.score > 0)
    }

    @Test
    fun `상위 사용자 랭킹 정렬`() {
        val now = LocalDateTime.now()
        val sessions = listOf(
            PracticeSession(id = 1L, userId = 1L, startedAt = now.minusHours(2), endedAt = now.minusHours(1), status = SessionStatus.COMPLETED, goal = "A"),
            PracticeSession(id = 2L, userId = 2L, startedAt = now.minusHours(2), endedAt = now.minusHours(1), status = SessionStatus.COMPLETED, goal = "B")
        )
        whenever(sessionRepository.findAll()).thenReturn(sessions)
        whenever(sessionRepository.findByUserId(1L)).thenReturn(listOf(sessions[0]))
        whenever(sessionRepository.findByUserId(2L)).thenReturn(listOf(sessions[1]))
        whenever(progressRepository.findBySessionId(1L)).thenReturn(listOf(PracticeProgress(id = 1L, sessionId = 1L, note = "A", score = 90, timestamp = now.minusHours(2))))
        whenever(progressRepository.findBySessionId(2L)).thenReturn(listOf(PracticeProgress(id = 2L, sessionId = 2L, note = "B", score = 80, timestamp = now.minusHours(2))))
        val result = service.getTopUsers(2)
        assertEquals(2, result.size)
        assertEquals(1L, result[0].userId)
        assertEquals(2L, result[1].userId)
        assertEquals(1, result[0].rank)
        assertEquals(2, result[1].rank)
    }
}