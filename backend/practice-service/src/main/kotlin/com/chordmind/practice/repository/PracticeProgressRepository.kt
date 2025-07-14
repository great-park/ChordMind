package com.chordmind.practice.repository

import com.chordmind.practice.domain.PracticeProgress
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository

@Repository
interface PracticeProgressRepository : JpaRepository<PracticeProgress, Long> {
    
    fun findByUserIdAndSongId(userId: Long, songId: String): PracticeProgress?
    
    fun findByUserIdOrderByLastPracticedAtDesc(userId: Long): List<PracticeProgress>
    
    fun findByUserIdOrderByBestAccuracyDesc(userId: Long): List<PracticeProgress>
    
    fun findByUserIdOrderByTotalPracticeTimeDesc(userId: Long): List<PracticeProgress>
} 