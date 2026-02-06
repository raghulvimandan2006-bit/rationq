'use client';

import { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { PageHeader } from '@/components/PageHeader';
import { shops as initialShops } from '@/lib/data';
import type { Shop } from '@/lib/types';
import { MoreHorizontal, PlusCircle } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export default function AdminShopsPage() {
  const [shops, setShops] = useState<Shop[]>(initialShops);

  // In a real app, these would be API calls.
  const handleAddShop = () => alert('Add shop functionality not implemented.');
  const handleEditShop = (id: string) => alert(`Edit shop ${id} functionality not implemented.`);
  const handleDeleteShop = (id: string) => alert(`Delete shop ${id} functionality not implemented.`);


  return (
    <>
      <PageHeader
        title="Shop Management"
        description="Add, edit, or remove ration shops."
      >
        <Button onClick={handleAddShop}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Add Shop
        </Button>
      </PageHeader>
      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Address</TableHead>
              <TableHead>Inventory Items</TableHead>
              <TableHead>
                <span className="sr-only">Actions</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {shops.map((shop) => (
              <TableRow key={shop.id}>
                <TableCell className="font-medium">{shop.name}</TableCell>
                <TableCell>{shop.address}</TableCell>
                <TableCell>{shop.inventory.length}</TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button aria-haspopup="true" size="icon" variant="ghost">
                        <MoreHorizontal className="h-4 w-4" />
                        <span className="sr-only">Toggle menu</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuItem onClick={() => handleEditShop(shop.id)}>Edit</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleDeleteShop(shop.id)}>Delete</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </>
  );
}
