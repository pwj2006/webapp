from django.urls import path
from .views import hello, register, login, me, logout

urlpatterns = [
    path("hello/", hello, name="hello"),
    path("auth/register/", register, name="register"),
    path("auth/login/", login, name="login"),
    path("auth/me/", me, name="me"),
    path("auth/logout/", logout, name="logout"),
]
