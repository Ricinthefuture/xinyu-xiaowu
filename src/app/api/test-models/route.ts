import { NextResponse } from 'next/server'

export async function GET() {
  const githubToken = process.env.GITHUB_TOKEN
  
  try {
    // 1. 测试权限检查
    console.log('🔍 检查GitHub Models权限...')
    const response = await fetch('https://models.github.ai/inference/models', {
      headers: {
        'Authorization': `Bearer ${githubToken}`,
        'Accept': 'application/json'
      }
    })
    
    console.log('📊 模型列表响应:', response.status)
    
    if (response.ok) {
      const models = await response.json()
      console.log('✅ 可用模型:', models)
      
      // 2. 测试最简单的聊天
      console.log('🧪 测试聊天API...')
      const chatResponse = await fetch('https://models.github.ai/inference/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${githubToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: models.data?.[0]?.id || 'gpt-4o-mini', // 使用第一个可用模型
          messages: [{ role: 'user', content: '你好' }],
          max_tokens: 10
        })
      })
      
      console.log('💬 聊天响应:', chatResponse.status)
      
      if (chatResponse.ok) {
        const chatData = await chatResponse.json()
        return NextResponse.json({
          success: true,
          models: models,
          chatTest: chatData,
          message: chatData.choices?.[0]?.message?.content
        })
      } else {
        const chatError = await chatResponse.text()
        return NextResponse.json({
          success: false,
          models: models,
          chatError: {
            status: chatResponse.status,
            body: chatError
          }
        })
      }
    } else {
      const errorText = await response.text()
      return NextResponse.json({
        success: false,
        error: `无法获取模型列表: ${response.status}`,
        details: errorText
      })
    }
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : String(error)
    })
  }
}
