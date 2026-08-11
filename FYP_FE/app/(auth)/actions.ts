'use server';

import { z } from 'zod';
import { createDjangoSession, clearDjangoSession } from '@/lib/auth-session';

const DJANGO_URL = process.env.NEXT_PUBLIC_DJANGO_URL || 'http://localhost:8000';

const authFormSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export interface LoginActionState {
  status: 'idle' | 'in_progress' | 'success' | 'failed' | 'invalid_data';
  token?: string;
  email?: string;
}

export const login = async (
  _: LoginActionState,
  formData: FormData,
): Promise<LoginActionState> => {
  try {
    const validatedData = authFormSchema.parse({
      email: formData.get('email'),
      password: formData.get('password'),
    });

    const res = await fetch(`${DJANGO_URL}/api/auth/login/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: validatedData.email,
        password: validatedData.password,
      }),
    });

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      return { status: 'failed' };
    }

    const data = await res.json();
    await createDjangoSession(data.token, data.email);

    return { status: 'success', token: data.token, email: data.email };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { status: 'invalid_data' };
    }
    return { status: 'failed' };
  }
};

export interface RegisterActionState {
  status: 'idle' | 'in_progress' | 'success' | 'failed' | 'user_exists' | 'invalid_data';
  token?: string;
  email?: string;
}

export const register = async (
  _: RegisterActionState,
  formData: FormData,
): Promise<RegisterActionState> => {
  try {
    const validatedData = authFormSchema.parse({
      email: formData.get('email'),
      password: formData.get('password'),
    });

    const res = await fetch(`${DJANGO_URL}/api/auth/register/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: validatedData.email,
        password: validatedData.password,
      }),
    });

    if (res.status === 409) {
      return { status: 'user_exists' };
    }

    if (!res.ok) {
      return { status: 'failed' };
    }

    const data = await res.json();
    await createDjangoSession(data.token, data.email);

    return { status: 'success', token: data.token, email: data.email };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { status: 'invalid_data' };
    }
    return { status: 'failed' };
  }
};

export const logout = async () => {
  await clearDjangoSession();
};
