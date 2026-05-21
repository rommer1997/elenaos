'use client'

import { WifiOff, RefreshCw } from 'lucide-react'

export default function OfflinePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 flex items-center justify-center p-6">
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
        <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <WifiOff className="h-10 w-10 text-gray-400" />
        </div>

        <h1 className="text-2xl font-bold text-gray-900 mb-3">
          Sin conexión a internet
        </h1>

        <p className="text-gray-600 mb-6">
          No pudimos conectarnos a internet. Verifica tu conexión y vuelve a intentarlo.
        </p>

        <button
          onClick={() => window.location.reload()}
          className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-medium hover:from-purple-700 hover:to-pink-700 transition-all"
        >
          <RefreshCw className="h-5 w-5" />
          Reintentar conexión
        </button>

        <div className="mt-6 pt-6 border-t border-gray-200">
          <p className="text-sm text-gray-500">
            💡 Algunas funciones pueden estar disponibles offline si las has usado recientemente
          </p>
        </div>
      </div>
    </div>
  )
}
