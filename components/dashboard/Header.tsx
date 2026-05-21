'use client'

import { useUser } from '@/hooks/useUser'
import { Bell, Menu, X } from 'lucide-react'
import { useState } from 'react'

interface HeaderProps {
  onToggleSidebar?: () => void
  isSidebarCollapsed?: boolean
}

export function Header({ onToggleSidebar, isSidebarCollapsed }: HeaderProps) {
  const { user, profile, tenant } = useUser()
  const [showNotifications, setShowNotifications] = useState(false)

  // Mock notifications - en el futuro vendrán de DB
  const notifications = [
    {
      id: 1,
      title: 'Nueva cita agendada',
      message: 'Carmen López - Manicura - 15:00',
      time: 'Hace 5 min',
      unread: true,
    },
  ]

  const unreadCount = notifications.filter((n) => n.unread).length

  // Generar iniciales del nombre
  const initials = profile
    ? `${profile.first_name?.charAt(0) || ''}${profile.last_name?.charAt(0) || ''}`
    : user?.email?.charAt(0).toUpperCase() || '?'

  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 lg:px-6">
      {/* Left side - Sidebar toggle */}
      <div className="flex items-center gap-4">
        <button
          onClick={onToggleSidebar}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors lg:hidden"
          aria-label="Toggle menu"
        >
          {isSidebarCollapsed ? (
            <Menu className="h-5 w-5 text-gray-600" />
          ) : (
            <X className="h-5 w-5 text-gray-600" />
          )}
        </button>

        {/* Desktop toggle */}
        <button
          onClick={onToggleSidebar}
          className="hidden lg:block p-2 hover:bg-gray-100 rounded-lg transition-colors"
          aria-label="Toggle sidebar"
        >
          <Menu className="h-5 w-5 text-gray-600" />
        </button>

        {/* Salon name - solo visible en mobile cuando sidebar está colapsado */}
        {isSidebarCollapsed && (
          <div className="lg:hidden">
            <h2 className="text-sm font-semibold text-gray-900 truncate max-w-[150px]">
              {tenant?.name || 'ElenaOS'}
            </h2>
          </div>
        )}
      </div>

      {/* Right side - Notifications and User */}
      <div className="flex items-center gap-3">
        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="Notificaciones"
          >
            <Bell className="h-5 w-5 text-gray-600" />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 h-4 w-4 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </button>

          {/* Notifications dropdown */}
          {showNotifications && (
            <>
              {/* Backdrop */}
              <div
                className="fixed inset-0 z-10"
                onClick={() => setShowNotifications(false)}
              />
              {/* Dropdown */}
              <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-20">
                <div className="p-4 border-b border-gray-200">
                  <h3 className="font-semibold text-gray-900">Notificaciones</h3>
                </div>
                <div className="max-h-96 overflow-y-auto">
                  {notifications.length > 0 ? (
                    notifications.map((notification) => (
                      <div
                        key={notification.id}
                        className={`p-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer ${
                          notification.unread ? 'bg-purple-50' : ''
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <div className="flex-1">
                            <p className="text-sm font-medium text-gray-900">
                              {notification.title}
                            </p>
                            <p className="text-sm text-gray-600 mt-1">
                              {notification.message}
                            </p>
                            <p className="text-xs text-gray-500 mt-1">
                              {notification.time}
                            </p>
                          </div>
                          {notification.unread && (
                            <div className="h-2 w-2 bg-purple-600 rounded-full flex-shrink-0 mt-1" />
                          )}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="p-8 text-center text-gray-500 text-sm">
                      No tienes notificaciones
                    </div>
                  )}
                </div>
              </div>
            </>
          )}
        </div>

        {/* User avatar and info */}
        <div className="flex items-center gap-3 pl-3 border-l border-gray-200">
          <div className="hidden sm:block text-right">
            <p className="text-sm font-medium text-gray-900">
              {profile?.first_name || user?.email?.split('@')[0]}
            </p>
            <p className="text-xs text-gray-500 capitalize">{profile?.role || 'Usuario'}</p>
          </div>
          <div className="h-9 w-9 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 flex items-center justify-center text-white font-semibold text-sm">
            {initials}
          </div>
        </div>
      </div>
    </header>
  )
}
