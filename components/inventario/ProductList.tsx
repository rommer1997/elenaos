'use client'

import { useState, useEffect } from 'react'
import {
  Package,
  Search,
  Edit,
  Trash2,
  MoreVertical,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Filter
} from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { useUser } from '@/hooks/useUser'

type ViewType = 'all' | 'low_stock' | 'out_of_stock' | 'categories'

interface Product {
  id: string
  name: string
  category: string
  brand: string
  sku: string
  currentStock: number
  minStock: number
  maxStock: number
  unitCost: number
  unitPrice: number
  unit: string
  location: string
  supplier: string
  lastRestockDate: string
}

interface ProductListProps {
  view: ViewType
  selectedCategory: string
  onCategoryChange: (category: string) => void
}

export function ProductList({ view, selectedCategory, onCategoryChange }: ProductListProps) {
  const { tenant } = useUser()
  const [products, setProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    loadProducts()
  }, [tenant?.id])

  async function loadProducts() {
    if (!tenant?.id) return

    const supabase = createClient()
    setIsLoading(true)

    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('tenant_id', tenant.id)
        .eq('active', true)
        .order('name')

      if (error) throw error

      // Transformar datos de Supabase al formato del componente
      const productList: Product[] = (data || []).map((p: any) => ({
        id: p.id,
        name: p.name,
        category: p.category || 'General',
        brand: p.brand || '',
        sku: p.sku || '',
        currentStock: p.stock || 0,
        minStock: p.min_stock || 5,
        maxStock: p.max_stock || 50,
        unitCost: p.cost || 0,
        unitPrice: p.price || 0,
        unit: p.unit || 'unidad',
        location: p.location || '',
        supplier: p.supplier || '',
        lastRestockDate: p.last_restock_date || new Date().toISOString().split('T')[0]
      }))

      setProducts(productList)
    } catch (error) {
      console.error('Error loading products:', error)
    } finally {
      setIsLoading(false)
    }
  }

  // Categories
  const categories = ['all', ...Array.from(new Set(products.map(p => p.category)))]

  const filteredProducts = products.filter(product => {
    // Filter by view
    if (view === 'low_stock' && product.currentStock >= product.minStock) {
      return false
    }
    if (view === 'out_of_stock' && product.currentStock > 0) {
      return false
    }

    // Filter by category
    if (selectedCategory !== 'all' && product.category !== selectedCategory) {
      return false
    }

    // Filter by search
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      return (
        product.name.toLowerCase().includes(query) ||
        product.brand.toLowerCase().includes(query) ||
        product.sku.toLowerCase().includes(query)
      )
    }

    return true
  })

  const getStockStatus = (product: Product) => {
    if (product.currentStock === 0) {
      return {
        icon: XCircle,
        label: 'Agotado',
        className: 'bg-red-100 text-red-800',
        barColor: 'bg-red-500'
      }
    }
    if (product.currentStock < product.minStock) {
      return {
        icon: AlertTriangle,
        label: 'Stock bajo',
        className: 'bg-orange-100 text-orange-800',
        barColor: 'bg-orange-500'
      }
    }
    return {
      icon: CheckCircle,
      label: 'Stock OK',
      className: 'bg-green-100 text-green-800',
      barColor: 'bg-green-500'
    }
  }

  const getStockPercentage = (product: Product) => {
    return (product.currentStock / product.maxStock) * 100
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando inventario...</p>
        </div>
      </div>
    )
  }

  if (products.length === 0 && searchQuery === '' && view === 'all' && selectedCategory === 'all') {
    return (
      <div className="bg-white rounded-lg shadow-sm p-12 text-center">
        <Package className="h-16 w-16 text-gray-300 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          No hay productos en el inventario
        </h3>
        <p className="text-gray-600 mb-6">
          Añade tu primer producto para comenzar a gestionar el stock
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm p-4">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar por nombre, marca o SKU..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>

          {/* Category filter (only on categories view) */}
          {view === 'categories' && categories.length > 1 && (
            <div className="flex items-center gap-2">
              <Filter className="h-5 w-5 text-gray-400" />
              <select
                value={selectedCategory}
                onChange={(e) => onCategoryChange(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value="all">Todas las categorías</option>
                {categories.filter(c => c !== 'all').map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>
      </div>

      {/* Products grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProducts.length === 0 ? (
          <div className="col-span-full bg-white rounded-lg shadow-sm p-12 text-center">
            <Package className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              No hay productos
            </h3>
            <p className="text-gray-600">
              {searchQuery
                ? 'No se encontraron productos que coincidan con tu búsqueda'
                : 'No hay productos en esta vista'}
            </p>
          </div>
        ) : (
          filteredProducts.map((product) => {
            const status = getStockStatus(product)
            const StatusIcon = status.icon
            const stockPercentage = getStockPercentage(product)

            return (
              <div
                key={product.id}
                className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow"
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 mb-1">{product.name}</h3>
                    <p className="text-sm text-gray-600">{product.brand}</p>
                  </div>
                  <button className="p-2 text-gray-400 hover:bg-gray-100 rounded-lg transition-colors">
                    <MoreVertical className="h-4 w-4" />
                  </button>
                </div>

                {/* Status badge */}
                <div className="mb-4">
                  <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${status.className}`}>
                    <StatusIcon className="h-3 w-3" />
                    {status.label}
                  </span>
                </div>

                {/* Stock info */}
                <div className="mb-4">
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-600">Stock actual</span>
                    <span className="font-semibold text-gray-900">
                      {product.currentStock} {product.unit}
                    </span>
                  </div>
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${status.barColor}`}
                      style={{ width: `${Math.min(stockPercentage, 100)}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>Mín: {product.minStock}</span>
                    <span>Máx: {product.maxStock}</span>
                  </div>
                </div>

                {/* Details */}
                <div className="space-y-2 text-sm border-t border-gray-200 pt-4">
                  {product.sku && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">SKU:</span>
                      <span className="font-medium text-gray-900">{product.sku}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-gray-600">Categoría:</span>
                    <span className="font-medium text-gray-900">{product.category}</span>
                  </div>
                  {product.location && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Ubicación:</span>
                      <span className="font-medium text-gray-900">{product.location}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-gray-600">Coste:</span>
                    <span className="font-medium text-gray-900">€{product.unitCost.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">PVP:</span>
                    <span className="font-medium text-gray-900">€{product.unitPrice.toFixed(2)}</span>
                  </div>
                  {product.unitPrice > product.unitCost && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Margen:</span>
                      <span className="font-medium text-green-600">
                        {Math.round(((product.unitPrice - product.unitCost) / product.unitPrice) * 100)}%
                      </span>
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="flex gap-2 mt-4 pt-4 border-t border-gray-200">
                  <button className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-sm text-gray-700 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                    <Edit className="h-4 w-4" />
                    <span>Editar</span>
                  </button>
                  <button className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-sm text-purple-700 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors">
                    <Package className="h-4 w-4" />
                    <span>Ajustar</span>
                  </button>
                </div>
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}
