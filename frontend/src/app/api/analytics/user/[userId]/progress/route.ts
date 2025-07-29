import { NextRequest, NextResponse } from 'next/server'

export async function GET(
  request: NextRequest,
  { params }: { params: { userId: string } }
) {
  try {
    const { searchParams } = new URL(request.url)
    const days = searchParams.get('days') || '30'
    
    const response = await fetch(`${process.env.HARMONY_SERVICE_URL}/api/analytics/user/${params.userId}/progress?days=${days}`)
    
    if (response.ok) {
      const data = await response.json()
      return NextResponse.json(data)
    } else {
      return NextResponse.json({ error: '진행 상황을 불러오지 못했습니다.' }, { status: 404 })
    }
  } catch (error) {
    return NextResponse.json({ error: '진행 상황을 불러오지 못했습니다.' }, { status: 500 })
  }
} 