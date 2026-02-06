import Link from 'next/link';
import { ArrowRight, User, Building, Shield } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Logo } from '@/components/icons';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Logo className="h-8 w-8 text-primary" />
          <h1 className="text-2xl font-bold text-primary">RationQ</h1>
        </div>
        <Button asChild variant="ghost">
          <Link href="/login">
            Login <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </header>

      <main className="flex-grow">
        <section className="container mx-auto px-4 sm:px-6 lg:px-8 text-center py-20 md:py-32">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-foreground">
            A smarter way to get your rations.
          </h2>
          <p className="mt-6 max-w-2xl mx-auto text-lg text-muted-foreground">
            No more waiting in long lines. Book your slot, see what's available, and pick up your rations hassle-free.
          </p>
          <div className="mt-10">
            <Button asChild size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90">
              <Link href="/login">
                Book a Slot Now <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </section>

        <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="text-center">
              <CardHeader>
                <div className="mx-auto bg-primary/10 rounded-full p-3 w-fit">
                  <User className="h-8 w-8 text-primary" />
                </div>
                <CardTitle>For Citizens</CardTitle>
                <CardDescription>Book your slot with your ration card.</CardDescription>
              </CardHeader>
              <CardContent>
                <Button asChild variant="outline">
                  <Link href="/login">User Portal</Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <div className="mx-auto bg-primary/10 rounded-full p-3 w-fit">
                  <Building className="h-8 w-8 text-primary" />
                </div>
                <CardTitle>For Shopkeepers</CardTitle>
                <CardDescription>Manage inventory and customer flow.</CardDescription>
              </CardHeader>
              <CardContent>
                <Button asChild variant="outline">
                  <Link href="/shop">Shop Portal</Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <div className="mx-auto bg-primary/10 rounded-full p-3 w-fit">
                  <Shield className="h-8 w-8 text-primary" />
                </div>
                <CardTitle>For Admins</CardTitle>
                <CardDescription>Oversee shops and user data.</CardDescription>
              </CardHeader>
              <CardContent>
                <Button asChild variant="outline">
                  <Link href="/admin">Admin Portal</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </section>
      </main>

      <footer className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 text-center text-muted-foreground">
        <p>&copy; {new Date().getFullYear()} RationQ. All rights reserved.</p>
      </footer>
    </div>
  );
}
