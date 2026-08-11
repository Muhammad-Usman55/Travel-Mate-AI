const DJANGO_URL = process.env.NEXT_PUBLIC_DJANGO_URL || 'http://localhost:8000';

interface DjangoAuthResponse {
  token?: string;
  email?: string;
  error?: string;
}

async function djangoFetch(endpoint: string, body: Record<string, string>): Promise<DjangoAuthResponse> {
  const res = await fetch(`${DJANGO_URL}${endpoint}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  const data = await res.json();
  if (!res.ok) {
    return { error: data.error || `Request failed (${res.status})` };
  }
  return data;
}

export async function loginDjango(email: string, password: string): Promise<{ token: string | null; error: string | null }> {
  try {
    const data = await djangoFetch('/api/auth/login/', { email, password });
    if (data.error) return { token: null, error: data.error };
    if (data.token) {
      localStorage.setItem('auth_token', data.token);
      localStorage.setItem('auth_email', data.email || email);
      return { token: data.token, error: null };
    }
    return { token: null, error: 'No token received from server' };
  } catch (e) {
    return { token: null, error: 'Cannot connect to server. Is the backend running?' };
  }
}

export async function registerDjango(email: string, password: string): Promise<{ token: string | null; error: string | null }> {
  try {
    const data = await djangoFetch('/api/auth/register/', { email, password });
    if (data.error) return { token: null, error: data.error };
    if (data.token) {
      localStorage.setItem('auth_token', data.token);
      localStorage.setItem('auth_email', data.email || email);
      return { token: data.token, error: null };
    }
    return { token: null, error: 'No token received from server' };
  } catch (e) {
    return { token: null, error: 'Cannot connect to server. Is the backend running?' };
  }
}

export function getAuthToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('auth_token');
}

export function logoutDjango() {
  localStorage.removeItem('auth_token');
  localStorage.removeItem('auth_email');
}
