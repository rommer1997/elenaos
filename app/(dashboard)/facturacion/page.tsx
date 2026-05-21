'use client'

import { useState, useEffect } from 'react'
import {
  FileText,
  Plus,
  Filter,
  Download,
  Send,
  CheckCircle,
  XCircle,
  Clock,
  Euro,
  TrendingUp,
  Calendar
} from 'lucide-react'
import { InvoiceList } from '@/components/facturacion/InvoiceList'
import { InvoiceModal } from '@/components/facturacion/InvoiceModal'
import { InvoiceStats } from '@/components/facturacion/InvoiceStats'

type ViewType = 'all' | 'draft' | 'sent' | 'paid' | 'overdue'

export default function FacturacionPage() {
  const [activeView, setActiveView] = useState<ViewType>('all')
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [selectedPeriod, setSelectedPeriod] = useState('month')

  const views = [
    { id: 'all' as ViewType, label: 'Todas', icon: FileText },
    { id: 'draft' as ViewType, label: 'Borradores', icon: Clock },
    { id: 'sent' as ViewType, label: 'Enviadas', icon: Send },
    { id: 'paid' as ViewType, label: 'Pagadas', icon: CheckCircle },
    { id: 'overdue' as ViewType, label: 'Vencidas', icon: XCircle },
  ]

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Facturación</h1>
              <p className="text-gray-600 mt-1">
                Gestión de facturas con VeriFactu (AEAT)
              </p>
            </div>
            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="flex items-center gap-2 px-6 py-3 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition-colors shadow-lg"
            >
              <Plus className="h-5 w-5" />
              <span>Nueva Factura</span>
            </button>
          </div>

          {/* Stats */}
          <InvoiceStats period={selectedPeriod} onPeriodChange={setSelectedPeriod} />
        </div>
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
        <InvoiceList view={activeView} />
      </div>

      {/* Create invoice modal */}
      <InvoiceModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />
    </div>
  )
}
