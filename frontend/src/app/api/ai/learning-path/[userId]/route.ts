import { NextRequest, NextResponse } from 'next/server'

export async function GET(
  request: NextRequest,
  { params }: { params: { userId: string } }
) {
  try {
    const response = await fetch(`${process.env.HARMONY_SERVICE_URL}/api/ai/learning-path/${params.userId}`)
    
    if (response.ok) {
      const data = await response.json()
      return NextResponse.json(data)
    } else {
      return NextResponse.json({ error: '학습 경로 생성에 실패했습니다.' }, { status: 404 })
    }
  } catch (error) {
    return NextResponse.json({ error: '학습 경로 생성에 실패했습니다.' }, { status: 500 })
  }
} 