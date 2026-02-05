import React from 'react';
import { Grid, Card, CardContent, Typography, Box } from '@mui/material';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import WarningIcon from '@mui/icons-material/Warning';
import InventoryIcon from '@mui/icons-material/Inventory';

interface MetricCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
  gradient: string;
  change?: string;
  isWarning?: boolean;
}

function MetricCard({ title, value, icon, gradient, change, isWarning }: MetricCardProps) {
  return (
    <Card
      sx={{
        borderRadius: 4,
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        border: isWarning ? '2px solid #ff5252' : 'none',
        position: 'relative',
        overflow: 'hidden',
        '&:hover': {
          transform: 'translateY(-8px)',
          boxShadow: '0 12px 28px rgba(0, 0, 0, 0.15)',
        },
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '4px',
          background: gradient,
        },
      }}
    >
      <CardContent sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 2 }}>
          <Box>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5, fontWeight: 500, textTransform: 'uppercase', fontSize: '0.75rem', letterSpacing: '0.5px' }}>
              {title}
            </Typography>
            <Typography variant="h3" fontWeight={700} color={isWarning ? 'error.main' : 'text.primary'} sx={{ letterSpacing: '-1px' }}>
              {value}
            </Typography>
            {change && (
              <Typography variant="caption" sx={{ color: change.startsWith('+') ? '#00c853' : '#ff5252', fontWeight: 600, mt: 0.5, display: 'block' }}>
                {change} from yesterday
              </Typography>
            )}
          </Box>
          <Box
            sx={{
              background: gradient,
              borderRadius: 3,
              p: 2,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
            }}
          >
            {React.cloneElement(icon as React.ReactElement, {
              sx: { fontSize: 36, color: 'white' },
            })}
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
}

export function SummaryCards() {
  const metrics = [
    {
      title: 'Total Sales',
      value: 'BDT 125,430',
      icon: <TrendingUpIcon />,
      gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      change: '+12.5%',
    },
    {
      title: 'Daily Profit',
      value: 'BDT 8,240',
      icon: <MonetizationOnIcon />,
      gradient: 'linear-gradient(135deg, #00c853 0%, #00897b 100%)',
      change: '+8.2%',
    },
    {
      title: 'Low Stock Items',
      value: '12',
      icon: <WarningIcon />,
      gradient: 'linear-gradient(135deg, #ff5252 0%, #f44336 100%)',
      change: '+3 items',
      isWarning: true,
    },
    {
      title: 'Total Products',
      value: '1,284',
      icon: <InventoryIcon />,
      gradient: 'linear-gradient(135deg, #00bcd4 0%, #0097a7 100%)',
      change: '+24 items',
    },
  ];

  return (
    <Grid container spacing={3}>
      {metrics.map((metric) => (
        <Grid item xs={12} sm={6} md={6} lg={3} key={metric.title}>
          <MetricCard
            title={metric.title}
            value={metric.value}
            icon={metric.icon}
            gradient={metric.gradient}
            change={metric.change}
            isWarning={metric.isWarning}
          />
        </Grid>
      ))}
    </Grid>
  );
}
