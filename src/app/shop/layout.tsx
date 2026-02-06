import AppLayout from '@/components/AppLayout';

const navItems = [
  { href: '/shop', label: 'Dashboard', icon: 'layout-grid' as const },
  { href: '/shop/verify', label: 'Verify Customer', icon: 'clipboard-check' as const },
  { href: '/shop/inventory', label: 'Inventory', icon: 'package' as const },
  { href: '/shop/sales', label: 'Sales', icon: 'shopping-bag' as const },
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
