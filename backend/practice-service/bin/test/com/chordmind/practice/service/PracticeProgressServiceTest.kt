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

    @Test
    fun `진행상황 검색 - note, score, 기간 필터`() {
        val now = java.time.LocalDateTime.now()
        val progresses = listOf(
            com.chordmind.practice.domain.PracticeProgress(id = 1L, sessionId = 1L, note = "코드 연습", score = 80, timestamp = now.minusDays(2)),
            com.chordmind.practice.domain.PracticeProgress(id = 2L, sessionId = 1L, note = "즉흥 연주", score = 90, timestamp = now.minusDays(1)),
            com.chordmind.practice.domain.PracticeProgress(id = 3L, sessionId = 2L, note = "코드 연습", score = 70, timestamp = now)
        )
        org.mockito.kotlin.whenever(progressRepository.findAll()).thenReturn(progresses)
        val service = com.chordmind.practice.service.PracticeProgressService(progressRepository)
        val req1 = com.chordmind.practice.dto.PracticeProgressSearchRequest(note = "코드")
        val result1 = service.searchProgresses(req1)
        org.junit.jupiter.api.Assertions.assertEquals(2, result1.size)
        val req2 = com.chordmind.practice.dto.PracticeProgressSearchRequest(scoreMin = 80)
        val result2 = service.searchProgresses(req2)
        org.junit.jupiter.api.Assertions.assertEquals(2, result2.size)
        val req3 = com.chordmind.practice.dto.PracticeProgressSearchRequest(timestampFrom = now.minusDays(1), timestampTo = now)
        val result3 = service.searchProgresses(req3)
        org.junit.jupiter.api.Assertions.assertEquals(2, result3.size)
        val req4 = com.chordmind.practice.dto.PracticeProgressSearchRequest(sessionId = 1L)
        val result4 = service.searchProgresses(req4)
        org.junit.jupiter.api.Assertions.assertEquals(2, result4.size)
        val req5 = com.chordmind.practice.dto.PracticeProgressSearchRequest(note = "즉흥", scoreMax = 90)
        val result5 = service.searchProgresses(req5)
        org.junit.jupiter.api.Assertions.assertEquals(1, result5.size)
        org.junit.jupiter.api.Assertions.assertEquals("즉흥 연주", result5[0].note)
    }
} 