import AppLayout from '@/components/AppLayout';
import { ClipboardCheck, LayoutGrid, Package, ShoppingBag } from 'lucide-react';

const navItems = [
  { href: '/shop', label: 'Dashboard', icon: LayoutGrid },
  { href: '/shop/verify', label: 'Verify Customer', icon: ClipboardCheck },
  { href: '/shop/inventory', label: 'Inventory', icon: Package },
  { href: '/shop/sales', label: 'Sales', icon: ShoppingBag },
];

export default function ShopLayout({ children }: { children: React.ReactNode }) {
  return (
    <AppLayout
      navItems={navItems}
      title="Shopkeeper Portal"
      description="Manage your shop, sales, and customer flow."
    >
      {children}
    </AppLayout>
  );
}
