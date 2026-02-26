import { DollarSign, Receipt } from 'lucide-react';
import { Badge } from '../components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../components/ui/table';

type Transaction = {
  id: string;
  date: string;
  transactionId: string;
  customerName: string;
  totalAmount: number;
  status: 'Completed' | 'Pending';
};

const transactions: Transaction[] = [
  { id: '1', date: '2026-02-20', transactionId: 'TXN-20260220-001', customerName: 'Sarah Johnson', totalAmount: 1245.5, status: 'Completed' },
  { id: '2', date: '2026-02-20', transactionId: 'TXN-20260220-002', customerName: 'Michael Chen', totalAmount: 892, status: 'Completed' },
  { id: '3', date: '2026-02-20', transactionId: 'TXN-20260220-003', customerName: 'Emily Rodriguez', totalAmount: 3456.75, status: 'Pending' },
  { id: '4', date: '2026-02-19', transactionId: 'TXN-20260219-015', customerName: 'David Thompson', totalAmount: 567.25, status: 'Completed' },
  { id: '5', date: '2026-02-19', transactionId: 'TXN-20260219-016', customerName: 'Jessica Martinez', totalAmount: 2134, status: 'Completed' },
  { id: '6', date: '2026-02-18', transactionId: 'TXN-20260218-032', customerName: 'Amanda Wilson', totalAmount: 1678.25, status: 'Completed' },
];

export function SalesHistoryPage() {
  const today = '2026-02-20';
  const todayTransactions = transactions.filter((transaction) => transaction.date === today);
  const todayRevenue = todayTransactions
    .filter((transaction) => transaction.status === 'Completed')
    .reduce((sum, transaction) => sum + transaction.totalAmount, 0);

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);

  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

  return (
    <section className="space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Sales History</h1>
        <p className="mt-1 text-sm text-gray-500">View and track sales transactions.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Today's Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold">{formatCurrency(todayRevenue)}</p>
            <p className="mt-1 text-xs text-gray-500">From completed transactions</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Today's Transactions</CardTitle>
            <Receipt className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold">{todayTransactions.length}</p>
            <p className="mt-1 text-xs text-gray-500">Completed + pending sales</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Transaction History</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Transaction ID</TableHead>
                <TableHead>Customer Name</TableHead>
                <TableHead>Total Amount</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {transactions.map((transaction) => (
                <TableRow key={transaction.id}>
                  <TableCell>{formatDate(transaction.date)}</TableCell>
                  <TableCell className="font-mono text-xs">{transaction.transactionId}</TableCell>
                  <TableCell>{transaction.customerName}</TableCell>
                  <TableCell>{formatCurrency(transaction.totalAmount)}</TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={
                        transaction.status === 'Completed'
                          ? 'border-green-200 bg-green-50 text-green-700'
                          : 'border-yellow-200 bg-yellow-50 text-yellow-700'
                      }
                    >
                      {transaction.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </section>
  );
}
