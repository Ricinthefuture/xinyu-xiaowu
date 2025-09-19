'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import ChatWindow from '@/components/ChatWindow'

export default function ChatPage() {
  const { user, profile, loading, signOut } = useAuth()
  const router = useRouter()

  // 未登录用户重定向到认证页面
  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth')
    }
  }, [user, loading, router])

  const handleSignOut = async () => {
    await signOut()
    router.push('/')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 via-soft-100 to-primary-200 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block p-4 rounded-full bg-gradient-to-r from-primary-100 to-soft-200 mb-4">
            <div className="w-8 h-8 border-4 border-primary-300 border-t-primary-600 rounded-full animate-spin"></div>
          </div>
          <p className="text-gray-600">正在加载...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    // 未登录状态（即将重定向）
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 via-soft-100 to-primary-200 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block p-4 rounded-full bg-gradient-to-r from-primary-100 to-soft-200 mb-4">
            <span className="text-2xl">🔒</span>
          </div>
          <p className="text-gray-600">请先登录...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-soft-100 to-primary-200">
      {/* 顶部导航栏 */}
      <nav className="bg-gradient-to-r from-white/95 to-primary-50/95 backdrop-blur-lg border-b border-primary-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-primary-400 to-soft-500 rounded-full flex items-center justify-center shadow-lg animate-wave">
                <span className="text-white text-lg">🐱</span>
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-primary-600 to-soft-600 bg-clip-text text-transparent">
                心语小屋
              </span>
            </div>

            {/* 用户信息和操作 */}
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-700">
                  {profile?.display_name || user.email?.split('@')[0] || '用户'}
                </p>
                <p className="text-xs text-gray-500">
                  {user.email}
                </p>
              </div>
              <button
                onClick={handleSignOut}
                className="btn-secondary text-sm px-4 py-2"
              >
                退出登录
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* 主要内容区域 */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* 欢迎区域 */}
        <div className="text-center mb-8">
          <div className="inline-block p-4 rounded-full bg-gradient-to-r from-primary-100 to-soft-200 mb-6">
            <span className="text-4xl">🌸</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-primary-600 to-soft-600 bg-clip-text text-transparent mb-4">
            欢迎来到心语小屋，{profile?.display_name || '朋友'}！
          </h1>
          <p className="text-lg text-gray-600 mb-8">
            这里是您的专属情感陪伴空间 💕 准备好开始心灵对话了吗？
          </p>
        </div>

        {/* 对话区域 */}
        <div className="h-96 lg:h-[600px]">
          <ChatWindow 
            onConversationStart={(id) => {
              console.log('新对话开始:', id)
            }}
          />
        </div>
      </div>
    </div>
  )
}
