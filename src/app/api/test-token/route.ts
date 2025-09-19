import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const githubToken = process.env.GITHUB_TOKEN

  if (!githubToken) {
    return NextResponse.json({ 
      error: 'GITHUB_TOKEN 环境变量未设置',
      token: null 
    }, { status: 400 })
  }

  console.log('🔧 GitHub Token 长度:', githubToken.length)
  console.log('🔧 GitHub Token 前缀:', githubToken.substring(0, 20) + '...')

  // 测试1: 验证GitHub基本API访问
  try {
    console.log('🧪 测试1: GitHub基本API访问...')
    const userResponse = await fetch('https://api.github.com/user', {
      headers: {
        'Authorization': `token ${githubToken}`,
        'User-Agent': 'EmotionAI-Test/1.0'
      }
    })

    console.log('📊 GitHub API 响应状态:', userResponse.status)
    
    if (userResponse.ok) {
      const userData = await userResponse.json()
      console.log('✅ GitHub API 访问成功, 用户:', userData.login)
    } else {
      const errorText = await userResponse.text()
      console.error('❌ GitHub API 访问失败:', errorText)
      return NextResponse.json({
        error: 'GitHub Token 无法访问基本API',
        status: userResponse.status,
        details: errorText
      }, { status: 401 })
    }
  } catch (error) {
    console.error('❌ GitHub API 测试失败:', error)
    return NextResponse.json({
      error: 'GitHub API 连接失败',
      details: error instanceof Error ? error.message : String(error)
    }, { status: 500 })
  }

  // 测试2: 尝试GitHub Models API的各种端点
  const modelsEndpoints = [
    'https://models.inference.ai.azure.com',
    'https://api.githubmodels.com',
    'https://models.githubusercontent.com'
  ]

  const testResults = []

  for (const endpoint of modelsEndpoints) {
    try {
      console.log(`🧪 测试端点: ${endpoint}`)
      
      const testResponse = await fetch(`${endpoint}/chat/completions`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${githubToken}`,
          'Content-Type': 'application/json',
          'User-Agent': 'EmotionAI-Test/1.0'
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [
            { role: 'user', content: 'Hello, this is a test message.' }
          ],
          max_tokens: 50
        })
      })

      const status = testResponse.status
      const statusText = testResponse.statusText
      
      console.log(`📊 ${endpoint} 响应:`, status, statusText)

      if (testResponse.ok) {
        const data = await testResponse.json()
        testResults.push({
          endpoint,
          status: 'success',
          httpStatus: status,
          response: data
        })
      } else {
        const errorText = await testResponse.text()
        testResults.push({
          endpoint,
          status: 'failed',
          httpStatus: status,
          error: errorText
        })
      }
    } catch (error) {
      console.error(`❌ ${endpoint} 测试失败:`, error)
      testResults.push({
        endpoint,
        status: 'error',
        error: error instanceof Error ? error.message : String(error)
      })
    }
  }

  return NextResponse.json({
    message: 'Token 测试完成',
    tokenLength: githubToken.length,
    tokenPrefix: githubToken.substring(0, 20) + '...',
    githubApiAccess: 'success',
    modelsApiTests: testResults
  })
}
