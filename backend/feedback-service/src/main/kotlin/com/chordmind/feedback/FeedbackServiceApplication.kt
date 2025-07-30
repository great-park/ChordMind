package com.chordmind.feedback

import org.springframework.boot.autoconfigure.SpringBootApplication
import org.springframework.boot.runApplication
import org.springframework.cloud.client.discovery.EnableDiscoveryClient

@SpringBootApplication
@EnableDiscoveryClient
class FeedbackServiceApplication

fun main(args: Array<String>) {
    runApplication<FeedbackServiceApplication>(*args)
} 