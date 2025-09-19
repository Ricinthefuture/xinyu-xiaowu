'use client'

import { useState, useRef, useEffect } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { supabase } from '@/lib/supabase'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: string
}

interface EmotionAnalysis {
  event: string
  belief: string
  emotion: string
  intensity: number
}

interface ChatWindowProps {
  conversationId?: string
  onConversationStart?: (id: string) => void
}

export default function ChatWindow({ conversationId, onConversationStart }: ChatWindowProps) {
  const { user } = useAuth()
  const [messages, setMessages] = useState<Message[]>([])
  const [inputMessage, setInputMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [currentConversationId, setCurrentConversationId] = useState(conversationId)
  const [lastEmotionAnalysis, setLastEmotionAnalysis] = useState<EmotionAnalysis | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // 加载对话历史
  useEffect(() => {
    if (conversationId && user) {
      loadConversationHistory(conversationId)
    }
  }, [conversationId, user])

  const loadConversationHistory = async (convId: string) => {
    try {
      // 这里可以添加加载历史消息的逻辑
      // 暂时留空，因为我们会在API中处理历史记录
    } catch (error) {
      console.error('加载对话历史失败:', error)
    }
  }

  const testGitHubModels = async () => {
    console.log('🧪 测试GitHub Models API...')
    setIsLoading(true)
    
    const testMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: '[测试] 你好，请回复测试',
      timestamp: new Date().toISOString()
    }
    
    setMessages(prev => [...prev, testMessage])
    
    try {
      const { data: { session } } = await supabase.auth.getSession()
      const accessToken = session?.access_token

      if (!accessToken) {
        throw new Error('无法获取访问令牌')
      }

      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`
        },
        body: JSON.stringify({
          message: '[测试] 你好，请回复测试',
          conversationId: currentConversationId
        })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || '测试失败')
      }

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: `✅ GitHub Models API测试成功！\n\n${data.message}`,
        timestamp: new Date().toISOString()
      }

      setMessages(prev => [...prev, aiMessage])

    } catch (error) {
      console.error('❌ GitHub Models测试失败:', error)
      
      const errorMessage: Message = {
        id: (Date.now() + 2).toString(),
        role: 'assistant',
        content: `❌ GitHub Models API测试失败: ${error instanceof Error ? error.message : '未知错误'}`,
        timestamp: new Date().toISOString()
      }

      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const sendMessage = async () => {
    console.log('🚀 ChatWindow: sendMessage 被调用')
    console.log('🔍 ChatWindow: 检查条件', {
      hasInputMessage: !!inputMessage.trim(),
      isLoading: isLoading,
      hasUser: !!user,
      userEmail: user?.email
    })

    if (!inputMessage.trim() || isLoading || !user) {
      console.log('❌ ChatWindow: 发送条件不满足，返回', {
        noMessage: !inputMessage.trim(),
        isLoading: isLoading,
        noUser: !user
      })
      return
    }

    console.log('✅ ChatWindow: 所有条件满足，准备发送消息')

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: inputMessage.trim(),
      timestamp: new Date().toISOString()
    }

    console.log('📝 ChatWindow: 添加用户消息', userMessage)
    setMessages(prev => [...prev, userMessage])
    setInputMessage('')
    setIsLoading(true)

      try {
        // 获取当前用户的访问令牌
        console.log('🔐 开始获取Supabase会话...')
        const { data: { session }, error: sessionError } = await supabase.auth.getSession()
        
        if (sessionError) {
          console.error('❌ 获取会话失败:', sessionError)
          throw new Error(`获取会话失败: ${sessionError.message}`)
        }
        
        console.log('📋 会话获取结果:', { 
          hasSession: !!session,
          userEmail: session?.user?.email,
          sessionId: session?.user?.id
        })
        
        const accessToken = session?.access_token

        console.log('🔑 ChatWindow: 获取访问令牌', {
          hasSession: !!session,
          hasAccessToken: !!accessToken,
          tokenLength: accessToken?.length || 0,
          tokenPrefix: accessToken?.substring(0, 20) + '...'
        })

        if (!accessToken) {
          console.error('❌ 无访问令牌')
          throw new Error('无法获取访问令牌，请重新登录')
        }

        console.log('📤 ChatWindow: 准备发送API请求')
        console.log('📋 请求详情:', {
          url: '/api/ai/chat',
          method: 'POST',
          messageContent: userMessage.content,
          messageLength: userMessage.content.length,
          conversationId: currentConversationId,
          hasAuth: true
        })

        console.log('🌐 开始fetch请求...')
        const response = await fetch('/api/ai/chat', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`
          },
          body: JSON.stringify({
            message: userMessage.content,
            conversationId: currentConversationId
          })
        })

        console.log('📡 fetch请求完成')

      console.log('📊 ChatWindow: API响应状态', response.status)

      const data = await response.json()
      console.log('📄 ChatWindow: API响应数据', data)

      if (!response.ok) {
        console.error('❌ ChatWindow: API请求失败', data)
        throw new Error(data.error || '发送消息失败')
      }

      // 如果是新对话，更新对话ID
      if (data.conversationId && !currentConversationId) {
        setCurrentConversationId(data.conversationId)
        onConversationStart?.(data.conversationId)
      }

      // 添加AI回复
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.message,
        timestamp: new Date().toISOString()
      }

      setMessages(prev => [...prev, aiMessage])

      // 保存情绪分析结果
      if (data.emotionAnalysis) {
        setLastEmotionAnalysis(data.emotionAnalysis)
      }

    } catch (error) {
      console.error('发送消息失败:', error)
      
      // 显示错误消息
      const errorMessage: Message = {
        id: (Date.now() + 2).toString(),
        role: 'assistant',
        content: '抱歉，我暂时无法回复。请稍后再试。💕',
        timestamp: new Date().toISOString()
      }

      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    console.log('⌨️ 按键被按下:', e.key)
    if (e.key === 'Enter' && !e.shiftKey) {
      console.log('✅ 回车键触发发送')
      e.preventDefault()
      sendMessage()
    }
  }

  return (
    <div className="flex flex-col h-full bg-gradient-to-br from-primary-50/50 to-soft-100/50 rounded-3xl shadow-xl overflow-hidden">
      {/* 聊天头部 */}
      <div className="bg-gradient-to-r from-white/90 to-primary-50/90 backdrop-blur-sm p-4 border-b border-primary-200">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-r from-primary-400 to-soft-500 rounded-full flex items-center justify-center shadow-lg animate-wave">
            <span className="text-white text-lg">🐱</span>
          </div>
          <div className="flex-1">
            <h3 className="font-bold text-gray-800">心语小屋AI助手</h3>
            <p className="text-sm text-gray-600">基于ABC理论的情感陪伴</p>
          </div>
          <button
            onClick={() => window.open('/history', '_blank')}
            disabled={isLoading}
            className="px-3 py-1 text-xs bg-gradient-to-r from-primary-400 to-soft-500 text-white rounded-full hover:from-primary-500 hover:to-soft-600 transition-all disabled:opacity-50"
          >
            📚 历史记录
          </button>
        </div>
      </div>

      {/* 消息区域 */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 && (
          <div className="text-center py-8">
            <div className="inline-block p-4 rounded-full bg-gradient-to-r from-primary-100 to-soft-200 mb-4">
              <span className="text-3xl">🌸</span>
            </div>
            <h4 className="text-lg font-semibold text-gray-700 mb-2">开始您的心灵对话</h4>
            <p className="text-gray-500">分享您的感受，我会用心倾听并陪伴您 💕</p>
          </div>
        )}

        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-xs lg:max-w-md px-4 py-3 rounded-2xl ${
                message.role === 'user'
                  ? 'bg-gradient-to-r from-primary-500 to-soft-500 text-white'
                  : 'bg-white/90 text-gray-800 shadow-md'
              }`}
            >
              <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
              <p className={`text-xs mt-2 ${
                message.role === 'user' ? 'text-white/70' : 'text-gray-500'
              }`}>
                {new Date(message.timestamp).toLocaleTimeString('zh-CN', {
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </p>
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-white/90 rounded-2xl px-4 py-3 shadow-md">
              <div className="flex items-center space-x-2">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-primary-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-primary-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-primary-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
                <span className="text-sm text-gray-600">AI正在分析您的情绪...</span>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* 移除ABC理论情绪分析显示 */}

      {/* 输入区域 */}
      <div className="p-4 bg-gradient-to-r from-white/90 to-primary-50/90 backdrop-blur-sm border-t border-primary-200">
        <div className="flex space-x-3">
          <textarea
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="分享您的感受..."
            className="flex-1 resize-none rounded-2xl border-0 bg-white/90 px-4 py-3 text-gray-800 placeholder-gray-500 focus:ring-2 focus:ring-primary-300 focus:outline-none shadow-inner"
            rows={1}
            disabled={isLoading}
          />
          <button
            onClick={() => {
              console.log('🔘 按钮被点击了!')
              sendMessage()
            }}
            disabled={!inputMessage.trim() || isLoading}
            className="btn-primary px-6 py-3 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? '💭' : '💕'}
          </button>
        </div>
      </div>
    </div>
  )
}
