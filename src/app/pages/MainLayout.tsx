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
        <div className="flex h-16 items-center justify-between border-b border-[#f1f5f9] bg-white px-6 shadow-[0_4px_20px_rgba(0,0,0,0.03)]">
          <p className="text-sm text-gray-600">SwiftStock Inventory Management System</p>
          <Badge variant="outline" className="border-blue-200 bg-blue-50 text-blue-700">
            Role: {userRole}
          </Badge>
        </div>
        <Outlet />
      </main>
    </div>
  );
}
