'use client'

import { Euro, FileText, TrendingUp, Clock } from 'lucide-react'

interface InvoiceStatsProps {
  period: string
  onPeriodChange: (period: string) => void
}

export function InvoiceStats({ period, onPeriodChange }: InvoiceStatsProps) {
  // Mock data
  const stats = {
    totalAmount: 12450.50,
    invoiceCount: 45,
    paidAmount: 10890.30,
    pendingAmount: 1560.20,
    averageTicket: 276.68,
    growthRate: 12.5
  }

  return (
    <div className="space-y-4">
      {/* Period selector */}
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-gray-700">Resumen del período</h3>
        <select
          value={period}
          onChange={(e) => onPeriodChange(e.target.value)}
          className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
        >
          <option value="week">Esta semana</option>
          <option value="month">Este mes</option>
          <option value="quarter">Este trimestre</option>
          <option value="year">Este año</option>
        </select>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total facturado */}
        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-4 border border-purple-200">
          <div className="flex items-center justify-between mb-2">
            <div className="p-2 bg-purple-600 rounded-lg">
              <Euro className="h-5 w-5 text-white" />
            </div>
            <span className="text-xs font-medium text-purple-700 uppercase">Total Facturado</span>
          </div>
          <div className="text-2xl font-bold text-gray-900">
            €{stats.totalAmount.toLocaleString('es-ES', { minimumFractionDigits: 2 })}
          </div>
          <div className="flex items-center gap-1 mt-1 text-sm text-purple-700">
            <TrendingUp className="h-4 w-4" />
            <span>+{stats.growthRate}% vs. anterior</span>
          </div>
        </div>

        {/* Número de facturas */}
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <div className="p-2 bg-blue-100 rounded-lg">
              <FileText className="h-5 w-5 text-blue-600" />
            </div>
            <span className="text-xs font-medium text-gray-500 uppercase">Facturas</span>
          </div>
          <div className="text-2xl font-bold text-gray-900">{stats.invoiceCount}</div>
          <div className="text-sm text-gray-600 mt-1">
            Ticket medio: €{stats.averageTicket.toFixed(2)}
          </div>
        </div>

        {/* Cobrado */}
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <div className="p-2 bg-green-100 rounded-lg">
              <TrendingUp className="h-5 w-5 text-green-600" />
            </div>
            <span className="text-xs font-medium text-gray-500 uppercase">Cobrado</span>
          </div>
          <div className="text-2xl font-bold text-green-600">
            €{stats.paidAmount.toLocaleString('es-ES', { minimumFractionDigits: 2 })}
          </div>
          <div className="text-sm text-gray-600 mt-1">
            {Math.round((stats.paidAmount / stats.totalAmount) * 100)}% del total
          </div>
        </div>

        {/* Pendiente */}
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <div className="p-2 bg-orange-100 rounded-lg">
              <Clock className="h-5 w-5 text-orange-600" />
            </div>
            <span className="text-xs font-medium text-gray-500 uppercase">Pendiente</span>
          </div>
          <div className="text-2xl font-bold text-orange-600">
            €{stats.pendingAmount.toLocaleString('es-ES', { minimumFractionDigits: 2 })}
          </div>
          <div className="text-sm text-gray-600 mt-1">
            {Math.round((stats.pendingAmount / stats.totalAmount) * 100)}% del total
          </div>
        </div>
      </div>

      {/* VeriFactu status */}
      <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-4 border border-green-200">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-green-600 rounded-lg">
            <FileText className="h-5 w-5 text-white" />
          </div>
          <div className="flex-1">
            <div className="font-semibold text-gray-900">VeriFactu Activo</div>
            <div className="text-sm text-gray-600">
              Todas las facturas cumplen con la normativa AEAT. Última sincronización: Hoy 10:30
            </div>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 bg-green-600 text-white rounded-full text-sm font-medium">
            <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
            <span>Conectado</span>
          </div>
        </div>
      </div>
    </div>
  )
}
