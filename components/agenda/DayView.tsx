'use client'

import { useEffect, useState } from 'react'
import { Clock } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { useUser } from '@/hooks/useUser'
import type { Appointment, Staff } from '@/types'

interface DayViewProps {
  date: Date
  onEditAppointment: (appointmentId: string) => void
  onCreateAppointment: () => void
}

// Horario de trabajo: 9:00 - 21:00 (12 horas)
const HOURS = Array.from({ length: 13 }, (_, i) => i + 9) // 9-21
const SLOT_HEIGHT = 60 // px por hora

export function DayView({ date, onEditAppointment, onCreateAppointment }: DayViewProps) {
  const { tenant } = useUser()
  const [staff, setStaff] = useState<Staff[]>([])
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (!tenant?.schema_name) return

    loadData()
  }, [date, tenant?.schema_name])

  const loadData = async () => {
    setIsLoading(true)
    const supabase = createClient()

    try {
      // Cargar staff activo
      // TODO: Implementar RPC para leer desde schema del tenant
      // Por ahora usamos datos mock
      setStaff([
        {
          id: '1',
          tenant_id: tenant?.id || '',
          first_name: 'María',
          last_name: 'López',
          role: 'esteticista',
          email: 'maria@salon.com',
          phone: '+34 600 000 001',
          is_active: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
        {
          id: '2',
          tenant_id: tenant?.id || '',
          first_name: 'Laura',
          last_name: 'García',
          role: 'esteticista',
          email: 'laura@salon.com',
          phone: '+34 600 000 002',
          is_active: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
      ])

      // Cargar citas del día
      // TODO: Implementar query real cuando tengamos datos
      const mockAppointments: Appointment[] = [
        {
          id: '1',
          tenant_id: tenant?.id || '',
          client_id: 'client-1',
          staff_id: '1',
          service_id: 'service-1',
          start_time: `${date.toISOString().split('T')[0]}T10:00:00Z`,
          end_time: `${date.toISOString().split('T')[0]}T11:00:00Z`,
          status: 'confirmed',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          // Datos para display
          client_name: 'Carmen López',
          service_name: 'Manicura',
          service_color: '#ec4899',
        },
        {
          id: '2',
          tenant_id: tenant?.id || '',
          client_id: 'client-2',
          staff_id: '1',
          service_id: 'service-2',
          start_time: `${date.toISOString().split('T')[0]}T14:30:00Z`,
          end_time: `${date.toISOString().split('T')[0]}T16:00:00Z`,
          status: 'scheduled',
          notes: 'Primera vez',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          client_name: 'Ana Martínez',
          service_name: 'Tratamiento facial',
          service_color: '#8b5cf6',
        },
        {
          id: '3',
          tenant_id: tenant?.id || '',
          client_id: 'client-3',
          staff_id: '2',
          service_id: 'service-1',
          start_time: `${date.toISOString().split('T')[0]}T11:00:00Z`,
          end_time: `${date.toISOString().split('T')[0]}T12:00:00Z`,
          status: 'confirmed',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          client_name: 'Isabel Ruiz',
          service_name: 'Pedicura',
          service_color: '#f59e0b',
        },
      ]

      setAppointments(mockAppointments)
    } catch (error) {
      console.error('Error loading agenda data:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const getAppointmentPosition = (appointment: Appointment) => {
    const start = new Date(appointment.start_time)
    const end = new Date(appointment.end_time)

    const startHour = start.getHours()
    const startMinutes = start.getMinutes()
    const durationMs = end.getTime() - start.getTime()
    const durationHours = durationMs / (1000 * 60 * 60)

    const top = (startHour - 9) * SLOT_HEIGHT + (startMinutes / 60) * SLOT_HEIGHT
    const height = durationHours * SLOT_HEIGHT

    return { top, height }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'border-green-500 bg-green-50'
      case 'scheduled':
        return 'border-blue-500 bg-blue-50'
      case 'completed':
        return 'border-gray-400 bg-gray-50'
      case 'cancelled':
        return 'border-red-500 bg-red-50'
      case 'no_show':
        return 'border-orange-500 bg-orange-50'
      default:
        return 'border-gray-300 bg-white'
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando agenda...</p>
        </div>
      </div>
    )
  }

  if (staff.length === 0) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center max-w-md">
          <Clock className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            No hay personal configurado
          </h3>
          <p className="text-gray-600 mb-4">
            Añade esteticistas en Configuración → Personal para empezar a usar la agenda.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="h-full overflow-auto bg-white">
      <div className="min-w-[600px]">
        {/* Header with staff names */}
        <div className="sticky top-0 z-10 bg-white border-b border-gray-200">
          <div className="flex">
            {/* Time column header */}
            <div className="w-16 flex-shrink-0 border-r border-gray-200"></div>

            {/* Staff columns headers */}
            {staff.map((member) => (
              <div
                key={member.id}
                className="flex-1 min-w-[200px] px-4 py-3 border-r border-gray-200"
              >
                <div className="font-semibold text-gray-900">
                  {member.first_name} {member.last_name}
                </div>
                <div className="text-xs text-gray-500 capitalize">{member.role}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Timeline grid */}
        <div className="relative">
          <div className="flex">
            {/* Time column */}
            <div className="w-16 flex-shrink-0 border-r border-gray-200">
              {HOURS.map((hour) => (
                <div
                  key={hour}
                  className="h-[60px] px-2 py-1 text-xs text-gray-500 text-right border-b border-gray-100"
                >
                  {hour}:00
                </div>
              ))}
            </div>

            {/* Staff columns */}
            {staff.map((member) => (
              <div
                key={member.id}
                className="flex-1 min-w-[200px] relative border-r border-gray-200"
              >
                {/* Grid lines */}
                {HOURS.map((hour) => (
                  <div
                    key={hour}
                    className="h-[60px] border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors"
                    onClick={() => onCreateAppointment()}
                  />
                ))}

                {/* Appointments */}
                {appointments
                  .filter((apt) => apt.staff_id === member.id)
                  .map((appointment) => {
                    const { top, height } = getAppointmentPosition(appointment)

                    return (
                      <div
                        key={appointment.id}
                        className={`absolute left-1 right-1 rounded-lg border-l-4 p-2 shadow-sm cursor-pointer hover:shadow-md transition-shadow overflow-hidden ${getStatusColor(
                          appointment.status
                        )}`}
                        style={{ top: `${top}px`, height: `${height}px` }}
                        onClick={() => onEditAppointment(appointment.id)}
                      >
                        <div className="text-sm font-semibold text-gray-900 truncate">
                          {appointment.client_name}
                        </div>
                        <div className="text-xs text-gray-600 truncate">
                          {appointment.service_name}
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          {new Date(appointment.start_time).toLocaleTimeString('es-ES', {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}{' '}
                          -{' '}
                          {new Date(appointment.end_time).toLocaleTimeString('es-ES', {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </div>
                      </div>
                    )
                  })}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
