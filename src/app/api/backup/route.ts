import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase'

// 导出用户所有数据
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

    // 获取用户档案
    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('user_id', user.id)
      .single()

    // 获取所有对话
    const { data: conversations } = await supabase
      .from('conversations')
      .select(`
        *,
        messages (*)
      `)
      .eq('user_id', user.id)
      .order('created_at', { ascending: true })

    // 获取情绪分析记录
    const { data: emotions } = await supabase
      .from('emotion_events')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: true })

    // 创建备份数据
    const backupData = {
      exportDate: new Date().toISOString(),
      user: {
        id: user.id,
        email: user.email,
        created_at: user.created_at
      },
      profile,
      conversations: conversations || [],
      emotions: emotions || [],
      statistics: {
        totalConversations: conversations?.length || 0,
        totalMessages: conversations?.reduce((total, conv) => 
          total + (conv.messages?.length || 0), 0) || 0,
        totalEmotions: emotions?.length || 0,
        dateRange: {
          first: conversations?.[0]?.created_at,
          last: conversations?.[conversations?.length - 1]?.created_at
        }
      }
    }

    // 设置下载头
    const filename = `xinyu-xiaowu-backup-${user.id}-${new Date().toISOString().split('T')[0]}.json`
    
    return new NextResponse(JSON.stringify(backupData, null, 2), {
      headers: {
        'Content-Type': 'application/json',
        'Content-Disposition': `attachment; filename="${filename}"`
      }
    })

  } catch (error) {
    console.error('数据备份API错误:', error)
    return NextResponse.json({ error: '备份失败' }, { status: 500 })
  }
}
