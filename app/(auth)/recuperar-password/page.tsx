'use client'

import Link from 'next/link'
import { Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { requestPasswordReset } from '../actions'

function PasswordRecoveryForm() {
  const searchParams = useSearchParams()
  const error = searchParams.get('error')
  const success = searchParams.get('success')

  return (
    <div className="bg-white rounded-2xl shadow-xl p-8">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Recuperar contraseña</h2>
        <p className="text-gray-600 mt-1">
          Te enviaremos un enlace seguro para volver a entrar.
        </p>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-800">
            <strong>Error:</strong> {error}
          </p>
        </div>
      )}

      {success && (
        <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg">
          <p className="text-sm text-green-800">
            Revisa tu email. Si existe una cuenta con ese correo, recibirás un enlace de recuperación.
          </p>
        </div>
      )}

      <form action={requestPasswordReset} className="space-y-4">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            placeholder="tu@email.com"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 rounded-lg font-medium hover:from-purple-700 hover:to-pink-700 transition-all"
        >
          Enviar enlace
        </button>
      </form>

      <div className="mt-6 text-center">
        <Link href="/login" className="text-sm font-medium text-purple-600 hover:text-purple-700">
          Volver al login
        </Link>
      </div>
    </div>
  )
}

export default function PasswordRecoveryPage() {
  return (
    <Suspense fallback={<div>Cargando...</div>}>
      <PasswordRecoveryForm />
    </Suspense>
  )
}
