'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowRight, Loader2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Logo } from '@/components/icons';
import { useToast } from '@/hooks/use-toast';
import { users } from '@/lib/data';

export default function LoginPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [rationCardNumber, setRationCardNumber] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    setTimeout(() => {
      const user = users.find(u => u.rationCardNumber === rationCardNumber);
      if (user) {
        toast({
          title: 'Success!',
          description: 'Ration card verified. Redirecting to your dashboard.',
        });
        router.push(`/dashboard?card_id=${rationCardNumber}`);
      } else {
        toast({
          variant: 'destructive',
          title: 'Error',
          description: 'Invalid ration card number. Please try again.',
        });
        setIsLoading(false);
      }
    }, 1000);
  };

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-6">
          <Link href="/" className="inline-flex items-center gap-2">
            <Logo className="h-10 w-10 text-primary" />
            <h1 className="text-3xl font-bold text-primary">RationQ</h1>
          </Link>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>Citizen Login</CardTitle>
            <CardDescription>Enter your ration card number to book a slot.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="ration-card">Ration Card Number</Label>
                <Input
                  id="ration-card"
                  placeholder="e.g., 1234567890"
                  value={rationCardNumber}
                  onChange={(e) => setRationCardNumber(e.target.value)}
                  required
                />
              </div>
              <Button type="submit" className="w-full bg-accent text-accent-foreground hover:bg-accent/90" disabled={isLoading}>
                {isLoading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <>
                    Continue <ArrowRight className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
