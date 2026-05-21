import { useState, useEffect } from 'react'
import { Calendar, Scissors, Euro, User } from 'lucide-react'

interface Visit {
  id: string
  date: string
  service: string
  staff: string
  price: number
  status: 'completed' | 'cancelled' | 'no_show'
}

interface VisitHistoryProps {
  clientId: string
}

export function VisitHistory({ clientId }: VisitHistoryProps) {
  const [visits, setVisits] = useState<Visit[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadVisits()
  }, [clientId])

  const loadVisits = async () => {
    setIsLoading(true)

    // TODO: Implementar query real
    // Mock data
    const mockVisits: Visit[] = [
      {
        id: '1',
        date: '2026-05-15T15:00:00Z',
        service: 'Manicura completa',
        staff: 'María López',
        price: 35.00,
        status: 'completed',
      },
      {
        id: '2',
        date: '2026-04-18T16:30:00Z',
        service: 'Pedicura + Manicura',
        staff: 'María López',
        price: 55.00,
        status: 'completed',
      },
      {
        id: '3',
        date: '2026-03-22T14:00:00Z',
        service: 'Tratamiento facial',
        staff: 'Laura García',
        price: 65.00,
        status: 'completed',
      },
      {
        id: '4',
        date: '2026-02-28T15:30:00Z',
        service: 'Manicura permanente',
        staff: 'María López',
        price: 45.00,
        status: 'completed',
      },
      {
        id: '5',
        date: '2026-01-31T17:00:00Z',
        service: 'Pedicura spa',
        staff: 'María López',
        price: 40.00,
        status: 'completed',
      },
    ]

    setVisits(mockVisits)
    setIsLoading(false)
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return {
          label: 'Completada',
          className: 'bg-green-100 text-green-800',
        }
      case 'cancelled':
        return {
          label: 'Cancelada',
          className: 'bg-red-100 text-red-800',
        }
      case 'no_show':
        return {
          label: 'No asistió',
          className: 'bg-orange-100 text-orange-800',
        }
      default:
        return {
          label: status,
          className: 'bg-gray-100 text-gray-800',
        }
    }
  }

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Historial de visitas</h2>
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto"></div>
          <p className="mt-2 text-sm text-gray-600">Cargando historial...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">
        Historial de visitas ({visits.length})
      </h2>

      {visits.length === 0 ? (
        <div className="text-center py-8">
          <Calendar className="h-12 w-12 text-gray-300 mx-auto mb-3" />
          <p className="text-sm text-gray-600">No hay visitas registradas</p>
        </div>
      ) : (
        <div className="space-y-3">
          {visits.map((visit) => {
            const statusBadge = getStatusBadge(visit.status)

            return (
              <div
                key={visit.id}
                className="flex items-start justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-start gap-3 flex-1">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <Scissors className="h-5 w-5 text-purple-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-medium text-gray-900">{visit.service}</h4>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${statusBadge.className}`}>
                        {statusBadge.label}
                      </span>
                    </div>
                    <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        <span>
                          {new Date(visit.date).toLocaleDateString('es-ES', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                          })}
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <User className="h-4 w-4" />
                        <span>{visit.staff}</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-1 text-gray-900 font-semibold ml-4">
                  <Euro className="h-4 w-4" />
                  <span>{visit.price.toFixed(2)}</span>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {visits.length > 0 && (
        <div className="mt-4 pt-4 border-t border-gray-200 flex justify-between items-center text-sm">
          <span className="text-gray-600">Total gastado:</span>
          <span className="text-lg font-bold text-gray-900">
            {visits.reduce((sum, visit) => sum + visit.price, 0).toFixed(2)}€
          </span>
        </div>
      )}
    </div>
  )
}
