import { Check, AlertTriangle, XCircle, TrendingUp } from 'lucide-react'
import type { Client } from '@/types'

interface ClientHeaderProps {
  client: Client
}

export function ClientHeader({ client }: ClientHeaderProps) {
  const getRiskBadge = () => {
    switch (client.risk_level) {
      case 'active':
        return {
          icon: Check,
          label: 'Activa',
          className: 'bg-green-100 text-green-800 border-green-200',
        }
      case 'warm':
        return {
          icon: TrendingUp,
          label: 'Tibia',
          className: 'bg-yellow-100 text-yellow-800 border-yellow-200',
        }
      case 'at_risk':
        return {
          icon: AlertTriangle,
          label: 'En riesgo',
          className: 'bg-orange-100 text-orange-800 border-orange-200',
        }
      case 'lost':
        return {
          icon: XCircle,
          label: 'Perdida',
          className: 'bg-red-100 text-red-800 border-red-200',
        }
      default:
        return {
          icon: Check,
          label: 'Activa',
          className: 'bg-gray-100 text-gray-800 border-gray-200',
        }
    }
  }

  const badge = getRiskBadge()
  const BadgeIcon = badge.icon

  return (
    <div className="flex items-start justify-between">
      <div className="flex items-start gap-4">
        {/* Avatar */}
        <div className="h-20 w-20 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 flex items-center justify-center text-white text-2xl font-bold flex-shrink-0">
          {client.first_name.charAt(0)}
          {client.last_name?.charAt(0)}
        </div>

        {/* Info */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            {client.first_name} {client.last_name}
          </h1>
          <div className="flex items-center gap-3 mt-2">
            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium border ${badge.className}`}>
              <BadgeIcon className="h-4 w-4" />
              {badge.label}
            </span>
            {client.tags && client.tags.map((tag) => (
              <span
                key={tag}
                className="inline-block px-3 py-1 text-sm font-medium bg-purple-100 text-purple-700 rounded-full"
              >
                {tag}
              </span>
            ))}
          </div>
          <div className="text-sm text-gray-600 mt-2">
            Cliente desde{' '}
            {new Date(client.created_at).toLocaleDateString('es-ES', {
              month: 'long',
              year: 'numeric',
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
