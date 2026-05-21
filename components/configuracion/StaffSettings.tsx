'use client'

import { Users, Plus, Mail, Phone, Calendar } from 'lucide-react'

export function StaffSettings() {
  // Mock data
  const staff = [
    {
      id: '1',
      name: 'Elena García',
      role: 'Propietaria / Estilista Senior',
      email: 'elena@elenabeauty.com',
      phone: '+34 666 111 222',
      schedule: 'L-V: 9:00-20:00, S: 10:00-18:00',
      status: 'active'
    },
    {
      id: '2',
      name: 'María López',
      role: 'Estilista',
      email: 'maria@elenabeauty.com',
      phone: '+34 666 222 333',
      schedule: 'L-V: 10:00-19:00',
      status: 'active'
    },
    {
      id: '3',
      name: 'Carmen Rodríguez',
      role: 'Técnico de Uñas',
      email: 'carmen@elenabeauty.com',
      phone: '+34 666 333 444',
      schedule: 'M-S: 11:00-20:00',
      status: 'active'
    }
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Personal del Salón</h3>
          <p className="text-sm text-gray-600 mt-1">
            Gestiona el equipo de tu salón y sus horarios
          </p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition-colors">
          <Plus className="h-5 w-5" />
          <span>Añadir Personal</span>
        </button>
      </div>

      {/* Staff list */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {staff.map((member) => (
          <div key={member.id} className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center text-white font-semibold text-lg">
                {member.name.split(' ').map(n => n[0]).join('')}
              </div>
              <span className="px-2 py-1 text-xs font-medium text-green-700 bg-green-100 rounded-full">
                Activo
              </span>
            </div>

            <h4 className="font-semibold text-gray-900 mb-1">{member.name}</h4>
            <p className="text-sm text-gray-600 mb-4">{member.role}</p>

            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2 text-gray-600">
                <Mail className="h-4 w-4" />
                <span>{member.email}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <Phone className="h-4 w-4" />
                <span>{member.phone}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <Calendar className="h-4 w-4" />
                <span className="text-xs">{member.schedule}</span>
              </div>
            </div>

            <div className="flex gap-2 mt-4 pt-4 border-t border-gray-200">
              <button className="flex-1 px-3 py-1.5 text-sm text-gray-700 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                Editar
              </button>
              <button className="flex-1 px-3 py-1.5 text-sm text-gray-700 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                Horario
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Info box */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <Users className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="font-semibold text-blue-900">Gestión Completa de Personal (Próximamente)</h4>
            <p className="text-sm text-blue-800 mt-1">
              En la próxima actualización podrás gestionar horarios personalizados, permisos,
              comisiones y estadísticas de rendimiento de cada miembro del equipo.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
