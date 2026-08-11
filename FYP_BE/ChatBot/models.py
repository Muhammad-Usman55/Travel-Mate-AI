import uuid
from django.db import models
from Auth.models import AuthUser


class Chat(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(AuthUser, on_delete=models.CASCADE, related_name='chats')
    title = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    visibility = models.CharField(
        max_length=10,
        choices=[('public', 'Public'), ('private', 'Private')],
        default='private',
    )

    class Meta:
        ordering = ['-created_at']


class Message(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    chat = models.ForeignKey(Chat, on_delete=models.CASCADE, related_name='messages')
    role = models.CharField(max_length=20)
    content = models.JSONField()
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['created_at']
