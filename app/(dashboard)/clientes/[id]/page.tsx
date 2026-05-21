'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import {
  ArrowLeft,
  Mail,
  Phone,
  Calendar,
  TrendingUp,
  AlertTriangle,
  Sparkles,
  Edit,
  MessageCircle
} from 'lucide-react'
import { ClientHeader } from '@/components/clientes/detail/ClientHeader'
import { RiskScore } from '@/components/clientes/detail/RiskScore'
import { ClientStats } from '@/components/clientes/detail/ClientStats'
import { VisitHistory } from '@/components/clientes/detail/VisitHistory'
import { AIInsights } from '@/components/clientes/detail/AIInsights'
import { Timeline } from '@/components/clientes/detail/Timeline'
import { SendMessageModal } from '@/components/whatsapp/SendMessageModal'
import type { Client } from '@/types'

export default function ClientDetailPage() {
  const params = useParams()
  const router = useRouter()
  const clientId = params.id as string

  const [client, setClient] = useState<Client | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isWhatsAppModalOpen, setIsWhatsAppModalOpen] = useState(false)

  useEffect(() => {
    loadClient()
  }, [clientId])

  const loadClient = async () => {
    setIsLoading(true)

    // TODO: Implementar query real a Supabase
    // Mock data
    const mockClient: Client = {
      id: clientId,
      first_name: 'Carmen',
      last_name: 'López García',
      phone: '+34 666 123 456',
      email: 'carmen.lopez@email.com',
      birth_date: '1985-03-15',
      gdpr_consent: true,
      gdpr_consent_date: '2024-01-10',
      marketing_consent: true,
      whatsapp_opt_out: false,
      visit_count: 24,
      avg_visit_interval_days: 28,
      last_visit_date: '2026-05-15',
      predicted_next_visit: '2026-06-12',
      churn_risk_score: 0.15,
      risk_level: 'active',
      lifetime_value: 1450.50,
      preferred_staff_id: 'staff-1',
      notes: 'Prefiere citas por la tarde. Le gusta mucho el tratamiento facial con vitamina C.',
      ai_notes: 'Cliente muy fiel y satisfecha. Viene regularmente cada 28 días. Responde bien a recordatorios por WhatsApp. Recomienda activamente el salón a amigas.',
      tags: ['vip', 'regular'],
      created_at: '2024-01-10T10:00:00Z',
      updated_at: '2026-05-15T18:30:00Z',
    }

    setClient(mockClient)
    setIsLoading(false)
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-4rem)]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando información...</p>
        </div>
      </div>
    )
  }

  if (!client) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-4rem)]">
        <div className="text-center">
          <div className="text-6xl mb-4">😕</div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Clienta no encontrada
          </h3>
          <button
            onClick={() => router.push('/dashboard/clientes')}
            className="mt-4 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            Volver a la lista
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <button
            onClick={() => router.push('/dashboard/clientes')}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4 transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
            <span>Volver a clientas</span>
          </button>

          <ClientHeader client={client} />
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left column - Main info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Risk Score */}
            <RiskScore client={client} />

            {/* Stats */}
            <ClientStats client={client} />

            {/* AI Insights */}
            <AIInsights client={client} />

            {/* Visit History */}
            <VisitHistory clientId={client.id} />
          </div>

          {/* Right column - Sidebar */}
          <div className="space-y-6">
            {/* Contact info */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Información de contacto
              </h3>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <Phone className="h-5 w-5 text-gray-400 mt-0.5" />
                  <div>
                    <div className="text-sm font-medium text-gray-900">{client.phone}</div>
                    <div className="text-xs text-gray-500">Teléfono principal</div>
                  </div>
                </div>
                {client.email && (
                  <div className="flex items-start gap-3">
                    <Mail className="h-5 w-5 text-gray-400 mt-0.5" />
                    <div>
                      <div className="text-sm font-medium text-gray-900">{client.email}</div>
                      <div className="text-xs text-gray-500">Email</div>
                    </div>
                  </div>
                )}
                {client.birth_date && (
                  <div className="flex items-start gap-3">
                    <Calendar className="h-5 w-5 text-gray-400 mt-0.5" />
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {new Date(client.birth_date).toLocaleDateString('es-ES', {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric',
                        })}
                      </div>
                      <div className="text-xs text-gray-500">
                        {Math.floor(
                          (Date.now() - new Date(client.birth_date).getTime()) /
                            (365.25 * 24 * 60 * 60 * 1000)
                        )}{' '}
                        años
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="mt-6 pt-6 border-t border-gray-200">
                <button
                  onClick={() => setIsWhatsAppModalOpen(true)}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  <MessageCircle className="h-5 w-5" />
                  <span>Enviar WhatsApp</span>
                </button>
              </div>
            </div>

            {/* Quick actions */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Acciones rápidas</h3>
              <div className="space-y-2">
                <button className="w-full flex items-center gap-2 px-4 py-2 text-gray-700 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <Calendar className="h-5 w-5" />
                  <span>Nueva cita</span>
                </button>
                <button className="w-full flex items-center gap-2 px-4 py-2 text-gray-700 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <Edit className="h-5 w-5" />
                  <span>Editar información</span>
                </button>
                <button className="w-full flex items-center gap-2 px-4 py-2 text-gray-700 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <Sparkles className="h-5 w-5" />
                  <span>Generar mensaje IA</span>
                </button>
              </div>
            </div>

            {/* Timeline */}
            <Timeline clientId={client.id} />

            {/* Notes */}
            {client.notes && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Notas</h3>
                <p className="text-sm text-gray-700 whitespace-pre-wrap">{client.notes}</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* WhatsApp Modal */}
      {client && (
        <SendMessageModal
          isOpen={isWhatsAppModalOpen}
          onClose={() => setIsWhatsAppModalOpen(false)}
          clientId={client.id}
          clientName={`${client.first_name} ${client.last_name}`}
          clientPhone={client.phone}
        />
      )}
    </div>
  )
}
