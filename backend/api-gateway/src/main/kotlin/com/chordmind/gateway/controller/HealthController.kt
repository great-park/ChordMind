package com.chordmind.gateway.controller

import com.chordmind.gateway.domain.*
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController
import org.springframework.web.reactive.function.client.WebClient
import reactor.core.publisher.Mono
import java.time.LocalDateTime
import java.util.concurrent.ConcurrentHashMap

@RestController
@RequestMapping("/health")
class HealthController(
    private val webClient: WebClient
) {

    private val serviceStatus = ConcurrentHashMap<MicroService, ServiceHealth>()

    @GetMapping
    fun gatewayHealth(): ResponseEntity<Map<String, Any>> {
        return ResponseEntity.ok(
            mapOf(
                "status" to HealthStatus.UP,
                "service" to "api-gateway",
                "timestamp" to LocalDateTime.now(),
                "version" to "1.0.0"
            )
        )
    }

    @GetMapping("/services")
    fun servicesHealth(): ResponseEntity<Map<String, Any>> {
        // Enum을 활용한 서비스 헬스체크
        val healthChecks = MicroService.values().map { service ->
            checkServiceHealth(service)
        }

        val statusMap = serviceStatus.mapKeys { it.key.serviceName }
        val overallStatus = GatewayOverallStatus.calculateOverallStatus(
            serviceStatus.mapValues { it.value.healthStatus }
        )

        return ResponseEntity.ok(
            mapOf(
                "timestamp" to LocalDateTime.now(),
                "services" to statusMap,
                "overall" to overallStatus,
                "criticalServices" to MicroService.getCriticalServices().map { service ->
                    mapOf(
                        "name" to service.serviceName,
                        "status" to serviceStatus[service]?.healthStatus ?: HealthStatus.UNKNOWN,
                        "priority" to service.priority
                    )
                }
            )
        )
    }

    private fun checkServiceHealth(serviceName: String, healthUrl: String): Mono<ServiceHealth> {
        return webClient.get()
            .uri(healthUrl)
            .retrieve()
            .bodyToM(Map::class.java)
            .map { response ->
                val status = response["status"] as? String ?: "UNKNOWN"
                ServiceHealth(
                    service = serviceName,
                    status = status,
                    timestamp = LocalDateTime.now(),
                    details = response
                )
            }
            .onErrorReturn(
                ServiceHealth(
                    service = serviceName,
                    status = "DOWN",
                    timestamp = LocalDateTime.now(),
                    details = mapOf("error" to "Service unavailable")
                )
            )
            .doOnNext { serviceStatus[serviceName] = it }
    }

    @GetMapping("/metrics")
    fun gatewayMetrics(): ResponseEntity<Map<String, Any>> {
        return ResponseEntity.ok(
            mapOf(
                "timestamp" to LocalDateTime.now(),
                "activeConnections" to serviceStatus.size,
                "services" to serviceStatus.mapValues { it.value.status },
                "uptime" to System.currentTimeMillis(),
                "memory" to mapOf(
                    "total" to Runtime.getRuntime().totalMemory(),
                    "free" to Runtime.getRuntime().freeMemory(),
                    "used" to Runtime.getRuntime().totalMemory() - Runtime.getRuntime().freeMemory()
                )
            )
        )
    }
}

data class ServiceHealth(
    val service: String,
    val healthStatus: HealthStatus,
    val timestamp: LocalDateTime,
    val details: Map<String, Any>,
    val priority: ServicePriority,
    val category: ServiceCategory,
    val responseTimeMs: Long? = null,
    val lastSuccessfulCheck: LocalDateTime? = null,
    val consecutiveFailures: Int = 0
) {
    /**
     * 하위 호환성을 위한 문자열 상태
     */
    val status: String
        get() = healthStatus.name
        
    /**
     * 서비스가 정상인지 확인
     */
    val isHealthy: Boolean
        get() = healthStatus in HealthStatus.getHealthyStates()
        
    /**
     * 알림이 필요한지 확인
     */
    val requiresAlert: Boolean
        get() = healthStatus.severity.requiresAlert || consecutiveFailures >= 3
} 