export type UserRole = 'Admin' | 'Staff';

export type NavigationSection =
  | 'Dashboard'
  | 'Products'
  | 'Suppliers'
  | 'Analytics'
  | 'Settings';

export type Product = {
  id: number;
  image: string;
  name: string;
  category: string;
  stockLevel: number;
  retailPrice: number;
  costPrice: number;
};
