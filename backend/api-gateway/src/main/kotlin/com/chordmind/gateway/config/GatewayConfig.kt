package com.chordmind.gateway.config

import org.springframework.cloud.gateway.filter.ratelimit.KeyResolver
import org.springframework.cloud.gateway.filter.ratelimit.RedisRateLimiter
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import reactor.core.publisher.Mono

@Configuration
class GatewayConfig {

    // Routes are configured in application.yml to avoid duplication with Java DSL.

    @Bean
    fun redisRateLimiter(): RedisRateLimiter {
        return RedisRateLimiter(10, 20) // 10 requests per second, 20 burst
    }

    @Bean
    fun userKeyResolver(): KeyResolver {
        return KeyResolver { exchange ->
            val user = exchange.request.headers.getFirst("X-User-ID")
            if (user != null) {
                Mono.just(user)
            } else {
                Mono.just("anonymous")
            }
        }
    }
}