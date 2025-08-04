package com.chordmind.harmony.repository

import com.chordmind.harmony.domain.ProgressionPattern
import com.chordmind.harmony.domain.DifficultyLevel
import com.chordmind.harmony.domain.MusicGenre
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Query
import org.springframework.data.repository.query.Param
import org.springframework.stereotype.Repository

/**
 * 화성 진행 패턴 레포지토리
 * 하드코딩 제거를 위한 DB 기반 화성 진행 데이터 조회
 */
@Repository
interface ProgressionPatternRepository : JpaRepository<ProgressionPattern, Long> {
    
    /**
     * 난이도별 화성 진행 조회 (Enum 기반)
     */
    fun findByDifficultyLevel(difficultyLevel: DifficultyLevel): List<ProgressionPattern>
    
    /**
     * 장르별 화성 진행 조회 (Enum 기반)
     */
    fun findByGenre(genre: MusicGenre): List<ProgressionPattern>
    
    /**
     * 난이도 범위별 화성 진행 조회 (하위 호환성)
     */
    fun findByDifficultyLevelBetween(minLevel: Int, maxLevel: Int): List<ProgressionPattern>
    
    /**
     * 특정 난이도들로 화성 진행 조회
     */
    fun findByDifficultyLevelIn(difficultyLevels: List<DifficultyLevel>): List<ProgressionPattern>
    
    /**
     * 인기도 기반 상위 화성 진행 조회
     */
    fun findByOrderByPopularityScoreDesc(): List<ProgressionPattern>
    
    /**
     * 랜덤 화성 진행 조회 (난이도 고려)
     */
    @Query("SELECT pp FROM ProgressionPattern pp WHERE pp.difficultyLevel <= :maxLevel ORDER BY RANDOM() LIMIT :count")
    fun findRandomByMaxDifficulty(@Param("maxLevel") maxLevel: Int, @Param("count") count: Int): List<ProgressionPattern>
    
    /**
     * 장르와 난이도를 모두 고려한 조회 (Enum 기반)
     */
    fun findByGenreAndDifficultyLevel(genre: MusicGenre, difficultyLevel: DifficultyLevel): List<ProgressionPattern>
    
    /**
     * 장르와 난이도를 모두 고려한 조회 (하위 호환성)
     */
    fun findByGenreAndDifficultyLevelLessThanEqual(genre: String, maxLevel: Int): List<ProgressionPattern>
    
    /**
     * 패턴으로 화성 진행 조회
     */
    fun findByPattern(pattern: String): ProgressionPattern?
}