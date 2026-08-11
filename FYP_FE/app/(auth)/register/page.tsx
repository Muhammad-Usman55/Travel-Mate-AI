'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useActionState, useEffect, useRef, useState } from 'react';

import { AuthForm } from '@/components/auth-form';
import { SubmitButton } from '@/components/submit-button';

import { register, type RegisterActionState } from '../actions';
import { toast } from '@/components/toast';

export default function Page() {
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSuccessful, setIsSuccessful] = useState(false);

  const [state, formAction] = useActionState<RegisterActionState, FormData>(
    register,
    { status: 'idle' },
  );

  const handledSuccess = useRef(false);

  useEffect(() => {
    if (state.status === 'user_exists') {
      toast({ type: 'error', description: 'Account already exists!' });
      return;
    }
    if (state.status === 'failed') {
      toast({ type: 'error', description: 'Failed to create account!' });
      return;
    }
    if (state.status === 'invalid_data') {
      toast({ type: 'error', description: 'Please provide a valid email and password (min 6 characters).' });
      return;
    }
    if (state.status === 'success' && !handledSuccess.current) {
      handledSuccess.current = true;
      setIsSuccessful(true);

      if (state.token) {
        localStorage.setItem('auth_token', state.token);
        localStorage.setItem('auth_email', state.email || email);
      }

      toast({ type: 'success', description: 'Account created successfully!' });
      setTimeout(() => router.push('/'), 500);
    }
  }, [state.status]);

  const handleSubmit = (formData: FormData) => {
    setEmail(formData.get('email') as string);
    setPassword(formData.get('password') as string);
    handledSuccess.current = false;
    formAction(formData);
  };

  return (
    <div className="flex min-h-dvw w-full items-center justify-center bg-gradient-to-br from-slate-50 via-white to-teal-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      <div className="w-full max-w-md mx-4">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-3 mb-6">
            <div className="w-10 h-10 travel-gradient rounded-xl flex items-center justify-center shadow-sm overflow-hidden">
              <Image
                src="/logo_mark_icon.png"
                alt="TravelMate"
                width={40}
                height={40}
                className="w-full h-full object-cover"
              />
            </div>
          </Link>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Create your account</h1>
          <p className="text-slate-500 dark:text-slate-400">Join TravelMate AI and start planning smarter</p>
        </div>

        <div className="bg-white dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 p-6">
          <AuthForm action={handleSubmit} defaultEmail={email}>
            <SubmitButton isSuccessful={isSuccessful}>Sign Up</SubmitButton>
            <p className="text-center text-sm text-slate-500 mt-4">
              {'Already have an account? '}
              <Link href="/login" className="font-semibold brand-text hover:underline">Sign in</Link>
              {' instead.'}
            </p>
          </AuthForm>
        </div>

        <div className="text-center mt-6">
          <Link href="/" className="text-sm text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors inline-flex items-center gap-1">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to home
          </Link>
        </div>
      </div>
    </div>
  );
}
