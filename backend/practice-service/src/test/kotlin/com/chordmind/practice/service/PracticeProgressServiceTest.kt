package com.chordmind.practice.service

import com.chordmind.practice.domain.PracticeProgress
import com.chordmind.practice.dto.CreatePracticeProgressRequest
import com.chordmind.practice.dto.UpdatePracticeProgressRequest
import com.chordmind.practice.repository.PracticeProgressRepository
import org.junit.jupiter.api.Assertions.*
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Test
import org.mockito.kotlin.*
import java.time.LocalDateTime
import java.util.*

class PracticeProgressServiceTest {
    private lateinit var progressRepository: PracticeProgressRepository
    private lateinit var service: PracticeProgressService

    @BeforeEach
    fun setUp() {
        progressRepository = mock()
        service = PracticeProgressService(progressRepository)
    }

    @Test
    fun `진행상황 기록 추가`() {
        val request = CreatePracticeProgressRequest(sessionId = 1L, note = "연습 기록", score = 80)
        whenever(progressRepository.save(any<PracticeProgress>())).thenAnswer { invocation ->
            val entity = invocation.getArgument<PracticeProgress>(0)
            entity.copy(id = 100L)
        }

        val result = service.addProgress(request)
        assertEquals(100L, result.id)
        assertEquals(1L, result.sessionId)
        assertEquals("연습 기록", result.note)
        assertEquals(80, result.score)
    }

    @Test
    fun `세션별 진행상황 조회`() {
        val progressList = listOf(
            PracticeProgress(id = 1L, sessionId = 2L, note = "A", score = 70, timestamp = LocalDateTime.now()),
            PracticeProgress(id = 2L, sessionId = 2L, note = "B", score = 90, timestamp = LocalDateTime.now())
        )
        whenever(progressRepository.findBySessionId(2L)).thenReturn(progressList)

        val result = service.getProgressBySession(2L)
        assertEquals(2, result.size)
        assertEquals("A", result[0].note)
        assertEquals(90, result[1].score)
    }

    @Test
    fun `진행상황 정보 수정`() {
        val original = PracticeProgress(id = 5L, sessionId = 1L, note = "이전 메모", score = 60, timestamp = LocalDateTime.now())
        whenever(progressRepository.findById(5L)).thenReturn(Optional.of(original))
        whenever(progressRepository.save(any<PracticeProgress>())).thenAnswer { invocation ->
            val entity = invocation.getArgument<PracticeProgress>(0)
            entity.copy(id = 5L)
        }

        val request = UpdatePracticeProgressRequest(note = "수정된 메모", score = 99)
        val result = service.updateProgress(5L, request)
        assertNotNull(result)
        assertEquals(5L, result!!.id)
        assertEquals("수정된 메모", result.note)
        assertEquals(99, result.score)
    }
} 