package com.chordmind.practice.repository

import com.chordmind.practice.domain.PracticeSession
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository

@Repository
interface PracticeSessionRepository : JpaRepository<PracticeSession, Long> {
    fun findByUserId(userId: Long): List<PracticeSession>
} 