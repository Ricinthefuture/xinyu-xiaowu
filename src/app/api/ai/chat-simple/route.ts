import { NextRequest, NextResponse } from 'next/server'
import { githubModelsAI, handleAIError } from '@/lib/ai-github-fixed'

export async function POST(request: NextRequest) {
  console.log('🚀 简化API路由被调用了！')
  try {
    console.log('📥 开始解析请求体...')
    const { message } = await request.json()
    console.log('📋 解析结果:', { message: message?.substring(0, 50) })

    if (!message) {
      console.log('❌ 消息内容为空')
      return NextResponse.json({ error: '消息内容不能为空' }, { status: 400 })
    }

    console.log('🎯 开始处理AI请求')
    console.log('📝 收到消息:', message)

    // 直接调用GitHub Models AI获取回复（无需认证）
    console.log('🤖 开始调用GitHub Models AI...')
    console.log('🔧 环境变量检查:', {
      hasGitHubToken: !!process.env.GITHUB_TOKEN,
      tokenLength: process.env.GITHUB_TOKEN?.length || 0
    })
    
    const aiResponse = await githubModelsAI.processUserMessage(message, [])
    console.log('✅ AI调用完成，回复长度:', aiResponse.length)
    console.log('📄 AI回复预览:', aiResponse.substring(0, 100) + '...')
    console.log('🔍 回复是否为模板:', aiResponse.includes('ABC理论') ? '是模板回复' : '真实AI回复')

    // 分析用户情绪
    console.log('🧠 开始情绪分析...')
    const emotionAnalysis = await githubModelsAI.analyzeEmotion(message)
    console.log('✅ 情绪分析完成:', emotionAnalysis.emotion)

    return NextResponse.json({
      message: aiResponse,
      emotionAnalysis: emotionAnalysis,
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    console.error('🔥 简化API错误:', error)
    console.error('🔥 错误堆栈:', error instanceof Error ? error.stack : '无堆栈信息')
    const errorMessage = handleAIError(error)
    return NextResponse.json({ error: errorMessage }, { status: 500 })
  }
}
