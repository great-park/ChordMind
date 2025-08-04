package com.chordmind.feedback.domain

/**
 * 확장된 피드백 상태 Enum
 */
enum class FeedbackStatusExtended(
    val displayName: String,
    val description: String,
    val isTerminal: Boolean = false,
    val nextPossibleStates: List<FeedbackStatusExtended> = emptyList()
) {
    // 초기 상태들
    SUBMITTED("제출됨", "피드백이 제출되어 대기 중"),
    ACKNOWLEDGED("확인됨", "피드백이 확인되고 검토 대기 중"),
    
    // 검토 단계
    UNDER_REVIEW("검토중", "담당자가 검토 중"),
    TRIAGED("분류됨", "우선순위와 담당자가 배정됨"),
    
    // 작업 단계
    IN_PROGRESS("진행중", "실제 작업이 진행 중"),
    DEVELOPMENT("개발중", "개발팀에서 작업 중"),
    TESTING("테스트중", "QA 팀에서 테스트 중"),
    
    // 검증 단계
    PENDING_VERIFICATION("검증 대기", "사용자 검증을 기다리는 중"),
    USER_TESTING("사용자 테스트", "사용자가 테스트 중"),
    
    // 완료 상태들
    RESOLVED("해결됨", "문제가 해결됨", true),
    IMPLEMENTED("구현됨", "기능이 구현되어 배포됨", true),
    
    // 종료 상태들
    REJECTED("거부됨", "구현하지 않기로 결정", true),
    DUPLICATE("중복됨", "기존 피드백과 중복", true),
    WONT_FIX("수정 안함", "수정하지 않기로 결정", true),
    INVALID("무효", "유효하지 않은 피드백", true),
    
    // 보류 상태들
    ON_HOLD("보류", "일시적으로 작업 중단"),
    WAITING_FOR_INFO("정보 대기", "추가 정보를 기다리는 중"),
    DEFERRED("연기", "향후 버전으로 연기");

    companion object {
        /**
         * 워크플로우 초기화
         */
        fun initializeWorkflow() {
            // 다음 가능한 상태들 설정 (실제로는 이런 식으로 하지 않고 별도 관리)
        }
        
        /**
         * 활성 상태들 반환
         */
        fun getActiveStates(): List<FeedbackStatusExtended> {
            return values().filter { !it.isTerminal }
        }
        
        /**
         * 완료 상태들 반환
         */
        fun getTerminalStates(): List<FeedbackStatusExtended> {
            return values().filter { it.isTerminal }
        }
        
        /**
         * 기존 FeedbackStatus와의 매핑
         */
        fun fromLegacyStatus(legacyStatus: FeedbackStatus): FeedbackStatusExtended {
            return when (legacyStatus) {
                FeedbackStatus.PENDING -> SUBMITTED
                FeedbackStatus.IN_PROGRESS -> IN_PROGRESS
                FeedbackStatus.RESOLVED -> RESOLVED
                FeedbackStatus.REJECTED -> REJECTED
                FeedbackStatus.CLOSED -> RESOLVED
            }
        }
    }
}

/**
 * 피드백 처리 액션 Enum
 */
enum class FeedbackAction(
    val displayName: String,
    val description: String,
    val requiresNote: Boolean = false,
    val requiresApproval: Boolean = false
) {
    // 기본 액션
    ACKNOWLEDGE("확인", "피드백을 확인함"),
    ASSIGN("할당", "담당자에게 할당", true),
    PRIORITIZE("우선순위 설정", "우선순위를 변경", true),
    
    // 진행 액션
    START_WORK("작업 시작", "작업을 시작함", true),
    UPDATE_PROGRESS("진행상황 업데이트", "진행상황을 업데이트", true),
    REQUEST_INFO("정보 요청", "추가 정보를 요청", true),
    
    // 완료 액션
    RESOLVE("해결", "문제를 해결함", true),
    IMPLEMENT("구현", "기능을 구현함", true),
    DEPLOY("배포", "변경사항을 배포함"),
    
    // 종료 액션
    REJECT("거부", "피드백을 거부함", true, true),
    MARK_DUPLICATE("중복 표시", "중복 피드백으로 표시", true),
    CLOSE("종료", "피드백을 종료함", true),
    
    // 기타 액션
    ESCALATE("에스컬레이션", "상위 관리자에게 전달", true, true),
    DEFER("연기", "향후 버전으로 연기", true, true),
    REOPEN("재오픈", "종료된 피드백을 다시 열기", true);

    companion object {
        /**
         * 현재 상태에서 가능한 액션들
         */
        fun getAvailableActions(currentStatus: FeedbackStatusExtended): List<FeedbackAction> {
            return when (currentStatus) {
                FeedbackStatusExtended.SUBMITTED -> listOf(ACKNOWLEDGE, ASSIGN, REJECT)
                FeedbackStatusExtended.ACKNOWLEDGED -> listOf(ASSIGN, PRIORITIZE, START_WORK)
                FeedbackStatusExtended.IN_PROGRESS -> listOf(UPDATE_PROGRESS, REQUEST_INFO, RESOLVE, DEFER)
                FeedbackStatusExtended.RESOLVED -> listOf(CLOSE, REOPEN)
                else -> emptyList()
            }
        }
    }
}

/**
 * 피드백 배정 상태 Enum
 */
enum class AssignmentStatus(
    val displayName: String,
    val description: String
) {
    UNASSIGNED("미배정", "아직 담당자가 배정되지 않음"),
    ASSIGNED("배정됨", "담당자에게 배정됨"),
    ACCEPTED("수락됨", "담당자가 작업을 수락함"),
    REASSIGNED("재배정", "다른 담당자로 재배정됨"),
    ESCALATED("에스컬레이션", "상위 담당자로 전달됨");
}

/**
 * 피드백 만족도 Enum
 */
enum class FeedbackSatisfaction(
    val displayName: String,
    val score: Int,
    val emoji: String
) {
    VERY_DISSATISFIED("매우 불만족", 1, "😞"),
    DISSATISFIED("불만족", 2, "😐"),
    NEUTRAL("보통", 3, "😊"),
    SATISFIED("만족", 4, "😄"),
    VERY_SATISFIED("매우 만족", 5, "🤩");

    companion object {
        fun fromScore(score: Int): FeedbackSatisfaction? {
            return values().find { it.score == score }
        }
        
        fun getPositiveRatings(): List<FeedbackSatisfaction> {
            return listOf(SATISFIED, VERY_SATISFIED)
        }
    }
}