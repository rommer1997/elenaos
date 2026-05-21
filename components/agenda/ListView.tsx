'use client'

import { useEffect, useState } from 'react'
import { Calendar, Clock, User, Tag, CheckCircle, XCircle, Circle } from 'lucide-react'
import { useUser } from '@/hooks/useUser'
import type { Appointment } from '@/types'

interface ListViewProps {
  onEditAppointment: (appointmentId: string) => void
}

export function ListView({ onEditAppointment }: ListViewProps) {
  const { tenant } = useUser()
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | 'scheduled' | 'confirmed' | 'completed'>('all')

  useEffect(() => {
    if (!tenant?.schema_name) return
    loadAppointments()
  }, [tenant?.schema_name])

  const loadAppointments = async () => {
    setIsLoading(true)

    // TODO: Implementar query real con filtros
    // Mock data de ejemplo
    const mockAppointments: Appointment[] = [
      {
        id: '1',
        tenant_id: tenant?.id || '',
        client_id: 'client-1',
        staff_id: '1',
        service_id: 'service-1',
        start_time: new Date(Date.now() + 86400000).toISOString(), // Mañana
        end_time: new Date(Date.now() + 86400000 + 3600000).toISOString(),
        status: 'confirmed',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        client_name: 'Carmen López',
        service_name: 'Manicura',
        staff_name: 'María López',
      },
      {
        id: '2',
        tenant_id: tenant?.id || '',
        client_id: 'client-2',
        staff_id: '1',
        service_id: 'service-2',
        start_time: new Date(Date.now() + 172800000).toISOString(), // Pasado mañana
        end_time: new Date(Date.now() + 172800000 + 5400000).toISOString(),
        status: 'scheduled',
        notes: 'Primera vez',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        client_name: 'Ana Martínez',
        service_name: 'Tratamiento facial',
        staff_name: 'María López',
      },
      {
        id: '3',
        tenant_id: tenant?.id || '',
        client_id: 'client-3',
        staff_id: '2',
        service_id: 'service-1',
        start_time: new Date(Date.now() - 86400000).toISOString(), // Ayer
        end_time: new Date(Date.now() - 86400000 + 3600000).toISOString(),
        status: 'completed',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        client_name: 'Isabel Ruiz',
        service_name: 'Pedicura',
        staff_name: 'Laura García',
      },
      {
        id: '4',
        tenant_id: tenant?.id || '',
        client_id: 'client-4',
        staff_id: '1',
        service_id: 'service-3',
        start_time: new Date(Date.now() + 259200000).toISOString(), // En 3 días
        end_time: new Date(Date.now() + 259200000 + 7200000).toISOString(),
        status: 'scheduled',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        client_name: 'Lucía Fernández',
        service_name: 'Depilación completa',
        staff_name: 'María López',
      },
    ]

    setAppointments(mockAppointments)
    setIsLoading(false)
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'confirmed':
        return {
          icon: CheckCircle,
          label: 'Confirmada',
          className: 'bg-green-100 text-green-800',
        }
      case 'scheduled':
        return {
          icon: Circle,
          label: 'Programada',
          className: 'bg-blue-100 text-blue-800',
        }
      case 'completed':
        return {
          icon: CheckCircle,
          label: 'Completada',
          className: 'bg-gray-100 text-gray-800',
        }
      case 'cancelled':
        return {
          icon: XCircle,
          label: 'Cancelada',
          className: 'bg-red-100 text-red-800',
        }
      case 'no_show':
        return {
          icon: XCircle,
          label: 'No asistió',
          className: 'bg-orange-100 text-orange-800',
        }
      default:
        return {
          icon: Circle,
          label: status,
          className: 'bg-gray-100 text-gray-800',
        }
    }
  }

  const filteredAppointments = appointments
    .filter((apt) => filter === 'all' || apt.status === filter)
    .sort((a, b) => new Date(a.start_time).getTime() - new Date(b.start_time).getTime())

  // Agrupar por día
  const groupedAppointments = filteredAppointments.reduce((groups, apt) => {
    const date = new Date(apt.start_time).toLocaleDateString('es-ES', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    })
    if (!groups[date]) {
      groups[date] = []
    }
    groups[date].push(apt)
    return groups
  }, {} as Record<string, Appointment[]>)

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando citas...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="h-full overflow-auto bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-4">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filter === 'all'
                  ? 'bg-purple-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Todas
            </button>
            <button
              onClick={() => setFilter('scheduled')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filter === 'scheduled'
                  ? 'bg-purple-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Programadas
            </button>
            <button
              onClick={() => setFilter('confirmed')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filter === 'confirmed'
                  ? 'bg-purple-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Confirmadas
            </button>
            <button
              onClick={() => setFilter('completed')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filter === 'completed'
                  ? 'bg-purple-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Completadas
            </button>
          </div>
        </div>

        {/* Appointments list */}
        {Object.keys(groupedAppointments).length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <Calendar className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No hay citas</h3>
            <p className="text-gray-600">
              {filter === 'all'
                ? 'No tienes ninguna cita programada'
                : `No hay citas con estado "${filter}"`}
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {Object.entries(groupedAppointments).map(([date, dayAppointments]) => (
              <div key={date}>
                <h3 className="text-sm font-semibold text-gray-900 uppercase mb-3 capitalize">
                  {date}
                </h3>
                <div className="space-y-2">
                  {dayAppointments.map((appointment) => {
                    const statusBadge = getStatusBadge(appointment.status)
                    const StatusIcon = statusBadge.icon

                    return (
                      <div
                        key={appointment.id}
                        onClick={() => onEditAppointment(appointment.id)}
                        className="bg-white rounded-lg shadow-sm p-4 hover:shadow-md transition-shadow cursor-pointer border border-gray-200"
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <h4 className="text-lg font-semibold text-gray-900">
                              {appointment.client_name}
                            </h4>
                            <p className="text-sm text-gray-600">{appointment.service_name}</p>
                          </div>
                          <span
                            className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${statusBadge.className}`}
                          >
                            <StatusIcon className="h-3 w-3" />
                            {statusBadge.label}
                          </span>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm">
                          <div className="flex items-center gap-2 text-gray-600">
                            <Clock className="h-4 w-4" />
                            <span>
                              {new Date(appointment.start_time).toLocaleTimeString('es-ES', {
                                hour: '2-digit',
                                minute: '2-digit',
                              })}{' '}
                              -{' '}
                              {new Date(appointment.end_time).toLocaleTimeString('es-ES', {
                                hour: '2-digit',
                                minute: '2-digit',
                              })}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 text-gray-600">
                            <User className="h-4 w-4" />
                            <span>{appointment.staff_name}</span>
                          </div>
                          {appointment.notes && (
                            <div className="flex items-center gap-2 text-gray-600">
                              <Tag className="h-4 w-4" />
                              <span className="truncate">{appointment.notes}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
