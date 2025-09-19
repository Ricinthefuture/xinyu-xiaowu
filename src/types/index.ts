// 用户相关类型
export interface User {
  id: string
  email?: string
  created_at: string
}

export interface Profile {
  id: string
  user_id: string
  display_name: string | null
  avatar_url: string | null
  bio: string | null
  created_at: string
  updated_at: string
}

// 对话相关类型
export interface Conversation {
  id: string
  user_id: string
  title: string
  status: 'active' | 'archived' | 'deleted'
  created_at: string
  updated_at: string
}

export interface Message {
  id: string
  conversation_id: string
  role: 'user' | 'assistant' | 'system'
  content: string
  tokens: number | null
  created_at: string
}

// 情绪分析相关类型
export interface EmotionEvent {
  id: string
  user_id: string
  conversation_id: string | null
  event_text: string
  belief_text: string
  emotion_label: string
  intensity: number
  created_at: string
}

export interface EmotionAnalysis {
  event: string
  belief: string
  emotion: string
  intensity: number
}

// 订阅相关类型
export interface Subscription {
  id: string
  user_id: string
  plan: 'free' | 'basic' | 'premium'
  status: 'active' | 'cancelled' | 'expired'
  current_period_start: string
  current_period_end: string
  created_at: string
  updated_at: string
}

// API 响应类型
export interface APIResponse<T> {
  data?: T
  error?: string
  message?: string
}

// 聊天相关类型
export interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: string
  emotionAnalysis?: EmotionAnalysis
}
