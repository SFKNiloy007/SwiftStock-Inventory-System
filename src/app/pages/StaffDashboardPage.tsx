import { AlertTriangle, DollarSign, Package } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../components/ui/table';

type RecentSale = {
  id: string;
  product: string;
  quantity: number;
  amount: number;
  date: string;
  time: string;
};

const recentSales: RecentSale[] = [
  { id: '1', product: 'Wireless Headphones', quantity: 2, amount: 159.98, date: 'Feb 20, 2026', time: '2:30 PM' },
  { id: '2', product: 'USB-C Cable', quantity: 5, amount: 49.95, date: 'Feb 20, 2026', time: '1:45 PM' },
  { id: '3', product: 'Laptop Stand', quantity: 1, amount: 89.99, date: 'Feb 20, 2026', time: '12:15 PM' },
  { id: '4', product: 'Mechanical Keyboard', quantity: 1, amount: 149.99, date: 'Feb 20, 2026', time: '11:30 AM' },
  { id: '5', product: 'Mouse Pad', quantity: 3, amount: 44.97, date: 'Feb 20, 2026', time: '10:20 AM' },
];

export function StaffDashboardPage() {
  return (
    <section className="space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Staff Dashboard</h1>
        <p className="mt-1 text-sm text-gray-500">Welcome back. Here is your recent activity.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Products</CardTitle>
            <Package className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold">1,247</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Items Out of Stock</CardTitle>
            <AlertTriangle className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold">23</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">My Recent Sales</CardTitle>
            <DollarSign className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold">{recentSales.length}</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Sales</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product</TableHead>
                <TableHead>Qty</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Time</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recentSales.map((sale) => (
                <TableRow key={sale.id}>
                  <TableCell>{sale.product}</TableCell>
                  <TableCell>{sale.quantity}</TableCell>
                  <TableCell>${sale.amount.toFixed(2)}</TableCell>
                  <TableCell>{sale.date}</TableCell>
                  <TableCell>{sale.time}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </section>
  );
}
