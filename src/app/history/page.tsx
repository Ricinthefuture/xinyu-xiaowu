'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  created_at: string
}

interface Conversation {
  id: string
  title: string
  created_at: string
  updated_at: string
  messages: Message[]
}

interface ChatHistoryStats {
  totalConversations: number
  totalMessages: number
  oldestConversation: string
  newestConversation: string
}

export default function HistoryPage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [stats, setStats] = useState<ChatHistoryStats | null>(null)
  const [loadingHistory, setLoadingHistory] = useState(true)
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null)

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth')
      return
    }

    if (user) {
      fetchChatHistory()
    }
  }, [user, loading, router])

  const fetchChatHistory = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) return

      const response = await fetch('/api/chat-history', {
        headers: {
          'Authorization': `Bearer ${session.access_token}`
        }
      })

      const data = await response.json()
      if (response.ok) {
        setConversations(data.conversations)
        setStats(data.stats)
      }
    } catch (error) {
      console.error('获取聊天历史失败:', error)
    } finally {
      setLoadingHistory(false)
    }
  }

  const deleteConversation = async (conversationId: string) => {
    if (!confirm('确定要删除这个对话吗？此操作无法撤销。')) return

    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) return

      const response = await fetch('/api/chat-history', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`
        },
        body: JSON.stringify({ conversationId })
      })

      if (response.ok) {
        setConversations(prev => prev.filter(conv => conv.id !== conversationId))
        setSelectedConversation(null)
      }
    } catch (error) {
      console.error('删除对话失败:', error)
    }
  }

  if (loading || loadingHistory) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 via-soft-100 to-primary-200">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary-300 border-t-primary-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-xl text-gray-700">加载聊天历史中...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-soft-100 to-primary-200">
      <div className="container mx-auto px-4 py-8">
        {/* 头部 */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary-600 to-soft-600 bg-clip-text text-transparent">
            📚 聊天历史记录
          </h1>
          <button
            onClick={() => router.push('/chat')}
            className="btn-primary px-6 py-3"
          >
            🏠 返回聊天
          </button>
        </div>

        {/* 统计信息 */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg">
              <div className="text-2xl font-bold text-primary-600">{stats.totalConversations}</div>
              <div className="text-gray-600">总对话数</div>
            </div>
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg">
              <div className="text-2xl font-bold text-soft-600">{stats.totalMessages}</div>
              <div className="text-gray-600">总消息数</div>
            </div>
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg">
              <div className="text-2xl font-bold text-emotion-comfort">
                {stats.oldestConversation ? new Date(stats.oldestConversation).toLocaleDateString('zh-CN') : '-'}
              </div>
              <div className="text-gray-600">最早对话</div>
            </div>
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg">
              <div className="text-2xl font-bold text-emotion-peaceful">
                {stats.newestConversation ? new Date(stats.newestConversation).toLocaleDateString('zh-CN') : '-'}
              </div>
              <div className="text-gray-600">最新对话</div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* 对话列表 */}
          <div className="lg:col-span-1">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-6">
              <h2 className="text-xl font-semibold mb-4 text-gray-800">对话列表</h2>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {conversations.map((conversation) => (
                  <div
                    key={conversation.id}
                    className={`p-4 rounded-xl cursor-pointer transition-all ${
                      selectedConversation === conversation.id
                        ? 'bg-primary-100 border-2 border-primary-300'
                        : 'bg-gray-50 hover:bg-gray-100'
                    }`}
                    onClick={() => setSelectedConversation(conversation.id)}
                  >
                    <div className="font-medium text-gray-800 truncate">
                      {conversation.title}
                    </div>
                    <div className="text-sm text-gray-500 mt-1">
                      {new Date(conversation.created_at).toLocaleString('zh-CN')}
                    </div>
                    <div className="text-xs text-gray-400 mt-1">
                      {conversation.messages?.length || 0} 条消息
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* 对话详情 */}
          <div className="lg:col-span-2">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-6">
              {selectedConversation ? (
                <>
                  {(() => {
                    const conversation = conversations.find(c => c.id === selectedConversation)
                    if (!conversation) return <div>对话未找到</div>
                    
                    return (
                      <>
                        <div className="flex justify-between items-center mb-6">
                          <h2 className="text-xl font-semibold text-gray-800">
                            {conversation.title}
                          </h2>
                          <button
                            onClick={() => deleteConversation(conversation.id)}
                            className="text-red-500 hover:text-red-700 px-3 py-1 rounded-lg hover:bg-red-50"
                          >
                            🗑️ 删除
                          </button>
                        </div>
                        
                        <div className="space-y-4 max-h-96 overflow-y-auto">
                          {conversation.messages?.map((message) => (
                            <div
                              key={message.id}
                              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                            >
                              <div
                                className={`max-w-xs lg:max-w-md px-4 py-3 rounded-2xl ${
                                  message.role === 'user'
                                    ? 'bg-gradient-to-r from-primary-500 to-soft-500 text-white'
                                    : 'bg-gray-100 text-gray-800'
                                }`}
                              >
                                <p className="text-sm leading-relaxed whitespace-pre-wrap">
                                  {message.content}
                                </p>
                                <p className={`text-xs mt-2 ${
                                  message.role === 'user' ? 'text-white/70' : 'text-gray-500'
                                }`}>
                                  {new Date(message.created_at).toLocaleTimeString('zh-CN')}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </>
                    )
                  })()}
                </>
              ) : (
                <div className="text-center text-gray-500 py-12">
                  <div className="text-6xl mb-4">💬</div>
                  <p>请从左侧选择一个对话查看详情</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
