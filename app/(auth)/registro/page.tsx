import Link from 'next/link'
import { signup } from '../actions'

export default function RegisterPage() {
  return (
    <div className="bg-white rounded-2xl shadow-xl p-8">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Crear tu salón</h2>
        <p className="text-gray-600 mt-1">
          Empieza gratis, sin tarjeta de crédito
        </p>
      </div>

      <form action={signup} className="space-y-4">
        {/* Datos del salón */}
        <div className="space-y-4 pb-4 border-b border-gray-200">
          <h3 className="text-sm font-semibold text-gray-900">
            📍 Datos de tu salón
          </h3>

          {/* Salon Name */}
          <div>
            <label
              htmlFor="salonName"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Nombre del salón
            </label>
            <input
              id="salonName"
              name="salonName"
              type="text"
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="Belleza Laura"
            />
          </div>
        </div>

        {/* Datos personales */}
        <div className="space-y-4 pt-2">
          <h3 className="text-sm font-semibold text-gray-900">
            👤 Tus datos
          </h3>

          {/* First Name */}
          <div>
            <label
              htmlFor="firstName"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Nombre
            </label>
            <input
              id="firstName"
              name="firstName"
              type="text"
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="Laura"
            />
          </div>

          {/* Last Name */}
          <div>
            <label
              htmlFor="lastName"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Apellido
            </label>
            <input
              id="lastName"
              name="lastName"
              type="text"
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="García"
            />
          </div>

          {/* Email */}
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="laura@bellezalaura.com"
            />
          </div>

          {/* Password */}
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Contraseña
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="new-password"
              required
              minLength={6}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="••••••••"
            />
            <p className="text-xs text-gray-500 mt-1">
              Mínimo 6 caracteres
            </p>
          </div>
        </div>

        {/* Terms */}
        <div className="flex items-start">
          <input
            id="terms"
            name="terms"
            type="checkbox"
            required
            className="h-4 w-4 mt-1 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
          />
          <label htmlFor="terms" className="ml-2 text-sm text-gray-600">
            Acepto los{' '}
            <Link href="/terminos" className="text-purple-600 hover:text-purple-700">
              términos y condiciones
            </Link>{' '}
            y la{' '}
            <Link href="/privacidad" className="text-purple-600 hover:text-purple-700">
              política de privacidad
            </Link>
          </label>
        </div>

        {/* Submit button */}
        <button
          type="submit"
          className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 rounded-lg font-medium hover:from-purple-700 hover:to-pink-700 transition-all"
        >
          Crear mi salón gratis
        </button>
      </form>

      {/* Login link */}
      <div className="mt-6 text-center">
        <p className="text-sm text-gray-600">
          ¿Ya tienes cuenta?{' '}
          <Link
            href="/login"
            className="font-medium text-purple-600 hover:text-purple-700"
          >
            Inicia sesión
          </Link>
        </p>
      </div>

      {/* Trial benefits */}
      <div className="mt-6 p-4 bg-purple-50 rounded-lg border border-purple-100">
        <p className="text-xs font-semibold text-purple-900 mb-2">
          ✨ Incluido en tu prueba gratis:
        </p>
        <ul className="text-xs text-purple-800 space-y-1">
          <li>✓ Agenda inteligente con tiempo real</li>
          <li>✓ CRM con IA y predicción de churn</li>
          <li>✓ 200 mensajes WhatsApp automáticos</li>
          <li>✓ Facturación fiscal España</li>
        </ul>
      </div>
    </div>
  )
}
