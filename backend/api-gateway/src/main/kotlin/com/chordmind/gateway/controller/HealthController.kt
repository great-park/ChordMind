package com.chordmind.gateway.controller

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

    private val serviceStatus = ConcurrentHashMap<String, ServiceHealth>()

    @GetMapping
    fun gatewayHealth(): ResponseEntity<Map<String, Any>> {
        return ResponseEntity.ok(
            mapOf(
                "status" to "UP",
                "service" to "api-gateway",
                "timestamp" to LocalDateTime.now(),
                "version" to "1.0.0"
            )
        )
    }

    @GetMapping("/services")
    fun servicesHealth(): ResponseEntity<Map<String, Any>> {
        val healthChecks = listOf(
            checkServiceHealth("practice-service", "http://practice-service:8081/actuator/health"),
            checkServiceHealth("user-service", "http://user-service:8082/actuator/health"),
            checkServiceHealth("harmony-service", "http://harmony-service:8083/actuator/health"),
            checkServiceHealth("ai-analysis-service", "http://ai-analysis-service:8084/actuator/health"),
            checkServiceHealth("feedback-service", "http://feedback-service:8085/actuator/health"),
            checkServiceHealth("game-service", "http://game-service:8086/actuator/health")
        )

        return ResponseEntity.ok(
            mapOf(
                "timestamp" to LocalDateTime.now(),
                "services" to serviceStatus,
                "overall" to if (serviceStatus.values.all { it.status == "UP" }) "UP" else "DOWN"
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
    val status: String,
    val timestamp: LocalDateTime,
    val details: Map<String, Any>
) 