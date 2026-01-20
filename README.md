# 🌍 智能旅游规划应用

基于 AI 大模型的智能旅游规划应用，通过对话式交互帮助用户生成个性化旅行方案。支持通义千问、OpenAI、DeepSeek 等多种 AI 服务。

## ✨ 特性

- 🤖 **AI 对话式交互** - 通过自然语言描述旅行需求
- 🎯 **个性化方案生成** - 基于用户偏好定制详细行程
- 💎 **精美 UI 设计** - 旅游主题配色 + 玻璃拟态效果
- ⚡ **流式响应** - 打字效果，实时查看 AI 生成内容
- 📱 **响应式设计** - 完美适配移动端和桌面端

## 🛠️ 技术栈

### 前端

- React 19
- TypeScript
- Vite
- Vanilla CSS

### 后端

- NestJS 10
- TypeScript
- TypeORM + SQLite
- AI 大模型（通义千问 / OpenAI / DeepSeek / Ollama 等）
- LangChain

## 📦 安装

### 前置要求

- Node.js 18+
- pnpm 8+
- AI 模型 API Key（根据选择的服务申请）：
  - 通义千问：[https://bailian.console.aliyun.com](https://bailian.console.aliyun.com)
  - OpenAI：[https://platform.openai.com](https://platform.openai.com)
  - DeepSeek：[https://platform.deepseek.com](https://platform.deepseek.com)
- 高德地图 API Key ([获取地址](https://lbs.amap.com/))
- (可选) Tavily API Key ([获取地址](https://tavily.com)) - 用于增强实时搜索能力

### 步骤

1. **克隆项目**

```bash
git clone <repository-url>
cd AlTravelCompanion
```

2. **安装依赖**

```bash
pnpm install
```

3. **配置环境变量**

```bash
# 复制环境变量模板
cp .env.example .env

# 编辑 .env 文件，配置你选择的 AI 模型
# AI_API_KEY=your_api_key_here
# AI_MODEL=qwen-turbo  # 或 gpt-4, deepseek-chat 等
# AI_BASE_URL=https://dashscope.aliyuncs.com/compatible-mode/v1  # API 端点
```

4. **启动开发服务器**

```bash
# 同时启动前后端
pnpm dev

# 或分别启动
pnpm dev:backend  # 后端: http://localhost:3000
pnpm dev:frontend # 前端: http://localhost:5173
```

## 🚀 使用

1. 打开浏览器访问 `http://localhost:5173`
2. 在聊天框中描述你的旅行需求，例如：
   - "我想去南京旅游5天"
   - "帮我规划一个上海周末游，预算3000元"
   - "家庭游，带孩子去成都，喜欢美食和自然风光"
3. AI 会通过对话收集详细信息，然后生成完整的旅行方案

## 📁 项目结构

```
AlTravelCompanion/
├── docs/               # 项目文档
├── frontend/           # React 前端应用
├── backend/            # NestJS 后端服务
├── shared/             # 共享类型定义
└── package.json        # 根配置（pnpm workspaces）
```

## 🧪 测试

```bash
# 运行所有测试
pnpm test

# 仅测试后端
pnpm test:backend

# 仅测试前端
pnpm test:frontend
```

## 🏗️ 构建

```bash
# 构建生产版本
pnpm build

# 分别构建
pnpm build:backend
pnpm build:frontend
```

## ☁️ 部署 (Deployment)

本项目采用了 **Neon + Render + Vercel** 的免费云端部署架构。

👉 **[点击查看详细部署指南 (docs/DEPLOY.md)](docs/DEPLOY.md)**

该指南包含：

- 数据库 (PostgreSQL) 的申请与连接
- 后端 (Render) 的部署配置
- 前端 (Vercel) 的部署与代理设置

## 📝 开发文档

- [需求文档](docs/REQUIREMENTS.md)
- [技术上下文](docs/TECH_CONTEXT.md)
- [开发日志](docs/CHANGELOG.md)

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

## 📄 许可证

MIT License
