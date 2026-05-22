'use client'

import { useState } from 'react'
import { Calendar, List, Plus } from 'lucide-react'
import { DayView } from '@/components/agenda/DayView'
import { WeekView } from '@/components/agenda/WeekView'
import { ListView } from '@/components/agenda/ListView'
import { AppointmentModal } from '@/components/agenda/AppointmentModal'

type ViewType = 'day' | 'week' | 'list'

export default function AgendaPage() {
  const [currentView, setCurrentView] = useState<ViewType>('day')
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedAppointment, setSelectedAppointment] = useState<string | null>(null)
  const [refreshTrigger, setRefreshTrigger] = useState(0)

  const triggerRefresh = () => setRefreshTrigger((prev) => prev + 1)

  const goToToday = () => {
    setSelectedDate(new Date())
  }

  const goToPrevious = () => {
    const newDate = new Date(selectedDate)
    if (currentView === 'day') {
      newDate.setDate(newDate.getDate() - 1)
    } else if (currentView === 'week') {
      newDate.setDate(newDate.getDate() - 7)
    }
    setSelectedDate(newDate)
  }

  const goToNext = () => {
    const newDate = new Date(selectedDate)
    if (currentView === 'day') {
      newDate.setDate(newDate.getDate() + 1)
    } else if (currentView === 'week') {
      newDate.setDate(newDate.getDate() + 7)
    }
    setSelectedDate(newDate)
  }

  const formatDateHeader = () => {
    if (currentView === 'day') {
      return selectedDate.toLocaleDateString('es-ES', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      })
    } else if (currentView === 'week') {
      const startOfWeek = new Date(selectedDate)
      startOfWeek.setDate(selectedDate.getDate() - selectedDate.getDay() + 1)
      const endOfWeek = new Date(startOfWeek)
      endOfWeek.setDate(startOfWeek.getDate() + 6)

      return `${startOfWeek.toLocaleDateString('es-ES', {
        day: 'numeric',
        month: 'short',
      })} - ${endOfWeek.toLocaleDateString('es-ES', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      })}`
    }
    return 'Lista de citas'
  }

  const handleCreateAppointment = () => {
    setSelectedAppointment(null)
    setIsModalOpen(true)
  }

  const handleEditAppointment = (appointmentId: string) => {
    setSelectedAppointment(appointmentId)
    setIsModalOpen(true)
  }

  return (
    <div className="h-[calc(100vh-4rem)] flex flex-col bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-4">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold text-gray-900">Agenda</h1>
          <button
            onClick={handleCreateAppointment}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-medium hover:opacity-90 transition-opacity"
          >
            <Plus className="h-5 w-5" />
            <span className="hidden sm:inline">Nueva cita</span>
          </button>
        </div>

        {/* Controls */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          {/* Date navigation */}
          <div className="flex items-center gap-2">
            <button
              onClick={goToPrevious}
              className="px-3 py-1.5 text-sm text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              ← Anterior
            </button>
            <button
              onClick={goToToday}
              className="px-3 py-1.5 text-sm text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Hoy
            </button>
            <button
              onClick={goToNext}
              className="px-3 py-1.5 text-sm text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Siguiente →
            </button>
          </div>

          {/* Current date display */}
          <div className="text-sm font-medium text-gray-900 capitalize">
            {formatDateHeader()}
          </div>

          {/* View switcher */}
          <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setCurrentView('day')}
              className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                currentView === 'day'
                  ? 'bg-white text-purple-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Calendar className="h-4 w-4 sm:hidden" />
              <span className="hidden sm:inline">Día</span>
            </button>
            <button
              onClick={() => setCurrentView('week')}
              className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                currentView === 'week'
                  ? 'bg-white text-purple-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Calendar className="h-4 w-4 sm:hidden" />
              <span className="hidden sm:inline">Semana</span>
            </button>
            <button
              onClick={() => setCurrentView('list')}
              className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                currentView === 'list'
                  ? 'bg-white text-purple-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <List className="h-4 w-4 sm:hidden" />
              <span className="hidden sm:inline">Lista</span>
            </button>
          </div>
        </div>
      </div>

      {/* Calendar content */}
      <div className="flex-1 overflow-hidden">
        {currentView === 'day' && (
          <DayView
            date={selectedDate}
            onEditAppointment={handleEditAppointment}
            onCreateAppointment={handleCreateAppointment}
            refreshTrigger={refreshTrigger}
          />
        )}
        {currentView === 'week' && (
          <WeekView
            startDate={selectedDate}
            onEditAppointment={handleEditAppointment}
            onCreateAppointment={handleCreateAppointment}
            refreshTrigger={refreshTrigger}
          />
        )}
        {currentView === 'list' && (
          <ListView onEditAppointment={handleEditAppointment} refreshTrigger={refreshTrigger} />
        )}
      </div>

      {/* Appointment Modal */}
      <AppointmentModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false)
          triggerRefresh()
        }}
        appointmentId={selectedAppointment}
      />
    </div>
  )
}
