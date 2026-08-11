from django.contrib import admin
from django.urls import path
from Auth.views import register, login, verify_token
from ChatBot.views import chat_history, chat_create, chat_detail

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/auth/register/', register, name='auth_register'),
    path('api/auth/login/', login, name='auth_login'),
    path('api/auth/verify/', verify_token, name='auth_verify'),
    path('api/chat/history/', chat_history, name='chat_history'),
    path('api/chat/create/', chat_create, name='chat_create'),
    path('api/chat/<uuid:chat_id>/', chat_detail, name='chat_detail'),
]