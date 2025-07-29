import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const response = await fetch(`${process.env.HARMONY_SERVICE_URL}/api/analytics/global`)
    
    if (response.ok) {
      const data = await response.json()
      return NextResponse.json(data)
    } else {
      return NextResponse.json({ error: '전체 통계를 불러오지 못했습니다.' }, { status: 404 })
    }
  } catch (error) {
    return NextResponse.json({ error: '전체 통계를 불러오지 못했습니다.' }, { status: 500 })
  }
} 