import AppLayout from '@/components/AppLayout';
import { Shield, Users, Warehouse } from 'lucide-react';

const navItems = [
  { href: '/admin', label: 'Dashboard', icon: Shield },
  { href: '/admin/shops', label: 'Shops', icon: Warehouse },
  { href: '/admin/users', label: 'Users', icon: Users },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AppLayout
      navItems={navItems}
      title="Admin Panel"
      description="Manage shops, users, and system settings."
    >
      {children}
    </AppLayout>
  );
}
