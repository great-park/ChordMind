import { NextRequest, NextResponse } from 'next/server'

export async function GET(
  request: NextRequest,
  { params }: { params: { userId: string } }
) {
  try {
    const { searchParams } = new URL(request.url)
    const includeWeakestAreas = searchParams.get('includeWeakestAreas') || 'true'
    const includeTimeEstimate = searchParams.get('includeTimeEstimate') || 'true'
    const maxRecommendations = searchParams.get('maxRecommendations') || '5'

    const response = await fetch(
      `${process.env.AI_SERVICE_URL}/api/ai/learning-path/${params.userId}?include_weakest_areas=${includeWeakestAreas}&include_time_estimate=${includeTimeEstimate}&max_recommendations=${maxRecommendations}`
    )

    if (response.ok) {
      const data = await response.json()
      return NextResponse.json(data)
    } else {
      return NextResponse.json({ error: '학습 경로 생성에 실패했습니다.' }, { status: 400 })
    }
  } catch (error) {
    return NextResponse.json({ error: '학습 경로 생성에 실패했습니다.' }, { status: 500 })
  }
} 