import { NextRequest, NextResponse } from 'next/server'

export async function GET(
  request: NextRequest,
  { params }: { params: { userId: string } }
) {
  try {
    const { searchParams } = new URL(request.url)
    const period = searchParams.get('period') || 'month'
    const includeComparison = searchParams.get('include_comparison') || 'true'
    
    const response = await fetch(
      `${process.env.AI_SERVICE_URL}/api/ai/performance-stats/${params.userId}?period=${period}&include_comparison=${includeComparison}`
    )
    
    if (!response.ok) {
      return NextResponse.json(
        { error: 'AI 성과 통계 데이터를 가져오는데 실패했습니다.' },
        { status: response.status }
      )
    }
    
    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error('AI performance stats error:', error)
    return NextResponse.json(
      { error: '성과 통계 서비스에 연결할 수 없습니다.' },
      { status: 500 }
    )
  }
}