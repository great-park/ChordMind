package com.chordmind.gateway.config

import org.springframework.cloud.gateway.route.RouteLocator
import org.springframework.cloud.gateway.route.builder.RouteLocatorBuilder
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration

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
                    }
                    .uri("lb://ai-analysis-service")
            }
            .route("user-service") { r ->
                r.path("/api/users/**")
                    .filters { f ->
                        f.stripPrefix(1)
                            .circuitBreaker { cb ->
                                cb.setName("user-service-circuit-breaker")
                                    .setFallbackUri("forward:/fallback/users")
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
                    }
                    .uri("lb://harmony-service")
            }
            .build()
    }
} 