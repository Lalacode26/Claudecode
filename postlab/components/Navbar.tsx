'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'
import { cn } from '@/lib/utils'
import type { User } from '@supabase/supabase-js'

const navItems = [
  { href: '/dashboard', label: 'Bảng Content' },
  { href: '/ai', label: 'AI Tools' },
  { href: '/calendar', label: 'Lịch' },
]

export default function Navbar({ user }: { user: User }) {
  const pathname = usePathname()
  const router = useRouter()
  const supabase = createClient()

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push('/login')
    router.refresh()
  }

  return (
    <nav className="bg-white border-b border-slate-200 px-6 py-3 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-8">
          <span className="font-bold text-violet-600 text-lg">✏️ PostLab</span>
          <div className="flex gap-1">
            {navItems.map(item => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'px-3 py-1.5 rounded-md text-sm font-medium transition',
                  pathname === item.href
                    ? 'bg-violet-100 text-violet-700'
                    : 'text-slate-600 hover:bg-slate-100'
                )}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs text-slate-400 hidden sm:block">{user.email}</span>
          <button
            onClick={handleSignOut}
            className="text-sm text-slate-600 hover:text-red-500 transition px-3 py-1.5 rounded-md hover:bg-red-50"
          >
            Đăng xuất
          </button>
        </div>
      </div>
    </nav>
  )
}
