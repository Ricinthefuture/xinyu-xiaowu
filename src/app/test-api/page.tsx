'use client'

import { useState } from 'react'

export default function TestAPIPage() {
  const [result, setResult] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  const testAPI = async () => {
    setLoading(true)
    setResult(null)
    
    try {
      console.log('🧪 开始测试GitHub Models API...')
      
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
            🧪 GitHub Models API 测试
          </h1>

          <div className="text-center mb-8">
            <button
              onClick={testAPI}
              disabled={loading}
              className="btn-primary px-8 py-4 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? '🔄 测试中...' : '🚀 开始测试'}
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

          <div className="mt-8 text-center">
            <a 
              href="/chat" 
              className="btn-secondary px-6 py-3"
            >
              🏠 返回聊天页面
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
