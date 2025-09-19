// 智谱AI GLM-4.5-Flash 客户端
// 文档: https://docs.bigmodel.cn/cn/guide/models/free/glm-4.5-flash

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

class ZhipuAIClient {
  private apiKey: string
  private baseUrl = 'https://open.bigmodel.cn/api/paas/v4/chat/completions'
  private model = 'glm-4.5-flash' // 免费模型

  constructor() {
    this.apiKey = process.env.ZHIPU_API_KEY || ''
    console.log('🔧 智谱AI客户端初始化')
    console.log('🔑 API Key状态:', {
      hasKey: !!this.apiKey,
      keyLength: this.apiKey?.length || 0,
      keyPrefix: this.apiKey?.substring(0, 20) + '...'
    })
  }

  async processUserMessage(userMessage: string, conversationHistory: ChatMessage[] = []): Promise<string> {
    console.log('🚀 开始智谱AI处理...')
    
    const messages: ChatMessage[] = [
      { role: 'system', content: this.getSystemPrompt() },
      ...conversationHistory.slice(-6), // 保留最近6轮对话
      { role: 'user', content: userMessage }
    ]

    console.log('📝 发送消息数量:', messages.length)

    try {
      const response = await this.callZhipuAPI(messages)
      if (response) {
        console.log('✅ 智谱AI调用成功!')
        console.log('📄 AI回复预览:', response.substring(0, 100) + '...')
        return response
      } else {
        console.log('⚠️ 智谱AI调用失败，使用智能回复')
        return this.generateIntelligentResponse(userMessage, conversationHistory)
      }
    } catch (error) {
      console.error('🔥 智谱AI调用异常:', error)
      return this.generateIntelligentResponse(userMessage, conversationHistory)
    }
  }

  private async callZhipuAPI(messages: ChatMessage[]): Promise<string | null> {
    try {
      console.log('📤 发送请求到智谱AI...')
      
      // 创建超时控制
      const controller = new AbortController()
      const timeoutId = setTimeout(() => {
        console.log('⏰ 请求超时，中止请求')
        controller.abort()
      }, 30000) // 30秒超时

      const requestBody = {
        model: this.model,
        messages: messages,
        max_tokens: 1500,
        temperature: 0.7,
        top_p: 0.9,
        thinking: {
          type: "enabled" // 启用深度思考模式，提供更深层次的推理分析
        },
        stream: false // 非流式输出，便于处理
      }

      console.log('📋 请求参数:', {
        model: requestBody.model,
        messagesCount: messages.length,
        maxTokens: requestBody.max_tokens,
        thinkingEnabled: true
      })

      const response = await fetch(this.baseUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(requestBody),
        signal: controller.signal
      })

      clearTimeout(timeoutId)

      console.log('📊 API响应状态:', response.status)
      console.log('📋 响应头:', Object.fromEntries(response.headers.entries()))

      if (!response.ok) {
        const errorText = await response.text()
        console.error('❌ 智谱AI API错误:', {
          status: response.status,
          statusText: response.statusText,
          body: errorText
        })
        return null
      }

      const data = await response.json()
      console.log('📄 API响应数据结构:', {
        hasChoices: !!data.choices,
        choicesLength: data.choices?.length || 0,
        hasMessage: !!data.choices?.[0]?.message,
        hasContent: !!data.choices?.[0]?.message?.content,
        usage: data.usage
      })

      if (data.choices && data.choices[0] && data.choices[0].message && data.choices[0].message.content) {
        const content = data.choices[0].message.content
        console.log('✅ 智谱AI响应成功，内容长度:', content.length)
        return content
      } else {
        console.error('❌ 响应格式异常:', data)
        return null
      }

    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
        console.log('⏰ 智谱AI请求超时')
      } else {
        console.error('🔥 智谱AI请求异常:', error instanceof Error ? error.message : String(error))
      }
      return null
    }
  }

  async analyzeEmotion(userMessage: string): Promise<EmotionAnalysis> {
    console.log('🧠 开始情绪分析...')
    
    const analysisMessages: ChatMessage[] = [
      { 
        role: 'system', 
        content: '你是专业的情绪分析师，基于ABC理论分析用户情绪。请以JSON格式返回分析结果，包含event、belief、emotion、intensity字段。intensity为1-10的数字。' 
      },
      { 
        role: 'user', 
        content: `请分析这段话的情绪：${userMessage}` 
      }
    ]

    try {
      const response = await this.callZhipuAPI(analysisMessages)
      
      if (response) {
        try {
          // 尝试提取JSON部分
          const jsonMatch = response.match(/\{[\s\S]*\}/)
          if (jsonMatch) {
            const analysis = JSON.parse(jsonMatch[0])
            if (analysis.event && analysis.belief && analysis.emotion && analysis.intensity) {
              console.log('✅ 智谱AI情绪分析成功:', analysis)
              return analysis
            }
          }
        } catch (parseError) {
          console.warn('⚠️ 情绪分析JSON解析失败，使用基础分析')
        }
      }
    } catch (error) {
      console.error('❌ 情绪分析API调用失败:', error)
    }

    // 回退到基础分析
    return this.getBasicEmotionAnalysis(userMessage)
  }

  private getSystemPrompt(): string {
    return `你是一名基于情绪ABC理论的心理咨询助手，由阿尔伯特·埃利斯创立的该理论指出：情绪并非由事件直接引发，而是通过个体对事件的信念系统（B）中介产生。即：诱发事件（A）→ 信念（B）→ 情绪与行为后果（C）。人们常误以为"A→C"，实则关键在于"B"。

你的任务是：以温柔、耐心、非评判的态度，引导用户觉察自己的情绪反应，并逐步探索其背后的认知逻辑。对话从询问今日引发情绪的具体事件（A）开始，如："今天发生了什么让你感到困扰的事？"随后共情地识别情绪后果（C），例如："听起来你很失望/焦虑/委屈……"

接着，重点引导用户说出支撑情绪的内在信念（B）："当时你在心里对自己说了什么？""你认为这件事'应该'怎样？"帮助用户意识到：是信念而非事件本身，主导了情绪强度。

进一步，用生活化语言解释三大认知误区：

绝对化要求：用"必须""绝对""理应"等极端标准要求自己或他人。举例：大学生小林因生病未能完成"每天必须学12小时"的目标而崩溃。引导调整为弹性信念："我希望坚持学习，但也允许自己休息恢复。"

灾难化思维：将小问题放大为无法承受的灾难。如张阿姨看到"窦性心律"误判为重病征兆，引发恐慌。可用事实澄清："数据显示这在60%成年人中常见，风险极低。"

过分概括化：以单一事件否定整体价值。如实习生因PPT被修改多次，便认定"我根本不适合这行"。可回应："一次挫折≠能力不足，新人成长本就需反复打磨。"

最后，协助用户重构信念：若换一种更合理的想法，情绪会如何变化？例如："如果我相信'犯错是学习的一部分'，我会更平静地面对批评。"目标是提升情绪自主性，让用户明白：改变不合理信念，就能改变情绪命运。

请严格按照ABC理论的专业咨询流程进行对话，逐步引导用户完成A→B→C的完整探索过程。`
  }

  private generateIntelligentResponse(userMessage: string, conversationHistory: ChatMessage[] = []): string {
    const lowerMessage = userMessage.toLowerCase()
    
    // 判断对话阶段：初次接触还是深入探索
    const isFirstContact = conversationHistory.length === 0
    
    // 如果是初次接触，按照ABC理论开始引导
    if (isFirstContact) {
      return `我是您的心理咨询助手，很高兴遇见您。

我注意到您提到了一些情绪体验。根据ABC理论，我们的情绪并非直接由事件引发，而是通过我们对事件的信念和想法产生的。

为了更好地帮助您，我想先了解：**今天发生了什么让您感到困扰的事？**

请尽可能具体地描述这个事件（A），这样我们就能一步步探索您的情绪反应了。🌟`
    }

    // 基于用户情绪词汇进行专业引导
    if (lowerMessage.includes('焦虑') || lowerMessage.includes('担心') || lowerMessage.includes('紧张') || lowerMessage.includes('害怕')) {
      return `听起来您很焦虑，我能感受到您内心的不安。😌

让我们用ABC理论来理解这种感受：
- **A（诱发事件）**: 具体是什么事情让您产生了焦虑？
- **C（情绪后果）**: 您现在的焦虑程度如何？还伴随其他身体反应吗？

接下来，我想了解最关键的部分：
**当时您在心里对自己说了什么？** 比如"如果...就完蛋了"或"我必须..."这样的想法？

这些内在的信念（B）往往是焦虑的真正源头。`
    }
    
    if (lowerMessage.includes('难过') || lowerMessage.includes('伤心') || lowerMessage.includes('悲伤') || lowerMessage.includes('失落')) {
      return `我深深感受到您的难过，这种情绪是珍贵的，说明您在乎一些重要的东西。💙

让我们一起探索：
- **A（诱发事件）**: 发生了什么让您心情如此沉重？
- **C（情绪后果）**: 除了难过，您还感到失望、愤怒或其他情绪吗？

现在，请告诉我：**您认为这件事"应该"是什么样的？** 或者**您对自己说了"我失去了..."什么样的话？**

这些想法（B）可能加重了您的悲伤感受。`
    }
    
    if (lowerMessage.includes('愤怒') || lowerMessage.includes('生气') || lowerMessage.includes('气愤') || lowerMessage.includes('愤慨')) {
      return `我理解您的愤怒，这种情绪通常在保护您重视的价值和界限。🌿

让我们用ABC理论分析：
- **A（诱发事件）**: 什么具体行为或情况激怒了您？
- **C（情绪后果）**: 愤怒让您想要做什么？有什么身体感受？

关键问题是：**您认为对方（或情况）"绝对不应该"怎样？** 或者**您在想"这太不公平了，他们必须..."什么？**

这种绝对化的要求（B）往往会放大愤怒的强度。`
    }

    if (lowerMessage.includes('开心') || lowerMessage.includes('高兴') || lowerMessage.includes('快乐') || lowerMessage.includes('兴奋')) {
      return `太好了！感受到您的快乐让我也很开心。🌟

即使是积极情绪，ABC理论同样适用：
- **A（诱发事件）**: 什么美好的事情发生了？
- **C（情绪后果）**: 这份快乐给您带来了什么感受和行动力？

我好奇的是：**您对这件事有什么积极的想法？** 比如"我做到了"或"这证明了我..."？

了解支撑快乐的信念（B），有助于我们在困难时重新激活这种积极状态。`
    }

    // 默认专业引导
    return `感谢您与我分享。作为您的心理咨询助手，我想运用ABC理论帮您深入了解这种情绪体验。

情绪的产生遵循：**事件（A）→ 信念（B）→ 情绪后果（C）**

为了更好地帮助您，请告诉我：
1. **今天发生了什么具体的事情？**（诱发事件A）
2. **您现在主要感受到什么情绪？**（情绪后果C）

然后我们会一起探索最关键的部分——您内心的想法和信念（B），这往往是情绪强度的真正决定因素。🌸`
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

    if (lowerMessage.includes('开心') || lowerMessage.includes('高兴')) {
      return {
        event: userMessage,
        belief: "对现状感到满意",
        emotion: "快乐",
        intensity: 8
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
      hasApiKey: !!this.apiKey,
      apiKeyLength: this.apiKey?.length || 0,
      model: this.model,
      endpoint: this.baseUrl
    }

    try {
      const testResult = await this.callZhipuAPI([
        { role: 'user', content: '请简短回复：测试成功' }
      ])
      results['testResult'] = !!testResult
      results['testResponse'] = testResult?.substring(0, 50) + '...'
    } catch (error) {
      results['testResult'] = false
      results['testError'] = error instanceof Error ? error.message : String(error)
    }

    return results
  }
}

export const zhipuAI = new ZhipuAIClient()

export function handleAIError(error: unknown): string {
  console.error('智谱AI错误:', error)
  return '抱歉，AI服务遇到问题，但我们会继续为您提供支持。'
}
