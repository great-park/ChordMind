package com.chordmind.harmony.service

import com.chordmind.harmony.domain.*
import com.chordmind.harmony.repository.*
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional

/**
 * 퀴즈 생성 서비스 - 완전히 DB 기반으로 리팩토링
 * 모든 하드코딩 제거하고 데이터베이스에서 동적으로 조회
 */
@Service
class QuizGeneratorService(
    private val quizQuestionRepository: QuizQuestionRepository,
    private val chordTypeRepository: ChordTypeRepository,
    private val scaleRootRepository: ScaleRootRepository,
    private val progressionPatternRepository: ProgressionPatternRepository
) {
    
    /**
     * DB 기반 코드 문제 생성 (하드코딩 제거)
     */
    fun generateChordQuestions(count: Int, maxDifficulty: Int = 3): List<QuizQuestion> {
        val questions = mutableListOf<QuizQuestion>()
        
        // DB에서 코드 타입과 루트음 조회
        val availableChordTypes = chordTypeRepository.findByDifficultyLevelBetween(1, maxDifficulty)
        val availableRoots = scaleRootRepository.findAllByOrderByDegreeAsc()
        
        if (availableChordTypes.isEmpty() || availableRoots.isEmpty()) {
            throw IllegalStateException("코드 타입 또는 루트음 데이터가 없습니다. 데이터를 확인해주세요.")
        }
        
        repeat(count) {
            val root = availableRoots.random()
            val chordType = availableChordTypes.random()
            val chord = "${root.name}${chordType.symbol}"
            
            val question = QuizQuestion(
                type = QuizType.CHORD_NAME,
                question = "다음 코드의 이름은 무엇인가요? 🎵",
                answer = chord,
                explanation = "${chord}는 ${chordType.description}입니다.",
                difficulty = chordType.difficultyLevel
            )
            
            // 선택지 생성 (DB 기반)
            val choices = generateChordChoicesFromDB(chord, availableRoots, availableChordTypes)
            choices.forEach { choiceText ->
                val choice = QuizChoice(text = choiceText)
                question.addChoice(choice)
            }
            
            questions.add(question)
        }
        
        return questions
    }
    
    /**
     * DB 기반 화성 진행 문제 생성 (하드코딩 제거)
     */
    fun generateProgressionQuestions(count: Int, maxDifficulty: Int = 3, genre: String? = null): List<QuizQuestion> {
        val questions = mutableListOf<QuizQuestion>()
        
        // DB에서 화성 진행 패턴 조회
        val availableProgressions = when {
            genre != null -> progressionPatternRepository.findByGenreAndDifficultyLevelLessThanEqual(genre, maxDifficulty)
            else -> progressionPatternRepository.findByDifficultyLevelBetween(1, maxDifficulty)
        }
        
        if (availableProgressions.isEmpty()) {
            throw IllegalStateException("화성 진행 패턴 데이터가 없습니다. 데이터를 확인해주세요.")
        }
        
        repeat(count) {
            val progressionPattern = availableProgressions.random()
            
            val question = QuizQuestion(
                type = QuizType.PROGRESSION,
                question = "다음 화성 진행의 이름은 무엇인가요? 🎼",
                answer = progressionPattern.pattern,
                explanation = "${progressionPattern.pattern}는 ${progressionPattern.description}입니다.",
                difficulty = progressionPattern.difficultyLevel
            )
            
            // 선택지 생성 (DB 기반)
            val choices = generateProgressionChoicesFromDB(progressionPattern, availableProgressions)
            choices.forEach { choiceText ->
                val choice = QuizChoice(text = choiceText)
                question.addChoice(choice)
            }
            
            questions.add(question)
        }
        
        return questions
    }
    
    /**
     * 음정 문제 생성 (향후 DB 기반으로 확장 가능)
     */
    fun generateIntervalQuestions(count: Int, maxDifficulty: Int = 3): List<QuizQuestion> {
        val questions = mutableListOf<QuizQuestion>()
        
        // 현재는 기본 음정들로 구성 (향후 DB 테이블로 이전 예정)
        val basicIntervals = listOf(
            Triple("P1", "완전1도 (유니즌)", 1),
            Triple("m2", "단2도", 2),
            Triple("M2", "장2도", 1),
            Triple("m3", "단3도", 1),
            Triple("M3", "장3도", 1),
            Triple("P4", "완전4도", 1),
            Triple("TT", "증4도/감5도 (삼전음)", 3),
            Triple("P5", "완전5도", 1),
            Triple("m6", "단6도", 2),
            Triple("M6", "장6도", 2),
            Triple("m7", "단7도", 2),
            Triple("M7", "장7도", 3),
            Triple("P8", "완전8도 (옥타브)", 1)
        )
        
        val availableIntervals = basicIntervals.filter { it.third <= maxDifficulty }
        
        repeat(count) {
            val (interval, description, difficulty) = availableIntervals.random()
            
            val question = QuizQuestion(
                type = QuizType.INTERVAL,
                question = "다음 음정의 이름은 무엇인가요? 🎼",
                answer = interval,
                explanation = "${interval}은 ${description}입니다.",
                difficulty = difficulty
            )
            
            // 선택지 생성
            val choices = generateIntervalChoicesFromList(interval, availableIntervals)
            choices.forEach { choiceText ->
                val choice = QuizChoice(text = choiceText)
                question.addChoice(choice)
            }
            
            questions.add(question)
        }
        
        return questions
    }
    
    /**
     * 스케일 문제 생성 (향후 DB 기반으로 확장 가능)
     */
    fun generateScaleQuestions(count: Int, maxDifficulty: Int = 3): List<QuizQuestion> {
        val questions = mutableListOf<QuizQuestion>()
        
        // 현재는 기본 스케일들로 구성 (향후 DB 테이블로 이전 예정)
        val basicScales = listOf(
            Triple("major", "메이저 스케일 - 밝고 안정적인 사운드", 1),
            Triple("natural minor", "내추럴 마이너 스케일 - 어둡고 슬픈 느낌", 1),
            Triple("dorian", "도리안 모드 - 재즈와 팝에서 자주 사용", 2),
            Triple("phrygian", "프리지안 모드 - 스페인 풍의 이국적 사운드", 2),
            Triple("lydian", "리디안 모드 - 꿈같고 환상적인 사운드", 2),
            Triple("mixolydian", "믹소리디안 모드 - 블루스와 록에서 사용", 2),
            Triple("locrian", "로크리안 모드 - 매우 불안정한 사운드", 3),
            Triple("harmonic minor", "하모닉 마이너 - 클래식과 네오클래식", 2),
            Triple("melodic minor", "멜로딕 마이너 - 재즈에서 중요한 스케일", 3),
            Triple("pentatonic major", "펜타토닉 메이저 - 동양적 느낌", 1),
            Triple("pentatonic minor", "펜타토닉 마이너 - 블루스와 록의 핵심", 1),
            Triple("blues", "블루스 스케일 - 블루스의 영혼", 2)
        )
        
        val availableScales = basicScales.filter { it.third <= maxDifficulty }
        
        repeat(count) {
            val (scale, description, difficulty) = availableScales.random()
            
            val question = QuizQuestion(
                type = QuizType.SCALE,
                question = "다음 스케일의 이름은 무엇인가요? 🎵",
                answer = scale,
                explanation = "${scale}은 ${description}입니다.",
                difficulty = difficulty
            )
            
            // 선택지 생성
            val choices = generateScaleChoicesFromList(scale, availableScales)
            choices.forEach { choiceText ->
                val choice = QuizChoice(text = choiceText)
                question.addChoice(choice)
            }
            
            questions.add(question)
        }
        
        return questions
    }
    
    // === DB 기반 선택지 생성 메서드들 ===
    
    /**
     * DB 기반 코드 선택지 생성
     */
    private fun generateChordChoicesFromDB(
        correctChord: String, 
        roots: List<ScaleRoot>, 
        chordTypes: List<ChordType>
    ): List<String> {
        val choices = mutableSetOf(correctChord)
        
        while (choices.size < 4) {
            val randomRoot = roots.random()
            val randomChordType = chordTypes.random()
            val randomChord = "${randomRoot.name}${randomChordType.symbol}"
            choices.add(randomChord)
        }
        
        return choices.shuffled()
    }
    
    /**
     * DB 기반 화성 진행 선택지 생성
     */
    private fun generateProgressionChoicesFromDB(
        correctProgression: ProgressionPattern,
        availableProgressions: List<ProgressionPattern>
    ): List<String> {
        val choices = mutableSetOf(correctProgression.pattern)
        
        while (choices.size < 4) {
            val randomProgression = availableProgressions.random()
            choices.add(randomProgression.pattern)
        }
        
        return choices.shuffled()
    }
    
    /**
     * 리스트 기반 음정 선택지 생성
     */
    private fun generateIntervalChoicesFromList(
        correctInterval: String,
        availableIntervals: List<Triple<String, String, Int>>
    ): List<String> {
        val choices = mutableSetOf(correctInterval)
        
        while (choices.size < 4) {
            val randomInterval = availableIntervals.random()
            choices.add(randomInterval.first)
        }
        
        return choices.shuffled()
    }
    
    /**
     * 리스트 기반 스케일 선택지 생성
     */
    private fun generateScaleChoicesFromList(
        correctScale: String,
        availableScales: List<Triple<String, String, Int>>
    ): List<String> {
        val choices = mutableSetOf(correctScale)
        
        while (choices.size < 4) {
            val randomScale = availableScales.random()
            choices.add(randomScale.first)
        }
        
        return choices.shuffled()
    }
    
    // === 통합 생성 메서드 ===
    
    /**
     * 타입별 랜덤 문제 생성
     */
    @Transactional
    fun generateQuestionsByType(type: QuizType, count: Int, maxDifficulty: Int = 3): List<QuizQuestion> {
        return when (type) {
            QuizType.CHORD_NAME -> generateChordQuestions(count, maxDifficulty)
            QuizType.PROGRESSION -> generateProgressionQuestions(count, maxDifficulty)
            QuizType.INTERVAL -> generateIntervalQuestions(count, maxDifficulty)
            QuizType.SCALE -> generateScaleQuestions(count, maxDifficulty)
        }
    }
    
    /**
     * 난이도별 혼합 문제 생성
     */
    @Transactional
    fun generateMixedQuestions(totalCount: Int, maxDifficulty: Int = 3): List<QuizQuestion> {
        val questions = mutableListOf<QuizQuestion>()
        val types = QuizType.values()
        val countPerType = totalCount / types.size
        val remainder = totalCount % types.size
        
        types.forEachIndexed { index, type ->
            val count = countPerType + if (index < remainder) 1 else 0
            questions.addAll(generateQuestionsByType(type, count, maxDifficulty))
        }
        
        return questions.shuffled()
    }
    
    /**
     * 저장된 문제 생성 (DB에 실제로 저장)
     */
    @Transactional
    fun generateAndSaveQuestions(type: QuizType, count: Int, maxDifficulty: Int = 3): List<QuizQuestion> {
        val questions = generateQuestionsByType(type, count, maxDifficulty)
        return quizQuestionRepository.saveAll(questions)
    }
}