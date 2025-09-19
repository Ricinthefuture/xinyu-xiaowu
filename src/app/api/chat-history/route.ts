import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase'

// 获取用户的聊天历史记录
export async function GET(request: NextRequest) {
  try {
    const supabase = createServerSupabaseClient()
    const authHeader = request.headers.get('authorization')
    
    if (!authHeader) {
      return NextResponse.json({ error: '未授权' }, { status: 401 })
    }

    const token = authHeader.replace('Bearer ', '')
    const { data: { user }, error: authError } = await supabase.auth.getUser(token)

    if (authError || !user) {
      return NextResponse.json({ error: '用户验证失败' }, { status: 401 })
    }

    // 获取用户的所有对话
    const { data: conversations, error: convError } = await supabase
      .from('conversations')
      .select(`
        id,
        title,
        created_at,
        updated_at,
        messages (
          id,
          role,
          content,
          created_at
        )
      `)
      .eq('user_id', user.id)
      .order('updated_at', { ascending: false })

    if (convError) {
      console.error('获取对话历史失败:', convError)
      return NextResponse.json({ error: '获取历史记录失败' }, { status: 500 })
    }

    // 统计信息
    const totalConversations = conversations?.length || 0
    const totalMessages = conversations?.reduce((total, conv) => 
      total + (conv.messages?.length || 0), 0) || 0

    return NextResponse.json({
      conversations: conversations || [],
      stats: {
        totalConversations,
        totalMessages,
        oldestConversation: conversations?.[conversations.length - 1]?.created_at,
        newestConversation: conversations?.[0]?.created_at
      }
    })

  } catch (error) {
    console.error('获取聊天历史API错误:', error)
    return NextResponse.json({ error: '服务器错误' }, { status: 500 })
  }
}

// 删除指定对话
export async function DELETE(request: NextRequest) {
  try {
    const supabase = createServerSupabaseClient()
    const { conversationId } = await request.json()
    const authHeader = request.headers.get('authorization')
    
    if (!authHeader) {
      return NextResponse.json({ error: '未授权' }, { status: 401 })
    }

    const token = authHeader.replace('Bearer ', '')
    const { data: { user }, error: authError } = await supabase.auth.getUser(token)

    if (authError || !user) {
      return NextResponse.json({ error: '用户验证失败' }, { status: 401 })
    }

    // 删除对话（级联删除消息）
    const { error: deleteError } = await supabase
      .from('conversations')
      .delete()
      .eq('id', conversationId)
      .eq('user_id', user.id) // 确保只能删除自己的对话

    if (deleteError) {
      console.error('删除对话失败:', deleteError)
      return NextResponse.json({ error: '删除失败' }, { status: 500 })
    }

    return NextResponse.json({ success: true })

  } catch (error) {
    console.error('删除对话API错误:', error)
    return NextResponse.json({ error: '服务器错误' }, { status: 500 })
  }
}
