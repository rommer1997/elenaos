'use client'

import { Package, AlertTriangle, TrendingDown, Euro } from 'lucide-react'

export function InventoryStats() {
  // Mock data
  const stats = {
    totalProducts: 156,
    lowStock: 12,
    outOfStock: 3,
    totalValue: 8450.80
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Total products */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="flex items-center justify-between mb-2">
          <div className="p-2 bg-purple-100 rounded-lg">
            <Package className="h-5 w-5 text-purple-600" />
          </div>
          <span className="text-xs font-medium text-gray-500 uppercase">Total Productos</span>
        </div>
        <div className="text-2xl font-bold text-gray-900">{stats.totalProducts}</div>
        <div className="text-sm text-gray-600 mt-1">En el inventario</div>
      </div>

      {/* Low stock */}
      <div className="bg-white rounded-lg border border-orange-200 p-4">
        <div className="flex items-center justify-between mb-2">
          <div className="p-2 bg-orange-100 rounded-lg">
            <AlertTriangle className="h-5 w-5 text-orange-600" />
          </div>
          <span className="text-xs font-medium text-gray-500 uppercase">Stock Bajo</span>
        </div>
        <div className="text-2xl font-bold text-orange-600">{stats.lowStock}</div>
        <div className="text-sm text-gray-600 mt-1">Requieren reposición</div>
      </div>

      {/* Out of stock */}
      <div className="bg-white rounded-lg border border-red-200 p-4">
        <div className="flex items-center justify-between mb-2">
          <div className="p-2 bg-red-100 rounded-lg">
            <TrendingDown className="h-5 w-5 text-red-600" />
          </div>
          <span className="text-xs font-medium text-gray-500 uppercase">Agotados</span>
        </div>
        <div className="text-2xl font-bold text-red-600">{stats.outOfStock}</div>
        <div className="text-sm text-gray-600 mt-1">Sin stock</div>
      </div>

      {/* Total value */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="flex items-center justify-between mb-2">
          <div className="p-2 bg-green-100 rounded-lg">
            <Euro className="h-5 w-5 text-green-600" />
          </div>
          <span className="text-xs font-medium text-gray-500 uppercase">Valor Total</span>
        </div>
        <div className="text-2xl font-bold text-gray-900">
          €{stats.totalValue.toLocaleString('es-ES', { minimumFractionDigits: 2 })}
        </div>
        <div className="text-sm text-gray-600 mt-1">Inventario actual</div>
      </div>
    </div>
  )
}
