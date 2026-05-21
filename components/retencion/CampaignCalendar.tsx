'use client'

import { useState } from 'react'
import {
  ChevronLeft,
  ChevronRight,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Calendar as CalendarIcon
} from 'lucide-react'

interface Campaign {
  id: string
  clientName: string
  scheduledTime: string
  status: 'pending' | 'sent' | 'failed'
  riskLevel: 'at_risk' | 'high_risk' | 'lost'
}

export function CampaignCalendar() {
  const [currentDate, setCurrentDate] = useState(new Date())

  // Generate week days starting from Monday
  const getWeekDays = (date: Date) => {
    const current = new Date(date)
    const day = current.getDay()
    const diff = current.getDate() - day + (day === 0 ? -6 : 1) // Adjust when day is Sunday
    const monday = new Date(current.setDate(diff))

    const days = []
    for (let i = 0; i < 7; i++) {
      const weekDay = new Date(monday)
      weekDay.setDate(monday.getDate() + i)
      days.push(weekDay)
    }
    return days
  }

  const weekDays = getWeekDays(currentDate)

  const goToPreviousWeek = () => {
    const newDate = new Date(currentDate)
    newDate.setDate(newDate.getDate() - 7)
    setCurrentDate(newDate)
  }

  const goToNextWeek = () => {
    const newDate = new Date(currentDate)
    newDate.setDate(newDate.getDate() + 7)
    setCurrentDate(newDate)
  }

  const goToToday = () => {
    setCurrentDate(new Date())
  }

  // Mock campaigns
  const mockCampaigns: Campaign[] = [
    {
      id: '1',
      clientName: 'Ana Martínez',
      scheduledTime: new Date(2026, 4, 20, 11, 0).toISOString(),
      status: 'pending',
      riskLevel: 'high_risk'
    },
    {
      id: '2',
      clientName: 'Carmen López',
      scheduledTime: new Date(2026, 4, 20, 17, 0).toISOString(),
      status: 'sent',
      riskLevel: 'at_risk'
    },
    {
      id: '3',
      clientName: 'María Rodríguez',
      scheduledTime: new Date(2026, 4, 21, 11, 0).toISOString(),
      status: 'pending',
      riskLevel: 'high_risk'
    },
    {
      id: '4',
      clientName: 'Laura García',
      scheduledTime: new Date(2026, 4, 22, 11, 0).toISOString(),
      status: 'pending',
      riskLevel: 'at_risk'
    },
    {
      id: '5',
      clientName: 'Isabel Fernández',
      scheduledTime: new Date(2026, 4, 19, 11, 0).toISOString(),
      status: 'failed',
      riskLevel: 'lost'
    }
  ]

  const getCampaignsForDay = (date: Date) => {
    return mockCampaigns.filter(campaign => {
      const campaignDate = new Date(campaign.scheduledTime)
      return (
        campaignDate.getFullYear() === date.getFullYear() &&
        campaignDate.getMonth() === date.getMonth() &&
        campaignDate.getDate() === date.getDate()
      )
    })
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return { icon: Clock, color: 'text-blue-600', bg: 'bg-blue-100' }
      case 'sent':
        return { icon: CheckCircle, color: 'text-green-600', bg: 'bg-green-100' }
      case 'failed':
        return { icon: XCircle, color: 'text-red-600', bg: 'bg-red-100' }
      default:
        return { icon: AlertCircle, color: 'text-gray-600', bg: 'bg-gray-100' }
    }
  }

  const getRiskColor = (riskLevel: string) => {
    switch (riskLevel) {
      case 'high_risk':
        return 'border-l-red-500'
      case 'at_risk':
        return 'border-l-orange-500'
      case 'lost':
        return 'border-l-gray-500'
      default:
        return 'border-l-gray-300'
    }
  }

  const isToday = (date: Date) => {
    const today = new Date()
    return (
      date.getFullYear() === today.getFullYear() &&
      date.getMonth() === today.getMonth() &&
      date.getDate() === today.getDate()
    )
  }

  const isPast = (date: Date) => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    return date < today
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Calendario de Campañas</h2>
          <p className="text-gray-600 mt-1">
            Campañas programadas y enviadas
          </p>
        </div>

        {/* Navigation */}
        <div className="flex items-center gap-3">
          <button
            onClick={goToToday}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Hoy
          </button>
          <div className="flex items-center gap-2">
            <button
              onClick={goToPreviousWeek}
              className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <div className="text-sm font-medium text-gray-900 min-w-[180px] text-center">
              {weekDays[0].toLocaleDateString('es-ES', { month: 'long', year: 'numeric' })}
            </div>
            <button
              onClick={goToNextWeek}
              className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="bg-white rounded-lg shadow-sm p-4">
        <div className="flex items-center gap-6 text-sm">
          <span className="font-medium text-gray-700">Leyenda:</span>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-blue-100 border-2 border-blue-600"></div>
            <span className="text-gray-600">Pendiente</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-green-100 border-2 border-green-600"></div>
            <span className="text-gray-600">Enviada</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-red-100 border-2 border-red-600"></div>
            <span className="text-gray-600">Fallida</span>
          </div>
        </div>
      </div>

      {/* Calendar grid */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        {/* Day headers */}
        <div className="grid grid-cols-7 border-b border-gray-200">
          {weekDays.map((day, index) => {
            const today = isToday(day)
            const past = isPast(day)

            return (
              <div
                key={index}
                className={`p-4 text-center border-r border-gray-200 last:border-r-0 ${
                  today ? 'bg-purple-50' : past ? 'bg-gray-50' : 'bg-white'
                }`}
              >
                <div className={`text-xs font-medium uppercase ${today ? 'text-purple-600' : 'text-gray-600'}`}>
                  {day.toLocaleDateString('es-ES', { weekday: 'short' })}
                </div>
                <div className={`text-2xl font-bold mt-1 ${today ? 'text-purple-600' : past ? 'text-gray-400' : 'text-gray-900'}`}>
                  {day.getDate()}
                </div>
              </div>
            )
          })}
        </div>

        {/* Campaign slots */}
        <div className="grid grid-cols-7 min-h-[400px]">
          {weekDays.map((day, dayIndex) => {
            const campaigns = getCampaignsForDay(day)
            const today = isToday(day)
            const past = isPast(day)

            return (
              <div
                key={dayIndex}
                className={`p-3 border-r border-gray-200 last:border-r-0 ${
                  today ? 'bg-purple-50/30' : past ? 'bg-gray-50/50' : 'bg-white'
                }`}
              >
                <div className="space-y-2">
                  {campaigns.length === 0 ? (
                    <div className="text-xs text-gray-400 text-center py-4">
                      Sin campañas
                    </div>
                  ) : (
                    campaigns.map((campaign) => {
                      const status = getStatusIcon(campaign.status)
                      const StatusIcon = status.icon
                      const time = new Date(campaign.scheduledTime).toLocaleTimeString('es-ES', {
                        hour: '2-digit',
                        minute: '2-digit'
                      })

                      return (
                        <div
                          key={campaign.id}
                          className={`p-2 rounded-lg border-l-4 ${getRiskColor(campaign.riskLevel)} bg-white shadow-sm hover:shadow-md transition-shadow cursor-pointer`}
                        >
                          <div className="flex items-start gap-2">
                            <div className={`p-1 rounded ${status.bg} flex-shrink-0`}>
                              <StatusIcon className={`h-3 w-3 ${status.color}`} />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="text-xs font-medium text-gray-900 truncate">
                                {campaign.clientName}
                              </div>
                              <div className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                                <Clock className="h-3 w-3" />
                                {time}
                              </div>
                            </div>
                          </div>
                        </div>
                      )
                    })
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Summary stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg shadow-sm p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Clock className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <div className="text-sm text-gray-600">Pendientes esta semana</div>
              <div className="text-2xl font-bold text-gray-900">
                {mockCampaigns.filter(c => c.status === 'pending').length}
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <CheckCircle className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <div className="text-sm text-gray-600">Enviadas esta semana</div>
              <div className="text-2xl font-bold text-gray-900">
                {mockCampaigns.filter(c => c.status === 'sent').length}
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-red-100 rounded-lg">
              <XCircle className="h-5 w-5 text-red-600" />
            </div>
            <div>
              <div className="text-sm text-gray-600">Fallidas esta semana</div>
              <div className="text-2xl font-bold text-gray-900">
                {mockCampaigns.filter(c => c.status === 'failed').length}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
