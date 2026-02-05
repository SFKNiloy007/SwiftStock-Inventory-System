import React, { useState } from 'react';
import {
  ThemeProvider,
  createTheme,
  CssBaseline,
  Box,
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Avatar,
  Badge,
} from '@mui/material';
import NotificationsIcon from '@mui/icons-material/Notifications';
import SearchIcon from '@mui/icons-material/Search';
import { Sidebar } from '@/app/components/Sidebar';
import { SummaryCards } from '@/app/components/SummaryCards';
import { SalesTrends } from '@/app/components/SalesTrends';
import { TopProducts } from '@/app/components/TopProducts';

const theme = createTheme({
  palette: {
    primary: {
      main: '#667eea',
      dark: '#5e35b1',
      light: '#7c4dff',
    },
    secondary: {
      main: '#00bcd4',
    },
    error: {
      main: '#ff5252',
    },
    success: {
      main: '#00c853',
    },
    background: {
      default: '#f8f9fa',
      paper: '#ffffff',
    },
  },
  typography: {
    fontFamily: '"Inter", "Segoe UI", "Roboto", "Helvetica", "Arial", sans-serif',
    h3: {
      fontWeight: 700,
    },
    h4: {
      fontWeight: 700,
    },
    h5: {
      fontWeight: 700,
    },
    h6: {
      fontWeight: 600,
    },
  },
  shape: {
    borderRadius: 16,
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 10,
          textTransform: 'none',
          fontWeight: 600,
        },
      },
    },
  },
});

const drawerWidth = 280;

export default function App() {
  const [activeItem, setActiveItem] = useState('dashboard');

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ display: 'flex', minHeight: '100vh', backgroundColor: 'background.default' }}>
        <Sidebar activeItem={activeItem} onItemClick={setActiveItem} />
        
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            marginLeft: `${drawerWidth}px`,
            minHeight: '100vh',
          }}
        >
          <AppBar
            position="static"
            elevation={0}
            sx={{
              backgroundColor: 'background.paper',
              borderBottom: '1px solid rgba(0, 0, 0, 0.08)',
            }}
          >
            <Toolbar sx={{ py: 1.5 }}>
              <Box sx={{ flexGrow: 1 }}>
                <Typography variant="h5" color="text.primary" sx={{ fontWeight: 700, letterSpacing: '-0.5px' }}>
                  Dashboard
                </Typography>
                <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.8rem' }}>
                  Welcome back, Admin
                </Typography>
              </Box>
              
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <IconButton 
                  sx={{ 
                    backgroundColor: '#f5f5f5',
                    '&:hover': { backgroundColor: '#eeeeee' },
                  }}
                >
                  <SearchIcon sx={{ color: 'text.secondary' }} />
                </IconButton>
                
                <IconButton
                  sx={{
                    backgroundColor: '#f5f5f5',
                    '&:hover': { backgroundColor: '#eeeeee' },
                  }}
                >
                  <Badge badgeContent={3} color="error">
                    <NotificationsIcon sx={{ color: 'text.secondary' }} />
                  </Badge>
                </IconButton>
                
                <Avatar
                  sx={{
                    width: 42,
                    height: 42,
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    cursor: 'pointer',
                    fontWeight: 600,
                  }}
                >
                  A
                </Avatar>
              </Box>
            </Toolbar>
          </AppBar>

          <Box sx={{ p: 5 }}>
            <SummaryCards />
            
            <Box sx={{ mt: 5 }}>
              <SalesTrends />
            </Box>

            <Box sx={{ mt: 5 }}>
              <TopProducts />
            </Box>
          </Box>
        </Box>
      </Box>
    </ThemeProvider>
  );
}