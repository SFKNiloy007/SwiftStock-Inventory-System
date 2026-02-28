import { Outlet } from 'react-router-dom';
import { Sidebar } from '../components/Sidebar';
import { Badge } from '../components/ui/badge';
import { UserRole } from '../components/types';

type MainLayoutProps = {
  userRole: UserRole;
  onLogout: () => void;
};

export function MainLayout({ userRole, onLogout }: MainLayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50 md:flex">
      <Sidebar userRole={userRole} onLogout={onLogout} />
      <main className="flex-1">
        <div className="flex min-h-16 flex-wrap items-center justify-between gap-2 border-b border-[#f1f5f9] bg-white px-4 py-2 shadow-[0_4px_20px_rgba(0,0,0,0.03)] md:h-16 md:px-6 md:py-0">
          <p className="text-xs text-gray-600 sm:text-sm">SwiftStock Inventory Management System</p>
          <Badge variant="outline" className="border-blue-200 bg-blue-50 text-blue-700">
            Role: {userRole}
          </Badge>
        </div>
        <Outlet />
      </main>
    </div>
  );
}
