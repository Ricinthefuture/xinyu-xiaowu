'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import AuthForm from '@/components/AuthForm'

export default function AuthPage() {
  const router = useRouter()
  const { user, loading } = useAuth()

  // 如果已登录，重定向到聊天页面
  useEffect(() => {
    if (!loading && user) {
      router.push('/chat')
    }
  }, [user, loading, router])

  // 如果正在加载，显示加载状态
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 via-soft-100 to-primary-200">
        <div className="text-center p-8 bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl">
          <p className="text-xl text-gray-700 mb-4">正在加载...</p>
          <div className="w-12 h-12 border-4 border-primary-300 border-t-primary-600 rounded-full animate-spin mx-auto"></div>
        </div>
      </div>
    )
  }

  // 如果已登录，不显示认证表单（即将重定向）
  if (user) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-soft-100 to-primary-200 relative overflow-hidden">
      {/* 装饰性浮动元素 */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-r from-primary-200 to-soft-300 rounded-full opacity-20 animate-float"></div>
        <div className="absolute top-40 right-20 w-24 h-24 bg-gradient-to-r from-soft-200 to-primary-300 rounded-full opacity-30 animate-float" style={{ animationDelay: '1s' }}></div>
        <div className="absolute bottom-40 left-1/4 w-20 h-20 bg-gradient-to-r from-primary-300 to-soft-200 rounded-full opacity-25 animate-float" style={{ animationDelay: '2s' }}></div>
      </div>

      {/* 顶部导航 */}
      <nav className="relative z-10 p-4">
        <div className="max-w-7xl mx-auto">
          <button
            onClick={() => router.push('/')}
            className="flex items-center space-x-2 text-gray-600 hover:text-primary-600 transition-colors"
          >
            <span className="text-xl">←</span>
            <span>返回首页</span>
          </button>
        </div>
      </nav>

      {/* 主要内容 */}
      <div className="flex items-center justify-center min-h-[calc(100vh-100px)] px-4">
        <AuthForm 
          onSuccess={() => {
            router.push('/chat')
          }}
        />
      </div>
    </div>
  )
}
