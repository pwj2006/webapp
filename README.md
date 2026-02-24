# webapp (React + Django)

后端：Django + Django REST Framework

快速开始（conda）

1. 激活环境：

   ```powershell
   conda activate webapp
   ```

2. 安装（如果还没安装）：

   ```powershell
   pip install -r backend/requirements.txt
   ```

3. 运行迁移并启动开发服务器：

   ```powershell
   cd backend
   python manage.py migrate
   python manage.py runserver
   ```

使用 Docker（开发）：

```bash
docker compose up --build
```

API 示例：
- GET /api/hello → 返回简单 JSON 消息

前端（Create React App）

1. 本地开发：

   ```powershell
   cd frontend
   npm install
   npm start
   ```

   打开： `http://localhost:3000`（前端会把 `/api` 请求代理到后端）

2. 使用 Docker（一键启动前后端 + Postgres）：

```bash
docker compose up --build
```

访问：
- 前端： `http://localhost:3000`
- 后端 API： `http://localhost:8000/api/hello/`

说明：前端开发服务器在 Compose 中依赖 `web`（后端），后端已启用 CORS（开发模式）。

后端启动
conda activate webapp
cd backend
(webapp) C:\Users\AW\Desktop\webapp\backend>python manage.py runserver 8000

前端启动
cd frontend
npm start