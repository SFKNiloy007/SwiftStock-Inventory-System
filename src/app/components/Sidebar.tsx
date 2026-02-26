import {
  Boxes,
  ChartColumn,
  History,
  LayoutDashboard,
  LogOut,
  Package,
  Settings,
  Truck,
  Users,
} from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { UserRole } from './types';

type SidebarProps = {
  userRole: UserRole;
  onLogout: () => void;
};

export function Sidebar({ userRole, onLogout }: SidebarProps) {
  const navItems =
    userRole === 'Admin'
      ? [
          { label: 'Dashboard', icon: LayoutDashboard, to: '/dashboard' },
          { label: 'Products', icon: Package, to: '/products' },
          { label: 'Team', icon: Users, to: '/team' },
          { label: 'Sales History', icon: History, to: '/sales-history' },
          { label: 'Suppliers', icon: Truck, to: '/suppliers' },
          { label: 'Analytics', icon: ChartColumn, to: '/analytics' },
          { label: 'Settings', icon: Settings, to: '/settings' },
        ]
      : [
          { label: 'Dashboard', icon: LayoutDashboard, to: '/staff-dashboard' },
          { label: 'Products', icon: Package, to: '/products' },
          { label: 'Sales History', icon: History, to: '/sales-history' },
          { label: 'Settings', icon: Settings, to: '/settings' },
        ];

  return (
    <aside className="hidden md:flex w-64 shrink-0 flex-col border-r border-slate-700 bg-gradient-to-b from-slate-900 to-indigo-950">
      <div className="flex h-16 items-center gap-2 border-b border-slate-700 px-5">
        <Boxes className="h-5 w-5 text-indigo-300" />
        <span className="text-lg font-semibold text-slate-100">SwiftStock</span>
      </div>

      <nav className="flex-1 px-3 py-4">
        {navItems.map((item) => {
          const Icon = item.icon;

          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `mb-1 flex w-full items-center gap-3 rounded-[12px] border-l-2 px-3 py-2 text-sm transition-all ${
                  isActive
                    ? 'border-indigo-300 bg-white/10 text-white shadow-[0_0_18px_rgba(99,102,241,0.28)]'
                    : 'border-transparent text-slate-300 hover:bg-white/5 hover:text-white'
                }`
              }
            >
              <Icon className="h-4 w-4" />
              {item.label}
            </NavLink>
          );
        })}
      </nav>

      <div className="border-t border-slate-700 p-3">
        <button
          type="button"
          onClick={onLogout}
          className="flex w-full items-center gap-3 rounded-[12px] border border-transparent px-3 py-2 text-sm text-slate-300 transition-all hover:border-indigo-400/30 hover:bg-white/5 hover:text-white"
        >
          <LogOut className="h-4 w-4" />
          Logout
        </button>
      </div>
    </aside>
  );
}
