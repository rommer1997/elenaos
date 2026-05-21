'use client'

import { useState } from 'react'
import {
  Clock,
  CheckCircle,
  XCircle,
  MessageCircle,
  Calendar,
  Filter,
  Search,
  Eye,
  TrendingUp
} from 'lucide-react'

interface CampaignHistoryItem {
  id: string
  clientId: string
  clientName: string
  phone: string
  scheduledDate: string
  sentAt?: string
  status: 'pending' | 'sent' | 'failed' | 'cancelled'
  riskScore: number
  riskLevel: 'at_risk' | 'high_risk' | 'lost'
  message: string
  responseReceived: boolean
  responseAt?: string
  convertedToAppointment: boolean
}

export function CampaignHistory() {
  const [filterStatus, setFilterStatus] = useState<string>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCampaign, setSelectedCampaign] = useState<CampaignHistoryItem | null>(null)

  // Mock data
  const mockHistory: CampaignHistoryItem[] = [
    {
      id: '1',
      clientId: 'c1',
      clientName: 'Carmen López',
      phone: '+34666222222',
      scheduledDate: '2026-05-19T11:00:00Z',
      sentAt: '2026-05-19T11:00:15Z',
      status: 'sent',
      riskScore: 0.65,
      riskLevel: 'at_risk',
      message: 'Hola Carmen! 👋\n\n¡Te echamos de menos! Hace tiempo que no vienes por tu manicura favorita...',
      responseReceived: true,
      responseAt: '2026-05-19T14:30:00Z',
      convertedToAppointment: true
    },
    {
      id: '2',
      clientId: 'c2',
      clientName: 'Ana Martínez',
      phone: '+34666111111',
      scheduledDate: '2026-05-18T17:00:00Z',
      sentAt: '2026-05-18T17:00:08Z',
      status: 'sent',
      riskScore: 0.78,
      riskLevel: 'high_risk',
      message: 'Hola Ana! ¡Cuánto tiempo! Te echamos de menos por aquí. ¿Qué te parece si reservamos una cita?',
      responseReceived: false,
      convertedToAppointment: false
    },
    {
      id: '3',
      clientId: 'c3',
      clientName: 'Isabel Fernández',
      phone: '+34666333333',
      scheduledDate: '2026-05-17T11:00:00Z',
      sentAt: '2026-05-17T11:00:12Z',
      status: 'failed',
      riskScore: 0.89,
      riskLevel: 'lost',
      message: 'Hola Isabel! Hace mucho que no sabemos de ti...',
      responseReceived: false,
      convertedToAppointment: false
    },
    {
      id: '4',
      clientId: 'c4',
      clientName: 'Laura García',
      phone: '+34666444444',
      scheduledDate: '2026-05-16T11:00:00Z',
      sentAt: '2026-05-16T11:00:05Z',
      status: 'sent',
      riskScore: 0.52,
      riskLevel: 'at_risk',
      message: 'Hola Laura! 💅 Tenemos nuevos tratamientos que te van a encantar...',
      responseReceived: true,
      responseAt: '2026-05-16T18:45:00Z',
      convertedToAppointment: false
    },
    {
      id: '5',
      clientId: 'c5',
      clientName: 'María Rodríguez',
      phone: '+34666555555',
      scheduledDate: '2026-05-21T11:00:00Z',
      status: 'pending',
      riskScore: 0.71,
      riskLevel: 'high_risk',
      message: 'Hola María! ¿Qué tal todo? Te echamos de menos...',
      responseReceived: false,
      convertedToAppointment: false
    }
  ]

  const filteredHistory = mockHistory
    .filter(item => {
      if (filterStatus !== 'all' && item.status !== filterStatus) {
        return false
      }
      if (searchQuery) {
        const query = searchQuery.toLowerCase()
        return item.clientName.toLowerCase().includes(query)
      }
      return true
    })
    .sort((a, b) => new Date(b.scheduledDate).getTime() - new Date(a.scheduledDate).getTime())

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return {
          icon: Clock,
          label: 'Pendiente',
          className: 'bg-blue-100 text-blue-800'
        }
      case 'sent':
        return {
          icon: CheckCircle,
          label: 'Enviada',
          className: 'bg-green-100 text-green-800'
        }
      case 'failed':
        return {
          icon: XCircle,
          label: 'Fallida',
          className: 'bg-red-100 text-red-800'
        }
      case 'cancelled':
        return {
          icon: XCircle,
          label: 'Cancelada',
          className: 'bg-gray-100 text-gray-800'
        }
      default:
        return {
          icon: Clock,
          label: 'Desconocido',
          className: 'bg-gray-100 text-gray-800'
        }
    }
  }

  const stats = {
    total: mockHistory.length,
    sent: mockHistory.filter(h => h.status === 'sent').length,
    responseRate: mockHistory.filter(h => h.responseReceived).length / mockHistory.filter(h => h.status === 'sent').length,
    conversionRate: mockHistory.filter(h => h.convertedToAppointment).length / mockHistory.filter(h => h.responseReceived).length
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Historial de Campañas</h2>
          <p className="text-gray-600 mt-1">
            {filteredHistory.length} campañas registradas
          </p>
        </div>
      </div>

      {/* Stats summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow-sm p-4">
          <div className="text-sm text-gray-600 mb-1">Total Campañas</div>
          <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-4">
          <div className="text-sm text-gray-600 mb-1">Enviadas</div>
          <div className="text-2xl font-bold text-green-600">{stats.sent}</div>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-4">
          <div className="text-sm text-gray-600 mb-1">Tasa Respuesta</div>
          <div className="text-2xl font-bold text-blue-600">
            {Math.round(stats.responseRate * 100)}%
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-4">
          <div className="text-sm text-gray-600 mb-1">Tasa Conversión</div>
          <div className="text-2xl font-bold text-purple-600">
            {Math.round(stats.conversionRate * 100)}%
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm p-4">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar por nombre de clienta..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>

          {/* Status filter */}
          <div className="flex items-center gap-2">
            <Filter className="h-5 w-5 text-gray-400" />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value="all">Todos los estados</option>
              <option value="pending">Pendientes</option>
              <option value="sent">Enviadas</option>
              <option value="failed">Fallidas</option>
              <option value="cancelled">Canceladas</option>
            </select>
          </div>
        </div>
      </div>

      {/* History list */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        {filteredHistory.length === 0 ? (
          <div className="p-12 text-center">
            <MessageCircle className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              No hay campañas
            </h3>
            <p className="text-gray-600">
              {searchQuery
                ? 'No se encontraron resultados para tu búsqueda'
                : 'Aún no se han enviado campañas de retención'}
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {filteredHistory.map((campaign) => {
              const statusBadge = getStatusBadge(campaign.status)
              const StatusIcon = statusBadge.icon

              return (
                <div
                  key={campaign.id}
                  className="p-6 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    {/* Main info */}
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">
                          {campaign.clientName}
                        </h3>
                        <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${statusBadge.className}`}>
                          <StatusIcon className="h-3 w-3" />
                          {statusBadge.label}
                        </span>

                        {campaign.responseReceived && (
                          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            <MessageCircle className="h-3 w-3" />
                            Respondió
                          </span>
                        )}

                        {campaign.convertedToAppointment && (
                          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            <TrendingUp className="h-3 w-3" />
                            Cita agendada
                          </span>
                        )}
                      </div>

                      {/* Dates */}
                      <div className="flex items-center gap-6 text-sm text-gray-600 mb-3">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          <span>
                            Programada:{' '}
                            {new Date(campaign.scheduledDate).toLocaleString('es-ES', {
                              day: 'numeric',
                              month: 'short',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </span>
                        </div>

                        {campaign.sentAt && (
                          <div className="flex items-center gap-1">
                            <CheckCircle className="h-4 w-4" />
                            <span>
                              Enviada:{' '}
                              {new Date(campaign.sentAt).toLocaleString('es-ES', {
                                day: 'numeric',
                                month: 'short',
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </span>
                          </div>
                        )}

                        {campaign.responseAt && (
                          <div className="flex items-center gap-1">
                            <MessageCircle className="h-4 w-4" />
                            <span>
                              Respondió:{' '}
                              {new Date(campaign.responseAt).toLocaleString('es-ES', {
                                day: 'numeric',
                                month: 'short',
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Message preview */}
                      <div className="bg-gray-50 rounded-lg p-3 text-sm text-gray-700 mb-3">
                        <div className="font-medium text-gray-900 mb-1">Mensaje enviado:</div>
                        <div className="line-clamp-2">{campaign.message}</div>
                      </div>

                      {/* Risk info */}
                      <div className="flex items-center gap-4 text-sm">
                        <div>
                          <span className="text-gray-600">Score de riesgo:</span>
                          <span className="ml-2 font-semibold text-gray-900">
                            {Math.round(campaign.riskScore * 100)}%
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-600">Teléfono:</span>
                          <span className="ml-2 font-medium text-gray-900">{campaign.phone}</span>
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <button
                      onClick={() => setSelectedCampaign(campaign)}
                      className="ml-4 flex items-center gap-2 px-4 py-2 text-sm text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                    >
                      <Eye className="h-4 w-4" />
                      <span>Ver detalles</span>
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Campaign detail modal */}
      {selectedCampaign && (
        <>
          <div
            className="fixed inset-0 bg-black/50 z-50"
            onClick={() => setSelectedCampaign(null)}
          />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
            <div
              className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto pointer-events-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  Detalles de la Campaña
                </h3>

                <div className="space-y-4">
                  <div>
                    <div className="text-sm font-medium text-gray-600 mb-1">Clienta</div>
                    <div className="text-lg font-semibold text-gray-900">
                      {selectedCampaign.clientName}
                    </div>
                  </div>

                  <div>
                    <div className="text-sm font-medium text-gray-600 mb-1">Mensaje completo</div>
                    <div className="bg-green-50 rounded-lg p-4 text-sm text-gray-900 whitespace-pre-wrap border border-green-200">
                      {selectedCampaign.message}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="text-sm font-medium text-gray-600 mb-1">Estado</div>
                      <div className="text-gray-900">{getStatusBadge(selectedCampaign.status).label}</div>
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-600 mb-1">Score de riesgo</div>
                      <div className="text-gray-900">{Math.round(selectedCampaign.riskScore * 100)}%</div>
                    </div>
                  </div>

                  {selectedCampaign.responseReceived && (
                    <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                      <div className="font-medium text-blue-900 mb-2">✅ Clienta respondió</div>
                      <div className="text-sm text-blue-800">
                        Respondió el{' '}
                        {selectedCampaign.responseAt &&
                          new Date(selectedCampaign.responseAt).toLocaleString('es-ES')}
                      </div>
                      {selectedCampaign.convertedToAppointment && (
                        <div className="text-sm text-green-700 font-medium mt-2">
                          🎉 Se agendó una cita
                        </div>
                      )}
                    </div>
                  )}
                </div>

                <div className="mt-6 flex justify-end">
                  <button
                    onClick={() => setSelectedCampaign(null)}
                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    Cerrar
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
