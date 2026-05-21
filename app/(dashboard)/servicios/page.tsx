'use client'

import { useState } from 'react'
import { Scissors, Plus } from 'lucide-react'
import { ServiceList } from '@/components/servicios/ServiceList'
import { ServiceModal } from '@/components/servicios/ServiceModal'

export default function ServiciosPage() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedService, setSelectedService] = useState<any>(null)

  const handleAddService = () => {
    setSelectedService(null)
    setIsModalOpen(true)
  }

  const handleEditService = (service: any) => {
    setSelectedService(service)
    setIsModalOpen(true)
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Scissors className="h-8 w-8 text-purple-600" />
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Servicios</h1>
                <p className="text-gray-600 mt-1">
                  Gestiona el catálogo de servicios de tu salón
                </p>
              </div>
            </div>
            <button
              onClick={handleAddService}
              className="flex items-center gap-2 px-4 py-3 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition-colors"
            >
              <Plus className="h-5 w-5" />
              <span>Añadir Servicio</span>
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <ServiceList onEdit={handleEditService} />
      </div>

      {/* Modal */}
      {isModalOpen && (
        <ServiceModal
          service={selectedService}
          onClose={() => setIsModalOpen(false)}
          onSave={() => {
            setIsModalOpen(false)
            // TODO: Refresh service list
          }}
        />
      )}
    </div>
  )
}
