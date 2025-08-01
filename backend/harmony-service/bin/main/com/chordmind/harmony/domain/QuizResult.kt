package com.chordmind.harmony.domain

import jakarta.persistence.*
import java.time.LocalDateTime

@Entity
@Table(name = "quiz_result")
data class QuizResult(
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Long = 0,

    val userId: Long,

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "question_id")
    val question: QuizQuestion,

    val selected: String,
    val correct: Boolean,
    val answeredAt: LocalDateTime = LocalDateTime.now()
) 