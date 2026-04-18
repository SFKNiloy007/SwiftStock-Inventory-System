import { Suspense, lazy, useEffect, useMemo, useState } from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { InventoryPage } from './components/InventoryPage';
import { UserRole } from './components/types';
import { Toaster } from './components/ui/sonner';
import { DashboardPage } from './pages/DashboardPage';
import { LoginPage } from './pages/LoginPage';
import { MainLayout } from './pages/MainLayout';
import { StaffDashboardPage } from './pages/StaffDashboardPage';

const AnalyticsPage = lazy(() =>
  import('./pages/AnalyticsPage').then((module) => ({ default: module.AnalyticsPage }))
);
const SalesHistoryPage = lazy(() =>
  import('./pages/SalesHistoryPage').then((module) => ({ default: module.SalesHistoryPage }))
);
const SettingsPage = lazy(() =>
  import('./pages/SettingsPage').then((module) => ({ default: module.SettingsPage }))
);
const SuppliersPage = lazy(() =>
  import('./pages/SuppliersPage').then((module) => ({ default: module.SuppliersPage }))
);
const TeamManagementPage = lazy(() =>
  import('./pages/TeamManagementPage').then((module) => ({ default: module.TeamManagementPage }))
);

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [accountRole, setAccountRole] = useState<UserRole>('Owner');
  const [userRole, setUserRole] = useState<UserRole>('Owner');

  const hasAdminAccess = (role: UserRole) => role === 'Admin' || role === 'Owner';

  useEffect(() => {
    const savedToken = window.localStorage.getItem('swiftstock-token');
    const savedAccountRole = window.localStorage.getItem('swiftstock-account-role') as UserRole | null;
    const savedRole = window.localStorage.getItem('swiftstock-role') as UserRole | null;

    if (savedToken) {
      setIsAuthenticated(true);
    }

    if (savedAccountRole === 'Owner' || savedAccountRole === 'Admin' || savedAccountRole === 'Staff') {
      setAccountRole(savedAccountRole);
    }

    if (savedRole === 'Owner' || savedRole === 'Admin' || savedRole === 'Staff') {
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
    () => (hasAdminAccess(accountRole) ? '/dashboard' : '/staff-dashboard'),
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
      <Suspense fallback={<div className="p-6 text-sm text-gray-500">Loading page...</div>}>
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
                hasAdminAccess(accountRole) ? <DashboardPage /> : <Navigate to="/staff-dashboard" replace />
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
                  canChangeRole={hasAdminAccess(accountRole)}
                  canUseAdminFeatures={hasAdminAccess(accountRole) && hasAdminAccess(userRole)}
                />
              }
            />
            <Route
              path="team"
              element={hasAdminAccess(accountRole) ? <TeamManagementPage /> : <Navigate to="/staff-dashboard" replace />}
            />
            <Route path="sales-history" element={<SalesHistoryPage />} />
            <Route path="suppliers" element={<SuppliersPage />} />
            <Route path="analytics" element={<AnalyticsPage />} />
            <Route path="settings" element={<SettingsPage userRole={userRole} />} />
          </Route>

          <Route path="*" element={<Navigate to={isAuthenticated ? defaultRoute : '/login'} replace />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}