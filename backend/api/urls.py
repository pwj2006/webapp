from django.urls import path
from .views import hello, login_view, register_view

urlpatterns = [
    path("hello/", hello, name="hello"),
    path("login/", login_view, name="login"),
    path("register/", register_view, name="register"),
]
