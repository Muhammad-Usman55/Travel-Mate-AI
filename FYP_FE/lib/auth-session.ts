import { createHash } from 'crypto';
import { cookies } from 'next/headers';
import { encode, decode } from 'next-auth/jwt';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

const UUID_DNS_NAMESPACE = Buffer.from('6ba7b810-9dad-11d1-80b4-00c04fd430c8', 'hex');

export function generateUUIDv5(name: string): string {
  const hash = createHash('sha1').update(UUID_DNS_NAMESPACE).update(Buffer.from(name, 'utf-8')).digest();
  hash[6] = (hash[6] & 0x0f) | 0x50;
  hash[8] = (hash[8] & 0x3f) | 0x80;
  const hex = hash.toString('hex');
  return [
    hex.substring(0, 8),
    hex.substring(8, 12),
    hex.substring(12, 16),
    hex.substring(16, 20),
    hex.substring(20, 32),
  ].join('-');
}

const COOKIE_NAME = 'django-session';
const SECRET = process.env.AUTH_SECRET!;
const SALT = 'django-session';
const MAX_AGE = 60 * 60 * 24 * 7; // 7 days

interface DjangoTokenPayload {
  token: string;
  email: string;
  type: 'django';
  iat?: number;
  exp?: number;
}

export interface DjangoSession {
  token: string;
  email: string;
  type: 'django';
}

export async function createDjangoSession(token: string, email: string) {
  const jwt = await encode({
    secret: SECRET,
    salt: SALT,
    token: { token, email, type: 'django' },
    maxAge: MAX_AGE,
  });
  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, jwt, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: MAX_AGE,
  });
}

export async function clearDjangoSession() {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
}

export async function getDjangoSession(): Promise<DjangoSession | null> {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get(COOKIE_NAME);
  if (!sessionCookie) return null;

  try {
    const decoded = await decode({
      token: sessionCookie.value,
      secret: SECRET,
      salt: SALT,
    }) as DjangoTokenPayload | null;
    if (decoded?.type === 'django' && decoded.token && decoded.email) {
      return { token: decoded.token, email: decoded.email, type: 'django' };
    }
    return null;
  } catch {
    return null;
  }
}

export function getDjangoSessionFromRequest(request: NextRequest): Promise<DjangoSession | null> {
  return getToken({
    req: request,
    secret: SECRET,
    salt: SALT,
    cookieName: COOKIE_NAME,
  }) as Promise<DjangoSession | null>;
}

export async function verifyWithDjango(token: string): Promise<{ valid: boolean; email?: string } | null> {
  try {
    const url = process.env.NEXT_PUBLIC_DJANGO_URL || 'http://localhost:8000';
    const res = await fetch(`${url}/api/auth/verify/`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) return { valid: false };
    const data = await res.json();
    return { valid: data.valid ?? true, email: data.email };
  } catch {
    return null;
  }
}
