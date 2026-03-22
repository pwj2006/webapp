from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth.models import User
from django.contrib.auth import authenticate


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
        return Response({"message": "登录成功", "username": user.username}, status=status.HTTP_200_OK)
    else:
        return Response({"error": "用户名或密码错误"}, status=status.HTTP_401_UNAUTHORIZED)
