import type { LucideIcon } from 'lucide-react';

export type InventoryItem = {
  id: string;
  name: string;
  quantity: number;
  unit: 'kg' | 'L' | 'unit';
  image: string;
};

export type Shop = {
  id: string;
  name: string;
  address: string;
  inventory: InventoryItem[];
  workingHours: { start: number; end: number }; // 24-hour format
  slotDuration: number; // in minutes
};

export type RationUser = {
  rationCardNumber: string;
  name: string;
  assignedShopId: string;
  phone: string;
  email: string;
};

export type Booking = {
  id: string;
  rationCardNumber: string;
  shopId: string;
  slotTime: Date;
  otp: string;
  status: 'booked' | 'completed' | 'expired';
  saleDate?: Date;
};

export type NavItem = {
  href: string;
  label: string;
  icon: LucideIcon;
};
