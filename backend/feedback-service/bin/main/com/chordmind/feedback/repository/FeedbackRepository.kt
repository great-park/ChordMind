package com.chordmind.feedback.repository

import com.chordmind.feedback.domain.Feedback
import com.chordmind.feedback.domain.FeedbackPriority
import com.chordmind.feedback.domain.FeedbackStatus
import com.chordmind.feedback.domain.FeedbackType
import org.springframework.data.domain.Page
import org.springframework.data.domain.Pageable
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Query
import org.springframework.data.repository.query.Param
import org.springframework.stereotype.Repository
import java.time.LocalDateTime

@Repository
interface FeedbackRepository : JpaRepository<Feedback, Long> {
    
    // 사용자별 피드백 조회
    fun findByUserId(userId: Long, pageable: Pageable): Page<Feedback>
    
    // 세션별 피드백 조회
    fun findBySessionId(sessionId: Long, pageable: Pageable): Page<Feedback>
    
    // 상태별 피드백 조회
    fun findByStatus(status: FeedbackStatus, pageable: Pageable): Page<Feedback>
    
    // 타입별 피드백 조회
    fun findByFeedbackType(feedbackType: FeedbackType, pageable: Pageable): Page<Feedback>
    
    // 우선순위별 피드백 조회
    fun findByPriority(priority: FeedbackPriority, pageable: Pageable): Page<Feedback>
    
    // 카테고리별 피드백 조회
    fun findByCategory(category: String, pageable: Pageable): Page<Feedback>
    
    // 사용자별 상태별 피드백 조회
    fun findByUserIdAndStatus(userId: Long, status: FeedbackStatus, pageable: Pageable): Page<Feedback>
    
    // 사용자별 타입별 피드백 조회
    fun findByUserIdAndFeedbackType(userId: Long, feedbackType: FeedbackType, pageable: Pageable): Page<Feedback>
    
    // 날짜 범위별 피드백 조회
    fun findByCreatedAtBetween(fromDate: LocalDateTime, toDate: LocalDateTime, pageable: Pageable): Page<Feedback>
    
    // 사용자별 날짜 범위별 피드백 조회
    fun findByUserIdAndCreatedAtBetween(userId: Long, fromDate: LocalDateTime, toDate: LocalDateTime, pageable: Pageable): Page<Feedback>
    
    // 제목 또는 내용에 키워드가 포함된 피드백 조회
    @Query("SELECT f FROM Feedback f WHERE f.userId = :userId AND (f.title LIKE %:keyword% OR f.content LIKE %:keyword%)")
    fun findByUserIdAndKeyword(@Param("userId") userId: Long, @Param("keyword") keyword: String, pageable: Pageable): Page<Feedback>
    
    // 평점이 있는 피드백 조회
    fun findByUserIdAndRatingIsNotNull(userId: Long, pageable: Pageable): Page<Feedback>
    
    // 특정 평점 이상의 피드백 조회
    fun findByUserIdAndRatingGreaterThanEqual(userId: Long, rating: Int, pageable: Pageable): Page<Feedback>
    
    // 해결되지 않은 피드백 조회
    fun findByStatusNot(status: FeedbackStatus, pageable: Pageable): Page<Feedback>
    
    // 사용자별 해결되지 않은 피드백 조회
    fun findByUserIdAndStatusNot(userId: Long, status: FeedbackStatus, pageable: Pageable): Page<Feedback>
    
    // 최근 피드백 조회 (최신순)
    fun findTop10ByOrderByCreatedAtDesc(): List<Feedback>
    
    // 사용자별 최근 피드백 조회
    fun findTop10ByUserIdOrderByCreatedAtDesc(userId: Long): List<Feedback>
    
    // 통계 쿼리들
    @Query("SELECT COUNT(f) FROM Feedback f WHERE f.userId = :userId")
    fun countByUserId(@Param("userId") userId: Long): Long
    
    @Query("SELECT COUNT(f) FROM Feedback f WHERE f.userId = :userId AND f.status = :status")
    fun countByUserIdAndStatus(@Param("userId") userId: Long, @Param("status") status: FeedbackStatus): Long
    
    @Query("SELECT AVG(f.rating) FROM Feedback f WHERE f.userId = :userId AND f.rating IS NOT NULL")
    fun getAverageRatingByUserId(@Param("userId") userId: Long): Double?
    
    @Query("SELECT f.feedbackType, COUNT(f) FROM Feedback f WHERE f.userId = :userId GROUP BY f.feedbackType")
    fun getFeedbackCountByType(@Param("userId") userId: Long): List<Array<Any>>
    
    @Query("SELECT f.category, COUNT(f) FROM Feedback f WHERE f.userId = :userId GROUP BY f.category ORDER BY COUNT(f) DESC")
    fun getFeedbackCountByCategory(@Param("userId") userId: Long): List<Array<Any>>
    
    // 전체 통계
    @Query("SELECT COUNT(f) FROM Feedback f")
    fun getTotalFeedbackCount(): Long
    
    @Query("SELECT COUNT(f) FROM Feedback f WHERE f.status = :status")
    fun getFeedbackCountByStatus(@Param("status") status: FeedbackStatus): Long
    
    @Query("SELECT AVG(f.rating) FROM Feedback f WHERE f.rating IS NOT NULL")
    fun getOverallAverageRating(): Double?
    
    @Query("SELECT f.feedbackType, COUNT(f) FROM Feedback f GROUP BY f.feedbackType")
    fun getOverallFeedbackCountByType(): List<Array<Any>>
    
    @Query("SELECT f.priority, COUNT(f) FROM Feedback f GROUP BY f.priority")
    fun getOverallFeedbackCountByPriority(): List<Array<Any>>
} 