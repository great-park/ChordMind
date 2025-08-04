package com.chordmind.harmony.domain

import jakarta.persistence.*
import java.time.LocalDateTime

/**
 * 화성 진행 패턴 엔티티
 * 하드코딩된 화성 진행 데이터를 DB 기반으로 관리
 */
@Entity
@Table(name = "progression_patterns")
data class ProgressionPattern(
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Long = 0,
    
    @Column(nullable = false, length = 50)
    val name: String,
    
    @Column(nullable = false, length = 30)
    val pattern: String,
    
    @Column(columnDefinition = "TEXT")
    val description: String? = null,
    
    @Enumerated(EnumType.STRING)
    @Column(length = 50)
    val genre: MusicGenre? = null,
    
    @Enumerated(EnumType.STRING)
    @Column(name = "difficulty_level")
    val difficultyLevel: DifficultyLevel = DifficultyLevel.BEGINNER,
    
    @Column(name = "popularity_score")
    val popularityScore: Int = 50,
    
    @Column(name = "created_at")
    val createdAt: LocalDateTime = LocalDateTime.now()
) {
    /**
     * 장르 문자열 값을 반환 (하위 호환성)
     */
    val genreString: String
        get() = genre?.name ?: "ALL"
    
    /**
     * 난이도 숫자 값을 반환 (하위 호환성)
     */
    val difficultyLevelInt: Int
        get() = difficultyLevel.level
}