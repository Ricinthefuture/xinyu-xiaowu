import { NextResponse } from 'next/server'

export async function GET() {
  console.log('🧪 开始直接GitHub Models API测试...')
  
  const githubToken = process.env.GITHUB_TOKEN
  if (!githubToken) {
    return NextResponse.json({ error: 'No GitHub token' })
  }

  console.log('🔑 Token前缀:', githubToken.substring(0, 20) + '...')

  try {
    console.log('📤 发送请求到GitHub Models...')
    
    const controller = new AbortController()
    const timeoutId = setTimeout(() => {
      console.log('⏰ 请求超时，中止请求')
      controller.abort()
    }, 10000) // 10秒超时

    const response = await fetch('https://models.github.ai/inference/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${githubToken}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        model: 'openai/gpt-4o-mini',
        messages: [
          { role: 'user', content: '请回复：测试成功' }
        ],
        max_tokens: 50
      }),
      signal: controller.signal
    })

    clearTimeout(timeoutId)
    
    console.log('📊 响应状态:', response.status)
    console.log('📋 响应头:', Array.from(response.headers.entries()))

    if (!response.ok) {
      const errorText = await response.text()
      console.error('❌ API错误:', {
        status: response.status,
        statusText: response.statusText,
        body: errorText
      })
      
      return NextResponse.json({
        success: false,
        error: `API错误: ${response.status}`,
        details: errorText
      })
    }

    const data = await response.json()
    console.log('✅ API成功，响应:', data)

    return NextResponse.json({
      success: true,
      response: data,
      message: data.choices?.[0]?.message?.content || 'No content'
    })

  } catch (error) {
    console.error('🔥 请求失败:', error)
    
    if (error instanceof Error && error.name === 'AbortError') {
      return NextResponse.json({
        success: false,
        error: '请求超时'
      })
    }

    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : String(error)
    })
  }
}
