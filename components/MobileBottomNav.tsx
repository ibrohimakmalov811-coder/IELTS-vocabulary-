'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, BookOpen, Dumbbell, LayoutDashboard } from 'lucide-react';

export default function MobileBottomNav() {
  const pathname = usePathname();

  const links = [
    { href: '/', label: 'Bosh sahifa', icon: Home },
    { href: '/vocabulary', label: 'Lug‘at', icon: BookOpen },
    { href: '/practice', label: 'Mashq', icon: Dumbbell },
    { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-slate-900/95 border-t border-slate-800 backdrop-blur-md px-4 py-2 flex justify-around">
      {links.map(({ href, label, icon: Icon }) => {
        const isActive = pathname === href;
        return (
          <Link
            key={href}
            href={href}
            className={`flex flex-col items-center gap-1 px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
              isActive ? 'text-emerald-400' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Icon className="w-5 h-5" />
            <span>{label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
