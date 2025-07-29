import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = searchParams.get('page') || '0'
    const size = searchParams.get('size') || '20'
    
    const response = await fetch(`${process.env.HARMONY_SERVICE_URL}/api/admin/quiz?page=${page}&size=${size}`)
    const data = await response.json()
    
    return NextResponse.json(data)
  } catch (error) {
    return NextResponse.json({ error: '퀴즈 목록을 불러오지 못했습니다.' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    const response = await fetch(`${process.env.HARMONY_SERVICE_URL}/api/admin/quiz`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
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