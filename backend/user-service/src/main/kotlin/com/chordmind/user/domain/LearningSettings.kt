package com.chordmind.user.domain

/**
 * 학습 목표 타입 Enum
 */
enum class LearningGoalType(
    val displayName: String,
    val description: String,
    val icon: String
) {
    DAILY_PRACTICE("일일 연습", "매일 일정 시간 연습하기", "📅"),
    WEEKLY_SESSIONS("주간 세션", "주당 연습 세션 횟수 달성", "📊"),
    SKILL_MASTERY("기술 숙련", "특정 기술이나 이론 마스터하기", "🎯"),
    STREAK_BUILDING("연속 달성", "연속으로 목표 달성하기", "🔥"),
    ACCURACY_IMPROVEMENT("정확도 향상", "문제 정답률 향상하기", "🎯"),
    SPEED_IMPROVEMENT("속도 향상", "문제 해결 속도 향상하기", "⚡"),
    COMPREHENSIVE("종합 학습", "전반적인 음악 이론 학습", "📚");

    companion object {
        fun getDefault(): List<LearningGoalType> {
            return listOf(DAILY_PRACTICE, WEEKLY_SESSIONS)
        }
    }
}

/**
 * 학습 스타일 Enum
 */
enum class LearningStyle(
    val displayName: String,
    val description: String,
    val characteristics: List<String>
) {
    VISUAL("시각적", "그림과 도표를 통한 학습", 
        listOf("악보 중심", "다이어그램 선호", "컬러 코딩")),
    AUDITORY("청각적", "소리와 음성을 통한 학습", 
        listOf("음성 설명", "음악 예제", "리듬 패턴")),
    KINESTHETIC("체감각적", "실습과 경험을 통한 학습", 
        listOf("실전 연주", "손가락 연습", "물리적 감각")),
    ANALYTICAL("분석적", "논리와 분석을 통한 학습", 
        listOf("이론 중심", "단계별 접근", "체계적 학습")),
    INTUITIVE("직관적", "감각과 직감을 통한 학습", 
        listOf("패턴 인식", "전체적 이해", "창의적 접근"));

    companion object {
        /**
         * AI가 사용자의 학습 패턴을 분석하여 추천할 수 있는 스타일들
         */
        fun getRecommendableStyles(): List<LearningStyle> {
            return values().toList()
        }
    }
}

/**
 * 연습 난이도 선호도 Enum
 */
enum class DifficultyPreference(
    val displayName: String,
    val description: String,
    val minLevel: Int,
    val maxLevel: Int
) {
    BEGINNER_ONLY("초급만", "쉬운 문제만 연습", 1, 2),
    GRADUAL_INCREASE("점진적 증가", "난이도를 점차 높여가며", 1, 3),
    MIXED_LEVELS("혼합 레벨", "다양한 난이도 혼합", 1, 4),
    CHALLENGE_FOCUS("도전 중심", "어려운 문제 중심", 3, 5),
    ADAPTIVE("적응형", "AI가 실력에 맞춰 조절", 1, 5);

    companion object {
        fun getDefault(): DifficultyPreference = GRADUAL_INCREASE
    }
}

/**
 * 학습 세션 길이 선호도 Enum
 */
enum class SessionLength(
    val displayName: String,
    val minutes: Int,
    val description: String
) {
    SHORT("짧게", 15, "15분 집중 학습"),
    MEDIUM("보통", 30, "30분 균형 학습"),
    LONG("길게", 60, "1시간 심화 학습"),
    EXTENDED("연장", 90, "1시간 30분 집중 학습"),
    FLEXIBLE("유연", 0, "시간 제한 없이 자유롭게");

    companion object {
        fun getDefault(): SessionLength = MEDIUM
        
        fun getRecommended(): List<SessionLength> {
            return listOf(SHORT, MEDIUM, LONG)
        }
    }
}