'use client'

import { Clock, CheckCircle, AlertCircle } from 'lucide-react'

interface QueuedAppointment {
  id: string
  clientName: string
  service: string
  startTime: string
  status: 'confirmed' | 'pending'
}

interface UpcomingQueueProps {
  appointments: QueuedAppointment[]
}

export function UpcomingQueue({ appointments }: UpcomingQueueProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h3 className="text-xl font-bold text-gray-900 mb-4">
        Siguientes Citas
      </h3>

      <div className="space-y-3">
        {appointments.map((appointment, index) => (
          <div
            key={appointment.id}
            className={`p-4 rounded-lg border-2 transition-all ${
              index === 0
                ? 'border-purple-300 bg-purple-50'
                : 'border-gray-200 bg-white'
            }`}
          >
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center gap-2">
                {index === 0 && (
                  <span className="px-2 py-0.5 bg-purple-600 text-white text-xs font-bold rounded">
                    SIGUIENTE
                  </span>
                )}
                <span className="font-bold text-gray-900">
                  {appointment.clientName}
                </span>
              </div>

              {appointment.status === 'confirmed' ? (
                <CheckCircle className="h-5 w-5 text-green-500" />
              ) : (
                <AlertCircle className="h-5 w-5 text-orange-500" />
              )}
            </div>

            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-1 text-gray-700">
                <Clock className="h-4 w-4" />
                <span className="font-medium">{appointment.startTime}</span>
              </div>
              <div className="text-gray-600">
                {appointment.service}
              </div>
            </div>

            {appointment.status === 'pending' && (
              <div className="mt-2 text-xs text-orange-600 font-medium">
                ⏳ Pendiente de confirmación
              </div>
            )}
          </div>
        ))}
      </div>

      {appointments.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <Clock className="h-12 w-12 mx-auto mb-2 opacity-50" />
          <p>No hay más citas programadas</p>
        </div>
      )}
    </div>
  )
}
