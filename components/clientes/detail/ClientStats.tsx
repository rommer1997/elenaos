import { Calendar, Euro, TrendingUp, Clock } from 'lucide-react'
import type { Client } from '@/types'

interface ClientStatsProps {
  client: Client
}

export function ClientStats({ client }: ClientStatsProps) {
  const stats = [
    {
      label: 'Valor total (LTV)',
      value: `${client.lifetime_value.toFixed(2)}€`,
      icon: Euro,
      color: 'text-green-600',
      bg: 'bg-green-100',
    },
    {
      label: 'Total de visitas',
      value: client.visit_count.toString(),
      icon: Calendar,
      color: 'text-blue-600',
      bg: 'bg-blue-100',
    },
    {
      label: 'Frecuencia media',
      value: `${client.avg_visit_interval_days} días`,
      icon: Clock,
      color: 'text-purple-600',
      bg: 'bg-purple-100',
    },
    {
      label: 'Ticket promedio',
      value: `${(client.lifetime_value / client.visit_count).toFixed(2)}€`,
      icon: TrendingUp,
      color: 'text-orange-600',
      bg: 'bg-orange-100',
    },
  ]

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">Estadísticas</h2>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <div key={stat.label} className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <div className={`p-2 rounded-lg ${stat.bg}`}>
                  <Icon className={`h-4 w-4 ${stat.color}`} />
                </div>
              </div>
              <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
              <div className="text-xs text-gray-600 mt-1">{stat.label}</div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
