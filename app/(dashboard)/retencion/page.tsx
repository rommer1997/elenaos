'use client'

import { useState, useEffect } from 'react'
import {
  TrendingUp,
  Users,
  MessageCircle,
  Target,
  Calendar,
  AlertTriangle,
  CheckCircle,
  XCircle,
  RefreshCw,
  Settings,
  BarChart3
} from 'lucide-react'
import { MetricsCards } from '@/components/retencion/MetricsCards'
import { ClientsAtRisk } from '@/components/retencion/ClientsAtRisk'
import { CampaignCalendar } from '@/components/retencion/CampaignCalendar'
import { CampaignHistory } from '@/components/retencion/CampaignHistory'
import { RetentionSettings } from '@/components/retencion/RetentionSettings'

type TabType = 'dashboard' | 'clients' | 'calendar' | 'history' | 'settings'

export default function RetencionPage() {
  const [activeTab, setActiveTab] = useState<TabType>('dashboard')
  const [isRunningAnalysis, setIsRunningAnalysis] = useState(false)

  const runAnalysis = async () => {
    setIsRunningAnalysis(true)

    try {
      const response = await fetch('/api/retention/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Error ejecutando análisis')
      }

      alert(
        `✅ Análisis completado:\n\n` +
        `• ${data.result.totalDetected} clientas detectadas en riesgo\n` +
        `• ${data.result.campaignsCreated} campañas creadas\n` +
        `• ${data.result.highPriority} de alta prioridad\n` +
        `• ${data.result.mediumPriority} de prioridad media`
      )

      // Recargar datos
      window.location.reload()
    } catch (error) {
      console.error('Error:', error)
      alert('❌ Error ejecutando análisis: ' + (error instanceof Error ? error.message : 'Error desconocido'))
    } finally {
      setIsRunningAnalysis(false)
    }
  }

  const tabs = [
    { id: 'dashboard' as TabType, label: 'Dashboard', icon: BarChart3 },
    { id: 'clients' as TabType, label: 'Clientas en Riesgo', icon: AlertTriangle },
    { id: 'calendar' as TabType, label: 'Calendario', icon: Calendar },
    { id: 'history' as TabType, label: 'Historial', icon: MessageCircle },
    { id: 'settings' as TabType, label: 'Configuración', icon: Settings },
  ]

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">Retención con IA</h1>
              <p className="text-purple-100">
                Sistema automático de detección y recuperación de clientas
              </p>
            </div>
            <button
              onClick={runAnalysis}
              disabled={isRunningAnalysis}
              className="flex items-center gap-2 px-6 py-3 bg-white text-purple-600 rounded-lg font-medium hover:bg-purple-50 transition-colors disabled:opacity-50 shadow-lg"
            >
              <RefreshCw className={`h-5 w-5 ${isRunningAnalysis ? 'animate-spin' : ''}`} />
              <span>{isRunningAnalysis ? 'Analizando...' : 'Ejecutar Análisis'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4">
          <nav className="flex gap-6 overflow-x-auto">
            {tabs.map((tab) => {
              const Icon = tab.icon
              const isActive = activeTab === tab.id

              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-4 border-b-2 font-medium transition-colors whitespace-nowrap ${
                    isActive
                      ? 'border-purple-600 text-purple-600'
                      : 'border-transparent text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  <span>{tab.label}</span>
                </button>
              )
            })}
          </nav>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        {activeTab === 'dashboard' && <MetricsCards />}
        {activeTab === 'clients' && <ClientsAtRisk />}
        {activeTab === 'calendar' && <CampaignCalendar />}
        {activeTab === 'history' && <CampaignHistory />}
        {activeTab === 'settings' && <RetentionSettings />}
      </div>
    </div>
  )
}
