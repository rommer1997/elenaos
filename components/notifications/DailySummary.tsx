'use client'

import { TrendingUp, Calendar, MessageSquare, Users, Euro } from 'lucide-react'

interface DailySummaryProps {
  date: Date
  data: {
    appointmentsCompleted: number
    totalRevenue: number
    messagesSent: number
    clientsReactivated: number
  }
}

export function DailySummary({ date, data }: DailySummaryProps) {
  const dateStr = date.toLocaleDateString('es-ES', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })

  return (
    <div className="bg-white rounded-2xl shadow-xl border-2 border-purple-100 overflow-hidden max-w-md">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-6 text-white">
        <h3 className="text-2xl font-bold mb-1">📊 Resumen del día</h3>
        <p className="text-purple-100 text-sm capitalize">{dateStr}</p>
      </div>

      {/* Stats Grid */}
      <div className="p-6 space-y-4">
        {/* Appointments */}
        <div className="flex items-center gap-4 p-4 bg-blue-50 rounded-xl border border-blue-200">
          <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center">
            <Calendar className="h-6 w-6 text-white" />
          </div>
          <div className="flex-1">
            <div className="text-sm text-blue-700 font-medium">Citas completadas</div>
            <div className="text-2xl font-bold text-blue-900">
              {data.appointmentsCompleted}
            </div>
          </div>
        </div>

        {/* Revenue */}
        <div className="flex items-center gap-4 p-4 bg-green-50 rounded-xl border border-green-200">
          <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center">
            <Euro className="h-6 w-6 text-white" />
          </div>
          <div className="flex-1">
            <div className="text-sm text-green-700 font-medium">Facturación del día</div>
            <div className="text-2xl font-bold text-green-900">
              €{data.totalRevenue.toLocaleString()}
            </div>
          </div>
        </div>

        {/* Messages */}
        <div className="flex items-center gap-4 p-4 bg-purple-50 rounded-xl border border-purple-200">
          <div className="w-12 h-12 bg-purple-500 rounded-xl flex items-center justify-center">
            <MessageSquare className="h-6 w-6 text-white" />
          </div>
          <div className="flex-1">
            <div className="text-sm text-purple-700 font-medium">Mensajes enviados</div>
            <div className="text-2xl font-bold text-purple-900">
              {data.messagesSent}
            </div>
          </div>
        </div>

        {/* Reactivations */}
        <div className="flex items-center gap-4 p-4 bg-orange-50 rounded-xl border border-orange-200">
          <div className="w-12 h-12 bg-orange-500 rounded-xl flex items-center justify-center">
            <Users className="h-6 w-6 text-white" />
          </div>
          <div className="flex-1">
            <div className="text-sm text-orange-700 font-medium">Clientas reactivadas</div>
            <div className="text-2xl font-bold text-orange-900">
              {data.clientsReactivated}
            </div>
          </div>
        </div>

        {/* Performance summary */}
        <div className="pt-4 border-t border-gray-200">
          <div className="flex items-center gap-2 text-green-600 mb-2">
            <TrendingUp className="h-5 w-5" />
            <span className="font-semibold">Excelente día</span>
          </div>
          <p className="text-sm text-gray-600">
            Completaste el 95% de tus citas programadas y superaste tu objetivo de facturación en un 12%.
          </p>
        </div>

        {/* CTA */}
        <button className="w-full py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-bold hover:shadow-lg transition-all">
          Ver detalles completos
        </button>
      </div>
    </div>
  )
}
