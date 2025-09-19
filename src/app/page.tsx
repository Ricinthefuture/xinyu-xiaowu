'use client'

import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'

export default function Home() {
  const router = useRouter()
  const { user, loading, signOut } = useAuth()
  
  return (
    <main className="min-h-screen bg-gradient-to-br from-primary-50 via-soft-100 to-primary-200 relative overflow-hidden">
      {/* 装饰性浮动元素 */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* 移除了粉红圆形装饰元素 */}
      </div>

      {/* 顶部导航栏 */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-white/95 to-primary-50/95 backdrop-blur-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-18">
            <div className="flex items-center space-x-3">
              <span className="text-2xl font-bold bg-gradient-to-r from-primary-600 to-soft-600 bg-clip-text text-transparent">心语小屋</span>
            </div>
            <div className="flex space-x-3">
              {loading ? (
                <div className="w-8 h-8 border-2 border-primary-300 border-t-primary-600 rounded-full animate-spin"></div>
              ) : user ? (
                <>
                  <button 
                    onClick={() => router.push('/chat')}
                    className="btn-primary text-sm px-6"
                  >
                    进入聊天
                  </button>
                  <button 
                    onClick={() => signOut()}
                    className="btn-secondary text-sm px-6"
                  >
                    退出登录
                  </button>
                </>
              ) : (
                <>
                  <button 
                    onClick={() => router.push('/auth')}
                    className="btn-secondary text-sm px-6"
                  >
                    登录
                  </button>
                  <button 
                    onClick={() => router.push('/auth')}
                    className="btn-primary text-sm px-6"
                  >
                    开始倾诉
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* 英雄区域 */}
      <section className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <div className="mb-8">
            <div className="inline-block p-6 rounded-full bg-gradient-to-r from-primary-100 to-soft-200 mb-6 animate-float">
              <span className="text-6xl">🌸</span>
            </div>
          </div>
          
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold mb-8">
            <span className="block bg-gradient-to-r from-primary-600 to-soft-600 bg-clip-text text-transparent">
              心语小屋
            </span>
            <span className="block text-3xl sm:text-4xl lg:text-5xl text-gray-700 mt-4">
              温暖的AI情感陪伴助手
            </span>
          </h1>
          
          <p className="text-xl sm:text-2xl text-gray-600 mb-12 max-w-4xl mx-auto leading-relaxed">
            一个温暖的心灵港湾，基于ABC理论的AI情感陪伴助手<br/>
            让我们一起倾听内心的声音，找到属于您的宁静时光 💕
          </p>

          {/* 动态按钮区域 */}
          <div className="text-center mb-16">
            {user ? (
              <div className="space-y-4 sm:space-y-0 sm:space-x-6 sm:flex sm:justify-center">
                <button 
                  onClick={() => router.push('/chat')}
                  className="btn-primary text-lg px-8 py-4"
                >
                  🌈 继续对话
                </button>
                <button 
                  onClick={() => signOut()}
                  className="btn-secondary text-lg px-8 py-4"
                >
                  👋 退出登录
                </button>
              </div>
            ) : (
              <div className="space-y-4 sm:space-y-0 sm:space-x-6 sm:flex sm:justify-center">
                <button 
                  onClick={() => router.push('/chat')}
                  className="btn-primary text-lg px-8 py-4"
                >
                  🌸 开始心灵对话
                </button>
                <button 
                  onClick={() => router.push('/auth')}
                  className="btn-secondary text-lg px-8 py-4"
                >
                  🔐 登录
                </button>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* 特色功能区域 */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 wave-divider">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-primary-600 to-soft-600 bg-clip-text text-transparent mb-6 leading-tight">
              为什么选择心语小屋？
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              我们运用专业的ABC理论，为您提供温暖贴心的情感支持 🌿
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* 功能卡片 1 */}
            <div className="card group">
              <div className="w-16 h-16 bg-gradient-to-r from-emotion-calm to-primary-300 rounded-full flex items-center justify-center mb-6 shadow-lg mx-auto group-hover:animate-wave">
                <span className="text-white text-2xl">🧠</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-4 text-center">ABC理论指导</h3>
              <p className="text-gray-600 text-center leading-relaxed">
                基于认知行为疗法的ABC理论，帮助您识别事件(A)、信念(B)和情绪结果(C)之间的关系
              </p>
            </div>

            {/* 功能卡片 2 */}
            <div className="card group">
              <div className="w-16 h-16 bg-gradient-to-r from-emotion-comfort to-primary-400 rounded-full flex items-center justify-center mb-6 shadow-lg mx-auto group-hover:animate-wave">
                <span className="text-white text-2xl">💕</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-4 text-center">温暖陪伴</h3>
              <p className="text-gray-600 text-center leading-relaxed">
                7×24小时的温暖陪伴，无论何时何地，都有人倾听您的心声
              </p>
            </div>

            {/* 功能卡片 3 */}
            <div className="card group">
              <div className="w-16 h-16 bg-gradient-to-r from-emotion-peaceful to-primary-500 rounded-full flex items-center justify-center mb-6 shadow-lg mx-auto group-hover:animate-wave">
                <span className="text-white text-2xl">🌱</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-4 text-center">成长陪伴</h3>
              <p className="text-gray-600 text-center leading-relaxed">
                不仅提供情感支持，更帮助您在每一次对话中获得成长和洞察
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 底部区域 */}
      <footer className="bg-gradient-to-r from-white/90 to-primary-50/90 backdrop-blur-lg py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex items-center justify-center space-x-3 mb-6">
            <span className="text-xl font-bold bg-gradient-to-r from-primary-600 to-soft-600 bg-clip-text text-transparent">
              心语小屋
            </span>
          </div>
          <p className="text-gray-600 mb-4">
            温暖的AI情感陪伴助手 | 基于ABC理论 | 让心灵找到宁静
          </p>
          <p className="text-sm text-gray-500">
            © 2024 心语小屋. 用心陪伴每一个需要倾听的灵魂 💕
          </p>
        </div>
      </footer>
    </main>
  )
}
