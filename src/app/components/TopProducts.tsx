import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Box,
  Avatar,
} from '@mui/material';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';

interface Product {
  name: string;
  category: string;
  unitsSold: number;
  stockLevel: number;
  status: 'healthy' | 'low';
  trend: number;
}

const topProducts: Product[] = [
  { name: 'Wireless Mouse Pro', category: 'Electronics', unitsSold: 1247, stockLevel: 450, status: 'healthy', trend: 12 },
  { name: 'USB-C Cable 2m', category: 'Accessories', unitsSold: 1103, stockLevel: 89, status: 'low', trend: 8 },
  { name: 'Mechanical Keyboard', category: 'Electronics', unitsSold: 892, stockLevel: 320, status: 'healthy', trend: -3 },
  { name: 'HD Webcam', category: 'Electronics', unitsSold: 756, stockLevel: 52, status: 'low', trend: 15 },
  { name: 'Bluetooth Headset', category: 'Audio', unitsSold: 634, stockLevel: 180, status: 'healthy', trend: 5 },
];

export function TopProducts() {
  return (
    <Card
      sx={{
        borderRadius: 4,
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
        border: '1px solid rgba(0, 0, 0, 0.06)',
      }}
    >
      <CardContent sx={{ p: 4 }}>
        <Box sx={{ mb: 3 }}>
          <Typography variant="h5" fontWeight={700} sx={{ mb: 0.5 }}>
            Top 5 Selling Products
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Best performing products this month
          </Typography>
        </Box>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 700, color: 'text.primary', fontSize: '0.875rem', borderBottom: '2px solid #f5f5f5', pb: 2 }}>
                  Product
                </TableCell>
                <TableCell align="center" sx={{ fontWeight: 700, color: 'text.primary', fontSize: '0.875rem', borderBottom: '2px solid #f5f5f5', pb: 2 }}>
                  Units Sold
                </TableCell>
                <TableCell align="center" sx={{ fontWeight: 700, color: 'text.primary', fontSize: '0.875rem', borderBottom: '2px solid #f5f5f5', pb: 2 }}>
                  Stock Level
                </TableCell>
                <TableCell align="center" sx={{ fontWeight: 700, color: 'text.primary', fontSize: '0.875rem', borderBottom: '2px solid #f5f5f5', pb: 2 }}>
                  Trend
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {topProducts.map((product, index) => (
                <TableRow
                  key={product.name}
                  sx={{
                    transition: 'all 0.2s ease',
                    '&:hover': {
                      backgroundColor: '#f8f9fa',
                      transform: 'scale(1.01)',
                    },
                    '&:last-child td': {
                      border: 0,
                    },
                  }}
                >
                  <TableCell sx={{ py: 2.5 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Avatar
                        sx={{
                          width: 40,
                          height: 40,
                          background: `linear-gradient(135deg, ${index % 2 === 0 ? '#667eea 0%, #764ba2 100%' : '#00bcd4 0%, #0097a7 100%'})`,
                          fontWeight: 700,
                          fontSize: '1rem',
                        }}
                      >
                        {index + 1}
                      </Avatar>
                      <Box>
                        <Typography fontWeight={600} sx={{ fontSize: '0.95rem' }}>
                          {product.name}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {product.category}
                        </Typography>
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell align="center">
                    <Typography fontWeight={600} sx={{ fontSize: '0.95rem' }}>
                      {product.unitsSold.toLocaleString()}
                    </Typography>
                  </TableCell>
                  <TableCell align="center">
                    <Chip
                      label={product.stockLevel}
                      size="small"
                      sx={{
                        backgroundColor: product.status === 'healthy' ? '#e8f5e9' : '#ffebee',
                        color: product.status === 'healthy' ? '#2e7d32' : '#c62828',
                        fontWeight: 700,
                        minWidth: 70,
                        borderRadius: 2,
                      }}
                    />
                  </TableCell>
                  <TableCell align="center">
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0.5 }}>
                      <Typography
                        variant="body2"
                        fontWeight={600}
                        sx={{
                          color: product.trend > 0 ? '#00c853' : '#ff5252',
                        }}
                      >
                        {product.trend > 0 ? '+' : ''}{product.trend}%
                      </Typography>
                      {product.trend > 0 && (
                        <TrendingUpIcon sx={{ fontSize: 16, color: '#00c853' }} />
                      )}
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </CardContent>
    </Card>
  );
}