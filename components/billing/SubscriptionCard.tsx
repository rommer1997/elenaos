'use client'

import { useState } from 'react'
import { CreditCard, Calendar, AlertCircle, ExternalLink } from 'lucide-react'
import { PLANS } from '@/lib/billing/lemon-squeezy'

interface Subscription {
  id: string
  planId: string
  status: 'active' | 'cancelled' | 'expired' | 'paused'
  renewsAt: string
  endsAt?: string
}

interface SubscriptionCardProps {
  subscription: Subscription
  onCancel?: () => void
  onResume?: () => void
  onManage?: () => void
}

export function SubscriptionCard({
  subscription,
  onCancel,
  onResume,
  onManage
}: SubscriptionCardProps) {
  const [showCancelConfirm, setShowCancelConfirm] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const plan = PLANS[subscription.planId]

  const handleCancel = async () => {
    setIsLoading(true)
    if (onCancel) {
      await onCancel()
    }
    setIsLoading(false)
    setShowCancelConfirm(false)
  }

  const handleResume = async () => {
    setIsLoading(true)
    if (onResume) {
      await onResume()
    }
    setIsLoading(false)
  }

  const getStatusBadge = () => {
    switch (subscription.status) {
      case 'active':
        return (
          <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
            ✓ Activa
          </span>
        )
      case 'cancelled':
        return (
          <span className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-sm font-medium">
            Cancelada
          </span>
        )
      case 'expired':
        return (
          <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm font-medium">
            Expirada
          </span>
        )
      case 'paused':
        return (
          <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm font-medium">
            Pausada
          </span>
        )
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    })
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h3 className="text-xl font-bold text-gray-900 mb-1">
            Plan {plan.name}
          </h3>
          <p className="text-3xl font-bold text-gray-900">
            €{plan.price}
            <span className="text-base font-normal text-gray-600">/mes</span>
          </p>
        </div>
        {getStatusBadge()}
      </div>

      {/* Info */}
      <div className="space-y-4 mb-6">
        {subscription.status === 'active' && (
          <div className="flex items-center gap-3 text-sm">
            <Calendar className="h-5 w-5 text-gray-400" />
            <div>
              <span className="text-gray-600">Próxima renovación:</span>
              <span className="font-medium text-gray-900 ml-2">
                {formatDate(subscription.renewsAt)}
              </span>
            </div>
          </div>
        )}

        {subscription.status === 'cancelled' && subscription.endsAt && (
          <div className="flex items-start gap-3 p-3 bg-orange-50 border border-orange-200 rounded-lg">
            <AlertCircle className="h-5 w-5 text-orange-500 flex-shrink-0 mt-0.5" />
            <div className="text-sm">
              <p className="font-medium text-orange-900">Suscripción cancelada</p>
              <p className="text-orange-700 mt-1">
                Tendrás acceso hasta el {formatDate(subscription.endsAt)}
              </p>
            </div>
          </div>
        )}

        {subscription.status === 'expired' && (
          <div className="flex items-start gap-3 p-3 bg-red-50 border border-red-200 rounded-lg">
            <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
            <div className="text-sm">
              <p className="font-medium text-red-900">Suscripción expirada</p>
              <p className="text-red-700 mt-1">
                Renueva tu plan para continuar usando ElenaOS
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Features incluidas */}
      <div className="mb-6">
        <h4 className="text-sm font-semibold text-gray-700 mb-3">
          Incluido en tu plan:
        </h4>
        <ul className="space-y-2">
          {plan.features.slice(0, 4).map((feature, index) => (
            <li key={index} className="flex items-center gap-2 text-sm text-gray-600">
              <div className="w-1.5 h-1.5 bg-purple-500 rounded-full"></div>
              {feature}
            </li>
          ))}
        </ul>
      </div>

      {/* Actions */}
      <div className="space-y-3">
        {subscription.status === 'active' && (
          <>
            <button
              onClick={onManage}
              className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-lg font-medium hover:bg-gray-800 transition-colors"
            >
              <CreditCard className="h-4 w-4" />
              Gestionar método de pago
              <ExternalLink className="h-4 w-4" />
            </button>

            {!showCancelConfirm ? (
              <button
                onClick={() => setShowCancelConfirm(true)}
                className="w-full px-4 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
              >
                Cancelar suscripción
              </button>
            ) : (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-900 mb-3">
                  ¿Estás seguro? Perderás acceso a todas las funciones del plan.
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={handleCancel}
                    disabled={isLoading}
                    className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors disabled:opacity-50"
                  >
                    {isLoading ? 'Cancelando...' : 'Sí, cancelar'}
                  </button>
                  <button
                    onClick={() => setShowCancelConfirm(false)}
                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                  >
                    No, mantener
                  </button>
                </div>
              </div>
            )}
          </>
        )}

        {subscription.status === 'cancelled' && (
          <button
            onClick={handleResume}
            disabled={isLoading}
            className="w-full px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-medium hover:from-purple-700 hover:to-pink-700 transition-all disabled:opacity-50"
          >
            {isLoading ? 'Reactivando...' : 'Reactivar suscripción'}
          </button>
        )}

        {subscription.status === 'expired' && (
          <button
            className="w-full px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-medium hover:from-purple-700 hover:to-pink-700 transition-all"
          >
            Renovar ahora
          </button>
        )}
      </div>
    </div>
  )
}
