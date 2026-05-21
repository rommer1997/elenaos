'use client'

import { useEffect, useState } from 'react'
import { Clock } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { useUser } from '@/hooks/useUser'
import type { Appointment } from '@/types'

interface WeekViewProps {
  startDate: Date
  onEditAppointment: (appointmentId: string) => void
  onCreateAppointment: () => void
}

const HOURS = Array.from({ length: 13 }, (_, i) => i + 9) // 9-21
const SLOT_HEIGHT = 60

export function WeekView({ startDate, onEditAppointment, onCreateAppointment }: WeekViewProps) {
  const { tenant } = useUser()
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // Calcular inicio y fin de semana
  const getWeekDays = () => {
    const days = []
    const start = new Date(startDate)
    start.setDate(start.getDate() - start.getDay() + 1) // Lunes

    for (let i = 0; i < 7; i++) {
      const day = new Date(start)
      day.setDate(start.getDate() + i)
      days.push(day)
    }
    return days
  }

  const weekDays = getWeekDays()

  useEffect(() => {
    if (!tenant?.schema_name) return
    loadAppointments()
  }, [startDate, tenant?.schema_name])

  const loadAppointments = async () => {
    setIsLoading(true)

    // TODO: Implementar query real
    // Mock data de ejemplo
    const mockAppointments: Appointment[] = [
      {
        id: '1',
        tenant_id: tenant?.id || '',
        client_id: 'client-1',
        staff_id: '1',
        service_id: 'service-1',
        start_time: `${weekDays[0].toISOString().split('T')[0]}T10:00:00Z`,
        end_time: `${weekDays[0].toISOString().split('T')[0]}T11:00:00Z`,
        status: 'confirmed',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
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
        start_time: `${weekDays[2].toISOString().split('T')[0]}T14:00:00Z`,
        end_time: `${weekDays[2].toISOString().split('T')[0]}T15:30:00Z`,
        status: 'scheduled',
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
        start_time: `${weekDays[4].toISOString().split('T')[0]}T11:00:00Z`,
        end_time: `${weekDays[4].toISOString().split('T')[0]}T12:00:00Z`,
        status: 'confirmed',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        client_name: 'Isabel Ruiz',
        service_name: 'Pedicura',
        service_color: '#f59e0b',
      },
    ]

    setAppointments(mockAppointments)
    setIsLoading(false)
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

  const getAppointmentsForDay = (day: Date) => {
    const dayStr = day.toISOString().split('T')[0]
    return appointments.filter((apt) => apt.start_time.startsWith(dayStr))
  }

  const isToday = (day: Date) => {
    const today = new Date()
    return (
      day.getDate() === today.getDate() &&
      day.getMonth() === today.getMonth() &&
      day.getFullYear() === today.getFullYear()
    )
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

  return (
    <div className="h-full overflow-auto bg-white">
      <div className="min-w-[900px]">
        {/* Header with day names */}
        <div className="sticky top-0 z-10 bg-white border-b border-gray-200">
          <div className="flex">
            {/* Time column header */}
            <div className="w-16 flex-shrink-0 border-r border-gray-200"></div>

            {/* Day columns headers */}
            {weekDays.map((day) => (
              <div
                key={day.toISOString()}
                className={`flex-1 min-w-[120px] px-2 py-3 text-center border-r border-gray-200 ${
                  isToday(day) ? 'bg-purple-50' : ''
                }`}
              >
                <div className="text-xs text-gray-500 uppercase">
                  {day.toLocaleDateString('es-ES', { weekday: 'short' })}
                </div>
                <div
                  className={`text-lg font-semibold ${
                    isToday(day) ? 'text-purple-600' : 'text-gray-900'
                  }`}
                >
                  {day.getDate()}
                </div>
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

            {/* Day columns */}
            {weekDays.map((day) => {
              const dayAppointments = getAppointmentsForDay(day)

              return (
                <div
                  key={day.toISOString()}
                  className={`flex-1 min-w-[120px] relative border-r border-gray-200 ${
                    isToday(day) ? 'bg-purple-50/30' : ''
                  }`}
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
                  {dayAppointments.map((appointment) => {
                    const { top, height } = getAppointmentPosition(appointment)

                    return (
                      <div
                        key={appointment.id}
                        className={`absolute left-1 right-1 rounded border-l-4 p-1 shadow-sm cursor-pointer hover:shadow-md transition-shadow overflow-hidden text-xs ${getStatusColor(
                          appointment.status
                        )}`}
                        style={{ top: `${top}px`, height: `${height}px` }}
                        onClick={() => onEditAppointment(appointment.id)}
                      >
                        <div className="font-semibold text-gray-900 truncate">
                          {appointment.client_name}
                        </div>
                        <div className="text-gray-600 truncate">{appointment.service_name}</div>
                        <div className="text-gray-500 text-[10px] mt-0.5">
                          {new Date(appointment.start_time).toLocaleTimeString('es-ES', {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </div>
                      </div>
                    )
                  })}
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
