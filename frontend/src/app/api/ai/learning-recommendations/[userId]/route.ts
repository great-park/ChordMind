import { NextRequest, NextResponse } from 'next/server'

export async function GET(
  request: NextRequest,
  { params }: { params: { userId: string } }
) {
  try {
    const { searchParams } = new URL(request.url)
    const includeProgress = searchParams.get('include_progress') || 'true'
    const maxRecommendations = searchParams.get('max_recommendations') || '5'
    
    const response = await fetch(
      `${process.env.AI_SERVICE_URL}/api/ai/learning-recommendations/${params.userId}?include_progress=${includeProgress}&max_recommendations=${maxRecommendations}`
    )
    
    if (!response.ok) {
      return NextResponse.json(
        { error: 'AI 학습 추천 데이터를 가져오는데 실패했습니다.' },
        { status: response.status }
      )
    }
    
    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error('AI learning recommendations error:', error)
    return NextResponse.json(
      { error: '학습 추천 서비스에 연결할 수 없습니다.' },
      { status: 500 }
    )
  }
}