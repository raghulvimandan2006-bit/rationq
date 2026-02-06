'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarTrigger,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarInset,
} from '@/components/ui/sidebar';
import { Logo } from '@/components/icons';
import { getIcon } from '@/lib/icon-map';
import type { NavItem } from '@/lib/types';

interface AppLayoutProps {
  children: React.ReactNode;
  navItems: NavItem[];
  title: string;
  description: string;
  headerActions?: React.ReactNode;
}

export default function AppLayout({
  children,
  navItems,
  title,
  description,
  headerActions,
}: AppLayoutProps) {
  const pathname = usePathname();

  return (
    <SidebarProvider>
      <div className="min-h-screen">
        <Sidebar>
          <SidebarHeader className="p-4">
            <Link href="/" className="flex items-center gap-2">
              <Logo className="w-8 h-8 text-primary" />
              <span className="font-bold text-lg">RationQ</span>
            </Link>
          </SidebarHeader>
          <SidebarContent>
            <SidebarMenu>
              {navItems.map((item) => {
                const Icon = getIcon(item.icon);
                return (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton
                      asChild
                      isActive={pathname === item.href}
                      tooltip={{ children: item.label }}
                    >
                      <Link href={item.href}>
                        <Icon />
                        <span>{item.label}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarContent>
        </Sidebar>
        <SidebarInset>
          <header className="flex h-14 items-center gap-4 border-b bg-card/50 px-6 sticky top-0 z-30">
            <SidebarTrigger className="md:hidden" />
            <div className="flex-1">
              <h1 className="text-lg font-semibold">{title}</h1>
              <p className="text-sm text-muted-foreground hidden md:block">{description}</p>
            </div>
            {headerActions && <div>{headerActions}</div>}
          </header>
          <main className="flex-1 p-6">{children}</main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
