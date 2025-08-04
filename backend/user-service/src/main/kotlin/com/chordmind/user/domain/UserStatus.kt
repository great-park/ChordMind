package com.chordmind.user.domain

/**
 * 사용자 계정 상태 Enum
 */
enum class UserStatus(
    val displayName: String,
    val description: String,
    val isActive: Boolean = true
) {
    ACTIVE("활성", "정상적으로 사용 가능한 계정", true),
    INACTIVE("비활성", "일시적으로 비활성화된 계정", false),
    SUSPENDED("정지", "관리자에 의해 정지된 계정", false),
    BANNED("차단", "영구적으로 차단된 계정", false),
    PENDING("승인대기", "가입 승인을 기다리는 계정", false),
    DORMANT("휴면", "장기간 미사용으로 휴면 상태", false),
    DELETED("삭제", "삭제된 계정", false);

    companion object {
        /**
         * 활성화된 상태들만 반환
         */
        fun getActiveStatuses(): List<UserStatus> {
            return values().filter { it.isActive }
        }

        /**
         * 로그인 가능한 상태들 반환
         */
        fun getLoginableStatuses(): List<UserStatus> {
            return listOf(ACTIVE)
        }

        /**
         * 관리자 개입이 필요한 상태들 반환
         */
        fun getAdminActionRequired(): List<UserStatus> {
            return listOf(SUSPENDED, BANNED, PENDING)
        }
    }
}