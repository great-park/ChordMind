package com.chordmind.user.domain

/**
 * 테마 모드 Enum
 */
enum class ThemeMode(
    val displayName: String,
    val description: String,
    val cssClass: String
) {
    LIGHT("라이트", "밝은 테마", "theme-light"),
    DARK("다크", "어두운 테마", "theme-dark"),
    AUTO("자동", "시스템 설정에 따라 자동 변경", "theme-auto"),
    HIGH_CONTRAST("고대비", "접근성을 위한 고대비 테마", "theme-high-contrast");

    companion object {
        fun getDefault(): ThemeMode = DARK // 우리 앱의 기본값
    }
}

/**
 * 컬러 스킴 Enum
 */
enum class ColorScheme(
    val displayName: String,
    val primaryColor: String,
    val accentColor: String
) {
    BLUE("블루", "#3B82F6", "#1E40AF"),
    PURPLE("퍼플", "#8B5CF6", "#7C3AED"),
    GREEN("그린", "#10B981", "#047857"),
    ORANGE("오렌지", "#F59E0B", "#D97706"),
    PINK("핑크", "#EC4899", "#BE185D"),
    INDIGO("인디고", "#6366F1", "#4338CA"),
    TEAL("틸", "#14B8A6", "#0F766E"),
    RED("레드", "#EF4444", "#DC2626");

    companion object {
        fun getDefault(): ColorScheme = PURPLE // 우리 앱의 기본값
    }
}

/**
 * 폰트 크기 Enum
 */
enum class FontSize(
    val displayName: String,
    val scale: Double,
    val cssClass: String
) {
    SMALL("작게", 0.875, "font-small"),
    MEDIUM("보통", 1.0, "font-medium"),
    LARGE("크게", 1.125, "font-large"),
    EXTRA_LARGE("매우 크게", 1.25, "font-xl");

    companion object {
        fun getDefault(): FontSize = MEDIUM
    }
}

/**
 * 언어 설정 Enum
 */
enum class Language(
    val displayName: String,
    val code: String,
    val flag: String
) {
    KOREAN("한국어", "ko", "🇰🇷"),
    ENGLISH("English", "en", "🇺🇸"),
    JAPANESE("日本語", "ja", "🇯🇵"),
    CHINESE("中文", "zh", "🇨🇳"),
    SPANISH("Español", "es", "🇪🇸"),
    FRENCH("Français", "fr", "🇫🇷"),
    GERMAN("Deutsch", "de", "🇩🇪");

    companion object {
        fun getDefault(): Language = KOREAN
        
        fun getSupported(): List<Language> {
            return listOf(KOREAN, ENGLISH) // 현재 지원하는 언어들
        }
    }
}