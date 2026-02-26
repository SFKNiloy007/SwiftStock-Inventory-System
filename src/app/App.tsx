import { useEffect, useMemo, useState } from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { InventoryPage } from './components/InventoryPage';
import { UserRole } from './components/types';
import { Toaster } from './components/ui/sonner';
import { AnalyticsPage } from './pages/AnalyticsPage';
import { DashboardPage } from './pages/DashboardPage';
import { LoginPage } from './pages/LoginPage';
import { MainLayout } from './pages/MainLayout';
import { SalesHistoryPage } from './pages/SalesHistoryPage';
import { SettingsPage } from './pages/SettingsPage';
import { StaffDashboardPage } from './pages/StaffDashboardPage';
import { SuppliersPage } from './pages/SuppliersPage';
import { TeamManagementPage } from './pages/TeamManagementPage';

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [accountRole, setAccountRole] = useState<UserRole>('Admin');
  const [userRole, setUserRole] = useState<UserRole>('Admin');

  useEffect(() => {
    const savedToken = window.localStorage.getItem('swiftstock-token');
    const savedAccountRole = window.localStorage.getItem('swiftstock-account-role') as UserRole | null;
    const savedRole = window.localStorage.getItem('swiftstock-role') as UserRole | null;

    if (savedToken) {
      setIsAuthenticated(true);
    }

    if (savedAccountRole === 'Admin' || savedAccountRole === 'Staff') {
      setAccountRole(savedAccountRole);
    }

    if (savedRole === 'Admin' || savedRole === 'Staff') {
      setUserRole(savedRole);
    }
  }, []);

  useEffect(() => {
    window.localStorage.setItem('swiftstock-account-role', accountRole);
  }, [accountRole]);

  useEffect(() => {
    window.localStorage.setItem('swiftstock-role', userRole);
  }, [userRole]);

  const defaultRoute = useMemo(
    () => (accountRole === 'Admin' ? '/dashboard' : '/staff-dashboard'),
    [accountRole]
  );

  const handleLogin = (role: UserRole, token: string) => {
    window.localStorage.setItem('swiftstock-token', token);
    setAccountRole(role);
    setUserRole(role);
    setIsAuthenticated(true);
  };

  const handleRoleChange = (role: UserRole) => {
    if (accountRole === 'Staff') {
      setUserRole('Staff');
      return;
    }

    setUserRole(role);
  };

  const handleLogout = () => {
    window.localStorage.removeItem('swiftstock-token');
    window.localStorage.removeItem('swiftstock-role');
    window.localStorage.removeItem('swiftstock-account-role');
    setIsAuthenticated(false);
  };

  return (
    <BrowserRouter>
      <Toaster />
      <Routes>
        <Route
          path="/login"
          element={
            isAuthenticated ? <Navigate to={defaultRoute} replace /> : <LoginPage onLogin={handleLogin} />
          }
        />

        <Route
          path="/"
          element={
            isAuthenticated ? (
              <MainLayout userRole={accountRole} onLogout={handleLogout} />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        >
          <Route index element={<Navigate to={defaultRoute} replace />} />
          <Route
            path="dashboard"
            element={
              accountRole === 'Admin' ? <DashboardPage /> : <Navigate to="/staff-dashboard" replace />
            }
          />
          <Route
            path="staff-dashboard"
            element={
              accountRole === 'Staff' ? <StaffDashboardPage /> : <Navigate to="/dashboard" replace />
            }
          />
          <Route
            path="products"
            element={
              <InventoryPage
                userRole={userRole}
                onRoleChange={handleRoleChange}
                canChangeRole={accountRole === 'Admin'}
                canUseAdminFeatures={accountRole === 'Admin' && userRole === 'Admin'}
              />
            }
          />
          <Route
            path="team"
            element={accountRole === 'Admin' ? <TeamManagementPage /> : <Navigate to="/staff-dashboard" replace />}
          />
          <Route path="sales-history" element={<SalesHistoryPage />} />
          <Route path="suppliers" element={<SuppliersPage />} />
          <Route path="analytics" element={<AnalyticsPage />} />
          <Route path="settings" element={<SettingsPage />} />
        </Route>

        <Route path="*" element={<Navigate to={isAuthenticated ? defaultRoute : '/login'} replace />} />
      </Routes>
    </BrowserRouter>
  );
}