'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

export default function TestAuthPage() {
  const [status, setStatus] = useState('检查中...')
  const [details, setDetails] = useState<any>({})

  useEffect(() => {
    const testAuth = async () => {
      try {
        console.log('🧪 开始认证测试...')
        setStatus('测试Supabase连接...')
        
        // 测试1: 基本连接
        const { data: { session }, error: sessionError } = await supabase.auth.getSession()
        
        if (sessionError) {
          console.error('❌ 会话错误:', sessionError)
          setStatus('会话获取失败')
          setDetails({ error: sessionError.message })
          return
        }

        console.log('📋 会话状态:', session)
        
        // 测试2: 数据库连接
        setStatus('测试数据库连接...')
        const { data: profiles, error: dbError } = await supabase
          .from('profiles')
          .select('count')
          .limit(1)

        if (dbError) {
          console.error('❌ 数据库错误:', dbError)
          setStatus('数据库连接失败')
          setDetails({ 
            sessionOk: !sessionError,
            dbError: dbError.message 
          })
          return
        }

        console.log('✅ 所有测试通过')
        setStatus('所有测试通过！')
        setDetails({
          sessionOk: true,
          dbOk: true,
          hasUser: !!session?.user,
          userEmail: session?.user?.email
        })

      } catch (error) {
        console.error('🔥 测试失败:', error)
        setStatus('测试失败')
        setDetails({ error: error instanceof Error ? error.message : String(error) })
      }
    }

    testAuth()
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-soft-100 to-primary-200 p-8">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-xl p-8">
          <h1 className="text-3xl font-bold text-center mb-8 bg-gradient-to-r from-primary-600 to-soft-600 bg-clip-text text-transparent">
            🧪 认证系统测试
          </h1>

          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-4">状态: {status}</h2>
          </div>

          <div className="bg-gray-50 rounded-2xl p-4">
            <h3 className="font-semibold mb-2">详细信息:</h3>
            <pre className="text-sm overflow-auto">
              {JSON.stringify(details, null, 2)}
            </pre>
          </div>

          <div className="mt-8 text-center space-x-4">
            <a href="/" className="btn-secondary">
              🏠 返回首页
            </a>
            <a href="/auth" className="btn-primary">
              🔐 认证页面
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
