package com.chordmind.harmony.service

import com.chordmind.harmony.domain.QuizChoice
import com.chordmind.harmony.domain.QuizQuestion
import com.chordmind.harmony.domain.QuizType
import com.chordmind.harmony.repository.QuizQuestionRepository
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional

@Service
class QuizGeneratorService(
    private val quizQuestionRepository: QuizQuestionRepository
) {
    
    fun generateChordQuestions(count: Int): List<QuizQuestion> {
        val questions = mutableListOf<QuizQuestion>()
        
        val chordTypes = listOf("maj", "min", "dim", "aug", "7", "maj7", "min7", "dim7", "sus2", "sus4")
        val roots = listOf("C", "D", "E", "F", "G", "A", "B")
        
        repeat(count) {
            val root = roots.random()
            val chordType = chordTypes.random()
            val chord = "$root$chordType"
            
            val question = QuizQuestion(
                type = QuizType.CHORD_NAME,
                question = "다음 코드의 이름은 무엇인가요?",
                answer = chord,
                explanation = "${chord}는 ${getChordDescription(chord)}입니다.",
                difficulty = getDifficulty(chordType)
            )
            
            // 선택지 생성
            val choices = generateChordChoices(chord, roots, chordTypes)
            choices.forEach { choiceText ->
                val choice = QuizChoice(text = choiceText)
                question.addChoice(choice)
            }
            
            questions.add(question)
        }
        
        return questions
    }
    
    fun generateProgressionQuestions(count: Int): List<QuizQuestion> {
        val questions = mutableListOf<QuizQuestion>()
        
        val progressions = listOf(
            "I-IV-V" to "기본적인 화성 진행",
            "ii-V-I" to "재즈에서 자주 사용되는 2-5-1 진행",
            "I-V-vi-IV" to "팝 음악에서 자주 사용되는 진행",
            "I-vi-IV-V" to "감성적인 화성 진행",
            "vi-IV-I-V" to "현대적인 화성 진행"
        )
        
        repeat(count) {
            val (progression, description) = progressions.random()
            
            val question = QuizQuestion(
                type = QuizType.PROGRESSION,
                question = "다음 화성 진행의 이름은 무엇인가요?",
                answer = progression,
                explanation = "${progression}는 ${description}입니다.",
                difficulty = getProgressionDifficulty(progression)
            )
            
            // 선택지 생성
            val choices = generateProgressionChoices(progression, progressions)
            choices.forEach { choiceText ->
                val choice = QuizChoice(text = choiceText)
                question.addChoice(choice)
            }
            
            questions.add(question)
        }
        
        return questions
    }
    
    fun generateIntervalQuestions(count: Int): List<QuizQuestion> {
        val questions = mutableListOf<QuizQuestion>()
        
        val intervals = listOf(
            "P1" to "완전1도",
            "P4" to "완전4도",
            "P5" to "완전5도",
            "P8" to "완전8도",
            "M2" to "장2도",
            "M3" to "장3도",
            "M6" to "장6도",
            "M7" to "장7도",
            "m2" to "단2도",
            "m3" to "단3도",
            "m6" to "단6도",
            "m7" to "단7도"
        )
        
        repeat(count) {
            val (interval, description) = intervals.random()
            
            val question = QuizQuestion(
                type = QuizType.INTERVAL,
                question = "다음 음정의 이름은 무엇인가요?",
                answer = interval,
                explanation = "${interval}는 ${description}입니다.",
                difficulty = getIntervalDifficulty(interval)
            )
            
            // 선택지 생성
            val choices = generateIntervalChoices(interval, intervals)
            choices.forEach { choiceText ->
                val choice = QuizChoice(text = choiceText)
                question.addChoice(choice)
            }
            
            questions.add(question)
        }
        
        return questions
    }
    
    fun generateScaleQuestions(count: Int): List<QuizQuestion> {
        val questions = mutableListOf<QuizQuestion>()
        
        val scales = listOf(
            "major" to "장음계",
            "minor" to "단음계",
            "pentatonic" to "5음음계",
            "blues" to "블루스 스케일",
            "dorian" to "도리안 모드",
            "mixolydian" to "믹솔리디안 모드"
        )
        
        repeat(count) {
            val (scale, description) = scales.random()
            
            val question = QuizQuestion(
                type = QuizType.SCALE,
                question = "다음 음계의 이름은 무엇인가요?",
                answer = scale,
                explanation = "${scale}는 ${description}입니다.",
                difficulty = getScaleDifficulty(scale)
            )
            
            // 선택지 생성
            val choices = generateScaleChoices(scale, scales)
            choices.forEach { choiceText ->
                val choice = QuizChoice(text = choiceText)
                question.addChoice(choice)
            }
            
            questions.add(question)
        }
        
        return questions
    }
    
    @Transactional
    fun generateAndSaveQuestions(type: QuizType, count: Int): List<QuizQuestion> {
        val questions = when (type) {
            QuizType.CHORD_NAME -> generateChordQuestions(count)
            QuizType.PROGRESSION -> generateProgressionQuestions(count)
            QuizType.INTERVAL -> generateIntervalQuestions(count)
            QuizType.SCALE -> generateScaleQuestions(count)
        }
        
        return quizQuestionRepository.saveAll(questions)
    }
    
    private fun generateChordChoices(correctChord: String, roots: List<String>, chordTypes: List<String>): List<String> {
        val choices = mutableListOf(correctChord)
        
        while (choices.size < 4) {
            val randomChord = "${roots.random()}${chordTypes.random()}"
            if (!choices.contains(randomChord)) {
                choices.add(randomChord)
            }
        }
        
        return choices.shuffled()
    }
    
    private fun generateProgressionChoices(correctProgression: String, progressions: List<Pair<String, String>>): List<String> {
        val choices = mutableListOf(correctProgression)
        
        while (choices.size < 4) {
            val randomProgression = progressions.random().first
            if (!choices.contains(randomProgression)) {
                choices.add(randomProgression)
            }
        }
        
        return choices.shuffled()
    }
    
    private fun generateIntervalChoices(correctInterval: String, intervals: List<Pair<String, String>>): List<String> {
        val choices = mutableListOf(correctInterval)
        
        while (choices.size < 4) {
            val randomInterval = intervals.random().first
            if (!choices.contains(randomInterval)) {
                choices.add(randomInterval)
            }
        }
        
        return choices.shuffled()
    }
    
    private fun generateScaleChoices(correctScale: String, scales: List<Pair<String, String>>): List<String> {
        val choices = mutableListOf(correctScale)
        
        while (choices.size < 4) {
            val randomScale = scales.random().first
            if (!choices.contains(randomScale)) {
                choices.add(randomScale)
            }
        }
        
        return choices.shuffled()
    }
    
    private fun getChordDescription(chord: String): String {
        return when {
            chord.contains("maj") -> "장3화음"
            chord.contains("min") -> "단3화음"
            chord.contains("dim") -> "감3화음"
            chord.contains("aug") -> "증3화음"
            chord.contains("7") -> "7화음"
            chord.contains("sus") -> "서스펜션 코드"
            else -> "기본 3화음"
        }
    }
    
    private fun getDifficulty(chordType: String): Int {
        return when {
            chordType.contains("maj") || chordType.contains("min") -> 1
            chordType.contains("7") -> 2
            chordType.contains("dim") || chordType.contains("aug") -> 3
            chordType.contains("sus") -> 2
            else -> 1
        }
    }
    
    private fun getProgressionDifficulty(progression: String): Int {
        return when {
            progression.contains("I-IV-V") -> 1
            progression.contains("I-V-vi-IV") -> 2
            progression.contains("ii-V-I") -> 3
            else -> 2
        }
    }
    
    private fun getIntervalDifficulty(interval: String): Int {
        return when {
            interval.contains("P1") || interval.contains("P8") -> 1
            interval.contains("P4") || interval.contains("P5") -> 1
            interval.contains("M3") || interval.contains("m3") -> 2
            interval.contains("M6") || interval.contains("m6") -> 2
            interval.contains("M2") || interval.contains("m2") -> 3
            interval.contains("M7") || interval.contains("m7") -> 3
            else -> 2
        }
    }
    
    private fun getScaleDifficulty(scale: String): Int {
        return when {
            scale.contains("major") || scale.contains("minor") -> 1
            scale.contains("pentatonic") -> 2
            scale.contains("blues") -> 2
            scale.contains("dorian") || scale.contains("mixolydian") -> 3
            else -> 2
        }
    }
} 