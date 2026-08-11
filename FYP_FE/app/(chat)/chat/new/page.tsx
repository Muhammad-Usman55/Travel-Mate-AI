import { redirect } from 'next/navigation';

import { WebSocketChat } from '@/components/websocket-chat';
import { generateUUID } from '@/lib/utils';
import { getAppSession } from '@/lib/get-session';

export default async function Page() {
  const id = generateUUID();
  const session = await getAppSession();

  if (!session?.user) redirect('/login?callbackUrl=/chat/new');

  return (
    <WebSocketChat
      key={id}
      id={id}
      session={session}
    />
  );
}
