# webapp (React + Django)

## 环境配置 & 初次登录（conda）

后端：Django + Django REST Framework

1. 激活环境：

   ```powershell
   conda activate webapp
   ```

2. 安装依赖：

   ```powershell
   pip install -r backend/requirements.txt
   ```

3. 运行迁移并启动开发服务器：

   ```powershell
   cd backend
   python manage.py migrate
   python manage.py runserver
   ```

或者使用 Docker ：

```bash
docker compose up --build
```

前端（React）

1. 本地开发：

   ```powershell
   cd frontend
   npm install
   npm start
   ```

   打开： `http://localhost:3000`（前端会把 `/api` 请求代理到后端）

或者使用 Docker （一键启动前后端 + Postgres ）：

```bash
docker compose up --build
```