import { NextRequest, NextResponse } from 'next/server'

export async function GET() {
  const githubToken = process.env.GITHUB_TOKEN

  if (!githubToken) {
    return NextResponse.json({ 
      error: 'GITHUB_TOKEN missing',
      solution: '请在.env.local中设置GITHUB_TOKEN环境变量'
    }, { status: 400 })
  }

  try {
    console.log('🧪 测试修复后的GitHub Models API...')
    
    const requestBody = {
      model: 'openai/gpt-4o-mini', // 使用正确的模型名称格式
      messages: [
        { role: 'system', content: '你是一个友好的AI助手。请简短回复。' },
        { role: 'user', content: '你好' }
      ],
      max_tokens: 50,
      temperature: 0.7
    }

    console.log('📤 发送请求到正确的端点:', 'https://models.github.ai/inference/chat/completions')
    console.log('🔑 Token前缀:', githubToken.substring(0, 20) + '...')
    console.log('📝 使用模型:', requestBody.model)

    const response = await fetch('https://models.github.ai/inference/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${githubToken}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'User-Agent': 'EmotionAI-HeartHouse/1.0'
      },
      body: JSON.stringify(requestBody)
    })

    console.log('📊 响应状态:', response.status)

    if (!response.ok) {
      const errorText = await response.text()
      console.error('❌ API错误响应:', errorText)
      
      let errorData
      try {
        errorData = JSON.parse(errorText)
      } catch {
        errorData = { error: { message: errorText } }
      }

      let solution = ''
      if (response.status === 401 || response.status === 403) {
        solution = '请确保您的GitHub Personal Access Token具有"models:read"权限。'
      } else if (response.status === 404) {
        solution = '请检查API端点是否正确。'
      }

      return NextResponse.json({
        success: false,
        status: response.status,
        error: errorData,
        solution: solution,
        debug: {
          endpoint: 'https://models.github.ai/inference/chat/completions',
          model: requestBody.model,
          tokenPrefix: githubToken.substring(0, 20) + '...',
          tokenLength: githubToken.length
        }
      })
    }

    const data = await response.json()
    console.log('✅ GitHub Models API调用成功!')
    
    return NextResponse.json({
      success: true,
      status: response.status,
      message: data.choices?.[0]?.message?.content || 'No content returned',
      debug: {
        endpoint: 'https://models.github.ai/inference/chat/completions',
        model: requestBody.model,
        tokenPrefix: githubToken.substring(0, 20) + '...',
        tokenLength: githubToken.length,
        usage: data.usage
      }
    })

  } catch (error) {
    console.error('❌ 请求失败:', error)
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : String(error),
      solution: '请检查网络连接和GitHub Token配置',
      debug: {
        endpoint: 'https://models.github.ai/inference/chat/completions',
        tokenPrefix: githubToken.substring(0, 20) + '...',
        tokenLength: githubToken.length
      }
    }, { status: 500 })
  }
}
