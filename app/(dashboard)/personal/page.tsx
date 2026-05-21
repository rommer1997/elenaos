'use client'

import { useState } from 'react'
import { Users, Plus } from 'lucide-react'
import { StaffList } from '@/components/personal/StaffList'
import { StaffModal } from '@/components/personal/StaffModal'

export default function PersonalPage() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedStaff, setSelectedStaff] = useState<any>(null)

  const handleAddStaff = () => {
    setSelectedStaff(null)
    setIsModalOpen(true)
  }

  const handleEditStaff = (staff: any) => {
    setSelectedStaff(staff)
    setIsModalOpen(true)
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Users className="h-8 w-8 text-purple-600" />
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Personal</h1>
                <p className="text-gray-600 mt-1">
                  Gestiona el equipo de tu salón
                </p>
              </div>
            </div>
            <button
              onClick={handleAddStaff}
              className="flex items-center gap-2 px-4 py-3 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition-colors"
            >
              <Plus className="h-5 w-5" />
              <span>Añadir Personal</span>
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <StaffList onEdit={handleEditStaff} />
      </div>

      {/* Modal */}
      {isModalOpen && (
        <StaffModal
          staff={selectedStaff}
          onClose={() => setIsModalOpen(false)}
          onSave={() => {
            setIsModalOpen(false)
            // TODO: Refresh staff list
          }}
        />
      )}
    </div>
  )
}
