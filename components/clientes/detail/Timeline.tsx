import { useState, useEffect } from 'react'
import { MessageCircle, Calendar, UserPlus, Star } from 'lucide-react'

interface TimelineEvent {
  id: string
  type: 'message' | 'appointment' | 'registration' | 'review'
  title: string
  description: string
  date: string
  icon: React.ElementType
  color: string
}

interface TimelineProps {
  clientId: string
}

export function Timeline({ clientId }: TimelineProps) {
  const [events, setEvents] = useState<TimelineEvent[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadTimeline()
  }, [clientId])

  const loadTimeline = async () => {
    setIsLoading(true)

    // TODO: Implementar query real
    // Mock data
    const mockEvents: TimelineEvent[] = [
      {
        id: '1',
        type: 'appointment',
        title: 'Cita completada',
        description: 'Manicura completa',
        date: '2026-05-15T15:00:00Z',
        icon: Calendar,
        color: 'text-green-600',
      },
      {
        id: '2',
        type: 'message',
        title: 'Mensaje enviado',
        description: 'Recordatorio de cita',
        date: '2026-05-13T10:00:00Z',
        icon: MessageCircle,
        color: 'text-blue-600',
      },
      {
        id: '3',
        type: 'appointment',
        title: 'Cita completada',
        description: 'Pedicura + Manicura',
        date: '2026-04-18T16:30:00Z',
        icon: Calendar,
        color: 'text-green-600',
      },
      {
        id: '4',
        type: 'review',
        title: 'Reseña dejada',
        description: '5 estrellas - "Excelente servicio"',
        date: '2026-04-19T12:00:00Z',
        icon: Star,
        color: 'text-yellow-600',
      },
      {
        id: '5',
        type: 'registration',
        title: 'Registro inicial',
        description: 'Cliente registrada en el sistema',
        date: '2024-01-10T10:00:00Z',
        icon: UserPlus,
        color: 'text-purple-600',
      },
    ]

    setEvents(mockEvents)
    setIsLoading(false)
  }

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Timeline</h3>
        <div className="text-center py-4">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-purple-600 mx-auto"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Timeline</h3>

      {events.length === 0 ? (
        <p className="text-sm text-gray-600 text-center py-4">
          No hay eventos registrados
        </p>
      ) : (
        <div className="space-y-4">
          {events.map((event, index) => {
            const Icon = event.icon
            const isLast = index === events.length - 1

            return (
              <div key={event.id} className="relative">
                {/* Connecting line */}
                {!isLast && (
                  <div className="absolute left-5 top-10 bottom-0 w-0.5 bg-gray-200" />
                )}

                {/* Event */}
                <div className="flex gap-3">
                  <div className={`p-2 rounded-full bg-gray-100 flex-shrink-0 relative z-10`}>
                    <Icon className={`h-4 w-4 ${event.color}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-gray-900">{event.title}</div>
                    <div className="text-xs text-gray-600 mt-0.5">{event.description}</div>
                    <div className="text-xs text-gray-500 mt-1">
                      {new Date(event.date).toLocaleDateString('es-ES', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
