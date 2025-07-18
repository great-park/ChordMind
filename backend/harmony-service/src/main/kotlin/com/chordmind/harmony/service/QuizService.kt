package com.chordmind.harmony.service

import com.chordmind.harmony.domain.QuizQuestion
import com.chordmind.harmony.domain.QuizType
import com.chordmind.harmony.dto.QuizAnswerRequest
import com.chordmind.harmony.dto.QuizAnswerResult
import org.springframework.stereotype.Service

@Service
class QuizService {
    // 샘플 퀴즈 데이터 (실제 서비스에서는 DB/파일/AI 등으로 확장 가능)
    private val questions = listOf(
        QuizQuestion(
            id = 1L,
            type = QuizType.CHORD_NAME,
            question = "다음 악보의 코드 이름은?",
            imageUrl = null, // TODO: 샘플 이미지 경로
            choices = listOf("Cmaj7", "Am7", "G7", "F#m7b5"),
            answer = "Cmaj7",
            explanation = "C, E, G, B로 구성된 4화음은 Cmaj7입니다.",
            difficulty = 1
        ),
        QuizQuestion(
            id = 2L,
            type = QuizType.CHORD_NAME,
            question = "다음 음의 조합에 해당하는 코드는? (A, C, E, G)",
            imageUrl = null,
            choices = listOf("Am7", "Cmaj7", "F7", "Dm7"),
            answer = "Am7",
            explanation = "A, C, E, G는 Am7(라-도-미-솔) 코드입니다.",
            difficulty = 1
        )
    )

    fun getRandomQuestions(type: QuizType, count: Int): List<QuizQuestion> {
        return questions.filter { it.type == type }.shuffled().take(count)
    }

    fun checkAnswer(request: QuizAnswerRequest): QuizAnswerResult {
        val question = questions.find { it.id == request.questionId }
            ?: return QuizAnswerResult(request.questionId, false, null)
        val correct = question.answer.equals(request.selected, ignoreCase = true)
        return QuizAnswerResult(
            questionId = question.id,
            correct = correct,
            explanation = question.explanation
        )
    }
} 