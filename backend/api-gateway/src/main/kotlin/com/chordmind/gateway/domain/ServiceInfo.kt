package com.chordmind.gateway.domain

/**
 * 마이크로서비스 정보 Enum
 */
enum class MicroService(
    val serviceName: String,
    val displayName: String,
    val defaultPort: Int,
    val healthEndpoint: String,
    val priority: ServicePriority,
    val category: ServiceCategory
) {
    // 핵심 서비스
    USER_SERVICE("user-service", "사용자 서비스", 8082, "/actuator/health", ServicePriority.CRITICAL, ServiceCategory.CORE),
    PRACTICE_SERVICE("practice-service", "연습 서비스", 8081, "/actuator/health", ServicePriority.HIGH, ServiceCategory.CORE),
    HARMONY_SERVICE("harmony-service", "화성 서비스", 8083, "/actuator/health", ServicePriority.HIGH, ServiceCategory.CORE),
    
    // 지원 서비스
    FEEDBACK_SERVICE("feedback-service", "피드백 서비스", 8085, "/actuator/health", ServicePriority.MEDIUM, ServiceCategory.SUPPORT),
    AI_SERVICE("ai-service", "AI 서비스", 8088, "/health", ServicePriority.HIGH, ServiceCategory.ANALYTICS),
    
    // 부가 서비스
    GAME_SERVICE("game-service", "게임 서비스", 8086, "/actuator/health", ServicePriority.LOW, ServiceCategory.FEATURE),
    AI_ANALYSIS_SERVICE("ai-analysis-service", "AI 분석 서비스", 8084, "/actuator/health", ServicePriority.MEDIUM, ServiceCategory.ANALYTICS);

    /**
     * 서비스의 기본 URL 구성
     */
    fun getBaseUrl(useLocalhost: Boolean = false): String {
        val host = if (useLocalhost) "localhost" else serviceName
        return "http://$host:$defaultPort"
    }

    /**
     * 헬스체크 URL 구성
     */
    fun getHealthUrl(useLocalhost: Boolean = false): String {
        return "${getBaseUrl(useLocalhost)}$healthEndpoint"
    }

    companion object {
        /**
         * 서비스명으로 찾기
         */
        fun fromServiceName(serviceName: String): MicroService? {
            return values().find { it.serviceName == serviceName }
        }

        /**
         * 우선순위별 서비스 목록
         */
        fun getByPriority(priority: ServicePriority): List<MicroService> {
            return values().filter { it.priority == priority }
        }

        /**
         * 카테고리별 서비스 목록
         */
        fun getByCategory(category: ServiceCategory): List<MicroService> {
            return values().filter { it.category == category }
        }

        /**
         * 핵심 서비스들
         */
        fun getCriticalServices(): List<MicroService> {
            return getByPriority(ServicePriority.CRITICAL)
        }

        /**
         * 모니터링 순서 (우선순위 기준)
         */
        fun getMonitoringOrder(): List<MicroService> {
            return values().sortedBy { it.priority.level }
        }
    }
}

/**
 * 서비스 우선순위 Enum
 */
enum class ServicePriority(
    val displayName: String,
    val level: Int,
    val description: String
) {
    CRITICAL("치명적", 1, "서비스 중단 시 전체 시스템에 심각한 영향"),
    HIGH("높음", 2, "서비스 중단 시 주요 기능에 영향"),
    MEDIUM("보통", 3, "서비스 중단 시 일부 기능에 영향"),
    LOW("낮음", 4, "서비스 중단 시 최소한의 영향");

    companion object {
        fun getHighPriorityServices(): List<ServicePriority> {
            return listOf(CRITICAL, HIGH)
        }
    }
}

/**
 * 서비스 카테고리 Enum
 */
enum class ServiceCategory(
    val displayName: String,
    val description: String,
    val color: String
) {
    CORE("핵심", "핵심 비즈니스 로직을 담당하는 서비스", "#F44336"),
    SUPPORT("지원", "부가적인 지원 기능을 제공하는 서비스", "#FF9800"),
    ANALYTICS("분석", "데이터 분석 및 AI 기능을 제공하는 서비스", "#9C27B0"),
    FEATURE("기능", "특별한 기능을 제공하는 서비스", "#4CAF50"),
    INFRASTRUCTURE("인프라", "인프라 관련 서비스", "#607D8B");
}

/**
 * 라우팅 상태 Enum
 */
enum class RoutingStatus(
    val displayName: String,
    val description: String
) {
    ACTIVE("활성", "정상적으로 라우팅 중"),
    INACTIVE("비활성", "라우팅이 비활성화됨"),
    CIRCUIT_OPEN("서킷 열림", "서킷 브레이커가 열려 있음"),
    RATE_LIMITED("속도 제한", "속도 제한으로 인한 제한"),
    MAINTENANCE("점검", "점검으로 인한 라우팅 중단"),
    ERROR("오류", "라우팅 중 오류 발생");

    companion object {
        fun getHealthyStates(): List<RoutingStatus> {
            return listOf(ACTIVE)
        }

        fun getUnhealthyStates(): List<RoutingStatus> {
            return listOf(INACTIVE, CIRCUIT_OPEN, ERROR)
        }
    }
}

/**
 * 알림 타입 Enum
 */
enum class AlertType(
    val displayName: String,
    val severity: HealthSeverity,
    val icon: String
) {
    SERVICE_DOWN("서비스 중단", HealthSeverity.CRITICAL, "🚨"),
    SERVICE_DEGRADED("서비스 성능 저하", HealthSeverity.WARNING, "⚠️"),
    HIGH_LATENCY("높은 지연시간", HealthSeverity.WARNING, "🐌"),
    HIGH_ERROR_RATE("높은 에러율", HealthSeverity.WARNING, "❌"),
    RESOURCE_EXHAUSTION("리소스 고갈", HealthSeverity.CRITICAL, "💾"),
    CIRCUIT_BREAKER_OPEN("서킷 브레이커 열림", HealthSeverity.WARNING, "⚡"),
    RATE_LIMIT_EXCEEDED("속도 제한 초과", HealthSeverity.INFO, "🚦");

    companion object {
        fun getCriticalAlerts(): List<AlertType> {
            return values().filter { it.severity == HealthSeverity.CRITICAL }
        }
    }
}