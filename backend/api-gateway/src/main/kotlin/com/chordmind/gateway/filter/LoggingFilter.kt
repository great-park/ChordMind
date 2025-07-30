package com.chordmind.gateway.filter

import org.slf4j.LoggerFactory
import org.springframework.cloud.gateway.filter.GatewayFilterChain
import org.springframework.cloud.gateway.filter.GlobalFilter
import org.springframework.core.Ordered
import org.springframework.http.server.reactive.ServerHttpRequest
import org.springframework.stereotype.Component
import org.springframework.web.server.ServerWebExchange
import reactor.core.publisher.Mono
import java.time.LocalDateTime
import java.time.format.DateTimeFormatter

@Component
class LoggingFilter : GlobalFilter, Ordered {

    private val logger = LoggerFactory.getLogger(LoggingFilter::class.java)

    override fun filter(exchange: ServerWebExchange, chain: GatewayFilterChain): Mono<Void> {
        val request = exchange.request
        val startTime = System.currentTimeMillis()
        
        logRequest(request)
        
        return chain.filter(exchange)
            .doFinally {
                val endTime = System.currentTimeMillis()
                val duration = endTime - startTime
                logResponse(exchange, duration)
            }
    }

    private fun logRequest(request: ServerHttpRequest) {
        val timestamp = LocalDateTime.now().format(DateTimeFormatter.ISO_LOCAL_DATE_TIME)
        val method = request.method?.name ?: "UNKNOWN"
        val path = request.path.value()
        val userAgent = request.headers.getFirst("User-Agent") ?: "Unknown"
        val userIp = request.remoteAddress?.address?.hostAddress ?: "Unknown"
        val userId = request.headers.getFirst("X-User-ID") ?: "Anonymous"
        
        logger.info("""
            |=== REQUEST LOG ===
            |Timestamp: $timestamp
            |Method: $method
            |Path: $path
            |User-Agent: $userAgent
            |IP: $userIp
            |User-ID: $userId
            |==================
        """.trimMargin())
    }

    private fun logResponse(exchange: ServerWebExchange, duration: Long) {
        val timestamp = LocalDateTime.now().format(DateTimeFormatter.ISO_LOCAL_DATE_TIME)
        val statusCode = exchange.response.statusCode?.value() ?: 0
        val path = exchange.request.path.value()
        val userId = exchange.request.headers.getFirst("X-User-ID") ?: "Anonymous"
        
        logger.info("""
            |=== RESPONSE LOG ===
            |Timestamp: $timestamp
            |Path: $path
            |Status: $statusCode
            |Duration: ${duration}ms
            |User-ID: $userId
            |===================
        """.trimMargin())
    }

    override fun getOrder(): Int {
        return Ordered.LOWEST_PRECEDENCE - 100
    }
} 