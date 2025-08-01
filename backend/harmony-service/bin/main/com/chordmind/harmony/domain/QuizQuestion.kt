package com.chordmind.harmony.domain

import jakarta.persistence.*

enum class QuizType { CHORD_NAME, PROGRESSION, INTERVAL, SCALE }

@Entity
@Table(name = "quiz_question")
data class QuizQuestion(
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Long = 0,

    @Enumerated(EnumType.STRING)
    var type: QuizType,

    var question: String,
    var imageUrl: String? = null,
    var answer: String,
    var explanation: String? = null,
    var difficulty: Int = 1,

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