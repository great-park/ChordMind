package com.chordmind.harmony.service.quiz.choice

import com.chordmind.harmony.domain.*
import com.chordmind.harmony.service.quiz.config.QuizConfig
import org.springframework.stereotype.Component

@Component
class ChoiceGenerator {
    
    fun generateChordChoices(
        correctAnswer: String,
        roots: List<ScaleRoot>,
        chordTypes: List<ChordType>,
        choiceCount: Int = QuizConfig.DEFAULT_CHOICE_COUNT
    ): List<String> {
        // 유일한 후보군을 미리 생성하여 무한 루프 방지
        val pool = buildSet {
            roots.forEach { root ->
                chordTypes.forEach { chordType ->
                    add("${root.name}${chordType.symbol}")
                }
            }
        }.minus(correctAnswer)

        if (pool.isEmpty()) return listOf(correctAnswer)

        val distractorCount = (choiceCount - 1).coerceAtLeast(0)
        val initial = pool.shuffled().take(distractorCount).toMutableList()

        // 부족하면 합성 선택지로 보충 (테스트 안정성 보장)
        if (initial.size < distractorCount) {
            val needed = distractorCount - initial.size
            initial += synthesizeVariants(correctAnswer, needed, existing = (pool + initial).toSet())
        }

        return (listOf(correctAnswer) + initial).distinct().take(choiceCount).shuffled()
    }
    
    fun <T> generateGenericChoices(
        correctAnswer: String,
        availableOptions: List<T>,
        valueExtractor: (T) -> String,
        choiceCount: Int = QuizConfig.DEFAULT_CHOICE_COUNT
    ): List<String> {
        // 유니크 값 풀을 구성하고 정답을 제외한 뒤 샘플링 (무한 루프 방지)
        val pool = availableOptions
            .asSequence()
            .map(valueExtractor)
            .filter { it.isNotBlank() }
            .toSet()
            .minus(correctAnswer)

        if (pool.isEmpty()) return listOf(correctAnswer)

        val distractorCount = (choiceCount - 1).coerceAtLeast(0)
        val initial = pool.shuffled().take(distractorCount).toMutableList()

        if (initial.size < distractorCount) {
            val needed = distractorCount - initial.size
            initial += synthesizeVariants(correctAnswer, needed, existing = (pool + initial).toSet())
        }

        return (listOf(correctAnswer) + initial).distinct().take(choiceCount).shuffled()

    }

    private fun synthesizeVariants(base: String, count: Int, existing: Set<String>): List<String> {
        val variants = mutableListOf<String>()
        var idx = 1
        val tokens = base.split('-', ' ', ',', '.')
            .filter { it.isNotBlank() }
        while (variants.size < count) {
            val candidate = when {
                tokens.size >= 2 -> tokens.asReversed().joinToString("-") + "-$idx"
                base.any { it.isDigit() } -> base.replace(Regex("\\d+")) { m ->
                    (m.value.toIntOrNull()?.plus(1) ?: 1).toString()
                } + "-$idx"
                else -> "$base-$idx"
            }
            if (candidate != base && candidate !in existing && candidate !in variants) {
                variants += candidate
            }
            idx++
        }
        return variants
    }
}