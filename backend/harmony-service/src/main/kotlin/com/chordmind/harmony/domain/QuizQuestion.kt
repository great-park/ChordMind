package com.chordmind.harmony.domain

enum class QuizType { CHORD_NAME, PROGRESSION, INTERVAL, SCALE }

data class QuizQuestion(
    val id: Long,
    val type: QuizType,
    val question: String,
    val imageUrl: String? = null,
    val choices: List<String>,
    val answer: String,
    val explanation: String? = null,
    val difficulty: Int = 1
) 