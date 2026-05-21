'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  AlertTriangle,
  TrendingDown,
  XCircle,
  MessageCircle,
  Calendar,
  Euro,
  ChevronRight,
  Filter
} from 'lucide-react'
import { SendMessageModal } from '@/components/whatsapp/SendMessageModal'

interface ClientAtRisk {
  id: string
  firstName: string
  lastName: string
  phone: string
  riskScore: number
  riskLevel: 'at_risk' | 'high_risk' | 'lost'
  daysSinceLastVisit: number
  avgVisitInterval: number
  lifetimeValue: number
  visitCount: number
  lastVisitDate: string
  predictedNextVisit: string
  campaignStatus?: 'pending' | 'sent' | 'none'
}

export function ClientsAtRisk() {
  const router = useRouter()
  const [filterRiskLevel, setFilterRiskLevel] = useState<string>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedClient, setSelectedClient] = useState<ClientAtRisk | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  // Mock data
  const mockClients: ClientAtRisk[] = [
    {
      id: '1',
      firstName: 'Ana',
      lastName: 'Martínez',
      phone: '+34666111111',
      riskScore: 0.78,
      riskLevel: 'high_risk',
      daysSinceLastVisit: 62,
      avgVisitInterval: 28,
      lifetimeValue: 1250,
      visitCount: 18,
      lastVisitDate: '2026-03-20',
      predictedNextVisit: '2026-04-17',
      campaignStatus: 'pending'
    },
    {
      id: '2',
      firstName: 'Carmen',
      lastName: 'López',
      phone: '+34666222222',
      riskScore: 0.65,
      riskLevel: 'at_risk',
      daysSinceLastVisit: 45,
      avgVisitInterval: 30,
      lifetimeValue: 890,
      visitCount: 12,
      lastVisitDate: '2026-04-05',
      predictedNextVisit: '2026-05-05',
      campaignStatus: 'sent'
    },
    {
      id: '3',
      firstName: 'Isabel',
      lastName: 'Fernández',
      phone: '+34666333333',
      riskScore: 0.89,
      riskLevel: 'lost',
      daysSinceLastVisit: 95,
      avgVisitInterval: 35,
      lifetimeValue: 560,
      visitCount: 8,
      lastVisitDate: '2026-02-15',
      predictedNextVisit: '2026-03-22',
      campaignStatus: 'none'
    },
    {
      id: '4',
      firstName: 'Laura',
      lastName: 'García',
      phone: '+34666444444',
      riskScore: 0.52,
      riskLevel: 'at_risk',
      daysSinceLastVisit: 38,
      avgVisitInterval: 25,
      lifetimeValue: 1450,
      visitCount: 24,
      lastVisitDate: '2026-04-12',
      predictedNextVisit: '2026-05-07',
      campaignStatus: 'none'
    },
    {
      id: '5',
      firstName: 'María',
      lastName: 'Rodríguez',
      phone: '+34666555555',
      riskScore: 0.71,
      riskLevel: 'high_risk',
      daysSinceLastVisit: 58,
      avgVisitInterval: 32,
      lifetimeValue: 780,
      visitCount: 10,
      lastVisitDate: '2026-03-23',
      predictedNextVisit: '2026-04-24',
      campaignStatus: 'pending'
    }
  ]

  const filteredClients = mockClients
    .filter(client => {
      if (filterRiskLevel !== 'all' && client.riskLevel !== filterRiskLevel) {
        return false
      }
      if (searchQuery) {
        const query = searchQuery.toLowerCase()
        return (
          client.firstName.toLowerCase().includes(query) ||
          client.lastName.toLowerCase().includes(query)
        )
      }
      return true
    })
    .sort((a, b) => b.riskScore - a.riskScore)

  const getRiskBadge = (riskLevel: string) => {
    switch (riskLevel) {
      case 'at_risk':
        return {
          icon: AlertTriangle,
          label: 'En Riesgo',
          className: 'bg-orange-100 text-orange-800 border-orange-200'
        }
      case 'high_risk':
        return {
          icon: TrendingDown,
          label: 'Alto Riesgo',
          className: 'bg-red-100 text-red-800 border-red-200'
        }
      case 'lost':
        return {
          icon: XCircle,
          label: 'Perdida',
          className: 'bg-gray-100 text-gray-800 border-gray-200'
        }
      default:
        return {
          icon: AlertTriangle,
          label: 'Desconocido',
          className: 'bg-gray-100 text-gray-800 border-gray-200'
        }
    }
  }

  const getCampaignStatusBadge = (status?: string) => {
    switch (status) {
      case 'pending':
        return { label: 'Programada', className: 'bg-blue-100 text-blue-800' }
      case 'sent':
        return { label: 'Enviada', className: 'bg-green-100 text-green-800' }
      default:
        return { label: 'Sin campaña', className: 'bg-gray-100 text-gray-600' }
    }
  }

  const openSendModal = (client: ClientAtRisk) => {
    setSelectedClient(client)
    setIsModalOpen(true)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Clientas en Riesgo</h2>
          <p className="text-gray-600 mt-1">
            {filteredClients.length} clientas requieren atención
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm p-4">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <input
              type="text"
              placeholder="Buscar por nombre..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>

          {/* Risk level filter */}
          <div className="flex items-center gap-2">
            <Filter className="h-5 w-5 text-gray-400" />
            <select
              value={filterRiskLevel}
              onChange={(e) => setFilterRiskLevel(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value="all">Todos los niveles</option>
              <option value="at_risk">En Riesgo</option>
              <option value="high_risk">Alto Riesgo</option>
              <option value="lost">Perdidas</option>
            </select>
          </div>
        </div>
      </div>

      {/* Clients list */}
      <div className="space-y-4">
        {filteredClients.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <div className="text-gray-400 mb-4">
              <AlertTriangle className="h-16 w-16 mx-auto" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              No hay clientas en riesgo
            </h3>
            <p className="text-gray-600">
              {searchQuery
                ? 'No se encontraron resultados para tu búsqueda'
                : '¡Excelente! Todas tus clientas están activas'}
            </p>
          </div>
        ) : (
          filteredClients.map((client) => {
            const riskBadge = getRiskBadge(client.riskLevel)
            const RiskIcon = riskBadge.icon
            const campaignBadge = getCampaignStatusBadge(client.campaignStatus)

            return (
              <div
                key={client.id}
                className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between">
                  {/* Client info */}
                  <div className="flex items-start gap-4 flex-1">
                    {/* Avatar */}
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center text-white font-semibold text-lg flex-shrink-0">
                      {client.firstName[0]}{client.lastName[0]}
                    </div>

                    {/* Details */}
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">
                          {client.firstName} {client.lastName}
                        </h3>
                        <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border ${riskBadge.className}`}>
                          <RiskIcon className="h-3 w-3" />
                          {riskBadge.label}
                        </span>
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${campaignBadge.className}`}>
                          {campaignBadge.label}
                        </span>
                      </div>

                      {/* Risk score bar */}
                      <div className="mb-3">
                        <div className="flex items-center justify-between text-xs text-gray-600 mb-1">
                          <span>Score de riesgo</span>
                          <span className="font-medium">{Math.round(client.riskScore * 100)}%</span>
                        </div>
                        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full ${
                              client.riskScore >= 0.7
                                ? 'bg-red-500'
                                : client.riskScore >= 0.4
                                ? 'bg-orange-500'
                                : 'bg-green-500'
                            }`}
                            style={{ width: `${client.riskScore * 100}%` }}
                          />
                        </div>
                      </div>

                      {/* Stats */}
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <div className="text-gray-600 mb-1">Última visita</div>
                          <div className="font-semibold text-gray-900">
                            Hace {client.daysSinceLastVisit} días
                          </div>
                          <div className="text-xs text-gray-500">
                            (su frecuencia: {client.avgVisitInterval} días)
                          </div>
                        </div>

                        <div>
                          <div className="text-gray-600 mb-1">Total visitas</div>
                          <div className="font-semibold text-gray-900">
                            {client.visitCount} visitas
                          </div>
                        </div>

                        <div>
                          <div className="text-gray-600 mb-1">Valor total</div>
                          <div className="font-semibold text-gray-900 flex items-center gap-1">
                            <Euro className="h-4 w-4" />
                            {client.lifetimeValue.toLocaleString()}
                          </div>
                        </div>

                        <div>
                          <div className="text-gray-600 mb-1">Predicción</div>
                          <div className="font-semibold text-gray-900">
                            {new Date(client.predictedNextVisit).toLocaleDateString('es-ES', {
                              day: 'numeric',
                              month: 'short'
                            })}
                          </div>
                          <div className="text-xs text-gray-500">Próxima visita esperada</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col gap-2 ml-4">
                    <button
                      onClick={() => openSendModal(client)}
                      className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium whitespace-nowrap"
                    >
                      <MessageCircle className="h-4 w-4" />
                      <span>Enviar WhatsApp</span>
                    </button>

                    <button
                      onClick={() => router.push(`/clientes/${client.id}`)}
                      className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium whitespace-nowrap"
                    >
                      <span>Ver ficha</span>
                      <ChevronRight className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            )
          })
        )}
      </div>

      {/* Send message modal */}
      {selectedClient && (
        <SendMessageModal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false)
            setSelectedClient(null)
          }}
          clientId={selectedClient.id}
          clientName={`${selectedClient.firstName} ${selectedClient.lastName}`}
          clientPhone={selectedClient.phone}
        />
      )}
    </div>
  )
}
