package com.chordmind.harmony.domain

/**
 * 음정 품질 Enum
 * 음정의 질적 특성을 분류
 */
enum class IntervalQuality(
    val displayName: String,
    val description: String,
    val symbol: String,
    val isConsonant: Boolean = true
) {
    PERFECT("완전", "완전한 협화음 - 가장 안정적", "P", true),
    MAJOR("장", "장음정 - 밝고 안정적", "M", true),
    MINOR("단", "단음정 - 어둡고 감성적", "m", true),
    AUGMENTED("증", "증음정 - 긴장감 있는 불협화음", "A", false),
    DIMINISHED("감", "감음정 - 불안정한 불협화음", "d", false),
    TRITONE("삼전음", "악마의 음정 - 극도로 불안정", "TT", false);

    companion object {
        /**
         * 문자열 값으로부터 IntervalQuality를 찾는 메서드
         */
        fun fromString(value: String): IntervalQuality? {
            return values().find { 
                it.name.equals(value, ignoreCase = true) || 
                it.displayName == value ||
                it.symbol.equals(value, ignoreCase = true)
            }
        }

        /**
         * 협화음 음정만 반환
         */
        fun getConsonant(): List<IntervalQuality> {
            return values().filter { it.isConsonant }
        }

        /**
         * 불협화음 음정만 반환
         */
        fun getDissonant(): List<IntervalQuality> {
            return values().filter { !it.isConsonant }
        }
    }
}