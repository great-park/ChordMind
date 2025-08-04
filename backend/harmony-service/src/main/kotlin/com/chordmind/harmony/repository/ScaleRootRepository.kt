package com.chordmind.harmony.repository

import com.chordmind.harmony.domain.ScaleRoot
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Query
import org.springframework.data.repository.query.Param
import org.springframework.stereotype.Repository

/**
 * 음계 루트 레포지토리
 * 하드코딩 제거를 위한 DB 기반 루트음 데이터 조회
 */
@Repository
interface ScaleRootRepository : JpaRepository<ScaleRoot, Long> {
    
    /**
     * 이름으로 루트음 조회
     */
    fun findByName(name: String): ScaleRoot?
    
    /**
     * 도수로 루트음 조회
     */
    fun findByDegree(degree: Int): ScaleRoot?
    
    /**
     * 랜덤 루트음 조회
     */
    @Query("SELECT sr FROM ScaleRoot sr ORDER BY RANDOM() LIMIT :count")
    fun findRandom(@Param("count") count: Int): List<ScaleRoot>
    
    /**
     * 모든 루트음을 도수 순으로 조회
     */
    fun findAllByOrderByDegreeAsc(): List<ScaleRoot>
}