import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase'

// 获取用户的情绪分析统计
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

    // 获取情绪统计数据
    const { data: emotions, error: emotionError } = await supabase
      .from('emotion_events')
      .select('emotion_label, intensity, created_at')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(100) // 最近100条情绪记录

    if (emotionError) {
      console.error('获取情绪数据失败:', emotionError)
      return NextResponse.json({ error: '获取情绪数据失败' }, { status: 500 })
    }

    // 统计分析
    const emotionStats = emotions?.reduce((stats, emotion) => {
      const label = emotion.emotion_label
      if (!stats[label]) {
        stats[label] = { count: 0, totalIntensity: 0, avgIntensity: 0 }
      }
      stats[label].count++
      stats[label].totalIntensity += emotion.intensity
      stats[label].avgIntensity = stats[label].totalIntensity / stats[label].count
      return stats
    }, {} as Record<string, { count: number; totalIntensity: number; avgIntensity: number }>)

    // 最常见的情绪
    const mostCommonEmotion = Object.entries(emotionStats || {})
      .sort(([,a], [,b]) => b.count - a.count)[0]

    // 平均情绪强度
    const avgIntensity = emotions?.length ? 
      emotions.reduce((sum, e) => sum + e.intensity, 0) / emotions.length : 0

    // 最近7天的情绪趋势
    const sevenDaysAgo = new Date()
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)
    
    const recentEmotions = emotions?.filter(e => 
      new Date(e.created_at) >= sevenDaysAgo
    ) || []

    return NextResponse.json({
      totalRecords: emotions?.length || 0,
      emotionStats: emotionStats || {},
      mostCommonEmotion: mostCommonEmotion ? {
        emotion: mostCommonEmotion[0],
        count: mostCommonEmotion[1].count,
        avgIntensity: Math.round(mostCommonEmotion[1].avgIntensity * 100) / 100
      } : null,
      overallAvgIntensity: Math.round(avgIntensity * 100) / 100,
      recentTrend: {
        last7Days: recentEmotions.length,
        avgIntensityLast7Days: recentEmotions.length ? 
          Math.round((recentEmotions.reduce((sum, e) => sum + e.intensity, 0) / recentEmotions.length) * 100) / 100 : 0
      },
      timeline: emotions?.slice(0, 20) || [] // 最近20条记录
    })

  } catch (error) {
    console.error('情绪分析API错误:', error)
    return NextResponse.json({ error: '服务器错误' }, { status: 500 })
  }
}
