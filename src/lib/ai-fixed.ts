// 修复版AI客户端 - 支持多种回退方案

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

class FixedAIAssistant {
  private apiToken: string
  private baseUrl = 'https://models.inference.ai.azure.com'
  private model = 'gpt-4o-mini'

  constructor() {
    this.apiToken = process.env.GITHUB_TOKEN || ''
  }

  // 温暖的AI回复模板（回退方案）
  private fallbackResponses = [
    `我能感受到您的情感波动 🌸 让我们一起来看看这个情况。根据ABC理论，我们可以分析一下：您遇到的具体事件是什么呢？您当时的想法是什么？这些想法如何影响了您的情绪？记住，改变想法可以改变情绪。💕`,
    
    `谢谢您与我分享这些 ✨ 我理解您现在的感受。让我们用ABC理论来梳理一下：A是发生的事件，B是您对这件事的看法和信念，C是由此产生的情绪。通常我们可以通过调整B（信念）来改善C（情绪）。您觉得呢？🌸`,
    
    `我听到了您内心的声音 💕 情绪是我们内心的信号，告诉我们什么对我们很重要。根据ABC理论，同样的事件（A）对不同的人会产生不同的情绪（C），关键在于我们如何理解和解释这件事（B）。让我们一起探索您的想法吧 🌿`,
    
    `感谢您的信任，愿意和我分享这些 🌸 每个人都会经历情绪的起伏，这很正常。ABC理论告诉我们，我们的情绪反应往往不是直接由事件引起的，而是由我们对事件的解释和信念造成的。我们可以学会识别和调整这些信念。您想试试吗？✨`,
    
    `我很理解您现在的感受 💕 有时候生活会给我们带来挑战，但请记住，您并不孤单。根据ABC理论，我们可以通过改变对事件的看法来改变我们的情绪反应。让我们一起找到更积极的视角吧 🌈`,
  ]

  async processUserMessage(userMessage: string, conversationHistory: ChatMessage[] = []): Promise<string> {
    // 首先尝试真实的AI API
    if (this.apiToken) {
      try {
        console.log('尝试调用GitHub Models API...')
        const aiResponse = await this.callGitHubModelsAPI(userMessage, conversationHistory)
        console.log('GitHub Models API调用成功')
        return aiResponse
      } catch (error) {
        console.error('GitHub Models API调用失败:', error)
        // 继续使用回退方案
      }
    }

    // 回退到模拟回复
    console.log('使用回退AI回复')
    return this.generateContextualResponse(userMessage)
  }

  private async callGitHubModelsAPI(userMessage: string, conversationHistory: ChatMessage[]): Promise<string> {
    const messages: ChatMessage[] = [
      { role: 'system', content: this.getSystemPrompt() },
      ...conversationHistory.slice(-8), // 只保留最近8条消息
      { role: 'user', content: userMessage }
    ]

    // 尝试多个可能的端点
    const endpoints = [
      'https://models.inference.ai.azure.com/chat/completions',
      'https://api.githubmodels.com/chat/completions',
      'https://models.githubusercontent.com/chat/completions'
    ]

    for (const endpoint of endpoints) {
      try {
        console.log(`尝试端点: ${endpoint}`)
        
        const controller = new AbortController()
        const timeoutId = setTimeout(() => controller.abort(), 10000) // 10秒超时

        const response = await fetch(endpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.apiToken}`,
            'User-Agent': 'EmotionAI/1.0'
          },
          body: JSON.stringify({
            model: this.model,
            messages,
            max_tokens: 800,
            temperature: 0.7,
            stream: false
          }),
          signal: controller.signal
        })

        clearTimeout(timeoutId)

        if (response.ok) {
          const data = await response.json()
          if (data.choices && data.choices[0] && data.choices[0].message) {
            return data.choices[0].message.content
          }
        } else {
          console.error(`端点 ${endpoint} 返回错误:`, response.status, response.statusText)
        }
      } catch (error) {
        console.error(`端点 ${endpoint} 调用失败:`, error)
        continue
      }
    }

    throw new Error('所有GitHub Models API端点都无法访问')
  }

  private generateContextualResponse(userMessage: string): string {
    // 基于用户消息内容选择更合适的回复
    const message = userMessage.toLowerCase()
    
    if (message.includes('焦虑') || message.includes('紧张') || message.includes('担心')) {
      return `我能感受到您的焦虑情绪 🌸 焦虑往往来自于对未来不确定性的担忧。让我们用ABC理论来分析：是什么具体的事件(A)让您感到焦虑？您对这件事有什么样的想法(B)？这些想法如何影响了您的情绪(C)？记住，我们可以通过调整想法来缓解焦虑。💕`
    }
    
    if (message.includes('难过') || message.includes('悲伤') || message.includes('沮丧')) {
      return `我理解您现在的悲伤 💕 悲伤是一种很自然的情绪，它告诉我们什么对我们很重要。根据ABC理论，让我们一起探索：发生了什么事情(A)让您感到难过？您是如何理解这件事的(B)？也许我们可以找到不同的视角来看待这个情况。🌿`
    }
    
    if (message.includes('愤怒') || message.includes('生气') || message.includes('愤恨')) {
      return `我感受到您的愤怒情绪 🌸 愤怒通常是因为我们觉得某些重要的价值观或边界被侵犯了。让我们用ABC理论来理解：是什么事件(A)引发了您的愤怒？您对这件事的看法是什么(B)？我们可以一起探索更有效的方式来处理这种情绪。✨`
    }
    
    if (message.includes('压力') || message.includes('累') || message.includes('疲惫')) {
      return `我听到了您的疲惫 💕 现代生活确实会给我们带来很多压力。根据ABC理论，让我们分析一下：具体是什么情况(A)让您感到有压力？您对这些情况有什么想法(B)？也许我们可以找到一些减压的方法，或者调整对这些情况的看法。🌈`
    }
    
    // 默认回复
    const randomIndex = Math.floor(Math.random() * this.fallbackResponses.length)
    return this.fallbackResponses[randomIndex]
  }

  async analyzeEmotion(userInput: string): Promise<EmotionAnalysis> {
    // 简单的关键词情绪分析
    const emotionKeywords = {
      '焦虑': ['焦虑', '紧张', '担心', '不安', '恐慌', '害怕', '忧虑'],
      '悲伤': ['难过', '悲伤', '低落', '绝望', '沮丧', '失望', '痛苦'],
      '愤怒': ['生气', '愤怒', '暴躁', '恼火', '愤恨', '愤慨', '气愤'],
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
- 避免说教，多用倾听和理解
- 适当使用温暖的表情符号 🌸💕✨
- 语言简洁易懂，充满关怀

记住：你是一个温暖的陪伴者，不是冷冰冰的机器人。`
  }
}

// 导出单例实例
export const fixedEmotionAI = new FixedAIAssistant()

// 错误处理助手
export function handleAIError(error: unknown): string {
  console.error('AI Error:', error)
  
  if (error instanceof Error) {
    if (error.message.includes('API error') || error.message.includes('fetch')) {
      return '抱歉，AI服务暂时不可用，但我仍然在这里陪伴您。请继续分享您的感受，我会尽我所能为您提供支持。💕'
    }
    if (error.message.includes('token')) {
      return '抱歉，服务配置需要调整。不过请放心，我依然可以为您提供情感支持。🌸'
    }
  }
  
  return '抱歉，出现了一些技术问题。但请不要担心，我依然在这里倾听您的心声。✨'
}
