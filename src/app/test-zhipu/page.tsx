'use client'

import { useState } from 'react'

export default function TestZhipuPage() {
  const [result, setResult] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  const testZhipuAPI = async () => {
    setLoading(true)
    setResult(null)
    
    try {
      console.log('🧪 开始测试智谱AI...')
      
      const response = await fetch('/api/test-simple', {
        method: 'GET',
        headers: {
          'Accept': 'application/json'
        }
      })

      const data = await response.json()
      console.log('📊 API响应:', data)
      
      setResult({
        status: response.status,
        success: response.ok,
        data: data
      })

    } catch (error) {
      console.error('❌ 测试失败:', error)
      setResult({
        status: 'error',
        success: false,
        error: error instanceof Error ? error.message : String(error)
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-soft-100 to-primary-200 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-xl p-8">
          <h1 className="text-3xl font-bold text-center mb-8 bg-gradient-to-r from-primary-600 to-soft-600 bg-clip-text text-transparent">
            🤖 智谱AI GLM-4.5-Flash 测试
          </h1>

          <div className="text-center mb-8">
            <div className="mb-4">
              <span className="inline-block bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                ✅ 完全免费模型
              </span>
              <span className="inline-block bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium ml-2">
                🧠 支持深度思考
              </span>
              <span className="inline-block bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm font-medium ml-2">
                📚 128K上下文
              </span>
            </div>
            
            <button
              onClick={testZhipuAPI}
              disabled={loading}
              className="btn-primary px-8 py-4 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? '🔄 测试中...' : '🚀 测试智谱AI'}
            </button>
          </div>

          {result && (
            <div className="mt-8 p-6 bg-gray-50 rounded-2xl">
              <h3 className="text-xl font-semibold mb-4">测试结果：</h3>
              
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <span className="font-medium">状态:</span>
                  <span className={`px-3 py-1 rounded-full text-sm ${
                    result.success 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {result.success ? '✅ 成功' : '❌ 失败'} ({result.status})
                  </span>
                </div>

                {result.data && (
                  <div>
                    <span className="font-medium">详细信息:</span>
                    <pre className="mt-2 p-4 bg-white rounded-lg overflow-auto text-sm">
                      {JSON.stringify(result.data, null, 2)}
                    </pre>
                  </div>
                )}

                {result.error && (
                  <div>
                    <span className="font-medium text-red-600">错误:</span>
                    <div className="mt-2 p-4 bg-red-50 text-red-700 rounded-lg">
                      {result.error}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          <div className="mt-8 text-center space-x-4">
            <a 
              href="/chat" 
              className="btn-secondary px-6 py-3"
            >
              🏠 前往聊天页面
            </a>
            <a 
              href="/debug-chat" 
              className="btn-secondary px-6 py-3"
            >
              🐛 调试聊天
            </a>
          </div>

          <div className="mt-8 p-4 bg-blue-50 rounded-2xl">
            <h4 className="font-semibold text-blue-800 mb-2">关于智谱AI GLM-4.5-Flash:</h4>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• 完全免费开放使用，无需付费</li>
              <li>• 支持128K上下文长度，可处理长文本</li>
              <li>• 内置深度思考模式，推理能力强</li>
              <li>• 支持工具调用和结构化输出</li>
              <li>• 在多项基准测试中表现优异</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
