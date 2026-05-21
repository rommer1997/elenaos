'use client'

import { TrendingUp, Users, MessageSquare, Euro, ArrowRight } from 'lucide-react'
import Link from 'next/link'

export function RetentionMetrics() {
  // Mock retention data
  const metrics = {
    retentionRate: {
      current: 68,
      previous: 62,
      target: 70,
      change: 6
    },
    reactivatedClients: {
      thisMonth: 23,
      lastMonth: 18,
      change: 27.8
    },
    campaignROI: {
      invested: 49,
      recovered: 2845,
      roi: 5806,
      clientsReached: 45,
      clientsReactivated: 23
    },
    topCampaigns: [
      {
        name: 'Recordatorio 30 días',
        sent: 15,
        responses: 12,
        reactivated: 8,
        responseRate: 80,
        reactivationRate: 53
      },
      {
        name: 'Oferta especial cumpleaños',
        sent: 8,
        responses: 7,
        reactivated: 6,
        responseRate: 87,
        reactivationRate: 75
      },
      {
        name: 'Recuperación 60 días',
        sent: 12,
        responses: 8,
        reactivated: 5,
        responseRate: 67,
        reactivationRate: 42
      }
    ]
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Métricas de Retención</h2>
          <p className="text-sm text-gray-600 mt-1">
            Rendimiento del motor de IA este mes
          </p>
        </div>
        <Link
          href="/retencion"
          className="flex items-center gap-2 px-4 py-2 text-purple-700 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors font-medium"
        >
          <span>Ver detalles</span>
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>

      {/* Main metrics grid */}
      <div className="grid md:grid-cols-3 gap-6">
        {/* Retention Rate */}
        <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl shadow-sm border-2 border-purple-200 p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="w-12 h-12 bg-purple-500 rounded-xl flex items-center justify-center">
              <TrendingUp className="h-6 w-6 text-white" />
            </div>
            <div className="flex items-center gap-1 px-2 py-1 bg-green-100 text-green-700 rounded-lg text-xs font-bold">
              +{metrics.retentionRate.change}%
            </div>
          </div>

          <h3 className="text-4xl font-bold text-gray-900 mb-1">
            {metrics.retentionRate.current}%
          </h3>
          <p className="text-sm text-gray-700 font-medium mb-4">
            Tasa de retención mensual
          </p>

          <div className="space-y-2">
            <div className="flex justify-between text-xs text-gray-600">
              <span>Mes anterior:</span>
              <span className="font-medium">{metrics.retentionRate.previous}%</span>
            </div>
            <div className="w-full bg-purple-200 rounded-full h-2">
              <div
                className="bg-purple-600 h-2 rounded-full transition-all"
                style={{ width: `${metrics.retentionRate.current}%` }}
              />
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-gray-600">Objetivo:</span>
              <span className="font-medium text-purple-700">{metrics.retentionRate.target}%</span>
            </div>
          </div>
        </div>

        {/* Reactivated Clients */}
        <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl shadow-sm border-2 border-green-200 p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center">
              <Users className="h-6 w-6 text-white" />
            </div>
            <div className="flex items-center gap-1 px-2 py-1 bg-green-100 text-green-700 rounded-lg text-xs font-bold">
              +{Math.round(metrics.reactivatedClients.change)}%
            </div>
          </div>

          <h3 className="text-4xl font-bold text-gray-900 mb-1">
            {metrics.reactivatedClients.thisMonth}
          </h3>
          <p className="text-sm text-gray-700 font-medium mb-4">
            Clientas reactivadas este mes
          </p>

          <div className="flex items-center justify-between text-xs">
            <span className="text-gray-600">Mes anterior:</span>
            <span className="font-medium text-gray-900">{metrics.reactivatedClients.lastMonth} clientas</span>
          </div>

          <div className="mt-4 pt-4 border-t border-green-200">
            <p className="text-xs text-green-700 font-medium">
              🎉 ¡Mejor mes del trimestre!
            </p>
          </div>
        </div>

        {/* Campaign ROI */}
        <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-xl shadow-sm border-2 border-orange-200 p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="w-12 h-12 bg-orange-500 rounded-xl flex items-center justify-center">
              <Euro className="h-6 w-6 text-white" />
            </div>
            <div className="px-2 py-1 bg-orange-100 text-orange-700 rounded-lg text-xs font-bold">
              ROI
            </div>
          </div>

          <h3 className="text-4xl font-bold text-gray-900 mb-1">
            {Math.round(metrics.campaignROI.roi)}%
          </h3>
          <p className="text-sm text-gray-700 font-medium mb-4">
            Retorno de inversión WhatsApp
          </p>

          <div className="space-y-2 text-xs">
            <div className="flex justify-between">
              <span className="text-gray-600">Invertido:</span>
              <span className="font-medium text-gray-900">€{metrics.campaignROI.invested}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Recuperado:</span>
              <span className="font-medium text-green-600">€{metrics.campaignROI.recovered}</span>
            </div>
            <div className="mt-3 pt-3 border-t border-orange-200">
              <p className="text-orange-700 font-medium">
                Por cada €1 invertido recuperas €{Math.round(metrics.campaignROI.recovered / metrics.campaignROI.invested)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Top campaigns table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <MessageSquare className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <h3 className="font-bold text-gray-900">Top Campañas del Mes</h3>
              <p className="text-xs text-gray-600">Mejor rendimiento por tasa de reactivación</p>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left text-xs font-semibold text-gray-600 pb-3">Campaña</th>
                <th className="text-center text-xs font-semibold text-gray-600 pb-3">Enviados</th>
                <th className="text-center text-xs font-semibold text-gray-600 pb-3">Respuestas</th>
                <th className="text-center text-xs font-semibold text-gray-600 pb-3">Reactivadas</th>
                <th className="text-right text-xs font-semibold text-gray-600 pb-3">Tasa Reactivación</th>
              </tr>
            </thead>
            <tbody>
              {metrics.topCampaigns.map((campaign, index) => (
                <tr key={index} className="border-b border-gray-100">
                  <td className="py-4">
                    <div className="flex items-center gap-2">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold ${
                        index === 0 ? 'bg-yellow-100 text-yellow-700' :
                        index === 1 ? 'bg-gray-100 text-gray-700' :
                        'bg-orange-100 text-orange-700'
                      }`}>
                        {index === 0 ? '🥇' : index === 1 ? '🥈' : '🥉'}
                      </div>
                      <span className="font-medium text-gray-900">{campaign.name}</span>
                    </div>
                  </td>
                  <td className="text-center text-gray-700">{campaign.sent}</td>
                  <td className="text-center">
                    <div className="inline-flex flex-col items-center">
                      <span className="font-medium text-gray-900">{campaign.responses}</span>
                      <span className="text-xs text-green-600">{campaign.responseRate}%</span>
                    </div>
                  </td>
                  <td className="text-center">
                    <span className="font-medium text-green-600">{campaign.reactivated}</span>
                  </td>
                  <td className="text-right">
                    <div className="inline-flex items-center gap-2">
                      <div className="w-16 bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-green-500 h-2 rounded-full"
                          style={{ width: `${campaign.reactivationRate}%` }}
                        />
                      </div>
                      <span className="font-bold text-green-600 text-sm w-12 text-right">
                        {campaign.reactivationRate}%
                      </span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-4 pt-4 border-t border-gray-200 flex items-center justify-between">
          <p className="text-xs text-gray-600">
            💡 Las campañas personalizadas tienen 3× mejor tasa de respuesta que los mensajes genéricos
          </p>
          <Link
            href="/retencion"
            className="text-xs font-medium text-purple-600 hover:text-purple-700"
          >
            Ver todas las campañas →
          </Link>
        </div>
      </div>
    </div>
  )
}
