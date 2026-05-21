'use client'

import { useState, useEffect } from 'react'
import { RefreshCw, X } from 'lucide-react'

export function UpdatePrompt() {
  const [showPrompt, setShowPrompt] = useState(false)
  const [registration, setRegistration] = useState<ServiceWorkerRegistration | null>(null)

  useEffect(() => {
    if (typeof window === 'undefined' || !('serviceWorker' in navigator)) {
      return
    }

    const checkForUpdates = async () => {
      const reg = await navigator.serviceWorker.ready

      reg.addEventListener('updatefound', () => {
        const newWorker = reg.installing
        if (!newWorker) return

        newWorker.addEventListener('statechange', () => {
          if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
            setRegistration(reg)
            setShowPrompt(true)
          }
        })
      })
    }

    checkForUpdates()
  }, [])

  const handleUpdate = () => {
    if (registration?.waiting) {
      registration.waiting.postMessage({ type: 'SKIP_WAITING' })
      window.location.reload()
    }
  }

  const handleDismiss = () => {
    setShowPrompt(false)
  }

  if (!showPrompt) {
    return null
  }

  return (
    <div className="fixed top-4 left-4 right-4 md:left-auto md:right-4 md:w-96 z-50 animate-slide-down">
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl shadow-2xl p-4">
        <button
          onClick={handleDismiss}
          className="absolute top-3 right-3 text-white/80 hover:text-white"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="flex items-start gap-3 mb-3">
          <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center flex-shrink-0">
            <RefreshCw className="h-5 w-5" />
          </div>
          <div>
            <h3 className="font-bold mb-1">
              Nueva versión disponible
            </h3>
            <p className="text-sm text-white/90">
              Actualiza ahora para obtener las últimas mejoras y correcciones
            </p>
          </div>
        </div>

        <div className="flex gap-2">
          <button
            onClick={handleDismiss}
            className="flex-1 px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg font-medium transition-colors"
          >
            Después
          </button>
          <button
            onClick={handleUpdate}
            className="flex-1 px-4 py-2 bg-white text-purple-600 hover:bg-white/90 rounded-lg font-medium transition-colors"
          >
            Actualizar
          </button>
        </div>
      </div>
    </div>
  )
}
