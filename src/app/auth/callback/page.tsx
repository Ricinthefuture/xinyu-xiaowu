'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { supabase } from '@/lib/supabase'

export default function AuthCallbackPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')
  const [message, setMessage] = useState('正在处理认证...')

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        console.log('🔐 处理认证回调...')
        
        // 检查URL参数
        const error = searchParams.get('error')
        const errorDescription = searchParams.get('error_description')
        const type = searchParams.get('type')

        if (error) {
          console.error('❌ 认证错误:', { error, errorDescription })
          setStatus('error')
          setMessage(`认证失败: ${errorDescription || error}`)
          setTimeout(() => router.push('/auth'), 3000)
          return
        }

        // 处理不同类型的回调
        if (type === 'recovery') {
          setMessage('正在处理密码重置...')
        } else {
          setMessage('正在验证邮箱...')
        }

        // 获取会话信息
        const { data, error: sessionError } = await supabase.auth.getSession()
        
        if (sessionError) {
          console.error('❌ 获取会话失败:', sessionError)
          setStatus('error')
          setMessage('认证失败，请重试')
          setTimeout(() => router.push('/auth'), 3000)
          return
        }

        if (data.session) {
          console.log('✅ 认证成功:', data.session.user.email)
          setStatus('success')
          setMessage('认证成功！正在跳转...')
          
          // 延迟跳转以显示成功消息
          setTimeout(() => {
            router.push('/chat')
          }, 2000)
        } else {
          console.log('📧 邮箱验证完成，请登录')
          setStatus('success')
          setMessage('🎉 邮箱验证成功！您的账户已激活，现在可以登录使用心语小屋了。')
          setTimeout(() => {
            router.push('/auth')
          }, 4000)
        }
      } catch (error) {
        console.error('🔥 认证回调错误:', error)
        setStatus('error')
        setMessage('认证处理失败，请重试')
        setTimeout(() => router.push('/auth'), 3000)
      }
    }

    handleAuthCallback()
  }, [router, searchParams])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 via-soft-100 to-primary-200">
      <div className="text-center p-8 bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl max-w-md">
        {status === 'loading' && (
          <>
            <div className="w-12 h-12 border-4 border-primary-300 border-t-primary-600 rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-xl text-gray-700">{message}</p>
          </>
        )}
        
        {status === 'success' && (
          <>
            <div className="text-6xl mb-4">✅</div>
            <h2 className="text-2xl font-bold text-green-600 mb-2">成功！</h2>
            <p className="text-gray-600">{message}</p>
          </>
        )}
        
        {status === 'error' && (
          <>
            <div className="text-6xl mb-4">❌</div>
            <h2 className="text-2xl font-bold text-red-600 mb-2">出错了</h2>
            <p className="text-gray-600 mb-4">{message}</p>
            <button
              onClick={() => router.push('/auth')}
              className="btn-primary"
            >
              返回登录
            </button>
          </>
        )}
      </div>
    </div>
  )
}
