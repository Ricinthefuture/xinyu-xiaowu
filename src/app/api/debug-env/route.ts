import { NextResponse } from 'next/server'

export async function GET() {
  console.log('🔍 环境变量调试...')
  
  const githubToken = process.env.GITHUB_TOKEN
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  
  console.log('📋 环境变量状态:', {
    hasGithubToken: !!githubToken,
    githubTokenLength: githubToken?.length || 0,
    githubTokenPrefix: githubToken?.substring(0, 20) + '...',
    hasSupabaseUrl: !!supabaseUrl,
    nodeEnv: process.env.NODE_ENV
  })

  return NextResponse.json({
    success: true,
    env: {
      hasGithubToken: !!githubToken,
      githubTokenLength: githubToken?.length || 0,
      githubTokenPrefix: githubToken?.substring(0, 20) + '...',
      hasSupabaseUrl: !!supabaseUrl,
      nodeEnv: process.env.NODE_ENV,
      allEnvKeys: Object.keys(process.env).filter(key => 
        key.includes('GITHUB') || key.includes('SUPABASE')
      )
    }
  })
}
