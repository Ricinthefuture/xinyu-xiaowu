'use client'

import { useState } from 'react'
import { useAuth } from '@/hooks/useAuth'

export default function DebugChatPage() {
  const [message, setMessage] = useState('')
  const [response, setResponse] = useState('')
  const [loading, setLoading] = useState(false)
  const [logs, setLogs] = useState<string[]>([])
  const { user } = useAuth()

  const addLog = (log: string) => {
    console.log(log)
    setLogs(prev => [...prev, `${new Date().toLocaleTimeString()}: ${log}`])
  }

  const testAPI = async () => {
    if (!message.trim()) return
    
    setLoading(true)
    setResponse('')
    setLogs([])
    
    try {
      addLog('🚀 开始API测试')
      addLog(`👤 当前用户: ${user?.email || '未登录'}`)
      
      if (!user) {
        addLog('❌ 用户未登录')
        return
      }

      addLog('🔐 获取访问令牌...')
      const { supabase } = await import('@/lib/supabase')
      const { data: { session }, error: sessionError } = await supabase.auth.getSession()
      
      if (sessionError) {
        addLog(`❌ 会话错误: ${sessionError.message}`)
        return
      }

      addLog(`✅ 会话获取成功: ${session?.user?.email}`)
      
      const accessToken = session?.access_token
      if (!accessToken) {
        addLog('❌ 无访问令牌')
        return
      }

      addLog(`🔑 Token长度: ${accessToken.length}`)
      addLog('📤 发送API请求...')

      const apiResponse = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`
        },
        body: JSON.stringify({
          message: message,
          conversationId: null
        })
      })

      addLog(`📊 响应状态: ${apiResponse.status}`)

      if (!apiResponse.ok) {
        const errorText = await apiResponse.text()
        addLog(`❌ API错误: ${errorText}`)
        return
      }

      const data = await apiResponse.json()
      addLog('✅ API调用成功')
      addLog(`📄 响应数据: ${JSON.stringify(data, null, 2)}`)
      
      setResponse(data.message || '无回复内容')

    } catch (error) {
      addLog(`🔥 异常: ${error instanceof Error ? error.message : String(error)}`)
    } finally {
      setLoading(false)
    }
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 via-soft-100 to-primary-200 flex items-center justify-center">
        <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-xl p-8">
          <h1 className="text-2xl font-bold text-center mb-4">调试聊天</h1>
          <p className="text-center text-gray-600 mb-4">请先登录</p>
          <a href="/auth" className="btn-primary block text-center">
            前往登录
          </a>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-soft-100 to-primary-200 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-xl p-8">
          <h1 className="text-3xl font-bold text-center mb-8 bg-gradient-to-r from-primary-600 to-soft-600 bg-clip-text text-transparent">
            🐛 调试聊天API
          </h1>

          <div className="mb-6">
            <p className="text-sm text-gray-600 mb-2">当前用户: {user.email}</p>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="输入测试消息..."
              className="w-full p-4 border rounded-2xl resize-none"
              rows={3}
            />
          </div>

          <div className="text-center mb-6">
            <button
              onClick={testAPI}
              disabled={loading || !message.trim()}
              className="btn-primary px-8 py-3 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? '🔄 测试中...' : '🧪 测试API'}
            </button>
          </div>

          {logs.length > 0 && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-2">调试日志:</h3>
              <div className="bg-gray-900 text-green-400 p-4 rounded-2xl max-h-64 overflow-y-auto">
                {logs.map((log, index) => (
                  <div key={index} className="text-sm font-mono">
                    {log}
                  </div>
                ))}
              </div>
            </div>
          )}

          {response && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-2">AI回复:</h3>
              <div className="bg-blue-50 p-4 rounded-2xl">
                <p className="whitespace-pre-wrap">{response}</p>
              </div>
            </div>
          )}

          <div className="text-center">
            <a href="/chat" className="btn-secondary mr-4">
              🏠 返回聊天
            </a>
            <button
              onClick={() => {
                setLogs([])
                setResponse('')
                setMessage('')
              }}
              className="btn-secondary"
            >
              🧹 清除日志
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}