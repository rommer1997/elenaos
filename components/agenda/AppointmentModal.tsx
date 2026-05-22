'use client'

import { useState, useEffect } from 'react'
import { X, Calendar, Clock, User, Tag, Save } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { useUser } from '@/hooks/useUser'
import type { Appointment, Staff, Service, Client } from '@/types'

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
  const [clients, setClients] = useState<Client[]>([])

  const filteredClients = clients.filter(c =>
    `${c.first_name} ${c.last_name || ''} ${c.phone}`
      .toLowerCase()
      .includes(clientSearch.toLowerCase())
  )

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
    if (!tenant?.schema_name) return
    setIsLoading(true)
    const supabase = createClient()

    try {
      // Cargar staff activo
      const { data: staffData, error: staffError } = await supabase
        .schema(tenant.schema_name)
        .from('staff')
        .select('*')
        .eq('is_active', true)

      if (staffError) throw staffError
      setStaff(staffData || [])

      // Cargar servicios activos
      const { data: servicesData, error: servicesError } = await supabase
        .schema(tenant.schema_name)
        .from('services')
        .select('*')
        .eq('is_active', true)

      if (servicesError) throw servicesError
      setServices(servicesData || [])

      // Cargar clientas
      const { data: clientsData } = await supabase
        .schema(tenant.schema_name)
        .from('clients')
        .select('*')
      setClients(clientsData || [])

    } catch (error) {
      console.error('Error loading initial data in modal:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const loadAppointment = async (id: string) => {
    if (!tenant?.schema_name) return
    setIsLoading(true)
    const supabase = createClient()
    try {
      const { data, error } = await supabase
        .schema(tenant.schema_name)
        .from('appointments')
        .select(`
          *,
          client:clients(*)
        `)
        .eq('id', id)
        .maybeSingle()

      if (error) throw error
      if (data) {
        setSelectedClient(data.client_id)
        setClientSearch(data.client ? `${data.client.first_name} ${data.client.last_name || ''}`.trim() : '')
        setStaffId(data.staff_id)
        setServiceId(data.service_id)
        const start = new Date(data.start_time)
        setDate(start.toISOString().split('T')[0])
        setStartTime(start.toTimeString().substring(0, 5))
        const durationMs = new Date(data.end_time).getTime() - start.getTime()
        setDuration(durationMs / 60000)
        setStatus(data.status)
        setNotes(data.notes || '')
      }
    } catch (error) {
      console.error('Error loading appointment:', error)
    } finally {
      setIsLoading(false)
    }
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

    if (!tenant?.schema_name) {
      alert('Información del salón no disponible')
      return
    }

    setIsSaving(true)
    const supabase = createClient()

    try {
      const startDateTime = new Date(`${date}T${startTime}:00`)
      const endDateTime = new Date(startDateTime.getTime() + duration * 60000)
      const service = services.find(s => s.id === serviceId)
      const price = service ? service.price : 0

      const payload = {
        client_id: selectedClient,
        staff_id: staffId,
        service_id: serviceId,
        start_time: startDateTime.toISOString(),
        end_time: endDateTime.toISOString(),
        status,
        price,
        notes: notes || null,
        updated_at: new Date().toISOString(),
      }

      if (appointmentId) {
        const { error } = await supabase
          .schema(tenant.schema_name)
          .from('appointments')
          .update(payload)
          .eq('id', appointmentId)

        if (error) throw error
      } else {
        const { error } = await supabase
          .schema(tenant.schema_name)
          .from('appointments')
          .insert({
            ...payload,
            tenant_id: tenant.id,
            source: 'manual',
            created_at: new Date().toISOString(),
          })

        if (error) throw error
      }

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
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Cliente *
              </label>
              <input
                type="text"
                value={clientSearch}
                onChange={(e) => {
                  setClientSearch(e.target.value)
                  setSelectedClient(null)
                }}
                placeholder="Buscar por nombre o teléfono..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
              {clientSearch && !selectedClient && (
                <div className="absolute z-10 w-full bg-white border border-gray-200 mt-1 rounded-lg shadow-lg max-h-48 overflow-y-auto">
                  {filteredClients.length > 0 ? (
                    filteredClients.map((c) => (
                      <button
                        key={c.id}
                        type="button"
                        onClick={() => {
                          setSelectedClient(c.id)
                          setClientSearch(`${c.first_name} ${c.last_name || ''}`.trim())
                        }}
                        className="w-full text-left px-4 py-2 hover:bg-purple-50 transition-colors text-sm border-b border-gray-100 last:border-b-0"
                      >
                        <div className="font-semibold text-gray-900">
                          {c.first_name} {c.last_name || ''}
                        </div>
                        <div className="text-xs text-gray-500">{c.phone}</div>
                      </button>
                    ))
                  ) : (
                    <div className="px-4 py-3 text-sm text-gray-500 text-center">
                      No se encontraron clientas.
                    </div>
                  )}
                </div>
              )}
              {selectedClient && (
                <div className="mt-1 text-xs text-green-600 flex items-center gap-1 font-medium">
                  ✓ Clienta seleccionada correctamente
                </div>
              )}
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
