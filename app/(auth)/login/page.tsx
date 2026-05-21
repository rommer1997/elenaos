import Link from 'next/link'
import { login } from '../actions'

export default function LoginPage() {
  return (
    <div className="bg-white rounded-2xl shadow-xl p-8">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Iniciar sesión</h2>
        <p className="text-gray-600 mt-1">
          Accede a tu salón
        </p>
      </div>

      <form action={login} className="space-y-4">
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
            placeholder="tu@email.com"
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
            autoComplete="current-password"
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            placeholder="••••••••"
          />
        </div>

        {/* Forgot password */}
        <div className="text-right">
          <Link
            href="/recuperar-password"
            className="text-sm text-purple-600 hover:text-purple-700"
          >
            ¿Olvidaste tu contraseña?
          </Link>
        </div>

        {/* Submit button */}
        <button
          type="submit"
          className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 rounded-lg font-medium hover:from-purple-700 hover:to-pink-700 transition-all"
        >
          Iniciar sesión
        </button>
      </form>

      {/* Divider */}
      <div className="relative my-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-300" />
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-2 bg-white text-gray-500">o</span>
        </div>
      </div>

      {/* Signup link */}
      <div className="text-center">
        <p className="text-sm text-gray-600">
          ¿No tienes cuenta?{' '}
          <Link
            href="/registro"
            className="font-medium text-purple-600 hover:text-purple-700"
          >
            Crea tu salón gratis
          </Link>
        </p>
      </div>

      {/* Trial notice */}
      <div className="mt-6 p-4 bg-purple-50 rounded-lg border border-purple-100">
        <p className="text-sm text-purple-800 text-center">
          🎉 <strong>14 días gratis</strong> sin tarjeta de crédito
        </p>
      </div>
    </div>
  )
}
