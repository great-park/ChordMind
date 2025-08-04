package com.chordmind.harmony.domain

/**
 * 음악 장르 Enum
 * 화성 진행 패턴에서 사용되는 장르 분류
 */
enum class MusicGenre(
    val displayName: String,
    val description: String,
    val popularity: Int = 50
) {
    ALL("전체", "모든 장르에서 사용되는 패턴", 100),
    POP("팝", "현대 팝 음악 스타일", 95),
    JAZZ("재즈", "재즈와 스윙 스타일", 85),
    BLUES("블루스", "블루스와 R&B 스타일", 80),
    CLASSICAL("클래식", "클래식과 바로크 스타일", 75),
    BALLAD("발라드", "감성적이고 로맨틱한 스타일", 90),
    ROCK("록", "록과 하드록 스타일", 85),
    NEO_SOUL("네오소울", "네오소울과 펑크 스타일", 70),
    LATIN("라틴", "라틴과 보사노바 스타일", 65),
    COUNTRY("컨트리", "컨트리와 포크 스타일", 60),
    ELECTRONIC("일렉트로닉", "EDM과 신스팝 스타일", 75),
    REGGAE("레게", "레게와 스카 스타일", 55);

    companion object {
        /**
         * 문자열 값으로부터 MusicGenre를 찾는 메서드
         */
        fun fromString(value: String): MusicGenre? {
            return values().find { 
                it.name.equals(value, ignoreCase = true) || 
                it.displayName == value 
            }
        }

        /**
         * 인기도 순으로 정렬된 장르 목록
         */
        fun getByPopularity(): List<MusicGenre> {
            return values().sortedByDescending { it.popularity }
        }

        /**
         * 초보자용 장르 목록 (인기도 80 이상)
         */
        fun getBeginnerFriendly(): List<MusicGenre> {
            return values().filter { it.popularity >= 80 }
        }
    }
}