import { clearDjangoSession } from '@/lib/auth-session';

export async function POST() {
  await clearDjangoSession();
  return Response.json({ success: true });
}
