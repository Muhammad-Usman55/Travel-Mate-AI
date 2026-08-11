import secrets
import hashlib
from django.db import models

class AuthUser(models.Model):
    email = models.EmailField(unique=True)
    password_hash = models.CharField(max_length=128)
    created_at = models.DateTimeField(auto_now_add=True)

class AuthToken(models.Model):
    user = models.ForeignKey(AuthUser, on_delete=models.CASCADE, related_name='tokens')
    token = models.CharField(max_length=64, unique=True)
    created_at = models.DateTimeField(auto_now_add=True)

    @classmethod
    def generate_token(cls, user):
        token_str = secrets.token_hex(32)
        return cls.objects.create(user=user, token=token_str)
