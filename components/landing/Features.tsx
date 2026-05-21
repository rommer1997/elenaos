'use client'

import { Calendar, Users, MessageCircle, FileText, Package, Sparkles } from 'lucide-react'

export function Features() {
  const features = [
    {
      icon: Sparkles,
      title: 'Motor de IA Predictiva',
      description: 'Algoritmo que analiza 15+ variables para predecir qué clientas están en riesgo de perderse antes de que suceda.',
      gradient: 'from-purple-500 to-purple-600'
    },
    {
      icon: MessageCircle,
      title: 'WhatsApp Automatizado',
      description: 'Mensajes personalizados que se envían automáticamente en el momento perfecto. Tasa de respuesta del 62%.',
      gradient: 'from-pink-500 to-pink-600'
    },
    {
      icon: Calendar,
      title: 'Agenda Inteligente',
      description: 'Calendario con vista semanal/mensual, recordatorios automáticos y sincronización con Google Calendar.',
      gradient: 'from-blue-500 to-blue-600'
    },
    {
      icon: Users,
      title: 'CRM Completo',
      description: 'Ficha de cada clienta con historial completo, preferencias, notas y alertas automáticas de cumpleaños.',
      gradient: 'from-green-500 to-green-600'
    },
    {
      icon: FileText,
      title: 'Facturación con VeriFactu',
      description: 'Genera facturas profesionales con cumplimiento total de la Ley Antifraude 2024 y envío automático.',
      gradient: 'from-orange-500 to-orange-600'
    },
    {
      icon: Package,
      title: 'Control de Inventario',
      description: 'Gestión de productos con alertas de stock bajo y descuento automático al realizar servicios.',
      gradient: 'from-indigo-500 to-indigo-600'
    }
  ]

  return (
    <section id="funcionalidades" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4" style={{ fontFamily: 'var(--font-cormorant)' }}>
            Todo lo que necesitas{' '}
            <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              en una sola plataforma
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Olvídate de tener 5 aplicaciones diferentes. ElenaOS es el único sistema que necesitas para gestionar tu salón.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon

            return (
              <div
                key={index}
                className="group relative bg-gradient-to-br from-white to-purple-50 rounded-2xl p-8 border-2 border-purple-100 hover:border-purple-300 transition-all hover:shadow-2xl hover:scale-105 duration-300"
              >
                {/* Icon */}
                <div className={`w-16 h-16 bg-gradient-to-r ${feature.gradient} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-lg`}>
                  <Icon className="h-8 w-8 text-white" />
                </div>

                {/* Content */}
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>

                {/* Hover effect decoration */}
                <div className={`absolute inset-0 bg-gradient-to-r ${feature.gradient} opacity-0 group-hover:opacity-5 rounded-2xl transition-opacity`}></div>
              </div>
            )
          })}
        </div>

        {/* Additional benefits */}
        <div className="mt-16 bg-gradient-to-br from-purple-50 to-pink-50 rounded-3xl p-8 lg:p-12 border-2 border-purple-200">
          <div className="text-center mb-8">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">
              Y mucho más incluido...
            </h3>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-4xl mb-2">📊</div>
              <div className="font-semibold text-gray-900">Dashboard con métricas en tiempo real</div>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-2">👥</div>
              <div className="font-semibold text-gray-900">Gestión de personal y horarios</div>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-2">🎨</div>
              <div className="font-semibold text-gray-900">Personalización completa de colores</div>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-2">📱</div>
              <div className="font-semibold text-gray-900">App móvil optimizada (PWA)</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
