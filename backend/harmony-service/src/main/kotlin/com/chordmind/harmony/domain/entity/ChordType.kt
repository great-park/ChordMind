package com.chordmind.harmony.domain.entity

import com.chordmind.harmony.domain.enum.IntervalQuality
import com.chordmind.harmony.domain.value.Difficulty
import com.chordmind.harmony.domain.value.MusicNotation
import jakarta.persistence.*
import java.time.LocalDateTime

/**
 * 코드 타입 엔티티 (Rich Domain Model)
 * 음악 이론과 화성학 로직을 포함
 */
@Entity
@Table(name = "chord_types")
class ChordType private constructor(
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Long = 0,
    
    @Column(nullable = false, unique = true, length = 50)
    val name: String,
    
    @Embedded
    val notation: MusicNotation,
    
    @Column(columnDefinition = "TEXT")
    val description: String? = null,
    
    @Embedded
    val difficulty: Difficulty,
    
    @Column(name = "interval_structure", length = 100)
    val intervalStructure: String? = null,  // 예: "1,3,5" 또는 "0,4,7"
    
    @Enumerated(EnumType.STRING)
    @Column(name = "quality")
    val quality: ChordQuality,
    
    @Column(name = "tension_extensions", length = 50)
    val tensionExtensions: String? = null,  // 예: "7,9,11,13"
    
    @Column(name = "created_at")
    val createdAt: LocalDateTime = LocalDateTime.now()
) {
    
    val isMajor: Boolean
        get() = quality == ChordQuality.MAJOR
    
    val isMinor: Boolean
        get() = quality == ChordQuality.MINOR
    
    val isDominant: Boolean
        get() = quality == ChordQuality.DOMINANT
    
    val isDiminished: Boolean
        get() = quality == ChordQuality.DIMINISHED
    
    val isAugmented: Boolean
        get() = quality == ChordQuality.AUGMENTED
    
    val isExtended: Boolean
        get() = !tensionExtensions.isNullOrBlank()
    
    val stability: Double
        get() = quality.stability
    
    val intervals: List<Int>
        get() = intervalStructure?.split(",")
            ?.mapNotNull { it.trim().toIntOrNull() }
            ?: emptyList()
    
    val extensions: List<Int>
        get() = tensionExtensions?.split(",")
            ?.mapNotNull { it.trim().toIntOrNull() }
            ?: emptyList()
    
    /**
     * 특정 루트음과 결합하여 완전한 코드 생성
     */
    fun withRoot(rootNote: String): String {
        return "$rootNote${notation.symbol}"
    }
    
    /**
     * 코드의 음향학적 특성 분석
     */
    fun getAcousticProperties(): AcousticProperties {
        return AcousticProperties(
            consonance = quality.consonance,
            brightness = quality.brightness,
            tension = if (isExtended) quality.tension + 0.3 else quality.tension,
            complexity = intervals.size + extensions.size
        )
    }
    
    /**
     * 다른 코드와의 호환성 검사
     */
    fun isCompatibleWith(other: ChordType): Boolean {
        val thisProps = getAcousticProperties()
        val otherProps = other.getAcousticProperties()
        
        return kotlin.math.abs(thisProps.tension - otherProps.tension) <= 0.5 &&
               kotlin.math.abs(thisProps.brightness - otherProps.brightness) <= 0.7
    }
    
    /**
     * 코드 진행에서의 기능 분석
     */
    fun getHarmonicFunction(): HarmonicFunction {
        return when {
            isDominant || name.contains("7") -> HarmonicFunction.DOMINANT
            isMinor && intervals.contains(6) -> HarmonicFunction.SUBDOMINANT
            isMajor -> HarmonicFunction.TONIC
            isDiminished -> HarmonicFunction.LEADING_TONE
            else -> HarmonicFunction.COLORISTIC
        }
    }
    
    /**
     * 학습 난이도 기반 추천 여부
     */
    fun isRecommendedFor(studentDifficulty: Difficulty): Boolean {
        return when {
            studentDifficulty.isBeginnerLevel() -> difficulty.level <= 2 && !isExtended
            studentDifficulty.isIntermediateLevel() -> difficulty.level <= 4
            else -> true
        }
    }
    
    /**
     * 코드 변형 가능성 체크
     */
    fun getPossibleVariations(): List<ChordVariation> {
        val variations = mutableListOf<ChordVariation>()
        
        if (!isExtended && intervals.size == 3) {
            variations.add(ChordVariation.ADD_SEVENTH)
        }
        
        if (isMajor || isMinor) {
            variations.add(ChordVariation.INVERSION)
            if (!isExtended) {
                variations.add(ChordVariation.SUSPENDED)
            }
        }
        
        if (intervals.size >= 4) {
            variations.add(ChordVariation.OMIT_NOTE)
        }
        
        return variations
    }
    
    companion object {
        /**
         * 팩토리 메서드 - 기본 코드 생성
         */
        fun create(
            name: String,
            symbol: String,
            quality: ChordQuality,
            difficulty: Difficulty,
            description: String? = null,
            intervalStructure: String? = null,
            tensionExtensions: String? = null
        ): ChordType {
            require(name.isNotBlank()) { "코드 이름은 필수입니다" }
            require(symbol.isNotBlank()) { "코드 기호는 필수입니다" }
            
            return ChordType(
                name = name.trim(),
                notation = MusicNotation.of(symbol, intervalStructure),
                description = description,
                difficulty = difficulty,
                intervalStructure = intervalStructure,
                quality = quality,
                tensionExtensions = tensionExtensions
            )
        }
        
        /**
         * 기본 3화음 생성
         */
        fun createTriad(
            name: String,
            symbol: String,
            quality: ChordQuality
        ): ChordType {
            val intervalStructure = when (quality) {
                ChordQuality.MAJOR -> "0,4,7"
                ChordQuality.MINOR -> "0,3,7"
                ChordQuality.DIMINISHED -> "0,3,6"
                ChordQuality.AUGMENTED -> "0,4,8"
                else -> "0,4,7"  // 기본값
            }
            
            return create(
                name = name,
                symbol = symbol,
                quality = quality,
                difficulty = Difficulty.beginner(),
                intervalStructure = intervalStructure
            )
        }
        
        /**
         * 7화음 생성
         */
        fun createSeventh(
            name: String,
            symbol: String,
            quality: ChordQuality,
            seventhType: SeventhType = SeventhType.MINOR
        ): ChordType {
            val baseStructure = when (quality) {
                ChordQuality.MAJOR -> "0,4,7"
                ChordQuality.MINOR -> "0,3,7"
                ChordQuality.DOMINANT -> "0,4,7"
                else -> "0,4,7"
            }
            
            val seventhInterval = when (seventhType) {
                SeventhType.MAJOR -> 11
                SeventhType.MINOR -> 10
            }
            
            return create(
                name = name,
                symbol = symbol,
                quality = quality,
                difficulty = Difficulty.intermediate(),
                intervalStructure = "$baseStructure,$seventhInterval"
            )
        }
    }
    
    enum class ChordQuality(
        val displayName: String,
        val consonance: Double,  // 0.0 (불협화) ~ 1.0 (완전협화)
        val brightness: Double,  // 0.0 (어두움) ~ 1.0 (밝음)
        val tension: Double,     // 0.0 (안정) ~ 1.0 (긴장)
        val stability: Double    // 0.0 (불안정) ~ 1.0 (안정)
    ) {
        MAJOR("장화음", 0.9, 0.8, 0.1, 0.9),
        MINOR("단화음", 0.8, 0.3, 0.2, 0.8),
        DOMINANT("속화음", 0.6, 0.6, 0.7, 0.4),
        DIMINISHED("감화음", 0.3, 0.2, 0.9, 0.2),
        AUGMENTED("증화음", 0.4, 0.9, 0.8, 0.3),
        SUSPENDED("서스펜드", 0.5, 0.5, 0.6, 0.5),
        HALF_DIMINISHED("반감화음", 0.4, 0.3, 0.7, 0.3)
    }
    
    enum class SeventhType(val displayName: String, val interval: Int) {
        MAJOR("장7도", 11),
        MINOR("단7도", 10)
    }
    
    enum class HarmonicFunction(val displayName: String, val description: String) {
        TONIC("으뜸화음", "안정적이고 해결감을 주는 화음"),
        SUBDOMINANT("딸림준비화음", "긴장을 준비하는 화음"),
        DOMINANT("딸림화음", "긴장감을 주고 해결을 요구하는 화음"),
        LEADING_TONE("이끎화음", "강한 해결 경향을 가진 화음"),
        COLORISTIC("색채화음", "특별한 색깔을 더하는 화음")
    }
    
    enum class ChordVariation(val displayName: String) {
        INVERSION("전위"),
        ADD_SEVENTH("7도 추가"),
        SUSPENDED("서스펜드"),
        OMIT_NOTE("음 생략"),
        ALTERED("변화"),
        EXTENDED("확장")
    }
    
    data class AcousticProperties(
        val consonance: Double,
        val brightness: Double,
        val tension: Double,
        val complexity: Int
    ) {
        val overallStability: Double
            get() = (consonance + (1.0 - tension)) / 2.0
    }
}