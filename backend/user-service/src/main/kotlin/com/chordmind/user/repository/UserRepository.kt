package com.chordmind.user.repository

import com.chordmind.user.domain.User
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository
import java.util.*

@Repository
interface UserRepository : JpaRepository<User, Long> {
    fun findByEmail(email: String): Optional<User>
    fun existsByEmail(email: String): Boolean
    fun findByEmailAndEnabled(email: String, enabled: Boolean): Optional<User>
    
    // 새로운 메서드들 추가
    fun searchUsers(name: String?, email: String?, role: String?): List<User> {
        val allUsers = findAll()
        return allUsers.filter { user ->
            (name == null || user.name.contains(name, ignoreCase = true) || user.nickname?.contains(name, ignoreCase = true) == true) &&
            (email == null || user.email.contains(email, ignoreCase = true)) &&
            (role == null || user.role.name.equals(role, ignoreCase = true))
        }
    }
} 