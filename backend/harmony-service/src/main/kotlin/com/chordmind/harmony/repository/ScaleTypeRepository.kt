package com.chordmind.harmony.repository

import com.chordmind.harmony.domain.ScaleType
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Query
import org.springframework.data.repository.query.Param
import org.springframework.stereotype.Repository

/**
 * 스케일 타입 레포지토리
 * 하드코딩 제거를 위한 DB 기반 스케일 데이터 조회
 */
@Repository
interface ScaleTypeRepository : JpaRepository<ScaleType, Long> {
    
    /**
     * 난이도별 스케일 타입 조회
     */
    fun findByDifficultyLevel(difficultyLevel: Int): List<ScaleType>
    
    /**
     * 난이도 범위별 스케일 타입 조회
     */
    fun findByDifficultyLevelLessThanEqual(maxLevel: Int): List<ScaleType>
    
    /**
     * 모드 번호로 스케일 타입 조회
     */
    fun findByModeNumber(modeNumber: Int): List<ScaleType>
    
    /**
     * 패턴으로 스케일 타입 조회
     */
    fun findByPattern(pattern: String): ScaleType?
    
    /**
     * 이름으로 스케일 타입 조회
     */
    fun findByName(name: String): ScaleType?
    
    /**
     * 랜덤 스케일 타입 조회 (난이도 고려)
     */
    @Query("SELECT st FROM ScaleType st WHERE st.difficultyLevel <= :maxLevel ORDER BY RANDOM() LIMIT :count")
    fun findRandomByMaxDifficulty(@Param("maxLevel") maxLevel: Int, @Param("count") count: Int): List<ScaleType>
    
    /**
     * 난이도 기반 정렬된 스케일 타입 조회
     */
    @Query("SELECT st FROM ScaleType st ORDER BY st.difficultyLevel ASC, st.name ASC")
    fun findOrderedByDifficulty(): List<ScaleType>
}