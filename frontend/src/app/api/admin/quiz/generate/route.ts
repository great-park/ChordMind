import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type')
    const count = searchParams.get('count') || '5'
    
    if (!type) {
      return NextResponse.json({ error: '퀴즈 타입이 필요합니다.' }, { status: 400 })
    }
    
    const response = await fetch(`${process.env.HARMONY_SERVICE_URL}/api/admin/quiz/generate?type=${type}&count=${count}`, {
      method: 'POST'
    })
    
    if (response.ok) {
      const data = await response.json()
      return NextResponse.json(data)
    } else {
      return NextResponse.json({ error: '퀴즈 생성에 실패했습니다.' }, { status: 400 })
    }
  } catch (error) {
    return NextResponse.json({ error: '퀴즈 생성에 실패했습니다.' }, { status: 500 })
  }
} 