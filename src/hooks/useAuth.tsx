'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { User, Session, AuthError } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabase'
import type { Profile } from '@/types'

interface AuthContextType {
  user: User | null
  profile: Profile | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<{ error: string | null }>
  signUp: (email: string, password: string) => Promise<{ error: string | null }>
  signOut: () => Promise<void>
  updateProfile: (updates: Partial<Profile>) => Promise<{ error: string | null }>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    console.log('🔄 AuthProvider: 初始化认证状态检查...')
    
    // 获取初始会话
    const getInitialSession = async () => {
      try {
        console.log('🔍 AuthProvider: 获取初始会话...')
        const { data: { session }, error } = await supabase.auth.getSession()
        
        if (error) {
          console.error('❌ AuthProvider: 获取会话失败:', error)
          setLoading(false)
          return
        }
        
        console.log('📋 AuthProvider: 会话状态:', { 
          hasSession: !!session, 
          userEmail: session?.user?.email 
        })
        
        if (session?.user) {
          setUser(session.user)
          await fetchProfile(session.user.id)
        } else {
          console.log('👤 AuthProvider: 无用户会话')
        }
      } catch (error) {
        console.error('🔥 AuthProvider: 初始会话检查错误:', error)
      } finally {
        console.log('✅ AuthProvider: 初始加载完成')
        setLoading(false)
      }
    }

    // 设置超时保护，防止无限加载
    const timeout = setTimeout(() => {
      console.warn('⚠️ AuthProvider: 认证检查超时，强制完成加载')
      setLoading(false)
    }, 5000) // 5秒超时

    getInitialSession().then(() => {
      clearTimeout(timeout)
    })

    // 监听认证状态变化
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('🔄 AuthProvider: 认证状态变化:', event, session?.user?.email)
        
        if (session?.user) {
          setUser(session.user)
          await fetchProfile(session.user.id)
        } else {
          setUser(null)
          setProfile(null)
        }
        
        setLoading(false)
      }
    )

    return () => {
      clearTimeout(timeout)
      subscription.unsubscribe()
    }
  }, [])

  const fetchProfile = async (userId: string) => {
    try {
      console.log('👤 AuthProvider: 获取用户档案...', userId)
      
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', userId)
        .single()

      if (error && error.code !== 'PGRST116') {
        console.error('❌ AuthProvider: 获取档案失败:', error)
        // 不阻塞加载，继续执行
        return
      }

      if (data) {
        console.log('✅ AuthProvider: 档案获取成功')
        setProfile(data)
      } else {
        console.log('📝 AuthProvider: 档案不存在，创建默认档案')
        // 异步创建档案，不阻塞主流程
        createProfile(userId).catch(err => {
          console.error('❌ AuthProvider: 创建档案失败:', err)
        })
      }
    } catch (error) {
      console.error('🔥 AuthProvider: fetchProfile错误:', error)
      // 不阻塞加载
    }
  }

  const createProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .insert([
          {
            user_id: userId,
            display_name: user?.email?.split('@')[0] || '用户',
          }
        ])
        .select()
        .single()

      if (error) {
        console.error('Error creating profile:', error)
        return
      }

      if (data) {
        setProfile(data)
      }
    } catch (error) {
      console.error('Error in createProfile:', error)
    }
  }

  // 错误消息本地化
  function getErrorMessage(error: string): string {
    const errorMap: Record<string, string> = {
      'Invalid login credentials': '邮箱或密码错误，或邮箱尚未确认',
      'Email not confirmed': '请先检查邮箱并点击确认链接',
      'User already registered': '该邮箱已注册，请直接登录',
      'Password should be at least 6 characters': '密码至少需要6个字符',
      'Unable to validate email address: invalid format': '邮箱格式不正确',
      'signup_disabled': '注册功能暂时关闭',
      'Invalid email or password': '邮箱或密码错误，或邮箱尚未确认',
      'Email address not confirmed': '请先检查邮箱并点击确认链接',
    }

    return errorMap[error] || `操作失败：${error}`
  }

  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true)
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        return { error: getErrorMessage(error.message) }
      }

      return { error: null }
    } catch (error) {
      console.error('Sign in error:', error)
      return { error: '登录失败，请稍后重试' }
    } finally {
      setLoading(false)
    }
  }

  const signUp = async (email: string, password: string) => {
    try {
      setLoading(true)
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      })

      if (error) {
        return { error: getErrorMessage(error.message) }
      }

      return { error: null }
    } catch (error) {
      console.error('Sign up error:', error)
      return { error: '注册失败，请稍后重试' }
    } finally {
      setLoading(false)
    }
  }

  const signOut = async () => {
    try {
      setLoading(true)
      const { error } = await supabase.auth.signOut()
      if (error) {
        console.error('Sign out error:', error)
      }
    } catch (error) {
      console.error('Sign out error:', error)
    } finally {
      setLoading(false)
    }
  }

  const updateProfile = async (updates: Partial<Profile>) => {
    try {
      if (!user) {
        return { error: '用户未登录' }
      }

      const { error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('user_id', user.id)

      if (error) {
        console.error('Update profile error:', error)
        return { error: '更新失败，请稍后重试' }
      }

      // 更新本地状态
      if (profile) {
        setProfile({ ...profile, ...updates })
      }

      return { error: null }
    } catch (error) {
      console.error('Update profile error:', error)
      return { error: '更新失败，请稍后重试' }
    }
  }

  const value: AuthContextType = {
    user,
    profile,
    loading,
    signIn,
    signUp,
    signOut,
    updateProfile,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
