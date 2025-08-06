package com.chordmind.harmony.service.admin.dto

data class ValidationResponse(
    val isValid: Boolean,
    val errors: List<String>
)