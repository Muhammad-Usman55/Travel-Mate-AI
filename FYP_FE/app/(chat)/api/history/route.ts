import { type NextRequest, NextResponse } from 'next/server';
import { getDjangoSession } from '@/lib/auth-session';

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const djangoSession = await getDjangoSession();
  if (!djangoSession) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  }

  const limit = searchParams.get('limit') || '20';
  const startingAfter = searchParams.get('starting_after');
  const endingBefore = searchParams.get('ending_before');

  const params = new URLSearchParams({ limit });
  if (startingAfter) params.set('starting_after', startingAfter);
  if (endingBefore) params.set('ending_before', endingBefore);

  const djangoUrl = process.env.NEXT_PUBLIC_DJANGO_URL || 'http://localhost:8000';
  const res = await fetch(`${djangoUrl}/api/chat/history/?${params}`, {
    headers: { Authorization: `Bearer ${djangoSession.token}` },
  });

  if (!res.ok) {
    return NextResponse.json({ error: 'failed to fetch history' }, { status: res.status });
  }

  const data = await res.json();

  // Remap snake_case fields from Django to camelCase for frontend
  const chats = (Array.isArray(data) ? data : []).map((chat: Record<string, unknown>) => ({
    id: chat.id,
    title: chat.title,
    createdAt: chat.created_at,
    visibility: chat.visibility,
  }));

  return NextResponse.json({ chats, hasMore: chats.length >= Number(limit) });
}
