'use client'

import { Clock, User, Scissors } from 'lucide-react'

export function TodayTimeline() {
  // Mock appointments for today
  const appointments = [
    {
      id: '1',
      time: '09:00',
      duration: 60,
      client: 'María López',
      service: 'Corte + Color',
      status: 'completed',
      staff: 'Elena',
      color: '#9333ea'
    },
    {
      id: '2',
      time: '10:30',
      duration: 45,
      client: 'Ana García',
      service: 'Manicura Semipermanente',
      status: 'completed',
      staff: 'Carmen',
      color: '#ec4899'
    },
    {
      id: '3',
      time: '11:30',
      duration: 30,
      client: 'Carmen Rodríguez',
      service: 'Corte de Pelo',
      status: 'in_progress',
      staff: 'Elena',
      color: '#9333ea'
    },
    {
      id: '4',
      time: '12:30',
      duration: 90,
      client: 'Laura Pérez',
      service: 'Mechas Californianas',
      status: 'confirmed',
      staff: 'María',
      color: '#8b5cf6'
    },
    {
      id: '5',
      time: '14:00',
      duration: 60,
      client: 'Patricia Sánchez',
      service: 'Facial Hidratante',
      status: 'confirmed',
      staff: 'Ana',
      color: '#06b6d4'
    },
    {
      id: '6',
      time: '15:30',
      duration: 120,
      client: 'Isabel Martín',
      service: 'Tinte Completo',
      status: 'confirmed',
      staff: 'Elena',
      color: '#9333ea'
    },
    {
      id: '7',
      time: '17:00',
      duration: 45,
      client: 'Sofía Ruiz',
      service: 'Pedicura Completa',
      status: 'pending',
      staff: 'Carmen',
      color: '#ec4899'
    },
    {
      id: '8',
      time: '18:00',
      duration: 60,
      client: 'Elena Fernández',
      service: 'Peinado de Fiesta',
      status: 'pending',
      staff: 'María',
      color: '#8b5cf6'
    }
  ]

  const currentTime = '11:45' // Mock current time

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
