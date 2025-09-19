import { NextRequest, NextResponse } from 'next/server'
import { githubModelsAI } from '@/lib/ai-github-fixed'

export async function GET() {
  const testResults: any = {
    timestamp: new Date().toISOString(),
    tests: []
  }

  console.log('🧪 开始测试整个AI调用流程...')

  // 测试1: 检查环境变量
  const githubToken = process.env.GITHUB_TOKEN
  testResults.tests.push({
    name: '环境变量检查',
    success: !!githubToken,
    details: {
      hasToken: !!githubToken,
      tokenLength: githubToken?.length || 0,
      tokenPrefix: githubToken?.substring(0, 20) + '...' || 'N/A'
    }
  })

  if (!githubToken) {
    console.error('❌ GITHUB_TOKEN 未设置')
    return NextResponse.json(testResults)
  }

  // 测试2: 检查AI客户端权限
  try {
    console.log('🔍 检查GitHub Models权限...')
    const permissionCheck = await githubModelsAI.checkPermissions()
    testResults.tests.push({
      name: 'GitHub Models权限检查',
      success: permissionCheck.hasAccess,
      details: permissionCheck
    })

    if (!permissionCheck.hasAccess) {
      console.error('❌ GitHub Models权限不足:', permissionCheck.error)
    }
  } catch (error) {
    testResults.tests.push({
      name: 'GitHub Models权限检查',
      success: false,
      error: error instanceof Error ? error.message : String(error)
    })
  }

  // 测试3: 尝试简单的AI调用
  try {
    console.log('🤖 测试AI消息处理...')
    const testMessage = '你好'
    const startTime = Date.now()
    
    const aiResponse = await githubModelsAI.processUserMessage(testMessage, [])
    const endTime = Date.now()
    
    testResults.tests.push({
      name: 'AI消息处理测试',
      success: true,
      details: {
        input: testMessage,
        output: aiResponse.substring(0, 100) + (aiResponse.length > 100 ? '...' : ''),
        responseTime: `${endTime - startTime}ms`,
        outputLength: aiResponse.length
      }
    })

    console.log('✅ AI调用成功!')

  } catch (error) {
    console.error('❌ AI调用失败:', error)
    testResults.tests.push({
      name: 'AI消息处理测试',
      success: false,
      error: error instanceof Error ? error.message : String(error),
      details: {
        input: '你好'
      }
    })
  }

  // 测试4: 情绪分析测试
  try {
    console.log('💭 测试情绪分析...')
    const testEmotion = '我今天感到很焦虑，工作压力很大'
    const emotionResult = await githubModelsAI.analyzeEmotion(testEmotion)
    
    testResults.tests.push({
      name: '情绪分析测试',
      success: true,
      details: {
        input: testEmotion,
        analysis: emotionResult
      }
    })

    console.log('✅ 情绪分析成功!')

  } catch (error) {
    console.error('❌ 情绪分析失败:', error)
    testResults.tests.push({
      name: '情绪分析测试',
      success: false,
      error: error instanceof Error ? error.message : String(error)
    })
  }

  // 汇总结果
  const successCount = testResults.tests.filter((t: any) => t.success).length
  const totalCount = testResults.tests.length
  
  testResults.summary = {
    success: successCount === totalCount,
    successRate: `${successCount}/${totalCount}`,
    message: successCount === totalCount 
      ? '✅ 所有测试通过，AI调用流程正常' 
      : `⚠️ ${totalCount - successCount} 项测试失败，需要检查配置`
  }

  console.log('📊 测试完成:', testResults.summary.message)

  return NextResponse.json(testResults, { 
    status: 200,
    headers: {
      'Content-Type': 'application/json'
    }
  })
}

export async function POST(request: NextRequest) {
  try {
    const { message } = await request.json()
    
    if (!message) {
      return NextResponse.json({ error: '消息不能为空' }, { status: 400 })
    }

    console.log('🧪 测试POST请求处理...')
    console.log('📝 收到消息:', message)

    // 模拟完整的AI调用流程（不涉及数据库）
    const startTime = Date.now()
    
    const aiResponse = await githubModelsAI.processUserMessage(message, [])
    const emotionAnalysis = await githubModelsAI.analyzeEmotion(message)
    
    const endTime = Date.now()

    const result = {
      success: true,
      message: aiResponse,
      emotionAnalysis: emotionAnalysis,
      responseTime: `${endTime - startTime}ms`,
      timestamp: new Date().toISOString()
    }

    console.log('✅ POST测试成功!')
    return NextResponse.json(result)

  } catch (error) {
    console.error('❌ POST测试失败:', error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : String(error),
      timestamp: new Date().toISOString()
    }, { status: 500 })
  }
}
