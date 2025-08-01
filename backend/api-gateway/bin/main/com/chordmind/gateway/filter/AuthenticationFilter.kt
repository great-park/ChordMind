package com.chordmind.gateway.filter

import io.jsonwebtoken.Claims
import io.jsonwebtoken.Jwts
import io.jsonwebtoken.security.Keys
import org.springframework.beans.factory.annotation.Value
import org.springframework.cloud.gateway.filter.GatewayFilterChain
import org.springframework.cloud.gateway.filter.GlobalFilter
import org.springframework.core.Ordered
import org.springframework.http.HttpHeaders
import org.springframework.http.HttpStatus
import org.springframework.stereotype.Component
import org.springframework.web.server.ServerWebExchange
import reactor.core.publisher.Mono
import java.nio.charset.StandardCharsets

@Component
class AuthenticationFilter : GlobalFilter, Ordered {

    @Value("\${jwt.secret:chordmind-jwt-secret-key-2024-very-long-and-secure}")
    private lateinit var jwtSecret: String

    override fun filter(exchange: ServerWebExchange, chain: GatewayFilterChain): Mono<Void> {
        val request = exchange.request
        val path = request.path.value()

        // 인증이 필요하지 않은 경로들
        val publicPaths = listOf(
            "/api/users/signin",
            "/api/users/signup",
            "/health",
            "/actuator",
            "/fallback"
        )

        // 공개 경로는 인증 없이 통과
        if (publicPaths.any { path.startsWith(it) }) {
            return chain.filter(exchange)
        }

        val authHeader = request.headers.getFirst(HttpHeaders.AUTHORIZATION)
        
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            return unauthorized(exchange, "Missing or invalid authorization header")
        }

        val token = authHeader.substring(7)
        
        return try {
            val claims = validateToken(token)
            val userId = claims["userId"] as? String
            val email = claims["email"] as? String
            
            if (userId != null && email != null) {
                // 사용자 정보를 헤더에 추가
                val requestBuilder = request.mutate()
                    .header("X-User-ID", userId)
                    .header("X-User-Email", email)
                    .build()
                
                val mutatedExchange = exchange.mutate().request(requestBuilder).build()
                chain.filter(mutatedExchange)
            } else {
                unauthorized(exchange, "Invalid token claims")
            }
        } catch (e: Exception) {
            unauthorized(exchange, "Invalid token: ${e.message}")
        }
    }

    private fun validateToken(token: String): Claims {
        val key = Keys.hmacShaKeyFor(jwtSecret.toByteArray(StandardCharsets.UTF_8))
        return Jwts.parserBuilder()
            .setSigningKey(key)
            .build()
            .parseClaimsJws(token)
            .body
    }

    private fun unauthorized(exchange: ServerWebExchange, message: String): Mono<Void> {
        exchange.response.statusCode = HttpStatus.UNAUTHORIZED
        exchange.response.headers.add(HttpHeaders.CONTENT_TYPE, "application/json")
        
        val errorResponse = """
            {
                "error": "Unauthorized",
                "message": "$message",
                "timestamp": "${java.time.LocalDateTime.now()}",
                "path": "${exchange.request.path.value()}"
            }
        """.trimIndent()
        
        val buffer = exchange.response.bufferFactory().wrap(errorResponse.toByteArray())
        return exchange.response.writeWith(Mono.just(buffer))
    }

    override fun getOrder(): Int {
        return Ordered.HIGHEST_PRECEDENCE + 100
    }
} 