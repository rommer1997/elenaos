'use client'

import { useState, useEffect } from 'react'
import { Download, X } from 'lucide-react'
import { usePWAInstall } from '@/lib/pwa/pwa-install'

export function InstallPrompt() {
  const { isInstallable, isInstalled, installPWA } = usePWAInstall()
  const [showPrompt, setShowPrompt] = useState(false)
  const [isDismissed, setIsDismissed] = useState(false)

  useEffect(() => {
    // Verificar si el usuario ya rechazó el prompt
    const dismissed = localStorage.getItem('pwa-install-dismissed')
    if (dismissed) {
      setIsDismissed(true)
      return
    }

    // Mostrar prompt después de 30 segundos si es instalable
    if (isInstallable && !isInstalled) {
      const timer = setTimeout(() => {
        setShowPrompt(true)
      }, 30000)

      return () => clearTimeout(timer)
    }
  }, [isInstallable, isInstalled])

  const handleInstall = async () => {
    const installed = await installPWA()
    if (installed) {
      setShowPrompt(false)
    }
  }

  const handleDismiss = () => {
    setShowPrompt(false)
    setIsDismissed(true)
    localStorage.setItem('pwa-install-dismissed', 'true')
  }

  if (!showPrompt || isDismissed || isInstalled || !isInstallable) {
    return null
  }

  return (
    <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-96 z-50 animate-slide-up">
      <div className="bg-white rounded-xl shadow-2xl border border-gray-200 p-6">
        <button
          onClick={handleDismiss}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="flex items-start gap-4 mb-4">
          <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center flex-shrink-0">
            <Download className="h-6 w-6 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-gray-900 mb-1">
              Instala ElenaOS
            </h3>
            <p className="text-sm text-gray-600">
              Accede más rápido y recibe notificaciones en tiempo real
            </p>
          </div>
        </div>

        <div className="space-y-2 mb-4">
          <div className="flex items-center gap-2 text-sm text-gray-700">
            <div className="w-1.5 h-1.5 bg-purple-500 rounded-full"></div>
            <span>Funciona sin conexión</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-700">
            <div className="w-1.5 h-1.5 bg-purple-500 rounded-full"></div>
            <span>Notificaciones instantáneas</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-700">
            <div className="w-1.5 h-1.5 bg-purple-500 rounded-full"></div>
            <span>Acceso directo desde tu pantalla</span>
          </div>
        </div>

        <div className="flex gap-3">
          <button
            onClick={handleDismiss}
            className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
          >
            Ahora no
          </button>
          <button
            onClick={handleInstall}
            className="flex-1 px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-medium hover:from-purple-700 hover:to-pink-700 transition-all"
          >
            Instalar
          </button>
        </div>
      </div>
    </div>
  )
}
