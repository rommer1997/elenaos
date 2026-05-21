'use client'

import { useUser } from '@/hooks/useUser'
import { logout } from '../../(auth)/actions'

export default function DashboardPage() {
  const { user, profile, tenant, isLoading } = useUser()

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-8">
      {/* Header */}
      <div className="bg-white rounded-2xl shadow-sm p-6 sm:p-8 mb-6">
        <div className="flex items-start justify-between flex-col sm:flex-row gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
              ¡Bienvenido a ElenaOS! 🎉
            </h1>
            <p className="text-gray-600 mt-2">
              Tu sistema operativo para centros de estética
            </p>
          </div>
          <form action={logout}>
            <button
              type="submit"
              className="px-4 py-2 text-sm text-gray-700 hover:text-gray-900 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cerrar sesión
            </button>
          </form>
        </div>
      </div>

      {/* User Info */}
      <div className="bg-white rounded-2xl shadow-sm p-6 sm:p-8 mb-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          👤 Tu información
        </h2>
        <dl className="space-y-3">
          <div>
            <dt className="text-sm font-medium text-gray-500">Nombre</dt>
            <dd className="text-lg text-gray-900">
              {profile?.full_name || 'Usuario'}
            </dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-gray-500">Email</dt>
            <dd className="text-lg text-gray-900 break-words">{user?.email}</dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-gray-500">Rol</dt>
            <dd className="text-lg text-gray-900">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800">
                {profile?.role || 'Propietario'}
              </span>
            </dd>
          </div>
        </dl>
      </div>

      {/* Salon Info */}
      <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl shadow-lg p-6 sm:p-8 text-white mb-6">
        <h2 className="text-xl font-semibold mb-4">💅 Tu salón</h2>
        <dl className="space-y-3">
          <div>
            <dt className="text-purple-100 text-sm">Nombre</dt>
            <dd className="text-2xl font-bold">{tenant?.name || 'Mi Salón'}</dd>
          </div>
          <div>
            <dt className="text-purple-100 text-sm">Plan</dt>
            <dd className="text-lg">🌟 Plan Starter</dd>
          </div>
          <div>
            <dt className="text-purple-100 text-sm">Estado</dt>
            <dd className="text-lg">✅ Activo - Período de prueba</dd>
          </div>
        </dl>
      </div>

      {/* Next Steps */}
      <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6 sm:p-8">
        <h2 className="text-xl font-semibold text-blue-900 mb-4">
          🚀 Próximos pasos
        </h2>
        <p className="text-blue-800 mb-4">
          ¡Tu cuenta está lista! Explora las funcionalidades del dashboard.
        </p>
        <ul className="space-y-2 text-blue-800">
          <li className="flex items-start">
            <span className="mr-2">📅</span>
            <span>
              <strong>Agenda:</strong> Gestiona tus citas y servicios
            </span>
          </li>
          <li className="flex items-start">
            <span className="mr-2">👥</span>
            <span>
              <strong>Clientes:</strong> Administra tu base de datos de clientes
            </span>
          </li>
          <li className="flex items-start">
            <span className="mr-2">🤖</span>
            <span>
              <strong>Agente IA:</strong> Análisis inteligente de retención
            </span>
          </li>
        </ul>
      </div>
    </div>
  )
}
