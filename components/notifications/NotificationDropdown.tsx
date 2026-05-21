'use client'

import { X, Check, CheckCheck, Trash2 } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import { es } from 'date-fns/locale'

interface Notification {
  id: string
  type: string
  title: string
  message: string
  timestamp: Date
  read: boolean
  priority: 'urgent' | 'normal'
  icon: string
}

interface NotificationDropdownProps {
  notifications: Notification[]
  onClose: () => void
  onMarkAsRead: (id: string) => void
  onMarkAllAsRead: () => void
  onDelete: (id: string) => void
}

export function NotificationDropdown({
  notifications,
  onClose,
  onMarkAsRead,
  onMarkAllAsRead,
  onDelete
}: NotificationDropdownProps) {
  const unreadCount = notifications.filter(n => !n.read).length

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 z-40"
        onClick={onClose}
      />

      {/* Dropdown */}
      <div className="absolute right-0 top-12 w-96 max-h-[600px] bg-white rounded-2xl shadow-2xl border-2 border-purple-100 z-50 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <div>
            <h3 className="font-bold text-gray-900">Notificaciones</h3>
            {unreadCount > 0 && (
              <p className="text-xs text-gray-500">{unreadCount} sin leer</p>
            )}
          </div>
          <div className="flex items-center gap-2">
            {unreadCount > 0 && (
              <button
                onClick={onMarkAllAsRead}
                className="p-2 text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                title="Marcar todas como leídas"
              >
                <CheckCheck className="h-4 w-4" />
              </button>
            )}
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Notifications list */}
        <div className="flex-1 overflow-y-auto">
          {notifications.length === 0 ? (
            <div className="p-12 text-center">
              <div className="text-6xl mb-4">🔔</div>
              <p className="text-gray-500 font-medium">No tienes notificaciones</p>
              <p className="text-sm text-gray-400 mt-1">
                Te avisaremos cuando haya algo nuevo
              </p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-4 hover:bg-gray-50 transition-colors group ${
                    !notification.read ? 'bg-purple-50/50' : ''
                  }`}
                >
                  <div className="flex gap-3">
                    {/* Icon */}
                    <div className="flex-shrink-0 text-2xl">
                      {notification.icon}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <h4 className={`font-semibold text-sm ${
                          !notification.read ? 'text-gray-900' : 'text-gray-700'
                        }`}>
                          {notification.title}
                        </h4>
                        {!notification.read && (
                          <div className="w-2 h-2 bg-purple-600 rounded-full flex-shrink-0 mt-1"></div>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 mb-2">
                        {notification.message}
                      </p>
                      <div className="flex items-center justify-between">
                        <p className="text-xs text-gray-400">
                          {formatDistanceToNow(notification.timestamp, {
                            addSuffix: true,
                            locale: es
                          })}
                        </p>
                        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          {!notification.read && (
                            <button
                              onClick={() => onMarkAsRead(notification.id)}
                              className="p-1.5 text-purple-600 hover:bg-purple-100 rounded transition-colors"
                              title="Marcar como leída"
                            >
                              <Check className="h-3.5 w-3.5" />
                            </button>
                          )}
                          <button
                            onClick={() => onDelete(notification.id)}
                            className="p-1.5 text-red-600 hover:bg-red-50 rounded transition-colors"
                            title="Eliminar"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {notifications.length > 0 && (
          <div className="p-3 border-t border-gray-200">
            <button className="w-full py-2 text-sm text-purple-600 hover:bg-purple-50 rounded-lg font-medium transition-colors">
              Ver todas las notificaciones
            </button>
          </div>
        )}
      </div>
    </>
  )
}
