'use client'

import { useState } from 'react'
import { Check, Sparkles, Zap } from 'lucide-react'

export function Pricing() {
  const [isAnnual, setIsAnnual] = useState(false)

  const plans = [
    {
      name: 'Starter',
      description: 'Perfecto para salones pequeños que están empezando',
      monthlyPrice: 29,
      annualPrice: 24, // 290/año (2 meses gratis)
      icon: Sparkles,
      features: [
        'Hasta 100 clientas activas',
        'Agenda digital inteligente',
        'CRM básico con historial',
        'Recordatorios automáticos',
        'WhatsApp manual',
        'Facturación básica',
        'Soporte por email'
      ],
      cta: 'Empezar gratis',
      popular: false
    },
    {
      name: 'Professional',
      description: 'La opción más elegida por salones en crecimiento',
      monthlyPrice: 49,
      annualPrice: 41, // 490/año (2 meses gratis)
      icon: Zap,
      features: [
        'Hasta 300 clientas activas',
        'Todo lo de Starter, más:',
        '🤖 Motor de IA predictiva',
        '✉️ WhatsApp automático con IA',
        'Mensajes personalizados ilimitados',
        'Dashboard con métricas',
        'VeriFactu + facturación avanzada',
        'Control de inventario',
        'Gestión de personal',
        'Soporte prioritario'
      ],
      cta: 'Empezar gratis',
      popular: true
    },
    {
      name: 'Enterprise',
      description: 'Para salones grandes con múltiples profesionales',
      monthlyPrice: 99,
      annualPrice: 83, // 990/año (2 meses gratis)
      icon: Sparkles,
      features: [
        'Clientas ilimitadas',
        'Todo lo de Professional, más:',
        'Multi-sede (hasta 5 locales)',
        'API personalizada',
        'Integraciones avanzadas',
        'Onboarding personalizado',
        'Account manager dedicado',
        'Soporte 24/7 por WhatsApp',
        'Reportes personalizados'
      ],
      cta: 'Contactar ventas',
      popular: false
    }
  ]

  return (
    <section id="precios" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4" style={{ fontFamily: 'var(--font-cormorant)' }}>
            Planes simples,{' '}
            <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              resultados extraordinarios
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            14 días de prueba gratis • Sin tarjeta de crédito • Cancela cuando quieras
          </p>

          {/* Toggle */}
          <div className="inline-flex items-center gap-4 bg-purple-100 rounded-full p-2">
            <button
              onClick={() => setIsAnnual(false)}
              className={`px-6 py-2 rounded-full font-semibold transition-all ${
                !isAnnual
                  ? 'bg-white text-purple-700 shadow-md'
                  : 'text-gray-600 hover:text-purple-700'
              }`}
            >
              Mensual
            </button>
            <button
              onClick={() => setIsAnnual(true)}
              className={`px-6 py-2 rounded-full font-semibold transition-all ${
                isAnnual
                  ? 'bg-white text-purple-700 shadow-md'
                  : 'text-gray-600 hover:text-purple-700'
              }`}
            >
              Anual
              <span className="ml-2 px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold">
                -17%
              </span>
            </button>
          </div>
        </div>

        {/* Plans */}
        <div className="grid lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {plans.map((plan, index) => {
            const Icon = plan.icon
            const price = isAnnual ? plan.annualPrice : plan.monthlyPrice

            return (
              <div
                key={index}
                className={`relative rounded-3xl p-8 ${
                  plan.popular
                    ? 'bg-gradient-to-br from-purple-600 to-pink-600 text-white scale-105 shadow-2xl border-4 border-purple-300'
                    : 'bg-white border-2 border-purple-100 hover:border-purple-300'
                } transition-all hover:scale-105`}
              >
                {/* Popular badge */}
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-6 py-2 bg-gradient-to-r from-yellow-400 to-orange-400 text-gray-900 rounded-full font-bold text-sm shadow-lg">
                    ⭐ MÁS POPULAR
                  </div>
                )}

                {/* Icon */}
                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-6 ${
                  plan.popular ? 'bg-white/20' : 'bg-gradient-to-br from-purple-100 to-pink-100'
                }`}>
                  <Icon className={`h-8 w-8 ${plan.popular ? 'text-white' : 'text-purple-600'}`} />
                </div>

                {/* Header */}
                <h3 className={`text-2xl font-bold mb-2 ${plan.popular ? 'text-white' : 'text-gray-900'}`}>
                  {plan.name}
                </h3>
                <p className={`text-sm mb-6 ${plan.popular ? 'text-white/90' : 'text-gray-600'}`}>
                  {plan.description}
                </p>

                {/* Price */}
                <div className="mb-6">
                  <div className="flex items-baseline gap-2">
                    <span className={`text-5xl font-bold ${plan.popular ? 'text-white' : 'text-gray-900'}`}>
                      €{price}
                    </span>
                    <span className={`text-lg ${plan.popular ? 'text-white/80' : 'text-gray-500'}`}>
                      /mes
                    </span>
                  </div>
                  {isAnnual && (
                    <div className={`text-sm mt-1 ${plan.popular ? 'text-white/80' : 'text-gray-500'}`}>
                      Facturado anualmente (€{price * 12}/año)
                    </div>
                  )}
                </div>

                {/* CTA */}
                <a
                  href={plan.name === 'Enterprise' ? '/contacto' : '/registro'}
                  className={`block w-full py-4 rounded-xl font-bold text-center mb-8 transition-all hover:scale-105 ${
                    plan.popular
                      ? 'bg-white text-purple-600 hover:shadow-xl'
                      : 'bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:shadow-xl'
                  }`}
                >
                  {plan.cta}
                </a>

                {/* Features */}
                <div className="space-y-3">
                  {plan.features.map((feature, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <Check className={`h-5 w-5 flex-shrink-0 mt-0.5 ${
                        plan.popular ? 'text-white' : 'text-green-600'
                      }`} />
                      <span className={`text-sm ${plan.popular ? 'text-white/90' : 'text-gray-700'}`}>
                        {feature}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )
          })}
        </div>

        {/* FAQ link */}
        <div className="mt-16 text-center">
          <p className="text-gray-600 mb-4">
            ¿Tienes dudas sobre los planes? Consulta nuestra{' '}
            <a href="#faq" className="text-purple-600 font-semibold hover:underline">
              sección de preguntas frecuentes
            </a>
          </p>
          <p className="text-sm text-gray-500">
            Todos los planes incluyen 14 días de prueba gratis y acceso completo a todas las funcionalidades
          </p>
        </div>
      </div>
    </section>
  )
}
