'use client'

import { useEffect, useState } from 'react'
import { Phone, Mail, Calendar, TrendingUp, AlertTriangle, XCircle, Check } from 'lucide-react'
import { useUser } from '@/hooks/useUser'
import { createClient } from '@/lib/supabase/client'
import type { Client, ClientRiskLevel } from '@/types'

interface ClientsTableProps {
  searchQuery: string
  riskFilter: ClientRiskLevel | 'all'
  onEditClient: (clientId: string) => void
}

export function ClientsTable({ searchQuery, riskFilter, onEditClient }: ClientsTableProps) {
  const { tenant } = useUser()
  const [clients, setClients] = useState<Client[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (!tenant?.schema_name) return
    loadClients()
  }, [tenant?.schema_name])

  const loadClients = async () => {
    if (!tenant?.schema_name) return
    setIsLoading(true)
    const supabase = createClient()

    try {
      const { data, error } = await supabase
        .schema(tenant.schema_name)
        .from('clients')
        .select('*')

      if (error) throw error

      const clientsWithRisk: Client[] = (data || []).map((c: any) => {
        let risk_level: ClientRiskLevel = 'active'
        const score = Number(c.churn_risk_score ?? 0)
        if (score > 0.75) {
          risk_level = 'lost'
        } else if (score > 0.5) {
          risk_level = 'at_risk'
        } else if (score > 0.25) {
          risk_level = 'warm'
        }
        return {
          id: c.id,
          first_name: c.first_name,
          last_name: c.last_name || undefined,
          phone: c.phone,
          email: c.email || undefined,
          birth_date: c.birth_date || undefined,
          gdpr_consent: c.gdpr_consent || false,
          gdpr_consent_date: c.gdpr_consent_date || undefined,
          marketing_consent: c.marketing_consent || false,
          whatsapp_opt_out: c.whatsapp_opt_out || false,
          visit_count: c.visit_count || 0,
          avg_visit_interval_days: c.avg_visit_interval_days ? Number(c.avg_visit_interval_days) : undefined,
          last_visit_date: c.last_visit_date || undefined,
          predicted_next_visit: c.predicted_next_visit || undefined,
          churn_risk_score: c.churn_risk_score ? Number(c.churn_risk_score) : undefined,
          risk_level,
          lifetime_value: Number(c.lifetime_value || 0),
          preferred_staff_id: c.preferred_staff_id || undefined,
          notes: c.notes || undefined,
          ai_notes: c.ai_notes || undefined,
          tags: c.tags || [],
          created_at: c.created_at,
          updated_at: c.updated_at,
        }
      })

      setClients(clientsWithRisk)
    } catch (error) {
      console.error('Error loading real clients:', error)
      setClients([])
    } finally {
      setIsLoading(false)
    }
  }

  const getRiskBadge = (riskLevel: ClientRiskLevel) => {
    switch (riskLevel) {
      case 'active':
        return {
          icon: Check,
          label: 'Activa',
          className: 'bg-green-100 text-green-800 border-green-200',
        }
      case 'warm':
        return {
          icon: TrendingUp,
          label: 'Tibia',
          className: 'bg-yellow-100 text-yellow-800 border-yellow-200',
        }
      case 'at_risk':
        return {
          icon: AlertTriangle,
          label: 'En riesgo',
          className: 'bg-orange-100 text-orange-800 border-orange-200',
        }
      case 'lost':
        return {
          icon: XCircle,
          label: 'Perdida',
          className: 'bg-red-100 text-red-800 border-red-200',
        }
    }
  }

  const filteredClients = clients
    .filter((client) => {
      // Risk filter
      if (riskFilter !== 'all' && client.risk_level !== riskFilter) {
        return false
      }

      // Search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase()
        const fullName = `${client.first_name} ${client.last_name}`.toLowerCase()
        const phone = client.phone.toLowerCase()
        const email = client.email?.toLowerCase() || ''

        return fullName.includes(query) || phone.includes(query) || email.includes(query)
      }

      return true
    })
    .sort((a, b) => {
      // Sort by risk score (higher risk first)
      return (b.churn_risk_score || 0) - (a.churn_risk_score || 0)
    })

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando clientas...</p>
        </div>
      </div>
    )
  }

  if (filteredClients.length === 0) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center max-w-md">
          <div className="text-6xl mb-4">👥</div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            {searchQuery || riskFilter !== 'all'
              ? 'No se encontraron clientas'
              : 'No hay clientas registradas'}
          </h3>
          <p className="text-gray-600">
            {searchQuery || riskFilter !== 'all'
              ? 'Intenta cambiar los filtros de búsqueda'
              : 'Añade tu primera clienta para empezar'}
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="h-full overflow-auto bg-white">
      <table className="w-full">
        <thead className="bg-gray-50 sticky top-0 z-10 border-b border-gray-200">
          <tr>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Clienta
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Contacto
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden lg:table-cell">
              Última visita
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden xl:table-cell">
              Visitas
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden xl:table-cell">
              Valor
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Estado
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {filteredClients.map((client) => {
            const riskBadge = getRiskBadge(client.risk_level!)
            const RiskIcon = riskBadge.icon
            const daysSinceLastVisit = client.last_visit_date
              ? Math.floor(
                  (Date.now() - new Date(client.last_visit_date).getTime()) / (1000 * 60 * 60 * 24)
                )
              : null

            return (
              <tr
                key={client.id}
                onClick={() => onEditClient(client.id)}
                className="hover:bg-gray-50 cursor-pointer transition-colors"
              >
                <td className="px-4 py-4">
                  <div className="flex items-center">
                    <div className="h-10 w-10 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 flex items-center justify-center text-white font-semibold flex-shrink-0">
                      {client.first_name.charAt(0)}
                      {client.last_name?.charAt(0)}
                    </div>
                    <div className="ml-3">
                      <div className="text-sm font-medium text-gray-900">
                        {client.first_name} {client.last_name}
                      </div>
                      {client.tags && client.tags.length > 0 && (
                        <div className="flex gap-1 mt-1">
                          {client.tags.map((tag) => (
                            <span
                              key={tag}
                              className="inline-block px-2 py-0.5 text-xs font-medium bg-purple-100 text-purple-700 rounded"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </td>
                <td className="px-4 py-4">
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Phone className="h-4 w-4" />
                      <span>{client.phone}</span>
                    </div>
                    {client.email && (
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Mail className="h-4 w-4" />
                        <span className="truncate max-w-[200px]">{client.email}</span>
                      </div>
                    )}
                  </div>
                </td>
                <td className="px-4 py-4 hidden lg:table-cell">
                  {client.last_visit_date ? (
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-gray-400" />
                      <div>
                        <div className="text-sm text-gray-900">
                          {new Date(client.last_visit_date).toLocaleDateString('es-ES', {
                            day: 'numeric',
                            month: 'short',
                          })}
                        </div>
                        <div className="text-xs text-gray-500">
                          Hace {daysSinceLastVisit} días
                        </div>
                      </div>
                    </div>
                  ) : (
                    <span className="text-sm text-gray-400">Sin visitas</span>
                  )}
                </td>
                <td className="px-4 py-4 hidden xl:table-cell">
                  <div className="text-sm text-gray-900">{client.visit_count}</div>
                  {client.avg_visit_interval_days && (
                    <div className="text-xs text-gray-500">
                      cada {client.avg_visit_interval_days} días
                    </div>
                  )}
                </td>
                <td className="px-4 py-4 hidden xl:table-cell">
                  <div className="text-sm font-medium text-gray-900">
                    {client.lifetime_value.toFixed(2)}€
                  </div>
                </td>
                <td className="px-4 py-4">
                  <span
                    className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border ${riskBadge.className}`}
                  >
                    <RiskIcon className="h-3.5 w-3.5" />
                    {riskBadge.label}
                  </span>
                  {client.churn_risk_score && client.churn_risk_score > 0.5 && (
                    <div className="text-xs text-gray-500 mt-1">
                      Riesgo: {Math.round(client.churn_risk_score * 100)}%
                    </div>
                  )}
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
