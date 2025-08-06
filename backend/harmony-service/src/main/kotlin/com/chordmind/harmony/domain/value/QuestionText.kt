package com.chordmind.harmony.domain.value

import jakarta.persistence.Embeddable

/**
 * 문제 텍스트 값 객체
 * 문제 내용의 검증과 포맷팅을 담당
 */
@Embeddable
data class QuestionText private constructor(
    val content: String
) {
    
    init {
        require(content.isNotBlank()) { "문제 내용은 필수입니다" }
        require(content.length <= MAX_LENGTH) { 
            "문제 내용은 ${MAX_LENGTH}자를 초과할 수 없습니다. 현재 길이: ${content.length}" 
        }
        require(content.length >= MIN_LENGTH) { 
            "문제 내용은 최소 ${MIN_LENGTH}자 이상이어야 합니다. 현재 길이: ${content.length}" 
        }
    }
    
    val wordCount: Int
        get() = content.split("\\s+".toRegex()).size
    
    val hasEmoji: Boolean
        get() = content.matches(".*[\\p{So}\\p{Cn}].*".toRegex())
    
    val isQuestion: Boolean
        get() = content.trim().endsWith("?") || content.contains("무엇", ignoreCase = true)
    
    fun preview(length: Int = 50): String {
        return if (content.length <= length) content 
               else content.take(length) + "..."
    }
    
    fun sanitize(): QuestionText {
        val sanitized = content
            .replace(Regex("[<>\"'&]"), "")  // HTML 특수문자 제거
            .replace(Regex("\\s+"), " ")     // 연속 공백 정리
            .trim()
        return of(sanitized)
    }
    
    companion object {
        const val MIN_LENGTH = 10
        const val MAX_LENGTH = 500
        
        fun of(content: String): QuestionText = QuestionText(content)
        
        fun createWithTemplate(template: String, vararg args: Any): QuestionText {
            val formatted = template.format(*args)
            return of(formatted)
        }
    }
}