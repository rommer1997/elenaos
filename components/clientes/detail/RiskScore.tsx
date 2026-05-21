import { AlertTriangle, TrendingUp, Calendar, Clock } from 'lucide-react'
import type { Client } from '@/types'

interface RiskScoreProps {
  client: Client
}

export function RiskScore({ client }: RiskScoreProps) {
  const riskPercentage = Math.round((client.churn_risk_score || 0) * 100)

  const getRiskColor = () => {
    if (riskPercentage < 30) return 'text-green-600'
    if (riskPercentage < 60) return 'text-yellow-600'
    if (riskPercentage < 80) return 'text-orange-600'
    return 'text-red-600'
  }

  const getRiskBarColor = () => {
    if (riskPercentage < 30) return 'bg-green-500'
    if (riskPercentage < 60) return 'bg-yellow-500'
    if (riskPercentage < 80) return 'bg-orange-500'
    return 'bg-red-500'
  }

  const getRiskMessage = () => {
    if (riskPercentage < 30) {
      return {
        title: '¡Excelente! Cliente muy fiel',
        message: 'Esta clienta tiene un patrón de visitas regular y consistente. Sigue enviando recordatorios amigables para mantener la relación.',
        icon: TrendingUp,
        color: 'text-green-600',
        bg: 'bg-green-50',
      }
    }
    if (riskPercentage < 60) {
      return {
        title: 'Cliente estable',
        message: 'La clienta visita regularmente pero podría beneficiarse de recordatorios ocasionales o alguna oferta especial.',
        icon: Calendar,
        color: 'text-yellow-600',
        bg: 'bg-yellow-50',
      }
    }
    if (riskPercentage < 80) {
      return {
        title: '⚠️ Atención: Cliente en riesgo',
        message: 'Han pasado más días de lo normal desde su última visita. Recomendamos enviar un mensaje personalizado pronto.',
        icon: AlertTriangle,
        color: 'text-orange-600',
        bg: 'bg-orange-50',
      }
    }
    return {
      title: '🚨 Riesgo alto de pérdida',
      message: 'Esta clienta lleva mucho tiempo sin visitarnos. Es crucial contactarla con una oferta especial o preguntarle si todo está bien.',
      icon: AlertTriangle,
      color: 'text-red-600',
      bg: 'bg-red-50',
    }
  }

  const riskInfo = getRiskMessage()
  const RiskIcon = riskInfo.icon

  const daysSinceLastVisit = client.last_visit_date
    ? Math.floor(
        (Date.now() - new Date(client.last_visit_date).getTime()) / (1000 * 60 * 60 * 24)
      )
    : null

  const daysUntilPredicted = client.predicted_next_visit
    ? Math.floor(
        (new Date(client.predicted_next_visit).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
      )
    : null

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">Score de Retención</h2>

      {/* Risk meter */}
      <div className="mb-6">
        <div className="flex items-end justify-between mb-2">
          <span className="text-sm font-medium text-gray-600">Riesgo de pérdida</span>
          <span className={`text-3xl font-bold ${getRiskColor()}`}>{riskPercentage}%</span>
        </div>
        <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
          <div
            className={`h-full ${getRiskBarColor()} transition-all duration-500`}
            style={{ width: `${riskPercentage}%` }}
          />
        </div>
      </div>

      {/* Risk explanation */}
      <div className={`${riskInfo.bg} border border-${riskInfo.color.replace('text-', '')} rounded-lg p-4 mb-6`}>
        <div className="flex items-start gap-3">
          <RiskIcon className={`h-6 w-6 ${riskInfo.color} flex-shrink-0 mt-0.5`} />
          <div>
            <h3 className="font-semibold text-gray-900 mb-1">{riskInfo.title}</h3>
            <p className="text-sm text-gray-700">{riskInfo.message}</p>
          </div>
        </div>
      </div>

      {/* Key metrics */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <Clock className="h-4 w-4 text-gray-500" />
            <span className="text-xs font-medium text-gray-600 uppercase">Última visita</span>
          </div>
          <div className="text-2xl font-bold text-gray-900">
            {daysSinceLastVisit !== null ? `${daysSinceLastVisit}` : '-'}
          </div>
          <div className="text-xs text-gray-500">días atrás</div>
        </div>

        <div className="bg-gray-50 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <Calendar className="h-4 w-4 text-gray-500" />
            <span className="text-xs font-medium text-gray-600 uppercase">Próxima predicha</span>
          </div>
          <div className="text-2xl font-bold text-gray-900">
            {daysUntilPredicted !== null ? (
              daysUntilPredicted > 0 ? `${daysUntilPredicted}` : 'Retrasada'
            ) : (
              '-'
            )}
          </div>
          <div className="text-xs text-gray-500">
            {daysUntilPredicted !== null && daysUntilPredicted > 0 ? 'días' : ''}
          </div>
        </div>
      </div>

      {/* Factors */}
      <div className="mt-6 pt-6 border-t border-gray-200">
        <h4 className="text-sm font-semibold text-gray-900 mb-3">Factores del score:</h4>
        <div className="space-y-2 text-sm text-gray-700">
          <div className="flex items-start gap-2">
            <span className="text-purple-600">•</span>
            <span>
              Frecuencia promedio: cada {client.avg_visit_interval_days} días
            </span>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-purple-600">•</span>
            <span>Número total de visitas: {client.visit_count}</span>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-purple-600">•</span>
            <span>
              Días desde última visita vs. promedio:{' '}
              {daysSinceLastVisit && client.avg_visit_interval_days
                ? `${Math.round(
                    (daysSinceLastVisit / client.avg_visit_interval_days) * 100
                  )}%`
                : '-'}
            </span>
          </div>
          {client.marketing_consent && (
            <div className="flex items-start gap-2">
              <span className="text-green-600">✓</span>
              <span>Acepta comunicaciones de marketing</span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
