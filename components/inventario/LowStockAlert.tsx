'use client'

import { AlertTriangle, X, ShoppingCart } from 'lucide-react'
import { useState } from 'react'

export function LowStockAlert() {
  const [isVisible, setIsVisible] = useState(true)

  // Mock data - productos con stock bajo
  const lowStockProducts = [
    { name: 'Tinte Castaño Claro', currentStock: 2, minStock: 5 },
    { name: 'Esmalte Rojo Pasión', currentStock: 1, minStock: 3 },
    { name: 'Crema Hidratante Facial', currentStock: 3, minStock: 10 }
  ]

  if (!isVisible || lowStockProducts.length === 0) {
    return null
  }

  return (
    <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-3 flex-1">
          <div className="p-2 bg-orange-100 rounded-lg">
            <AlertTriangle className="h-5 w-5 text-orange-600" />
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold text-orange-900">
                {lowStockProducts.length} productos con stock bajo
              </h3>
              <button
                onClick={() => setIsVisible(false)}
                className="p-1 text-orange-600 hover:bg-orange-100 rounded transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="space-y-2 mb-3">
              {lowStockProducts.map((product, index) => (
                <div key={index} className="flex items-center justify-between text-sm">
                  <span className="text-orange-800">
                    <span className="font-medium">{product.name}</span>
                    {' - '}
                    <span className="text-orange-600">
                      Stock: {product.currentStock} (mín: {product.minStock})
                    </span>
                  </span>
                </div>
              ))}
            </div>
            <button className="flex items-center gap-2 px-4 py-2 bg-orange-600 text-white rounded-lg text-sm font-medium hover:bg-orange-700 transition-colors">
              <ShoppingCart className="h-4 w-4" />
              <span>Generar pedido de reposición</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
