'use client';

import { useState } from 'react';
import Image from 'next/image';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { PageHeader } from '@/components/PageHeader';
import { shops as initialShops } from '@/lib/data';
import type { InventoryItem } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Plus } from 'lucide-react';
import { processStockUpdate } from '@/ai/flows/dynamic-stock-updates';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function InventoryPage() {
  const shopId = 'shop1'; // Hardcoded for demo
  const [shops, setShops] = useState(initialShops);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedItemId, setSelectedItemId] = useState('');
  const [quantity, setQuantity] = useState('');
  const { toast } = useToast();

  const shop = shops.find(s => s.id === shopId);

  const handleRestock = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedItemId || !quantity) {
        toast({ variant: "destructive", title: "Error", description: "Please select an item and enter a quantity." });
        return;
    }

    setIsLoading(true);
    const quantityChange = parseInt(quantity, 10);

    try {
      // Call the GenAI flow
      const success = await processStockUpdate({
        eventType: 'restock',
        shopId: shopId,
        itemId: selectedItemId,
        quantity: quantityChange,
      });

      if (success) {
        // Mock frontend update
        setShops(prevShops =>
          prevShops.map(s => {
            if (s.id === shopId) {
              return {
                ...s,
                inventory: s.inventory.map(item =>
                  item.id === selectedItemId
                    ? { ...item, quantity: item.quantity + quantityChange }
                    : item
                ),
              };
            }
            return s;
          })
        );
        toast({ title: "Success", description: "Inventory updated." });
        setSelectedItemId('');
        setQuantity('');
      } else {
        throw new Error("AI flow failed");
      }
    } catch (error) {
      console.error(error);
      toast({ variant: "destructive", title: "Update Failed", description: "Could not update inventory." });
    } finally {
      setIsLoading(false);
    }
  };

  if (!shop) return <div>Shop not found</div>;

  return (
    <div className="grid gap-8 md:grid-cols-3">
      <div className="md:col-span-2">
        <PageHeader
          title="Inventory Management"
          description="View and update stock levels for your shop."
        />
        <div className="rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[80px]">Image</TableHead>
                <TableHead>Item Name</TableHead>
                <TableHead>Current Stock</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {shop.inventory.map((item: InventoryItem) => (
                <TableRow key={item.id}>
                  <TableCell>
                    <Image
                      alt={item.name}
                      className="aspect-square rounded-md object-cover"
                      height="64"
                      src={item.image}
                      data-ai-hint={`${item.id} food`}
                      width="64"
                    />
                  </TableCell>
                  <TableCell className="font-medium">{item.name}</TableCell>
                  <TableCell>{item.quantity} {item.unit}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
      <div>
        <Card className="sticky top-24">
            <CardHeader>
                <CardTitle>Add Stock</CardTitle>
                <CardDescription>Increase the quantity of an item.</CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleRestock} className="space-y-4">
                    <div className="space-y-2">
                        <label>Item</label>
                        <Select value={selectedItemId} onValueChange={setSelectedItemId}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select an item" />
                            </SelectTrigger>
                            <SelectContent>
                                {shop.inventory.map(item => (
                                    <SelectItem key={item.id} value={item.id}>{item.name}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-2">
                        <label>Quantity to Add</label>
                         <Input
                            type="number"
                            placeholder="e.g., 50"
                            value={quantity}
                            onChange={(e) => setQuantity(e.target.value)}
                            min="1"
                            required
                        />
                    </div>
                    <Button type="submit" className="w-full" disabled={isLoading}>
                        {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Plus className="mr-2 h-4 w-4" />}
                        Update Stock
                    </Button>
                </form>
            </CardContent>
        </Card>
      </div>
    </div>
  );
}
