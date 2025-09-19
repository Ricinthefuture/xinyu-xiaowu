import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  console.log('🧪 简单测试API被调用了！')
  console.log('⏰ 时间:', new Date().toISOString())
  return NextResponse.json({ 
    message: '测试API工作正常！', 
    timestamp: new Date().toISOString(),
    url: request.url 
  })
}

export async function POST(request: NextRequest) {
  console.log('🧪 POST测试API被调用了！')
  try {
    const body = await request.json()
    console.log('📋 收到的数据:', body)
    return NextResponse.json({ 
      message: '收到POST请求！', 
      receivedData: body,
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.error('❌ POST请求解析错误:', error)
    return NextResponse.json({ error: 'JSON解析失败' }, { status: 400 })
  }
}
