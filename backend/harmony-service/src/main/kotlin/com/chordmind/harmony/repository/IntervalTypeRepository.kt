package com.chordmind.harmony.repository

import com.chordmind.harmony.domain.IntervalType
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Query
import org.springframework.data.repository.query.Param
import org.springframework.stereotype.Repository

/**
 * 음정 타입 레포지토리
 * 하드코딩 제거를 위한 DB 기반 음정 데이터 조회
 */
@Repository
interface IntervalTypeRepository : JpaRepository<IntervalType, Long> {
    
    /**
     * 난이도별 음정 타입 조회
     */
    fun findByDifficultyLevel(difficultyLevel: Int): List<IntervalType>
    
    /**
     * 난이도 범위별 음정 타입 조회
     */
    fun findByDifficultyLevelLessThanEqual(maxLevel: Int): List<IntervalType>
    
    /**
     * 반음 수로 음정 타입 조회
     */
    fun findBySemitones(semitones: Int): IntervalType?
    
    /**
     * 품질(Quality)로 음정 타입 조회
     */
    fun findByQuality(quality: String): List<IntervalType>
    
    /**
     * 랜덤 음정 타입 조회 (난이도 고려)
     */
    @Query("SELECT it FROM IntervalType it WHERE it.difficultyLevel <= :maxLevel ORDER BY RANDOM() LIMIT :count")
    fun findRandomByMaxDifficulty(@Param("maxLevel") maxLevel: Int, @Param("count") count: Int): List<IntervalType>
    
    /**
     * 난이도 기반 정렬된 음정 타입 조회
     */
    @Query("SELECT it FROM IntervalType it ORDER BY it.difficultyLevel ASC, it.semitones ASC")
    fun findOrderedByDifficulty(): List<IntervalType>
}