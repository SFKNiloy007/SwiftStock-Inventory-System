import React from 'react';
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Box,
  Typography,
  Divider,
} from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import InventoryIcon from '@mui/icons-material/Inventory';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import PeopleIcon from '@mui/icons-material/People';

const drawerWidth = 280;

interface SidebarProps {
  activeItem: string;
  onItemClick: (item: string) => void;
}

const menuItems = [
  { id: 'dashboard', label: 'Dashboard', icon: <DashboardIcon /> },
  { id: 'products', label: 'Products', icon: <InventoryIcon /> },
  { id: 'sales', label: 'Sales', icon: <AttachMoneyIcon /> },
  { id: 'users', label: 'Users', icon: <PeopleIcon /> },
];

export function Sidebar({ activeItem, onItemClick }: SidebarProps) {
  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: drawerWidth,
          boxSizing: 'border-box',
          background: 'linear-gradient(180deg, #1a237e 0%, #283593 100%)',
          borderRight: 'none',
          color: 'white',
        },
      }}
    >
      <Box sx={{ p: 4, pb: 3 }}>
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: 1.5,
          mb: 1,
        }}>
          <Box
            sx={{
              width: 40,
              height: 40,
              borderRadius: 2,
              background: 'linear-gradient(135deg, #00bcd4 0%, #00acc1 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 700,
              fontSize: '1.25rem',
            }}
          >
            S
          </Box>
          <Box>
            <Typography variant="h5" fontWeight={700} sx={{ letterSpacing: '-0.5px' }}>
              SwiftStock
            </Typography>
            <Typography variant="caption" sx={{ opacity: 0.7, fontSize: '0.7rem' }}>
              Inventory Management
            </Typography>
          </Box>
        </Box>
      </Box>
      
      <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.1)', mx: 2 }} />
      
      <List sx={{ pt: 3, px: 2 }}>
        {menuItems.map((item) => (
          <ListItem key={item.id} disablePadding sx={{ mb: 1 }}>
            <ListItemButton
              selected={activeItem === item.id}
              onClick={() => onItemClick(item.id)}
              sx={{
                borderRadius: 3,
                py: 1.5,
                transition: 'all 0.2s ease',
                '&.Mui-selected': {
                  background: 'linear-gradient(90deg, rgba(0, 188, 212, 0.2) 0%, rgba(0, 188, 212, 0.1) 100%)',
                  borderLeft: '3px solid #00bcd4',
                  '&:hover': {
                    background: 'linear-gradient(90deg, rgba(0, 188, 212, 0.3) 0%, rgba(0, 188, 212, 0.15) 100%)',
                  },
                },
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.08)',
                  transform: 'translateX(4px)',
                },
              }}
            >
              <ListItemIcon
                sx={{
                  color: 'white',
                  minWidth: 45,
                  opacity: activeItem === item.id ? 1 : 0.7,
                }}
              >
                {item.icon}
              </ListItemIcon>
              <ListItemText 
                primary={item.label}
                primaryTypographyProps={{
                  fontWeight: activeItem === item.id ? 600 : 400,
                  fontSize: '0.95rem',
                }}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Drawer>
  );
}