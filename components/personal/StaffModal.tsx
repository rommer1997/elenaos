'use client'

import { useState, useEffect } from 'react'
import { X, Save, User, Mail, Phone, Briefcase, Clock, Palette } from 'lucide-react'

interface Availability {
  monday: { available: boolean; start: string; end: string }
  tuesday: { available: boolean; start: string; end: string }
  wednesday: { available: boolean; start: string; end: string }
  thursday: { available: boolean; start: string; end: string }
  friday: { available: boolean; start: string; end: string }
  saturday: { available: boolean; start: string; end: string }
  sunday: { available: boolean; start: string; end: string }
}

interface StaffModalProps {
  staff: any | null
  onClose: () => void
  onSave: () => void
}

export function StaffModal({ staff, onClose, onSave }: StaffModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    role: '',
    email: '',
    phone: '',
    specialties: [] as string[],
    color: '#9333ea',
    availability: {
      monday: { available: true, start: '09:00', end: '18:00' },
      tuesday: { available: true, start: '09:00', end: '18:00' },
      wednesday: { available: true, start: '09:00', end: '18:00' },
      thursday: { available: true, start: '09:00', end: '18:00' },
      friday: { available: true, start: '09:00', end: '18:00' },
      saturday: { available: false, start: '', end: '' },
      sunday: { available: false, start: '', end: '' }
    } as Availability,
    status: 'active' as 'active' | 'inactive'
  })

  const [specialtyInput, setSpecialtyInput] = useState('')
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    if (staff) {
      setFormData(staff)
    }
  }, [staff])

  const roles = [
    'Estilista',
    'Estilista Senior',
    'Colorista',
    'Técnico de Uñas',
    'Esteticista',
    'Masajista',
    'Recepcionista',
    'Propietaria',
    'Gerente'
  ]

  const colorOptions = [
    { name: 'Púrpura', value: '#9333ea' },
    { name: 'Rosa', value: '#ec4899' },
    { name: 'Violeta', value: '#8b5cf6' },
    { name: 'Azul', value: '#3b82f6' },
    { name: 'Cian', value: '#06b6d4' },
    { name: 'Verde', value: '#10b981' },
    { name: 'Naranja', value: '#f97316' },
    { name: 'Rojo', value: '#ef4444' },
    { name: 'Amarillo', value: '#f59e0b' },
    { name: 'Índigo', value: '#6366f1' }
  ]

  const days = [
    { key: 'monday', label: 'Lunes' },
    { key: 'tuesday', label: 'Martes' },
    { key: 'wednesday', label: 'Miércoles' },
    { key: 'thursday', label: 'Jueves' },
    { key: 'friday', label: 'Viernes' },
    { key: 'saturday', label: 'Sábado' },
    { key: 'sunday', label: 'Domingo' }
  ]

  const handleAddSpecialty = () => {
    if (specialtyInput.trim() && !formData.specialties.includes(specialtyInput.trim())) {
      setFormData({
        ...formData,
        specialties: [...formData.specialties, specialtyInput.trim()]
      })
      setSpecialtyInput('')
    }
  }

  const handleRemoveSpecialty = (specialty: string) => {
    setFormData({
      ...formData,
      specialties: formData.specialties.filter(s => s !== specialty)
    })
  }

  const handleAvailabilityChange = (day: string, field: string, value: any) => {
    setFormData({
      ...formData,
      availability: {
        ...formData.availability,
        [day]: {
          ...formData.availability[day as keyof Availability],
          [field]: value
        }
      }
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)

    try {
      // TODO: Implementar guardado en BD
      await new Promise(resolve => setTimeout(resolve, 1000))

      alert(staff ? '✅ Personal actualizado correctamente' : '✅ Personal añadido correctamente')
      onSave()
    } catch (error) {
      console.error('Error saving staff:', error)
      alert('❌ Error guardando datos')
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-start justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl my-8">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">
            {staff ? 'Editar Personal' : 'Añadir Personal'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Basic info */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <User className="h-5 w-5 text-purple-600" />
              Información Básica
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nombre completo *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="María García López"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Rol / Puesto *
                </label>
                <select
                  required
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="">Seleccionar...</option>
                  {roles.map(role => (
                    <option key={role} value={role}>{role}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email *
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="maria@salon.com"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Teléfono *
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="+34 666 123 456"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Specialties */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <Briefcase className="h-5 w-5 text-purple-600" />
              Especialidades
            </h3>

            <div className="flex gap-2">
              <input
                type="text"
                value={specialtyInput}
                onChange={(e) => setSpecialtyInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddSpecialty())}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="Ej: Corte, Color, Peinados..."
              />
              <button
                type="button"
                onClick={handleAddSpecialty}
                className="px-4 py-2 bg-purple-50 text-purple-700 rounded-lg border border-purple-200 hover:bg-purple-100 transition-colors"
              >
                Añadir
              </button>
            </div>

            {formData.specialties.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {formData.specialties.map((specialty) => (
                  <span
                    key={specialty}
                    className="inline-flex items-center gap-1 px-3 py-1 bg-purple-100 text-purple-700 rounded-lg text-sm"
                  >
                    {specialty}
                    <button
                      type="button"
                      onClick={() => handleRemoveSpecialty(specialty)}
                      className="hover:text-purple-900"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Color */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <Palette className="h-5 w-5 text-purple-600" />
              Color en Agenda
            </h3>
            <p className="text-sm text-gray-600">
              Este color identificará las citas de este miembro del equipo en el calendario
            </p>

            <div className="grid grid-cols-5 md:grid-cols-10 gap-3">
              {colorOptions.map((color) => (
                <button
                  key={color.value}
                  type="button"
                  onClick={() => setFormData({ ...formData, color: color.value })}
                  className={`w-12 h-12 rounded-lg transition-all ${
                    formData.color === color.value
                      ? 'ring-4 ring-offset-2 ring-purple-500 scale-110'
                      : 'hover:scale-105'
                  }`}
                  style={{ backgroundColor: color.value }}
                  title={color.name}
                />
              ))}
            </div>
          </div>

          {/* Availability */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <Clock className="h-5 w-5 text-purple-600" />
              Disponibilidad Semanal
            </h3>

            <div className="space-y-3">
              {days.map(({ key, label }) => {
                const dayData = formData.availability[key as keyof Availability]

                return (
                  <div key={key} className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                    <div className="w-28 font-medium text-gray-700">{label}</div>

                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={dayData.available}
                        onChange={(e) => handleAvailabilityChange(key, 'available', e.target.checked)}
                        className="w-4 h-4 text-purple-600 rounded focus:ring-purple-500"
                      />
                      <span className="text-sm text-gray-600">Disponible</span>
                    </label>

                    {dayData.available && (
                      <>
                        <input
                          type="time"
                          value={dayData.start}
                          onChange={(e) => handleAvailabilityChange(key, 'start', e.target.value)}
                          className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        />
                        <span className="text-gray-500">-</span>
                        <input
                          type="time"
                          value={dayData.end}
                          onChange={(e) => handleAvailabilityChange(key, 'end', e.target.value)}
                          className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        />
                      </>
                    )}
                  </div>
                )
              })}
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="flex items-center gap-2 px-6 py-3 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition-colors disabled:opacity-50"
            >
              {isSaving ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                  <span>Guardando...</span>
                </>
              ) : (
                <>
                  <Save className="h-5 w-5" />
                  <span>{staff ? 'Guardar Cambios' : 'Añadir Personal'}</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
