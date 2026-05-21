'use client'

import { MessageCircle, Calendar, Package, CheckCircle } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import { es } from 'date-fns/locale'

export function ActivityFeed() {
  // Mock activity data
  const activities = [
    {
      id: '1',
      type: 'whatsapp_response',
      icon: '💬',
      title: 'Respuesta WhatsApp',
      message: 'María López respondió: "Sí, confirmo para mañana"',
      timestamp: new Date(Date.now() - 1000 * 60 * 5),
      color: 'bg-green-100 text-green-700 border-green-300',
      urgent: false
    },
    {
      id: '2',
      type: 'appointment_confirmed',
      icon: '✅',
      title: 'Cita confirmada',
      message: 'Ana García confirmó automáticamente su cita del viernes',
      timestamp: new Date(Date.now() - 1000 * 60 * 12),
      color: 'bg-blue-100 text-blue-700 border-blue-300',
      urgent: false
    },
    {
      id: '3',
      type: 'low_stock',
      icon: '⚠️',
      title: 'Stock bajo',
      message: 'Tinte Rubio Platino tiene solo 3 unidades',
      timestamp: new Date(Date.now() - 1000 * 60 * 25),
      color: 'bg-orange-100 text-orange-700 border-orange-300',
      urgent: true
    },
    {
      id: '4',
      type: 'whatsapp_response',
      icon: '💬',
      title: 'Respuesta WhatsApp',
      message: 'Carmen Rodríguez: "¿Puedo cambiar la hora a las 11:00?"',
      timestamp: new Date(Date.now() - 1000 * 60 * 35),
      color: 'bg-green-100 text-green-700 border-green-300',
      urgent: true
    },
    {
      id: '5',
      type: 'appointment_confirmed',
      icon: '✅',
      title: 'Cita confirmada',
      message: 'Laura Pérez confirmó por WhatsApp',
      timestamp: new Date(Date.now() - 1000 * 60 * 45),
      color: 'bg-blue-100 text-blue-700 border-blue-300',
      urgent: false
    },
    {
      id: '6',
      type: 'client_reactivated',
      icon: '🎉',
      title: 'Cliente reactivada',
      message: 'Patricia Sánchez agendó cita después de 65 días',
      timestamp: new Date(Date.now() - 1000 * 60 * 60),
      color: 'bg-purple-100 text-purple-700 border-purple-300',
      urgent: false
    },
    {
      id: '7',
      type: 'appointment_confirmed',
      icon: '✅',
      title: 'Cita confirmada',
      message: 'Isabel Martín confirmó automáticamente',
      timestamp: new Date(Date.now() - 1000 * 60 * 75),
      color: 'bg-blue-100 text-blue-700 border-blue-300',
      urgent: false
    },
    {
      id: '8',
      type: 'whatsapp_sent',
      icon: '📤',
      title: 'Mensaje enviado',
      message: 'Campaña de retención enviada a 5 clientas',
      timestamp: new Date(Date.now() - 1000 * 60 * 90),
      color: 'bg-gray-100 text-gray-700 border-gray-300',
      urgent: false
    }
  ]

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'whatsapp_response':
        return MessageCircle
      case 'appointment_confirmed':
        return CheckCircle
      case 'low_stock':
        return Package
      case 'client_reactivated':
        return Calendar
      default:
        return MessageCircle
    }
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Actividad reciente</h2>
          <p className="text-sm text-gray-600 mt-1">
            Actualizaciones en tiempo real
          </p>
        </div>
        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
      </div>

      {/* Activity list */}
      <div className="flex-1 overflow-y-auto space-y-3 -mx-2 px-2">
        {activities.map((activity) => {
          const Icon = getActivityIcon(activity.type)

          return (
            <div
              key={activity.id}
              className={`p-3 rounded-lg border transition-all hover:shadow-md ${
                activity.urgent
                  ? 'border-orange-300 bg-orange-50'
                  : 'border-gray-200 bg-white hover:bg-gray-50'
              }`}
            >
              <div className="flex items-start gap-3">
                {/* Icon */}
                <div className="flex-shrink-0 text-2xl">
                  {activity.icon}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-semibold text-sm text-gray-900">
                      {activity.title}
                    </h4>
                    {activity.urgent && (
                      <span className="px-1.5 py-0.5 bg-orange-200 text-orange-800 text-xs font-bold rounded">
                        URGENTE
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-700 mb-2">
                    {activity.message}
                  </p>
                  <p className="text-xs text-gray-500">
                    {formatDistanceToNow(activity.timestamp, {
                      addSuffix: true,
                      locale: es
                    })}
                  </p>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Footer */}
      <div className="mt-4 pt-4 border-t border-gray-200">
        <button className="w-full py-2 text-sm font-medium text-purple-600 hover:bg-purple-50 rounded-lg transition-colors">
          Ver toda la actividad
        </button>
      </div>
    </div>
  )
}
