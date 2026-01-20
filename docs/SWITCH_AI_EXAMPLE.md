# 快速切换AI模型

只需修改`.env`文件中的这三行，即可在不同AI之间自由切换！

## 当前使用：通义千问 qwen-plus ✅

```bash
AI_API_KEY=sk-7e934c3198fc4c7cba534835424bf3b2
AI_MODEL=qwen-plus
AI_BASE_URL=https://dashscope.aliyuncs.com/compatible-mode/v1
```

---

## 切换示例

### 切换到 OpenAI GPT-4

```bash
AI_API_KEY=sk-your-openai-key-here
AI_MODEL=gpt-4
AI_BASE_URL=https://api.openai.com/v1
```

### 切换到 DeepSeek

```bash
AI_API_KEY=sk-your-deepseek-key-here
AI_MODEL=deepseek-chat
AI_BASE_URL=https://api.deepseek.com
```

### 切换到本地 Ollama

```bash
AI_API_KEY=ollama
AI_MODEL=qwen2:7b
AI_BASE_URL=http://localhost:11434/v1
```

---

## ⚠️ 重要提示

修改`.env`文件后，**必须重启后端服务**才能生效：

```bash
# 停止当前后端（Ctrl+C）
# 然后重新启动
pnpm dev:backend
```

启动后查看日志，确认模型已切换：

```
🧠 LangChain 服务已初始化 | 模型: gpt-4 | 端点: https://api.openai.com/v1
```
