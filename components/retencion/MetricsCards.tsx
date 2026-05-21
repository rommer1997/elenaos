'use client'

import { useCallback, useEffect, useState } from 'react'
import {
  MessageCircle,
  TrendingUp,
  Target,
  DollarSign,
  CheckCircle,
  Clock,
  AlertTriangle,
  BarChart3
} from 'lucide-react'

interface Metrics {
  totalCampaigns: number
  sentCampaigns: number
  responseRate: number
  conversionRate: number
  averageRiskScore: number
}

export function MetricsCards() {
  const [metrics, setMetrics] = useState<Metrics | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [period, setPeriod] = useState(30)

  const loadMetrics = useCallback(async () => {
    setIsLoading(true)

    try {
      const response = await fetch(`/api/retention/metrics?days=${period}`)
      const data = await response.json()

      if (response.ok) {
        setMetrics(data.metrics)
      }
    } catch (error) {
      console.error('Error loading metrics:', error)
    } finally {
      setIsLoading(false)
    }
  }, [period])

  useEffect(() => {
    loadMetrics()
  }, [loadMetrics])

  // Mock data para demostración
  const fallbackMetrics = {
    totalCampaigns: metrics?.totalCampaigns ?? 45,
    sentCampaigns: metrics?.sentCampaigns ?? 42,
    responseRate: metrics?.responseRate ?? 0.62,
    conversionRate: metrics?.conversionRate ?? 0.38,
    averageRiskScore: metrics?.averageRiskScore ?? 0.58,
    clientsAtRisk: 18,
    pendingCampaigns: 6,
    estimatedRevenue: 2340
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando métricas...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Period selector */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Resumen de Retención</h2>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600">Período:</span>
          <select
            value={period}
            onChange={(e) => setPeriod(Number(e.target.value))}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          >
            <option value={7}>Últimos 7 días</option>
            <option value={30}>Últimos 30 días</option>
            <option value={90}>Últimos 90 días</option>
          </select>
        </div>
      </div>

      {/* Main metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total campaigns */}
        <div className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-purple-500">
          <div className="flex items-center justify-between mb-2">
            <div className="p-2 bg-purple-100 rounded-lg">
              <MessageCircle className="h-6 w-6 text-purple-600" />
            </div>
            <span className="text-xs font-medium text-gray-500 uppercase">Total Campañas</span>
          </div>
          <div className="text-3xl font-bold text-gray-900">{fallbackMetrics.totalCampaigns}</div>
          <div className="text-sm text-gray-600 mt-1">
            {fallbackMetrics.sentCampaigns} enviadas
          </div>
        </div>

        {/* Response rate */}
        <div className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-green-500">
          <div className="flex items-center justify-between mb-2">
            <div className="p-2 bg-green-100 rounded-lg">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
            <span className="text-xs font-medium text-gray-500 uppercase">Tasa Respuesta</span>
          </div>
          <div className="text-3xl font-bold text-gray-900">
            {Math.round(fallbackMetrics.responseRate * 100)}%
          </div>
          <div className="text-sm text-gray-600 mt-1">
            {Math.round(fallbackMetrics.sentCampaigns * fallbackMetrics.responseRate)} clientas respondieron
          </div>
        </div>

        {/* Conversion rate */}
        <div className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-blue-500">
          <div className="flex items-center justify-between mb-2">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Target className="h-6 w-6 text-blue-600" />
            </div>
            <span className="text-xs font-medium text-gray-500 uppercase">Tasa Conversión</span>
          </div>
          <div className="text-3xl font-bold text-gray-900">
            {Math.round(fallbackMetrics.conversionRate * 100)}%
          </div>
          <div className="text-sm text-gray-600 mt-1">
            {Math.round(fallbackMetrics.sentCampaigns * fallbackMetrics.conversionRate)} citas agendadas
          </div>
        </div>

        {/* Estimated revenue */}
        <div className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-yellow-500">
          <div className="flex items-center justify-between mb-2">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <DollarSign className="h-6 w-6 text-yellow-600" />
            </div>
            <span className="text-xs font-medium text-gray-500 uppercase">Ingresos Recuperados</span>
          </div>
          <div className="text-3xl font-bold text-gray-900">
            €{fallbackMetrics.estimatedRevenue.toLocaleString()}
          </div>
          <div className="text-sm text-gray-600 mt-1">
            ROI: {Math.round((fallbackMetrics.estimatedRevenue / (fallbackMetrics.sentCampaigns * 0.005)) / 100)}x
          </div>
        </div>
      </div>

      {/* Secondary metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Clients at risk */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-orange-100 rounded-lg">
              <AlertTriangle className="h-5 w-5 text-orange-600" />
            </div>
            <div>
              <div className="text-sm font-medium text-gray-600">Clientas en Riesgo</div>
              <div className="text-2xl font-bold text-gray-900">{fallbackMetrics.clientsAtRisk}</div>
            </div>
          </div>
          <div className="text-sm text-gray-600">
            Score promedio: {fallbackMetrics.averageRiskScore.toFixed(2)}
          </div>
        </div>

        {/* Pending campaigns */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Clock className="h-5 w-5 text-purple-600" />
            </div>
            <div>
              <div className="text-sm font-medium text-gray-600">Campañas Pendientes</div>
              <div className="text-2xl font-bold text-gray-900">{fallbackMetrics.pendingCampaigns}</div>
            </div>
          </div>
          <div className="text-sm text-gray-600">
            Programadas para próximas 24h
          </div>
        </div>

        {/* Success rate trend */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-green-100 rounded-lg">
              <TrendingUp className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <div className="text-sm font-medium text-gray-600">Tendencia</div>
              <div className="text-2xl font-bold text-green-600">+12%</div>
            </div>
          </div>
          <div className="text-sm text-gray-600">
            vs. período anterior
          </div>
        </div>
      </div>

      {/* Chart placeholder */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Evolución de Campañas (últimos {period} días)
        </h3>
        <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
          <div className="text-center text-gray-500">
            <BarChart3 className="h-12 w-12 mx-auto mb-2 opacity-50" />
            <p>Gráfica de tendencias</p>
            <p className="text-sm">(Implementar con Recharts o Chart.js)</p>
          </div>
        </div>
      </div>

      {/* Tips */}
      <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-6 border border-purple-200">
        <div className="flex items-start gap-3">
          <div className="p-2 bg-purple-100 rounded-lg">
            <TrendingUp className="h-5 w-5 text-purple-600" />
          </div>
          <div>
            <h4 className="font-semibold text-gray-900 mb-2">💡 Tips para mejorar retención</h4>
            <ul className="text-sm text-gray-700 space-y-1">
              <li>• Mantén una tasa de respuesta {'>'} 50% con mensajes personalizados</li>
              <li>• Contacta clientas de alto valor (LTV {'>'} €1000) en menos de 24h</li>
              <li>• Analiza patrones de visitas para predecir mejor las fechas óptimas</li>
              <li>• Ajusta horarios de envío según engagement histórico</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
