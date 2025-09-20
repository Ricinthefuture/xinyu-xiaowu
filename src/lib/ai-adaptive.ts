// 自适应AI客户端 - 专业工程师解决方案
// 优先使用GitHub Models，失败时智能回退

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

class AdaptiveAIClient {
  private apiToken: string
  private chatEndpoint = 'https://models.github.ai/inference/chat/completions'
  private availableModels = [
    'gpt-4o-mini',
    'gpt-4o', 
    'gpt-3.5-turbo'
  ]
  private workingModel: string | null = null

  constructor() {
    this.apiToken = process.env.GITHUB_TOKEN || ''
    console.log('🔧 自适应AI客户端初始化')
    console.log('🔑 Token状态:', {
      hasToken: !!this.apiToken,
      tokenLength: this.apiToken?.length || 0
    })
  }

  async processUserMessage(userMessage: string, conversationHistory: ChatMessage[] = []): Promise<string> {
    console.log('🚀 开始自适应AI处理...')
    
    const messages: ChatMessage[] = [
      { role: 'system', content: this.getSystemPrompt() },
      ...conversationHistory.slice(-6),
      { role: 'user', content: userMessage }
    ]

    // 1. 尝试GitHub Models
    const githubResponse = await this.tryGitHubModels(messages)
    if (githubResponse) {
      console.log('✅ 使用GitHub Models成功')
      return githubResponse
    }

    // 2. 回退到智能回复
    console.log('⚠️ GitHub Models不可用，使用智能回复系统')
    return this.generateIntelligentResponse(userMessage, conversationHistory)
  }

  private async tryGitHubModels(messages: ChatMessage[]): Promise<string | null> {
    if (!this.apiToken) {
      console.log('❌ 无GitHub Token')
      return null
    }

    // 快速权限检查 - 如果之前检测到无权限，直接跳过
    if (this.workingModel === 'NO_ACCESS') {
      console.log('⚠️ 之前检测到无GitHub Models访问权限，跳过API调用')
      return null
    }

    // 如果已知工作模型，直接使用
    if (this.workingModel) {
      const result = await this.callGitHubAPI(this.workingModel, messages)
      if (result) return result
      // 如果之前工作的模型现在失败了，清除缓存
      this.workingModel = null
    }

    // 尝试所有可用模型
    let hasPermissionError = false
    for (const model of this.availableModels) {
      console.log(`🤖 尝试模型: ${model}`)
      const result = await this.callGitHubAPI(model, messages)
      if (result) {
        this.workingModel = model // 缓存工作的模型
        console.log(`✅ 找到工作模型: ${model}`)
        return result
      }
      
      // 检查是否是权限问题
      if (result === 'NO_ACCESS') {
        hasPermissionError = true
      }
    }

    // 如果所有模型都是权限问题，标记为无访问权限
    if (hasPermissionError) {
      this.workingModel = 'NO_ACCESS'
      console.log('❌ GitHub账户无Models访问权限')
    } else {
      console.log('❌ 所有GitHub Models都失败')
    }
    
    return null
  }

  private async callGitHubAPI(model: string, messages: ChatMessage[]): Promise<string | null | 'NO_ACCESS'> {
    try {
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 10000) // 10秒超时

      const response = await fetch(this.chatEndpoint, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiToken}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          model: model,
          messages: messages,
          max_tokens: 500,
          temperature: 0.7
        }),
        signal: controller.signal
      })

      clearTimeout(timeoutId)

      if (!response.ok) {
        const errorText = await response.text()
        console.log(`❌ 模型 ${model} 失败: ${response.status}`)
        
        // 检查是否是权限问题
        if (response.status === 403 || errorText.includes('no_access') || errorText.includes('No access')) {
          console.log(`🚫 模型 ${model} 无访问权限`)
          return 'NO_ACCESS'
        }
        
        return null
      }

      const data = await response.json()
      if (data.choices && data.choices[0] && data.choices[0].message) {
        const content = data.choices[0].message.content
        console.log(`✅ 模型 ${model} 成功，回复长度: ${content.length}`)
        return content
      }

      console.log(`❌ 模型 ${model} 响应格式异常`)
      return null

    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
        console.log(`⏰ 模型 ${model} 超时`)
      } else {
        console.log(`❌ 模型 ${model} 异常:`, error instanceof Error ? error.message : String(error))
      }
      return null
    }
  }

  async analyzeEmotion(userMessage: string): Promise<EmotionAnalysis> {
    // 先尝试GitHub Models进行情绪分析
    const analysisPrompt = `请分析这段话的情绪，用JSON格式返回：{"event":"事件","belief":"信念","emotion":"情绪","intensity":1-10}
    
用户消息：${userMessage}`

    const analysisResult = await this.tryGitHubModels([
      { role: 'system', content: '你是情绪分析专家，基于ABC理论分析情绪。' },
      { role: 'user', content: analysisPrompt }
    ])

    if (analysisResult) {
      try {
        const parsed = JSON.parse(analysisResult)
        if (parsed.event && parsed.belief && parsed.emotion && parsed.intensity) {
          return parsed
        }
      } catch (e) {
        console.log('⚠️ GitHub Models情绪分析JSON解析失败')
      }
    }

    // 回退到基础分析
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
    
    // 分析对话历史，提供更个性化的回复
    const historyContext = conversationHistory.length > 0 ? 
      `我记得我们之前聊过的内容，` : '很高兴与您开始这次对话，'
    
    // 基于ABC理论的智能回复模板
    if (lowerMessage.includes('焦虑') || lowerMessage.includes('担心') || lowerMessage.includes('紧张') || lowerMessage.includes('害怕')) {
      return `${historyContext}我能感受到您现在的焦虑情绪 🌸 

让我们用ABC理论来理解这种感受：

**A (激发事件)**: 是什么具体的情况让您感到焦虑？
**B (信念系统)**: 您内心可能在想"如果...就糟了"？
**C (情绪后果)**: 这些想法自然地带来了焦虑感

焦虑其实是我们内心的保护机制，提醒我们关注重要的事情。深呼吸一下，您愿意和我详细分享吗？💕`
    }
    
    if (lowerMessage.includes('难过') || lowerMessage.includes('伤心') || lowerMessage.includes('悲伤') || lowerMessage.includes('失落')) {
      return `${historyContext}我深深感受到了您的难过 💙 

悲伤是一种珍贵而必要的情绪，让我们用ABC理论来理解：

**A (激发事件)**: 发生了什么让您心情沉重？
**B (信念系统)**: 您可能觉得失去了什么珍贵的东西？
**C (情绪后果)**: 这种失去感带来了深深的悲伤

悲伤帮助我们处理生命中的失去和变化，这是成长的一部分。请慢慢和我分享，不着急 🌱✨`
    }
    
    if (lowerMessage.includes('愤怒') || lowerMessage.includes('生气') || lowerMessage.includes('气愤') || lowerMessage.includes('愤慨')) {
      return `${historyContext}我理解您的愤怒情绪 🌿 

愤怒往往在保护我们珍视的价值，让我们用ABC理论来探索：

**A (激发事件)**: 什么事情触发了您的愤怒？
**B (信念系统)**: 您感觉自己的原则或界限被违犯了吗？
**C (情绪后果)**: 这种不公平感激发了愤怒

愤怒告诉我们什么对我们真正重要。在这种情绪中，您想要保护什么？🌱`
    }

    if (lowerMessage.includes('开心') || lowerMessage.includes('高兴') || lowerMessage.includes('快乐') || lowerMessage.includes('兴奋')) {
      return `${historyContext}感受到您的快乐真是太好了！🌟

让我们用ABC理论来理解这份美好：

**A (激发事件)**: 什么美好的事情发生了？
**B (信念系统)**: 您对这件事有什么积极的想法？
**C (情绪后果)**: 这些想法带来了愉悦的感受

快乐是我们内心力量的体现。请和我分享这份美好，让我也感受您的喜悦！✨💕`
    }

    if (lowerMessage.includes('累') || lowerMessage.includes('疲惫') || lowerMessage.includes('压力') || lowerMessage.includes('忙')) {
      return `${historyContext}我感受到您的疲惫 🌙

让我们用ABC理论来理解这种状态：

**A (激发事件)**: 最近有什么事情让您感到特别累？
**B (信念系统)**: 您是否觉得必须承担很多责任？
**C (情绪后果)**: 这种压力感带来了身心的疲惫

疲惫是身心在提醒我们需要休息和照顾自己。您最近有给自己一些温柔的时光吗？💕🌸`
    }
    
    // 默认温暖回复
    const messagePreview = userMessage.length > 15 ? userMessage.substring(0, 15) + '...' : userMessage
    return `${historyContext}谢谢您与我分享内心的声音 🌸

我听到您说"${messagePreview}"，每个人的感受都是独特而珍贵的。

让我们用ABC理论来一起理解：
- **A (激发事件)**: 具体发生了什么？
- **B (信念想法)**: 您内心对此有什么想法？
- **C (情绪体验)**: 这些想法如何影响了您的感受？

我会用心倾听，陪伴您探索内心的世界。请慢慢和我分享 💕✨`
  }

  private getBasicEmotionAnalysis(userMessage: string): EmotionAnalysis {
    const lowerMessage = userMessage.toLowerCase()
    
    if (lowerMessage.includes('焦虑') || lowerMessage.includes('担心')) {
      return {
        event: userMessage,
        belief: "担心未来的不确定性",
        emotion: "焦虑",
        intensity: 6
      }
    }
    
    if (lowerMessage.includes('难过') || lowerMessage.includes('伤心')) {
      return {
        event: userMessage,
        belief: "感到失落或失去",
        emotion: "悲伤", 
        intensity: 5
      }
    }
    
    if (lowerMessage.includes('愤怒') || lowerMessage.includes('生气')) {
      return {
        event: userMessage,
        belief: "感到不公平或被侵犯",
        emotion: "愤怒",
        intensity: 7
      }
    }
    
    return {
      event: userMessage,
      belief: "正在探索内心想法",
      emotion: "平静",
      intensity: 4
    }
  }

  // 诊断方法
  async diagnose(): Promise<any> {
    const results = {
      hasToken: !!this.apiToken,
      tokenLength: this.apiToken?.length || 0,
      models: {} as Record<string, boolean>
    }

    for (const model of this.availableModels) {
      const testResult = await this.callGitHubAPI(model, [
        { role: 'user', content: 'test' }
      ])
      results.models[model] = !!testResult
    }

    return results
  }
}

export const adaptiveAI = new AdaptiveAIClient()

export function handleAIError(error: unknown): string {
  console.error('自适应AI错误:', error)
  return '抱歉，AI服务遇到问题，但我们会继续为您提供支持。'
}
