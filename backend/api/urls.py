from django.urls import path
from .views import hello, login_view, register_view

urlpatterns = [
    path("hello/", hello, name="hello"),
    path("users/login/", login_view, name="login"),
    path("users/register/", register_view, name="register"),
]
