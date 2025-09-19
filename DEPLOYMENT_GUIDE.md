# 🚀 心语小屋部署指南

## 方法一：Vercel部署（推荐）

### 1. 准备工作
```bash
# 安装Vercel CLI（如果需要权限，使用sudo）
sudo npm install -g vercel

# 或者使用npx（无需全局安装）
npx vercel --version
```

### 2. 登录Vercel
```bash
npx vercel login
# 按提示选择GitHub/GitLab/Bitbucket登录
```

### 3. 部署项目
```bash
# 在项目根目录执行
npx vercel

# 首次部署会询问：
# ? Set up and deploy "~/Desktop/one for all/Cursor/情绪机器人"? [Y/n] y
# ? Which scope do you want to deploy to? [选择你的账户]
# ? Link to existing project? [N/y] n
# ? What's your project's name? xinyu-xiaowu
# ? In which directory is your code located? ./
```

### 4. 生产环境部署
```bash
npx vercel --prod
```

### 5. 设置环境变量
在Vercel Dashboard中设置：
- `ZHIPU_API_KEY` = `46b77f9d84f94e7abfe3c3f108f4ad12.PN6A1pwa4e3SO38E`
- `NEXT_PUBLIC_SUPABASE_URL` = 你的Supabase项目URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` = 你的Supabase匿名密钥

## 方法二：Netlify部署

### 1. 创建netlify.toml
```toml
[build]
  command = "npm run build"
  publish = ".next"

[build.environment]
  NODE_VERSION = "18"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

### 2. 拖拽部署
1. 访问 https://netlify.com
2. 将项目文件夹拖拽到部署区域
3. 在设置中添加环境变量

## 方法三：Railway部署

### 1. 连接GitHub
1. 访问 https://railway.app
2. 连接GitHub仓库
3. 选择项目自动部署

### 2. 设置环境变量
在Railway Dashboard中添加相同的环境变量

## 🔧 部署前检查清单

- [ ] 确保 `.env.local` 不会被上传（已在 .gitignore 中）
- [ ] 检查 `package.json` 中的构建脚本
- [ ] 确保所有依赖都在 `dependencies` 中
- [ ] 测试本地构建：`npm run build`

## 📊 环境变量清单

```bash
# 智谱AI配置
ZHIPU_API_KEY=46b77f9d84f94e7abfe3c3f108f4ad12.PN6A1pwa4e3SO38E

# Supabase配置（请替换为你的实际值）
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

## 🌐 自定义域名（可选）

部署成功后，可以在平台设置中绑定自定义域名：
- Vercel: Project Settings > Domains
- Netlify: Site Settings > Domain Management
- Railway: Project Settings > Domains

## 🔍 常见问题

### Q: 构建失败怎么办？
A: 检查 `npm run build` 是否在本地正常运行

### Q: 环境变量不生效？
A: 确保变量名正确，重新部署项目

### Q: API调用失败？
A: 检查智谱AI密钥是否正确设置

## 📈 部署后监控

- 查看部署日志
- 监控API调用次数
- 检查错误日志
- 设置报警通知

部署成功后，你的心语小屋就可以为全球用户提供服务了！🌟
