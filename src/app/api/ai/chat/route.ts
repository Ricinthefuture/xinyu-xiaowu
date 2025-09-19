import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase'
import { zhipuAI, handleAIError } from '@/lib/ai-zhipu'

export async function POST(request: NextRequest) {
  console.log('🚀 API路由被调用了！')
  try {
    console.log('📥 开始解析请求体...')
    const { message, conversationId } = await request.json()
    console.log('📋 解析结果:', { message: message?.substring(0, 50), conversationId })

    if (!message) {
      console.log('❌ 消息内容为空')
      return NextResponse.json({ error: '消息内容不能为空' }, { status: 400 })
    }

    // 验证用户身份
    console.log('🔐 开始验证用户身份...')
    const supabase = createServerSupabaseClient()
    const authHeader = request.headers.get('authorization')
    console.log('🔑 认证头:', authHeader ? '存在' : '不存在')
    
    if (!authHeader) {
      console.log('❌ 没有认证头')
      return NextResponse.json({ error: '未授权' }, { status: 401 })
    }

    const token = authHeader.replace('Bearer ', '')
    console.log('🎫 Token长度:', token.length)
    
    // 设置访问令牌并获取用户信息
    console.log('👤 获取用户信息...')
    const { data: { user }, error: authError } = await supabase.auth.getUser(token)

    if (authError || !user) {
      console.error('❌ 用户验证失败:', authError)
      return NextResponse.json({ error: '用户验证失败' }, { status: 401 })
    }
    
    console.log('✅ 用户验证成功:', user.id)

    // 获取对话历史（最近10条消息）
    let conversationHistory: Array<{ role: 'user' | 'assistant', content: string }> = []
    
    if (conversationId) {
      const { data: messages, error: messagesError } = await supabase
        .from('messages')
        .select('role, content')
        .eq('conversation_id', conversationId)
        .order('created_at', { ascending: true })
        .limit(10)

      if (!messagesError && messages) {
        conversationHistory = messages.map(msg => ({
          role: msg.role as 'user' | 'assistant',
          content: msg.content
        }))
      }
    }

    console.log('🎯 API路由: 开始处理AI请求')
    console.log('📝 收到消息:', message)
    console.log('🆔 对话ID:', conversationId)
    console.log('👤 用户ID:', user.id)
    console.log('📋 对话历史长度:', conversationHistory.length)

    // 调用智谱AI获取回复（GLM-4.5-Flash免费模型）
    console.log('🤖 开始调用智谱AI...')
    const aiResponse = await zhipuAI.processUserMessage(message, conversationHistory)
    console.log('✅ AI调用完成，回复长度:', aiResponse.length)
    console.log('📄 AI回复预览:', aiResponse.substring(0, 100) + '...')

    // 分析用户情绪（基于ABC理论）
    const emotionAnalysis = await zhipuAI.analyzeEmotion(message)

    // 如果没有对话ID，创建新对话
    let currentConversationId = conversationId
    if (!currentConversationId) {
      const { data: newConversation, error: convError } = await supabase
        .from('conversations')
        .insert({
          user_id: user.id,
          title: message.substring(0, 50) + (message.length > 50 ? '...' : ''),
          status: 'active'
        })
        .select()
        .single()

      if (convError) {
        console.error('创建对话失败:', convError)
        return NextResponse.json({ error: '创建对话失败' }, { status: 500 })
      }

      currentConversationId = newConversation.id
    }

    // 保存用户消息
    const { error: userMsgError } = await supabase
      .from('messages')
      .insert({
        conversation_id: currentConversationId,
        role: 'user',
        content: message,
        tokens: message.length // 简单的token估算
      })

    if (userMsgError) {
      console.error('保存用户消息失败:', userMsgError)
    }

    // 保存AI回复
    const { error: aiMsgError } = await supabase
      .from('messages')
      .insert({
        conversation_id: currentConversationId,
        role: 'assistant',
        content: aiResponse,
        tokens: aiResponse.length
      })

    if (aiMsgError) {
      console.error('保存AI消息失败:', aiMsgError)
    }

    // 保存情绪分析结果
    if (emotionAnalysis.emotion !== '未识别') {
      const { error: emotionError } = await supabase
        .from('emotion_events')
        .insert({
          user_id: user.id,
          conversation_id: currentConversationId,
          event_text: emotionAnalysis.event,
          belief_text: emotionAnalysis.belief,
          emotion_label: emotionAnalysis.emotion,
          intensity: emotionAnalysis.intensity
        })

      if (emotionError) {
        console.error('保存情绪分析失败:', emotionError)
      }
    }

    return NextResponse.json({
      message: aiResponse,
      conversationId: currentConversationId,
      emotionAnalysis: emotionAnalysis
    })

  } catch (error) {
    console.error('🔥 AI对话API错误:', error)
    console.error('🔥 错误堆栈:', error instanceof Error ? error.stack : '无堆栈信息')
    const errorMessage = handleAIError(error)
    return NextResponse.json({ error: errorMessage }, { status: 500 })
  }
}
