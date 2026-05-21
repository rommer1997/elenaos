'use client'

import { useState } from 'react'
import { Check, Zap, Sparkles, Crown } from 'lucide-react'
import { PLANS } from '@/lib/billing/lemon-squeezy'

interface PricingPlansProps {
  currentPlan?: string
  onSelectPlan?: (planId: string) => void
}

export function PricingPlans({ currentPlan, onSelectPlan }: PricingPlansProps) {
  const [interval, setInterval] = useState<'month' | 'year'>('month')
  const [isLoading, setIsLoading] = useState<string | null>(null)

  const handleSelectPlan = async (planId: string) => {
    if (planId === currentPlan) return

    setIsLoading(planId)

    if (onSelectPlan) {
      await onSelectPlan(planId)
    }

    setIsLoading(null)
  }

  const getPlanIcon = (planId: string) => {
    switch (planId) {
      case 'starter':
        return Zap
      case 'professional':
        return Sparkles
      case 'enterprise':
        return Crown
      default:
        return Zap
    }
  }

  const getPlanColor = (planId: string) => {
    switch (planId) {
      case 'starter':
        return 'from-blue-500 to-cyan-500'
      case 'professional':
        return 'from-purple-500 to-pink-500'
      case 'enterprise':
        return 'from-orange-500 to-red-500'
      default:
        return 'from-gray-500 to-gray-600'
    }
  }

  return (
    <div className="space-y-8">
      {/* Toggle mensual/anual */}
      <div className="flex items-center justify-center gap-4">
        <button
          onClick={() => setInterval('month')}
          className={`px-6 py-2 rounded-lg font-medium transition-all ${
            interval === 'month'
              ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Mensual
        </button>
        <button
          onClick={() => setInterval('year')}
          className={`px-6 py-2 rounded-lg font-medium transition-all ${
            interval === 'year'
              ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Anual
          <span className="ml-2 text-xs bg-green-500 text-white px-2 py-0.5 rounded-full">
            Ahorra 20%
          </span>
        </button>
      </div>

      {/* Grid de planes */}
      <div className="grid md:grid-cols-3 gap-6">
        {Object.values(PLANS).map((plan) => {
          const Icon = getPlanIcon(plan.id)
          const isCurrentPlan = currentPlan === plan.id
          const isProfessional = plan.id === 'professional'

          const price = interval === 'year'
            ? Math.round(plan.price * 12 * 0.8)
            : plan.price

          const pricePerMonth = interval === 'year'
            ? Math.round(price / 12)
            : price

          return (
            <div
              key={plan.id}
              className={`relative bg-white rounded-2xl shadow-lg border-2 transition-all hover:shadow-xl ${
                isProfessional
                  ? 'border-purple-500 transform scale-105'
                  : isCurrentPlan
                  ? 'border-green-500'
                  : 'border-gray-200'
              }`}
            >
              {/* Badge "Popular" o "Actual" */}
              {isProfessional && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <span className="px-4 py-1 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-sm font-bold rounded-full shadow-lg">
                    Más Popular
                  </span>
                </div>
              )}

              {isCurrentPlan && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <span className="px-4 py-1 bg-green-500 text-white text-sm font-bold rounded-full shadow-lg">
                    Plan Actual
                  </span>
                </div>
              )}

              <div className="p-8">
                {/* Icono y nombre */}
                <div className="flex items-center gap-3 mb-4">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${getPlanColor(plan.id)} flex items-center justify-center`}>
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900">{plan.name}</h3>
                  </div>
                </div>

                {/* Precio */}
                <div className="mb-6">
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-bold text-gray-900">€{pricePerMonth}</span>
                    <span className="text-gray-600">/mes</span>
                  </div>
                  {interval === 'year' && (
                    <p className="text-sm text-gray-500 mt-1">
                      €{price}/año (ahorra €{plan.price * 12 - price})
                    </p>
                  )}
                </div>

                {/* Features */}
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                      <span className="text-sm text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>

                {/* CTA Button */}
                <button
                  onClick={() => handleSelectPlan(plan.id)}
                  disabled={isCurrentPlan || isLoading === plan.id}
                  className={`w-full py-3 px-6 rounded-lg font-medium transition-all ${
                    isCurrentPlan
                      ? 'bg-gray-100 text-gray-500 cursor-not-allowed'
                      : isProfessional
                      ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700'
                      : 'bg-gray-900 text-white hover:bg-gray-800'
                  }`}
                >
                  {isLoading === plan.id
                    ? 'Procesando...'
                    : isCurrentPlan
                    ? 'Plan Actual'
                    : 'Seleccionar Plan'}
                </button>
              </div>
            </div>
          )
        })}
      </div>

      {/* Nota inferior */}
      <div className="text-center text-sm text-gray-600">
        <p>
          💳 Todos los planes incluyen 14 días de prueba gratis. Cancela cuando quieras.
        </p>
        <p className="mt-2">
          ¿Necesitas más? Contáctanos para un plan personalizado
        </p>
      </div>
    </div>
  )
}
