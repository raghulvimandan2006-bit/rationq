// @ts-nocheck
import type { RationUser, Shop, Booking, InventoryItem } from './types';
import { PlaceHolderImages } from './placeholder-images';

const findImage = (id: string) => PlaceHolderImages.find(img => img.id === id)?.imageUrl || '';

const inventory1: InventoryItem[] = [
  { id: '1', name: 'Wheat', quantity: 250, unit: 'kg', image: findImage('wheat') },
  { id: '2', name: 'Rice', quantity: 400, unit: 'kg', image: findImage('rice') },
  { id: '3', name: 'Sugar', quantity: 150, unit: 'kg', image: findImage('sugar') },
  { id: '4', name: 'Cooking Oil', quantity: 100, unit: 'L', image: findImage('oil') },
  { id: '5', name: 'Lentils', quantity: 80, unit: 'kg', image: findImage('dal') },
];

const inventory2: InventoryItem[] = [
  { id: '1', name: 'Wheat', quantity: 300, unit: 'kg', image: findImage('wheat') },
  { id: '2', name: 'Rice', quantity: 350, unit: 'kg', image: findImage('rice') },
  { id: '3', name: 'Sugar', quantity: 200, unit: 'kg', image: findImage('sugar') },
  { id: '4', name: 'Cooking Oil', quantity: 120, unit: 'L', image: findImage('oil') },
];

export const shops: Shop[] = [
  { 
    id: 'shop1', 
    name: 'Main Street Rations', 
    address: '123 Main St, Anytown', 
    inventory: inventory1,
    workingHours: { start: 9, end: 18 },
    slotDuration: 60,
  },
  { 
    id: 'shop2', 
    name: 'Park Avenue Provisions', 
    address: '456 Park Ave, Otherville', 
    inventory: inventory2,
    workingHours: { start: 8, end: 17 },
    slotDuration: 60,
  },
];

export const users: RationUser[] = [
  { 
    rationCardNumber: '1234567890', 
    name: 'John Doe', 
    assignedShopId: 'shop1', 
    phone: '555-0101',
    email: 'john.doe@example.com'
  },
  { 
    rationCardNumber: '0987654321', 
    name: 'Jane Smith', 
    assignedShopId: 'shop1', 
    phone: '555-0102',
    email: 'jane.smith@example.com'
  },
  { 
    rationCardNumber: '1122334455', 
    name: 'Peter Jones', 
    assignedShopId: 'shop2', 
    phone: '555-0103',
    email: 'peter.jones@example.com'
  },
];

const yesterday = new Date();
yesterday.setDate(yesterday.getDate() - 1);

export const bookings: Booking[] = [
  {
    id: 'booking1',
    rationCardNumber: '0987654321',
    shopId: 'shop1',
    slotTime: new Date(new Date().setHours(14, 0, 0, 0)),
    otp: '1234',
    status: 'booked',
  },
  {
    id: 'booking2',
    rationCardNumber: '1234567890',
    shopId: 'shop1',
    slotTime: new Date(yesterday.setHours(10, 0, 0, 0)),
    otp: '5678',
    status: 'completed',
    saleDate: yesterday,
  },
];
