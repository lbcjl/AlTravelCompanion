# AI模型配置指南

本项目现已支持通过简单的环境变量配置切换AI模型，无需修改代码！

## 快速开始

在`.env`文件中设置以下三个核心参数即可切换AI模型：

```bash
AI_API_KEY=your_api_key_here
AI_MODEL=model_name
AI_BASE_URL=https://api.endpoint.com/v1
```

## 支持的AI提供商

### 1. 阿里通义千问（默认）

```bash
AI_API_KEY=sk-xxx  # 你的通义千问API Key
AI_MODEL=qwen-turbo  # 或 qwen-plus, qwen-max
AI_BASE_URL=https://dashscope.aliyuncs.com/compatible-mode/v1
```

### 2. OpenAI

```bash
AI_API_KEY=sk-xxx  # 你的OpenAI API Key
AI_MODEL=gpt-4  # 或 gpt-3.5-turbo
AI_BASE_URL=https://api.openai.com/v1
```

### 3. DeepSeek

```bash
AI_API_KEY=sk-xxx  # 你的DeepSeek API Key
AI_MODEL=deepseek-chat
AI_BASE_URL=https://api.deepseek.com
```

### 4. 本地Ollama

```bash
AI_API_KEY=ollama  # 本地模型不需要真实key，填任意值
AI_MODEL=qwen2:7b  # 或其他已下载的模型
AI_BASE_URL=http://localhost:11434/v1
```

### 5. Claude (通过第三方适配器)

某些第三方服务提供Claude的OpenAI兼容接口：

```bash
AI_API_KEY=your_key
AI_MODEL=claude-3-5-sonnet-20241022
AI_BASE_URL=https://your-adapter-url/v1
```

## 可选参数

```bash
AI_TEMPERATURE=0.7  # 温度参数，控制回复随机性 (0-2)
AI_MAX_TOKENS=6000  # 最大token数
```

## 向后兼容

旧的配置参数仍然有效（但推荐迁移到新格式）：

```bash
# 旧格式（仍然支持）
QWEN_API_KEY=sk-xxx
QWEN_MODEL=qwen-turbo

# 新格式（推荐）
AI_API_KEY=sk-xxx
AI_MODEL=qwen-turbo
AI_BASE_URL=https://dashscope.aliyuncs.com/compatible-mode/v1
```

## 故障排除

### 启动时报错："未配置 AI API Key"

**解决方案**：确保`.env`文件中设置了`AI_API_KEY`或`QWEN_API_KEY`。

### AI回复异常或无法连接

**检查项**：

1. `AI_BASE_URL`是否正确（注意结尾通常是`/v1`）
2. `AI_API_KEY`是否有效
3. `AI_MODEL`名称是否与提供商匹配
4. 网络连接是否正常（特别是本地Ollama需要确保服务已启动）

### 如何查看当前使用的模型？

启动后端时，查看控制台日志：

```
🧠 LangChain 服务已初始化 | 模型: gpt-4 | 端点: https://api.openai.com/v1
```
