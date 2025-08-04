package com.chordmind.harmony.domain

import jakarta.persistence.*
import java.math.BigDecimal
import java.time.LocalDateTime

/**
 * 음계 루트 엔티티
 * 하드코딩된 루트음 데이터를 DB 기반으로 관리
 */
@Entity
@Table(name = "scale_roots")
data class ScaleRoot(
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Long = 0,
    
    @Column(nullable = false, unique = true, length = 5)
    val name: String,
    
    @Column(nullable = false)
    val degree: Int,
    
    @Column(precision = 8, scale = 2)
    val frequency: BigDecimal? = null,
    
    @Column(name = "created_at")
    val createdAt: LocalDateTime = LocalDateTime.now()
)