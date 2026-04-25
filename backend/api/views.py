from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth.models import User
from django.contrib.auth import authenticate
import jwt
import uuid
from datetime import datetime, timedelta
from django.conf import settings
from .models import Project

@api_view(["GET"])
def hello(request):
    return Response({"message": "Hello from Django + DRF"})

@api_view(["POST"])
def register_view(request):
    username = request.data.get("username")
    password = request.data.get("password")

    if not username or not password:
        return Response({"error": "请提供用户名和密码"}, status=status.HTTP_400_BAD_REQUEST)

    # 检查用户名是否已存在在 SQLite 数据库中
    if User.objects.filter(username=username).exists():
        return Response({"error": "用户名已被占用"}, status=status.HTTP_400_BAD_REQUEST)

    # 创建新用户 (create_user 方法会自动对密码进行哈希加密，安全存入数据库)
    user = User.objects.create_user(username=username, password=password)
    return Response({"message": "注册成功", "username": user.username}, status=status.HTTP_201_CREATED)

@api_view(["POST"])
def login_view(request):
    username = request.data.get("username")
    password = request.data.get("password")

    # authenticate 会自动查找用户，并安全地比对哈希密码
    user = authenticate(username=username, password=password)
    
    if user is not None:
        # 生成 JWT token
        payload = {
            'user_id': user.id,
            'username': user.username,
            'exp': datetime.utcnow() + timedelta(hours=24),  # Token 24小时后过期
            'iat': datetime.utcnow()
        }
        # 使用 Django 的 SECRET_KEY 进行签名
        jwt_token = jwt.encode(payload, settings.SECRET_KEY, algorithm='HS256')
        return Response({"message": "登录成功", "token": jwt_token}, status=status.HTTP_200_OK)
    else:
        return Response({"error": "用户名或密码错误"}, status=status.HTTP_401_UNAUTHORIZED)

@api_view(["GET"])
def projects_view(request):
    # 验证 JWT Token 确保用户已登录
    auth_header = request.headers.get('Authorization')
    if not auth_header or not auth_header.startswith('Bearer '):
        return Response({"code": 401, "msg": "未登录或缺少Token", "data": None}, status=status.HTTP_401_UNAUTHORIZED)
    
    token = auth_header.split(' ')[1]
    try:
        # 解码并验证 token
        jwt.decode(token, settings.SECRET_KEY, algorithms=['HS256'])
    except jwt.ExpiredSignatureError:
        return Response({"code": 401, "msg": "Token已过期，请重新登录", "data": None}, status=status.HTTP_401_UNAUTHORIZED)
    except jwt.InvalidTokenError:
        return Response({"code": 401, "msg": "无效的Token", "data": None}, status=status.HTTP_401_UNAUTHORIZED)

    # 从数据库获取项目数据
    projects = Project.objects.all()
    project_list = []
    for p in projects:
        project_list.append({
            "project_id": p.project_id,
            "name": p.name,
            "location": p.location,
            "status": p.status,
            "my_role": p.my_role,
            "interview_time": p.interview_time.strftime("%Y-%m-%d") if p.interview_time else None,
            "member_count": p.member_count,
            "task_count": p.task_count,
            "overdue_count": p.overdue_count,
            "progress": p.progress
        })

    data = {
        "total": projects.count(),
        "projects": project_list
    }
    
    return Response({
        "code": 200,
        "msg": "success",
        "data": data
    }, status=status.HTTP_200_OK)

@api_view(["POST"])
def create_project_view(request):
    # 验证 JWT Token 确保用户已登录
    auth_header = request.headers.get('Authorization')
    if not auth_header or not auth_header.startswith('Bearer '):
        return Response({"code": 401, "msg": "未登录或缺少Token", "data": None}, status=status.HTTP_401_UNAUTHORIZED)
    
    token = auth_header.split(' ')[1]
    try:
        jwt.decode(token, settings.SECRET_KEY, algorithms=['HS256'])
    except (jwt.ExpiredSignatureError, jwt.InvalidTokenError):
        return Response({"code": 401, "msg": "Token无效或已过期", "data": None}, status=status.HTTP_401_UNAUTHORIZED)

    data = request.data
    name = data.get("name", "").strip()
    if not name:
        return Response({"code": 400, "msg": "项目名称不能为空"}, status=status.HTTP_400_BAD_REQUEST)

    status_val = data.get("status", "preparing")
    if status_val not in ["preparing", "ongoing", "ended", "archived"]:
        status_val = "preparing"

    def get_date_or_none(date_str):
        return date_str if date_str and str(date_str).strip() else None

    project = Project.objects.create(
        project_id=f"p{uuid.uuid4().hex[:8]}",
        name=name,
        description=data.get("description", ""),
        location=data.get("location", ""),
        status=status_val,
        start_date=get_date_or_none(data.get("start_date")),
        end_date=get_date_or_none(data.get("end_date")),
        interview_time=get_date_or_none(data.get("interview_time")),
        captain_id=data.get("captain_id", ""),
        my_role="captain" if data.get("captain_id") else "manager", # 指定了支队长ID则默认分配队长角色
        member_count=1 if data.get("captain_id") else 0
    )

    return Response({"code": 200, "msg": "项目创建成功", "data": {"project_id": project.project_id}}, status=status.HTTP_201_CREATED)
