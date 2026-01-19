# 🚀 零成本部署指南 (Free Deployment Guide)

本指南教你如何使用 **Vercel** (前端) + **Render** (后端) + **Neon/Supabase** (数据库) 免费托管你的应用。

## 1. 准备工作

确认你已经安装了 Git 并将代码推送到 GitHub。

## 2. 数据库 (Neon / Supabase)

由于免费部署平台（如 Render）的文件系统是临时的（重启后文件会丢失），**SQLite 无法持久保存数据**。建议申请一个免费的 PostgreSQL 数据库。

1.  访问 [Neon.tech](https://neon.tech/) 或 [Supabase.com](https://supabase.com/) 注册账号。
2.  创建一个新项目 (Project)。
3.  获取 **Connection String** (连接字符串)，格式如下：
    `postgres://user:password@host:port/database?sslmode=require`
4.  **保存好这个字符串**，稍后后端部署要用。

## 3. 后端部署 (Render)

Render 提供免费的 Web Service 托管。

1.  访问 [Render.com](https://render.com/) 并注册。
2.  点击 **New +** -> **Web Service** -> 连接你的 GitHub 仓库。
3.  选择仓库后，填写配置：
    - **Name**: `ai-travel-backend`
    - **Root Directory**: `backend` (非常重要！)
    - **Environment**: `Node`
    - **Build Command**: `pnpm install && pnpm build`
    - **Start Command**: `node dist/main`
    - **Plan**: Free
4.  向下滚动找到 **Environment Variables** (环境变量)，添加：
    - `POSTGRES_URL`: (步骤 2 中获取的数据库连接字符串)
    - `AMAP_WEB_API_KEY`: (你的高德 Web 服务 Key)
    - `QWEN_API_KEY`: (你的阿里云通义千问 Key)
    - `QWEN_MODEL`: `qwen-max`
5.  点击 **Create Web Service**。等待部署完成（约几分钟）。
6.  部署成功后，复制页面左上角的 URL (例如 `https://ai-travel-backend.onrender.com`)。

## 4. 前端部署 (Vercel)

1.  访问 [Vercel.com](https://vercel.com/) 并注册。
2.  点击 **Add New...** -> **Project** -> 导入你的 GitHub 仓库。
3.  配置项目：
    - **Framework Preset**: Vite
    - **Root Directory**: 点击 Edit，选择 `frontend` 目录。
    - **Environment Variables**:
      - `VITE_AMAP_JS_API_KEY`: (你的高德 JS API Key)
      - `VITE_AMAP_SECURITY_KEY`: (你的高德安全密钥)
4.  **关键步骤**：让前端能连上后端。
    - 在项目根目录添加 `vercel.json` 文件（见下方代码），配置 API 代理。
    - 或者，修改前端 `vite.config.ts` 中的 target 为你的 Render 后端地址（但 Vercel 部署最好用 `vercel.json` 代理）。

### 创建 `frontend/vercel.json`

在 `frontend` 目录下新建文件：

```json
{
	"rewrites": [
		{
			"source": "/api/(.*)",
			"destination": "https://你的Render后端地址.onrender.com/api/$1"
		}
	]
}
```

(记得把 `destination` 换成你刚才在 Render 获得的真实 URL)

5.  提交代码到 GitHub。
6.  Vercel 会自动触发构建并部署。

## 5. 完成！

访问 Vercel 给你的域名，你的 AI 旅行规划师应该就上线了！

---

### ⚠️ 注意事项

- **Render 免费版限制**：后端服务如果 15 分钟没人访问会自动休眠。下次访问时需要等待 30-50 秒启动（Cold Start）。这是正常的。
- **SQLite**：如果你不想用 Postgres，可以不配 `POSTGRES_URL`，后端会默认用 SQLite。但每次 Render 重启（或重新部署），**所有聊天记录都会丢失**。仅供演示使用。
