package com.chordmind.harmony

import org.springframework.boot.autoconfigure.SpringBootApplication
import org.springframework.boot.runApplication

@SpringBootApplication
class HarmonyServiceApplication

fun main(args: Array<String>) {
    runApplication<HarmonyServiceApplication>(*args)
} 