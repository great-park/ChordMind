package com.chordmind.harmony.domain

import jakarta.persistence.*
import java.time.LocalDateTime

/**
 * 음정 타입 엔티티
 * 하드코딩된 음정 데이터를 DB 기반으로 관리
 */
@Entity
@Table(name = "interval_types")
data class IntervalType(
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Long = 0,
    
    @Column(nullable = false, length = 30)
    val name: String,
    
    @Column(nullable = false)
    val semitones: Int,
    
    @Column(length = 20)
    val quality: String? = null,
    
    @Column(columnDefinition = "TEXT")
    val description: String? = null,
    
    @Column(name = "difficulty_level")
    val difficultyLevel: Int = 1,
    
    @Column(name = "created_at")
    val createdAt: LocalDateTime = LocalDateTime.now()
) {
    /**
     * 난이도 숫자 값을 반환 (하위 호환성)
     */
    val difficultyLevelInt: Int
        get() = difficultyLevel
}