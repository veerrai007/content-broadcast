'use client';

import { useAuth } from '@/context/AuthContext';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect } from 'react';
import Link from 'next/link';
import { LayoutDashboard, ClipboardCheck, FileStack, LogOut } from 'lucide-react';

const navLinks = [
  { href: '/principal/dashboard', label: 'Dashboard',    icon: LayoutDashboard  },
  { href: '/principal/approvals', label: 'Approvals',    icon: ClipboardCheck   },
  { href: '/principal/all-content', label: 'All Content', icon: FileStack       },
];

export default function PrincipalLayout({ children }: { children: React.ReactNode }) {
  const { user, isLoading, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!isLoading && (!user || user.role !== 'principal')) {
      router.push('/login');
    }
  }, [user, isLoading]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="w-8 h-8 border-2 border-gray-900 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navbar */}
      <nav className="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between sticky top-0 z-50">
        {/* Left — Brand + Links */}
        <div className="flex items-center gap-8">
          <span className="text-lg font-semibold text-gray-900 tracking-tight">
            EduBroadcast
          </span>
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map(({ href, label, icon: Icon }) => (
              <Link
                key={href}
                href={href}
                className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors
                  ${pathname === href
                    ? 'bg-gray-100 text-gray-900'
                    : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'
                  }`}
              >
                <Icon size={15} />
                {label}
              </Link>
            ))}
          </div>
        </div>

        {/* Right — User + Logout */}
        <div className="flex items-center gap-4">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-medium text-gray-900">{user?.name}</p>
            <p className="text-xs text-gray-400 capitalize">{user?.role}</p>
          </div>
          <button
            onClick={logout}
            className="flex items-center gap-2 text-sm text-gray-500 hover:text-red-500 transition-colors px-3 py-2 rounded-md hover:bg-red-50"
          >
            <LogOut size={15} />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </nav>

      {/* Page Content */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        {children}
      </main>
    </div>
  );
}