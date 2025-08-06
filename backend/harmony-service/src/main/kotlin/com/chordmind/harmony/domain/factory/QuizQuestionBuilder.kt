package com.chordmind.harmony.domain.factory

import com.chordmind.harmony.domain.entity.QuizQuestion
import com.chordmind.harmony.domain.enum.QuizType
import com.chordmind.harmony.domain.value.Difficulty
import com.chordmind.harmony.domain.value.QuestionText

/**
 * 퀴즈 문제 빌더 (Builder Pattern + Fluent Interface)
 * 복잡한 퀴즈 문제 생성을 단계별로 지원
 */
class QuizQuestionBuilder {
    private var type: QuizType? = null
    private var questionTemplate: String? = null
    private var questionText: String? = null
    private var answer: String? = null
    private var explanation: String? = null
    private var difficulty: Difficulty? = null
    private var imageUrl: String? = null
    private var choices: MutableList<String> = mutableListOf()
    private var choiceCount: Int = 4
    private var includeHints: Boolean = false
    private var includeContext: Boolean = false
    private var timeLimit: Int? = null
    private var tags: MutableSet<String> = mutableSetOf()
    private var metadata: MutableMap<String, Any> = mutableMapOf()
    
    fun type(type: QuizType) = apply { this.type = type }
    
    fun questionTemplate(template: String) = apply { this.questionTemplate = template }
    
    fun questionText(text: String) = apply { this.questionText = text }
    
    fun answer(answer: String) = apply { this.answer = answer }
    
    fun explanation(explanation: String) = apply { this.explanation = explanation }
    
    fun difficulty(difficulty: Difficulty) = apply { this.difficulty = difficulty }
    
    fun imageUrl(url: String) = apply { this.imageUrl = url }
    
    fun choices(choices: List<String>) = apply { 
        this.choices.clear()
        this.choices.addAll(choices)
    }
    
    fun addChoice(choice: String) = apply { this.choices.add(choice) }
    
    fun choiceCount(count: Int) = apply { 
        require(count in 2..10) { "선택지 개수는 2-10개 사이여야 합니다" }
        this.choiceCount = count 
    }
    
    fun withHints(includeHints: Boolean = true) = apply { this.includeHints = includeHints }
    
    fun withContext(includeContext: Boolean = true) = apply { this.includeContext = includeContext }
    
    fun timeLimit(seconds: Int) = apply { this.timeLimit = seconds }
    
    fun addTag(tag: String) = apply { this.tags.add(tag) }
    
    fun addTags(vararg tags: String) = apply { this.tags.addAll(tags) }
    
    fun metadata(key: String, value: Any) = apply { this.metadata[key] = value }
    
    /**
     * 음악 맥락 정보 추가
     */
    fun withMusicContext(include: Boolean = true) = apply {
        if (include) {
            this.includeContext = true
            addTag("music-context")
        }
    }
    
    /**
     * 화성 진행 맥락 정보 추가
     */
    fun withProgressionContext(includeGenre: Boolean = false) = apply {
        withContext(true)
        addTag("progression")
        if (includeGenre) {
            addTag("genre-specific")
            metadata("includeGenre", true)
        }
    }
    
    /**
     * 음정 품질 정보 추가
     */
    fun withIntervalContext(includeQuality: Boolean = false) = apply {
        withContext(true)
        addTag("interval")
        if (includeQuality) {
            addTag("quality-analysis")
            metadata("includeQuality", true)
        }
    }
    
    /**
     * 스케일 모드 정보 추가
     */
    fun withScaleContext(includeMode: Boolean = false) = apply {
        withContext(true)
        addTag("scale")
        if (includeMode) {
            addTag("modal-analysis")
            metadata("includeMode", true)
        }
    }
    
    /**
     * 적응형 기능 추가
     */
    fun withAdaptiveFeatures(performance: QuizQuestionFactory.UserPerformance) = apply {
        addTag("adaptive")
        metadata("userAccuracy", performance.accuracy)
        metadata("averageResponseTime", performance.averageResponseTime)
        
        // 성과에 따른 힌트 포함 여부 결정
        if (performance.accuracy < 0.7) {
            withHints(true)
        }
        
        // 응답 시간에 따른 시간 제한 조정
        timeLimit = when {
            performance.averageResponseTime < 15 -> 20
            performance.averageResponseTime > 45 -> 60
            else -> 30
        }
    }
    
    /**
     * 테마 정보 추가
     */
    fun withTheme(theme: QuizQuestionFactory.QuizTheme) = apply {
        addTag("themed")
        addTag(theme.name.lowercase())
        metadata("theme", theme.displayName)
    }
    
    /**
     * 시리즈 정보 추가
     */
    fun withSeriesInfo(index: Int, total: Int) = apply {
        addTag("series")
        metadata("seriesIndex", index)
        metadata("seriesTotal", total)
        metadata("seriesProgress", index.toDouble() / total)
    }
    
    /**
     * 검증 및 빌드
     */
    fun build(): QuizQuestion {
        validateRequiredFields()
        
        val finalQuestionText = generateQuestionText()
        val finalChoices = generateChoices()
        val finalExplanation = generateExplanation()
        
        val question = QuizQuestion.createMultipleChoice(
            type = type!!,
            questionText = finalQuestionText,
            answer = answer!!,
            choices = finalChoices,
            difficulty = difficulty!!,
            imageUrl = imageUrl,
            explanation = finalExplanation
        )
        
        // 메타데이터 저장 (실제 구현에서는 별도 저장소 활용)
        storeMetadata(question)
        
        return question
    }
    
    /**
     * 빌더 상태 검증
     */
    fun validate(): BuilderValidationResult {
        val errors = mutableListOf<String>()
        
        if (type == null) errors.add("퀴즈 타입이 설정되지 않았습니다")
        if (questionTemplate == null && questionText == null) {
            errors.add("문제 텍스트 또는 템플릿이 필요합니다")
        }
        if (answer == null) errors.add("정답이 설정되지 않았습니다")
        if (difficulty == null) errors.add("난이도가 설정되지 않았습니다")
        
        type?.let { quizType ->
            difficulty?.let { diff ->
                if (!quizType.isAvailableForDifficulty(diff.level)) {
                    errors.add("${quizType.displayName}에서는 난이도 ${diff.level}을 사용할 수 없습니다")
                }
            }
        }
        
        if (choices.isNotEmpty() && answer != null && !choices.contains(answer)) {
            errors.add("정답이 선택지에 포함되어야 합니다")
        }
        
        return BuilderValidationResult(errors.isEmpty(), errors)
    }
    
    private fun validateRequiredFields() {
        val validation = validate()
        if (!validation.isValid) {
            throw IllegalStateException("빌더 검증 실패: ${validation.errors.joinToString(", ")}")
        }
    }
    
    private fun generateQuestionText(): String {
        return questionText ?: run {
            val template = questionTemplate ?: type!!.let { defaultTemplateFor(it) }
            val context = if (includeContext) generateContextInfo() else ""
            val hints = if (includeHints) generateHintInfo() else ""
            
            buildString {
                append(template)
                if (context.isNotEmpty()) {
                    append("\n\n📝 $context")
                }
                if (hints.isNotEmpty()) {
                    append("\n\n💡 힌트: $hints")
                }
            }
        }
    }
    
    private fun generateChoices(): List<String> {
        if (choices.isNotEmpty()) return choices
        
        // 자동 선택지 생성 로직 (실제로는 도메인 서비스에서 처리)
        val autoChoices = mutableListOf<String>()
        autoChoices.add(answer!!)
        
        // 타입별 더미 선택지 생성
        repeat(choiceCount - 1) { index ->
            autoChoices.add(generateDummyChoice(index))
        }
        
        return autoChoices.shuffled()
    }
    
    private fun generateExplanation(): String? {
        if (explanation != null) return explanation
        
        return if (includeContext) {
            generateAutoExplanation()
        } else null
    }
    
    private fun defaultTemplateFor(type: QuizType): String {
        return when (type) {
            QuizType.CHORD_NAME -> "다음 코드의 이름은 무엇인가요? 🎵"
            QuizType.PROGRESSION -> "다음 화성 진행의 이름은 무엇인가요? 🎼"
            QuizType.INTERVAL -> "다음 음정의 이름은 무엇인가요? 🎶"
            QuizType.SCALE -> "다음 스케일의 이름은 무엇인가요? 🎹"
        }
    }
    
    private fun generateContextInfo(): String {
        return when (type) {
            QuizType.CHORD_NAME -> "화음의 구성음과 기능을 고려해보세요."
            QuizType.PROGRESSION -> "화성 진행의 기능과 해결 경향을 분석해보세요."
            QuizType.INTERVAL -> "음정의 품질과 협화/불협화 특성을 생각해보세요."
            QuizType.SCALE -> "음계의 구조와 특징적인 음정을 확인해보세요."
            else -> ""
        }
    }
    
    private fun generateHintInfo(): String {
        return when (type) {
            QuizType.CHORD_NAME -> "루트음과 3도의 관계를 먼저 파악해보세요."
            QuizType.PROGRESSION -> "각 화음의 기능(T, S, D)을 생각해보세요."
            QuizType.INTERVAL -> "반음의 개수를 세어보세요."
            QuizType.SCALE -> "장조 스케일과 비교해서 어떤 음이 변화했는지 확인해보세요."
            else -> ""
        }
    }
    
    private fun generateDummyChoice(index: Int): String {
        // 실제로는 더 정교한 오답 생성 로직 필요
        return when (type) {
            QuizType.CHORD_NAME -> listOf("Cmaj7", "Dm7", "G7", "Am7", "Fmaj7")[index % 5]
            QuizType.PROGRESSION -> listOf("ii-V-I", "vi-IV-I-V", "I-vi-ii-V", "iii-vi-ii-V")[index % 4]
            QuizType.INTERVAL -> listOf("장3도", "완전5도", "단7도", "장2도")[index % 4]
            QuizType.SCALE -> listOf("Major", "Minor", "Dorian", "Mixolydian")[index % 4]
            else -> "선택지 ${index + 1}"
        }
    }
    
    private fun generateAutoExplanation(): String {
        return "${answer}는 ${type!!.description}의 대표적인 예시입니다."
    }
    
    private fun storeMetadata(question: QuizQuestion) {
        // 실제 구현에서는 메타데이터를 별도 저장소에 저장
        // 현재는 로깅만 수행
        if (metadata.isNotEmpty() || tags.isNotEmpty()) {
            println("Question ${question.id} metadata: $metadata, tags: $tags")
        }
    }
    
    data class BuilderValidationResult(
        val isValid: Boolean,
        val errors: List<String>
    )
}