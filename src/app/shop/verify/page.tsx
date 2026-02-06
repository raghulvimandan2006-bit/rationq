'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { PageHeader } from '@/components/PageHeader';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { bookings } from '@/lib/data';
import { Loader2 } from 'lucide-react';
import { Label } from '@/components/ui/label';

export default function VerifyCustomerPage() {
  const [otp, setOtp] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Mock verification
    setTimeout(() => {
      // In a real app, you'd filter by shop ID as well
      const booking = bookings.find(b => b.otp === otp && b.status === 'booked');
      if (booking) {
        toast({
          title: 'OTP Verified!',
          description: 'Customer confirmed. Proceeding to sales.',
        });
        // Pass customer info to the sales page
        router.push(`/shop/sale?booking_id=${booking.id}`);
      } else {
        toast({
          variant: 'destructive',
          title: 'Verification Failed',
          description: 'Invalid or expired OTP. Please check and try again.',
        });
        setIsLoading(false);
      }
    }, 1000);
  };

  return (
    <>
      <PageHeader
        title="Verify Customer"
        description="Enter the OTP from the customer's booking confirmation."
      />
      <div className="flex justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Enter OTP</CardTitle>
            <CardDescription>
              Ask the customer for their 4-digit One-Time Password to begin the sale.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleVerify} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="otp">One-Time Password (OTP)</Label>
                <Input
                  id="otp"
                  type="text"
                  inputMode="numeric"
                  maxLength={4}
                  placeholder="1234"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/[^0-9]/g, ''))}
                  className="text-center text-2xl h-16 tracking-[1em]"
                  required
                />
              </div>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 'Verify & Start Sale'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
