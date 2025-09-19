# 💾 心语小屋数据库架构文档

## 🗄️ 数据库表结构

### 1. 用户档案表 (profiles)
```sql
CREATE TABLE profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

**用途**: 存储用户的个人资料信息
- `user_id`: 关联Supabase Auth用户
- `display_name`: 用户显示名称
- `avatar_url`: 头像URL

### 2. 对话表 (conversations)
```sql
CREATE TABLE conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'archived', 'deleted')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

**用途**: 管理用户的对话会话
- `title`: 对话标题（通常是第一条消息的摘要）
- `status`: 对话状态（活跃/归档/删除）

### 3. 消息表 (messages) ⭐ 核心表
```sql
CREATE TABLE messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID REFERENCES conversations(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('user', 'assistant', 'system')),
  content TEXT NOT NULL,
  tokens INTEGER DEFAULT 0,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

**用途**: 存储所有聊天消息记录
- `role`: 消息角色（用户/AI助手/系统）
- `content`: 消息内容（完整保存）
- `tokens`: Token使用量统计
- `metadata`: 扩展元数据

### 4. 情绪事件表 (emotion_events)
```sql
CREATE TABLE emotion_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  conversation_id UUID REFERENCES conversations(id) ON DELETE CASCADE,
  event_text TEXT NOT NULL,
  belief_text TEXT,
  emotion_label TEXT NOT NULL,
  intensity INTEGER CHECK (intensity >= 1 AND intensity <= 10),
  abc_analysis JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

**用途**: 基于ABC理论的情绪分析记录
- `event_text`: 触发事件(A)
- `belief_text`: 信念系统(B)
- `emotion_label`: 情绪标签(C)
- `intensity`: 情绪强度(1-10)
- `abc_analysis`: ABC理论分析详情

## 🔐 行级安全策略 (RLS)

### 用户数据隔离
```sql
-- 用户只能访问自己的数据
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own profile" ON profiles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = user_id);

ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage own conversations" ON conversations FOR ALL USING (auth.uid() = user_id);

ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage own messages" ON messages FOR ALL USING (
  auth.uid() IN (
    SELECT user_id FROM conversations WHERE id = conversation_id
  )
);

ALTER TABLE emotion_events ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage own emotions" ON emotion_events FOR ALL USING (auth.uid() = user_id);
```

## 📈 数据存储流程

### 1. 用户注册流程
```
1. Supabase Auth创建用户 → auth.users
2. 触发器自动创建用户档案 → profiles
3. 用户首次登录完善资料
```

### 2. 聊天消息存储
```
用户发送消息 → 
创建/获取conversation → 
保存用户消息到messages → 
调用智谱AI → 
保存AI回复到messages → 
分析情绪并保存到emotion_events
```

### 3. 数据查询优化
```sql
-- 索引优化
CREATE INDEX idx_messages_conversation_created ON messages(conversation_id, created_at);
CREATE INDEX idx_conversations_user_updated ON conversations(user_id, updated_at);
CREATE INDEX idx_emotions_user_created ON emotion_events(user_id, created_at);
```

## 🔄 数据备份策略

### 自动备份
- Supabase自动每日备份
- 保留30天备份历史
- 支持时间点恢复

### 用户数据导出
- API端点: `/api/backup`
- 格式: JSON
- 包含: 完整对话历史 + 情绪分析 + 用户资料

### 数据恢复
- 管理员可通过Supabase Dashboard恢复
- 用户可下载个人数据备份
- 支持部分数据恢复

## 📊 数据统计功能

### 已实现的统计
1. **对话统计**: 总对话数、总消息数、活跃度
2. **情绪分析**: 情绪分布、强度趋势、ABC理论应用
3. **用户画像**: 使用习惯、偏好情绪、成长轨迹

### API端点
- `/api/chat-history` - 聊天历史
- `/api/emotion-analytics` - 情绪分析
- `/api/backup` - 数据备份

## 🛡️ 数据安全措施

1. **加密存储**: 所有数据在Supabase中加密存储
2. **传输加密**: HTTPS + TLS 1.3
3. **访问控制**: RLS策略确保用户数据隔离
4. **审计日志**: Supabase提供完整的操作日志
5. **GDPR合规**: 支持数据删除和导出

## 📝 扩展建议

### 未来可添加的表
1. **用户设置表**: 个性化配置
2. **反馈表**: 用户对AI回复的评价
3. **标签表**: 对话和情绪的自定义标签
4. **分享表**: 用户同意分享的匿名数据

### 性能优化
1. 消息内容全文搜索索引
2. 情绪数据时间序列优化
3. 冷热数据分离策略

**您的心语小屋已经具备了企业级的数据存储和管理能力！** 🚀
