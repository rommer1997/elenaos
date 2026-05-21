'use client'

import { PricingPlans } from '@/components/billing/PricingPlans'
import { SubscriptionCard } from '@/components/billing/SubscriptionCard'
import { CreditCard, FileText, TrendingUp } from 'lucide-react'

export default function BillingPage() {
  // Mock data
  const subscription = {
    id: 'sub_123',
    planId: 'professional',
    status: 'active' as const,
    renewsAt: '2026-06-21',
  }

  const handleSelectPlan = async (planId: string) => {
    console.log('Changing to plan:', planId)
    // TODO: Implementar cambio de plan
  }

  const handleCancel = async () => {
    console.log('Cancelling subscription')
    // TODO: Implementar cancelación
  }

  const handleResume = async () => {
    console.log('Resuming subscription')
    // TODO: Implementar reactivación
  }

  const handleManage = () => {
    console.log('Opening customer portal')
    // TODO: Abrir portal de Lemon Squeezy
  }

  return (
    <div className="p-6 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Suscripción ElenaOS</h1>
        <p className="text-gray-600 mt-2">
          Gestiona tu plan, método de pago y facturas
        </p>
      </div>

      {/* Stats */}
      <div className="grid md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <TrendingUp className="h-5 w-5 text-green-600" />
            </div>
            <h3 className="font-semibold text-gray-900">Gasto este mes</h3>
          </div>
          <p className="text-3xl font-bold text-gray-900">€49</p>
          <p className="text-sm text-gray-600 mt-1">Plan Professional</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <FileText className="h-5 w-5 text-blue-600" />
            </div>
            <h3 className="font-semibold text-gray-900">Facturas emitidas</h3>
          </div>
          <p className="text-3xl font-bold text-gray-900">6</p>
          <p className="text-sm text-gray-600 mt-1">Desde enero 2026</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <CreditCard className="h-5 w-5 text-purple-600" />
            </div>
            <h3 className="font-semibold text-gray-900">Método de pago</h3>
          </div>
          <p className="text-lg font-bold text-gray-900">Visa •••• 4242</p>
          <p className="text-sm text-gray-600 mt-1">Expira 12/2027</p>
        </div>
      </div>

      {/* Current Subscription */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Tu Suscripción</h2>
        <div className="max-w-lg">
          <SubscriptionCard
            subscription={subscription}
            onCancel={handleCancel}
            onResume={handleResume}
            onManage={handleManage}
          />
        </div>
      </div>

      {/* Cambiar plan */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Cambiar de Plan</h2>
        <p className="text-gray-600 mb-6">
          Actualiza o reduce tu plan en cualquier momento
        </p>
        <PricingPlans
          currentPlan={subscription.planId}
          onSelectPlan={handleSelectPlan}
        />
      </div>

      {/* Historial de facturas */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Historial de Facturas</h2>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                  Fecha
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                  Descripción
                </th>
                <th className="px-6 py-3 text-right text-xs font-semibold text-gray-600 uppercase">
                  Monto
                </th>
                <th className="px-6 py-3 text-center text-xs font-semibold text-gray-600 uppercase">
                  Estado
                </th>
                <th className="px-6 py-3 text-right text-xs font-semibold text-gray-600 uppercase">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {[
                { date: '21 May 2026', description: 'Plan Professional - Mayo', amount: 49, status: 'paid' },
                { date: '21 Abr 2026', description: 'Plan Professional - Abril', amount: 49, status: 'paid' },
                { date: '21 Mar 2026', description: 'Plan Professional - Marzo', amount: 49, status: 'paid' },
                { date: '21 Feb 2026', description: 'Plan Professional - Febrero', amount: 49, status: 'paid' },
                { date: '21 Ene 2026', description: 'Plan Professional - Enero', amount: 49, status: 'paid' },
              ].map((invoice, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm text-gray-900">{invoice.date}</td>
                  <td className="px-6 py-4 text-sm text-gray-700">{invoice.description}</td>
                  <td className="px-6 py-4 text-sm font-medium text-gray-900 text-right">
                    €{invoice.amount}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                      Pagada
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="text-sm text-purple-600 hover:text-purple-700 font-medium">
                      Descargar PDF
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
