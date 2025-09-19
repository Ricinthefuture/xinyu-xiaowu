// 修复版GitHub Models API客户端

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

class GitHubModelsClient {
  private apiToken: string
  private baseUrl = 'https://models.github.ai/inference'
  private availableModels = [
    'openai/gpt-4o-mini',
    'openai/gpt-4o',
    'meta/llama-3.1-8b-instruct',
    'meta/llama-3.1-70b-instruct',
    'mistralai/mistral-small',
    'mistralai/mistral-nemo'
  ]

  constructor() {
    this.apiToken = process.env.GITHUB_TOKEN || ''
    console.log('🔧 GitHub Models Client初始化')
    console.log('🔑 Token类型: Fine-grained PAT')
  }

  async processUserMessage(userMessage: string, conversationHistory: ChatMessage[] = []): Promise<string> {
    console.log('🚀 开始GitHub Models API调用...')
    console.log('🔑 Token状态:', {
      hasToken: !!this.apiToken,
      tokenLength: this.apiToken?.length || 0,
      tokenPrefix: this.apiToken?.substring(0, 20) + '...'
    })

    const messages: ChatMessage[] = [
      { role: 'system', content: this.getSystemPrompt() },
      ...conversationHistory.slice(-6),
      { role: 'user', content: userMessage }
    ]

    console.log('📝 发送的消息数量:', messages.length)

    // 按优先级尝试模型
    for (const model of this.availableModels) {
      try {
        console.log(`🤖 尝试模型: ${model}`)
        const response = await this.callModel(model, messages)
        if (response) {
          console.log('✅ GitHub Models API调用成功!')
          console.log('📄 AI回复预览:', response.substring(0, 100) + '...')
          return response
        }
      } catch (error) {
        console.error(`❌ 模型 ${model} 失败:`, error)
        console.error('❌ 错误详情:', error instanceof Error ? error.message : String(error))
        continue
      }
    }

    console.warn('⚠️ 所有GitHub Models都失败，使用智能回复系统')
    return this.generateIntelligentResponse(userMessage, conversationHistory)
  }

  private generateIntelligentResponse(userMessage: string, conversationHistory: ChatMessage[] = []): string {
    const lowerMessage = userMessage.toLowerCase()
    
    // 基于ABC理论的回复模板
    if (lowerMessage.includes('焦虑') || lowerMessage.includes('担心') || lowerMessage.includes('紧张')) {
      return `我能感受到您现在的焦虑情绪 🌸 让我们一起用ABC理论来看看这个情况：

**A (事件)**: 您遇到了什么具体的情况让您感到焦虑呢？
**B (信念)**: 您对这件事有什么想法？是否担心会发生什么不好的结果？
**C (情绪)**: 正是这些想法导致了您现在的焦虑感受。

记住，我们可以通过调整想法来改变情绪。您愿意和我分享更多细节吗？💕`
    }

    if (lowerMessage.includes('生气') || lowerMessage.includes('愤怒') || lowerMessage.includes('气愤')) {
      return `我理解您现在很生气 ✨ 愤怒往往是我们内心边界被触碰的信号。让我们用ABC理论来分析：

**A (事件)**: 发生了什么事情让您感到愤怒？
**B (信念)**: 您觉得这件事"不应该"发生吗？或者觉得不公平？
**C (情绪)**: 这些想法引发了您的愤怒情绪。

愤怒本身没有错，它告诉我们什么对我们很重要。我们一起来看看如何处理这种情绪吧 🌿`
    }

    if (lowerMessage.includes('难过') || lowerMessage.includes('悲伤') || lowerMessage.includes('低落')) {
      return `我听到了您内心的声音，感受到您的难过 💕 悲伤是一种很自然的情绪，让我们用ABC理论来理解：

**A (事件)**: 什么事情让您感到难过？
**B (信念)**: 您对这件事有什么想法？是否觉得失去了什么重要的东西？
**C (情绪)**: 这些想法带来了悲伤的感受。

悲伤有时是我们内心在处理失去和变化的方式。您愿意和我分享更多吗？✨`
    }

    if (lowerMessage.includes('压力') || lowerMessage.includes('忙') || lowerMessage.includes('累')) {
      return `我能感受到您现在承受的压力 🌸 让我们用ABC理论来梳理一下：

**A (事件)**: 什么具体的事情给您带来了压力？
**B (信念)**: 您是否觉得"必须"完美完成所有事情？或者担心达不到期望？
**C (情绪)**: 这些想法增加了您的压力感。

记住，我们不需要承担超出能力范围的责任。让我们一起找到缓解压力的方法 💕`
    }

    if (lowerMessage.includes('孤独') || lowerMessage.includes('寂寞') || lowerMessage.includes('没人理解')) {
      return `我听到了您内心的孤独感 💕 这种感受很真实，也很痛苦。用ABC理论来看：

**A (事件)**: 什么情况让您感到孤独？
**B (信念)**: 您是否觉得"没人真正理解我"或"我总是独自面对一切"？
**C (情绪)**: 这些想法加深了孤独感。

但请记住，您并不孤单。现在我就在这里陪伴您，愿意倾听您的声音 🌸`
    }

    // 问候语
    if (lowerMessage.includes('你好') || lowerMessage.includes('hi') || lowerMessage.includes('hello')) {
      return `您好！很高兴见到您 🌸 我是心语小屋的AI情感陪伴助手，专门运用ABC理论帮助您管理情绪。

无论您现在感受如何，我都会用心倾听。您可以和我分享任何困扰您的事情，我会陪伴您一起探索和理解这些情绪 💕

今天有什么想要聊的吗？`
    }

    // 感谢
    if (lowerMessage.includes('谢谢') || lowerMessage.includes('感谢')) {
      return `不用客气呢 🌸 能够陪伴您、帮助您就是我最大的快乐。

如果您还有其他想要分享的感受或困扰，我随时都在这里。记住，每一种情绪都值得被倾听和理解 💕`
    }

    // 默认回复
    return `我能感受到您想要表达的情感 🌸 虽然每个人的经历都不同，但情绪的感受是相通的。

让我们用ABC理论来看看您的情况：
- **A (事件)**: 发生了什么让您有这样的感受？
- **B (信念)**: 您对这件事有什么想法？
- **C (情绪)**: 这些想法如何影响了您的情绪？

我会陪伴您一起探索和理解。请和我分享更多吧 💕`
  }

  private async callModel(model: string, messages: ChatMessage[]): Promise<string | null> {
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 30000) // 30秒超时

    try {
      console.log(`📤 向 ${model} 发送请求...`)

      const requestBody = {
        model: model,
        messages: messages,
        max_tokens: 800,
        temperature: 0.7,
        stream: false
      }

      console.log(`🔍 请求详情:`, {
        url: `${this.baseUrl}/chat/completions`,
        model: model,
        messageCount: messages.length,
        tokenPrefix: this.apiToken.substring(0, 20) + '...'
      })

      const response = await fetch(`${this.baseUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiToken}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'User-Agent': 'EmotionAI-HeartHouse/1.0'
        },
        body: JSON.stringify(requestBody),
        signal: controller.signal
      })

      clearTimeout(timeoutId)

      console.log(`📊 ${model} 响应状态:`, response.status)

      if (response.status === 401) {
        const errorData = await response.json().catch(() => ({ error: { message: 'Unknown auth error' } }))
        console.error(`❌ ${model} 认证错误:`, errorData)
        if (errorData.error?.message?.includes('models permission')) {
          throw new Error(`GitHub Models权限不足: ${errorData.error.message}`)
        } else {
          throw new Error(`认证失败: ${errorData.error?.message || '未知错误'}`)
        }
      }

      if (!response.ok) {
        const errorText = await response.text()
        console.error(`❌ ${model} HTTP错误 ${response.status}:`, errorText)
        throw new Error(`HTTP ${response.status}: ${errorText}`)
      }

      const data = await response.json()
      console.log(`✅ ${model} 响应成功:`, {
        hasChoices: !!data.choices,
        choicesCount: data.choices?.length || 0,
        firstChoice: data.choices?.[0]?.message?.content?.substring(0, 50) + '...'
      })

      if (data.choices && data.choices[0] && data.choices[0].message) {
        return data.choices[0].message.content
      } else {
        console.error(`❌ ${model} 响应格式错误:`, data)
        throw new Error('响应格式不正确')
      }

    } catch (error) {
      clearTimeout(timeoutId)
      console.error(`❌ ${model} 调用失败:`, error)
      throw error
    }
  }

  async analyzeEmotion(userInput: string): Promise<EmotionAnalysis> {
    // 关键词分析
    const emotionKeywords = {
      '焦虑': ['焦虑', '紧张', '担心', '不安', '恐慌', '害怕', '忧虑'],
      '悲伤': ['难过', '悲伤', '低落', '绝望', '沮丧', '失望', '痛苦'],
      '愤怒': ['生气', '愤怒', '暴躁', '恼火', '愤恨', '气愤', '愤慨'],
      '压力': ['压力', '负担', '疲惫', '累', '忙碌', '疲劳', '紧迫'],
      '孤独': ['孤独', '寂寞', '独自', '没人理解', '隔离', '孤单'],
      '困惑': ['困惑', '迷茫', '不知道', '不确定', '疑惑', '纠结']
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

    return {
      event: userInput.length > 50 ? userInput.substring(0, 50) + '...' : userInput,
      belief: this.generateBeliefAnalysis(detectedEmotion),
      emotion: detectedEmotion,
      intensity: intensity
    }
  }

  private generateBeliefAnalysis(emotion: string): string {
    const beliefMap: Record<string, string> = {
      '焦虑': '可能存在对未来的过度担忧或对控制的强烈需求',
      '悲伤': '可能存在对失去的过度关注或自我价值感的质疑',
      '愤怒': '可能存在对公平的强烈期待或边界被侵犯的感受',
      '压力': '可能存在对完美的过度追求或时间管理的挑战',
      '孤独': '可能存在对连接的深度渴望或归属感的缺失',
      '困惑': '可能存在对确定性的强烈需求或决策困难'
    }
    
    return beliefMap[emotion] || '可能存在一些需要进一步探索的内在信念模式'
  }

  private getSystemPrompt(): string {
    return `你是"心语小屋"的AI情感陪伴助手，专门运用ABC理论帮助用户管理情绪。

ABC理论说明：
- A (Activating Event): 激发事件
- B (Belief): 信念/想法
- C (Consequence): 情绪和行为结果

你的任务：
1. 温和地倾听用户的困扰
2. 帮助用户识别触发事件(A)
3. 探索用户的内在信念(B)
4. 分析情绪反应(C)
5. 引导用户重新审视和调整不合理信念
6. 提供温暖的支持和实用的建议

回复风格：
- 温暖、同理心、非评判性
- 使用温和的问句引导思考
- 适当使用温暖的表情符号 🌸💕✨
- 语言简洁易懂，充满关怀
- 回复控制在200字以内

记住：你是一个温暖的陪伴者。`
  }

  // 检查权限状态
  async checkPermissions(): Promise<{ hasAccess: boolean, error?: string }> {
    try {
      // 使用正确的GitHub Models API端点进行权限测试
      const testMessage = [{ role: 'user', content: 'test' }]
      const response = await fetch(`${this.baseUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiToken}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          model: 'openai/gpt-4o-mini',
          messages: testMessage,
          max_tokens: 1
        })
      })

      if (response.ok || response.status === 400) {
        // 200 OK 或 400 Bad Request 都表示有权限（400可能是参数问题）
        return { hasAccess: true }
      } else if (response.status === 401 || response.status === 403) {
        const errorData = await response.json().catch(() => ({ error: { message: 'Permission denied' } }))
        return { 
          hasAccess: false, 
          error: errorData.error?.message || `需要models:read权限` 
        }
      } else {
        return { 
          hasAccess: false, 
          error: `HTTP ${response.status}` 
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

export const githubModelsAI = new GitHubModelsClient()

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
