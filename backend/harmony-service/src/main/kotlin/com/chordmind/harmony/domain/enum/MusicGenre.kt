package com.chordmind.harmony.domain.enum

/**
 * 음악 장르 Enum (Rich Enum 패턴)
 * 화성 진행 패턴에서 사용되는 장르 분류와 비즈니스 로직 포함
 */
enum class MusicGenre(
    val displayName: String,
    val description: String,
    val popularity: Int,
    val era: MusicEra,
    val complexity: GenreComplexity,
    val typicalChords: List<String> = emptyList()
) {
    ALL(
        "전체", 
        "모든 장르에서 사용되는 패턴", 
        100, 
        MusicEra.UNIVERSAL, 
        GenreComplexity.MEDIUM
    ),
    POP(
        "팝", 
        "현대 팝 음악 스타일", 
        95, 
        MusicEra.MODERN, 
        GenreComplexity.SIMPLE,
        listOf("C", "Am", "F", "G", "Dm")
    ),
    JAZZ(
        "재즈", 
        "재즈와 스윙 스타일", 
        85, 
        MusicEra.CLASSIC, 
        GenreComplexity.COMPLEX,
        listOf("Cmaj7", "Dm7", "G7", "Am7", "Fmaj7")
    ),
    BLUES(
        "블루스", 
        "블루스와 R&B 스타일", 
        80, 
        MusicEra.CLASSIC, 
        GenreComplexity.MEDIUM,
        listOf("C7", "F7", "G7", "Am", "Dm")
    ),
    CLASSICAL(
        "클래식", 
        "클래식과 바로크 스타일", 
        75, 
        MusicEra.HISTORICAL, 
        GenreComplexity.COMPLEX,
        listOf("C", "G", "Am", "F", "Dm", "Em")
    ),
    BALLAD(
        "발라드", 
        "감성적이고 로맨틱한 스타일", 
        90, 
        MusicEra.MODERN, 
        GenreComplexity.SIMPLE,
        listOf("C", "Am", "F", "G", "Dm", "Em")
    ),
    ROCK(
        "록", 
        "록과 하드록 스타일", 
        85, 
        MusicEra.MODERN, 
        GenreComplexity.MEDIUM,
        listOf("C", "G", "Am", "F", "E", "A", "D")
    ),
    NEO_SOUL(
        "네오소울", 
        "네오소울과 펑크 스타일", 
        70, 
        MusicEra.CONTEMPORARY, 
        GenreComplexity.COMPLEX,
        listOf("Cmaj7", "Am7", "Fmaj7", "G7", "Dm7")
    ),
    LATIN(
        "라틴", 
        "라틴과 보사노바 스타일", 
        65, 
        MusicEra.CLASSIC, 
        GenreComplexity.MEDIUM,
        listOf("Cmaj7", "A7", "Dm7", "G7", "Em7b5")
    ),
    COUNTRY(
        "컨트리", 
        "컨트리와 포크 스타일", 
        60, 
        MusicEra.CLASSIC, 
        GenreComplexity.SIMPLE,
        listOf("C", "G", "Am", "F", "D", "Em")
    ),
    ELECTRONIC(
        "일렉트로닉", 
        "EDM과 신스팝 스타일", 
        75, 
        MusicEra.CONTEMPORARY, 
        GenreComplexity.MEDIUM,
        listOf("Am", "F", "C", "G", "Dm", "Em")
    ),
    REGGAE(
        "레게", 
        "레게와 스카 스타일", 
        55, 
        MusicEra.CLASSIC, 
        GenreComplexity.MEDIUM,
        listOf("C", "F", "G", "Am", "Dm")
    );
    
    val emoji: String
        get() = when (this) {
            ALL -> "🌍"
            POP -> "🎤"
            JAZZ -> "🎷"
            BLUES -> "🎸"
            CLASSICAL -> "🎻"
            BALLAD -> "💝"
            ROCK -> "🤘"
            NEO_SOUL -> "✨"
            LATIN -> "💃"
            COUNTRY -> "🤠"
            ELECTRONIC -> "🎛️"
            REGGAE -> "🏝️"
        }
    
    val isBeginnerFriendly: Boolean
        get() = popularity >= 80 && complexity != GenreComplexity.COMPLEX
    
    val recommendedForComplexity: Boolean
        get() = complexity == GenreComplexity.COMPLEX
    
    fun getCompatibleGenres(): List<MusicGenre> {
        return values().filter { 
            it != this && 
            it.era == this.era || 
            it.complexity == this.complexity 
        }
    }
    
    fun hasChord(chord: String): Boolean {
        return typicalChords.any { it.equals(chord, ignoreCase = true) }
    }
    
    companion object {
        fun fromString(value: String): MusicGenre? {
            return values().find { 
                it.name.equals(value, ignoreCase = true) || 
                it.displayName.equals(value, ignoreCase = true) 
            }
        }
        
        fun getByPopularity(): List<MusicGenre> {
            return values().sortedByDescending { it.popularity }
        }
        
        fun getBeginnerFriendly(): List<MusicGenre> {
            return values().filter { it.isBeginnerFriendly }
        }
        
        fun getByEra(era: MusicEra): List<MusicGenre> {
            return values().filter { it.era == era }
        }
        
        fun getByComplexity(complexity: GenreComplexity): List<MusicGenre> {
            return values().filter { it.complexity == complexity }
        }
        
        fun getForChord(chord: String): List<MusicGenre> {
            return values().filter { it.hasChord(chord) }
        }
    }
}

enum class MusicEra(val displayName: String, val period: String) {
    HISTORICAL("고전", "바로크~고전주의 (1600~1820)"),
    CLASSIC("클래식", "낭만주의~초기 모던 (1820~1950)"),  
    MODERN("모던", "현대 대중음악 (1950~2000)"),
    CONTEMPORARY("컨템포러리", "21세기 음악 (2000~현재)"),
    UNIVERSAL("범용", "시대를 초월한 스타일")
}

enum class GenreComplexity(val displayName: String, val description: String) {
    SIMPLE("단순", "기본적인 화성 구조"),
    MEDIUM("보통", "적당한 복잡도의 화성"),
    COMPLEX("복합", "고급 화성 기법 사용")
}