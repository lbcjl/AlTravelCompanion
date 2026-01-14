# Go (Golang) 全栈后端开发学习大纲

> 🐹 **"Less is exponentially more."** —— Rob Pike
> 基于您的路线图，这份大纲将带您从 "Hello World" 走向云原生高并发架构师。Go 的哲学是“简单到令人发指”，但要写好却需要深厚的内功。

---

## 🏗️ 阶段一：语法基础 (Go Basics)

**目标**：写出会有 Go 味儿（Idiomatic）的代码，而不是带分号的 Java/C++。

### 1.1 核心语法

- **变量与类型**: `:=` 的魔法，零值 (Zero Value) 机制。
- **流程控制**: 只有 `for` 循环（死循环、while 都是它），`switch` 的高级用法。
- **函数是一等公民**: 多返回值（Go 的特色），闭包，延迟执行 (`defer` - 记得它是栈结构，先进后出)。

### 1.2 数据结构的坑

- **Array vs Slice**: 数组是值类型（很少用），切片才是真爱。
  - _Sensei 提问_: 修改切片里的元素，原数组会变吗？Append 扩容后呢？
- **Map**: 无序性，扩机制，并发读写 Panic。
- **Struct**: 没有 Class，只有结构体。

### 1.3 指针与内存

- **Pointers**: `*` 和 `&` 的区别。
- **New vs Make**: 到底什么时候用哪个？
- **Escape Analysis (逃逸分析)**: 变量到底是在栈上还是堆上？

---

## 🧩 阶段二：面向接口与工程化 (OOP & Engineering)

**目标**：理解“组合优于继承”的设计哲学。

### 2.1 独特的 OOP

- **Method**: 接收者 (Receiver) 指针与值的区别。
- **Interface**: 鸭子类型 (Duck Typing) —— "如果它走起来像鸭子，叫起来像鸭子，那它就是鸭子"。
- **Embed (嵌套)**: 假装我们在继承，其实我们在组合。

### 2.2 错误处理 (The Go Way)

- **Error Handling**: 哪怕写断手也要检查 `if err != nil`。
- **Panic & Recover**: 别把它当 Try-Catch 用，只在程序要挂的时候用。

### 2.3 依赖管理与测试

- **Go Modules**: `go.mod`, `go.sum`, `go get`, `go mod tidy`。
- **Unit Test**: `_test.go`, `testing.T`, Table-Driven Tests (表格驱动测试 - 必须掌握)。

---

## 🚀 阶段三：并发编程 (Concurrency)

**目标**：榨干 CPU 的每一个核。

### 3.1 Goroutine

- **协程**: 几 KB 的栈内存，启动百万个不是梦。
- **GMP 模型 (面试必问)**: M (内核线程), P (处理器), G (协程) 是怎么调度的？

### 3.2 Channel (通道)

- **哲学**: "Don't communicate by sharing memory, share memory by communicating."
- **模式**: Buffered vs Unbuffered, `select` 多路复用，关闭 Channel 的原则。

### 3.3 Sync 包

- **实战**: `Mutex` (互斥锁), `WaitGroup` (等待一组任务), `Once` (只执行一次 - 单例模式)。
- **Context**: 控制超时和取消一棵 Goroutine 树（后端开发神器）。

---

## 🌐 阶段四：Web 开发 (Web Development)

**目标**：构建高性能的 HTTP API。

### 4.1 标准库 `net/http`

- 路由处理，中间件编写，JSON 解析 (`encoding/json`)。

### 4.2 Web 框架

- **Gin**: 最流行的轻量级框架，性能彪悍。
- **Echo**: 极简主义者的最爱。
- **Fiber**: 基于 fasthttp，追求极致性能。

### 4.3 数据库交互

- **SQL**: `database/sql` 标准库与连接池。
- **ORM**: GORM (功能全但重) vs SQLX (轻量级包装) vs Ent (Facebook 出品)。
- **NoSQL**: Redis (`go-redis`), MongoDB 驱动。

---

## 🛡️ 阶段五：微服务与架构 (Microservices)

**目标**：从单体应用拆分到分布式系统。

### 5.1 RPC 与 协议

- **gRPC**: Protobuf 定义接口，生成代码。比 JSON 高效得多。
- **RPC 核心**: 序列化，网络传输，服务调用。

### 5.2 微服务治理

- **服务发现**: Consul / Etcd。
- **配置中心**: Viper + 远程配置。
- **链路追踪**: OpenTelemetry / Jaeger。

### 5.3 消息队列

- **Kafka / RabbitMQ**: 异步解耦，削峰填谷。

---

## ☁️ 阶段六：云原生 (Cloud Native)

**目标**：让你的 Go 代码在 Docker 和 K8s 里如鱼得水。

### 6.1 Containerization

- **Dockerfile**: 多阶段构建 (Multi-stage build) —— 产出只有 10MB 的极小镜像。

### 6.2 Kubernetes (K8s)

- 理解 Pod, Deployment, Service。
- 使用 Go 编写 K8s Operator (高阶玩法)。

---

## 🏎️ 阶段七：性能调优 (Performance)

**目标**：快，更快，最快。

- **Benchmark**: 基准测试。
- **Pprof**: CPU/Memory 火焰图分析，抓出性能瓶颈。
- **GC 调优**: 理解三色标记法，减少 STW (Stop The World) 时间。

---

> 💡 **Sensei 的建议**
>
> 1.  **少用反射 (Reflection)**: Go 的反射慢且晦涩，除非你在写框架，否则业务代码里少用。
> 2.  **不要炫技**: Go 鼓励简单的代码。如果你写了一段很聪明的代码，记得加上注释，或者重写得笨一点。
> 3.  **多读源码**: Go 的标准库代码是最好的教材。
