package com.chordmind.practice.repository

import com.chordmind.practice.domain.PracticeProgress
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository

@Repository
interface PracticeProgressRepository : JpaRepository<PracticeProgress, Long> {
    fun findBySessionId(sessionId: Long): List<PracticeProgress>
} 