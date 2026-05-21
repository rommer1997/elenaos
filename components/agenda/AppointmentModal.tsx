'use client'

import { useState, useEffect } from 'react'
import { X, Calendar, Clock, User, Tag, Save } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { useUser } from '@/hooks/useUser'
import type { Appointment, Staff, Service } from '@/types'

interface AppointmentModalProps {
  isOpen: boolean
  onClose: () => void
  appointmentId: string | null
}

export function AppointmentModal({ isOpen, onClose, appointmentId }: AppointmentModalProps) {
  const { tenant } = useUser()
  const [isLoading, setIsLoading] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  // Form state
  const [clientSearch, setClientSearch] = useState('')
  const [selectedClient, setSelectedClient] = useState<string | null>(null)
  const [staffId, setStaffId] = useState<string>('')
  const [serviceId, setServiceId] = useState<string>('')
  const [date, setDate] = useState('')
  const [startTime, setStartTime] = useState('')
  const [duration, setDuration] = useState(60) // minutos
  const [status, setStatus] = useState<'scheduled' | 'confirmed'>('scheduled')
  const [notes, setNotes] = useState('')

  // Data
  const [staff, setStaff] = useState<Staff[]>([])
  const [services, setServices] = useState<Service[]>([])

  useEffect(() => {
    if (isOpen) {
      loadInitialData()
      if (appointmentId) {
        loadAppointment(appointmentId)
      } else {
        resetForm()
      }
    }
  }, [isOpen, appointmentId])

  const loadInitialData = async () => {
    setIsLoading(true)

    // TODO: Implementar queries reales
    // Mock data
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

    setServices([
      {
        id: 'service-1',
        tenant_id: tenant?.id || '',
        name: 'Manicura',
        description: 'Manicura completa',
        duration: 60,
        price: 25,
        color: '#ec4899',
        is_active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        id: 'service-2',
        tenant_id: tenant?.id || '',
        name: 'Pedicura',
        description: 'Pedicura completa',
        duration: 60,
        price: 30,
        color: '#f59e0b',
        is_active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        id: 'service-3',
        tenant_id: tenant?.id || '',
        name: 'Tratamiento facial',
        description: 'Limpieza facial profunda',
        duration: 90,
        price: 45,
        color: '#8b5cf6',
        is_active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        id: 'service-4',
        tenant_id: tenant?.id || '',
        name: 'Depilación completa',
        description: 'Depilación de cuerpo completo',
        duration: 120,
        price: 60,
        color: '#10b981',
        is_active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
    ])

    setIsLoading(false)
  }

  const loadAppointment = async (id: string) => {
    // TODO: Implementar query real
    // Mock: cargar datos de la cita
  }

  const resetForm = () => {
    setClientSearch('')
    setSelectedClient(null)
    setStaffId('')
    setServiceId('')
    setDate(new Date().toISOString().split('T')[0])
    setStartTime('10:00')
    setDuration(60)
    setStatus('scheduled')
    setNotes('')
  }

  const handleServiceChange = (newServiceId: string) => {
    setServiceId(newServiceId)
    const service = services.find((s) => s.id === newServiceId)
    if (service) {
      setDuration(service.duration)
    }
  }

  const handleSave = async () => {
    if (!selectedClient || !staffId || !serviceId || !date || !startTime) {
      alert('Por favor completa todos los campos obligatorios')
      return
    }

    setIsSaving(true)

    try {
      // TODO: Implementar guardado real en Supabase
      // Construir fecha/hora
      const startDateTime = new Date(`${date}T${startTime}:00`)
      const endDateTime = new Date(startDateTime.getTime() + duration * 60000)

      console.log('Guardando cita:', {
        client_id: selectedClient,
        staff_id: staffId,
        service_id: serviceId,
        start_time: startDateTime.toISOString(),
        end_time: endDateTime.toISOString(),
        status,
        notes: notes || null,
      })

      // Simular delay
      await new Promise((resolve) => setTimeout(resolve, 1000))

      alert('Cita guardada exitosamente')
      onClose()
    } catch (error) {
      console.error('Error saving appointment:', error)
      alert('Error al guardar la cita')
    } finally {
      setIsSaving(false)
    }
  }

  if (!isOpen) return null

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/50 z-50" onClick={onClose} />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
        <div
          className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto pointer-events-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <h2 className="text-2xl font-bold text-gray-900">
              {appointmentId ? 'Editar cita' : 'Nueva cita'}
            </h2>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Form */}
          <div className="p-6 space-y-6">
            {/* Cliente */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Cliente *
              </label>
              <input
                type="text"
                value={clientSearch}
                onChange={(e) => setClientSearch(e.target.value)}
                placeholder="Buscar por nombre, teléfono o email..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
              <p className="mt-1 text-xs text-gray-500">
                TODO: Implementar búsqueda de clientes con autocompletar
              </p>
            </div>

            {/* Staff */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Esteticista *
              </label>
              <select
                value={staffId}
                onChange={(e) => setStaffId(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value="">Seleccionar...</option>
                {staff.map((member) => (
                  <option key={member.id} value={member.id}>
                    {member.first_name} {member.last_name}
                  </option>
                ))}
              </select>
            </div>

            {/* Servicio */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Servicio *
              </label>
              <select
                value={serviceId}
                onChange={(e) => handleServiceChange(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value="">Seleccionar...</option>
                {services.map((service) => (
                  <option key={service.id} value={service.id}>
                    {service.name} - {service.duration} min - {service.price}€
                  </option>
                ))}
              </select>
            </div>

            {/* Fecha y hora */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Fecha *
                </label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Hora *
                </label>
                <input
                  type="time"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Duración */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Duración (minutos)
              </label>
              <input
                type="number"
                value={duration}
                onChange={(e) => setDuration(Number(e.target.value))}
                min="15"
                step="15"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>

            {/* Estado */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Estado</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as 'scheduled' | 'confirmed')}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value="scheduled">Programada</option>
                <option value="confirmed">Confirmada</option>
              </select>
            </div>

            {/* Notas */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Notas (opcional)
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
                placeholder="Ej: Primera vez, alergia a..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
              />
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200 bg-gray-50">
            <button
              onClick={onClose}
              disabled={isSaving}
              className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              Cancelar
            </button>
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              {isSaving ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                  <span>Guardando...</span>
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  <span>Guardar</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </>
  )
}
