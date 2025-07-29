import { NextRequest, NextResponse } from 'next/server'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const response = await fetch(`${process.env.HARMONY_SERVICE_URL}/api/admin/quiz/${params.id}`)
    
    if (response.ok) {
      const data = await response.json()
      return NextResponse.json(data)
    } else {
      return NextResponse.json({ error: '퀴즈를 찾을 수 없습니다.' }, { status: 404 })
    }
  } catch (error) {
    return NextResponse.json({ error: '퀴즈 조회에 실패했습니다.' }, { status: 500 })
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    
    const response = await fetch(`${process.env.HARMONY_SERVICE_URL}/api/admin/quiz/${params.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    })
    
    if (response.ok) {
      const data = await response.json()
      return NextResponse.json(data)
    } else {
      return NextResponse.json({ error: '퀴즈 수정에 실패했습니다.' }, { status: 400 })
    }
  } catch (error) {
    return NextResponse.json({ error: '퀴즈 수정에 실패했습니다.' }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const response = await fetch(`${process.env.HARMONY_SERVICE_URL}/api/admin/quiz/${params.id}`, {
      method: 'DELETE'
    })
    
    if (response.ok) {
      return NextResponse.json({ message: '퀴즈가 삭제되었습니다.' })
    } else {
      return NextResponse.json({ error: '퀴즈 삭제에 실패했습니다.' }, { status: 400 })
    }
  } catch (error) {
    return NextResponse.json({ error: '퀴즈 삭제에 실패했습니다.' }, { status: 500 })
  }
} 