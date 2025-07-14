package com.chordmind.practice.service

import com.chordmind.practice.domain.PracticeSession
import com.chordmind.practice.dto.CreatePracticeSessionRequest
import com.chordmind.practice.dto.UpdatePracticeSessionRequest
import com.chordmind.practice.repository.PracticeSessionRepository
import org.junit.jupiter.api.Assertions.*
import org.junit.jupiter.api.Test
import org.mockito.BDDMockito.given
import org.mockito.Mockito.mock
import org.springframework.boot.test.context.SpringBootTest
import java.util.*

// @SpringBootTest
class PracticeSessionServiceTest {
    private val practiceSessionRepository = mock(PracticeSessionRepository::class.java)
    private val practiceSessionService = PracticeSessionService(practiceSessionRepository)

    @Test
    fun `연습 세션 생성`() {
        val request = CreatePracticeSessionRequest(
            userId = 1L,
            songId = "song-1",
            songTitle = "Test Song",
            artist = "Test Artist",
            difficulty = "Easy",
            tempo = 120,
            key = "C"
        )
        val session = PracticeSession(
            id = 1L,
            userId = 1L,
            songId = "song-1",
            songTitle = "Test Song",
            artist = "Test Artist",
            difficulty = "Easy",
            tempo = 120,
            key = "C",
            duration = 0,
            accuracy = 0.0,
            score = 0,
            mistakes = 0,
            completed = false
        )
        given(practiceSessionRepository.save(org.mockito.kotlin.any())).willReturn(session)
        val result = practiceSessionService.createPracticeSession(request)
        assertEquals(1L, result.id)
        assertEquals("Test Song", result.songTitle)
        assertEquals("Test Artist", result.artist)
        assertEquals("Easy", result.difficulty)
    }

    @Test
    fun `연습 세션 수정`() {
        val session = PracticeSession(
            id = 1L,
            userId = 1L,
            songId = "song-1",
            songTitle = "Test Song",
            artist = "Test Artist",
            difficulty = "Easy",
            tempo = 120,
            key = "C",
            duration = 0,
            accuracy = 0.0,
            score = 0,
            mistakes = 0,
            completed = false
        )
        val updatedSession = session.copy(
            duration = 300,
            accuracy = 95.0,
            score = 900,
            mistakes = 1,
            completed = true
        )
        given(practiceSessionRepository.findById(1L)).willReturn(Optional.of(session))
        given(practiceSessionRepository.save(org.mockito.kotlin.any())).willReturn(updatedSession)
        val request = UpdatePracticeSessionRequest(
            duration = 300,
            accuracy = 95.0,
            score = 900,
            mistakes = 1,
            completed = true
        )
        val result = practiceSessionService.updatePracticeSession(1L, request)
        assertEquals(300, result.duration)
        assertEquals(95.0, result.accuracy)
        assertEquals(900, result.score)
        assertEquals(1, result.mistakes)
        assertTrue(result.completed)
    }
} 