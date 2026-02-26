import { useEffect, useRef } from 'react';
import { Search, X } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { UserRole } from './types';

type HeaderProps = {
  userRole: UserRole;
  onRoleChange: (role: UserRole) => void;
  canChangeRole: boolean;
  searchExpanded: boolean;
  onSearchExpandedChange: (expanded: boolean) => void;
  searchQuery: string;
  onSearchQueryChange: (query: string) => void;
};

export function Header({
  userRole,
  onRoleChange,
  canChangeRole,
  searchExpanded,
  onSearchExpandedChange,
  searchQuery,
  onSearchQueryChange,
}: HeaderProps) {
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (searchExpanded) {
      searchInputRef.current?.focus();
    }
  }, [searchExpanded]);

  const toggleSearch = () => {
    onSearchExpandedChange(!searchExpanded);
  };

  const closeSearch = () => {
    onSearchQueryChange('');
    onSearchExpandedChange(false);
  };

  return (
    <header className="flex flex-wrap items-center justify-between gap-4 border-b border-[#f1f5f9] bg-white px-6 py-4">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Inventory Management</h1>
        <p className="mt-1 text-sm text-gray-500">Track and manage your products in one place.</p>
      </div>

      <div className="flex items-center gap-3">
        {canChangeRole ? (
          <div className="flex items-center gap-2 rounded-[12px] border border-[#f1f5f9] bg-white p-1 shadow-[0_4px_20px_rgba(0,0,0,0.05)]">
            <button
              type="button"
              onClick={() => onRoleChange('Admin')}
              className={`rounded-[12px] px-3 py-1.5 text-sm transition-colors ${
                userRole === 'Admin'
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Admin
            </button>
            <button
              type="button"
              onClick={() => onRoleChange('Staff')}
              className={`rounded-[12px] px-3 py-1.5 text-sm transition-colors ${
                userRole === 'Staff'
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Staff
            </button>
          </div>
        ) : (
          <div className="rounded-[12px] border border-[#f1f5f9] bg-slate-50 px-3 py-1.5 text-sm text-slate-600 shadow-[0_4px_20px_rgba(0,0,0,0.05)]">
            Role: {userRole}
          </div>
        )}

        <div
          className={`flex items-center overflow-hidden rounded-[12px] border-[#f1f5f9] transition-[all] duration-[400ms] ease-[cubic-bezier(0.4,0,0.2,1)] ${
            searchExpanded ? 'w-72 border bg-white shadow-[0_4px_20px_rgba(0,0,0,0.05)]' : 'w-10'
          }`}
        >
          {searchExpanded ? (
            <div className="relative w-full">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <Input
                ref={searchInputRef}
                value={searchQuery}
                onChange={(event) => onSearchQueryChange(event.target.value)}
                placeholder="Search products..."
                className="h-10 border-0 pl-9 pr-9 focus-visible:ring-0"
              />
              <button
                type="button"
                onClick={closeSearch}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700"
                aria-label="Close search"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <Button variant="outline" size="icon" onClick={toggleSearch} className="h-10 w-10">
              <Search className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
