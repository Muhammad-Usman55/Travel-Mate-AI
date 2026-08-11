'use client';

import { ChevronUp } from 'lucide-react';
import Image from 'next/image';
import { useTheme } from '@/components/theme-provider';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';
import { useRouter } from 'next/navigation';
import { useAppDispatch } from '@/lib/redux/hooks';
import { clearMessages } from '@/lib/redux/chatSlice';
import type { AppUser } from '@/lib/get-session';

export function SidebarUserNav({ user }: { user: AppUser }) {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { setTheme, resolvedTheme } = useTheme();

  const handleSignOut = async () => {
    dispatch(clearMessages());
    localStorage.removeItem('auth_token');
    localStorage.removeItem('auth_email');
    await fetch('/api/django-logout', { method: 'POST' });
    router.push('/');
  };

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              data-testid="user-nav-button"
              className="data-[state=open]:bg-sidebar-accent bg-background data-[state=open]:text-sidebar-accent-foreground h-10"
            >
              <Image
                src={`https://avatar.vercel.sh/${encodeURIComponent(user.email)}`}
                alt={user.email ?? 'User Avatar'}
                width={24}
                height={24}
                className="rounded-full"
              />
              <span data-testid="user-email" className="truncate">{user.email}</span>
              <ChevronUp className="ml-auto" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            data-testid="user-nav-menu"
            side="top"
            className="w-[--radix-popper-anchor-width]"
          >
            <DropdownMenuItem
              data-testid="user-nav-item-theme"
              className="cursor-pointer"
              onSelect={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}
            >
              {`Toggle ${resolvedTheme === 'light' ? 'dark' : 'light'} mode`}
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild data-testid="user-nav-item-auth">
              <button type="button" className="w-full cursor-pointer" onClick={handleSignOut}>
                Sign out
              </button>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
