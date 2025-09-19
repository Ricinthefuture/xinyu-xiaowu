// GitHub Models API 调试版本 - 只使用真实API，无回退

interface ChatMessage {
  role: 'system' | 'user' | 'assistant'
  content: string
}

interface EmotionAnalysis {
  event: string
  belief: string
  emotion: string
  intensity: number
}

class GitHubModelsDebugClient {
  private apiToken: string
  
  // GitHub Models 的可能端点
  private endpoints = [
    'https://models.inference.ai.azure.com/chat/completions',
    'https://api.githubmodels.com/chat/completions',
    'https://models.githubusercontent.com/chat/completions',
    'https://inference.ai.azure.com/chat/completions'
  ]
  
  // 可用的模型
  private models = [
    'gpt-4o-mini',
    'gpt-4o',
    'gpt-3.5-turbo',
    'meta-llama-3-70b-instruct',
    'meta-llama-3-8b-instruct'
  ]

  constructor() {
    this.apiToken = process.env.GITHUB_TOKEN || ''
    console.log('🔧 GitHub Token 状态:', this.apiToken ? `存在 (长度: ${this.apiToken.length})` : '❌ 缺失')
    
    if (!this.apiToken) {
      throw new Error('❌ GITHUB_TOKEN 环境变量未设置')
    }
  }

  async processUserMessage(userMessage: string, conversationHistory: ChatMessage[] = []): Promise<string> {
    console.log('🚀 开始调用 GitHub Models API...')
    console.log('📝 用户消息:', userMessage)
    console.log('📚 对话历史长度:', conversationHistory.length)

    const messages: ChatMessage[] = [
      { role: 'system', content: this.getSystemPrompt() },
      ...conversationHistory.slice(-6), // 只保留最近6条消息
      { role: 'user', content: userMessage }
    ]

    console.log('📨 完整消息数组:', JSON.stringify(messages, null, 2))

    // 尝试每个端点和模型的组合
    for (const endpoint of this.endpoints) {
      for (const model of this.models) {
        try {
          console.log(`🔍 尝试端点: ${endpoint}`)
          console.log(`🤖 尝试模型: ${model}`)
          
          const result = await this.callAPI(endpoint, model, messages)
          if (result) {
            console.log('✅ API 调用成功!')
            console.log('📤 AI 回复:', result)
            return result
          }
        } catch (error) {
          console.error(`❌ 端点 ${endpoint} + 模型 ${model} 失败:`, error)
          continue
        }
      }
    }

    throw new Error('❌ 所有 GitHub Models API 端点都无法访问')
  }

  private async callAPI(endpoint: string, model: string, messages: ChatMessage[]): Promise<string | null> {
    const controller = new AbortController()
    const timeoutId = setTimeout(() => {
      console.log('⏰ 请求超时，取消请求')
      controller.abort()
    }, 15000) // 15秒超时

    try {
      const requestBody = {
        model: model,
        messages: messages,
        max_tokens: 1000,
        temperature: 0.7,
        stream: false
      }

      console.log('📋 请求体:', JSON.stringify(requestBody, null, 2))

      const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.apiToken}`,
        'User-Agent': 'EmotionAI-HeartHouse/1.0',
        'Accept': 'application/json'
      }

      console.log('📋 请求头:', JSON.stringify(headers, null, 2))

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(requestBody),
        signal: controller.signal
      })

      clearTimeout(timeoutId)

      console.log('📊 响应状态:', response.status, response.statusText)
      console.log('📋 响应头:', Object.fromEntries(response.headers.entries()))

      if (!response.ok) {
        const errorText = await response.text()
        console.error('❌ 响应错误内容:', errorText)
        throw new Error(`HTTP ${response.status}: ${errorText}`)
      }

      const data = await response.json()
      console.log('📦 完整响应数据:', JSON.stringify(data, null, 2))

      if (data.choices && data.choices[0] && data.choices[0].message) {
        return data.choices[0].message.content
      } else {
        console.error('❌ 响应格式不正确:', data)
        throw new Error('响应格式不正确')
      }

    } catch (error) {
      clearTimeout(timeoutId)
      
      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          console.error('❌ 请求被取消 (超时)')
        } else {
          console.error('❌ 请求失败:', error.message)
        }
      } else {
        console.error('❌ 未知错误:', error)
      }
      
      throw error
    }
  }

  async analyzeEmotion(userInput: string): Promise<EmotionAnalysis> {
    console.log('🧠 开始情绪分析:', userInput)
    
    // 简化版情绪分析，避免额外的API调用
    const emotionKeywords = {
      '焦虑': ['焦虑', '紧张', '担心', '不安', '恐慌', '害怕'],
      '悲伤': ['难过', '悲伤', '低落', '绝望', '沮丧', '失望'],
      '愤怒': ['生气', '愤怒', '暴躁', '恼火', '愤恨', '气愤'],
      '压力': ['压力', '负担', '疲惫', '累', '忙碌', '疲劳'],
      '孤独': ['孤独', '寂寞', '独自', '没人理解', '隔离'],
      '困惑': ['困惑', '迷茫', '不知道', '不确定', '疑惑']
    }

    let detectedEmotion = '混合情绪'
    let intensity = 5

    for (const [emotion, keywords] of Object.entries(emotionKeywords)) {
      for (const keyword of keywords) {
        if (userInput.includes(keyword)) {
          detectedEmotion = emotion
          intensity = Math.min(8, Math.max(4, Math.floor(userInput.length / 15) + 3))
          break
        }
      }
      if (detectedEmotion !== '混合情绪') break
    }

    const result = {
      event: userInput.length > 50 ? userInput.substring(0, 50) + '...' : userInput,
      belief: '需要进一步探索的内在信念',
      emotion: detectedEmotion,
      intensity: intensity
    }

    console.log('🧠 情绪分析结果:', result)
    return result
  }

  private getSystemPrompt(): string {
    return `你是"心语小屋"的AI情感陪伴助手，专门运用ABC理论帮助用户管理情绪。

ABC理论说明：
- A (Activating Event): 激发事件
- B (Belief): 信念/想法
- C (Consequence): 情绪和行为结果

请以温暖、同理心的方式回复用户，帮助他们分析和理解自己的情绪。使用适当的表情符号如🌸💕✨来表达关怀。

回复应该简洁（150字以内），温暖而专业。`
  }
}

// 导出实例
export const debugEmotionAI = new GitHubModelsDebugClient()

// 错误处理
export function handleAIError(error: unknown): string {
  console.error('🔥 AI 错误详情:', error)
  
  if (error instanceof Error) {
    return `❌ GitHub Models API 错误: ${error.message}`
  }
  
  return '❌ 未知的 GitHub Models API 错误'
}
