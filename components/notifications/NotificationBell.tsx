'use client'

import { useState, useEffect } from 'react'
import { Bell } from 'lucide-react'
import { NotificationDropdown } from './NotificationDropdown'

export function NotificationBell() {
  const [isOpen, setIsOpen] = useState(false)
  const [unreadCount, setUnreadCount] = useState(0)
  const [notifications, setNotifications] = useState<any[]>([])

  // Mock data - En producción vendría de Supabase Realtime
  useEffect(() => {
    const mockNotifications = [
      {
        id: '1',
        type: 'appointment_confirmed',
        title: 'Cita confirmada',
        message: 'María López confirmó su cita para mañana a las 10:00',
        timestamp: new Date(Date.now() - 1000 * 60 * 5), // 5 min ago
        read: false,
        priority: 'normal',
        icon: '📅'
      },
      {
        id: '2',
        type: 'campaign_response',
        title: 'Respuesta de campaña',
        message: 'Ana García respondió al mensaje de retención',
        timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 min ago
        read: false,
        priority: 'normal',
        icon: '💬'
      },
      {
        id: '3',
        type: 'invoice_paid',
        title: 'Factura pagada',
        message: 'Factura #045 de Carmen Rodríguez ha sido pagada (€85)',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2h ago
        read: false,
        priority: 'normal',
        icon: '💰'
      },
      {
        id: '4',
        type: 'client_reactivated',
        title: 'Cliente reactivada',
        message: 'Laura Pérez agendó cita después de 60 días',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 3), // 3h ago
        read: true,
        priority: 'normal',
        icon: '🎉'
      }
    ]

    setNotifications(mockNotifications)
    setUnreadCount(mockNotifications.filter(n => !n.read).length)

    // Simular nueva notificación después de 10 segundos
    const timer = setTimeout(() => {
      const newNotification = {
        id: Date.now().toString(),
        type: 'new_appointment',
        title: 'Nueva cita',
        message: 'Patricia Sánchez ha agendado una cita para el viernes',
        timestamp: new Date(),
        read: false,
        priority: 'normal',
        icon: '🆕'
      }
      setNotifications(prev => [newNotification, ...prev])
      setUnreadCount(prev => prev + 1)
    }, 10000)

    return () => clearTimeout(timer)
  }, [])

  const handleMarkAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(n => (n.id === id ? { ...n, read: true } : n))
    )
    setUnreadCount(prev => Math.max(0, prev - 1))
  }

  const handleMarkAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })))
    setUnreadCount(0)
  }

  const handleDelete = (id: string) => {
    const notification = notifications.find(n => n.id === id)
    setNotifications(prev => prev.filter(n => n.id !== id))
    if (notification && !notification.read) {
      setUnreadCount(prev => Math.max(0, prev - 1))
    }
  }

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-gray-600 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
      >
        <Bell className="h-6 w-6" />
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center animate-pulse">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <NotificationDropdown
          notifications={notifications}
          onClose={() => setIsOpen(false)}
          onMarkAsRead={handleMarkAsRead}
          onMarkAllAsRead={handleMarkAllAsRead}
          onDelete={handleDelete}
        />
      )}
    </div>
  )
}
