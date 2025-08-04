package com.chordmind.user.domain

/**
 * 프로필 공개 범위 Enum
 */
enum class ProfileVisibility(
    val displayName: String,
    val description: String,
    val level: Int
) {
    PUBLIC("전체 공개", "모든 사용자에게 프로필 공개", 3),
    FRIENDS_ONLY("친구만", "친구로 등록된 사용자에게만 공개", 2),
    PRIVATE("비공개", "본인만 볼 수 있음", 1);

    companion object {
        fun getDefault(): ProfileVisibility = FRIENDS_ONLY
        
        fun getMoreRestrictive(current: ProfileVisibility, target: ProfileVisibility): ProfileVisibility {
            return if (current.level <= target.level) current else target
        }
    }
}

/**
 * 활동 기록 공개 범위 Enum
 */
enum class ActivityVisibility(
    val displayName: String,
    val description: String
) {
    PUBLIC("전체 공개", "모든 사용자가 활동 기록 확인 가능"),
    FRIENDS_ONLY("친구만", "친구만 활동 기록 확인 가능"),
    PRIVATE("비공개", "본인만 활동 기록 확인 가능"),
    SUMMARY_ONLY("요약만", "상세 기록은 숨기고 요약 정보만 공개");

    companion object {
        fun getDefault(): ActivityVisibility = SUMMARY_ONLY
    }
}

/**
 * 연락처 공개 범위 Enum
 */
enum class ContactVisibility(
    val displayName: String,
    val description: String
) {
    PUBLIC("전체 공개", "모든 사용자가 연락 가능"),
    FRIENDS_ONLY("친구만", "친구만 연락 가능"),
    NONE("비공개", "연락처 정보 비공개");

    companion object {
        fun getDefault(): ContactVisibility = FRIENDS_ONLY
    }
}

/**
 * 데이터 수집 동의 타입 Enum
 */
enum class DataCollectionType(
    val displayName: String,
    val description: String,
    val required: Boolean
) {
    ESSENTIAL("필수 데이터", "서비스 제공에 필요한 기본 데이터", true),
    ANALYTICS("분석 데이터", "서비스 개선을 위한 사용 패턴 분석", false),
    PERSONALIZATION("개인화 데이터", "맞춤형 서비스 제공을 위한 데이터", false),
    MARKETING("마케팅 데이터", "프로모션 및 마케팅을 위한 데이터", false),
    THIRD_PARTY("제3자 공유", "파트너사와의 데이터 공유", false);

    companion object {
        fun getRequired(): List<DataCollectionType> {
            return values().filter { it.required }
        }
        
        fun getOptional(): List<DataCollectionType> {
            return values().filter { !it.required }
        }
        
        fun getDefault(): List<DataCollectionType> {
            return listOf(ESSENTIAL, ANALYTICS, PERSONALIZATION)
        }
    }
}

/**
 * 계정 보안 레벨 Enum
 */
enum class SecurityLevel(
    val displayName: String,
    val description: String,
    val features: List<String>
) {
    BASIC("기본", "기본적인 보안 설정", 
        listOf("비밀번호 로그인", "이메일 인증")),
    ENHANCED("강화", "추가 보안 기능 활성화", 
        listOf("2단계 인증", "로그인 알림", "세션 관리")),
    MAXIMUM("최대", "최고 수준의 보안 설정", 
        listOf("생체 인증", "디바이스 등록", "접근 로그", "의심 활동 감지"));

    companion object {
        fun getDefault(): SecurityLevel = BASIC
        
        fun getRecommended(): SecurityLevel = ENHANCED
    }
}