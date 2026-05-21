'use client'

import { useState } from 'react'
import {
  Package,
  Plus,
  Filter,
  AlertTriangle,
  TrendingDown,
  Search,
  BarChart3
} from 'lucide-react'
import { ProductList } from '@/components/inventario/ProductList'
import { ProductModal } from '@/components/inventario/ProductModal'
import { InventoryStats } from '@/components/inventario/InventoryStats'
import { LowStockAlert } from '@/components/inventario/LowStockAlert'

type ViewType = 'all' | 'low_stock' | 'out_of_stock' | 'categories'

export default function InventarioPage() {
  const [activeView, setActiveView] = useState<ViewType>('all')
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<string>('all')

  const views = [
    { id: 'all' as ViewType, label: 'Todos los productos', icon: Package },
    { id: 'low_stock' as ViewType, label: 'Stock bajo', icon: AlertTriangle },
    { id: 'out_of_stock' as ViewType, label: 'Agotados', icon: TrendingDown },
    { id: 'categories' as ViewType, label: 'Por categorías', icon: Filter },
  ]

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Inventario</h1>
              <p className="text-gray-600 mt-1">
                Gestión de stock y productos del salón
              </p>
            </div>
            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="flex items-center gap-2 px-6 py-3 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition-colors shadow-lg"
            >
              <Plus className="h-5 w-5" />
              <span>Añadir Producto</span>
            </button>
          </div>

          {/* Stats */}
          <InventoryStats />
        </div>
      </div>

      {/* Low stock alerts */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <LowStockAlert />
      </div>

      {/* Tabs */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4">
          <nav className="flex gap-6 overflow-x-auto">
            {views.map((view) => {
              const Icon = view.icon
              const isActive = activeView === view.id

              return (
                <button
                  key={view.id}
                  onClick={() => setActiveView(view.id)}
                  className={`flex items-center gap-2 px-4 py-4 border-b-2 font-medium transition-colors whitespace-nowrap ${
                    isActive
                      ? 'border-purple-600 text-purple-600'
                      : 'border-transparent text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  <span>{view.label}</span>
                </button>
              )
            })}
          </nav>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <ProductList
          view={activeView}
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
        />
      </div>

      {/* Create product modal */}
      <ProductModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />
    </div>
  )
}
