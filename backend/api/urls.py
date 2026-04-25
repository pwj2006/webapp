from django.urls import path
from .views import hello, login_view, register_view, projects_view, create_project_view

urlpatterns = [
    path("hello/", hello, name="hello"),
    path("users/login/", login_view, name="login"),
    path("users/register/", register_view, name="register"),
    path("projects/", projects_view, name="projects"),
    path("projects/create/", create_project_view, name="create_project"),
]
