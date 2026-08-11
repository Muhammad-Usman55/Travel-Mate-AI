import { notFound, redirect } from 'next/navigation';

import { WebSocketChat } from '@/components/websocket-chat';
import { getAppSession } from '@/lib/get-session';
import { getDjangoSession } from '@/lib/auth-session';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function Page({ params }: PageProps) {
  const { id } = await params;
  const session = await getAppSession();

  if (!session?.user) redirect(`/login?callbackUrl=/chat/${id}`);

  // Verify the chat exists and belongs to this user via Django
  const djangoSession = await getDjangoSession();
  const djangoUrl = process.env.NEXT_PUBLIC_DJANGO_URL || 'http://localhost:8000';

  if (djangoSession) {
    try {
      const res = await fetch(`${djangoUrl}/api/chat/${id}/`, {
        headers: { Authorization: `Bearer ${djangoSession.token}` },
      });
      if (!res.ok) notFound();
    } catch {
      notFound();
    }
  }

  return (
    <WebSocketChat
      key={id}
      id={id}
      session={session}
    />
  );
}
