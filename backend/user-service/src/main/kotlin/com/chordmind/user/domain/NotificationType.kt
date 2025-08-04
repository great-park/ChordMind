package com.chordmind.user.domain

/**
 * 알림 타입 Enum
 */
enum class NotificationType(
    val displayName: String,
    val description: String,
    val defaultEnabled: Boolean = true
) {
    PRACTICE_REMINDER("연습 알림", "연습 시간 리마인더", true),
    ACHIEVEMENT("성취 알림", "목표 달성 및 업적 알림", true),
    SOCIAL("소셜 알림", "친구 요청, 댓글 등", true),
    SYSTEM("시스템 알림", "서비스 공지사항", true),
    MARKETING("마케팅 알림", "프로모션 및 이벤트", false),
    UPDATE("업데이트 알림", "새 기능 및 업데이트", true),
    CHALLENGE("챌린지 알림", "챌린지 참여 및 결과", true),
    FEEDBACK("피드백 알림", "AI 피드백 및 분석 결과", true);

    companion object {
        /**
         * 기본적으로 활성화된 알림 타입들
         */
        fun getDefaultEnabled(): List<NotificationType> {
            return values().filter { it.defaultEnabled }
        }

        /**
         * 사용자가 선택할 수 있는 알림 타입들
         */
        fun getUserConfigurable(): List<NotificationType> {
            return values().filter { it != SYSTEM } // 시스템 알림은 필수
        }
    }
}

/**
 * 알림 설정 방법 Enum
 */
enum class NotificationMethod(
    val displayName: String,
    val description: String
) {
    EMAIL("이메일", "이메일로 알림 발송"),
    PUSH("푸시", "앱 푸시 알림"),
    SMS("SMS", "문자 메시지 알림"),
    IN_APP("인앱", "앱 내 알림만");

    companion object {
        /**
         * 기본 알림 방법들
         */
        fun getDefault(): List<NotificationMethod> {
            return listOf(EMAIL, PUSH, IN_APP)
        }
    }
}