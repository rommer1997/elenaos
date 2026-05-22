'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/utils/cn'
import {
  LayoutDashboard,
  Calendar,
  Users,
  MessageCircle,
  Settings,
} from 'lucide-react'

interface NavItem {
  name: string
  href: string
  icon: React.ElementType
  shortName?: string
}

// Solo mostramos las 5 secciones más importantes en mobile
const mobileNavigation: NavItem[] = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard, shortName: 'Inicio' },
  { name: 'Agenda', href: '/agenda', icon: Calendar },
  { name: 'Clientes', href: '/clientes', icon: Users },
  { name: 'Retención', href: '/retencion', icon: MessageCircle },
  { name: 'Más', href: '/configuracion', icon: Settings },
]

export function MobileNav() {
  const pathname = usePathname()

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 lg:hidden">
      <div className="grid grid-cols-5 h-16">
        {mobileNavigation.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`)
          const Icon = item.icon

          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                'flex flex-col items-center justify-center gap-1 transition-colors',
                isActive
                  ? 'text-purple-600 bg-purple-50'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              )}
            >
              <Icon className="h-5 w-5" />
              <span className="text-xs font-medium">
                {item.shortName || item.name}
              </span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
