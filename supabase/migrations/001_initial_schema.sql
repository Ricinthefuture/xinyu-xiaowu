-- 增量更新脚本：安全地添加缺失的表和功能
-- 使用 CREATE TABLE IF NOT EXISTS 避免重复创建

-- 启用 UUID 扩展（如果尚未启用）
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 用户资料表（如果不存在则创建）
CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  display_name TEXT,
  timezone TEXT DEFAULT 'UTC',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  metadata JSONB DEFAULT '{}'
);

-- 对话表（如果不存在则创建）
CREATE TABLE IF NOT EXISTS conversations (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  title TEXT,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'ended')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  last_interaction TIMESTAMPTZ
);

-- 消息表（如果不存在则创建）
CREATE TABLE IF NOT EXISTS messages (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  conversation_id UUID REFERENCES conversations(id) ON DELETE CASCADE NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('user', 'assistant')),
  content TEXT NOT NULL,
  tokens INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 情绪事件表（如果不存在则创建）
CREATE TABLE IF NOT EXISTS emotion_events (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  conversation_id UUID REFERENCES conversations(id) ON DELETE SET NULL,
  event_text TEXT NOT NULL,          -- A: 事件
  belief_text TEXT,                  -- B: 信念
  emotion_label TEXT NOT NULL,       -- C: 情绪
  intensity NUMERIC(3,1) CHECK (intensity >= 1 AND intensity <= 10),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 订阅表（如果不存在则创建）
CREATE TABLE IF NOT EXISTS subscriptions (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  stripe_customer_id TEXT,
  stripe_subscription_id TEXT,
  status TEXT,
  tier TEXT,
  current_period_end TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 创建索引（如果不存在）
CREATE INDEX IF NOT EXISTS idx_conversations_user_id ON conversations(user_id);
CREATE INDEX IF NOT EXISTS idx_conversations_created_at ON conversations(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_messages_conversation_id ON messages(conversation_id);
CREATE INDEX IF NOT EXISTS idx_messages_created_at ON messages(created_at);
CREATE INDEX IF NOT EXISTS idx_emotion_events_user_id ON emotion_events(user_id);
CREATE INDEX IF NOT EXISTS idx_emotion_events_created_at ON emotion_events(created_at DESC);

-- 启用行级安全策略
DO $$ 
BEGIN
    -- 检查并启用 RLS
    IF NOT EXISTS (
        SELECT 1 FROM pg_class c 
        JOIN pg_namespace n ON n.oid = c.relnamespace 
        WHERE c.relname = 'profiles' AND n.nspname = 'public' AND c.relrowsecurity = true
    ) THEN
        ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
    END IF;
    
    IF NOT EXISTS (
        SELECT 1 FROM pg_class c 
        JOIN pg_namespace n ON n.oid = c.relnamespace 
        WHERE c.relname = 'conversations' AND n.nspname = 'public' AND c.relrowsecurity = true
    ) THEN
        ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;
    END IF;
    
    IF NOT EXISTS (
        SELECT 1 FROM pg_class c 
        JOIN pg_namespace n ON n.oid = c.relnamespace 
        WHERE c.relname = 'messages' AND n.nspname = 'public' AND c.relrowsecurity = true
    ) THEN
        ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
    END IF;
    
    IF NOT EXISTS (
        SELECT 1 FROM pg_class c 
        JOIN pg_namespace n ON n.oid = c.relnamespace 
        WHERE c.relname = 'emotion_events' AND n.nspname = 'public' AND c.relrowsecurity = true
    ) THEN
        ALTER TABLE emotion_events ENABLE ROW LEVEL SECURITY;
    END IF;
    
    IF NOT EXISTS (
        SELECT 1 FROM pg_class c 
        JOIN pg_namespace n ON n.oid = c.relnamespace 
        WHERE c.relname = 'subscriptions' AND n.nspname = 'public' AND c.relrowsecurity = true
    ) THEN
        ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
    END IF;
END $$;

-- 创建策略（使用 CREATE POLICY IF NOT EXISTS 在新版本 PostgreSQL 中，或者先删除再创建）

-- 删除可能存在的旧策略，然后创建新策略
DROP POLICY IF EXISTS "用户只能查看自己的资料" ON profiles;
CREATE POLICY "用户只能查看自己的资料" ON profiles
  FOR SELECT USING (auth.uid() = id);

DROP POLICY IF EXISTS "用户可以更新自己的资料" ON profiles;
CREATE POLICY "用户可以更新自己的资料" ON profiles
  FOR UPDATE USING (auth.uid() = id);

DROP POLICY IF EXISTS "用户可以插入自己的资料" ON profiles;
CREATE POLICY "用户可以插入自己的资料" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Conversations 策略
DROP POLICY IF EXISTS "用户只能查看自己的对话" ON conversations;
CREATE POLICY "用户只能查看自己的对话" ON conversations
  FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "用户可以创建自己的对话" ON conversations;
CREATE POLICY "用户可以创建自己的对话" ON conversations
  FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "用户可以更新自己的对话" ON conversations;
CREATE POLICY "用户可以更新自己的对话" ON conversations
  FOR UPDATE USING (auth.uid() = user_id);

-- Messages 策略
DROP POLICY IF EXISTS "用户只能查看自己对话的消息" ON messages;
CREATE POLICY "用户只能查看自己对话的消息" ON messages
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM conversations 
      WHERE conversations.id = messages.conversation_id 
      AND conversations.user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "用户可以在自己的对话中插入消息" ON messages;
CREATE POLICY "用户可以在自己的对话中插入消息" ON messages
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM conversations 
      WHERE conversations.id = messages.conversation_id 
      AND conversations.user_id = auth.uid()
    )
  );

-- Emotion Events 策略
DROP POLICY IF EXISTS "用户只能查看自己的情绪事件" ON emotion_events;
CREATE POLICY "用户只能查看自己的情绪事件" ON emotion_events
  FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "用户可以创建自己的情绪事件" ON emotion_events;
CREATE POLICY "用户可以创建自己的情绪事件" ON emotion_events
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Subscriptions 策略
DROP POLICY IF EXISTS "用户只能查看自己的订阅" ON subscriptions;
CREATE POLICY "用户只能查看自己的订阅" ON subscriptions
  FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "用户可以更新自己的订阅" ON subscriptions;
CREATE POLICY "用户可以更新自己的订阅" ON subscriptions
  FOR UPDATE USING (auth.uid() = user_id);

-- 触发器和函数
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, display_name)
  VALUES (NEW.id, NEW.raw_user_meta_data->>'display_name');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

CREATE OR REPLACE FUNCTION public.update_conversation_last_interaction()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE conversations 
  SET last_interaction = NOW()
  WHERE id = NEW.conversation_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS on_message_created ON messages;
CREATE TRIGGER on_message_created
  AFTER INSERT ON messages
  FOR EACH ROW EXECUTE FUNCTION public.update_conversation_last_interaction();
