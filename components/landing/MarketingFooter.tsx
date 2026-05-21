'use client'

import Link from 'next/link'
import { Sparkles, Mail, Phone, MapPin } from 'lucide-react'

export function MarketingFooter() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div>
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                <Sparkles className="h-6 w-6 text-white" />
              </div>
              <span className="text-2xl font-bold text-white" style={{ fontFamily: 'var(--font-cormorant)' }}>
                ElenaOS
              </span>
            </Link>
            <p className="text-sm text-gray-400 mb-6">
              El sistema inteligente que recupera clientas automáticamente para salones de belleza.
            </p>
            <div className="flex gap-4">
              <a href="#" className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-purple-600 transition-colors">
                📱
              </a>
              <a href="#" className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-purple-600 transition-colors">
                📘
              </a>
              <a href="#" className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-purple-600 transition-colors">
                🐦
              </a>
            </div>
          </div>

          {/* Producto */}
          <div>
            <h3 className="text-white font-bold mb-4">Producto</h3>
            <ul className="space-y-3 text-sm">
              <li>
                <a href="#funcionalidades" className="hover:text-purple-400 transition-colors">
                  Funcionalidades
                </a>
              </li>
              <li>
                <a href="#precios" className="hover:text-purple-400 transition-colors">
                  Precios
                </a>
              </li>
              <li>
                <a href="#calculadora" className="hover:text-purple-400 transition-colors">
                  Calculadora ROI
                </a>
              </li>
              <li>
                <a href="/demo" className="hover:text-purple-400 transition-colors">
                  Demo en vivo
                </a>
              </li>
              <li>
                <a href="/changelog" className="hover:text-purple-400 transition-colors">
                  Actualizaciones
                </a>
              </li>
            </ul>
          </div>

          {/* Recursos */}
          <div>
            <h3 className="text-white font-bold mb-4">Recursos</h3>
            <ul className="space-y-3 text-sm">
              <li>
                <a href="/blog" className="hover:text-purple-400 transition-colors">
                  Blog
                </a>
              </li>
              <li>
                <a href="/academia" className="hover:text-purple-400 transition-colors">
                  Academia
                </a>
              </li>
              <li>
                <a href="/guias" className="hover:text-purple-400 transition-colors">
                  Guías
                </a>
              </li>
              <li>
                <a href="/ayuda" className="hover:text-purple-400 transition-colors">
                  Centro de ayuda
                </a>
              </li>
              <li>
                <a href="/api" className="hover:text-purple-400 transition-colors">
                  API Docs
                </a>
              </li>
            </ul>
          </div>

          {/* Contacto */}
          <div>
            <h3 className="text-white font-bold mb-4">Contacto</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-purple-400" />
                <a href="mailto:hola@elenaos.app" className="hover:text-purple-400 transition-colors">
                  hola@elenaos.app
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-purple-400" />
                <a href="tel:+34900123456" className="hover:text-purple-400 transition-colors">
                  +34 900 123 456
                </a>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="h-4 w-4 text-purple-400 mt-1 flex-shrink-0" />
                <span className="text-gray-400">
                  Calle Gran Vía, 123<br />
                  28013 Madrid, España
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-12 pt-8 border-t border-gray-800">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="text-sm text-gray-400">
              © 2026 ElenaOS. Todos los derechos reservados.
            </div>
            <div className="flex gap-6 text-sm">
              <a href="/privacidad" className="hover:text-purple-400 transition-colors">
                Privacidad
              </a>
              <a href="/terminos" className="hover:text-purple-400 transition-colors">
                Términos
              </a>
              <a href="/cookies" className="hover:text-purple-400 transition-colors">
                Cookies
              </a>
              <a href="/legal" className="hover:text-purple-400 transition-colors">
                Aviso Legal
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
