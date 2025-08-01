package com.chordmind.harmony.service

import com.chordmind.harmony.domain.QuizType
import org.springframework.stereotype.Service
import java.time.LocalDateTime
import java.util.*

@Service
class AIExplanationService {
    
    fun generateExplanation(
        questionType: QuizType,
        question: String,
        correctAnswer: String,
        userAnswer: String,
        isCorrect: Boolean
    ): String {
        return when (questionType) {
            QuizType.CHORD_NAME -> generateChordExplanation(correctAnswer, userAnswer, isCorrect)
            QuizType.PROGRESSION -> generateProgressionExplanation(correctAnswer, userAnswer, isCorrect)
            QuizType.INTERVAL -> generateIntervalExplanation(correctAnswer, userAnswer, isCorrect)
            QuizType.SCALE -> generateScaleExplanation(correctAnswer, userAnswer, isCorrect)
        }
    }
    
    fun generatePersonalizedFeedback(
        userId: Long,
        questionType: QuizType,
        userAnswer: String,
        correctAnswer: String,
        isCorrect: Boolean,
        userHistory: List<Map<String, Any>>
    ): String {
        val baseExplanation = generateExplanation(questionType, "", correctAnswer, userAnswer, isCorrect)
        val personalizedAdvice = generatePersonalizedAdvice(userHistory, questionType, isCorrect)
        
        return if (isCorrect) {
            "$baseExplanation\n\n$personalizedAdvice"
        } else {
            "$baseExplanation\n\n$personalizedAdvice"
        }
    }
    
    fun generateLearningPath(userId: Long, userStats: Map<String, Any>): Map<String, Any> {
        val typeStats = userStats["typeStats"] as? Map<String, Map<String, Any>> ?: emptyMap()
        val overallAccuracy = userStats["accuracy"] as? Double ?: 0.0
        
        val recommendations = mutableListOf<String>()
        val nextTopics = mutableListOf<String>()
        
        // 약점 영역 분석
        typeStats.forEach { (type, stats) ->
            val accuracy = stats["accuracy"] as? Double ?: 0.0
            if (accuracy < 70.0) {
                recommendations.add("${getTypeLabel(type)} 영역을 집중적으로 연습하세요.")
                nextTopics.add(getNextTopicForType(type))
            }
        }
        
        // 전체 성과 기반 추천
        when {
            overallAccuracy < 50.0 -> {
                recommendations.add("기본 개념부터 차근차근 학습하세요.")
                nextTopics.add("기본 음악 이론")
            }
            overallAccuracy < 70.0 -> {
                recommendations.add("약점 영역을 집중적으로 연습하세요.")
                nextTopics.add("고급 화성학")
            }
            overallAccuracy < 90.0 -> {
                recommendations.add("고급 문제에 도전해보세요.")
                nextTopics.add("재즈 화성학")
            }
            else -> {
                recommendations.add("훌륭합니다! 새로운 도전을 시도해보세요.")
                nextTopics.add("작곡 이론")
            }
        }
        
        return mapOf(
            "recommendations" to recommendations,
            "nextTopics" to nextTopics,
            "estimatedTime" to calculateEstimatedTime(typeStats),
            "difficultyLevel" to determineDifficultyLevel(overallAccuracy)
        )
    }
    
    fun generateAdaptiveQuestion(
        userHistory: List<Map<String, Any>>,
        questionType: QuizType
    ): Map<String, Any> {
        val userPerformance = analyzeUserPerformance(userHistory, questionType)
        val difficulty = determineAdaptiveDifficulty(userPerformance)
        val questionPattern = selectQuestionPattern(userPerformance, questionType)
        
        return mapOf(
            "type" to questionType,
            "difficulty" to difficulty,
            "pattern" to questionPattern,
            "estimatedTime" to calculateQuestionTime(difficulty),
            "hints" to generateHints(difficulty, questionType)
        )
    }
    
    fun analyzeUserBehavior(userHistory: List<Map<String, Any>>): Map<String, Any> {
        val totalAttempts = userHistory.size
        val correctAnswers = userHistory.count { it["correct"] as? Boolean == true }
        val averageTime = userHistory.mapNotNull { it["timeSpent"] as? Long }.average()
        
        val timePatterns = analyzeTimePatterns(userHistory)
        val difficultyPreference = analyzeDifficultyPreference(userHistory)
        val learningStyle = determineLearningStyle(userHistory)
        
        return mapOf(
            "totalAttempts" to totalAttempts,
            "correctAnswers" to correctAnswers,
            "accuracy" to if (totalAttempts > 0) (correctAnswers.toDouble() / totalAttempts * 100) else 0.0,
            "averageTime" to averageTime,
            "timePatterns" to timePatterns,
            "difficultyPreference" to difficultyPreference,
            "learningStyle" to learningStyle,
            "improvementRate" to calculateImprovementRate(userHistory)
        )
    }
    
    fun analyzeUserPerformance(userHistory: List<Map<String, Any>>, questionType: QuizType): Map<String, Any> {
        val typeHistory = userHistory.filter { it["type"] == questionType }
        val correctCount = typeHistory.count { it["correct"] as? Boolean == true }
        val totalCount = typeHistory.size
        val accuracy = if (totalCount > 0) correctCount.toDouble() / totalCount else 0.0
        
        return mapOf(
            "accuracy" to accuracy,
            "totalAttempts" to totalCount,
            "recentPerformance" to typeHistory.takeLast(5).map { it["correct"] as? Boolean == true }
        )
    }
    
    private fun generateChordExplanation(correctAnswer: String, userAnswer: String, isCorrect: Boolean): String {
        return if (isCorrect) {
            "정답입니다! ${correctAnswer}는 ${getChordDescription(correctAnswer)}입니다. ${getChordCharacteristics(correctAnswer)}"
        } else {
            "틀렸습니다. 정답은 ${correctAnswer}입니다. ${getChordDescription(correctAnswer)} ${getCommonMistake(userAnswer, correctAnswer)}"
        }
    }
    
    private fun generateProgressionExplanation(correctAnswer: String, userAnswer: String, isCorrect: Boolean): String {
        return if (isCorrect) {
            "정답입니다! ${correctAnswer} 진행은 ${getProgressionDescription(correctAnswer)}입니다. ${getProgressionCharacteristics(correctAnswer)}"
        } else {
            "틀렸습니다. 정답은 ${correctAnswer}입니다. ${getProgressionDescription(correctAnswer)} ${getCommonMistake(userAnswer, correctAnswer)}"
        }
    }
    
    private fun generateIntervalExplanation(correctAnswer: String, userAnswer: String, isCorrect: Boolean): String {
        return if (isCorrect) {
            "정답입니다! ${correctAnswer}는 ${getIntervalDescription(correctAnswer)}입니다. ${getIntervalCharacteristics(correctAnswer)}"
        } else {
            "틀렸습니다. 정답은 ${correctAnswer}입니다. ${getIntervalDescription(correctAnswer)} ${getCommonMistake(userAnswer, correctAnswer)}"
        }
    }
    
    private fun generateScaleExplanation(correctAnswer: String, userAnswer: String, isCorrect: Boolean): String {
        return if (isCorrect) {
            "정답입니다! ${correctAnswer}는 ${getScaleDescription(correctAnswer)}입니다. ${getScaleCharacteristics(correctAnswer)}"
        } else {
            "틀렸습니다. 정답은 ${correctAnswer}입니다. ${getScaleDescription(correctAnswer)} ${getCommonMistake(userAnswer, correctAnswer)}"
        }
    }
    
    private fun generatePersonalizedAdvice(
        userHistory: List<Map<String, Any>>,
        questionType: QuizType,
        isCorrect: Boolean
    ): String {
        val recentPerformance = userHistory.takeLast(10)
        val typeAccuracy = recentPerformance
            .filter { it["type"] == questionType }
            .let { if (it.isNotEmpty()) it.count { item -> item["correct"] as? Boolean == true }.toDouble() / it.size else 0.0 }
        
        return when {
            isCorrect && typeAccuracy > 0.8 -> "이미 이 영역에서 뛰어난 실력을 보이고 있습니다!"
            isCorrect && typeAccuracy > 0.6 -> "좋은 진전입니다. 계속 연습하세요!"
            isCorrect -> "정답입니다! 이 영역에서 점점 실력이 향상되고 있습니다."
            !isCorrect && typeAccuracy < 0.4 -> "이 영역에서 어려움을 겪고 계시네요. 기본부터 차근차근 연습해보세요."
            !isCorrect -> "틀렸지만 괜찮습니다. 실수는 학습의 일부입니다. 다시 시도해보세요!"
            else -> "계속 연습하시면 실력이 향상될 것입니다."
        }
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
    
    private fun getChordCharacteristics(chord: String): String {
        return when {
            chord.contains("maj") -> "밝고 안정적인 느낌을 줍니다."
            chord.contains("min") -> "슬프고 우울한 느낌을 줍니다."
            chord.contains("dim") -> "불안하고 긴장된 느낌을 줍니다."
            chord.contains("aug") -> "신비롭고 불안정한 느낌을 줍니다."
            chord.contains("7") -> "재즈에서 자주 사용되는 화성적 색채를 줍니다."
            chord.contains("sus") -> "일시적으로 긴장감을 주는 색채를 줍니다."
            else -> "기본적인 화성적 기능을 합니다."
        }
    }
    
    private fun getProgressionDescription(progression: String): String {
        return when {
            progression.contains("I-IV-V") -> "기본적인 화성 진행"
            progression.contains("ii-V-I") -> "재즈에서 자주 사용되는 2-5-1 진행"
            progression.contains("I-V-vi-IV") -> "팝 음악에서 자주 사용되는 진행"
            else -> "일반적인 화성 진행"
        }
    }
    
    private fun getProgressionCharacteristics(progression: String): String {
        return when {
            progression.contains("I-IV-V") -> "강한 종지감을 만들어 완결성을 줍니다."
            progression.contains("ii-V-I") -> "재즈의 전형적인 화성 진행으로 풍부한 색채를 줍니다."
            progression.contains("I-V-vi-IV") -> "감성적이고 현대적인 느낌을 줍니다."
            else -> "안정적이고 자연스러운 화성 흐름을 만듭니다."
        }
    }
    
    private fun getIntervalDescription(interval: String): String {
        return when {
            interval.contains("P1") -> "완전1도"
            interval.contains("P4") -> "완전4도"
            interval.contains("P5") -> "완전5도"
            interval.contains("P8") -> "완전8도"
            interval.contains("M2") -> "장2도"
            interval.contains("M3") -> "장3도"
            interval.contains("M6") -> "장6도"
            interval.contains("M7") -> "장7도"
            interval.contains("m2") -> "단2도"
            interval.contains("m3") -> "단3도"
            interval.contains("m6") -> "단6도"
            interval.contains("m7") -> "단7도"
            else -> "음정"
        }
    }
    
    private fun getIntervalCharacteristics(interval: String): String {
        return when {
            interval.contains("P1") || interval.contains("P8") -> "완전히 조화로운 음정입니다."
            interval.contains("P4") || interval.contains("P5") -> "안정적이고 조화로운 음정입니다."
            interval.contains("M3") || interval.contains("m3") -> "화성의 기본을 이루는 음정입니다."
            interval.contains("M6") || interval.contains("m6") -> "풍부한 화성적 색채를 줍니다."
            interval.contains("M2") || interval.contains("m2") -> "긴장감을 주는 음정입니다."
            interval.contains("M7") || interval.contains("m7") -> "강한 불협화음입니다."
            else -> "화성적 기능을 하는 음정입니다."
        }
    }
    
    private fun getScaleDescription(scale: String): String {
        return when {
            scale.contains("major") -> "장음계"
            scale.contains("minor") -> "단음계"
            scale.contains("pentatonic") -> "5음음계"
            scale.contains("blues") -> "블루스 스케일"
            scale.contains("dorian") -> "도리안 모드"
            scale.contains("mixolydian") -> "믹솔리디안 모드"
            else -> "음계"
        }
    }
    
    private fun getScaleCharacteristics(scale: String): String {
        return when {
            scale.contains("major") -> "밝고 명확한 느낌을 줍니다."
            scale.contains("minor") -> "슬프고 우울한 느낌을 줍니다."
            scale.contains("pentatonic") -> "동양적인 느낌을 줍니다."
            scale.contains("blues") -> "블루스의 특징적인 느낌을 줍니다."
            scale.contains("dorian") -> "재즈에서 자주 사용되는 모드입니다."
            scale.contains("mixolydian") -> "재즈와 록에서 자주 사용됩니다."
            else -> "특정한 음악적 색채를 줍니다."
        }
    }
    
    private fun getCommonMistake(userAnswer: String, correctAnswer: String): String {
        return when {
            userAnswer.contains("maj") && correctAnswer.contains("min") -> "장조와 단조를 혼동하셨네요."
            userAnswer.contains("min") && correctAnswer.contains("maj") -> "단조와 장조를 혼동하셨네요."
            userAnswer.contains("7") && !correctAnswer.contains("7") -> "7화음과 기본 3화음을 혼동하셨네요."
            userAnswer.length < correctAnswer.length -> "더 자세한 분석이 필요합니다."
            userAnswer.length > correctAnswer.length -> "불필요한 정보를 포함하셨네요."
            else -> "비슷한 개념을 혼동하셨을 수 있습니다."
        }
    }
    
    private fun getTypeLabel(type: String): String {
        return when (type) {
            "CHORD_NAME" -> "코드 이름"
            "PROGRESSION" -> "화성 진행"
            "INTERVAL" -> "음정"
            "SCALE" -> "스케일"
            else -> type
        }
    }
    
    private fun getNextTopicForType(type: String): String {
        return when (type) {
            "CHORD_NAME" -> "고급 화성학"
            "PROGRESSION" -> "재즈 화성학"
            "INTERVAL" -> "고급 음정 이론"
            "SCALE" -> "모드 이론"
            else -> "음악 이론 심화"
        }
    }
    
    private fun calculateEstimatedTime(typeStats: Map<String, Map<String, Any>>): Int {
        val weakAreas = typeStats.count { (_, stats) ->
            (stats["accuracy"] as? Double ?: 0.0) < 70.0
        }
        return when {
            weakAreas >= 3 -> 120 // 2시간
            weakAreas >= 2 -> 90  // 1.5시간
            weakAreas >= 1 -> 60  // 1시간
            else -> 30 // 30분
        }
    }
    
    private fun determineDifficultyLevel(accuracy: Double): String {
        return when {
            accuracy >= 90.0 -> "고급"
            accuracy >= 70.0 -> "중급"
            accuracy >= 50.0 -> "초급"
            else -> "기초"
        }
    }
    
    private fun determineAdaptiveDifficulty(userPerformance: Map<String, Any>): Int {
        val accuracy = userPerformance["accuracy"] as? Double ?: 0.0
        val recentPerformance = userPerformance["recentPerformance"] as? List<Boolean> ?: emptyList()
        
        return when {
            accuracy >= 0.9 && recentPerformance.all { it } -> 3 // 고급
            accuracy >= 0.7 && recentPerformance.count { it } >= 3 -> 2 // 중급
            accuracy >= 0.5 -> 2 // 중급
            else -> 1 // 초급
        }
    }
    
    private fun selectQuestionPattern(userPerformance: Map<String, Any>, questionType: QuizType): String {
        val accuracy = userPerformance["accuracy"] as? Double ?: 0.0
        
        return when {
            accuracy < 0.5 -> "basic_pattern"
            accuracy < 0.7 -> "intermediate_pattern"
            accuracy < 0.9 -> "advanced_pattern"
            else -> "expert_pattern"
        }
    }
    
    private fun calculateQuestionTime(difficulty: Int): Int {
        return when (difficulty) {
            1 -> 30 // 30초
            2 -> 45 // 45초
            3 -> 60 // 60초
            else -> 30
        }
    }
    
    private fun generateHints(difficulty: Int, questionType: QuizType): List<String> {
        return when (questionType) {
            QuizType.CHORD_NAME -> when (difficulty) {
                1 -> listOf("3화음의 기본 구조를 생각해보세요", "장조는 밝고, 단조는 어둡습니다")
                2 -> listOf("7화음의 구조를 분석해보세요", "서스펜션 코드의 특징을 기억하세요")
                3 -> listOf("복합 화성의 구조를 파악하세요", "고급 화성학 이론을 적용하세요")
                else -> emptyList()
            }
            QuizType.PROGRESSION -> when (difficulty) {
                1 -> listOf("기본 화성 진행을 기억하세요", "I-IV-V 진행을 생각해보세요")
                2 -> listOf("재즈 진행의 특징을 분석하세요", "2-5-1 진행을 기억하세요")
                3 -> listOf("복합 화성 진행을 파악하세요", "고급 화성학 이론을 적용하세요")
                else -> emptyList()
            }
            QuizType.INTERVAL -> when (difficulty) {
                1 -> listOf("음정의 기본 개념을 기억하세요", "완전음정과 불완전음정을 구분하세요")
                2 -> listOf("복합음정의 구조를 분석하세요", "화성적 기능을 고려하세요")
                3 -> listOf("고급 음정 이론을 적용하세요", "색채적 기능을 분석하세요")
                else -> emptyList()
            }
            QuizType.SCALE -> when (difficulty) {
                1 -> listOf("음계의 기본 구조를 기억하세요", "장음계와 단음계를 구분하세요")
                2 -> listOf("모드의 특징을 분석하세요", "색채적 기능을 고려하세요")
                3 -> listOf("고급 스케일 이론을 적용하세요", "복합 스케일을 분석하세요")
                else -> emptyList()
            }
        }
    }
    
    private fun analyzeTimePatterns(userHistory: List<Map<String, Any>>): Map<String, Any> {
        val times = userHistory.mapNotNull { it["timeSpent"] as? Long }
        val averageTime = times.average()
        val fastAnswers = times.count { it < averageTime * 0.7 }
        val slowAnswers = times.count { it > averageTime * 1.3 }
        
        return mapOf(
            "averageTime" to averageTime,
            "fastAnswers" to fastAnswers,
            "slowAnswers" to slowAnswers,
            "timeConsistency" to if (slowAnswers < fastAnswers) "빠른 응답" else "신중한 응답"
        )
    }
    
    private fun analyzeDifficultyPreference(userHistory: List<Map<String, Any>>): Map<String, Any> {
        val difficulties = userHistory.mapNotNull { it["difficulty"] as? Int }
        val avgDifficulty = difficulties.average()
        val preference = when {
            avgDifficulty > 2.5 -> "고급 선호"
            avgDifficulty > 1.5 -> "중급 선호"
            else -> "초급 선호"
        }
        
        return mapOf(
            "averageDifficulty" to avgDifficulty,
            "preference" to preference,
            "comfortZone" to when {
                avgDifficulty > 2.5 -> "도전적"
                avgDifficulty > 1.5 -> "적당함"
                else -> "안전함"
            }
        )
    }
    
    private fun determineLearningStyle(userHistory: List<Map<String, Any>>): String {
        val times = userHistory.mapNotNull { it["timeSpent"] as? Long }
        val avgTime = times.average()
        val accuracy = userHistory.count { it["correct"] as? Boolean == true }.toDouble() / userHistory.size
        
        return when {
            avgTime < 30 && accuracy > 0.8 -> "직관적 학습자"
            avgTime > 60 && accuracy > 0.7 -> "분석적 학습자"
            accuracy < 0.5 -> "기초 학습자"
            else -> "균형잡힌 학습자"
        }
    }
    
    private fun calculateImprovementRate(userHistory: List<Map<String, Any>>): Double {
        if (userHistory.size < 10) return 0.0
        
        val firstHalf = userHistory.take(userHistory.size / 2)
        val secondHalf = userHistory.takeLast(userHistory.size / 2)
        
        val firstAccuracy = firstHalf.count { it["correct"] as? Boolean == true }.toDouble() / firstHalf.size
        val secondAccuracy = secondHalf.count { it["correct"] as? Boolean == true }.toDouble() / secondHalf.size
        
        return if (firstAccuracy > 0) ((secondAccuracy - firstAccuracy) / firstAccuracy) * 100 else 0.0
    }
} 