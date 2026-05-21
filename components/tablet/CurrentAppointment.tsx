'use client'

import { useState } from 'react'
import { Clock, User, Scissors, Euro, Phone, AlertCircle } from 'lucide-react'

interface Appointment {
  id: string
  clientName: string
  clientPhone: string
  service: string
  startTime: string
  endTime: string
  duration: number
  price: number
  notes: string
  progress: number
}

interface CurrentAppointmentProps {
  appointment: Appointment
}

export function CurrentAppointment({ appointment }: CurrentAppointmentProps) {
  const [progress, setProgress] = useState(appointment.progress)

  return (
    <div className="bg-white rounded-2xl shadow-lg border-2 border-purple-200 p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-sm font-medium text-green-600">En progreso</span>
          </div>
          <h2 className="text-3xl font-bold text-gray-900">{appointment.clientName}</h2>
        </div>

        <div className="text-right">
          <div className="text-sm text-gray-600 mb-1">Tiempo</div>
          <div className="text-2xl font-bold text-gray-900">
            {appointment.startTime} - {appointment.endTime}
          </div>
          <div className="text-sm text-gray-600">{appointment.duration} minutos</div>
        </div>
      </div>

      {/* Service info */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="flex items-center gap-3 p-4 bg-purple-50 rounded-xl">
          <Scissors className="h-8 w-8 text-purple-600" />
          <div>
            <div className="text-xs text-gray-600">Servicio</div>
            <div className="font-bold text-gray-900">{appointment.service}</div>
          </div>
        </div>

        <div className="flex items-center gap-3 p-4 bg-green-50 rounded-xl">
          <Euro className="h-8 w-8 text-green-600" />
          <div>
            <div className="text-xs text-gray-600">Precio</div>
            <div className="font-bold text-gray-900">€{appointment.price}</div>
          </div>
        </div>

        <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-xl">
          <Phone className="h-8 w-8 text-blue-600" />
          <div>
            <div className="text-xs text-gray-600">Teléfono</div>
            <div className="font-bold text-gray-900">{appointment.clientPhone}</div>
          </div>
        </div>
      </div>

      {/* Progress bar */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-700">Progreso del servicio</span>
          <span className="text-sm font-bold text-purple-600">{progress}%</span>
        </div>
        <div className="relative">
          <input
            type="range"
            min="0"
            max="100"
            value={progress}
            onChange={(e) => setProgress(parseInt(e.target.value))}
            className="w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-purple-600"
          />
        </div>
        <div className="flex justify-between mt-2 text-xs text-gray-500">
          <span>Inicio</span>
          <span>En proceso</span>
          <span>Completado</span>
        </div>
      </div>

      {/* Notes alert */}
      {appointment.notes && (
        <div className="flex items-start gap-3 p-4 bg-orange-50 border border-orange-200 rounded-xl">
          <AlertCircle className="h-5 w-5 text-orange-600 flex-shrink-0 mt-0.5" />
          <div>
            <div className="font-semibold text-orange-900 mb-1">Notas importantes</div>
            <p className="text-sm text-orange-800">{appointment.notes}</p>
          </div>
        </div>
      )}
    </div>
  )
}
