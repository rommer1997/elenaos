'use client'

import { useState } from 'react'
import { Bot, Clock, MessageSquare, Settings, Zap } from 'lucide-react'

interface AgentConfig {
  enabled: boolean
  responseDelay: number // seconds
  workingHours: {
    start: string
    end: string
  }
  autoConfirm: boolean
  requireHumanApproval: boolean
  maxConcurrentConversations: number
  language: 'es' | 'ca' | 'en'
}

export function AgentSettings() {
  const [config, setConfig] = useState<AgentConfig>({
    enabled: true,
    responseDelay: 2,
    workingHours: {
      start: '09:00',
      end: '20:00'
    },
    autoConfirm: true,
    requireHumanApproval: false,
    maxConcurrentConversations: 10,
    language: 'es'
  })

  const [isSaving, setIsSaving] = useState(false)

  const handleSave = async () => {
    setIsSaving(true)

    // TODO: Guardar configuración en Supabase
    await new Promise(resolve => setTimeout(resolve, 1000))

    setIsSaving(false)
    alert('Configuración guardada ✅')
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
          <Bot className="h-6 w-6 text-purple-600" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-gray-900">Agente de Reservas</h2>
          <p className="text-sm text-gray-600">Configuración del asistente autónomo</p>
        </div>
      </div>

      <div className="space-y-6">
        {/* Estado del agente */}
        <div className="flex items-center justify-between p-4 bg-purple-50 rounded-lg border border-purple-200">
          <div className="flex items-center gap-3">
            <Zap className={`h-5 w-5 ${config.enabled ? 'text-green-600' : 'text-gray-400'}`} />
            <div>
              <h3 className="font-medium text-gray-900">Estado del agente</h3>
              <p className="text-sm text-gray-600">
                {config.enabled ? '🟢 Activo y respondiendo' : '🔴 Desactivado'}
              </p>
            </div>
          </div>
          <button
            onClick={() => setConfig({ ...config, enabled: !config.enabled })}
            className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors ${
              config.enabled ? 'bg-green-500' : 'bg-gray-300'
            }`}
          >
            <span
              className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${
                config.enabled ? 'translate-x-7' : 'translate-x-1'
              }`}
            />
          </button>
        </div>

        {/* Retraso de respuesta */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Clock className="inline h-4 w-4 mr-1" />
            Retraso de respuesta
          </label>
          <div className="flex items-center gap-4">
            <input
              type="range"
              min="0"
              max="10"
              value={config.responseDelay}
              onChange={(e) => setConfig({ ...config, responseDelay: parseInt(e.target.value) })}
              className="flex-1"
            />
            <span className="text-sm font-medium text-gray-900 w-20">
              {config.responseDelay}s
            </span>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Tiempo de espera antes de responder (más natural)
          </p>
        </div>

        {/* Horario de trabajo */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Clock className="inline h-4 w-4 mr-1" />
            Horario de atención
          </label>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-gray-600">Inicio</label>
              <input
                type="time"
                value={config.workingHours.start}
                onChange={(e) => setConfig({
                  ...config,
                  workingHours: { ...config.workingHours, start: e.target.value }
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
            <div>
              <label className="text-xs text-gray-600">Fin</label>
              <input
                type="time"
                value={config.workingHours.end}
                onChange={(e) => setConfig({
                  ...config,
                  workingHours: { ...config.workingHours, end: e.target.value }
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Fuera de este horario, el agente dirá que está cerrado
          </p>
        </div>

        {/* Confirmación automática */}
        <div className="flex items-start gap-3">
          <input
            type="checkbox"
            checked={config.autoConfirm}
            onChange={(e) => setConfig({ ...config, autoConfirm: e.target.checked })}
            className="mt-1"
          />
          <div className="flex-1">
            <label className="text-sm font-medium text-gray-700">
              Confirmación automática de citas
            </label>
            <p className="text-xs text-gray-500">
              El agente confirmará citas automáticamente sin intervención humana
            </p>
          </div>
        </div>

        {/* Aprobación humana */}
        <div className="flex items-start gap-3">
          <input
            type="checkbox"
            checked={config.requireHumanApproval}
            onChange={(e) => setConfig({ ...config, requireHumanApproval: e.target.checked })}
            className="mt-1"
          />
          <div className="flex-1">
            <label className="text-sm font-medium text-gray-700">
              Requerir aprobación humana
            </label>
            <p className="text-xs text-gray-500">
              Las citas creadas por el agente necesitarán aprobación antes de confirmar
            </p>
          </div>
        </div>

        {/* Conversaciones máximas */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <MessageSquare className="inline h-4 w-4 mr-1" />
            Conversaciones simultáneas máximas
          </label>
          <input
            type="number"
            min="1"
            max="50"
            value={config.maxConcurrentConversations}
            onChange={(e) => setConfig({ ...config, maxConcurrentConversations: parseInt(e.target.value) })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
          <p className="text-xs text-gray-500 mt-1">
            Número máximo de conversaciones que el agente puede manejar al mismo tiempo
          </p>
        </div>

        {/* Idioma */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Idioma del agente
          </label>
          <select
            value={config.language}
            onChange={(e) => setConfig({ ...config, language: e.target.value as 'es' | 'ca' | 'en' })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <option value="es">Español</option>
            <option value="ca">Catalán</option>
            <option value="en">English</option>
          </select>
        </div>

        {/* Estadísticas */}
        <div className="pt-6 border-t border-gray-200">
          <h3 className="font-medium text-gray-900 mb-4">Estadísticas del agente</h3>
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-gray-900">142</div>
              <div className="text-xs text-gray-600">Mensajes procesados</div>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">87%</div>
              <div className="text-xs text-gray-600">Precisión</div>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">23</div>
              <div className="text-xs text-gray-600">Citas creadas</div>
            </div>
          </div>
        </div>

        {/* Botón guardar */}
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="w-full px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-medium hover:from-purple-700 hover:to-pink-700 transition-all disabled:opacity-50"
        >
          {isSaving ? 'Guardando...' : 'Guardar configuración'}
        </button>
      </div>
    </div>
  )
}
