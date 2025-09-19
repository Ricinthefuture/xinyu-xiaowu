// GitHub Models API 客户端
// 使用 GitHub Models 替代 OpenAI

interface GitHubModelsResponse {
  choices: Array<{
    message: {
      role: string
      content: string
    }
    finish_reason: string
  }>
  usage?: {
    prompt_tokens: number
    completion_tokens: number
    total_tokens: number
  }
}

interface ChatMessage {
  role: 'system' | 'user' | 'assistant'
  content: string
}

class GitHubModelsClient {
  private apiToken: string
  private baseUrl = 'https://models.inference.ai.azure.com'
  private model = 'gpt-4o-mini' // 或其他可用模型

  constructor() {
    this.apiToken = process.env.GITHUB_TOKEN || ''
    if (!this.apiToken) {
      throw new Error('GITHUB_TOKEN is required for AI functionality')
    }
  }

  async chat(messages: ChatMessage[]): Promise<string> {
    try {
      const response = await fetch(`${this.baseUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiToken}`,
        },
        body: JSON.stringify({
          model: this.model,
          messages,
          max_tokens: 1000,
          temperature: 0.7,
          stream: false
        })
      })

      if (!response.ok) {
        throw new Error(`GitHub Models API error: ${response.status} ${response.statusText}`)
      }

      const data: GitHubModelsResponse = await response.json()
      
      if (!data.choices || data.choices.length === 0) {
        throw new Error('No response from AI model')
      }

      return data.choices[0].message.content
    } catch (error) {
      console.error('GitHub Models API error:', error)
      throw new Error('AI service is currently unavailable')
    }
  }

  async streamChat(messages: ChatMessage[]): Promise<ReadableStream> {
    const response = await fetch(`${this.baseUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.apiToken}`,
      },
      body: JSON.stringify({
        model: this.model,
        messages,
        max_tokens: 1000,
        temperature: 0.7,
        stream: true
      })
    })

    if (!response.ok) {
      throw new Error(`GitHub Models API error: ${response.status}`)
    }

    return response.body!
  }
}

// ABC 理论相关的 AI 助手
export class EmotionAIAssistant {
  private client: GitHubModelsClient

  constructor() {
    this.client = new GitHubModelsClient()
  }

  // 系统提示词 - ABC理论指导
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

  async processUserMessage(userMessage: string, conversationHistory: ChatMessage[] = []): Promise<string> {
    const messages: ChatMessage[] = [
      { role: 'system', content: this.getSystemPrompt() },
      ...conversationHistory,
      { role: 'user', content: userMessage }
    ]

    return await this.client.chat(messages)
  }

  async analyzeEmotion(userInput: string): Promise<{
    event: string
    belief: string
    emotion: string
    intensity: number
  }> {
    const analysisPrompt = `请分析以下用户输入，按ABC理论识别：

用户输入："${userInput}"

请以JSON格式返回：
{
  "event": "具体发生的事件(A)",
  "belief": "用户的内在信念或想法(B)", 
  "emotion": "产生的情绪(C)",
  "intensity": 1-10的情绪强度数值
}

只返回JSON，不要其他文字。`

    try {
      const response = await this.client.chat([
        { role: 'system', content: '你是一个情绪分析专家，专门运用ABC理论分析用户情绪。' },
        { role: 'user', content: analysisPrompt }
      ])

      return JSON.parse(response)
    } catch (error) {
      console.error('Emotion analysis failed:', error)
      // 返回默认值
      return {
        event: userInput,
        belief: '未识别',
        emotion: '混合情绪',
        intensity: 5
      }
    }
  }

  async streamResponse(userMessage: string, conversationHistory: ChatMessage[] = []): Promise<ReadableStream> {
    const messages: ChatMessage[] = [
      { role: 'system', content: this.getSystemPrompt() },
      ...conversationHistory,
      { role: 'user', content: userMessage }
    ]

    return await this.client.streamChat(messages)
  }
}

// 导出单例实例
export const emotionAI = new EmotionAIAssistant()

// 错误处理助手
export function handleAIError(error: unknown): string {
  console.error('AI Error:', error)
  
  if (error instanceof Error) {
    if (error.message.includes('API error')) {
      return '抱歉，AI服务暂时不可用，请稍后再试。如果问题持续，请联系客服。💕'
    }
    if (error.message.includes('token')) {
      return '抱歉，服务配置有误，请联系管理员。🌸'
    }
  }
  
  return '抱歉，出现了一些技术问题。让我们稍后再继续对话吧。✨'
}
