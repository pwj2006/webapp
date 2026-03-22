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

## 后续登录

后端启动 (cmd)

```powershell
conda activate 
cd backend
python manage.py runserver 8000
```

前端启动 (powershell)

```
cd frontend
npm start
```

## SQLite 数据库查看

默认情况下，Django 会在 `backend/db.sqlite3` 生成数据库文件。你可以用以下方式查看：

方式一：Django 自带 `dbshell`

```powershell
cd backend
python manage.py dbshell
```

进入后可执行：

```sql
.tables
SELECT * FROM auth_user;
```

方式二：使用 sqlite3 命令行

```powershell
cd backend
sqlite3 db.sqlite3
```

常用命令：

```sql
.tables
.schema
SELECT * FROM api_yourmodel LIMIT 20;
```

方式三：图形化工具（可选）

推荐使用 DB Browser for SQLite 或者 TablePlus，直接打开 `backend/db.sqlite3` 查看数据。
