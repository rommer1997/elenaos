'use client'

import { useState, useEffect } from 'react'
import { X, Save, Clock, Euro, Tag, Package, FileText } from 'lucide-react'

interface ServiceModalProps {
  service: any | null
  onClose: () => void
  onSave: () => void
}

export function ServiceModal({ service, onClose, onSave }: ServiceModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    duration: 30,
    price: 0,
    description: '',
    products: [] as string[],
    status: 'active' as 'active' | 'inactive'
  })

  const [productInput, setProductInput] = useState('')
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    if (service) {
      setFormData(service)
    }
  }, [service])

  const categories = [
    'Peluquería',
    'Coloración',
    'Uñas',
    'Estética',
    'Depilación',
    'Tratamientos',
    'Masajes',
    'Maquillaje',
    'Cejas y Pestañas',
    'Otros'
  ]

  const durationOptions = [
    { value: 15, label: '15 min' },
    { value: 30, label: '30 min' },
    { value: 45, label: '45 min' },
    { value: 60, label: '1 hora' },
    { value: 90, label: '1h 30min' },
    { value: 120, label: '2 horas' },
    { value: 150, label: '2h 30min' },
    { value: 180, label: '3 horas' },
    { value: 240, label: '4 horas' }
  ]

  const handleAddProduct = () => {
    if (productInput.trim() && !formData.products.includes(productInput.trim())) {
      setFormData({
        ...formData,
        products: [...formData.products, productInput.trim()]
      })
      setProductInput('')
    }
  }

  const handleRemoveProduct = (product: string) => {
    setFormData({
      ...formData,
      products: formData.products.filter(p => p !== product)
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)

    try {
      // TODO: Implementar guardado en BD
      await new Promise(resolve => setTimeout(resolve, 1000))

      alert(service ? '✅ Servicio actualizado correctamente' : '✅ Servicio añadido correctamente')
      onSave()
    } catch (error) {
      console.error('Error saving service:', error)
      alert('❌ Error guardando datos')
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-start justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl my-8">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">
            {service ? 'Editar Servicio' : 'Añadir Servicio'}
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
              <FileText className="h-5 w-5 text-purple-600" />
              Información Básica
            </h3>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nombre del servicio *
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="Ej: Corte de Pelo, Manicura, Facial..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Categoría *
              </label>
              <div className="relative">
                <Tag className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <select
                  required
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="">Seleccionar categoría...</option>
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Descripción
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                placeholder="Breve descripción del servicio..."
              />
            </div>
          </div>

          {/* Duration & Price */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <Clock className="h-5 w-5 text-purple-600" />
              Duración y Precio
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Duración *
                </label>
                <select
                  required
                  value={formData.duration}
                  onChange={(e) => setFormData({ ...formData, duration: Number(e.target.value) })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  {durationOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Precio *
                </label>
                <div className="relative">
                  <Euro className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="number"
                    required
                    min="0"
                    step="0.01"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="0.00"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Products */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <Package className="h-5 w-5 text-purple-600" />
              Productos Utilizados
            </h3>
            <p className="text-sm text-gray-600">
              Lista los productos del inventario que se usan en este servicio
            </p>

            <div className="flex gap-2">
              <input
                type="text"
                value={productInput}
                onChange={(e) => setProductInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddProduct())}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="Ej: Champú, Tinte, Esmalte..."
              />
              <button
                type="button"
                onClick={handleAddProduct}
                className="px-4 py-2 bg-purple-50 text-purple-700 rounded-lg border border-purple-200 hover:bg-purple-100 transition-colors"
              >
                Añadir
              </button>
            </div>

            {formData.products.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {formData.products.map((product) => (
                  <span
                    key={product}
                    className="inline-flex items-center gap-1 px-3 py-1 bg-purple-100 text-purple-700 rounded-lg text-sm"
                  >
                    {product}
                    <button
                      type="button"
                      onClick={() => handleRemoveProduct(product)}
                      className="hover:text-purple-900"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}

            {formData.products.length === 0 && (
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-center text-sm text-gray-500">
                No hay productos añadidos. Los productos ayudan a controlar el inventario usado en cada servicio.
              </div>
            )}
          </div>

          {/* Info box */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-800">
              💡 Los servicios aparecerán en el calendario y podrán ser seleccionados al crear nuevas citas.
              El sistema descontará automáticamente los productos del inventario cuando se realice el servicio.
            </p>
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
                  <span>{service ? 'Guardar Cambios' : 'Añadir Servicio'}</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
