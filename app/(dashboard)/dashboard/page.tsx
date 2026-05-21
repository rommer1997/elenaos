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
    <div className="max-w-4xl mx-auto p-8">
      {/* Header */}
      <div className="bg-white rounded-2xl shadow-sm p-8 mb-6">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
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
      <div className="bg-white rounded-2xl shadow-sm p-8 mb-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          👤 Tu información
        </h2>
        <dl className="space-y-3">
          <div>
            <dt className="text-sm font-medium text-gray-500">Nombre</dt>
            <dd className="text-lg text-gray-900">
              {profile?.first_name} {profile?.last_name}
            </dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-gray-500">Email</dt>
            <dd className="text-lg text-gray-900">{user?.email}</dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-gray-500">Rol</dt>
            <dd className="text-lg text-gray-900">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800">
                {profile?.role}
              </span>
            </dd>
          </div>
        </dl>
      </div>

      {/* Salon Info */}
      <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl shadow-lg p-8 text-white mb-6">
        <h2 className="text-xl font-semibold mb-4">💅 Tu salón</h2>
        <dl className="space-y-3">
          <div>
            <dt className="text-purple-100 text-sm">Nombre</dt>
            <dd className="text-2xl font-bold">{tenant?.name}</dd>
          </div>
          <div>
            <dt className="text-purple-100 text-sm">URL</dt>
            <dd className="font-mono text-sm">
              {tenant?.subdomain}.elenaos.app
            </dd>
          </div>
          <div>
            <dt className="text-purple-100 text-sm">Plan</dt>
            <dd className="text-lg">
              {tenant?.plan_type === 'starter' && '🌟 Starter'}
              {tenant?.plan_type === 'growth' && '🚀 Growth'}
              {tenant?.plan_type === 'studio_pro' && '💎 Studio Pro'}
            </dd>
          </div>
          {tenant?.trial_ends_at && (
            <div>
              <dt className="text-purple-100 text-sm">Trial termina</dt>
              <dd className="text-lg">
                {new Date(tenant.trial_ends_at).toLocaleDateString('es-ES', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                })}
              </dd>
            </div>
          )}
        </dl>
      </div>

      {/* Next Steps */}
      <div className="bg-blue-50 border border-blue-200 rounded-2xl p-8">
        <h2 className="text-xl font-semibold text-blue-900 mb-4">
          🚀 Próximos pasos
        </h2>
        <p className="text-blue-800 mb-4">
          ¡Tu cuenta está lista! Ahora estamos construyendo el dashboard completo.
        </p>
        <ul className="space-y-2 text-blue-800">
          <li className="flex items-start">
            <span className="mr-2">⏳</span>
            <span>
              <strong>Tarea #4:</strong> Layout del dashboard con sidebar y temas
            </span>
          </li>
          <li className="flex items-start">
            <span className="mr-2">⏳</span>
            <span>
              <strong>Tarea #5:</strong> Módulo de agenda completo
            </span>
          </li>
          <li className="flex items-start">
            <span className="mr-2">⏳</span>
            <span>
              <strong>Tarea #6-7:</strong> CRM de clientas con IA
            </span>
          </li>
        </ul>
      </div>
    </div>
  )
}
