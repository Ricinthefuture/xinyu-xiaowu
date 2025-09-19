import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const githubToken = process.env.GITHUB_TOKEN

  if (!githubToken) {
    return NextResponse.json({ error: 'GITHUB_TOKEN missing' }, { status: 400 })
  }

  const results: any = {
    tokenInfo: {
      length: githubToken.length,
      prefix: githubToken.substring(0, 20) + '...',
      type: githubToken.startsWith('github_pat_') ? 'Fine-grained PAT' : 
            githubToken.startsWith('ghp_') ? 'Classic PAT' : 'Unknown'
    },
    tests: []
  }

  // 测试1: 基本GitHub API
  try {
    console.log('🧪 测试GitHub基本API...')
    const userResponse = await fetch('https://api.github.com/user', {
      headers: {
        'Authorization': `Bearer ${githubToken}`,
        'Accept': 'application/vnd.github+json',
        'X-GitHub-Api-Version': '2022-11-28',
        'User-Agent': 'EmotionAI-Debug/1.0'
      }
    })

    const userData = userResponse.ok ? await userResponse.json() : await userResponse.text()
    
    results.tests.push({
      name: 'GitHub Basic API',
      endpoint: 'https://api.github.com/user',
      status: userResponse.status,
      success: userResponse.ok,
      response: userResponse.ok ? { login: userData.login, id: userData.id } : userData
    })
  } catch (error) {
    results.tests.push({
      name: 'GitHub Basic API',
      endpoint: 'https://api.github.com/user',
      status: 'error',
      success: false,
      error: error instanceof Error ? error.message : String(error)
    })
  }

  // 测试2: GitHub Token权限
  try {
    console.log('🧪 测试Token权限...')
    const scopeResponse = await fetch('https://api.github.com/user', {
      method: 'HEAD',
      headers: {
        'Authorization': `Bearer ${githubToken}`,
        'Accept': 'application/vnd.github+json',
        'X-GitHub-Api-Version': '2022-11-28',
        'User-Agent': 'EmotionAI-Debug/1.0'
      }
    })

    const scopes = scopeResponse.headers.get('X-OAuth-Scopes') || 'none'
    const acceptedScopes = scopeResponse.headers.get('X-Accepted-OAuth-Scopes') || 'none'
    
    results.tests.push({
      name: 'Token Permissions',
      endpoint: 'https://api.github.com/user (HEAD)',
      status: scopeResponse.status,
      success: scopeResponse.ok,
      scopes: scopes,
      acceptedScopes: acceptedScopes
    })
  } catch (error) {
    results.tests.push({
      name: 'Token Permissions',
      endpoint: 'https://api.github.com/user (HEAD)',
      status: 'error',
      success: false,
      error: error instanceof Error ? error.message : String(error)
    })
  }

  // 测试3: 尝试访问GitHub Models相关端点
  const modelEndpoints = [
    {
      name: 'GitHub Models (Azure)',
      url: 'https://models.inference.ai.azure.com/models',
      method: 'GET'
    },
    {
      name: 'GitHub Models (Direct)',
      url: 'https://api.github.com/models',
      method: 'GET'
    },
    {
      name: 'GitHub Marketplace',
      url: 'https://api.github.com/marketplace_listing/plans',
      method: 'GET'
    }
  ]

  for (const endpoint of modelEndpoints) {
    try {
      console.log(`🧪 测试 ${endpoint.name}...`)
      
      const response = await fetch(endpoint.url, {
        method: endpoint.method,
        headers: {
          'Authorization': `Bearer ${githubToken}`,
          'Accept': 'application/vnd.github+json',
          'X-GitHub-Api-Version': '2022-11-28',
          'User-Agent': 'EmotionAI-Debug/1.0'
        }
      })

      let responseData
      try {
        responseData = await response.json()
      } catch {
        responseData = await response.text()
      }

      results.tests.push({
        name: endpoint.name,
        endpoint: endpoint.url,
        method: endpoint.method,
        status: response.status,
        success: response.ok,
        headers: Object.fromEntries(response.headers.entries()),
        response: response.ok ? responseData : responseData.substring(0, 500)
      })

    } catch (error) {
      results.tests.push({
        name: endpoint.name,
        endpoint: endpoint.url,
        method: endpoint.method,
        status: 'error',
        success: false,
        error: error instanceof Error ? error.message : String(error)
      })
    }
  }

  // 测试4: 尝试不同的认证方式
  const authMethods = [
    { name: 'Bearer Token', auth: `Bearer ${githubToken}` },
    { name: 'Token (Classic)', auth: `token ${githubToken}` },
    { name: 'Basic Auth', auth: `Basic ${Buffer.from(`token:${githubToken}`).toString('base64')}` }
  ]

  for (const authMethod of authMethods) {
    try {
      console.log(`🧪 测试认证方式: ${authMethod.name}...`)
      
      const response = await fetch('https://models.inference.ai.azure.com/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': authMethod.auth,
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'User-Agent': 'EmotionAI-Debug/1.0'
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [{ role: 'user', content: 'test' }],
          max_tokens: 10
        })
      })

      let responseData
      try {
        responseData = await response.json()
      } catch {
        responseData = await response.text()
      }

      results.tests.push({
        name: `Azure Models API - ${authMethod.name}`,
        endpoint: 'https://models.inference.ai.azure.com/chat/completions',
        method: 'POST',
        authMethod: authMethod.name,
        status: response.status,
        success: response.ok,
        response: responseData
      })

    } catch (error) {
      results.tests.push({
        name: `Azure Models API - ${authMethod.name}`,
        endpoint: 'https://models.inference.ai.azure.com/chat/completions',
        method: 'POST',
        authMethod: authMethod.name,
        status: 'error',
        success: false,
        error: error instanceof Error ? error.message : String(error)
      })
    }
  }

  return NextResponse.json(results, { status: 200 })
}
