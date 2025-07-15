package com.chordmind.user.service

import io.jsonwebtoken.Claims
import io.jsonwebtoken.Jwts
import io.jsonwebtoken.SignatureAlgorithm
import io.jsonwebtoken.security.Keys
import org.springframework.beans.factory.annotation.Value
import org.springframework.stereotype.Service
import java.security.Key
import java.util.*

@Service
class JwtService {
    
    @Value("\${jwt.secret}")
    private lateinit var secret: String
    
    @Value("\${jwt.expiration}")
    private var expiration: Long = 0
    
    private fun getSigningKey(): Key {
        val keyBytes = secret.toByteArray()
        return Keys.hmacShaKeyFor(keyBytes)
    }
    
    fun generateToken(email: String): String {
        val now = Date()
        val expiryDate = Date(now.time + expiration)
        
        return Jwts.builder()
            .setSubject(email)
            .setIssuedAt(now)
            .setExpiration(expiryDate)
            .signWith(getSigningKey(), SignatureAlgorithm.HS256)
            .compact()
    }
    
    fun validateToken(token: String): Boolean {
        return try {
            Jwts.parserBuilder()
                .setSigningKey(getSigningKey())
                .build()
                .parseClaimsJws(token)
            true
        } catch (e: Exception) {
            false
        }
    }
    
    fun extractEmail(token: String): String? {
        return try {
            val claims = Jwts.parserBuilder()
                .setSigningKey(getSigningKey())
                .build()
                .parseClaimsJws(token)
                .body
            claims.subject
        } catch (e: Exception) {
            null
        }
    }
    
    fun extractExpiration(token: String): Date? {
        return try {
            val claims = Jwts.parserBuilder()
                .setSigningKey(getSigningKey())
                .build()
                .parseClaimsJws(token)
                .body
            claims.expiration
        } catch (e: Exception) {
            null
        }
    }
    
    fun isTokenExpired(token: String): Boolean {
        val expiration = extractExpiration(token)
        return expiration?.before(Date()) ?: true
    }
} 