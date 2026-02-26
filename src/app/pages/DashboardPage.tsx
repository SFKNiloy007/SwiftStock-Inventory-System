import { AlertTriangle, DollarSign, Package, TrendingUp } from 'lucide-react';
import { Badge } from '../components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';

const topProducts = [
  { name: 'MacBook Pro 16"', sold: 48, revenue: 119999.52 },
  { name: 'iPhone 15 Pro', sold: 76, revenue: 75999.24 },
  { name: 'Sony WH-1000XM5', sold: 112, revenue: 44798.88 },
  { name: 'Logitech MX Master 3S', sold: 138, revenue: 13798.62 },
];

export function DashboardPage() {
  return (
    <section className="space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Admin Dashboard</h1>
        <p className="mt-1 text-sm text-gray-500">Overview of sales, stock, and product performance.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Sales</CardTitle>
            <DollarSign className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold">$45,231</p>
            <p className="mt-1 text-xs text-gray-500">+12.5% from last week</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Daily Profit</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold">$3,842</p>
            <p className="mt-1 text-xs text-gray-500">+8.2% from yesterday</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Low Stock Items</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold">23</p>
            <p className="mt-1 text-xs text-gray-500">Needs restock today</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Products</CardTitle>
            <Package className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold">1,428</p>
            <p className="mt-1 text-xs text-gray-500">+5.4% this month</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Top Products</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {topProducts.map((product) => (
            <div
              key={product.name}
              className="flex items-center justify-between rounded-[12px] border border-[#f1f5f9] bg-white p-3 shadow-[0_4px_20px_rgba(0,0,0,0.05)]"
            >
              <div>
                <p className="font-medium text-gray-900">{product.name}</p>
                <p className="text-xs text-gray-500">{product.sold} units sold</p>
              </div>
              <Badge variant="outline" className="border-blue-200 bg-blue-50 text-blue-700">
                ${product.revenue.toFixed(2)}
              </Badge>
            </div>
          ))}
        </CardContent>
      </Card>
    </section>
  );
}
