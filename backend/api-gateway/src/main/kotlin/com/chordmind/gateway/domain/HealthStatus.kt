package com.chordmind.gateway.domain

/**
 * 서비스 헬스 상태 Enum
 */
enum class HealthStatus(
    val displayName: String,
    val description: String,
    val severity: HealthSeverity,
    val color: String
) {
    UP("정상", "서비스가 정상적으로 작동 중", HealthSeverity.NORMAL, "#4CAF50"),
    DOWN("중단", "서비스가 완전히 중단됨", HealthSeverity.CRITICAL, "#F44336"),
    DEGRADED("성능 저하", "서비스가 느리게 응답", HealthSeverity.WARNING, "#FF9800"),
    UNKNOWN("알 수 없음", "상태를 확인할 수 없음", HealthSeverity.WARNING, "#9E9E9E"),
    STARTING("시작 중", "서비스가 시작되고 있음", HealthSeverity.INFO, "#2196F3"),
    STOPPING("중지 중", "서비스가 중지되고 있음", HealthSeverity.WARNING, "#FF5722"),
    MAINTENANCE("점검 중", "예정된 점검으로 일시 중단", HealthSeverity.INFO, "#9C27B0");

    companion object {
        /**
         * 문자열로부터 HealthStatus 파싱
         */
        fun fromString(status: String): HealthStatus {
            return when (status.uppercase()) {
                "UP", "HEALTHY", "OK" -> UP
                "DOWN", "UNHEALTHY", "ERROR" -> DOWN
                "DEGRADED", "SLOW", "WARNING" -> DEGRADED
                "STARTING", "INITIALIZING" -> STARTING
                "STOPPING", "SHUTTING_DOWN" -> STOPPING
                "MAINTENANCE", "UNDER_MAINTENANCE" -> MAINTENANCE
                else -> UNKNOWN
            }
        }

        /**
         * 정상 상태들
         */
        fun getHealthyStates(): List<HealthStatus> {
            return listOf(UP, STARTING)
        }

        /**
         * 문제가 있는 상태들
         */
        fun getUnhealthyStates(): List<HealthStatus> {
            return listOf(DOWN, DEGRADED, UNKNOWN)
        }

        /**
         * 일시적 상태들
         */
        fun getTransitionalStates(): List<HealthStatus> {
            return listOf(STARTING, STOPPING, MAINTENANCE)
        }
    }
}

/**
 * 헬스 상태 심각도 Enum
 */
enum class HealthSeverity(
    val displayName: String,
    val level: Int,
    val requiresAlert: Boolean
) {
    NORMAL("정상", 0, false),
    INFO("정보", 1, false),
    WARNING("경고", 2, true),
    CRITICAL("치명적", 3, true);

    companion object {
        fun getAlertRequiredSeverities(): List<HealthSeverity> {
            return values().filter { it.requiresAlert }
        }
    }
}

/**
 * 게이트웨이 전체 상태 Enum
 */
enum class GatewayOverallStatus(
    val displayName: String,
    val description: String
) {
    HEALTHY("정상", "모든 서비스가 정상 작동"),
    PARTIALLY_HEALTHY("부분 정상", "일부 서비스에 문제가 있지만 주요 기능은 작동"),
    DEGRADED("성능 저하", "여러 서비스에 문제가 있어 성능이 저하됨"),
    UNHEALTHY("비정상", "많은 서비스에 문제가 있어 정상 서비스 불가"),
    CRITICAL("치명적", "핵심 서비스들이 중단되어 서비스 이용 불가");

    companion object {
        /**
         * 서비스들의 헬스 상태를 기반으로 전체 상태 계산
         */
        fun calculateOverallStatus(serviceStatuses: Map<String, HealthStatus>): GatewayOverallStatus {
            if (serviceStatuses.isEmpty()) return UNKNOWN

            val totalServices = serviceStatuses.size
            val healthyServices = serviceStatuses.values.count { it in HealthStatus.getHealthyStates() }
            val downServices = serviceStatuses.values.count { it == HealthStatus.DOWN }
            val degradedServices = serviceStatuses.values.count { it == HealthStatus.DEGRADED }

            return when {
                healthyServices == totalServices -> HEALTHY
                downServices == 0 && degradedServices <= totalServices * 0.2 -> PARTIALLY_HEALTHY
                downServices <= totalServices * 0.3 -> DEGRADED
                downServices <= totalServices * 0.5 -> UNHEALTHY
                else -> CRITICAL
            }
        }

        private val UNKNOWN = UNHEALTHY // fallback
    }
}

/**
 * 메트릭 타입 Enum
 */
enum class MetricType(
    val displayName: String,
    val unit: String,
    val category: MetricCategory
) {
    // 성능 메트릭
    RESPONSE_TIME("응답 시간", "ms", MetricCategory.PERFORMANCE),
    THROUGHPUT("처리량", "req/sec", MetricCategory.PERFORMANCE),
    ERROR_RATE("에러율", "%", MetricCategory.PERFORMANCE),
    
    // 리소스 메트릭
    CPU_USAGE("CPU 사용률", "%", MetricCategory.RESOURCE),
    MEMORY_USAGE("메모리 사용률", "%", MetricCategory.RESOURCE),
    DISK_USAGE("디스크 사용률", "%", MetricCategory.RESOURCE),
    
    // 네트워크 메트릭
    ACTIVE_CONNECTIONS("활성 연결", "count", MetricCategory.NETWORK),
    BANDWIDTH_USAGE("대역폭 사용량", "MB/s", MetricCategory.NETWORK),
    
    // 비즈니스 메트릭
    ACTIVE_USERS("활성 사용자", "count", MetricCategory.BUSINESS),
    REQUESTS_PER_MINUTE("분당 요청", "req/min", MetricCategory.BUSINESS);
}

/**
 * 메트릭 카테고리 Enum
 */
enum class MetricCategory(
    val displayName: String,
    val color: String
) {
    PERFORMANCE("성능", "#2196F3"),
    RESOURCE("리소스", "#4CAF50"),
    NETWORK("네트워크", "#FF9800"),
    BUSINESS("비즈니스", "#9C27B0");
}