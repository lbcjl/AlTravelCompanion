# AI Agent 全栈开发学习大纲 (The Road to AGI)

> 🤖 **"The future is not just about using AI, it's about building Agents that work for you."**
> 基于您提供的路线图，这份大纲将带您从 LLM 调用者进化为 Agent 架构师。

---

## 🗺️ 阶段一：AI 大模型基础 (AI Model Basics)

**目标**：祛魅大模型，掌握它是如何“思考”的。

### 1.1 大模型核心概念

- **Transformer 架构精讲**: Encoder-Decoder, Attention Mechanism (注意力机制) —— _通俗理解：它怎么“注意”到上下文的？_
- **Token 的秘密**: Tokenizer, Context Window (上下文窗口), Cost Calculation (算钱!).
- **常见模型对比**: GPT-4o, Claude 3.5, Gemini 1.5, Llama 3 (开源之光).

### 1.2 Prompt Engineering (提示词工程)

- **基础技巧**: Zero-shot, Few-shot (少样本学习).
- **高阶心法**: COT (Chain of Thought - 思维链), TOT (Tree of Thoughts).
- **结构化输出**: 让 LLM 乖乖吐出 JSON，而不是废话。

### 1.3 API 实战

- **OpenAI 格式标准**: `messages=[{"role": "user", "content": "..."}]`。
- **参数调优**: Temperature (创造力 vs 稳定性), Top-P, Frequency Penalty.

---

## 🧠 阶段二：Agent 核心概念 (Core Concepts)

**目标**：给 LLM 装上“手脚”和“海马体”。

### 2.1 Agent 的四大支柱

1.  **Profile (角色设定)**: 你是谁？(System Prompt 的艺术).
2.  **Memory (记忆)**:
    - Short-term: 对话上下文。
    - Long-term: 向量数据库 (Vector DB) 的引入。
3.  **Planning (规划)**:
    - 任务拆解 (Decomposition).
    - 自我反思 (Self-Reflection).
4.  **Action (行动)**: Tool Use (工具调用).

### 2.2 工具调用 (Function Calling)

- **原理**: 并不是 LLM 自己上网，而是它生成由代码执行的 JSON 指令。
- **实战**: 手写一个 `get_weather(city)` 函数，让 LLM 决定何时调用。

---

## 🛠️ 阶段三：Agent 开发框架实战 (Frameworks)

**目标**：站在巨人的肩膀上造物。

### 3.1 LangChain (The Orchestrator)

- **Chains**: 顺序链、路由链。
- **Agents Types**: ReAct, OpenAI Functions Agent.
- **RAG 实现**: Loader -> Splitter -> Embedding -> VectorStore -> Retrieval.

### 3.2 LlamaIndex (Data Expert)

- 专注数据索引与查询，构建高质量 RAG 的首选。

### 3.3 什么是 ReAct 模式？

- **Reasoning + Acting**: "先想再做"。
- _案例_: 让 Agent 玩文字冒险游戏。

---

## 🤖 阶段四：单体 Agent 开发 (Single Agent)

**目标**：构建一个能独立干活的 AI 员工。

### 4.1 记忆增强 (RAG Advanced)

- **向量数据库**: Pinecone / Milvus / ChromaDB 实战。
- **高级检索**: Hybrid Search (关键词+向量), Re-ranking (重排序).

### 4.2 工具增强

- **Web Search**: 接入 Serper/Google Search API 让 AI 断网。
- **Code Interpreter**: 让 AI 写 Python 代码分析 Excel 表格。

### 4.3 项目实战：私人各种助手

- **论文阅读助手**: 上传 PDF，基于 RAG 回答问题。
- **股票分析师**: 调用 API 获取股价，画出 K 线图并分析趋势。

---

## 🤝 阶段五：多 Agent 系统 (Multi-Agent Systems)

**目标**：不仅要造员工，还要造“公司”。

### 5.1 协作模式

- **Hiring**: 老板 Agent 招募 员工 Agent。
- **Debate**: 两个 Agent 互喷（比如：正方反方辩论，互相挑错优化代码）。

### 5.2 框架实战

- **MetaGPT**: 基于 SOP (标准作业程序) 的软件开发团队（产品经理 -> 架构师 -> 工程师）。
- **AutoGen (Microsoft)**: 强大的多代理对话框架，支持人机协作。
- **CrewAI**: 更轻量级的角色扮演协作框架。

### 5.3 项目实战：虚拟软件公司

- 输入一句话需求：“写一个贪吃蛇游戏”。
- 观察 Product Manager 写文档，Architect 设计接口，Engineer 写代码，QA 提 Bug。

---

## 🛡️ 阶段六：评估与部署 (Evaluation & Ops)

**目标**：不仅能跑，还要跑得稳。

### 6.1 评估 (Eval)

- **RAGAS**: 评估 RAG 的检索准确率和生成质量。
- **AgentBench**: 给你的 Agent 跑个分。

### 6.2 部署与监控 (LLMOps)

- **LangSmith / LangFuse**: 看看 Agent 到底在后台想了什么（Tracing）。
- **部署**: 将 Agent 封装成 FastAPI 服务，或者部署到 Vercel (AI SDK).

---

## 🚀 阶段七：垂直领域应用 (Industry Use Cases)

**目标**：变现。

- **Coding Agent**: 类似 Devin 的自动编程助手。
- **Data Analyst**: 自动连接 SQL 数据库出报表。
- **NPC**: 游戏里有灵魂的路人甲。

---

> 💡 **Sensei 的建议**
>
> 别被这么多名词吓到。路线图看起来很长，但核心只有一句话：**Input (Prompt) -> LLM (Reasoning) -> Output (Action)**。
> 我们将从最简单的 `Hello World` 开始，一步步把这个循环玩出花来。
