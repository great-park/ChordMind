package com.chordmind.harmony.service.analytics

object AnalyticsConfig {
    const val DEFAULT_PROGRESS_DAYS = 30
    const val LOW_ACCURACY_THRESHOLD = 70.0
    const val POOR_ACCURACY_THRESHOLD = 50.0
    const val GOOD_ACCURACY_THRESHOLD = 90.0
    
    const val MIN_DIFFICULTY_LEVEL = 1
    const val MAX_DIFFICULTY_LEVEL = 3
    
    object Messages {
        const val LOW_ACCURACY_MESSAGE = "영역의 정확도가 낮습니다. 더 많은 연습이 필요합니다."
        const val BASIC_LEARNING_MESSAGE = "기본 개념부터 차근차근 학습하세요."
        const val FOCUSED_PRACTICE_MESSAGE = "약점 영역을 집중적으로 연습하세요."
        const val ADVANCED_CHALLENGE_MESSAGE = "고급 문제에 도전해보세요."
        const val EXCELLENT_MESSAGE = "훌륭합니다! 새로운 도전을 시도해보세요."
    }
}