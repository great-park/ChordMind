package com.chordmind.harmony.config

import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.web.client.RestTemplate

/**
 * HTTP 클라이언트 설정
 * 외부 서비스(AI 서비스 등)와의 통신을 위한 RestTemplate 구성
 */
@Configuration
class HttpClientConfig {

    @Bean
    fun restTemplate(): RestTemplate {
        return RestTemplate()
    }
}