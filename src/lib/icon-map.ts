import { Shield, Users, Warehouse, LayoutGrid, ClipboardCheck, Package, ShoppingBag } from 'lucide-react';

export type IconName = 'shield' | 'users' | 'warehouse' | 'layout-grid' | 'clipboard-check' | 'package' | 'shopping-bag';

export const iconMap: Record<IconName, typeof Shield> = {
  'shield': Shield,
  'users': Users,
  'warehouse': Warehouse,
  'layout-grid': LayoutGrid,
  'clipboard-check': ClipboardCheck,
  'package': Package,
  'shopping-bag': ShoppingBag,
};

export function getIcon(name: IconName) {
  return iconMap[name];
}
