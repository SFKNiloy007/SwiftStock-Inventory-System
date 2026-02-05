import React from 'react';
import { Card, CardContent, Typography, Box, Chip } from '@mui/material';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  Area,
  AreaChart,
} from 'recharts';

const salesData = [
  { date: 'Jan 24', sales: 45000, profit: 12000 },
  { date: 'Jan 25', sales: 52000, profit: 15000 },
  { date: 'Jan 26', sales: 48000, profit: 13500 },
  { date: 'Jan 27', sales: 61000, profit: 18000 },
  { date: 'Jan 28', sales: 55000, profit: 16000 },
  { date: 'Jan 29', sales: 67000, profit: 20000 },
  { date: 'Jan 30', sales: 72000, profit: 22000 },
];

export function SalesTrends() {
  return (
    <Card
      sx={{
        borderRadius: 4,
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
        border: '1px solid rgba(0, 0, 0, 0.06)',
      }}
    >
      <CardContent sx={{ p: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 4 }}>
          <Box>
            <Typography variant="h5" fontWeight={700} sx={{ mb: 0.5 }}>
              Sales Trends
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Last 7 days performance overview
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Chip 
              label="Sales" 
              size="small"
              sx={{ 
                backgroundColor: '#ede7f6',
                color: '#5e35b1',
                fontWeight: 600,
              }}
            />
            <Chip 
              label="Profit" 
              size="small"
              sx={{ 
                backgroundColor: '#e0f2f1',
                color: '#00897b',
                fontWeight: 600,
              }}
            />
          </Box>
        </Box>
        <Box sx={{ width: '100%', height: 350 }}>
          <ResponsiveContainer>
            <AreaChart data={salesData}>
              <defs>
                <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#667eea" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#667eea" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorProfit" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#00c853" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#00c853" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" vertical={false} />
              <XAxis
                dataKey="date"
                tick={{ fill: '#666', fontSize: 12 }}
                tickLine={false}
                axisLine={{ stroke: '#e0e0e0' }}
              />
              <YAxis
                tick={{ fill: '#666', fontSize: 12 }}
                tickLine={false}
                axisLine={{ stroke: '#e0e0e0' }}
                tickFormatter={(value) => `BDT ${value / 1000}k`}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#fff',
                  border: 'none',
                  borderRadius: 12,
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                  padding: '12px',
                }}
                formatter={(value: number, name: string) => [
                  `BDT ${value.toLocaleString()}`, 
                  name === 'sales' ? 'Sales' : 'Profit'
                ]}
              />
              <Area
                type="monotone"
                dataKey="sales"
                stroke="#667eea"
                strokeWidth={3}
                fill="url(#colorSales)"
                dot={{ fill: '#667eea', r: 5, strokeWidth: 2, stroke: '#fff' }}
                activeDot={{ r: 7 }}
              />
              <Area
                type="monotone"
                dataKey="profit"
                stroke="#00c853"
                strokeWidth={3}
                fill="url(#colorProfit)"
                dot={{ fill: '#00c853', r: 5, strokeWidth: 2, stroke: '#fff' }}
                activeDot={{ r: 7 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </Box>
      </CardContent>
    </Card>
  );
}
