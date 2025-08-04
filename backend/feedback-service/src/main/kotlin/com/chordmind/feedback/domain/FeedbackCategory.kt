package com.chordmind.feedback.domain

/**
 * 피드백 카테고리 Enum
 * 기존의 String category를 대체하여 더 체계적인 분류 제공
 */
enum class FeedbackCategory(
    val displayName: String,
    val description: String,
    val defaultType: FeedbackType,
    val icon: String
) {
    // UI/UX 관련
    UI_DESIGN("UI 디자인", "사용자 인터페이스 디자인 관련", FeedbackType.IMPROVEMENT, "🎨"),
    UX_FLOW("UX 플로우", "사용자 경험 및 플로우 관련", FeedbackType.IMPROVEMENT, "🌊"),
    ACCESSIBILITY("접근성", "접근성 및 사용 편의성 관련", FeedbackType.IMPROVEMENT, "♿"),
    
    // 기능 관련
    PRACTICE_SYSTEM("연습 시스템", "연습 관련 기능", FeedbackType.FEATURE_REQUEST, "📚"),
    AI_FEATURES("AI 기능", "AI 기반 기능 관련", FeedbackType.FEATURE_REQUEST, "🤖"),
    QUIZ_SYSTEM("퀴즈 시스템", "퀴즈 및 문제 관련", FeedbackType.IMPROVEMENT, "❓"),
    USER_MANAGEMENT("사용자 관리", "계정 및 프로필 관리", FeedbackType.FEATURE_REQUEST, "👤"),
    
    // 성능 관련
    PERFORMANCE("성능", "시스템 성능 및 속도", FeedbackType.BUG_REPORT, "⚡"),
    STABILITY("안정성", "시스템 안정성 및 오류", FeedbackType.BUG_REPORT, "🛡️"),
    LOADING_TIME("로딩 시간", "페이지 로딩 및 응답 시간", FeedbackType.BUG_REPORT, "⏱️"),
    
    // 콘텐츠 관련
    EDUCATIONAL_CONTENT("교육 콘텐츠", "학습 자료 및 콘텐츠", FeedbackType.IMPROVEMENT, "📖"),
    MUSIC_THEORY("음악 이론", "음악 이론 관련 내용", FeedbackType.IMPROVEMENT, "🎵"),
    DIFFICULTY_LEVEL("난이도", "문제 난이도 조절", FeedbackType.IMPROVEMENT, "📊"),
    
    // 서비스 관련
    CUSTOMER_SERVICE("고객 서비스", "고객 지원 및 서비스", FeedbackType.COMPLAINT, "🎧"),
    PRICING("요금제", "요금제 및 결제 관련", FeedbackType.SUGGESTION, "💰"),
    NOTIFICATION("알림", "알림 시스템 관련", FeedbackType.IMPROVEMENT, "🔔"),
    
    // 기타
    GENERAL("일반", "일반적인 의견", FeedbackType.SUGGESTION, "💬"),
    OTHER("기타", "기타 분류되지 않는 의견", FeedbackType.SUGGESTION, "📝");

    companion object {
        /**
         * 피드백 타입별 추천 카테고리
         */
        fun getRecommendedForType(type: FeedbackType): List<FeedbackCategory> {
            return values().filter { it.defaultType == type }
        }

        /**
         * 우선순위가 높은 카테고리들
         */
        fun getHighPriorityCategories(): List<FeedbackCategory> {
            return listOf(PERFORMANCE, STABILITY, CUSTOMER_SERVICE)
        }
    }
}

/**
 * 피드백 심각도 Enum
 */
enum class FeedbackSeverity(
    val displayName: String,
    val description: String,
    val color: String,
    val autoAssignPriority: FeedbackPriority
) {
    MINOR("경미", "작은 불편함이나 개선 사항", "#4CAF50", FeedbackPriority.LOW),
    MODERATE("보통", "사용에 영향을 주는 문제", "#FF9800", FeedbackPriority.MEDIUM),
    MAJOR("심각", "중요한 기능에 영향을 주는 문제", "#FF5722", FeedbackPriority.HIGH),
    CRITICAL("치명적", "서비스 사용이 불가능한 문제", "#F44336", FeedbackPriority.URGENT),
    BLOCKER("차단", "서비스 전체를 차단하는 문제", "#9C27B0", FeedbackPriority.URGENT);

    companion object {
        fun getDefault(): FeedbackSeverity = MODERATE
    }
}

/**
 * 피드백 소스 Enum (피드백이 어디서 왔는지)
 */
enum class FeedbackSource(
    val displayName: String,
    val description: String
) {
    WEB_APP("웹 앱", "웹 애플리케이션에서 제출"),
    MOBILE_APP("모바일 앱", "모바일 앱에서 제출"),
    EMAIL("이메일", "이메일로 접수"),
    SOCIAL_MEDIA("소셜 미디어", "소셜 미디어를 통해 접수"),
    SUPPORT_CENTER("고객지원", "고객지원 센터를 통해 접수"),
    SURVEY("설문조사", "설문조사를 통해 수집"),
    USER_INTERVIEW("사용자 인터뷰", "사용자 인터뷰에서 수집"),
    BETA_TEST("베타 테스트", "베타 테스트 중 발견"),
    AUTOMATED("자동화", "자동화된 시스템에서 감지");

    companion object {
        fun getDefault(): FeedbackSource = WEB_APP
        
        fun getDirectSources(): List<FeedbackSource> {
            return listOf(WEB_APP, MOBILE_APP, EMAIL, SUPPORT_CENTER)
        }
    }
}

/**
 * 피드백 태그 Enum
 */
enum class FeedbackTag(
    val displayName: String,
    val category: FeedbackCategory?
) {
    // 일반 태그
    URGENT("긴급", null),
    EASY_FIX("쉬운 수정", null),
    DUPLICATE("중복", null),
    NEEDS_DISCUSSION("논의 필요", null),
    
    // 기능 관련
    NEW_FEATURE("신규 기능", FeedbackCategory.PRACTICE_SYSTEM),
    ENHANCEMENT("기능 개선", null),
    API_RELATED("API 관련", null),
    
    // UI/UX 관련
    DESIGN_ISSUE("디자인 이슈", FeedbackCategory.UI_DESIGN),
    USABILITY("사용성", FeedbackCategory.UX_FLOW),
    MOBILE_SPECIFIC("모바일 전용", null),
    
    // 기술적 이슈
    BUG_CONFIRMED("버그 확인됨", null),
    PERFORMANCE_ISSUE("성능 이슈", FeedbackCategory.PERFORMANCE),
    COMPATIBILITY("호환성", null),
    
    // 우선순위
    QUICK_WIN("빠른 승리", null),
    LONG_TERM("장기 과제", null),
    RESEARCH_NEEDED("조사 필요", null);

    companion object {
        fun getForCategory(category: FeedbackCategory): List<FeedbackTag> {
            return values().filter { it.category == category }
        }
    }
}