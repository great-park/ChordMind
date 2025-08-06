package com.chordmind.harmony.service

import com.chordmind.harmony.domain.*
import com.chordmind.harmony.repository.*
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.Assertions.*
import org.junit.jupiter.api.BeforeEach
import org.mockito.Mock
import org.mockito.MockitoAnnotations
import org.mockito.kotlin.whenever
import java.math.BigDecimal

/**
 * QuizGeneratorService 단위 테스트
 * Mock을 사용한 가벼운 테스트
 */
class QuizGeneratorServiceUnitTest {

    @Mock
    private lateinit var chordTypeRepository: ChordTypeRepository
    @Mock
    private lateinit var scaleRootRepository: ScaleRootRepository
    @Mock
    private lateinit var progressionPatternRepository: ProgressionPatternRepository
    @Mock
    private lateinit var intervalTypeRepository: IntervalTypeRepository
    @Mock
    private lateinit var scaleTypeRepository: ScaleTypeRepository
    @Mock
    private lateinit var quizQuestionRepository: QuizQuestionRepository

    private lateinit var quizGeneratorService: QuizGeneratorService

    @BeforeEach
    fun setUp() {
        MockitoAnnotations.openMocks(this)
        quizGeneratorService = QuizGeneratorService(
            quizQuestionRepository,
            chordTypeRepository,
            scaleRootRepository,
            progressionPatternRepository,
            intervalTypeRepository,
            scaleTypeRepository
        )
    }

    @Test
    fun `코드 문제 생성 테스트`() {
        // Given
        val mockChordTypes = listOf(
            ChordType(1, "Major", "maj", "장3화음", DifficultyLevel.BEGINNER),
            ChordType(2, "Minor", "min", "단3화음", DifficultyLevel.BEGINNER)
        )
        val mockRoots = listOf(
            ScaleRoot(1, "C", 1, BigDecimal("261.63")),
            ScaleRoot(2, "D", 3, BigDecimal("293.66"))
        )

        whenever(chordTypeRepository.findAll()).thenReturn(mockChordTypes)
        whenever(scaleRootRepository.findAllByOrderByDegreeAsc()).thenReturn(mockRoots)

        // When
        val questions = quizGeneratorService.generateChordQuestions(2, 2)

        // Then
        assertEquals(2, questions.size)
        questions.forEach { question ->
            assertEquals(QuizType.CHORD_NAME, question.type)
            assertNotNull(question.question)
            assertNotNull(question.answer)
            assertEquals(4, question.choices.size)
        }
    }

    @Test
    fun `음정 문제 생성 테스트`() {
        // Given
        val mockIntervals = listOf(
            IntervalType(1, "완전1도", 0, "Perfect", "같은 음", 1),
            IntervalType(2, "장2도", 2, "Major", "온음 차이", 1)
        )

        whenever(intervalTypeRepository.findByDifficultyLevelLessThanEqual(2)).thenReturn(mockIntervals)

        // When
        val questions = quizGeneratorService.generateIntervalQuestions(2, 2)

        // Then
        assertEquals(2, questions.size)
        questions.forEach { question ->
            assertEquals(QuizType.INTERVAL, question.type)
            assertNotNull(question.question)
            assertNotNull(question.answer)
            assertEquals(4, question.choices.size)
        }
    }

    @Test
    fun `스케일 문제 생성 테스트`() {
        // Given
        val mockScales = listOf(
            ScaleType(1, "메이저 스케일", "W-W-H-W-W-W-H", "기본 스케일", 1, 1),
            ScaleType(2, "마이너 스케일", "W-H-W-W-H-W-W", "단조 스케일", 6, 1)
        )

        whenever(scaleTypeRepository.findByDifficultyLevelLessThanEqual(2)).thenReturn(mockScales)

        // When
        val questions = quizGeneratorService.generateScaleQuestions(2, 2)

        // Then
        assertEquals(2, questions.size)
        questions.forEach { question ->
            assertEquals(QuizType.SCALE, question.type)
            assertNotNull(question.question)
            assertNotNull(question.answer)
            assertEquals(4, question.choices.size)
        }
    }

    @Test
    fun `화성 진행 문제 생성 테스트`() {
        // Given
        val mockProgressions = listOf(
            ProgressionPattern(1, "기본 진행", "I-IV-V", "기본 화성 진행", MusicGenre.ALL, DifficultyLevel.BEGINNER, 100),
            ProgressionPattern(2, "팝 진행", "I-V-vi-IV", "팝 음악 진행", MusicGenre.POP, DifficultyLevel.BEGINNER, 90)
        )

        whenever(progressionPatternRepository.findAll()).thenReturn(mockProgressions)

        // When
        val questions = quizGeneratorService.generateProgressionQuestions(2, 2)

        // Then
        assertEquals(2, questions.size)
        questions.forEach { question ->
            assertEquals(QuizType.PROGRESSION, question.type)
            assertNotNull(question.question)
            assertNotNull(question.answer)
            assertEquals(4, question.choices.size)
        }
    }

    @Test
    fun `데이터가 없을 때 예외 발생 테스트`() {
        // Given
        whenever(chordTypeRepository.findAll()).thenReturn(emptyList())
        whenever(scaleRootRepository.findAllByOrderByDegreeAsc()).thenReturn(emptyList())

        // When & Then
        assertThrows(IllegalStateException::class.java) {
            quizGeneratorService.generateChordQuestions(1, 2)
        }
    }

    @Test
    fun `장르별 화성 진행 필터링 테스트`() {
        // Given
        val mockProgressions = listOf(
            ProgressionPattern(1, "기본 진행", "I-IV-V", "기본 화성 진행", MusicGenre.ALL, DifficultyLevel.BEGINNER, 100),
            ProgressionPattern(2, "팝 진행", "I-V-vi-IV", "팝 음악 진행", MusicGenre.POP, DifficultyLevel.BEGINNER, 90),
            ProgressionPattern(3, "재즈 진행", "ii-V-I", "재즈 진행", MusicGenre.JAZZ, DifficultyLevel.INTERMEDIATE, 85)
        )

        whenever(progressionPatternRepository.findAll()).thenReturn(mockProgressions)

        // When
        val popQuestions = quizGeneratorService.generateProgressionQuestions(1, 2, "POP")

        // Then
        assertEquals(1, popQuestions.size)
        // 결과에는 POP 또는 ALL 장르만 포함되어야 함
        assertTrue(popQuestions.first().answer in listOf("I-IV-V", "I-V-vi-IV"))
    }
}