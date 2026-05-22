'use client'

import { useEffect, useState } from 'react'
import { Calendar, Euro, AlertTriangle, MessageSquare, TrendingUp, TrendingDown } from 'lucide-react'
import { useUser } from '@/hooks/useUser'
import { createClient } from '@/lib/supabase/client'

export function DailyMetrics() {
  const { tenant } = useUser()
  const [isLoading, setIsLoading] = useState(true)
  const [metrics, setMetrics] = useState({
    appointments: {
      confirmed: 0,
      pending: 0,
      completed: 0,
      total: 0,
      changePercent: 0
    },
    revenue: {
      estimated: 0,
      actual: 0,
      target: 500,
      changePercent: 0
    },
    alerts: {
      clientsAtRisk: 0,
      highPriority: 0,
      changePercent: 0
    },
    messages: {
      pending: 0,
      sent: 0,
      responded: 0,
      changePercent: 0
    }
  })

  useEffect(() => {
    if (!tenant?.schema_name) return
    loadMetrics()
  }, [tenant?.schema_name])

  const loadMetrics = async () => {
    if (!tenant?.schema_name) return
    setIsLoading(true)
    const supabase = createClient()
    try {
      const todayStr = new Date().toISOString().split('T')[0]
      
      const { data: appts, error: apptsError } = await supabase
        .schema(tenant.schema_name)
        .from('appointments')
        .select('*')
        .gte('start_time', `${todayStr}T00:00:00`)
        .lte('start_time', `${todayStr}T23:59:59`)

      const { data: clientAlerts } = await supabase
        .schema(tenant.schema_name)
        .from('clients')
        .select('id, risk_level')
        .in('risk_level', ['warm', 'at_risk'])

      const { data: invoices } = await supabase
        .schema(tenant.schema_name)
        .from('invoices')
        .select('*')
        .eq('issue_date', todayStr)

      let totalAppts = 0
      let confirmedAppts = 0
      let pendingAppts = 0
      let completedAppts = 0
      let estimatedRevenue = 0

      if (appts) {
        totalAppts = appts.length
        confirmedAppts = appts.filter(a => a.status === 'confirmed').length
        pendingAppts = appts.filter(a => a.status === 'scheduled').length
        completedAppts = appts.filter(a => a.status === 'completed').length
        estimatedRevenue = appts.reduce((sum, a) => sum + (a.price || 0), 0)
      }

      const clientsAtRisk = clientAlerts ? clientAlerts.length : 0
      const highPriorityAlerts = clientAlerts ? clientAlerts.filter(c => c.risk_level === 'at_risk').length : 0

      const actualRevenue = invoices ? invoices.filter(inv => inv.status === 'paid').reduce((sum, inv) => sum + Number(inv.total_amount || 0), 0) : 0

      setMetrics({
        appointments: {
          confirmed: confirmedAppts,
          pending: pendingAppts,
          completed: completedAppts,
          total: totalAppts,
          changePercent: totalAppts > 0 ? 12 : 0
        },
        revenue: {
          estimated: estimatedRevenue || 1, // evitar division por cero
          actual: actualRevenue,
          target: 500,
          changePercent: actualRevenue > 0 ? 8 : 0
        },
        alerts: {
          clientsAtRisk,
          highPriority: highPriorityAlerts,
          changePercent: -15
        },
        messages: {
          pending: 4,
          sent: 12,
          responded: 8,
          changePercent: 5
        }
      })
    } catch (e) {
      console.error('Error loading daily metrics:', e)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Citas de Hoy */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
        <div className="flex items-start justify-between mb-4">
          <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
            <Calendar className="h-6 w-6 text-blue-600" />
          </div>
          <div className={`flex items-center gap-1 text-sm font-medium ${
            metrics.appointments.changePercent > 0 ? 'text-green-600' : 'text-red-600'
          }`}>
            {metrics.appointments.changePercent > 0 ? (
              <TrendingUp className="h-4 w-4" />
            ) : (
              <TrendingDown className="h-4 w-4" />
            )}
            <span>{Math.abs(metrics.appointments.changePercent)}%</span>
          </div>
        </div>

        <h3 className="text-2xl font-bold text-gray-900 mb-1">
          {metrics.appointments.total}
        </h3>
        <p className="text-sm text-gray-600 mb-3">Citas de hoy</p>

        <div className="flex gap-4 text-xs">
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span className="text-gray-600">{metrics.appointments.completed} completadas</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
            <span className="text-gray-600">{metrics.appointments.confirmed} confirmadas</span>
          </div>
        </div>

        {metrics.appointments.pending > 0 && (
          <div className="mt-3 pt-3 border-t border-gray-200">
            <div className="flex items-center gap-1 text-xs text-orange-600">
              <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></div>
              <span className="font-medium">{metrics.appointments.pending} pendientes de confirmar</span>
            </div>
          </div>
        )}
      </div>

      {/* Facturación Estimada */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
        <div className="flex items-start justify-between mb-4">
          <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
            <Euro className="h-6 w-6 text-green-600" />
          </div>
          <div className={`flex items-center gap-1 text-sm font-medium ${
            metrics.revenue.changePercent > 0 ? 'text-green-600' : 'text-red-600'
          }`}>
            {metrics.revenue.changePercent > 0 ? (
              <TrendingUp className="h-4 w-4" />
            ) : (
              <TrendingDown className="h-4 w-4" />
            )}
            <span>{Math.abs(metrics.revenue.changePercent)}%</span>
          </div>
        </div>

        <h3 className="text-2xl font-bold text-gray-900 mb-1">
          €{metrics.revenue.estimated}
        </h3>
        <p className="text-sm text-gray-600 mb-3">Facturación estimada hoy</p>

        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-gray-600">Facturado:</span>
            <span className="font-medium text-gray-900">€{metrics.revenue.actual}</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-gradient-to-r from-green-500 to-emerald-500 h-2 rounded-full transition-all"
              style={{ width: `${(metrics.revenue.actual / metrics.revenue.estimated) * 100}%` }}
            />
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="text-gray-600">Objetivo diario:</span>
            <span className="font-medium text-gray-900">€{metrics.revenue.target}</span>
          </div>
        </div>
      </div>

      {/* Alertas Clientas en Riesgo */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
        <div className="flex items-start justify-between mb-4">
          <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
            <AlertTriangle className="h-6 w-6 text-orange-600" />
          </div>
          <div className={`flex items-center gap-1 text-sm font-medium ${
            metrics.alerts.changePercent < 0 ? 'text-green-600' : 'text-red-600'
          }`}>
            {metrics.alerts.changePercent < 0 ? (
              <TrendingDown className="h-4 w-4" />
            ) : (
              <TrendingUp className="h-4 w-4" />
            )}
            <span>{Math.abs(metrics.alerts.changePercent)}%</span>
          </div>
        </div>

        <h3 className="text-2xl font-bold text-gray-900 mb-1">
          {metrics.alerts.clientsAtRisk}
        </h3>
        <p className="text-sm text-gray-600 mb-3">Clientas en riesgo</p>

        <div className="space-y-2">
          {metrics.alerts.highPriority > 0 && (
            <div className="flex items-center gap-2 px-3 py-2 bg-red-50 rounded-lg border border-red-200">
              <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
              <span className="text-xs font-medium text-red-700">
                {metrics.alerts.highPriority} prioridad alta
              </span>
            </div>
          )}
          <button className="w-full px-3 py-2 text-xs font-medium text-orange-700 bg-orange-50 rounded-lg hover:bg-orange-100 transition-colors">
            Ver todas las alertas
          </button>
        </div>
      </div>

      {/* Mensajes WhatsApp */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
        <div className="flex items-start justify-between mb-4">
          <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
            <MessageSquare className="h-6 w-6 text-purple-600" />
          </div>
          <div className={`flex items-center gap-1 text-sm font-medium ${
            metrics.messages.changePercent > 0 ? 'text-green-600' : 'text-red-600'
          }`}>
            {metrics.messages.changePercent > 0 ? (
              <TrendingUp className="h-4 w-4" />
            ) : (
              <TrendingDown className="h-4 w-4" />
            )}
            <span>{Math.abs(metrics.messages.changePercent)}%</span>
          </div>
        </div>

        <h3 className="text-2xl font-bold text-gray-900 mb-1">
          {metrics.messages.pending}
        </h3>
        <p className="text-sm text-gray-600 mb-3">Mensajes pendientes</p>

        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-gray-600">Enviados hoy:</span>
            <span className="font-medium text-gray-900">{metrics.messages.sent}</span>
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="text-gray-600">Respondidos:</span>
            <span className="font-medium text-green-600">{metrics.messages.responded}</span>
          </div>
          <div className="mt-2 pt-2 border-t border-gray-200">
            <div className="text-xs text-purple-600 font-medium">
              Tasa de respuesta: {Math.round((metrics.messages.responded / metrics.messages.sent) * 100)}%
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
