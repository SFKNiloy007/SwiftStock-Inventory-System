import { Product } from './types';

export const mockProducts: Product[] = [
  {
    id: 1,
    image:
      'https://images.unsplash.com/photo-1736616967588-d81fcd6f4d0a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsYXB0b3AlMjBjb21wdXRlciUyMHByb2R1Y3R8ZW58MXx8fHwxNzcxNTg1MDU0fDA&ixlib=rb-4.1.0&q=80&w=1080',
    name: 'MacBook Pro 16"',
    category: 'Computers',
    stockLevel: 24,
    retailPrice: 2499.99,
    costPrice: 1899.99,
  },
  {
    id: 2,
    image:
      'https://images.unsplash.com/photo-1578517581165-61ec5ab27a19?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3aXJlbGVzcyUyMGhlYWRwaG9uZXMlMjBwcm9kdWN0fGVufDF8fHx8MTc3MTU4MjY5MXww&ixlib=rb-4.1.0&q=80&w=1080',
    name: 'Sony WH-1000XM5',
    category: 'Audio',
    stockLevel: 56,
    retailPrice: 399.99,
    costPrice: 279.99,
  },
  {
    id: 3,
    image:
      'https://images.unsplash.com/photo-1741061961703-0739f3454314?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzbWFydHBob25lJTIwbW9iaWxlJTIwcGhvbmV8ZW58MXx8fHwxNzcxNTQwMzE2fDA&ixlib=rb-4.1.0&q=80&w=1080',
    name: 'iPhone 15 Pro',
    category: 'Mobile',
    stockLevel: 12,
    retailPrice: 999.99,
    costPrice: 749.99,
  },
  {
    id: 4,
    image:
      'https://images.unsplash.com/photo-1637762646936-29b68cd6670d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxvZmZpY2UlMjBkZXNrJTIwY2hhaXJ8ZW58MXx8fHwxNzcxNjE1NDAyfDA&ixlib=rb-4.1.0&q=80&w=1080',
    name: 'Herman Miller Aeron',
    category: 'Furniture',
    stockLevel: 8,
    retailPrice: 1495,
    costPrice: 1095,
  },
  {
    id: 5,
    image:
      'https://images.unsplash.com/photo-1760376789492-de70fab19d94?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb21wdXRlciUyMG1vdXNlJTIwcGVyaXBoZXJhbHxlbnwxfHx8fDE3NzE2MTU0MDN8MA&ixlib=rb-4.1.0&q=80&w=1080',
    name: 'Logitech MX Master 3S',
    category: 'Accessories',
    stockLevel: 142,
    retailPrice: 99.99,
    costPrice: 64.99,
  },
  {
    id: 6,
    image:
      'https://images.unsplash.com/photo-1626958390898-162d3577f293?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtZWNoYW5pY2FsJTIwa2V5Ym9hcmR8ZW58MXx8fHwxNzcxNTM5MTU3fDA&ixlib=rb-4.1.0&q=80&w=1080',
    name: 'Keychron K8 Pro',
    category: 'Accessories',
    stockLevel: 67,
    retailPrice: 109.99,
    costPrice: 74.99,
  },
  {
    id: 7,
    image:
      'https://images.unsplash.com/photo-1593833210845-d9935371664e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHw0ayUyMG1vbml0b3IlMjBkaXNwbGF5fGVufDF8fHx8MTc3MTYxNTQwNHww&ixlib=rb-4.1.0&q=80&w=1080',
    name: 'LG UltraFine 5K',
    category: 'Monitors',
    stockLevel: 18,
    retailPrice: 1299.99,
    costPrice: 949.99,
  },
  {
    id: 8,
    image:
      'https://images.unsplash.com/photo-1769603795371-ad63bd85d524?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0YWJsZXQlMjBkZXZpY2V8ZW58MXx8fHwxNzcxNTUzMTI3fDA&ixlib=rb-4.1.0&q=80&w=1080',
    name: 'iPad Pro 12.9"',
    category: 'Mobile',
    stockLevel: 31,
    retailPrice: 1099.99,
    costPrice: 849.99,
  },
  {
    id: 9,
    image:
      'https://images.unsplash.com/photo-1629429407756-446d66f5b24e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3ZWJjYW0lMjBjYW1lcmF8ZW58MXx8fHwxNzcxNTc0ODA5fDA&ixlib=rb-4.1.0&q=80&w=1080',
    name: 'Logitech Brio 4K',
    category: 'Accessories',
    stockLevel: 45,
    retailPrice: 199.99,
    costPrice: 139.99,
  },
  {
    id: 10,
    image:
      'https://images.unsplash.com/photo-1605194004886-56d82f482d53?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkZXNrJTIwbGFtcCUyMG9mZmljZXxlbnwxfHx8fDE3NzE2MTU0MDR8MA&ixlib=rb-4.1.0&q=80&w=1080',
    name: 'BenQ ScreenBar',
    category: 'Lighting',
    stockLevel: 89,
    retailPrice: 109.99,
    costPrice: 74.99,
  },
];
