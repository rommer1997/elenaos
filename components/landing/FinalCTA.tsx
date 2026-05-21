'use client'

import Link from 'next/link'
import { ArrowRight, CheckCircle2 } from 'lucide-react'

export function FinalCTA() {
  return (
    <section className="py-20 bg-gradient-to-br from-purple-600 via-purple-700 to-pink-600 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0">
        <div className="absolute top-0 right-0 w-96 h-96 bg-pink-400 rounded-full blur-3xl opacity-20"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-400 rounded-full blur-3xl opacity-20"></div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="text-center">
          {/* Headline */}
          <h2 className="text-4xl lg:text-6xl font-bold text-white mb-6 leading-tight" style={{ fontFamily: 'var(--font-cormorant)' }}>
            Empieza a recuperar clientas{' '}
            <span className="block mt-2">
              hoy mismo
            </span>
          </h2>

          {/* Subheadline */}
          <p className="text-xl text-white/90 mb-8 max-w-3xl mx-auto leading-relaxed">
            Únete a más de 500 salones que ya están recuperando revenue automáticamente con ElenaOS
          </p>

          {/* Benefits */}
          <div className="flex flex-col md:flex-row gap-6 justify-center items-center mb-10">
            <div className="flex items-center gap-2 text-white">
              <CheckCircle2 className="h-5 w-5" />
              <span className="font-medium">14 días gratis</span>
            </div>
            <div className="flex items-center gap-2 text-white">
              <CheckCircle2 className="h-5 w-5" />
              <span className="font-medium">Sin tarjeta de crédito</span>
            </div>
            <div className="flex items-center gap-2 text-white">
              <CheckCircle2 className="h-5 w-5" />
              <span className="font-medium">Cancela cuando quieras</span>
            </div>
          </div>

          {/* CTA Button */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-6">
            <Link
              href="/registro"
              className="group px-10 py-5 bg-white text-purple-700 rounded-full font-bold text-xl hover:shadow-2xl hover:scale-105 transition-all flex items-center justify-center gap-3"
            >
              Prueba gratis 14 días
              <ArrowRight className="h-6 w-6 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {/* Trust indicator */}
          <p className="text-white/80 text-sm">
            Configuración en menos de 10 minutos • Soporte en español disponible
          </p>

          {/* Stats */}
          <div className="mt-16 pt-16 border-t border-white/20 grid md:grid-cols-3 gap-8">
            <div>
              <div className="text-4xl font-bold text-white mb-2">60%</div>
              <div className="text-white/80">Tasa de recuperación</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-white mb-2">€890K</div>
              <div className="text-white/80">Revenue recuperado</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-white mb-2">4.9/5</div>
              <div className="text-white/80">Valoración de usuarios</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
