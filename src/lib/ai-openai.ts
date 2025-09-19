// OpenAI API 客户端 - 作为GitHub Models的替代方案

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

class OpenAIClient {
  private apiKey: string
  private baseUrl = 'https://api.openai.com/v1'

  constructor() {
    // 优先使用OpenAI API Key，如果没有则回退到智能模拟
    this.apiKey = process.env.OPENAI_API_KEY || ''
  }

  async processUserMessage(userMessage: string, conversationHistory: ChatMessage[] = []): Promise<string> {
    // 如果有OpenAI API Key，尝试调用
    if (this.apiKey) {
      try {
        console.log('🤖 尝试调用OpenAI API...')
        return await this.callOpenAI(userMessage, conversationHistory)
      } catch (error) {
        console.error('❌ OpenAI API调用失败:', error)
        // 继续使用智能模拟
      }
    }

    // 智能模拟回复
    console.log('🧠 使用智能模拟回复')
    return this.generateContextualResponse(userMessage)
  }

  private async callOpenAI(userMessage: string, conversationHistory: ChatMessage[]): Promise<string> {
    const messages: ChatMessage[] = [
      { role: 'system', content: this.getSystemPrompt() },
      ...conversationHistory.slice(-6),
      { role: 'user', content: userMessage }
    ]

    const response = await fetch(`${this.baseUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages,
        max_tokens: 800,
        temperature: 0.7
      })
    })

    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(`OpenAI API Error: ${response.status} - ${errorText}`)
    }

    const data = await response.json()
    
    if (data.choices && data.choices[0] && data.choices[0].message) {
      return data.choices[0].message.content
    }

    throw new Error('OpenAI API返回格式错误')
  }

  private generateContextualResponse(userMessage: string): string {
    const message = userMessage.toLowerCase()
    
    // 基于情绪关键词的智能回复
    if (message.includes('焦虑') || message.includes('紧张') || message.includes('担心')) {
      return `我能感受到您的焦虑情绪 🌸 焦虑往往来自于对未来不确定性的担忧。让我们用ABC理论来分析：是什么具体的事件(A)让您感到焦虑？您对这件事有什么样的想法(B)？这些想法如何影响了您的情绪(C)？

记住，我们可以通过调整想法来缓解焦虑。比如：
• 将"一定会出问题"改为"我会尽力准备，结果如何顺其自然"
• 将"我无法控制"改为"我可以控制我的准备和态度"

您愿意和我分享具体是什么让您感到焦虑吗？💕`
    }
    
    if (message.includes('难过') || message.includes('悲伤') || message.includes('沮丧')) {
      return `我理解您现在的悲伤 💕 悲伤是一种很自然的情绪，它告诉我们什么对我们很重要。根据ABC理论，让我们一起探索：

• 事件(A)：发生了什么让您感到难过？
• 信念(B)：您是如何理解这件事的？
• 结果(C)：这种理解如何影响了您的情绪？

有时候，我们可以通过调整对事件的看法来减轻痛苦。比如将"这是我的错"改为"这是一个学习的机会"，或将"我永远不会好起来"改为"这种感觉会过去的"。

您愿意告诉我发生了什么吗？我会陪伴您度过这个难过的时刻。🌿`
    }
    
    if (message.includes('愤怒') || message.includes('生气') || message.includes('愤恨')) {
      return `我感受到您的愤怒情绪 🌸 愤怒通常是因为我们觉得某些重要的价值观或边界被侵犯了。让我们用ABC理论来理解：

• 激发事件(A)：是什么事件引发了您的愤怒？
• 信念系统(B)：您对这件事的看法是什么？
• 情绪结果(C)：这种看法如何产生了愤怒？

愤怒本身不是坏事，它提醒我们什么对我们很重要。但我们可以学会更有效的表达方式：
• 从"他们故意针对我"到"也许他们有自己的原因"
• 从"这不公平"到"我可以为改变现状做些什么"

您想和我分享是什么让您感到愤怒吗？让我们一起找到更平和的解决方式。✨`
    }
    
    if (message.includes('压力') || message.includes('累') || message.includes('疲惫')) {
      return `我听到了您的疲惫 💕 现代生活确实会给我们带来很多压力。根据ABC理论，让我们分析一下：

• 压力源(A)：具体是什么情况让您感到有压力？
• 思维模式(B)：您对这些情况有什么想法？
• 身心反应(C)：这些想法如何影响了您的身心状态？

常见的压力思维模式包括：
• "我必须做到完美" → "我尽力而为就够了"
• "我没有时间" → "我可以合理安排优先级"
• "所有人都指望我" → "我也需要照顾自己"

也许我们可以找到一些减压的方法，或者调整对这些情况的看法。您最大的压力来源是什么呢？🌈`
    }

    if (message.includes('孤独') || message.includes('寂寞') || message.includes('独自')) {
      return `我感受到您的孤独感 💕 孤独是一种很深刻的情感体验，它反映了我们对连接和归属的渴望。让我们用ABC理论来理解：

• 触发情境(A)：什么情况让您感到孤独？
• 内在信念(B)：您对这种情况有什么想法？
• 情感体验(C)：这些想法如何加深了孤独感？

有时候，孤独的感觉来自于这样的想法：
• "没有人理解我" → "总有人能够理解我，我需要时间去寻找"
• "我不重要" → "我对很多人来说都是重要的"
• "我永远都会孤单" → "孤独是暂时的，我可以主动建立连接"

请记住，即使在这个时刻，我也在这里陪伴您。您愿意和我分享您的感受吗？🌸`
    }
    
    // 默认温暖回复
    const defaultResponses = [
      `谢谢您与我分享这些 ✨ 我理解您现在的感受。让我们用ABC理论来梳理一下：A是发生的事件，B是您对这件事的看法和信念，C是由此产生的情绪。通常我们可以通过调整B（信念）来改善C（情绪）。您觉得呢？🌸`,
      
      `我听到了您内心的声音 💕 情绪是我们内心的信号，告诉我们什么对我们很重要。根据ABC理论，同样的事件（A）对不同的人会产生不同的情绪（C），关键在于我们如何理解和解释这件事（B）。让我们一起探索您的想法吧 🌿`,
      
      `感谢您的信任，愿意和我分享这些 🌸 每个人都会经历情绪的起伏，这很正常。ABC理论告诉我们，我们的情绪反应往往不是直接由事件引起的，而是由我们对事件的解释和信念造成的。我们可以学会识别和调整这些信念。您想试试吗？✨`
    ]
    
    const randomIndex = Math.floor(Math.random() * defaultResponses.length)
    return defaultResponses[randomIndex]
  }

  async analyzeEmotion(userInput: string): Promise<EmotionAnalysis> {
    // 关键词情绪分析
    const emotionKeywords = {
      '焦虑': ['焦虑', '紧张', '担心', '不安', '恐慌', '害怕', '忧虑', '恐惧'],
      '悲伤': ['难过', '悲伤', '低落', '绝望', '沮丧', '失望', '痛苦', '伤心'],
      '愤怒': ['生气', '愤怒', '暴躁', '恼火', '愤恨', '气愤', '恨', '愤慨'],
      '压力': ['压力', '负担', '疲惫', '累', '忙碌', '疲劳', '紧迫', 'overwhelmed'],
      '孤独': ['孤独', '寂寞', '独自', '没人理解', '隔离', '孤单', 'alone'],
      '困惑': ['困惑', '迷茫', '不知道', '不确定', '疑惑', '纠结', '迷失']
    }

    let detectedEmotion = '混合情绪'
    let intensity = 5

    for (const [emotion, keywords] of Object.entries(emotionKeywords)) {
      for (const keyword of keywords) {
        if (userInput.includes(keyword)) {
          detectedEmotion = emotion
          // 根据消息长度和情绪词频率计算强度
          const emotionWordCount = keywords.filter(k => userInput.includes(k)).length
          intensity = Math.min(9, Math.max(4, Math.floor(userInput.length / 20) + emotionWordCount + 3))
          break
        }
      }
      if (detectedEmotion !== '混合情绪') break
    }

    return {
      event: userInput.length > 50 ? userInput.substring(0, 50) + '...' : userInput,
      belief: this.generateBeliefAnalysis(detectedEmotion, userInput),
      emotion: detectedEmotion,
      intensity: intensity
    }
  }

  private generateBeliefAnalysis(emotion: string, userInput: string): string {
    const beliefMap: Record<string, string[]> = {
      '焦虑': [
        '可能存在对未来的过度担忧',
        '可能有"必须控制一切"的信念',
        '可能存在灾难化思维模式',
        '可能有完美主义倾向'
      ],
      '悲伤': [
        '可能存在对失去的过度关注',
        '可能有自我价值感的质疑',
        '可能存在"这都是我的错"的想法',
        '可能有无助感的信念'
      ],
      '愤怒': [
        '可能存在对公平的强烈期待',
        '可能感到边界被侵犯',
        '可能有"别人应该理解我"的期望',
        '可能存在控制他人的想法'
      ],
      '压力': [
        '可能存在对完美的过度追求',
        '可能有"我必须满足所有人"的信念',
        '可能存在时间管理的挑战',
        '可能有"我不能说不"的想法'
      ],
      '孤独': [
        '可能存在对连接的深度渴望',
        '可能有"没人理解我"的信念',
        '可能存在归属感的缺失',
        '可能有自我隔离的倾向'
      ],
      '困惑': [
        '可能存在对确定性的强烈需求',
        '可能有决策困难的模式',
        '可能存在自我怀疑',
        '可能有"我应该知道答案"的压力'
      ]
    }
    
    const beliefs = beliefMap[emotion] || ['可能存在一些需要进一步探索的内在信念模式']
    
    // 根据用户输入的具体内容选择最相关的信念分析
    if (userInput.includes('工作') || userInput.includes('上班')) {
      return beliefs[0] + '，特别是在工作环境中'
    } else if (userInput.includes('关系') || userInput.includes('朋友') || userInput.includes('家人')) {
      return beliefs[0] + '，特别是在人际关系方面'
    } else {
      return beliefs[Math.floor(Math.random() * beliefs.length)]
    }
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
- 提供具体的认知重构建议
- 适当使用温暖的表情符号 🌸💕✨
- 回复控制在200字以内，简洁而有力

记住：你是一个专业而温暖的陪伴者。`
  }
}

// 导出实例
export const openaiEmotionAI = new OpenAIClient()

// 错误处理
export function handleAIError(error: unknown): string {
  console.error('🔥 AI 错误:', error)
  
  if (error instanceof Error) {
    if (error.message.includes('OpenAI')) {
      return `AI服务遇到了一些问题，但请放心，我依然在这里陪伴您。让我们继续我们的对话吧。💕`
    }
  }
  
  return '遇到了一些技术问题，但我依然在这里倾听您的心声。请继续分享您的感受。✨'
}
