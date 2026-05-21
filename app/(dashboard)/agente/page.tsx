import { ConversationViewer } from '@/components/agent/ConversationViewer'
import { AgentSettings } from '@/components/agent/AgentSettings'

export default function AgentPage() {
  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Agente de Reservas</h1>
        <p className="text-gray-600 mt-2">
          Asistente autónomo con IA que gestiona citas por WhatsApp
        </p>
      </div>

      {/* Grid layout */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Configuración */}
        <div>
          <AgentSettings />
        </div>

        {/* Vista de conversación */}
        <div className="h-[800px]">
          <ConversationViewer
            clientId="mock-client-1"
            clientName="María López"
            clientPhone="+34 612 345 678"
          />
        </div>
      </div>

      {/* Info sobre el agente */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
        <h3 className="font-bold text-blue-900 mb-2">💡 Cómo funciona el agente</h3>
        <div className="space-y-2 text-sm text-blue-800">
          <p>
            <strong>1. Procesamiento con IA:</strong> Claude analiza cada mensaje entrante para detectar la intención (crear cita, modificar, cancelar, etc.)
          </p>
          <p>
            <strong>2. Extracción de entidades:</strong> Identifica automáticamente el servicio, fecha, hora y otros detalles mencionados
          </p>
          <p>
            <strong>3. Respuesta natural:</strong> Genera respuestas en español de forma conversacional y profesional
          </p>
          <p>
            <strong>4. Ejecución de acciones:</strong> Si tiene toda la información y alta confianza, crea/modifica citas automáticamente
          </p>
          <p>
            <strong>5. Escalado humano:</strong> Si la intención no está clara o falta información crítica, pide ayuda humana
          </p>
        </div>
      </div>
    </div>
  )
}
