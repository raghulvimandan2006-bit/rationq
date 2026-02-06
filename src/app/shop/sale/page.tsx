'use client';

import { Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useState, useMemo } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableFooter, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { PageHeader } from '@/components/PageHeader';
import { bookings, users, shops as initialShops } from '@/lib/data';
import { useToast } from '@/hooks/use-toast';
import { CheckCircle, Loader2, Minus, Plus } from 'lucide-react';
import { processStockUpdate } from '@/ai/flows/dynamic-stock-updates';

type CartItem = {
  id: string;
  name: string;
  quantity: number;
  unit: string;
  maxQuantity: number;
};

function SalePageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { toast } = useToast();
  
  const bookingId = searchParams.get('booking_id');
  const booking = useMemo(() => bookings.find(b => b.id === bookingId), [bookingId]);
  const user = useMemo(() => users.find(u => u.rationCardNumber === booking?.rationCardNumber), [booking]);
  
  const [shops, setShops] = useState(initialShops);
  const shop = useMemo(() => shops.find(s => s.id === booking?.shopId), [shops, booking]);

  const [cart, setCart] = useState<CartItem[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [saleCompleted, setSaleCompleted] = useState(false);

  const updateCart = (item: { id: string; name: string; unit: string; maxQuantity: number }, quantity: number) => {
    setCart(currentCart => {
      const existingItem = currentCart.find(ci => ci.id === item.id);
      if (quantity <= 0) {
        return currentCart.filter(ci => ci.id !== item.id);
      }
      if (existingItem) {
        return currentCart.map(ci => ci.id === item.id ? { ...ci, quantity } : ci);
      }
      return [...currentCart, { ...item, quantity }];
    });
  };

  const handleConfirmSale = async () => {
    if (cart.length === 0) {
      toast({ variant: 'destructive', title: 'Empty Cart', description: 'Please add items to the cart.' });
      return;
    }
    setIsProcessing(true);
    try {
      for (const item of cart) {
        await processStockUpdate({
          eventType: 'sale',
          shopId: shop!.id,
          itemId: item.id,
          quantity: item.quantity,
        });
      }

      // In a real app, you would update the booking status in the database.
      // Here we find the booking and update its status to 'completed'.
      const bookingIndex = bookings.findIndex(b => b.id === bookingId);
      if (bookingIndex !== -1) {
          bookings[bookingIndex].status = 'completed';
          bookings[bookingIndex].saleDate = new Date();
      }

      // Mock frontend update
      setShops(prevShops =>
        prevShops.map(s => {
          if (s.id === shop!.id) {
            let newInventory = [...s.inventory];
            cart.forEach(cartItem => {
              newInventory = newInventory.map(invItem =>
                invItem.id === cartItem.id
                  ? { ...invItem, quantity: invItem.quantity - cartItem.quantity }
                  : invItem
              );
            });
            return { ...s, inventory: newInventory };
          }
          return s;
        })
      );
      toast({ title: 'Sale Confirmed!', description: 'Bill generated and inventory updated.' });
      setSaleCompleted(true);
    } catch (error) {
      toast({ variant: 'destructive', title: 'Error', description: 'Failed to confirm sale.' });
    } finally {
      setIsProcessing(false);
    }
  };

  if (saleCompleted) {
    return (
        <Card className="w-full max-w-lg mx-auto text-center">
            <CardHeader>
                <CheckCircle className="w-16 h-16 text-green-500 mx-auto" />
                <CardTitle>Sale Completed</CardTitle>
                <CardDescription>The inventory has been updated. A bill has been sent to the customer's email.</CardDescription>
            </CardHeader>
            <CardContent>
                <Button onClick={() => router.push('/shop/sales')}>View Sales</Button>
            </CardContent>
        </Card>
    );
  }

  if (!booking || !user || !shop) {
    return <PageHeader title="Error" description="Booking details not found. Please verify a customer first." />;
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2">
        <PageHeader title="Create Sale" description={`For ${user.name} (${user.rationCardNumber})`} />
        <Card>
          <CardHeader>
            <CardTitle>Available Items</CardTitle>
            <CardDescription>Select items and quantities for the customer.</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Item</TableHead>
                  <TableHead>Available</TableHead>
                  <TableHead className="w-[150px]">Quantity</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {shop.inventory.map(item => {
                    const cartItem = cart.find(ci => ci.id === item.id);
                    return (
                        <TableRow key={item.id}>
                            <TableCell className="flex items-center gap-4">
                                <Image src={item.image} alt={item.name} data-ai-hint={`${item.id} food`} width={40} height={40} className="rounded-md" />
                                <span className="font-medium">{item.name}</span>
                            </TableCell>
                            <TableCell>{item.quantity} {item.unit}</TableCell>
                            <TableCell>
                                <div className="flex items-center gap-2">
                                <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => updateCart(item, (cartItem?.quantity || 0) - 1)}><Minus className="h-4 w-4" /></Button>
                                <Input type="number" value={cartItem?.quantity || 0} readOnly className="w-16 text-center h-8" />
                                <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => updateCart(item, (cartItem?.quantity || 0) + 1)} disabled={(cartItem?.quantity || 0) >= item.quantity}><Plus className="h-4 w-4" /></Button>
                                </div>
                            </TableCell>
                        </TableRow>
                    );
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
      <div>
        <Card className="sticky top-24">
          <CardHeader>
            <CardTitle>Bill Summary</CardTitle>
            <CardDescription>Items selected for purchase.</CardDescription>
          </CardHeader>
          <CardContent>
            {cart.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">Cart is empty</p>
            ) : (
              <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Item</TableHead>
                        <TableHead className="text-right">Qty</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                  {cart.map(item => (
                    <TableRow key={item.id}>
                      <TableCell>{item.name}</TableCell>
                      <TableCell className="text-right">{item.quantity} {item.unit}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
                <TableFooter>
                    <TableRow>
                        <TableCell colSpan={2}>
                             <Button onClick={handleConfirmSale} className="w-full bg-accent hover:bg-accent/90 text-accent-foreground" disabled={isProcessing}>
                                {isProcessing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 'Confirm Sale & Generate Bill'}
                            </Button>
                        </TableCell>
                    </TableRow>
                </TableFooter>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default function SalePage() {
    return (
        <Suspense fallback={<div className='flex justify-center items-center h-64'><Loader2 className="h-8 w-8 animate-spin" /></div>}>
            <SalePageContent />
        </Suspense>
    )
}
