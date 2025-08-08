package com.chordmind.gateway.config

import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.security.config.annotation.web.reactive.EnableWebFluxSecurity
import org.springframework.security.config.web.server.ServerHttpSecurity
import org.springframework.security.web.server.SecurityWebFilterChain

@Configuration
@EnableWebFluxSecurity
class SecurityConfig {

    @Bean
    fun springSecurityFilterChain(http: ServerHttpSecurity): SecurityWebFilterChain {
        return http
            .csrf { it.disable() }
            .headers { headers ->
                headers.frameOptions { it.disable() }
            }
            .authorizeExchange { exchanges ->
                exchanges
                    .pathMatchers("/api/users/signin", "/api/users/signup", "/health", "/actuator/**", "/fallback/**").permitAll()
                    .anyExchange().permitAll()
            }
            .build()
    }
}


