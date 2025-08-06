package com.chordmind.harmony.domain.value

import jakarta.persistence.Embeddable

/**
 * 음악 기보법 값 객체
 * 음정, 코드, 스케일 등의 음악적 표현을 담당
 */
@Embeddable
data class MusicNotation private constructor(
    val symbol: String,
    val intervals: String? = null
) {
    
    init {
        require(symbol.isNotBlank()) { "음악 기호는 필수입니다" }
        require(symbol.length <= MAX_SYMBOL_LENGTH) { 
            "음악 기호는 ${MAX_SYMBOL_LENGTH}자를 초과할 수 없습니다. 현재: $symbol" 
        }
        require(isValidSymbol(symbol)) { 
            "유효하지 않은 음악 기호입니다: $symbol" 
        }
        
        intervals?.let {
            require(it.isNotBlank()) { "음정 정보가 비어있습니다" }
            require(isValidIntervals(it)) { "유효하지 않은 음정 정보입니다: $it" }
        }
    }
    
    val isChord: Boolean
        get() = symbol.matches(CHORD_PATTERN.toRegex())
    
    val isScale: Boolean  
        get() = symbol.contains("scale", ignoreCase = true) || 
                symbol.contains("mode", ignoreCase = true)
    
    val isInterval: Boolean
        get() = intervals != null && symbol.matches(INTERVAL_PATTERN.toRegex())
    
    val rootNote: String?
        get() = if (isChord || isScale) {
            NOTES.find { symbol.startsWith(it, ignoreCase = true) }
        } else null
    
    val hasAccidental: Boolean
        get() = symbol.contains("#") || symbol.contains("b") || symbol.contains("♯") || symbol.contains("♭")
    
    fun transpose(semitones: Int): MusicNotation {
        val root = rootNote ?: return this
        val rootIndex = NOTES.indexOf(root.uppercase())
        if (rootIndex == -1) return this
        
        val newIndex = (rootIndex + semitones + 12) % 12
        val newRoot = NOTES[newIndex]
        val newSymbol = symbol.replaceFirst(root, newRoot, ignoreCase = true)
        
        return of(newSymbol, intervals)
    }
    
    fun enharmonicEquivalent(): MusicNotation? {
        return when {
            symbol.contains("#") -> of(symbol.replace("#", "b"), intervals)
            symbol.contains("b") -> of(symbol.replace("b", "#"), intervals)
            symbol.contains("♯") -> of(symbol.replace("♯", "♭"), intervals)
            symbol.contains("♭") -> of(symbol.replace("♭", "♯"), intervals)
            else -> null
        }
    }
    
    private fun isValidSymbol(symbol: String): Boolean {
        return symbol.matches(VALID_SYMBOL_PATTERN.toRegex())
    }
    
    private fun isValidIntervals(intervals: String): Boolean {
        return intervals.split(",", " ")
            .all { it.trim().matches(INTERVAL_STEP_PATTERN.toRegex()) }
    }
    
    companion object {
        const val MAX_SYMBOL_LENGTH = 20
        
        private val NOTES = listOf("C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B")
        private const val CHORD_PATTERN = "^[A-G][#b♯♭]?.*"
        private const val INTERVAL_PATTERN = "^[Pmmd]?[1-9][0-9]?$"
        private const val VALID_SYMBOL_PATTERN = "^[A-Ga-g0-9#b♯♭+°ΔMmajminorsus]+$"
        private const val INTERVAL_STEP_PATTERN = "^[0-9]+$"
        
        fun of(symbol: String, intervals: String? = null): MusicNotation = 
            MusicNotation(symbol.trim(), intervals?.trim())
        
        fun chord(root: String, quality: String): MusicNotation = 
            of("$root$quality")
        
        fun scale(root: String, type: String): MusicNotation = 
            of("$root $type scale")
        
        fun interval(quality: String, number: Int): MusicNotation = 
            of("$quality$number")
        
        fun fromIntervalSteps(vararg steps: Int): MusicNotation {
            val intervalString = steps.joinToString(",")
            return of("custom", intervalString)
        }
    }
}