'use client'

import Link from 'next/link'
import { Brain, MessageSquare, TrendingUp } from 'lucide-react'

export function HowItWorks() {
  const steps = [
    {
      number: '01',
      icon: Brain,
      title: 'La IA analiza tu base de datos',
      description: 'ElenaOS estudia el historial de visitas de cada clienta y detecta patrones de comportamiento. Identifica automáticamente quién está en riesgo de no volver.',
      color: 'from-purple-500 to-purple-600',
      bgColor: 'from-purple-50 to-purple-100'
    },
    {
      number: '02',
      icon: MessageSquare,
      title: 'Genera mensajes personalizados',
      description: 'Nuestra IA crea mensajes únicos para cada clienta según su historial, preferencias y servicios favoritos. Cada mensaje es 100% personalizado y natural.',
      color: 'from-pink-500 to-pink-600',
      bgColor: 'from-pink-50 to-pink-100'
    },
    {
      number: '03',
      icon: TrendingUp,
      title: 'Las clientas vuelven automáticamente',
      description: 'Los mensajes se envían por WhatsApp en el momento perfecto. El 60% de las clientas contactadas vuelven a agendar. Todo sin que tengas que hacer nada.',
      color: 'from-green-500 to-green-600',
      bgColor: 'from-green-50 to-green-100'
    }
  ]

  return (
    <section className="py-20 bg-gradient-to-b from-white to-purple-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4" style={{ fontFamily: 'var(--font-cormorant)' }}>
            ¿Cómo funciona{' '}
            <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              ElenaOS?
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Tres pasos simples para empezar a recuperar clientas hoy mismo
          </p>
        </div>

        {/* Steps */}
        <div className="grid lg:grid-cols-3 gap-8 lg:gap-12">
          {steps.map((step, index) => {
            const Icon = step.icon

            return (
              <div key={index} className="relative group">
                {/* Connector line (only between cards) */}
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-20 left-full w-full h-0.5 bg-gradient-to-r from-purple-200 to-pink-200 -translate-x-1/2 z-0"></div>
                )}

                <div className="relative bg-white rounded-3xl p-8 border-2 border-purple-100 hover:border-purple-300 transition-all hover:shadow-2xl group-hover:scale-105 duration-300">
                  {/* Number badge */}
                  <div className="absolute -top-6 left-8">
                    <div className={`px-6 py-3 bg-gradient-to-r ${step.color} text-white rounded-2xl font-bold text-2xl shadow-lg`}>
                      {step.number}
                    </div>
                  </div>

                  {/* Icon */}
                  <div className={`w-20 h-20 bg-gradient-to-br ${step.bgColor} rounded-2xl flex items-center justify-center mb-6 mt-4`}>
                    <Icon className={`h-10 w-10 bg-gradient-to-r ${step.color} bg-clip-text`} style={{ color: 'transparent', WebkitBackgroundClip: 'text' }} />
                  </div>

                  {/* Content */}
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">
                    {step.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </div>
            )
          })}
        </div>

        {/* Bottom CTA */}
        <div className="mt-16 text-center">
          <div className="inline-block bg-gradient-to-br from-purple-50 to-pink-50 rounded-3xl p-8 border-2 border-purple-200">
            <p className="text-lg text-gray-700 mb-4 max-w-2xl">
              <strong className="text-purple-600">Todo es automático.</strong> Solo tienes que conectar tu WhatsApp una vez y ElenaOS trabajará 24/7 recuperando clientas por ti.
            </p>
            <Link
              href="/registro"
              className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full font-bold hover:shadow-xl hover:scale-105 transition-all"
            >
              Configura tu cuenta gratis
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
