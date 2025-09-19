import { NextResponse } from 'next/server'

export async function GET() {
  console.log('🧪 直接测试GitHub Models API...')
  
  const githubToken = process.env.GITHUB_TOKEN
  if (!githubToken) {
    return NextResponse.json({ error: 'No GitHub token' })
  }

  console.log('🔑 Token:', githubToken.substring(0, 30) + '...')

  try {
    console.log('📤 发送请求到GitHub Models...')
    
    // 使用最简单的请求
    const response = await fetch('https://models.github.ai/inference/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${githubToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'user', content: '请简短回复：测试成功' }
        ],
        max_tokens: 20
      })
    })

    console.log('📊 响应状态:', response.status)
    console.log('📋 响应头:', [...response.headers.entries()])

    const responseText = await response.text()
    console.log('📄 原始响应:', responseText)

    if (!response.ok) {
      console.error('❌ API失败:', response.status, responseText)
      return NextResponse.json({
        success: false,
        error: `GitHub Models API失败: ${response.status}`,
        details: responseText,
        endpoint: 'https://models.github.ai/inference/chat/completions'
      })
    }

    let data
    try {
      data = JSON.parse(responseText)
    } catch (parseError) {
      console.error('❌ JSON解析失败:', parseError)
      return NextResponse.json({
        success: false,
        error: 'JSON解析失败',
        rawResponse: responseText
      })
    }

    console.log('✅ 解析成功:', data)

    return NextResponse.json({
      success: true,
      data: data,
      message: data.choices?.[0]?.message?.content || 'No content',
      model: 'gpt-4o-mini',
      endpoint: 'https://models.github.ai/inference/chat/completions'
    })

  } catch (error) {
    console.error('🔥 请求异常:', error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : String(error),
      type: 'Network or other error'
    })
  }
}
