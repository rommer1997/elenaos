'use client'

import { useState } from 'react'
import { Search, Plus, Filter, Download, TrendingUp, TrendingDown, AlertCircle } from 'lucide-react'
import { ClientsTable } from '@/components/clientes/ClientsTable'
import { ClientModal } from '@/components/clientes/ClientModal'
import type { ClientRiskLevel } from '@/types'

export default function ClientesPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [riskFilter, setRiskFilter] = useState<ClientRiskLevel | 'all'>('all')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedClientId, setSelectedClientId] = useState<string | null>(null)

  const handleCreateClient = () => {
    setSelectedClientId(null)
    setIsModalOpen(true)
  }

  const handleEditClient = (clientId: string) => {
    setSelectedClientId(clientId)
    setIsModalOpen(true)
  }

  // Stats mock
  const stats = [
    {
      label: 'Total clientas',
      value: '248',
      icon: TrendingUp,
      color: 'text-blue-600',
      bg: 'bg-blue-100',
    },
    {
      label: 'Activas',
      value: '186',
      percentage: '75%',
      icon: TrendingUp,
      color: 'text-green-600',
      bg: 'bg-green-100',
    },
    {
      label: 'En riesgo',
      value: '42',
      percentage: '17%',
      icon: AlertCircle,
      color: 'text-orange-600',
      bg: 'bg-orange-100',
    },
    {
      label: 'Perdidas',
      value: '20',
      percentage: '8%',
      icon: TrendingDown,
      color: 'text-red-600',
      bg: 'bg-red-100',
    },
  ]

  return (
    <div className="h-[calc(100vh-4rem)] flex flex-col bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-4">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold text-gray-900">Clientas</h1>
          <div className="flex items-center gap-2">
            <button
              className="flex items-center gap-2 px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Download className="h-4 w-4" />
              <span className="hidden sm:inline">Exportar</span>
            </button>
            <button
              onClick={handleCreateClient}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-medium hover:opacity-90 transition-opacity"
            >
              <Plus className="h-5 w-5" />
              <span className="hidden sm:inline">Nueva clienta</span>
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
          {stats.map((stat) => {
            const Icon = stat.icon
            return (
              <div key={stat.label} className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-medium text-gray-600 uppercase">
                    {stat.label}
                  </span>
                  <div className={`p-2 rounded-lg ${stat.bg}`}>
                    <Icon className={`h-4 w-4 ${stat.color}`} />
                  </div>
                </div>
                <div className="flex items-end gap-2">
                  <span className="text-2xl font-bold text-gray-900">{stat.value}</span>
                  {stat.percentage && (
                    <span className="text-sm text-gray-500 mb-1">{stat.percentage}</span>
                  )}
                </div>
              </div>
            )
          })}
        </div>

        {/* Search and filters */}
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar por nombre, teléfono o email..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>

          {/* Risk filter */}
          <div className="flex items-center gap-2">
            <Filter className="h-5 w-5 text-gray-500" />
            <select
              value={riskFilter}
              onChange={(e) => setRiskFilter(e.target.value as ClientRiskLevel | 'all')}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white"
            >
              <option value="all">Todas</option>
              <option value="active">✅ Activas</option>
              <option value="warm">🟡 Tibias</option>
              <option value="at_risk">🟠 En riesgo</option>
              <option value="lost">🔴 Perdidas</option>
            </select>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="flex-1 overflow-hidden">
        <ClientsTable
          searchQuery={searchQuery}
          riskFilter={riskFilter}
          onEditClient={handleEditClient}
        />
      </div>

      {/* Client Modal */}
      <ClientModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        clientId={selectedClientId}
      />
    </div>
  )
}
