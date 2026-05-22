'use client'

import { useEffect, useState } from 'react'
import { Clock, User, Scissors } from 'lucide-react'
import { useUser } from '@/hooks/useUser'
import { createClient } from '@/lib/supabase/client'
import type { Appointment } from '@/types'

export function TodayTimeline() {
  const { tenant } = useUser()
  const [appointments, setAppointments] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [currentTime, setCurrentTime] = useState('12:00')

  useEffect(() => {
    setCurrentTime(new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }))
    const timer = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }))
    }, 60000)
    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    if (!tenant?.schema_name) return
    loadAppointments()
  }, [tenant?.schema_name])

  const loadAppointments = async () => {
    if (!tenant?.schema_name) return
    setIsLoading(true)
    const supabase = createClient()
    try {
      const todayStr = new Date().toISOString().split('T')[0]
      const { data, error } = await supabase
        .schema(tenant.schema_name)
        .from('appointments')
        .select(`
          *,
          client:clients(first_name, last_name),
          staff:staff(first_name, last_name, calendar_color),
          service:services(name, color)
        `)
        .gte('start_time', `${todayStr}T00:00:00`)
        .lte('start_time', `${todayStr}T23:59:59`)
        .order('start_time', { ascending: true })

      if (error) throw error

      const mapped = (data || []).map((appt) => {
        const startTime = new Date(appt.start_time)
        const endTime = new Date(appt.end_time)
        const duration = Math.round((endTime.getTime() - startTime.getTime()) / 60000)
        const timeStr = startTime.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })

        // Map status
        let mappedStatus = 'pending'
        if (appt.status === 'confirmed') mappedStatus = 'confirmed'
        if (appt.status === 'completed') mappedStatus = 'completed'
        if (appt.status === 'scheduled') mappedStatus = 'pending'
        if (appt.status === 'cancelled') mappedStatus = 'cancelled'

        return {
          id: appt.id,
          time: timeStr,
          duration,
          client: appt.client ? `${appt.client.first_name} ${appt.client.last_name || ''}`.trim() : 'Cliente sin nombre',
          service: appt.service ? appt.service.name : 'Servicio',
          status: mappedStatus,
          staff: appt.staff ? appt.staff.first_name : 'Personal',
          color: appt.service?.color || '#9333ea'
        }
      })

      setAppointments(mapped)
    } catch (e) {
      console.error('Error loading today\'s timeline appointments:', e)
    } finally {
      setIsLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-700 border-green-300'
      case 'in_progress':
        return 'bg-blue-100 text-blue-700 border-blue-300'
      case 'confirmed':
        return 'bg-purple-100 text-purple-700 border-purple-300'
      case 'pending':
        return 'bg-orange-100 text-orange-700 border-orange-300'
      default:
        return 'bg-gray-100 text-gray-700 border-gray-300'
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'completed':
        return '✓ Completada'
      case 'in_progress':
        return '⏱️ En progreso'
      case 'confirmed':
        return '✓ Confirmada'
      case 'pending':
        return '⏳ Pendiente'
      default:
        return status
    }
  }

  if (isLoading) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex justify-center items-center h-[350px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto"></div>
          <p className="mt-4 text-sm text-gray-500">Cargando agenda de hoy...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Agenda de hoy</h2>
          <p className="text-sm text-gray-600 mt-1">
            {appointments.length} citas programadas
          </p>
        </div>
        <div className="flex items-center gap-2 px-3 py-2 bg-blue-50 rounded-lg border border-blue-200">
          <Clock className="h-4 w-4 text-blue-600" />
          <span className="text-sm font-medium text-blue-900">{currentTime}</span>
        </div>
      </div>

      {/* Timeline */}
      {appointments.length === 0 ? (
        <div className="text-center py-12 border border-dashed border-gray-200 rounded-lg bg-gray-50/50">
          <Clock className="h-12 w-12 text-gray-300 mx-auto mb-2" />
          <p className="text-sm font-medium text-gray-600">No hay citas para hoy</p>
          <p className="text-xs text-gray-500 mt-1">¡Tómate un respiro o crea una cita en la agenda!</p>
        </div>
      ) : (
        <div className="space-y-3">
          {appointments.map((appointment) => {
          const isCurrentOrPast = appointment.time <= currentTime
          const isCurrent = appointment.status === 'in_progress'

          return (
            <div
              key={appointment.id}
              className={`relative pl-8 pb-4 border-l-2 transition-all ${
                isCurrent
                  ? 'border-blue-500'
                  : isCurrentOrPast
                  ? 'border-gray-300'
                  : 'border-gray-200'
              }`}
            >
              {/* Time marker */}
              <div
                className={`absolute left-0 top-0 -translate-x-1/2 w-4 h-4 rounded-full border-2 ${
                  isCurrent
                    ? 'bg-blue-500 border-blue-600 animate-pulse'
                    : isCurrentOrPast
                    ? 'bg-gray-400 border-gray-500'
                    : 'bg-white border-gray-300'
                }`}
              />

              {/* Appointment card */}
              <div
                className={`rounded-lg border-2 p-4 transition-all hover:shadow-md ${
                  isCurrent
                    ? 'border-blue-300 bg-blue-50'
                    : isCurrentOrPast
                    ? 'border-gray-200 bg-gray-50 opacity-75'
                    : 'border-gray-200 bg-white'
                }`}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-bold text-gray-900">
                      {appointment.time}
                    </span>
                    <span
                      className={`px-2 py-1 rounded-lg text-xs font-medium border ${getStatusColor(appointment.status)}`}
                    >
                      {getStatusLabel(appointment.status)}
                    </span>
                  </div>
                  <span className="text-xs text-gray-500">
                    {appointment.duration} min
                  </span>
                </div>

                <div className="flex items-center gap-2 mb-2">
                  <User className="h-4 w-4 text-gray-400" />
                  <span className="font-semibold text-gray-900">
                    {appointment.client}
                  </span>
                </div>

                <div className="flex items-center gap-2 mb-2">
                  <Scissors className="h-4 w-4 text-gray-400" />
                  <span className="text-sm text-gray-700">
                    {appointment.service}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: appointment.color }}
                  />
                  <span className="text-xs text-gray-600">
                    con {appointment.staff}
                  </span>
                </div>
              </div>
            </div>
          )
        })}
      </div>
      )}

      {/* Summary */}
      <div className="mt-6 pt-6 border-t border-gray-200">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold text-green-600">
              {appointments.filter(a => a.status === 'completed').length}
            </div>
            <div className="text-xs text-gray-600">Completadas</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-blue-600">
              {appointments.filter(a => a.status === 'confirmed').length}
            </div>
            <div className="text-xs text-gray-600">Confirmadas</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-orange-600">
              {appointments.filter(a => a.status === 'pending').length}
            </div>
            <div className="text-xs text-gray-600">Pendientes</div>
          </div>
        </div>
      </div>
    </div>
  )
}
