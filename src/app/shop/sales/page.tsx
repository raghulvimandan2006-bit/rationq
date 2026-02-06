'use client';

import { useMemo } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { PageHeader } from '@/components/PageHeader';
import { bookings as allBookings, users as allUsers } from '@/lib/data';
import type { Booking, RationUser } from '@/lib/types';
import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';

type Sale = {
  booking: Booking;
  user: RationUser | undefined;
}

export default function ShopSalesPage() {
    const shopId = 'shop1'; // Hardcoded for demo

    const sales: Sale[] = useMemo(() => {
        return allBookings
            .filter(b => b.shopId === shopId && b.status === 'completed')
            .map(b => ({
                booking: b,
                user: allUsers.find(u => u.rationCardNumber === b.rationCardNumber)
            }))
            .sort((a, b) => {
                const dateA = a.booking.saleDate || a.booking.slotTime;
                const dateB = b.booking.saleDate || b.booking.slotTime;
                return new Date(dateB).getTime() - new Date(dateA).getTime();
            });
    }, [shopId]);

  return (
    <>
      <PageHeader
        title="Sales History"
        description="View all completed transactions for your shop."
      />
      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Customer Name</TableHead>
              <TableHead>Ration Card No.</TableHead>
              <TableHead>Sale Date</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sales.length > 0 ? (
                sales.map(({booking, user}) => (
                    <TableRow key={booking.id}>
                        <TableCell className="font-medium">{user?.name || 'N/A'}</TableCell>
                        <TableCell>{booking.rationCardNumber}</TableCell>
                        <TableCell>{format(new Date(booking.saleDate || booking.slotTime), 'PPP p')}</TableCell>
                        <TableCell>
                            <Badge variant={booking.status === 'completed' ? 'default': 'secondary'}>{booking.status}</Badge>
                        </TableCell>
                    </TableRow>
                ))
            ) : (
                <TableRow>
                    <TableCell colSpan={4} className="text-center h-24">No sales found.</TableCell>
                </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </>
  );
}
