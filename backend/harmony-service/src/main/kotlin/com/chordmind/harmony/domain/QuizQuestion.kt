package com.chordmind.harmony.domain

import jakarta.persistence.*

@Entity
@Table(name = "quiz_question")
enum class QuizType { CHORD_NAME, PROGRESSION, INTERVAL, SCALE }

@Entity
@Table(name = "quiz_question")
data class QuizQuestion(
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Long = 0,

    @Enumerated(EnumType.STRING)
    val type: QuizType,

    val question: String,
    val imageUrl: String? = null,
    val answer: String,
    val explanation: String? = null,
    val difficulty: Int = 1,

    @OneToMany(mappedBy = "question", cascade = [CascadeType.ALL], fetch = FetchType.EAGER, orphanRemoval = true)
    val choices: MutableList<QuizChoice> = mutableListOf()
) {
    fun addChoice(choice: QuizChoice) {
        choices.add(choice)
        choice.question = this
    }
}

@Entity
@Table(name = "quiz_choice")
data class QuizChoice(
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Long = 0,
    val text: String,
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "question_id")
    var question: QuizQuestion? = null
) 