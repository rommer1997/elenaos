'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/utils/cn'
import {
  LayoutDashboard,
  Calendar,
  Users as UsersIcon,
  MessageCircle,
  FileText,
  Package,
  Settings,
  Users,
  Scissors,
  Bot,
  CreditCard,
} from 'lucide-react'

interface NavItem {
  name: string
  href: string
  icon: React.ElementType
}

const navigation: NavItem[] = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Agenda', href: '/agenda', icon: Calendar },
  { name: 'Clientes', href: '/clientes', icon: UsersIcon },
  { name: 'Retención', href: '/retencion', icon: MessageCircle },
  { name: 'Agente IA', href: '/agente', icon: Bot },
  { name: 'Facturación', href: '/facturacion', icon: FileText },
  { name: 'Inventario', href: '/inventario', icon: Package },
  { name: 'Personal', href: '/personal', icon: Users },
  { name: 'Servicios', href: '/servicios', icon: Scissors },
  { name: 'Suscripción', href: '/billing', icon: CreditCard },
  { name: 'Configuración', href: '/configuracion', icon: Settings },
]

interface SidebarProps {
  salonName?: string
  isCollapsed?: boolean
}

export function Sidebar({ salonName = 'ElenaOS', isCollapsed = false }: SidebarProps) {
  const pathname = usePathname()

  return (
    <div
      className={cn(
        'flex flex-col h-full bg-white border-r border-gray-200 transition-all duration-300',
        isCollapsed ? 'w-16' : 'w-64'
      )}
    >
      {/* Logo */}
      <div className="flex items-center justify-center h-16 border-b border-gray-200 px-4">
        {isCollapsed ? (
          <div className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            E
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              ElenaOS
            </h1>
          </div>
        )}
      </div>

      {/* Salon Name */}
      {!isCollapsed && (
        <div className="px-4 py-3 border-b border-gray-200">
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">
            Tu salón
          </p>
          <p className="text-sm font-semibold text-gray-900 truncate">
            {salonName}
          </p>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {navigation.map((item) => {
          const isActive = pathname === item.href
          const Icon = item.icon

          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                'flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                isActive
                  ? 'bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700'
                  : 'text-gray-700 hover:bg-gray-100'
              )}
              title={isCollapsed ? item.name : undefined}
            >
              <Icon className="h-5 w-5 flex-shrink-0" />
              {!isCollapsed && <span>{item.name}</span>}
            </Link>
          )
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200">
        {!isCollapsed && (
          <div className="text-xs text-gray-500 text-center">
            <p>© 2026 ElenaOS</p>
          </div>
        )}
      </div>
    </div>
  )
}
