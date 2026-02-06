import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import { users, shops, bookings } from '@/lib/data';
import DashboardClient from './DashboardClient';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Logo } from '@/components/icons';

export const dynamic = 'force-dynamic';

export default function DashboardPage({
  searchParams,
}: {
  searchParams: { card_id?: string };
}) {
  const cardId = searchParams.card_id;

  if (!cardId) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Card className="w-full max-w-md text-center">
            <CardHeader>
                <CardTitle>Access Denied</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <p>Please log in with your ration card number to view this page.</p>
                <Button asChild>
                    <Link href="/login">Go to Login</Link>
                </Button>
            </CardContent>
        </Card>
      </div>
    );
  }

  const user = users.find((u) => u.rationCardNumber === cardId);
  if (!user) {
    notFound();
  }

  const shop = shops.find((s) => s.id === user.assignedShopId);
  if (!shop) {
    notFound();
  }
  
  const userBookings = bookings.filter(b => b.rationCardNumber === user.rationCardNumber);

  return (
    <>
      <header className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between border-b">
        <div className="flex items-center gap-2">
          <Logo className="h-8 w-8 text-primary" />
          <h1 className="text-2xl font-bold text-primary">RationQ</h1>
        </div>
        <div className="text-right">
          <p className="font-semibold">{user.name}</p>
          <p className="text-sm text-muted-foreground">{user.rationCardNumber}</p>
        </div>
      </header>
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Suspense fallback={<div>Loading dashboard...</div>}>
          <DashboardClient user={user} shop={shop} initialBookings={userBookings} />
        </Suspense>
      </main>
    </>
  );
}
