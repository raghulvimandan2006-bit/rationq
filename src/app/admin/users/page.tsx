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
import { users as initialUsers, shops } from '@/lib/data';
import type { RationUser } from '@/lib/types';
import { MoreHorizontal, PlusCircle } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';

export default function AdminUsersPage() {
  const [users, setUsers] = useState<RationUser[]>(initialUsers);

  // In a real app, these would be API calls.
  const handleAddUser = () => alert('Add user functionality not implemented.');
  const handleEditUser = (id: string) => alert(`Edit user ${id} functionality not implemented.`);
  const handleDeleteUser = (id: string) => alert(`Delete user ${id} functionality not implemented.`);
  
  const getShopName = (shopId: string) => {
    return shops.find(s => s.id === shopId)?.name || 'N/A';
  }

  return (
    <>
      <PageHeader
        title="User Management"
        description="Add, edit, or remove ration card holders."
      >
        <Button onClick={handleAddUser}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Add User
        </Button>
      </PageHeader>
      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Ration Card No.</TableHead>
              <TableHead>Assigned Shop</TableHead>
              <TableHead>Contact</TableHead>
              <TableHead>
                <span className="sr-only">Actions</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.rationCardNumber}>
                <TableCell className="font-medium">{user.name}</TableCell>
                <TableCell>{user.rationCardNumber}</TableCell>
                <TableCell>
                    <Badge variant="outline">{getShopName(user.assignedShopId)}</Badge>
                </TableCell>
                <TableCell>{user.email}</TableCell>
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
                      <DropdownMenuItem onClick={() => handleEditUser(user.rationCardNumber)}>Edit</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleDeleteUser(user.rationCardNumber)}>Delete</DropdownMenuItem>
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
