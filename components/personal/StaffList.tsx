'use client'

import { useState } from 'react'
import { Mail, Phone, Edit, Trash2, Clock, Palette, Users } from 'lucide-react'

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
  // Mock data
  const [staff] = useState<StaffMember[]>([
    {
      id: '1',
      name: 'Elena García',
      role: 'Propietaria / Estilista Senior',
      email: 'elena@elenabeauty.com',
      phone: '+34 666 111 222',
      specialties: ['Corte', 'Color', 'Peinados', 'Tratamientos'],
      color: '#9333ea',
      availability: {
        monday: { available: true, start: '09:00', end: '20:00' },
        tuesday: { available: true, start: '09:00', end: '20:00' },
        wednesday: { available: true, start: '09:00', end: '20:00' },
        thursday: { available: true, start: '09:00', end: '20:00' },
        friday: { available: true, start: '09:00', end: '20:00' },
        saturday: { available: true, start: '10:00', end: '18:00' },
        sunday: { available: false, start: '', end: '' }
      },
      status: 'active'
    },
    {
      id: '2',
      name: 'María López',
      role: 'Estilista',
      email: 'maria@elenabeauty.com',
      phone: '+34 666 222 333',
      specialties: ['Corte', 'Peinados', 'Extensiones'],
      color: '#ec4899',
      availability: {
        monday: { available: true, start: '10:00', end: '19:00' },
        tuesday: { available: true, start: '10:00', end: '19:00' },
        wednesday: { available: true, start: '10:00', end: '19:00' },
        thursday: { available: true, start: '10:00', end: '19:00' },
        friday: { available: true, start: '10:00', end: '19:00' },
        saturday: { available: false, start: '', end: '' },
        sunday: { available: false, start: '', end: '' }
      },
      status: 'active'
    },
    {
      id: '3',
      name: 'Carmen Rodríguez',
      role: 'Técnico de Uñas',
      email: 'carmen@elenabeauty.com',
      phone: '+34 666 333 444',
      specialties: ['Manicura', 'Pedicura', 'Uñas Gel', 'Nail Art'],
      color: '#8b5cf6',
      availability: {
        monday: { available: false, start: '', end: '' },
        tuesday: { available: true, start: '11:00', end: '20:00' },
        wednesday: { available: true, start: '11:00', end: '20:00' },
        thursday: { available: true, start: '11:00', end: '20:00' },
        friday: { available: true, start: '11:00', end: '20:00' },
        saturday: { available: true, start: '11:00', end: '20:00' },
        sunday: { available: false, start: '', end: '' }
      },
      status: 'active'
    },
    {
      id: '4',
      name: 'Ana Martínez',
      role: 'Esteticista',
      email: 'ana@elenabeauty.com',
      phone: '+34 666 444 555',
      specialties: ['Faciales', 'Depilación', 'Masajes'],
      color: '#06b6d4',
      availability: {
        monday: { available: true, start: '09:00', end: '18:00' },
        tuesday: { available: true, start: '09:00', end: '18:00' },
        wednesday: { available: true, start: '09:00', end: '18:00' },
        thursday: { available: true, start: '09:00', end: '18:00' },
        friday: { available: true, start: '09:00', end: '18:00' },
        saturday: { available: true, start: '10:00', end: '15:00' },
        sunday: { available: false, start: '', end: '' }
      },
      status: 'active'
    }
  ])

  const [searchTerm, setSearchTerm] = useState('')

  const filteredStaff = staff.filter(member =>
    member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.email.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleDelete = () => {
    if (confirm('¿Estás segura de eliminar este miembro del personal?')) {
      // TODO: Implementar eliminación
      alert('Funcionalidad pendiente')
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
            {Math.round(staff.reduce((acc, s) => acc + getWorkingDaysCount(s.availability), 0) / staff.length)}
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
                    onClick={handleDelete}
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
                  <span>{member.email}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Phone className="h-4 w-4" />
                  <span>{member.phone}</span>
                </div>
              </div>

              {/* Specialties */}
              <div className="mb-4">
                <div className="text-sm font-medium text-gray-700 mb-2">Especialidades</div>
                <div className="flex flex-wrap gap-2">
                  {member.specialties.map((specialty) => (
                    <span
                      key={specialty}
                      className="px-2 py-1 text-xs font-medium bg-purple-50 text-purple-700 rounded-lg"
                    >
                      {specialty}
                    </span>
                  ))}
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

      {filteredStaff.length === 0 && (
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
