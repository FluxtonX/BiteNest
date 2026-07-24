'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  FiGrid,
  FiShoppingBag,
  FiList,
  FiTag,
  FiClock,
  FiStar,
  FiSettings,
  FiLogOut,
  FiUsers,
  FiShield,
} from 'react-icons/fi';
import { useAuthStore } from '@/store/useAuthStore';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { admin, isLoggedIn, logout } = useAuthStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && !isLoggedIn && pathname !== '/admin/login') {
      router.push('/admin/login');
    }
  }, [mounted, isLoggedIn, pathname, router]);

  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  if (!mounted || !isLoggedIn) {
    return <div className="p-12 text-center text-slate-500">Checking admin authentication...</div>;
  }

  const sidebarLinks = [
    { name: 'Overview', href: '/admin', icon: FiGrid },
    { name: 'Products', href: '/admin/products', icon: FiShoppingBag },
    { name: 'Categories', href: '/admin/categories', icon: FiList },
    { name: 'Orders', href: '/admin/orders', icon: FiClock },
    { name: 'Offers & Coupons', href: '/admin/offers', icon: FiTag },
    { name: 'Reviews Moderation', href: '/admin/reviews', icon: FiStar },
    { name: 'Restaurant Settings', href: '/admin/settings', icon: FiSettings },
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col md:flex-row">
      {/* Admin Sidebar */}
      <aside className="w-full md:w-64 flex-shrink-0 border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 space-y-6">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-tr from-brand-500 to-amber-500 text-white shadow-md">
            <FiShield className="h-5 w-5" />
          </div>
          <div>
            <div className="text-sm font-black text-slate-900 dark:text-white">Admin Control</div>
            <div className="text-[10px] font-bold text-brand-500">{admin?.role.toUpperCase()}</div>
          </div>
        </div>

        <nav className="space-y-1">
          {sidebarLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-xs font-bold transition-all ${
                  isActive
                    ? 'bg-brand-500 text-white shadow-md'
                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <link.icon className="h-4 w-4" />
                {link.name}
              </Link>
            );
          })}
        </nav>

        <div className="pt-6 border-t border-slate-100 dark:border-slate-800">
          <button
            onClick={() => {
              logout();
              router.push('/admin/login');
            }}
            className="w-full flex items-center gap-2 rounded-xl bg-red-500/10 px-3.5 py-2.5 text-xs font-bold text-red-500 hover:bg-red-500 hover:text-white transition-colors"
          >
            <FiLogOut className="h-4 w-4" /> Log Out
          </button>
        </div>
      </aside>

      {/* Main Admin Content Area */}
      <main className="flex-1 p-6 md:p-10 overflow-y-auto">{children}</main>
    </div>
  );
}
