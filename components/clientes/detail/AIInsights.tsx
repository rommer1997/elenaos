import { useState } from 'react'
import { Sparkles, RefreshCw, MessageSquare, Lightbulb, TrendingUp } from 'lucide-react'
import type { Client } from '@/types'

interface AIInsightsProps {
  client: Client
}

export function AIInsights({ client }: AIInsightsProps) {
  const [isGenerating, setIsGenerating] = useState(false)
  const [insights, setInsights] = useState(client.ai_notes)

  const generateInsights = async () => {
    setIsGenerating(true)

    try {
      const response = await fetch('/api/ai/generate-insights', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          clientId: client.id,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Error generando insights')
      }

      setInsights(data.insights)
    } catch (error) {
      console.error('Error generating insights:', error)
      alert('❌ Error generando insights con IA')
    } finally {
      setIsGenerating(false)
    }
  }

  const generateMessage = async () => {
    // TODO: Implementar generación de mensaje personalizado
    alert('Función de generación de mensajes próximamente')
  }

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Sparkles className="h-6 w-6 text-purple-600" />
          <h2 className="text-xl font-semibold text-gray-900">Análisis con IA</h2>
        </div>
        <button
          onClick={generateInsights}
          disabled={isGenerating}
          className="flex items-center gap-2 px-3 py-1.5 text-sm text-purple-700 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors disabled:opacity-50"
        >
          <RefreshCw className={`h-4 w-4 ${isGenerating ? 'animate-spin' : ''}`} />
          <span>{isGenerating ? 'Generando...' : 'Regenerar'}</span>
        </button>
      </div>

      {insights ? (
        <>
          <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-4 mb-4">
            <p className="text-sm text-gray-700 leading-relaxed">{insights}</p>
          </div>

          {/* AI Suggestions */}
          <div className="space-y-3">
            <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
              <Lightbulb className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div>
                <div className="text-sm font-medium text-gray-900 mb-1">
                  Recomendación de contacto
                </div>
                <div className="text-sm text-gray-700">
                  {client.churn_risk_score && client.churn_risk_score > 0.5
                    ? 'Enviar mensaje personalizado en las próximas 48 horas con oferta especial.'
                    : 'Enviar recordatorio amigable 3 días antes de la fecha predicha.'}
                </div>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 bg-green-50 rounded-lg">
              <TrendingUp className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
              <div>
                <div className="text-sm font-medium text-gray-900 mb-1">
                  Oportunidad de upselling
                </div>
                <div className="text-sm text-gray-700">
                  Cliente con alta fidelidad. Considerar ofrecer tratamientos premium o paquetes.
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="mt-4 pt-4 border-t border-gray-200">
            <button
              onClick={generateMessage}
              className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-medium hover:opacity-90 transition-opacity"
            >
              <MessageSquare className="h-5 w-5" />
              <span>Generar mensaje personalizado con IA</span>
            </button>
          </div>
        </>
      ) : (
        <div className="text-center py-8">
          <Sparkles className="h-12 w-12 text-gray-300 mx-auto mb-3" />
          <p className="text-sm text-gray-600 mb-4">
            No hay análisis generado aún para esta clienta
          </p>
          <button
            onClick={generateInsights}
            disabled={isGenerating}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50"
          >
            {isGenerating ? 'Generando...' : 'Generar análisis con IA'}
          </button>
        </div>
      )}
    </div>
  )
}
