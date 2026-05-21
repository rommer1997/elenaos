'use client'

import Link from 'next/link'
import { ArrowRight, Star, CheckCircle2 } from 'lucide-react'

export function Hero() {
  return (
    <section className="relative overflow-hidden py-20 lg:py-32">
      {/* Background decoration */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 right-0 w-96 h-96 bg-purple-200 rounded-full blur-3xl opacity-20"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-pink-200 rounded-full blur-3xl opacity-20"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left column - Content */}
          <div className="text-center lg:text-left">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-100 rounded-full text-purple-700 font-medium text-sm mb-6">
              <Star className="h-4 w-4 fill-purple-700" />
              <span>Más de 500 salones ya confían en nosotros</span>
            </div>

            {/* Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold text-gray-900 mb-6 leading-tight">
              Recupera las clientas que{' '}
              <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                están a punto de perderse
              </span>
            </h1>

            {/* Subheadline */}
            <p className="text-lg sm:text-xl text-gray-600 mb-8 leading-relaxed">
              ElenaOS es el sistema inteligente que predice qué clientas no volverán y las recupera automáticamente con mensajes personalizados de WhatsApp.
            </p>

            {/* Benefits */}
            <div className="flex flex-col gap-3 mb-8">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                <span className="text-sm sm:text-base text-gray-700">Inteligencia Artificial que predice pérdida de clientas</span>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                <span className="text-sm sm:text-base text-gray-700">Mensajes automáticos por WhatsApp 100% personalizados</span>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                <span className="text-sm sm:text-base text-gray-700">Agenda, CRM, facturación e inventario todo en uno</span>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Link
                href="/registro"
                className="group px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full font-bold text-base sm:text-lg hover:shadow-2xl hover:scale-105 transition-all flex items-center justify-center gap-2"
              >
                Prueba gratis 14 días
                <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <a
                href="#calculadora"
                className="px-6 sm:px-8 py-3 sm:py-4 bg-white border-2 border-purple-200 text-purple-700 rounded-full font-bold text-base sm:text-lg hover:bg-purple-50 transition-colors text-center"
              >
                Calcula tu ROI
              </a>
            </div>

            {/* Trust indicators */}
            <div className="mt-8 pt-8 border-t border-gray-200">
              <p className="text-sm text-gray-500 mb-3">Confían en nosotros:</p>
              <div className="flex items-center gap-6 justify-center lg:justify-start opacity-50">
                <div className="text-2xl font-bold text-gray-400">Salon A</div>
                <div className="text-2xl font-bold text-gray-400">Beauty B</div>
                <div className="text-2xl font-bold text-gray-400">Spa C</div>
              </div>
            </div>
          </div>

          {/* Right column - Image/Illustration */}
          <div className="relative hidden lg:block">
            <div className="relative bg-white rounded-3xl shadow-2xl p-8 border border-purple-100">
              {/* Mock dashboard preview */}
              <div className="space-y-4">
                {/* Header */}
                <div className="flex items-center justify-between pb-4 border-b border-gray-200">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full"></div>
                    <div>
                      <div className="font-bold text-gray-900">Elena Beauty Salon</div>
                      <div className="text-sm text-gray-500">Dashboard</div>
                    </div>
                  </div>
                  <div className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                    En vivo
                  </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-4">
                    <div className="text-3xl font-bold text-purple-600">23</div>
                    <div className="text-sm text-gray-600">Clientas recuperadas</div>
                  </div>
                  <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-4">
                    <div className="text-3xl font-bold text-green-600">€2,845</div>
                    <div className="text-sm text-gray-600">Revenue recuperado</div>
                  </div>
                </div>

                {/* Alert */}
                <div className="bg-orange-50 border-l-4 border-orange-400 p-4 rounded-lg">
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 mt-0.5">
                      <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                        ⚠️
                      </div>
                    </div>
                    <div>
                      <div className="font-semibold text-orange-900 text-sm">
                        3 clientas en riesgo alto
                      </div>
                      <div className="text-xs text-orange-700 mt-1">
                        María, Carmen y Ana no han vuelto en 45 días
                      </div>
                    </div>
                  </div>
                </div>

                {/* Message preview */}
                <div className="bg-gradient-to-br from-purple-100 to-pink-100 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="text-xs font-medium text-purple-700">MENSAJE GENERADO POR IA</div>
                  </div>
                  <div className="text-sm text-gray-700 leading-relaxed">
                    &quot;Hola María 👋 ¡Te echamos de menos! Hace tiempo que no vienes... ¿Qué te parece un 20% de descuento en tu próximo corte?&quot;
                  </div>
                </div>
              </div>

              {/* Floating badge */}
              <div className="absolute -top-4 -right-4 px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full shadow-lg font-bold text-sm">
                IA Trabajando 24/7 🤖
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
