package com.chordmind.harmony.domain.enum

/**
 * 음정 품질 Enum (Rich Enum 패턴)
 * 음정의 질적 특성과 음향학적 속성을 포함
 */
enum class IntervalQuality(
    val displayName: String,
    val description: String,
    val symbol: String,
    val isConsonant: Boolean,
    val tension: TensionLevel,
    val frequency: String // 주파수 비율
) {
    PERFECT(
        "완전", 
        "완전한 협화음 - 가장 안정적이고 자연스러운 음정",
        "P", 
        true, 
        TensionLevel.NONE,
        "2:1, 3:2, 4:3"
    ),
    MAJOR(
        "장", 
        "장음정 - 밝고 안정적인 음정",
        "M", 
        true, 
        TensionLevel.LOW,
        "9:8, 5:4, 45:32"
    ),
    MINOR(
        "단", 
        "단음정 - 어둡고 감성적인 음정",
        "m", 
        true, 
        TensionLevel.LOW,
        "16:15, 6:5, 32:27"
    ),
    AUGMENTED(
        "증", 
        "증음정 - 긴장감 있는 불협화음",
        "A", 
        false, 
        TensionLevel.HIGH,
        "다양한 비율"
    ),
    DIMINISHED(
        "감", 
        "감음정 - 불안정한 불협화음",
        "d", 
        false, 
        TensionLevel.HIGH,
        "다양한 비율"
    ),
    TRITONE(
        "삼전음", 
        "악마의 음정 - 극도로 불안정한 음정",
        "TT", 
        false, 
        TensionLevel.EXTREME,
        "45:32 (약 1.414)"
    );
    
    val colorCode: String
        get() = when (tension) {
            TensionLevel.NONE -> "#4CAF50"      // 초록 (안정)
            TensionLevel.LOW -> "#2196F3"       // 파랑 (안정적)
            TensionLevel.MEDIUM -> "#FF9800"    // 주황 (보통)
            TensionLevel.HIGH -> "#FF5722"      // 빨강 (긴장)
            TensionLevel.EXTREME -> "#9C27B0"   // 보라 (극도)
        }
    
    val stability: Double
        get() = when (tension) {
            TensionLevel.NONE -> 1.0
            TensionLevel.LOW -> 0.8
            TensionLevel.MEDIUM -> 0.6
            TensionLevel.HIGH -> 0.3
            TensionLevel.EXTREME -> 0.1
        }
    
    val emotionalCharacter: String
        get() = when (this) {
            PERFECT -> "순수하고 중립적"
            MAJOR -> "밝고 희망적"
            MINOR -> "어둡고 감성적"
            AUGMENTED -> "신비롭고 긴장감 있는"
            DIMINISHED -> "어둡고 불안한"
            TRITONE -> "악마적이고 극도로 불안정한"
        }
    
    fun needsResolution(): Boolean = !isConsonant
    
    fun getResolutionTendency(): String {
        return when (this) {
            AUGMENTED -> "확장하려는 경향 (반음 위로)"
            DIMINISHED -> "축소하려는 경향 (반음 아래로)"
            TRITONE -> "가장 가까운 완전음정으로 해결"
            else -> "해결 불필요"
        }
    }
    
    fun isCompatibleWith(other: IntervalQuality): Boolean {
        return when {
            this.isConsonant && other.isConsonant -> true
            this.tension == TensionLevel.EXTREME || other.tension == TensionLevel.EXTREME -> false
            else -> this.tension.ordinal + other.tension.ordinal <= 3
        }
    }
    
    companion object {
        fun fromString(value: String): IntervalQuality? {
            return values().find { 
                it.name.equals(value, ignoreCase = true) || 
                it.displayName.equals(value, ignoreCase = true) ||
                it.symbol.equals(value, ignoreCase = true)
            }
        }
        
        fun getConsonant(): List<IntervalQuality> {
            return values().filter { it.isConsonant }
        }
        
        fun getDissonant(): List<IntervalQuality> {
            return values().filter { !it.isConsonant }
        }
        
        fun getByTension(tension: TensionLevel): List<IntervalQuality> {
            return values().filter { it.tension == tension }
        }
        
        fun getStable(): List<IntervalQuality> {
            return values().filter { it.stability >= 0.7 }
        }
        
        fun getForBeginners(): List<IntervalQuality> {
            return listOf(PERFECT, MAJOR, MINOR)
        }
    }
}

enum class TensionLevel(val displayName: String, val description: String) {
    NONE("없음", "완전히 안정적"),
    LOW("낮음", "약간의 색채감"),
    MEDIUM("보통", "적당한 긴장감"),
    HIGH("높음", "강한 긴장감"),
    EXTREME("극도", "극도로 불안정")
}