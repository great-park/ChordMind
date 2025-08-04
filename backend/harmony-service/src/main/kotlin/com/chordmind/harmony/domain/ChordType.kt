package com.chordmind.harmony.domain

import jakarta.persistence.*
import java.time.LocalDateTime

/**
 * 코드 타입 엔티티
 * 하드코딩된 코드 데이터를 DB 기반으로 관리
 */
@Entity
@Table(name = "chord_types")
data class ChordType(
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Long = 0,
    
    @Column(nullable = false, unique = true, length = 20)
    val name: String,
    
    @Column(nullable = false, length = 10)
    val symbol: String,
    
    @Column(columnDefinition = "TEXT")
    val description: String? = null,
    
    @Enumerated(EnumType.STRING)
    @Column(name = "difficulty_level")
    val difficultyLevel: DifficultyLevel = DifficultyLevel.BEGINNER,
    
    @Column(length = 100)
    val intervals: String? = null,
    
    @Column(name = "created_at")
    val createdAt: LocalDateTime = LocalDateTime.now()
) {
    /**
     * 난이도 숫자 값을 반환 (하위 호환성)
     */
    val difficultyLevelInt: Int
        get() = difficultyLevel.level
}