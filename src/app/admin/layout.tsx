'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import AppLayout from '@/components/AppLayout';
import { Shield, Users, Warehouse } from 'lucide-react';
import { Logo } from '@/components/icons';
import { Button } from '@/components/ui/button';

const navItems = [
  { href: '/admin', label: 'Dashboard', icon: Shield },
  { href: '/admin/shops', label: 'Shops', icon: Warehouse },
  { href: '/admin/users', label: 'Users', icon: Users },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [authStatus, setAuthStatus] = useState<'loading' | 'authenticated' | 'unauthenticated'>('loading');

  useEffect(() => {
    try {
        const loggedIn = localStorage.getItem('admin_logged_in') === 'true';
        if (loggedIn) {
          setAuthStatus('authenticated');
        } else {
          setAuthStatus('unauthenticated');
          router.replace('/admin/login');
        }
    } catch (error) {
        console.error('Could not access localStorage', error);
        setAuthStatus('unauthenticated');
        router.replace('/admin/login');
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleLogout = () => {
    try {
        localStorage.removeItem('admin_logged_in');
    } catch (error) {
        console.error('Could not access localStorage', error);
    }
    setAuthStatus('unauthenticated');
    router.replace('/admin/login');
  };

  if (authStatus !== 'authenticated') {
    // Show loader while loading or before redirecting
    return (
        <div className="flex min-h-screen items-center justify-center">
            <Logo className="h-16 w-16 text-primary animate-pulse" />
        </div>
    );
  }
  
  return (
    <AppLayout
      navItems={navItems}
      title="Admin Panel"
      description="Manage shops, users, and system settings."
      headerActions={<Button variant="outline" onClick={handleLogout}>Logout</Button>}
    >
      {children}
    </AppLayout>
  );
}
