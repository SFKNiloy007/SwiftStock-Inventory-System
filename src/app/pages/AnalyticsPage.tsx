import { Activity, BarChart3, TrendingUp } from 'lucide-react';
import {
  CategoryScale,
  Chart as ChartJS,
  Filler,
  Legend,
  LineElement,
  LinearScale,
  PointElement,
  Tooltip,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend, Filler);

const monthlySales = [14200, 15800, 16350, 17400, 19100, 20500];
const labels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];

export function AnalyticsPage() {
  const peak = Math.max(...monthlySales);

  const chartData = {
    labels,
    datasets: [
      {
        label: 'Sales',
        data: monthlySales,
        borderColor: '#4f46e5',
        borderWidth: 3,
        fill: true,
        backgroundColor: 'rgba(79, 70, 229, 0.10)',
        tension: 0.35,
        pointRadius: 4,
        pointHoverRadius: 7,
        pointBackgroundColor: '#6366f1',
        pointHoverBackgroundColor: '#818cf8',
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        enabled: true,
        backgroundColor: 'rgba(15, 23, 42, 0.9)',
        callbacks: {
          label: (context: any) => `Sales: $${Number(context.raw).toLocaleString()}`,
        },
      },
    },
    interaction: {
      intersect: false,
      mode: 'index' as const,
    },
    scales: {
      y: {
        ticks: {
          callback: (value: number | string) => `$${Number(value).toLocaleString()}`,
        },
        grid: {
          color: '#eef2ff',
        },
      },
      x: {
        grid: {
          display: false,
        },
      },
    },
  };

  return (
    <section className="space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Analytics</h1>
        <p className="mt-1 text-sm text-gray-500">Performance insights across sales and stock activity.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monthly Growth</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold">+18.3%</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Peak Sales Month</CardTitle>
            <BarChart3 className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold">${peak.toLocaleString()}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Stock Turnover</CardTitle>
            <Activity className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold">4.7x</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Monthly Sales Trend</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-[12px] border border-[#f1f5f9] p-4 shadow-[0_0_18px_rgba(99,102,241,0.2)]">
            <Line data={chartData} options={chartOptions} />
          </div>
        </CardContent>
      </Card>
    </section>
  );
}
