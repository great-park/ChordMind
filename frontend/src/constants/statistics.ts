export const STATISTICS_DATA = {
  overview: [
    {
      title: '총 연습 시간',
      value: '1,247시간',
      change: '+12%',
      changeType: 'positive' as const,
      icon: 'bi-clock',
      color: 'primary',
      description: '이번 주 평균 8.5시간'
    },
    {
      title: '완료한 곡',
      value: '89곡',
      change: '+5곡',
      changeType: 'positive' as const,
      icon: 'bi-music-note-list',
      color: 'success',
      description: '목표 대비 89% 달성'
    },
    {
      title: '평균 정확도',
      value: '92.5%',
      change: '+2.1%',
      changeType: 'positive' as const,
      icon: 'bi-target',
      color: 'info',
      description: '지난 주 대비 개선'
    },
    {
      title: '연속 연습일',
      value: '23일',
      change: '+3일',
      changeType: 'positive' as const,
      icon: 'bi-calendar-check',
      color: 'warning',
      description: '새로운 기록 달성!'
    }
  ],
  progress: [
    {
      title: '월간 연습 목표',
      progress: 85,
      target: 100,
      unit: '시간',
      color: 'primary',
      description: '이번 달 목표 달성까지 15시간 남음'
    },
    {
      title: '곡 완성도',
      progress: 67,
      target: 100,
      unit: '곡',
      color: 'success',
      description: '목표 100곡 중 67곡 완료'
    },
    {
      title: '정확도 목표',
      progress: 92.5,
      target: 95,
      unit: '%',
      color: 'info',
      description: '목표 95% 달성까지 2.5% 남음'
    }
  ],
  activities: [
    {
      id: '1',
      type: 'practice' as const,
      title: '피아노 연습 완료',
      description: '베토벤 소나타 14번 30분 연습',
      time: '10분 전',
      icon: 'bi-piano',
      color: 'primary'
    },
    {
      id: '2',
      type: 'achievement' as const,
      title: '새로운 배지 획득',
      description: '연속 연습 20일 달성',
      time: '1시간 전',
      icon: 'bi-trophy',
      color: 'warning'
    },
    {
      id: '3',
      type: 'feedback' as const,
      title: 'AI 피드백 수신',
      description: '박자 정확도 개선 필요',
      time: '2시간 전',
      icon: 'bi-chat-dots',
      color: 'info'
    },
    {
      id: '4',
      type: 'goal' as const,
      title: '목표 설정',
      description: '이번 주 10시간 연습 목표',
      time: '3시간 전',
      icon: 'bi-flag',
      color: 'success'
    },
    {
      id: '5',
      type: 'practice' as const,
      title: '기타 연습 완료',
      description: '코드 연습 45분',
      time: '5시간 전',
      icon: 'bi-music-note',
      color: 'primary'
    }
  ],
  leaderboard: [
    {
      id: '1',
      rank: 1,
      name: '김음악',
      score: 9850,
      change: 150,
      category: '피아노'
    },
    {
      id: '2',
      rank: 2,
      name: '이연주',
      score: 8720,
      change: -50,
      category: '기타'
    },
    {
      id: '3',
      rank: 3,
      name: '박리듬',
      score: 8450,
      change: 200,
      category: '드럼'
    },
    {
      id: '4',
      rank: 4,
      name: '최하모니',
      score: 7980,
      change: 80,
      category: '피아노'
    },
    {
      id: '5',
      rank: 5,
      name: '정멜로디',
      score: 7650,
      change: -30,
      category: '기타'
    },
    {
      id: '6',
      rank: 6,
      name: '한소리',
      score: 7320,
      change: 120,
      category: '피아노'
    },
    {
      id: '7',
      rank: 7,
      name: '강비트',
      score: 6980,
      change: 90,
      category: '드럼'
    },
    {
      id: '8',
      rank: 8,
      name: '윤코드',
      score: 6750,
      change: -20,
      category: '기타'
    }
  ]
}; 