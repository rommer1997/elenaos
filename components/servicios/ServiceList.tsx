'use client'

import { useState } from 'react'
import { Clock, Euro, Edit, Trash2, Package, Tag } from 'lucide-react'

interface Service {
  id: string
  name: string
  category: string
  duration: number // minutos
  price: number
  description: string
  products: string[]
  status: 'active' | 'inactive'
}

interface ServiceListProps {
  onEdit: (service: Service) => void
}

export function ServiceList({ onEdit }: ServiceListProps) {
  // Mock data
  const [services] = useState<Service[]>([
    {
      id: '1',
      name: 'Corte de Pelo',
      category: 'Peluquería',
      duration: 30,
      price: 25,
      description: 'Corte y lavado básico',
      products: ['Champú', 'Acondicionador'],
      status: 'active'
    },
    {
      id: '2',
      name: 'Tinte Completo',
      category: 'Coloración',
      duration: 120,
      price: 85,
      description: 'Tinte completo con técnica profesional',
      products: ['Tinte profesional', 'Oxigenada', 'Champú color', 'Mascarilla'],
      status: 'active'
    },
    {
      id: '3',
      name: 'Mechas',
      category: 'Coloración',
      duration: 180,
      price: 120,
      description: 'Mechas californianas o babylights',
      products: ['Decolorante', 'Tóner', 'Papel aluminio', 'Champú matizador'],
      status: 'active'
    },
    {
      id: '4',
      name: 'Manicura Semipermanente',
      category: 'Uñas',
      duration: 60,
      price: 35,
      description: 'Manicura con esmalte semipermanente',
      products: ['Base coat', 'Esmalte semi', 'Top coat', 'Aceite de cutícula'],
      status: 'active'
    },
    {
      id: '5',
      name: 'Pedicura Completa',
      category: 'Uñas',
      duration: 45,
      price: 30,
      description: 'Pedicura con limado, hidratación y esmaltado',
      products: ['Lima', 'Exfoliante', 'Crema hidratante', 'Esmalte'],
      status: 'active'
    },
    {
      id: '6',
      name: 'Facial Hidratante',
      category: 'Estética',
      duration: 60,
      price: 45,
      description: 'Tratamiento facial completo con limpieza profunda',
      products: ['Limpiador facial', 'Exfoliante', 'Mascarilla', 'Serum', 'Crema hidratante'],
      status: 'active'
    },
    {
      id: '7',
      name: 'Depilación Piernas Completas',
      category: 'Depilación',
      duration: 40,
      price: 28,
      description: 'Depilación con cera de piernas completas',
      products: ['Cera caliente', 'Aceite post-depilación', 'Crema calmante'],
      status: 'active'
    },
    {
      id: '8',
      name: 'Peinado de Fiesta',
      category: 'Peluquería',
      duration: 90,
      price: 65,
      description: 'Peinado elaborado para eventos especiales',
      products: ['Laca', 'Mousse', 'Serum', 'Horquillas'],
      status: 'active'
    },
    {
      id: '9',
      name: 'Extensiones de Pestañas',
      category: 'Estética',
      duration: 120,
      price: 80,
      description: 'Aplicación de extensiones pelo a pelo',
      products: ['Pestañas sintéticas', 'Adhesivo', 'Primer', 'Removedor'],
      status: 'active'
    },
    {
      id: '10',
      name: 'Keratina Brasileña',
      category: 'Tratamientos',
      duration: 180,
      price: 150,
      description: 'Tratamiento alisador y reparador con keratina',
      products: ['Keratina brasileña', 'Champú sin sal', 'Acondicionador', 'Serum'],
      status: 'active'
    }
  ])

  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')

  const categories = ['Peluquería', 'Coloración', 'Uñas', 'Estética', 'Depilación', 'Tratamientos']

  const filteredServices = services.filter(service => {
    const matchesSearch = service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         service.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === 'all' || service.category === selectedCategory

    return matchesSearch && matchesCategory
  })

  const handleDelete = (id: string) => {
    if (confirm('¿Estás segura de eliminar este servicio?')) {
      // TODO: Implementar eliminación
      alert('Funcionalidad pendiente')
    }
  }

  const getCategoryColor = (category: string) => {
    const colors: { [key: string]: string } = {
      'Peluquería': 'bg-purple-100 text-purple-700',
      'Coloración': 'bg-pink-100 text-pink-700',
      'Uñas': 'bg-blue-100 text-blue-700',
      'Estética': 'bg-green-100 text-green-700',
      'Depilación': 'bg-orange-100 text-orange-700',
      'Tratamientos': 'bg-indigo-100 text-indigo-700'
    }
    return colors[category] || 'bg-gray-100 text-gray-700'
  }

  const getTotalRevenue = () => {
    return services.reduce((acc, service) => acc + service.price, 0)
  }

  const getAverageDuration = () => {
    return Math.round(services.reduce((acc, service) => acc + service.duration, 0) / services.length)
  }

  const getAveragePrice = () => {
    return Math.round(services.reduce((acc, service) => acc + service.price, 0) / services.length)
  }

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm p-4 space-y-4">
        <input
          type="text"
          placeholder="Buscar servicio por nombre o descripción..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
        />

        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              selectedCategory === 'all'
                ? 'bg-purple-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Todos
          </button>
          {categories.map(category => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                selectedCategory === category
                  ? 'bg-purple-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="text-3xl font-bold text-purple-600">{services.length}</div>
          <div className="text-sm text-gray-600 mt-1">Servicios Totales</div>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="text-3xl font-bold text-green-600">€{getAveragePrice()}</div>
          <div className="text-sm text-gray-600 mt-1">Precio Promedio</div>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="text-3xl font-bold text-blue-600">{getAverageDuration()}</div>
          <div className="text-sm text-gray-600 mt-1">Duración Promedio (min)</div>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="text-3xl font-bold text-orange-600">{categories.length}</div>
          <div className="text-sm text-gray-600 mt-1">Categorías</div>
        </div>
      </div>

      {/* Services grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredServices.map((service) => (
          <div key={service.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
            <div className="p-6">
              {/* Header */}
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 text-lg mb-2">{service.name}</h3>
                  <span className={`inline-block px-2 py-1 text-xs font-medium rounded-lg ${getCategoryColor(service.category)}`}>
                    {service.category}
                  </span>
                </div>
                <div className="flex gap-1">
                  <button
                    onClick={() => onEdit(service)}
                    className="p-2 text-gray-600 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                  >
                    <Edit className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(service.id)}
                    className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Description */}
              <p className="text-sm text-gray-600 mb-4">{service.description}</p>

              {/* Info */}
              <div className="space-y-2 mb-4">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2 text-gray-600">
                    <Clock className="h-4 w-4" />
                    <span>{service.duration} min</span>
                  </div>
                  <div className="flex items-center gap-1 text-purple-600 font-semibold">
                    <Euro className="h-4 w-4" />
                    <span>{service.price}</span>
                  </div>
                </div>
              </div>

              {/* Products */}
              {service.products.length > 0 && (
                <div>
                  <div className="flex items-center gap-1 text-xs font-medium text-gray-700 mb-2">
                    <Package className="h-3 w-3" />
                    <span>Productos ({service.products.length})</span>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {service.products.slice(0, 3).map((product, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded"
                      >
                        {product}
                      </span>
                    ))}
                    {service.products.length > 3 && (
                      <span className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded">
                        +{service.products.length - 3}
                      </span>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {filteredServices.length === 0 && (
        <div className="bg-white rounded-lg shadow-sm p-12 text-center">
          <Tag className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            No se encontraron servicios
          </h3>
          <p className="text-gray-600">
            Intenta con otro término de búsqueda o categoría
          </p>
        </div>
      )}
    </div>
  )
}
