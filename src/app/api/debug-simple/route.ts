import { NextRequest, NextResponse } from 'next/server'

export async function GET() {
  const githubToken = process.env.GITHUB_TOKEN

  if (!githubToken) {
    return NextResponse.json({ error: 'GITHUB_TOKEN missing' }, { status: 400 })
  }

  try {
    console.log('🧪 测试GitHub Models API调用...')
    
    const requestBody = {
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: '你是一个友好的AI助手。' },
        { role: 'user', content: '你好' }
      ],
      max_tokens: 100,
      temperature: 0.7,
      stream: false
    }

    console.log('📤 发送请求到GitHub Models API...')
    console.log('🔑 Token前缀:', githubToken.substring(0, 20) + '...')
    console.log('📝 请求体:', JSON.stringify(requestBody, null, 2))

    const response = await fetch('https://models.inference.ai.azure.com/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${githubToken}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'User-Agent': 'EmotionAI-Debug/1.0'
      },
      body: JSON.stringify(requestBody)
    })

    console.log('📊 响应状态:', response.status)
    console.log('📊 响应头:', Object.fromEntries(response.headers.entries()))

    if (!response.ok) {
      const errorText = await response.text()
      console.error('❌ API错误响应:', errorText)
      
      let errorData
      try {
        errorData = JSON.parse(errorText)
      } catch {
        errorData = { error: errorText }
      }

      return NextResponse.json({
        success: false,
        status: response.status,
        error: errorData,
        debug: {
          tokenPrefix: githubToken.substring(0, 20) + '...',
          tokenLength: githubToken.length,
          requestBody: requestBody
        }
      })
    }

    const data = await response.json()
    console.log('✅ API调用成功!')
    console.log('📄 响应数据:', JSON.stringify(data, null, 2))

    return NextResponse.json({
      success: true,
      status: response.status,
      response: data,
      debug: {
        tokenPrefix: githubToken.substring(0, 20) + '...',
        tokenLength: githubToken.length,
        requestBody: requestBody
      }
    })

  } catch (error) {
    console.error('❌ 请求失败:', error)
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : String(error),
      debug: {
        tokenPrefix: githubToken.substring(0, 20) + '...',
        tokenLength: githubToken.length
      }
    }, { status: 500 })
  }
}
