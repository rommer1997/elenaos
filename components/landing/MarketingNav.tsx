'use client'

import Link from 'next/link'
import { Sparkles } from 'lucide-react'

export function MarketingNav() {
  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-pink-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
              <Sparkles className="h-6 w-6 text-white" />
            </div>
            <span className="text-2xl font-bold font-serif text-gray-900" style={{ fontFamily: 'var(--font-cormorant)' }}>
              ElenaOS
            </span>
          </Link>

          {/* Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <a href="#funcionalidades" className="text-gray-600 hover:text-purple-600 transition-colors font-medium">
              Funcionalidades
            </a>
            <a href="#precios" className="text-gray-600 hover:text-purple-600 transition-colors font-medium">
              Precios
            </a>
            <a href="#testimonios" className="text-gray-600 hover:text-purple-600 transition-colors font-medium">
              Testimonios
            </a>
            <a href="#faq" className="text-gray-600 hover:text-purple-600 transition-colors font-medium">
              FAQ
            </a>
          </div>

          {/* CTA */}
          <div className="flex items-center gap-4">
            <Link
              href="/login"
              className="text-gray-600 hover:text-purple-600 transition-colors font-medium"
            >
              Iniciar sesión
            </Link>
            <Link
              href="/registro"
              className="px-6 py-2.5 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full font-semibold hover:shadow-lg hover:scale-105 transition-all"
            >
              Prueba gratis 14 días
            </Link>
          </div>
        </div>
      </div>
    </nav>
  )
}
