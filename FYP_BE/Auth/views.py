import hashlib
import secrets
import json
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
from .models import AuthUser, AuthToken

def hash_password(password: str) -> str:
    salt = secrets.token_hex(16)
    return f"{salt}${hashlib.sha256((salt + password).encode()).hexdigest()}"

def check_password(password: str, stored: str) -> bool:
    salt, hsh = stored.split('$', 1)
    return hashlib.sha256((salt + password).encode()).hexdigest() == hsh

@csrf_exempt
@require_http_methods(["POST"])
def register(request):
    try:
        data = json.loads(request.body)
        email = data.get('email', '').strip()
        password = data.get('password', '')
        if not email or not password:
            return JsonResponse({'error': 'Email and password required'}, status=400)
        if AuthUser.objects.filter(email=email).exists():
            return JsonResponse({'error': 'User already exists'}, status=409)
        user = AuthUser.objects.create(email=email, password_hash=hash_password(password))
        token = AuthToken.generate_token(user)
        return JsonResponse({'token': token.token, 'email': user.email})
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)

@csrf_exempt
@require_http_methods(["POST"])
def login(request):
    try:
        data = json.loads(request.body)
        email = data.get('email', '').strip()
        password = data.get('password', '')
        try:
            user = AuthUser.objects.get(email=email)
        except AuthUser.DoesNotExist:
            return JsonResponse({'error': 'Invalid credentials'}, status=401)
        if not check_password(password, user.password_hash):
            return JsonResponse({'error': 'Invalid credentials'}, status=401)
        token = AuthToken.generate_token(user)
        return JsonResponse({'token': token.token, 'email': user.email})
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)

@csrf_exempt
@require_http_methods(["GET"])
def verify_token(request):
    auth = request.headers.get('Authorization', '')
    token_str = auth.replace('Bearer ', '') if auth.startswith('Bearer ') else ''
    try:
        token = AuthToken.objects.select_related('user').get(token=token_str)
        return JsonResponse({'valid': True, 'email': token.user.email})
    except AuthToken.DoesNotExist:
        return JsonResponse({'valid': False}, status=401)
