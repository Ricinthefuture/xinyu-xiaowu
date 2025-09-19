'use client'

import { useState } from 'react'
import { useAuth } from '@/hooks/useAuth'

interface AuthFormProps {
  onSuccess?: () => void
}

export default function AuthForm({ onSuccess }: AuthFormProps) {
  const [mode, setMode] = useState<'signin' | 'signup'>('signin')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const { signIn, signUp } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || !password) {
      setError('请填写完整信息')
      return
    }

    if (password.length < 6) {
      setError('密码至少需要6个字符')
      return
    }

    setLoading(true)
    setError('')

    try {
      console.log(`🔐 开始${mode === 'signin' ? '登录' : '注册'}:`, { email })
      
      let result
      if (mode === 'signin') {
        result = await signIn(email, password)
      } else {
        result = await signUp(email, password)
      }

      console.log('📊 认证结果:', result)

      if (result.error) {
        // 改进错误消息
        let friendlyError = result.error
        if (result.error.includes('Invalid login credentials')) {
          friendlyError = '邮箱或密码错误，请检查后重试'
        } else if (result.error.includes('Email not confirmed')) {
          friendlyError = '邮箱尚未验证，请检查邮箱并点击验证链接'
        } else if (result.error.includes('User already registered')) {
          friendlyError = '该邮箱已注册，请直接登录'
        } else if (result.error.includes('Password should be at least')) {
          friendlyError = '密码至少需要6个字符'
        }
        setError(friendlyError)
      } else {
        // 成功
        if (mode === 'signup') {
          setError('')
          // 注册成功提示 - 使用更友好的消息
          setError('🎉 注册成功！请检查您的邮箱并点击验证链接完成注册。验证后可直接登录。')
          // 3秒后清除消息
          setTimeout(() => setError(''), 5000)
        } else {
          console.log('✅ 登录成功，跳转中...')
          onSuccess?.()
        }
      }
    } catch (err) {
      console.error('🔥 认证错误:', err)
      setError('操作失败，请稍后重试')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="card">
        {/* 标题 */}
        <div className="text-center mb-8">
          <div className="inline-block p-4 rounded-full bg-gradient-to-r from-primary-100 to-soft-200 mb-4">
            <span className="text-3xl">🌸</span>
          </div>
          <h2 className="text-2xl font-bold bg-gradient-to-r from-primary-600 to-soft-600 bg-clip-text text-transparent mb-2">
            {mode === 'signin' ? '欢迎回来' : '加入心语小屋'}
          </h2>
          <p className="text-gray-600">
            {mode === 'signin' ? '继续您的心灵之旅' : '开始您的情感陪伴之旅'}
          </p>
        </div>

        {/* 表单 */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* 邮箱输入 */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
              邮箱地址
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="请输入您的邮箱"
              className="input-field"
              disabled={loading}
              required
            />
          </div>

          {/* 密码输入 */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
              密码
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={mode === 'signup' ? '请设置密码（至少6位）' : '请输入密码'}
              className="input-field"
              disabled={loading}
              minLength={6}
              required
            />
          </div>

          {/* 消息显示 */}
          {error && (
            <div className={`border rounded-2xl p-4 ${
              error.includes('🎉') 
                ? 'bg-green-50 border-green-200' 
                : 'bg-red-50 border-red-200'
            }`}>
              <div className="flex items-start">
                <span className={`text-sm mr-2 ${
                  error.includes('🎉') ? 'text-green-500' : 'text-red-500'
                }`}>
                  {error.includes('🎉') ? '✅' : '⚠️'}
                </span>
                <p className={`text-sm ${
                  error.includes('🎉') ? 'text-green-700' : 'text-red-700'
                }`}>
                  {error}
                </p>
              </div>
            </div>
          )}

          {/* 提交按钮 */}
          <button
            type="submit"
            disabled={loading}
            className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <div className="flex items-center justify-center">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                {mode === 'signin' ? '登录中...' : '注册中...'}
              </div>
            ) : (
              mode === 'signin' ? '🌸 登录' : '✨ 注册'
            )}
          </button>
        </form>

        {/* 模式切换 */}
        <div className="mt-8 text-center">
          <p className="text-gray-600 mb-4">
            {mode === 'signin' ? '还没有账号？' : '已经有账号了？'}
          </p>
          <button
            onClick={() => {
              setMode(mode === 'signin' ? 'signup' : 'signin')
              setError('')
              setEmail('')
              setPassword('')
            }}
            className="btn-secondary"
            disabled={loading}
          >
            {mode === 'signin' ? '注册新账号' : '返回登录'}
          </button>
        </div>
      </div>
    </div>
  )
}
