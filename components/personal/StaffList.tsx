'use client'

import { useState, useEffect } from 'react'
import { Mail, Phone, Edit, Trash2, Clock, Palette, Users } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { useUser } from '@/hooks/useUser'

interface StaffMember {
  id: string
  name: string
  role: string
  email: string
  phone: string
  specialties: string[]
  color: string
  availability: {
    monday: { available: boolean; start: string; end: string }
    tuesday: { available: boolean; start: string; end: string }
    wednesday: { available: boolean; start: string; end: string }
    thursday: { available: boolean; start: string; end: string }
    friday: { available: boolean; start: string; end: string }
    saturday: { available: boolean; start: string; end: string }
    sunday: { available: boolean; start: string; end: string }
  }
  status: 'active' | 'inactive'
  avatar?: string
}

interface StaffListProps {
  onEdit: (staff: StaffMember) => void
}

export function StaffList({ onEdit }: StaffListProps) {
  const { tenant } = useUser()
  const [staff, setStaff] = useState<StaffMember[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    loadStaff()
  }, [tenant?.id])

  async function loadStaff() {
    if (!tenant?.id) return

    const supabase = createClient()
    setIsLoading(true)

    try {
      const { data, error } = await supabase
        .from('staff_members')
        .select('*')
        .eq('tenant_id', tenant.id)
        .eq('is_active', true)
        .order('name')

      if (error) throw error

      // Transformar datos de Supabase al formato del componente
      const staffMembers: StaffMember[] = (data || []).map((s: any) => ({
        id: s.id,
        name: s.name,
        role: s.role || 'Staff',
        email: s.email || '',
        phone: s.phone || '',
        specialties: s.specialties || [],
        color: s.calendar_color || '#9333ea',
        availability: s.availability || {
          monday: { available: true, start: '09:00', end: '18:00' },
          tuesday: { available: true, start: '09:00', end: '18:00' },
          wednesday: { available: true, start: '09:00', end: '18:00' },
          thursday: { available: true, start: '09:00', end: '18:00' },
          friday: { available: true, start: '09:00', end: '18:00' },
          saturday: { available: false, start: '', end: '' },
          sunday: { available: false, start: '', end: '' }
        },
        status: 'active'
      }))

      setStaff(staffMembers)
    } catch (error) {
      console.error('Error loading staff:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const filteredStaff = staff.filter(member =>
    member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.email.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleDelete = async (staffId: string) => {
    if (!confirm('¿Estás segura de eliminar este miembro del personal?')) return

    const supabase = createClient()

    try {
      const { error } = await supabase
        .from('staff_members')
        .update({ is_active: false })
        .eq('id', staffId)

      if (error) throw error

      // Recargar lista
      loadStaff()
    } catch (error) {
      console.error('Error deleting staff:', error)
      alert('Error al eliminar el miembro del personal')
    }
  }

  const getWorkingDaysCount = (availability: StaffMember['availability']) => {
    return Object.values(availability).filter(day => day.available).length
  }

  const getScheduleSummary = (availability: StaffMember['availability']) => {
    const days = ['L', 'M', 'X', 'J', 'V', 'S', 'D']
    const dayKeys = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']

    return days.map((day, index) => {
      const dayKey = dayKeys[index] as keyof typeof availability
      const isAvailable = availability[dayKey].available

      return (
        <span
          key={day}
          className={`inline-flex items-center justify-center w-7 h-7 rounded-full text-xs font-medium ${
            isAvailable
              ? 'bg-green-100 text-green-700'
              : 'bg-gray-100 text-gray-400'
          }`}
        >
          {day}
        </span>
      )
    })
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando personal...</p>
        </div>
      </div>
    )
  }

  if (staff.length === 0 && searchTerm === '') {
    return (
      <div className="bg-white rounded-lg shadow-sm p-12 text-center">
        <Users className="h-16 w-16 text-gray-300 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          No hay personal registrado
        </h3>
        <p className="text-gray-600 mb-6">
          Añade a tu primer miembro del equipo para comenzar
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Search */}
      <div className="bg-white rounded-lg shadow-sm p-4">
        <input
          type="text"
          placeholder="Buscar por nombre, rol o email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
        />
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="text-3xl font-bold text-purple-600">{staff.length}</div>
          <div className="text-sm text-gray-600 mt-1">Total Personal</div>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="text-3xl font-bold text-green-600">
            {staff.filter(s => s.status === 'active').length}
          </div>
          <div className="text-sm text-gray-600 mt-1">Activos</div>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="text-3xl font-bold text-blue-600">
            {staff.flatMap(s => s.specialties).length}
          </div>
          <div className="text-sm text-gray-600 mt-1">Especialidades</div>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="text-3xl font-bold text-orange-600">
            {staff.length > 0 ? Math.round(staff.reduce((acc, s) => acc + getWorkingDaysCount(s.availability), 0) / staff.length) : 0}
          </div>
          <div className="text-sm text-gray-600 mt-1">Días/semana promedio</div>
        </div>
      </div>

      {/* Staff list */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredStaff.map((member) => (
          <div key={member.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            {/* Header with color */}
            <div className="h-2" style={{ backgroundColor: member.color }}></div>

            <div className="p-6">
              {/* Top section */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-start gap-4">
                  {/* Avatar */}
                  <div
                    className="w-16 h-16 rounded-full flex items-center justify-center text-white font-semibold text-xl"
                    style={{ backgroundColor: member.color }}
                  >
                    {member.name.split(' ').map(n => n[0]).join('')}
                  </div>

                  <div>
                    <h3 className="font-semibold text-gray-900 text-lg">{member.name}</h3>
                    <p className="text-sm text-gray-600">{member.role}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="px-2 py-1 text-xs font-medium text-green-700 bg-green-100 rounded-full">
                        Activo
                      </span>
                      <div
                        className="flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full text-white"
                        style={{ backgroundColor: member.color }}
                      >
                        <Palette className="h-3 w-3" />
                        <span>Color en agenda</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <button
                    onClick={() => onEdit(member)}
                    className="p-2 text-gray-600 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                  >
                    <Edit className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => handleDelete(member.id)}
                    className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>
              </div>

              {/* Contact info */}
              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Mail className="h-4 w-4" />
                  <span>{member.email || 'Sin email'}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Phone className="h-4 w-4" />
                  <span>{member.phone || 'Sin teléfono'}</span>
                </div>
              </div>

              {/* Specialties */}
              <div className="mb-4">
                <div className="text-sm font-medium text-gray-700 mb-2">Especialidades</div>
                <div className="flex flex-wrap gap-2">
                  {member.specialties.length > 0 ? (
                    member.specialties.map((specialty) => (
                      <span
                        key={specialty}
                        className="px-2 py-1 text-xs font-medium bg-purple-50 text-purple-700 rounded-lg"
                      >
                        {specialty}
                      </span>
                    ))
                  ) : (
                    <span className="text-sm text-gray-500">Sin especialidades</span>
                  )}
                </div>
              </div>

              {/* Availability */}
              <div>
                <div className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                  <Clock className="h-4 w-4" />
                  <span>Disponibilidad</span>
                </div>
                <div className="flex gap-1">
                  {getScheduleSummary(member.availability)}
                </div>
                <div className="text-xs text-gray-500 mt-2">
                  {getWorkingDaysCount(member.availability)} días/semana
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredStaff.length === 0 && searchTerm !== '' && (
        <div className="bg-white rounded-lg shadow-sm p-12 text-center">
          <Users className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            No se encontró personal
          </h3>
          <p className="text-gray-600">
            Intenta con otro término de búsqueda
          </p>
        </div>
      )}
    </div>
  )
}
