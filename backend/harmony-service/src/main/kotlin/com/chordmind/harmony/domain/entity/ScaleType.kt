package com.chordmind.harmony.domain.entity

import com.chordmind.harmony.domain.value.Difficulty
import com.chordmind.harmony.domain.value.MusicNotation
import jakarta.persistence.*
import java.time.LocalDateTime

/**
 * 스케일 타입 도메인 모델 (Rich Domain Model)
 * 주의: JPA 엔티티가 아니며, 영속성 매핑 대상이 아님
 */
class ScaleType private constructor(
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Long = 0,
    
    @Column(nullable = false, length = 50)
    val name: String,
    
    @Embedded
    val notation: MusicNotation,
    
    @Column(columnDefinition = "TEXT")
    val description: String? = null,
    
    @Column(name = "step_pattern", nullable = false, length = 30)
    val stepPattern: String,  // 예: "W-W-H-W-W-W-H" (전음-전음-반음...)
    
    @Column(name = "mode_number")
    val modeNumber: Int? = null,  // 교회선법 번호 (1-7)
    
    @Embedded
    val difficulty: Difficulty,
    
    @Enumerated(EnumType.STRING)
    @Column(name = "scale_family")
    val scaleFamily: ScaleFamily,
    
    @Column(name = "characteristic_intervals", length = 100)
    val characteristicIntervals: String? = null,  // 특징적인 음정들
    
    @Column(name = "created_at")
    val createdAt: LocalDateTime = LocalDateTime.now()
) {
    
    val isModal: Boolean
        get() = modeNumber != null && scaleFamily == ScaleFamily.DIATONIC
    
    val isPentatonic: Boolean
        get() = scaleFamily == ScaleFamily.PENTATONIC
    
    val isChromatic: Boolean
        get() = stepPattern.count { it == 'H' } >= 6  // 반음이 6개 이상
    
    val isSymmetrical: Boolean
        get() = scaleFamily == ScaleFamily.SYMMETRICAL
    
    val totalSteps: Int
        get() = stepPattern.count { it == 'W' || it == 'H' }
    
    val halfStepCount: Int
        get() = stepPattern.count { it == 'H' }
    
    val wholeStepCount: Int
        get() = stepPattern.count { it == 'W' }
    
    val modeName: String?
        get() = if (isModal && modeNumber != null) {
            MODE_NAMES[modeNumber - 1]
        } else null
    
    /**
     * 스케일의 음정 구조를 반음 단위로 계산
     */
    fun getIntervalStructure(): List<Int> {
        val intervals = mutableListOf(0)  // 시작음 (루트)
        var currentInterval = 0
        
        stepPattern.forEach { step ->
            when (step) {
                'W' -> currentInterval += 2  // 전음 = 2반음
                'H' -> currentInterval += 1  // 반음 = 1반음
                'A' -> currentInterval += 3  // 증2도 = 3반음 (일부 특수 스케일용)
            }
            if (currentInterval < 12) {  // 한 옥타브 내에서
                intervals.add(currentInterval)
            }
        }
        
        return intervals
    }
    
    /**
     * 스케일의 조성적 특성 분석
     */
    fun getTonalCharacteristics(): TonalCharacteristics {
        val intervals = getIntervalStructure()
        
        val hasNaturalSeventh = intervals.contains(11)  // 장7도
        val hasMinorSeventh = intervals.contains(10)    // 단7도
        val hasFlatThird = intervals.contains(3)        // 단3도
        val hasSharpFourth = intervals.contains(6)      // 증4도/감5도
        
        val brightness = when {
            hasFlatThird -> 0.3
            hasSharpFourth -> 0.7
            hasNaturalSeventh -> 0.8
            else -> 0.6
        }
        
        val stability = when {
            isModal -> 0.7
            isPentatonic -> 0.9
            isChromatic -> 0.3
            else -> 0.8
        }
        
        return TonalCharacteristics(
            brightness = brightness,
            stability = stability,
            modality = getModalCharacter(),
            tension = 1.0 - stability
        )
    }
    
    /**
     * 스케일이 만들어내는 화음들 분석
     */
    fun getDiatonicChords(): List<String> {
        if (!scaleFamily.supportsDiatonicHarmony) return emptyList()
        
        val intervals = getIntervalStructure()
        val chords = mutableListOf<String>()
        
        // 각 음도에서 3화음 구성
        for (i in 0 until 7) {
            val root = intervals.getOrNull(i) ?: continue
            val third = intervals.getOrNull((i + 2) % 7) ?: continue
            val fifth = intervals.getOrNull((i + 4) % 7) ?: continue
            
            val chordQuality = analyzeTriadQuality(root, third, fifth)
            chords.add(chordQuality)
        }
        
        return chords
    }
    
    /**
     * 특정 루트음과 결합하여 완전한 스케일 생성
     */
    fun withRoot(rootNote: String): String {
        return "$rootNote $name"
    }
    
    /**
     * 스케일의 학습 복잡도 평가
     */
    fun getLearningComplexity(): LearningComplexity {
        return when {
            isPentatonic -> LearningComplexity.SIMPLE
            isModal && modeNumber in 1..3 -> LearningComplexity.MODERATE
            isChromatic -> LearningComplexity.COMPLEX
            halfStepCount >= 4 -> LearningComplexity.ADVANCED
            else -> LearningComplexity.MODERATE
        }
    }
    
    /**
     * 관련 스케일 추천
     */
    fun getRelatedScales(): List<String> {
        return when (scaleFamily) {
            ScaleFamily.DIATONIC -> if (isModal) {
                // 같은 부모 스케일의 다른 모드들
                (1..7).mapNotNull { modeNum ->
                    if (modeNum != modeNumber) MODE_NAMES.getOrNull(modeNum - 1) else null
                }
            } else {
                listOf("Natural Minor", "Harmonic Minor", "Melodic Minor")
            }
            ScaleFamily.PENTATONIC -> listOf("Major Pentatonic", "Minor Pentatonic", "Blues Scale")
            ScaleFamily.BLUES -> listOf("Pentatonic", "Dorian", "Mixolydian")
            ScaleFamily.JAZZ -> listOf("Bebop", "Altered", "Whole Tone")
            else -> emptyList()
        }
    }
    
    private fun getModalCharacter(): ModalCharacter {
        return when (modeNumber) {
            1 -> ModalCharacter.MAJOR      // Ionian
            2 -> ModalCharacter.MINOR      // Dorian
            3 -> ModalCharacter.MINOR      // Phrygian
            4 -> ModalCharacter.MAJOR      // Lydian
            5 -> ModalCharacter.MAJOR      // Mixolydian
            6 -> ModalCharacter.MINOR      // Aeolian
            7 -> ModalCharacter.DIMINISHED // Locrian
            else -> ModalCharacter.NEUTRAL
        }
    }
    
    private fun analyzeTriadQuality(root: Int, third: Int, fifth: Int): String {
        val thirdInterval = (third - root + 12) % 12
        val fifthInterval = (fifth - root + 12) % 12
        
        return when {
            thirdInterval == 4 && fifthInterval == 7 -> "Major"
            thirdInterval == 3 && fifthInterval == 7 -> "Minor" 
            thirdInterval == 3 && fifthInterval == 6 -> "Diminished"
            thirdInterval == 4 && fifthInterval == 8 -> "Augmented"
            else -> "Unknown"
        }
    }
    
    companion object {
        private val MODE_NAMES = listOf(
            "Ionian", "Dorian", "Phrygian", "Lydian", 
            "Mixolydian", "Aeolian", "Locrian"
        )
        
        /**
         * 팩토리 메서드 - 기본 스케일 생성
         */
        fun create(
            name: String,
            stepPattern: String,
            scaleFamily: ScaleFamily,
            difficulty: Difficulty,
            description: String? = null,
            modeNumber: Int? = null,
            characteristicIntervals: String? = null
        ): ScaleType {
            require(name.isNotBlank()) { "스케일 이름은 필수입니다" }
            require(stepPattern.isNotBlank()) { "음정 패턴은 필수입니다" }
            require(isValidStepPattern(stepPattern)) { "유효하지 않은 음정 패턴입니다: $stepPattern" }
            
            return ScaleType(
                name = name.trim(),
                notation = MusicNotation.of(name, stepPattern),
                description = description,
                stepPattern = stepPattern,
                modeNumber = modeNumber,
                difficulty = difficulty,
                scaleFamily = scaleFamily,
                characteristicIntervals = characteristicIntervals
            )
        }
        
        /**
         * 교회선법 생성
         */
        fun createMode(
            modeName: String,
            modeNumber: Int,
            stepPattern: String,
            difficulty: Difficulty = Difficulty.intermediate()
        ): ScaleType {
            require(modeNumber in 1..7) { "교회선법 번호는 1-7 사이여야 합니다" }
            
            return create(
                name = modeName,
                stepPattern = stepPattern,
                scaleFamily = ScaleFamily.DIATONIC,
                difficulty = difficulty,
                modeNumber = modeNumber,
                description = "${MODE_NAMES[modeNumber - 1]} 모드"
            )
        }
        
        private fun isValidStepPattern(pattern: String): Boolean {
            return pattern.all { it in setOf('W', 'H', 'A', '-') }
        }
    }
    
    enum class ScaleFamily(
        val displayName: String,
        val supportsDiatonicHarmony: Boolean,
        val typicalNoteCount: Int
    ) {
        DIATONIC("온음계", true, 7),
        PENTATONIC("5음계", false, 5),
        BLUES("블루스", false, 6),
        CHROMATIC("반음계", false, 12),
        WHOLE_TONE("온음계열", false, 6),
        DIMINISHED("감음계", false, 8),
        SYMMETRICAL("대칭음계", false, 8),
        EXOTIC("이국음계", false, 7),
        JAZZ("재즈음계", true, 7),
        SYNTHETIC("인조음계", false, 7)
    }
    
    enum class ModalCharacter(val displayName: String) {
        MAJOR("장조적"),
        MINOR("단조적"),
        DIMINISHED("감화적"),
        NEUTRAL("중성적")
    }
    
    enum class LearningComplexity(val displayName: String, val level: Int) {
        SIMPLE("단순", 1),
        MODERATE("보통", 2),
        ADVANCED("고급", 3),
        COMPLEX("복합", 4)
    }
    
    data class TonalCharacteristics(
        val brightness: Double,    // 0.0 (어두움) ~ 1.0 (밝음)
        val stability: Double,     // 0.0 (불안정) ~ 1.0 (안정)
        val modality: ModalCharacter,
        val tension: Double        // 0.0 (안정) ~ 1.0 (긴장)
    )
}