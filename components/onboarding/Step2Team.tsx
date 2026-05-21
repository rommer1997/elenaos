'use client'

import { useState } from 'react'
import { ArrowRight, ArrowLeft, Plus, X, Users, Sparkles, Scissors } from 'lucide-react'

interface Step2Props {
  data: any
  onComplete: (data: any) => void
  onBack: () => void
}

export function Step2Team({ data, onComplete, onBack }: Step2Props) {
  const [formData, setFormData] = useState(data)
  const [showStaffForm, setShowStaffForm] = useState(false)
  const [showServiceForm, setShowServiceForm] = useState(false)
  const [currentStaff, setCurrentStaff] = useState({ name: '', specialties: '' })
  const [currentService, setCurrentService] = useState({ name: '', duration: 30, price: 0 })

  // AI suggested services
  const suggestedServices = [
    { name: 'Corte de Pelo', duration: 30, price: 25 },
    { name: 'Tinte Completo', duration: 120, price: 85 },
    { name: 'Mechas', duration: 180, price: 120 },
    { name: 'Manicura Semipermanente', duration: 60, price: 35 },
    { name: 'Pedicura Completa', duration: 45, price: 30 },
    { name: 'Facial Hidratante', duration: 60, price: 45 }
  ]

  const handleAddStaff = () => {
    if (currentStaff.name) {
      setFormData({
        ...formData,
        staff: [...formData.staff, { ...currentStaff, id: Date.now() }]
      })
      setCurrentStaff({ name: '', specialties: '' })
      setShowStaffForm(false)
    }
  }

  const handleRemoveStaff = (id: number) => {
    setFormData({
      ...formData,
      staff: formData.staff.filter((s: any) => s.id !== id)
    })
  }

  const handleAddService = (service?: any) => {
    const serviceToAdd = service || currentService
    if (serviceToAdd.name) {
      setFormData({
        ...formData,
        services: [...formData.services, { ...serviceToAdd, id: Date.now() }]
      })
      setCurrentService({ name: '', duration: 30, price: 0 })
      setShowServiceForm(false)
    }
  }

  const handleRemoveService = (id: number) => {
    setFormData({
      ...formData,
      services: formData.services.filter((s: any) => s.id !== id)
    })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onComplete(formData)
  }

  return (
    <div className="bg-white rounded-3xl shadow-2xl p-8 lg:p-12 border-2 border-purple-100">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <Users className="h-8 w-8 text-white" />
        </div>
        <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
          Tu equipo y servicios
        </h1>
        <p className="text-gray-600 text-lg">
          Añade tu personal y los servicios que ofreces (puedes hacerlo después)
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Staff Section */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold text-gray-900">Personal del salón</h3>
            {!showStaffForm && (
              <button
                type="button"
                onClick={() => setShowStaffForm(true)}
                className="flex items-center gap-2 px-4 py-2 bg-purple-50 text-purple-700 rounded-lg hover:bg-purple-100 transition-colors font-medium"
              >
                <Plus className="h-4 w-4" />
                Añadir personal
              </button>
            )}
          </div>

          {/* Staff form */}
          {showStaffForm && (
            <div className="bg-purple-50 rounded-xl p-4 mb-4 border-2 border-purple-200">
              <div className="space-y-3">
                <input
                  type="text"
                  placeholder="Nombre completo"
                  value={currentStaff.name}
                  onChange={(e) => setCurrentStaff({ ...currentStaff, name: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
                <input
                  type="text"
                  placeholder="Especialidades (ej: Corte, Color, Peinados)"
                  value={currentStaff.specialties}
                  onChange={(e) => setCurrentStaff({ ...currentStaff, specialties: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={handleAddStaff}
                    className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                  >
                    Añadir
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowStaffForm(false)}
                    className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Staff list */}
          {formData.staff.length > 0 ? (
            <div className="space-y-2">
              {formData.staff.map((staff: any) => (
                <div
                  key={staff.id}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200"
                >
                  <div>
                    <div className="font-semibold text-gray-900">{staff.name}</div>
                    {staff.specialties && (
                      <div className="text-sm text-gray-600">{staff.specialties}</div>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveStaff(staff.id)}
                    className="text-red-600 hover:bg-red-50 p-2 rounded-lg transition-colors"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
              Aún no has añadido personal. Puedes hacerlo ahora o después.
            </div>
          )}
        </div>

        {/* Services Section */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold text-gray-900">Servicios</h3>
            {!showServiceForm && (
              <button
                type="button"
                onClick={() => setShowServiceForm(true)}
                className="flex items-center gap-2 px-4 py-2 bg-purple-50 text-purple-700 rounded-lg hover:bg-purple-100 transition-colors font-medium"
              >
                <Plus className="h-4 w-4" />
                Añadir servicio
              </button>
            )}
          </div>

          {/* AI Suggestions */}
          {formData.services.length === 0 && !showServiceForm && (
            <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-6 mb-4 border-2 border-purple-200">
              <div className="flex items-center gap-2 mb-4">
                <Sparkles className="h-5 w-5 text-purple-600" />
                <h4 className="font-bold text-gray-900">Servicios sugeridos por IA</h4>
              </div>
              <div className="grid md:grid-cols-2 gap-3">
                {suggestedServices.map((service, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => handleAddService(service)}
                    className="flex items-center justify-between p-3 bg-white rounded-lg border border-purple-200 hover:border-purple-400 hover:shadow-md transition-all text-left"
                  >
                    <div>
                      <div className="font-semibold text-gray-900">{service.name}</div>
                      <div className="text-sm text-gray-600">
                        {service.duration} min • €{service.price}
                      </div>
                    </div>
                    <Plus className="h-5 w-5 text-purple-600" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Service form */}
          {showServiceForm && (
            <div className="bg-purple-50 rounded-xl p-4 mb-4 border-2 border-purple-200">
              <div className="space-y-3">
                <input
                  type="text"
                  placeholder="Nombre del servicio"
                  value={currentService.name}
                  onChange={(e) => setCurrentService({ ...currentService, name: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm text-gray-700 mb-1">Duración (min)</label>
                    <input
                      type="number"
                      placeholder="30"
                      value={currentService.duration}
                      onChange={(e) => setCurrentService({ ...currentService, duration: Number(e.target.value) })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-700 mb-1">Precio (€)</label>
                    <input
                      type="number"
                      placeholder="0"
                      value={currentService.price}
                      onChange={(e) => setCurrentService({ ...currentService, price: Number(e.target.value) })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => handleAddService()}
                    className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                  >
                    Añadir
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowServiceForm(false)}
                    className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Services list */}
          {formData.services.length > 0 ? (
            <div className="space-y-2">
              {formData.services.map((service: any) => (
                <div
                  key={service.id}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200"
                >
                  <div className="flex items-center gap-3">
                    <Scissors className="h-5 w-5 text-purple-600" />
                    <div>
                      <div className="font-semibold text-gray-900">{service.name}</div>
                      <div className="text-sm text-gray-600">
                        {service.duration} min • €{service.price}
                      </div>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveService(service.id)}
                    className="text-red-600 hover:bg-red-50 p-2 rounded-lg transition-colors"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
              ))}
            </div>
          ) : (
            !showServiceForm && formData.services.length === 0 && suggestedServices.length === 0 && (
              <div className="text-center py-8 text-gray-500 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                Aún no has añadido servicios. Puedes hacerlo ahora o después.
              </div>
            )
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-4">
          <button
            type="button"
            onClick={onBack}
            className="px-8 py-4 border-2 border-gray-300 text-gray-700 rounded-xl font-bold hover:bg-gray-50 transition-colors flex items-center gap-2"
          >
            <ArrowLeft className="h-5 w-5" />
            Atrás
          </button>
          <button
            type="submit"
            className="flex-1 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-bold text-lg hover:shadow-xl hover:scale-105 transition-all flex items-center justify-center gap-2"
          >
            Continuar
            <ArrowRight className="h-5 w-5" />
          </button>
        </div>
      </form>
    </div>
  )
}
