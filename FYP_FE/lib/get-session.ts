import { getDjangoSession, generateUUIDv5, verifyWithDjango } from './auth-session';

export interface AppUser {
  id: string;
  email: string;
  type: 'django';
  token?: string;
  name?: string | null;
  image?: string | null;
}

export interface AppSession {
  user: AppUser;
}

export async function getAppSession(): Promise<AppSession | null> {
  const djangoSession = await getDjangoSession();
  if (!djangoSession) return null;

  const verification = await verifyWithDjango(djangoSession.token);
  if (verification?.valid === false) return null;

  return {
    user: {
      id: generateUUIDv5(djangoSession.email),
      email: djangoSession.email,
      type: 'django',
      token: djangoSession.token,
    },
  };
}
