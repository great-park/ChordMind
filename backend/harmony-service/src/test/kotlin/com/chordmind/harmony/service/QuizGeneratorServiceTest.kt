package com.chordmind.harmony.service

import com.chordmind.harmony.HarmonyServiceApplication
import com.chordmind.harmony.config.TestConfig
import com.chordmind.harmony.domain.*
import com.chordmind.harmony.repository.*
import org.junit.jupiter.api.Assertions.*
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Test
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.context.annotation.Import
import org.springframework.transaction.annotation.Transactional

@SpringBootTest(
    classes = [HarmonyServiceApplication::class],
    properties = [
        "spring.datasource.url=jdbc:h2:mem:testdb;DB_CLOSE_DELAY=-1;DB_CLOSE_ON_EXIT=FALSE",
        "spring.datasource.driver-class-name=org.h2.Driver",
        "spring.datasource.username=sa",
        "spring.datasource.password=",
        "spring.jpa.hibernate.ddl-auto=create-drop",
        "spring.jpa.show-sql=true",
        "spring.jpa.properties.hibernate.format_sql=true",
        "ai.service.url=http://mock-ai-service"
    ]
)
@Import(TestConfig::class)
@Transactional
class QuizGeneratorServiceTest @Autowired constructor(
    private val quizGeneratorService: QuizGeneratorService,
    private val chordTypeRepository: ChordTypeRepository,
    private val scaleRootRepository: ScaleRootRepository,
    private val progressionPatternRepository: ProgressionPatternRepository,
    private val intervalTypeRepository: IntervalTypeRepository,
    private val scaleTypeRepository: ScaleTypeRepository
) {

    @BeforeEach
    fun setUp() {
        // 테스트 데이터 설정
        setupTestData()
    }

    private fun setupTestData() {
        // 스케일 루트 데이터
        if (scaleRootRepository.count() == 0L) {
            scaleRootRepository.saveAll(listOf(
                ScaleRoot(name = "C", degree = 1, frequency = java.math.BigDecimal.valueOf(261.63)),
                ScaleRoot(name = "D", degree = 3, frequency = java.math.BigDecimal.valueOf(293.66)),
                ScaleRoot(name = "E", degree = 5, frequency = java.math.BigDecimal.valueOf(329.63)),
                ScaleRoot(name = "F", degree = 6, frequency = java.math.BigDecimal.valueOf(349.23)),
                ScaleRoot(name = "G", degree = 8, frequency = java.math.BigDecimal.valueOf(392.00)),
                ScaleRoot(name = "A", degree = 10, frequency = java.math.BigDecimal.valueOf(440.00)),
                ScaleRoot(name = "B", degree = 12, frequency = java.math.BigDecimal.valueOf(493.88))
            ))
        }

        // 코드 타입 데이터
        if (chordTypeRepository.count() == 0L) {
            chordTypeRepository.saveAll(listOf(
                ChordType(name = "Major", symbol = "maj", description = "장3화음", difficultyLevel = DifficultyLevel.BEGINNER),
                ChordType(name = "Minor", symbol = "min", description = "단3화음", difficultyLevel = DifficultyLevel.BEGINNER),
                ChordType(name = "Dominant 7th", symbol = "7", description = "속7화음", difficultyLevel = DifficultyLevel.INTERMEDIATE)
            ))
        }

        // 화성 진행 패턴 데이터
        if (progressionPatternRepository.count() == 0L) {
            progressionPatternRepository.saveAll(listOf(
                ProgressionPattern(name = "기본 진행", pattern = "I-IV-V", description = "기본 화성 진행",
                    genre = MusicGenre.ALL, difficultyLevel = DifficultyLevel.BEGINNER, popularityScore = 100),
                ProgressionPattern(name = "팝 진행", pattern = "I-V-vi-IV", description = "현대 팝 음악 진행",
                    genre = MusicGenre.POP, difficultyLevel = DifficultyLevel.BEGINNER, popularityScore = 90)
            ))
        }

        // 음정 타입 데이터
        if (intervalTypeRepository.count() == 0L) {
            intervalTypeRepository.saveAll(listOf(
                IntervalType(name = "완전1도 (유니즌)", semitones = 0, quality = "Perfect", description = "같은 음의 관계", difficultyLevel = 1),
                IntervalType(name = "장2도", semitones = 2, quality = "Major", description = "온음 차이", difficultyLevel = 1),
                IntervalType(name = "장3도", semitones = 4, quality = "Major", description = "장조의 특징음", difficultyLevel = 1),
                IntervalType(name = "완전4도", semitones = 5, quality = "Perfect", description = "안정적인 협화음", difficultyLevel = 1),
                IntervalType(name = "완전5도", semitones = 7, quality = "Perfect", description = "가장 안정적인 협화음", difficultyLevel = 1),
                IntervalType(name = "장7도", semitones = 11, quality = "Major", description = "재즈의 세련된 사운드", difficultyLevel = 2)
            ))
        }

        // 스케일 타입 데이터
        if (scaleTypeRepository.count() == 0L) {
            scaleTypeRepository.saveAll(listOf(
                ScaleType(name = "메이저 스케일", pattern = "W-W-H-W-W-W-H", description = "가장 기본적인 스케일", modeNumber = 1, difficultyLevel = 1),
                ScaleType(name = "내추럴 마이너", pattern = "W-H-W-W-H-W-W", description = "자연 단조 스케일", modeNumber = 6, difficultyLevel = 1),
                ScaleType(name = "도리안", pattern = "W-H-W-W-W-H-W", description = "재즈와 팝에서 사용", modeNumber = 2, difficultyLevel = 2),
                ScaleType(name = "펜타토닉 메이저", pattern = "W-W-WH-W-WH", description = "5음 스케일", modeNumber = null, difficultyLevel = 1)
            ))
        }
    }

    @Test
    fun `DB 기반 코드 문제 생성 테스트`() {
        val questions = quizGeneratorService.generateChordQuestions(3, 2)

        assertEquals(3, questions.size)
        questions.forEach { question ->
            assertEquals(QuizType.CHORD_NAME, question.type)
            assertNotNull(question.question)
            assertNotNull(question.answer)
            assertNotNull(question.explanation)
            assertTrue(question.difficulty <= 2)
            assertEquals(4, question.choices.size)
            assertTrue(question.choices.any { it.text == question.answer })
        }
    }

    @Test
    fun `DB 기반 화성 진행 문제 생성 테스트`() {
        val questions = quizGeneratorService.generateProgressionQuestions(2, 2)

        assertEquals(2, questions.size)
        questions.forEach { question ->
            assertEquals(QuizType.PROGRESSION, question.type)
            assertNotNull(question.question)
            assertNotNull(question.answer)
            assertNotNull(question.explanation)
            assertTrue(question.difficulty <= 2)
            assertEquals(4, question.choices.size)
            assertTrue(question.choices.any { it.text == question.answer })
        }
    }

    @Test
    fun `DB 기반 음정 문제 생성 테스트`() {
        val questions = quizGeneratorService.generateIntervalQuestions(3, 2)

        assertEquals(3, questions.size)
        questions.forEach { question ->
            assertEquals(QuizType.INTERVAL, question.type)
            assertNotNull(question.question)
            assertNotNull(question.answer)
            assertNotNull(question.explanation)
            assertTrue(question.difficulty <= 2)
            assertEquals(4, question.choices.size)
            assertTrue(question.choices.any { it.text == question.answer })
        }
    }

    @Test
    fun `DB 기반 스케일 문제 생성 테스트`() {
        val questions = quizGeneratorService.generateScaleQuestions(3, 2)

        assertEquals(3, questions.size)
        questions.forEach { question ->
            assertEquals(QuizType.SCALE, question.type)
            assertNotNull(question.question)
            assertNotNull(question.answer)
            assertNotNull(question.explanation)
            assertTrue(question.difficulty <= 2)
            assertEquals(4, question.choices.size)
            assertTrue(question.choices.any { it.text == question.answer })
        }
    }

    @Test
    fun `타입별 문제 생성 테스트`() {
        QuizType.values().forEach { type ->
            val questions = quizGeneratorService.generateQuestionsByType(type, 2, 2)
            assertEquals(2, questions.size)
            assertTrue(questions.all { it.type == type })
        }
    }

    @Test
    fun `혼합 문제 생성 테스트`() {
        val questions = quizGeneratorService.generateMixedQuestions(8, 2)

        assertEquals(8, questions.size)
        // 각 타입별로 최소 1개는 있어야 함
        QuizType.values().forEach { type ->
            assertTrue(questions.any { it.type == type })
        }
    }

    @Test
    fun `난이도 제한 테스트`() {
        val questions = quizGeneratorService.generateMixedQuestions(4, 1)

        questions.forEach { question ->
            assertTrue(question.difficulty <= 1, "난이도가 1을 초과함: ${question.difficulty}")
        }
    }

    @Test
    fun `코드 타입 데이터가 없을 때 예외 발생 테스트`() {
        chordTypeRepository.deleteAll()

        assertThrows(IllegalStateException::class.java) {
            quizGeneratorService.generateChordQuestions(1, 3)
        }
    }

    @Test
    fun `화성 진행 데이터가 없을 때 예외 발생 테스트`() {
        progressionPatternRepository.deleteAll()

        assertThrows(IllegalStateException::class.java) {
            quizGeneratorService.generateProgressionQuestions(1, 3)
        }
    }

    @Test
    fun `음정 타입 데이터가 없을 때 예외 발생 테스트`() {
        intervalTypeRepository.deleteAll()

        assertThrows(IllegalStateException::class.java) {
            quizGeneratorService.generateIntervalQuestions(1, 3)
        }
    }

    @Test
    fun `스케일 타입 데이터가 없을 때 예외 발생 테스트`() {
        scaleTypeRepository.deleteAll()

        assertThrows(IllegalStateException::class.java) {
            quizGeneratorService.generateScaleQuestions(1, 3)
        }
    }

    @Test
    fun `장르별 화성 진행 문제 생성 테스트`() {
        val popQuestions = quizGeneratorService.generateProgressionQuestions(1, 3, "POP")
        assertEquals(1, popQuestions.size)
        assertEquals(QuizType.PROGRESSION, popQuestions.first().type)
    }

    @Test
    fun `문제 저장 기능 테스트`() {
        val savedQuestions = quizGeneratorService.generateAndSaveQuestions(QuizType.CHORD_NAME, 2, 2)

        assertEquals(2, savedQuestions.size)
        savedQuestions.forEach { question ->
            assertTrue(question.id > 0) // 저장되어 ID가 할당됨
        }
    }
}