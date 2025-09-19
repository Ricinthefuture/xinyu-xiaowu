import { NextRequest, NextResponse } from 'next/server'
import { zhipuAI } from '@/lib/ai-zhipu'

export async function GET() {
  console.log('🧪 开始简单API测试...')
  
  try {
    // 测试1: 检查环境变量
    const githubToken = process.env.GITHUB_TOKEN
    if (!githubToken) {
      return NextResponse.json({ 
        success: false, 
        error: 'GITHUB_TOKEN未设置' 
      })
    }

    // 测试2: 尝试智谱AI回复
    const testMessage = '你好，请简短回复测试'
    console.log('📝 测试消息:', testMessage)
    
    const startTime = Date.now()
    const aiResponse = await zhipuAI.processUserMessage(testMessage, [])
    const endTime = Date.now()
    
    console.log('✅ AI回复成功!')
    console.log('💬 回复内容:', aiResponse.substring(0, 100) + '...')
    
    // 获取诊断信息
    const diagnoseInfo = await zhipuAI.diagnose()
    
    return NextResponse.json({
      success: true,
      message: '智谱AI测试成功',
      data: {
        input: testMessage,
        output: aiResponse,
        responseTime: `${endTime - startTime}ms`,
        zhipuInfo: diagnoseInfo
      }
    })

  } catch (error) {
    console.error('❌ API测试失败:', error)
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : String(error),
      message: 'API测试失败'
    }, { status: 500 })
  }
}
