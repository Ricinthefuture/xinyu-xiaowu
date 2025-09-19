// 模拟AI客户端，用于测试整个流程
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

class MockAIClient {
  async processUserMessage(userMessage: string, conversationHistory: ChatMessage[] = []): Promise<string> {
    console.log('🤖 使用模拟AI处理消息:', userMessage)
    
    // 模拟API延迟
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    const lowerMessage = userMessage.toLowerCase()
    
    // 基于ABC理论的智能回复
    if (lowerMessage.includes('焦虑') || lowerMessage.includes('担心') || lowerMessage.includes('紧张')) {
      return `我理解您现在的焦虑情绪 🌸 让我们用ABC理论来分析：

**A (事件)**: ${userMessage.substring(0, 30)}...
**B (信念)**: 您可能担心事情会往不好的方向发展
**C (情绪)**: 这种想法带来了焦虑感

焦虑是正常的，让我们一起找到应对的方法 💕`
    }
    
    if (lowerMessage.includes('难过') || lowerMessage.includes('伤心') || lowerMessage.includes('悲伤')) {
      return `我感受到了您的难过 💙 悲伤是一种很珍贵的情绪：

**A (事件)**: 您遇到了让人难过的事情
**B (信念)**: 可能感觉失去了什么重要的东西
**C (情绪)**: 这带来了深深的悲伤

请相信，悲伤也是成长的一部分 🌱`
    }
    
    // 默认温暖回复
    return `感谢您与我分享 🌸 我能感受到您的情感。

让我们用ABC理论来理解这个情况：
- **A (事件)**: 您提到了"${userMessage.substring(0, 20)}..."
- **B (信念)**: 您对此有什么想法呢？
- **C (情绪)**: 这些想法如何影响了您的感受？

我在这里陪伴您，请继续和我分享 💕`
  }

  async analyzeEmotion(userMessage: string): Promise<EmotionAnalysis> {
    console.log('🧠 模拟情绪分析:', userMessage)
    
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
        belief: "感到不公平或被冒犯",
        emotion: "愤怒",
        intensity: 7
      }
    }
    
    return {
      event: userMessage,
      belief: "正在探索内心的想法",
      emotion: "平静",
      intensity: 4
    }
  }
}

export const mockAI = new MockAIClient()

export function handleAIError(error: unknown): string {
  console.error('模拟AI错误处理:', error)
  return '抱歉，AI服务暂时不可用，但我们的模拟系统会继续为您提供支持。'
}
