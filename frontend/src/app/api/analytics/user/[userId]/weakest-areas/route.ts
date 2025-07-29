import { NextRequest, NextResponse } from 'next/server'

export async function GET(
  request: NextRequest,
  { params }: { params: { userId: string } }
) {
  try {
    const response = await fetch(`${process.env.HARMONY_SERVICE_URL}/api/analytics/user/${params.userId}/weakest-areas`)
    
    if (response.ok) {
      const data = await response.json()
      return NextResponse.json(data)
    } else {
      return NextResponse.json({ error: '약점 영역을 불러오지 못했습니다.' }, { status: 404 })
    }
  } catch (error) {
    return NextResponse.json({ error: '약점 영역을 불러오지 못했습니다.' }, { status: 500 })
  }
} 