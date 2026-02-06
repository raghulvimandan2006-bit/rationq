import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PageHeader } from '@/components/PageHeader';
import { shops, bookings } from '@/lib/data';
import { Package, Users, ShoppingCart } from 'lucide-react';
import { isToday } from 'date-fns';

export default function ShopDashboardPage() {
  // In a real app, you'd get the shopkeeper's shop ID from their session.
  const shopId = 'shop1';
  const shop = shops.find(s => s.id === shopId);
  
  if (!shop) {
    return <div>Shop not found.</div>
  }

  const todayBookings = bookings.filter(b => b.shopId === shopId && isToday(b.slotTime));
  const inventoryCount = shop.inventory.length;
  const pendingArrivals = todayBookings.filter(b => b.status === 'booked').length;

  return (
    <>
      <PageHeader
        title={`${shop.name} Dashboard`}
        description="Overview of your shop's activity today."
      />
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Today's Bookings</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{todayBookings.length}</div>
            <p className="text-xs text-muted-foreground">
              Total slots booked for today
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Pending Arrivals
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingArrivals}</div>
            <p className="text-xs text-muted-foreground">
              Customers yet to arrive today
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Inventory Items</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{inventoryCount}</div>
            <p className="text-xs text-muted-foreground">
              Different types of items in stock
            </p>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
