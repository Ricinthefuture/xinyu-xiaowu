// 基于GitHub官方文档的GitHub Models API客户端
// 参考: https://github.blog/ai-and-ml/llms/solving-the-inference-problem-for-open-source-ai-projects-with-github-models/

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

class GitHubModelsOfficialClient {
  private apiToken: string
  private chatEndpoint = 'https://models.github.ai/inference/chat/completions' // 官方端点
  private defaultModel = 'gpt-4o-mini' // 默认模型

  constructor() {
    this.apiToken = process.env.GITHUB_TOKEN || ''
    console.log('🔧 GitHub Models官方客户端初始化')
    console.log('🔑 Token状态:', {
      hasToken: !!this.apiToken,
      tokenLength: this.apiToken?.length || 0,
      tokenPrefix: this.apiToken?.substring(0, 20) + '...'
    })
  }

  async processUserMessage(userMessage: string, conversationHistory: ChatMessage[] = []): Promise<string> {
    console.log('🚀 开始GitHub Models API调用（官方方式）...')
    
    const messages: ChatMessage[] = [
      { role: 'system', content: this.getSystemPrompt() },
      ...conversationHistory.slice(-6),
      { role: 'user', content: userMessage }
    ]

    console.log('📝 发送的消息:', {
      model: this.defaultModel,
      messagesCount: messages.length,
      endpoint: this.chatEndpoint
    })

    try {
      // 创建带超时的fetch请求
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 30000) // 30秒超时

      const response = await fetch(this.chatEndpoint, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiToken}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          model: this.defaultModel,
          messages: messages,
          max_tokens: 1000,
          temperature: 0.7
        }),
        signal: controller.signal
      })

      clearTimeout(timeoutId)

      console.log('📊 API响应状态:', response.status)
      console.log('📋 响应头:', Object.fromEntries(response.headers.entries()))

      if (!response.ok) {
        const errorText = await response.text()
        console.error('❌ API请求失败:', {
          status: response.status,
          statusText: response.statusText,
          body: errorText
        })
        throw new Error(`GitHub Models API错误: ${response.status} ${response.statusText}`)
      }

      const data = await response.json()
      console.log('📄 API响应数据:', data)

      if (data.choices && data.choices[0] && data.choices[0].message) {
        const aiResponse = data.choices[0].message.content
        console.log('✅ GitHub Models API调用成功!')
        console.log('📄 AI回复预览:', aiResponse.substring(0, 100) + '...')
        return aiResponse
      } else {
        console.error('❌ 响应格式异常:', data)
        throw new Error('GitHub Models API返回格式异常')
      }

    } catch (error) {
      console.error('🔥 GitHub Models API调用失败:', error)
      console.warn('⚠️ 回退到智能回复系统')
      return this.generateIntelligentResponse(userMessage, conversationHistory)
    }
  }

  async analyzeEmotion(userMessage: string): Promise<EmotionAnalysis> {
    console.log('🧠 开始情绪分析（官方API）...')
    
    const messages: ChatMessage[] = [
      { 
        role: 'system', 
        content: '你是一个专业的情绪分析师，基于ABC理论分析用户的情绪。请以JSON格式返回分析结果，包含event、belief、emotion、intensity字段。'
      },
      { 
        role: 'user', 
        content: `请分析这段话的情绪：${userMessage}` 
      }
    ]

    try {
      const response = await fetch(this.chatEndpoint, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiToken}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          model: this.defaultModel,
          messages: messages,
          max_tokens: 200,
          temperature: 0.3
        })
      })

      if (response.ok) {
        const data = await response.json()
        const analysisText = data.choices[0].message.content
        
        try {
          const analysis = JSON.parse(analysisText)
          console.log('✅ 情绪分析成功:', analysis)
          return analysis
        } catch (parseError) {
          console.warn('⚠️ 情绪分析JSON解析失败，使用默认分析')
        }
      }
    } catch (error) {
      console.error('❌ 情绪分析API调用失败:', error)
    }

    // 回退到简单分析
    return this.getBasicEmotionAnalysis(userMessage)
  }

  private getSystemPrompt(): string {
    return `你是心语小屋的AI情感陪伴助手，专门运用ABC理论帮助用户管理情绪。

ABC理论核心：
- A (Activating Event): 触发事件
- B (Belief): 个人信念和想法
- C (Consequence): 情绪和行为结果

请以温暖、专业的方式回应用户，帮助他们：
1. 识别触发事件(A)
2. 探索内在信念(B)
3. 理解情绪反应(C)
4. 提供积极的应对建议

保持回复简洁(150字内)、温暖且富有同理心。使用适当的emoji增加亲切感。`
  }

  private generateIntelligentResponse(userMessage: string, conversationHistory: ChatMessage[] = []): string {
    const lowerMessage = userMessage.toLowerCase()
    
    // 基于ABC理论的回复模板
    if (lowerMessage.includes('焦虑') || lowerMessage.includes('担心') || lowerMessage.includes('紧张')) {
      return `我能感受到您现在的焦虑情绪 🌸 让我们一起用ABC理论来看看这个情况：

**A (事件)**: 什么事情让您感到焦虑？
**B (信念)**: 您对这件事有什么想法？是否担心会发生不好的结果？
**C (情绪)**: 这些想法带来了焦虑的感受。

记住，我们无法控制事件，但可以调整我们的想法。您愿意和我分享更多细节吗？💕`
    }

    if (lowerMessage.includes('难过') || lowerMessage.includes('伤心') || lowerMessage.includes('悲伤')) {
      return `我听到了您内心的声音，感受到您的难过 💕 悲伤是一种很自然的情绪，让我们用ABC理论来理解：

**A (事件)**: 什么事情让您感到难过？
**B (信念)**: 您对这件事有什么想法？是否觉得失去了什么重要的东西？
**C (情绪)**: 这些想法带来了悲伤的感受。

悲伤有时是我们内心在处理失去和变化的方式。您愿意和我分享更多吗？✨`
    }

    if (lowerMessage.includes('愤怒') || lowerMessage.includes('生气') || lowerMessage.includes('气愤')) {
      return `我理解您现在的愤怒情绪 🌿 愤怒往往是其他情绪的表达，让我们用ABC理论来探索：

**A (事件)**: 什么事情触发了您的愤怒？
**B (信念)**: 您觉得这件事是不公平的吗？或者违背了您的价值观？
**C (情绪)**: 这些想法激发了愤怒的情绪。

愤怒有时是在保护我们认为重要的东西。您能告诉我更多背景吗？🌱`
    }

    // 默认回复
    return `我能感受到您想要表达的情感 🌸 虽然每个人的经历都不同，但情绪的感受是相通的。

让我们用ABC理论来看看您的情况：
- **A (事件)**: 发生了什么让您有这样的感受？
- **B (信念)**: 您对这件事有什么想法？
- **C (情绪)**: 这些想法如何影响了您的情绪？

我会陪伴您一起探索和理解。请和我分享更多吧 💕`
  }

  private getBasicEmotionAnalysis(userMessage: string): EmotionAnalysis {
    const lowerMessage = userMessage.toLowerCase()
    
    if (lowerMessage.includes('焦虑') || lowerMessage.includes('担心')) {
      return {
        event: userMessage,
        belief: "可能存在对未来不确定性的担忧",
        emotion: "焦虑",
        intensity: 6
      }
    }
    
    if (lowerMessage.includes('难过') || lowerMessage.includes('伤心')) {
      return {
        event: userMessage,
        belief: "可能经历了失去或挫折",
        emotion: "悲伤",
        intensity: 5
      }
    }
    
    if (lowerMessage.includes('愤怒') || lowerMessage.includes('生气')) {
      return {
        event: userMessage,
        belief: "可能感到不公平或被侵犯",
        emotion: "愤怒",
        intensity: 7
      }
    }
    
    return {
      event: userMessage,
      belief: "可能存在一些需要进一步探索的内在信念模式",
      emotion: "混合情绪",
      intensity: 5
    }
  }

  // 检查权限的方法
  async checkPermissions(): Promise<{ hasAccess: boolean, error?: string }> {
    try {
      console.log('🔍 检查GitHub Models权限...')
      
      const testResponse = await fetch(this.chatEndpoint, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiToken}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          model: this.defaultModel,
          messages: [{ role: 'user', content: 'test' }],
          max_tokens: 1
        })
      })

      console.log('📊 权限检查响应:', testResponse.status)

      if (testResponse.ok || testResponse.status === 400) {
        return { hasAccess: true }
      } else if (testResponse.status === 401 || testResponse.status === 403) {
        const errorData = await testResponse.json().catch(() => ({ error: { message: 'Permission denied' } }))
        return {
          hasAccess: false,
          error: errorData.error?.message || `需要models:read权限`
        }
      } else {
        return {
          hasAccess: false,
          error: `HTTP ${testResponse.status}`
        }
      }
    } catch (error) {
      return {
        hasAccess: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      }
    }
  }
}

export const githubModelsOfficialAI = new GitHubModelsOfficialClient()

export function handleAIError(error: unknown): string {
  console.error('🔥 GitHub Models AI错误:', error)

  if (error instanceof Error) {
    if (error.message.includes('权限不足') || error.message.includes('models:read')) {
      return `GitHub Token需要models:read权限。请确保您的Personal Access Token具有"models:read"权限。详情请参考：https://github.blog/ai-and-ml/llms/solving-the-inference-problem-for-open-source-ai-projects-with-github-models/`
    }
    if (error.message.includes('认证失败')) {
      return `GitHub Token认证失败，请检查Token是否有效且具有models:read权限。`
    }
  }

  return '抱歉，GitHub Models API暂时不可用。请稍后再试或联系技术支持。'
}
