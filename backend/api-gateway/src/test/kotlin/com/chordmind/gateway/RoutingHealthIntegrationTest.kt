package com.chordmind.gateway

import org.junit.jupiter.api.AfterAll
import org.junit.jupiter.api.BeforeAll
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.TestInstance
import org.junit.jupiter.api.Assertions.assertEquals
import org.junit.jupiter.api.Assertions.assertTrue
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.boot.test.web.client.TestRestTemplate
import org.springframework.boot.test.web.server.LocalServerPort
import org.springframework.test.context.TestPropertySource
import com.github.tomakehurst.wiremock.WireMockServer
import com.github.tomakehurst.wiremock.client.WireMock.*
import com.github.tomakehurst.wiremock.core.WireMockConfiguration.options

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@TestInstance(TestInstance.Lifecycle.PER_CLASS)
@TestPropertySource(properties = [
    // Route target URIs are directed to WireMock instances
    "PRACTICE_SERVICE_URL=http://localhost:9001",
    "USER_SERVICE_URL=http://localhost:9002",
    "FEEDBACK_SERVICE_URL=http://localhost:9003",
    "GAME_SERVICE_URL=http://localhost:9004",
    "HARMONY_SERVICE_URL=http://localhost:9005",
    "AI_SERVICE_URL=http://localhost:9006",
    // Disable discovery
    "spring.cloud.gateway.discovery.locator.enabled=false"
])
class RoutingHealthIntegrationTest {

    @LocalServerPort
    private var port: Int = 0

    @Autowired
    private lateinit var restTemplate: TestRestTemplate

    private lateinit var practiceMock: WireMockServer
    private lateinit var userMock: WireMockServer
    private lateinit var feedbackMock: WireMockServer
    private lateinit var gameMock: WireMockServer
    private lateinit var harmonyMock: WireMockServer
    private lateinit var aiMock: WireMockServer

    @BeforeAll
    fun setupMocks() {
        practiceMock = WireMockServer(options().port(9001)).also { it.start() }
        userMock = WireMockServer(options().port(9002)).also { it.start() }
        feedbackMock = WireMockServer(options().port(9003)).also { it.start() }
        gameMock = WireMockServer(options().port(9004)).also { it.start() }
        harmonyMock = WireMockServer(options().port(9005)).also { it.start() }
        aiMock = WireMockServer(options().port(9006)).also { it.start() }

        listOf(practiceMock, userMock, feedbackMock, gameMock, harmonyMock).forEach { server ->
            server.stubFor(get(urlEqualTo("/actuator/health")).willReturn(aResponse()
                .withStatus(200)
                .withHeader("Content-Type", "application/json")
                .withBody("{""status"":""UP""}")))
        }
        aiMock.stubFor(get(urlEqualTo("/health")).willReturn(aResponse()
            .withStatus(200)
            .withHeader("Content-Type", "application/json")
            .withBody("{""status"":""ok""}")))

        // Generic passthrough endpoints under service bases
        practiceMock.stubFor(get(urlPathMatching("/healthcheck"))
            .willReturn(aResponse().withStatus(200).withBody("practice-ok")))
        userMock.stubFor(get(urlPathMatching("/healthcheck"))
            .willReturn(aResponse().withStatus(200).withBody("user-ok")))
        feedbackMock.stubFor(get(urlPathMatching("/healthcheck"))
            .willReturn(aResponse().withStatus(200).withBody("feedback-ok")))
        gameMock.stubFor(get(urlPathMatching("/healthcheck"))
            .willReturn(aResponse().withStatus(200).withBody("game-ok")))
        harmonyMock.stubFor(get(urlPathMatching("/healthcheck"))
            .willReturn(aResponse().withStatus(200).withBody("harmony-ok")))
        aiMock.stubFor(get(urlPathMatching("/healthcheck"))
            .willReturn(aResponse().withStatus(200).withBody("ai-ok")))
    }

    @AfterAll
    fun tearDownMocks() {
        listOf(practiceMock, userMock, feedbackMock, gameMock, harmonyMock, aiMock).forEach { it.stop() }
    }

    @Test
    fun `게이트웨이 자체 헬스 체크`() {
        val resp = restTemplate.getForEntity("http://localhost:$port/health", Map::class.java)
        assertEquals(200, resp.statusCode.value())
        assertTrue((resp.body?.get("status") as? String).equals("UP"))
    }

    @Test
    fun `서비스별 헬스 엔드포인트 라우팅`() {
        // practice-service route: /api/practice/** -> StripPrefix(1)
        val r1 = restTemplate.getForEntity("http://localhost:$port/api/practice/actuator/health", String::class.java)
        assertEquals(200, r1.statusCode.value())
        assertTrue(r1.body?.contains("UP") == true)

        // user-service route
        val r2 = restTemplate.getForEntity("http://localhost:$port/api/users/actuator/health", String::class.java)
        assertEquals(200, r2.statusCode.value())
        assertTrue(r2.body?.contains("UP") == true)

        // feedback-service route
        val r3 = restTemplate.getForEntity("http://localhost:$port/api/feedback/actuator/health", String::class.java)
        assertEquals(200, r3.statusCode.value())
        assertTrue(r3.body?.contains("UP") == true)

        // harmony-service route
        val r4 = restTemplate.getForEntity("http://localhost:$port/api/harmony/actuator/health", String::class.java)
        assertEquals(200, r4.statusCode.value())
        assertTrue(r4.body?.contains("UP") == true)

        // ai-analysis-service -> AI_SERVICE_URL -> /api/analysis/**
        val r5 = restTemplate.getForEntity("http://localhost:$port/api/analysis/health", String::class.java)
        assertEquals(200, r5.statusCode.value())
        assertTrue(r5.body?.contains("ok") == true)
    }
}


