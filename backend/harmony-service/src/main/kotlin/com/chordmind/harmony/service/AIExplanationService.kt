package com.chordmind.harmony.service

import com.chordmind.harmony.domain.QuizType
import org.springframework.stereotype.Service

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
    
    private fun generateChordExplanation(correctAnswer: String, userAnswer: String, isCorrect: Boolean): String {
        return if (isCorrect) {
            "정답입니다! ${correctAnswer}는 ${getChordDescription(correctAnswer)}입니다."
        } else {
            "틀렸습니다. 정답은 ${correctAnswer}입니다."
        }
    }
    
    private fun generateProgressionExplanation(correctAnswer: String, userAnswer: String, isCorrect: Boolean): String {
        return if (isCorrect) {
            "정답입니다! ${correctAnswer} 진행은 ${getProgressionDescription(correctAnswer)}입니다."
        } else {
            "틀렸습니다. 정답은 ${correctAnswer}입니다."
        }
    }
    
    private fun generateIntervalExplanation(correctAnswer: String, userAnswer: String, isCorrect: Boolean): String {
        return if (isCorrect) {
            "정답입니다! ${correctAnswer}는 ${getIntervalDescription(correctAnswer)}입니다."
        } else {
            "틀렸습니다. 정답은 ${correctAnswer}입니다."
        }
    }
    
    private fun generateScaleExplanation(correctAnswer: String, userAnswer: String, isCorrect: Boolean): String {
        return if (isCorrect) {
            "정답입니다! ${correctAnswer}는 ${getScaleDescription(correctAnswer)}입니다."
        } else {
            "틀렸습니다. 정답은 ${correctAnswer}입니다."
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
    
    private fun getProgressionDescription(progression: String): String {
        return when {
            progression.contains("I-IV-V") -> "기본적인 화성 진행"
            progression.contains("ii-V-I") -> "재즈에서 자주 사용되는 2-5-1 진행"
            progression.contains("I-V-vi-IV") -> "팝 음악에서 자주 사용되는 진행"
            else -> "일반적인 화성 진행"
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
} 