package com.chordmind.harmony.config

import com.chordmind.harmony.domain.*
import com.chordmind.harmony.repository.QuizQuestionRepository
import org.springframework.boot.CommandLineRunner
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration

@Configuration
class DataInitializer {
    @Bean
    fun initQuizData(quizQuestionRepository: QuizQuestionRepository) = CommandLineRunner {
        if (quizQuestionRepository.count() == 0L) {
            val q1 = QuizQuestion(
                type = QuizType.CHORD_NAME,
                question = "다음 악보의 코드 이름은?",
                imageUrl = null,
                answer = "Cmaj7",
                explanation = "C, E, G, B로 구성된 4화음은 Cmaj7입니다.",
                difficulty = 1
            )
            listOf("Cmaj7", "Am7", "G7", "F#m7b5").forEach { q1.addChoice(QuizChoice(text = it)) }

            val q2 = QuizQuestion(
                type = QuizType.CHORD_NAME,
                question = "다음 음의 조합에 해당하는 코드는? (A, C, E, G)",
                imageUrl = null,
                answer = "Am7",
                explanation = "A, C, E, G는 Am7(라-도-미-솔) 코드입니다.",
                difficulty = 1
            )
            listOf("Am7", "Cmaj7", "F7", "Dm7").forEach { q2.addChoice(QuizChoice(text = it)) }

            val q3 = QuizQuestion(
                type = QuizType.PROGRESSION,
                question = "다음 코드 진행의 빈칸에 들어갈 코드는? (C - ? - Am - F)",
                imageUrl = null,
                answer = "G7",
                explanation = "C - G7 - Am - F는 대표적인 코드 진행입니다.",
                difficulty = 2
            )
            listOf("G7", "Am", "F", "C").forEach { q3.addChoice(QuizChoice(text = it)) }

            val q4 = QuizQuestion(
                type = QuizType.INTERVAL,
                question = "C와 G 사이의 음정은?",
                imageUrl = null,
                answer = "Perfect 5th",
                explanation = "C에서 G는 완전 5도(Perfect 5th)입니다.",
                difficulty = 1
            )
            listOf("Perfect 5th", "Major 3rd", "Minor 6th", "Perfect 4th").forEach { q4.addChoice(QuizChoice(text = it)) }

            val q5 = QuizQuestion(
                type = QuizType.SCALE,
                question = "다음 음계는 어떤 스케일인가? (C, D, E, F, G, A, B)",
                imageUrl = null,
                answer = "C Major",
                explanation = "C, D, E, F, G, A, B는 C Major 스케일입니다.",
                difficulty = 1
            )
            listOf("C Major", "A Minor", "G Major", "F Major").forEach { q5.addChoice(QuizChoice(text = it)) }

            quizQuestionRepository.saveAll(listOf(q1, q2, q3, q4, q5))
        }
    }
} 