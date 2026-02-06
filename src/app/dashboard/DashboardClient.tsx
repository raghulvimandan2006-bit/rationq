'use client';

import { useState, useMemo, useEffect } from 'react';
import type { RationUser, Shop, Booking, InventoryItem } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { add, format, set, isBefore, startOfHour, isAfter } from 'date-fns';
import { Calendar, CheckCircle2, Clock, MapPin, Package, AlertTriangle, Loader2 } from 'lucide-react';
import Image from 'next/image';
import { useToast } from '@/hooks/use-toast';

interface DashboardClientProps {
  user: RationUser;
  shop: Shop;
  initialBookings: Booking[];
}

export default function DashboardClient({ user, shop, initialBookings }: DashboardClientProps) {
  const [bookings, setBookings] = useState<Booking[]>(initialBookings);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const activeBooking = useMemo(() => {
    return bookings.find(b => b.status === 'booked');
  }, [bookings]);
  
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  const availableSlots = useMemo(() => {
    const slots = [];
    const now = currentTime;
    const { start, end } = shop.workingHours;

    let slotTime = startOfHour(set(now, { hours: start, minutes: 0, seconds: 0, milliseconds: 0 }));
    const endTime = set(now, { hours: end, minutes: 0, seconds: 0, milliseconds: 0 });

    while (isBefore(slotTime, endTime)) {
      if (isAfter(slotTime, now)) { // Only show future slots
        const isBooked = bookings.some(b => new Date(b.slotTime).getTime() === slotTime.getTime() && b.status !== 'expired');
        slots.push({ time: slotTime, isBooked });
      }
      slotTime = add(slotTime, { minutes: shop.slotDuration });
    }
    return slots;
  }, [shop.workingHours, shop.slotDuration, bookings, currentTime]);

  const handleBookSlot = (slotTime: Date) => {
    setIsLoading(true);
    setTimeout(() => {
        if (activeBooking) {
            toast({ variant: 'destructive', title: "Booking Failed", description: "You already have an active booking." });
            setIsLoading(false);
            return;
        }

        const newBooking: Booking = {
            id: `booking-${Date.now()}`,
            rationCardNumber: user.rationCardNumber,
            shopId: shop.id,
            slotTime: slotTime,
            otp: Math.floor(1000 + Math.random() * 9000).toString(),
            status: 'booked',
        };

        setBookings(prev => [...prev, newBooking]);
        toast({ title: "Slot Booked!", description: `Your slot at ${format(slotTime, 'p')} is confirmed.` });
        setIsLoading(false);
    }, 1000);
  };
  
  const isSlotExpired = activeBooking && isBefore(activeBooking.slotTime, new Date(currentTime.getTime() - shop.slotDuration * 60 * 1000));

  if (activeBooking && isSlotExpired) {
    return (
        <Card className="w-full max-w-lg mx-auto border-destructive">
            <CardHeader className="text-center">
                <AlertTriangle className="w-16 h-16 text-destructive mx-auto" />
                <CardTitle className="text-destructive">Slot Expired</CardTitle>
                <CardDescription>
                    You missed your booked slot at {format(activeBooking.slotTime, 'p')} on {format(activeBooking.slotTime, 'PPP')}.
                </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
                <p className="mb-4 text-muted-foreground">Please book a new slot to collect your rations.</p>
                <Button onClick={() => setBookings(b => b.filter(bk => bk.id !== activeBooking.id))}>
                    Book New Slot
                </Button>
            </CardContent>
        </Card>
    )
  }

  if (activeBooking) {
    return (
      <Card className="w-full max-w-lg mx-auto border-primary">
        <CardHeader className="text-center">
          <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto" />
          <CardTitle>Slot Booked Successfully!</CardTitle>
          <CardDescription>
            Show this OTP to the shopkeeper upon arrival.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-center space-y-2">
            <p className="text-sm text-muted-foreground">Your One-Time Password (OTP)</p>
            <p className="text-5xl font-bold tracking-widest bg-accent/20 text-accent-foreground py-4 rounded-lg">
              {activeBooking.otp}
            </p>
          </div>
          <div className="space-y-4">
              <div className="flex items-center gap-4">
                  <Calendar className="w-5 h-5 text-primary" />
                  <div>
                      <p className="font-semibold">{format(activeBooking.slotTime, 'eeee, MMMM do')}</p>
                      <p className="text-sm text-muted-foreground">Date</p>
                  </div>
              </div>
              <div className="flex items-center gap-4">
                  <Clock className="w-5 h-5 text-primary" />
                  <div>
                      <p className="font-semibold">{format(activeBooking.slotTime, 'p')} - {format(add(activeBooking.slotTime, { minutes: shop.slotDuration }), 'p')}</p>
                      <p className="text-sm text-muted-foreground">Time Slot</p>
                  </div>
              </div>
              <div className="flex items-center gap-4">
                  <MapPin className="w-5 h-5 text-primary" />
                  <div>
                      <p className="font-semibold">{shop.name}</p>
                      <p className="text-sm text-muted-foreground">{shop.address}</p>
                  </div>
              </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2 space-y-8">
        <Card>
          <CardHeader>
            <CardTitle>Book a Slot for {format(new Date(), 'eeee, MMMM do')}</CardTitle>
            <CardDescription>Slots are available for {shop.slotDuration} minutes each. Please arrive on time.</CardDescription>
          </CardHeader>
          <CardContent>
             <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {availableSlots.length > 0 ? availableSlots.map(({ time, isBooked }) => (
                    <Button 
                        key={time.toISOString()}
                        variant={isBooked ? 'secondary' : 'outline'}
                        disabled={isBooked || isLoading}
                        onClick={() => !isBooked && handleBookSlot(time)}
                        className="flex flex-col h-20"
                    >
                        {isLoading && <Loader2 className="animate-spin" />}
                        {!isLoading && <>
                            <span className="text-lg font-bold">{format(time, 'p')}</span>
                            <span className="text-xs">{isBooked ? 'Booked' : 'Available'}</span>
                        </>}
                    </Button>
                )) : <p className="col-span-full text-muted-foreground">No more slots available for today.</p>}
            </div>
          </CardContent>
        </Card>
      </div>

      <div>
        <Card>
          <CardHeader>
             <CardTitle className="flex items-center gap-2"><Package className="w-5 h-5" /> Available Inventory</CardTitle>
             <CardDescription>Items available at {shop.name}.</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-4">
                {shop.inventory.map(item => (
                    <li key={item.id} className="flex items-center gap-4">
                        <Image src={item.image} alt={item.name} data-ai-hint={`${item.id} food`} width={64} height={64} className="rounded-md object-cover bg-muted" />
                        <div className="flex-grow">
                            <p className="font-semibold">{item.name}</p>
                        </div>
                        <div className="text-right">
                           <p className="font-bold">{item.quantity > 0 ? 'Available' : 'Out of Stock'}</p>
                           <p className="text-sm text-muted-foreground">{item.quantity > 0 ? `${item.quantity} ${item.unit}` : ''}</p>
                        </div>
                    </li>
                ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
