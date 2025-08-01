package com.chordmind.gateway.config

import org.springframework.cloud.gateway.route.RouteLocator
import org.springframework.cloud.gateway.route.builder.RouteLocatorBuilder
import org.springframework.cloud.gateway.filter.ratelimit.KeyResolver
import org.springframework.cloud.gateway.filter.ratelimit.RedisRateLimiter
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.http.HttpMethod
import reactor.core.publisher.Mono
import java.time.Duration

@Configuration
class GatewayConfig {

    @Bean
    fun customRouteLocator(builder: RouteLocatorBuilder): RouteLocator {
        return builder.routes()
            .route("practice-service") { r ->
                r.path("/api/practice/**")
                    .filters { f ->
                        f.stripPrefix(1)
                            .circuitBreaker { cb ->
                                cb.setName("practice-service-circuit-breaker")
                                    .setFallbackUri("forward:/fallback/practice")
                            }
                            .requestRateLimiter { rl ->
                                rl.setRateLimiter(redisRateLimiter())
                                rl.setKeyResolver(userKeyResolver())
                            }
                            .addRequestHeader("X-Gateway-Service", "api-gateway")
                            .addResponseHeader("X-Gateway-Response", "true")
                            .modifyResponseBody(String::class.java, String::class.java) { exchange, s ->
                                s
                            }
                    }
                    .uri("lb://practice-service")
            }
            .route("ai-analysis-service") { r ->
                r.path("/api/analysis/**")
                    .filters { f ->
                        f.stripPrefix(1)
                            .circuitBreaker { cb ->
                                cb.setName("ai-analysis-service-circuit-breaker")
                                    .setFallbackUri("forward:/fallback/analysis")
                            }
                            .requestRateLimiter { rl ->
                                rl.setRateLimiter(redisRateLimiter())
                                rl.setKeyResolver(userKeyResolver())
                            }
                            .addRequestHeader("X-Gateway-Service", "api-gateway")
                            .addResponseHeader("X-Gateway-Response", "true")
                    }
                    .uri("lb://ai-analysis-service")
            }
            .route("user-service") { r ->
                r.path("/api/users/**")
                    .and()
                    .method(HttpMethod.GET, HttpMethod.POST, HttpMethod.PUT, HttpMethod.DELETE)
                    .filters { f ->
                        f.stripPrefix(1)
                            .circuitBreaker { cb ->
                                cb.setName("user-service-circuit-breaker")
                                    .setFallbackUri("forward:/fallback/users")
                            }
                            .requestRateLimiter { rl ->
                                rl.setRateLimiter(redisRateLimiter())
                                rl.setKeyResolver(userKeyResolver())
                            }
                            .addRequestHeader("X-Gateway-Service", "api-gateway")
                            .addResponseHeader("X-Gateway-Response", "true")
                            .modifyRequestBody(String::class.java, String::class.java) { exchange, s ->
                                s
                            }
                    }
                    .uri("lb://user-service")
            }
            .route("feedback-service") { r ->
                r.path("/api/feedback/**")
                    .filters { f ->
                        f.stripPrefix(1)
                            .circuitBreaker { cb ->
                                cb.setName("feedback-service-circuit-breaker")
                                    .setFallbackUri("forward:/fallback/feedback")
                            }
                            .requestRateLimiter { rl ->
                                rl.setRateLimiter(redisRateLimiter())
                                rl.setKeyResolver(userKeyResolver())
                            }
                            .addRequestHeader("X-Gateway-Service", "api-gateway")
                            .addResponseHeader("X-Gateway-Response", "true")
                    }
                    .uri("lb://feedback-service")
            }
            .route("game-service") { r ->
                r.path("/api/games/**")
                    .filters { f ->
                        f.stripPrefix(1)
                            .circuitBreaker { cb ->
                                cb.setName("game-service-circuit-breaker")
                                    .setFallbackUri("forward:/fallback/games")
                            }
                            .requestRateLimiter { rl ->
                                rl.setRateLimiter(redisRateLimiter())
                                rl.setKeyResolver(userKeyResolver())
                            }
                            .addRequestHeader("X-Gateway-Service", "api-gateway")
                            .addResponseHeader("X-Gateway-Response", "true")
                    }
                    .uri("lb://game-service")
            }
            .route("harmony-service") { r ->
                r.path("/api/harmony/**")
                    .filters { f ->
                        f.stripPrefix(1)
                            .circuitBreaker { cb ->
                                cb.setName("harmony-service-circuit-breaker")
                                    .setFallbackUri("forward:/fallback/harmony")
                            }
                            .requestRateLimiter { rl ->
                                rl.setRateLimiter(redisRateLimiter())
                                rl.setKeyResolver(userKeyResolver())
                            }
                            .addRequestHeader("X-Gateway-Service", "api-gateway")
                            .addResponseHeader("X-Gateway-Response", "true")
                    }
                    .uri("lb://harmony-service")
            }
            .route("health-check") { r ->
                r.path("/health/**")
                    .filters { f ->
                        f.addRequestHeader("X-Gateway-Service", "api-gateway")
                    }
                    .uri("lb://practice-service")
            }
            .route("api-docs") { r ->
                r.path("/api-docs/**")
                    .filters { f ->
                        f.addRequestHeader("X-Gateway-Service", "api-gateway")
                    }
                    .uri("lb://practice-service")
            }
            .build()
    }
    
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