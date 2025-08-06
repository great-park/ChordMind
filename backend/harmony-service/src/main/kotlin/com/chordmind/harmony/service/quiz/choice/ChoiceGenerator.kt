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
        val choices = mutableSetOf(correctAnswer)
        
        while (choices.size < choiceCount) {
            val randomRoot = roots.random()
            val randomChordType = chordTypes.random()
            val randomChord = "${randomRoot.name}${randomChordType.symbol}"
            choices.add(randomChord)
        }
        
        return choices.shuffled()
    }
    
    fun <T> generateGenericChoices(
        correctAnswer: String,
        availableOptions: List<T>,
        valueExtractor: (T) -> String,
        choiceCount: Int = QuizConfig.DEFAULT_CHOICE_COUNT
    ): List<String> {
        val choices = mutableSetOf(correctAnswer)
        
        while (choices.size < choiceCount && availableOptions.isNotEmpty()) {
            val randomOption = availableOptions.random()
            choices.add(valueExtractor(randomOption))
        }
        
        return choices.shuffled()
    }
}