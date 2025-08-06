package com.chordmind.harmony.repository

import com.chordmind.harmony.domain.ChordType
import com.chordmind.harmony.domain.DifficultyLevel
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Query
import org.springframework.data.repository.query.Param
import org.springframework.stereotype.Repository

/**
 * 코드 타입 레포지토리
 * 하드코딩 제거를 위한 DB 기반 코드 데이터 조회
 */
@Repository
interface ChordTypeRepository : JpaRepository<ChordType, Long> {
    
    /**
     * 난이도별 코드 타입 조회 (Enum 기반)
     */
    fun findByDifficultyLevel(difficultyLevel: DifficultyLevel): List<ChordType>
    

    
    /**
     * 특정 난이도들로 코드 타입 조회
     */
    fun findByDifficultyLevelIn(difficultyLevels: List<DifficultyLevel>): List<ChordType>
    
    /**
     * 심볼로 코드 타입 조회
     */
    fun findBySymbol(symbol: String): ChordType?
    
    /**
     * 랜덤 코드 타입 조회 (난이도 고려)
     */
    @Query("SELECT ct FROM ChordType ct WHERE ct.difficultyLevel <= :maxLevel ORDER BY RANDOM() LIMIT :count")
    fun findRandomByMaxDifficulty(@Param("maxLevel") maxLevel: Int, @Param("count") count: Int): List<ChordType>
    
    /**
     * 인기도 기반 코드 타입 조회 (기본적인 것부터)
     */
    @Query("SELECT ct FROM ChordType ct ORDER BY ct.difficultyLevel ASC, ct.name ASC")
    fun findOrderedByDifficulty(): List<ChordType>
}