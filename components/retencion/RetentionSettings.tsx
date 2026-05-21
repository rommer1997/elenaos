'use client'

import { useState } from 'react'
import { Settings, Save, Bell, Clock, Target, Zap } from 'lucide-react'

export function RetentionSettings() {
  const [settings, setSettings] = useState({
    enabled: true,
    minRiskScore: 0.40,
    analysisFrequency: 'daily',
    preferredSendTimes: ['11:00', '17:00'],
    excludeDays: [0], // 0 = Sunday
    autoSendEnabled: true,
    highPriorityThreshold: 0.70,
    notificationsEnabled: true
  })

  const [isSaving, setIsSaving] = useState(false)

  const handleSave = async () => {
    setIsSaving(true)

    try {
      // TODO: Implementar guardado en BD
      await new Promise(resolve => setTimeout(resolve, 1000))

      alert('✅ Configuración guardada correctamente')
    } catch (error) {
      console.error('Error saving settings:', error)
      alert('❌ Error guardando configuración')
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Configuración de Retención</h2>
        <p className="text-gray-600 mt-1">
          Personaliza cómo funciona el sistema automático de retención
        </p>
      </div>

      {/* Main settings */}
      <div className="bg-white rounded-lg shadow-sm p-6 space-y-6">
        {/* Enable/Disable */}
        <div className="flex items-center justify-between pb-6 border-b border-gray-200">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Zap className="h-5 w-5 text-purple-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Sistema de Retención Automático</h3>
              <p className="text-sm text-gray-600 mt-1">
                Cuando está activo, el sistema detecta y contacta automáticamente clientas en riesgo
              </p>
            </div>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={settings.enabled}
              onChange={(e) => setSettings({ ...settings, enabled: e.target.checked })}
              className="sr-only peer"
            />
            <div className="w-14 h-7 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:start-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-purple-600"></div>
          </label>
        </div>

        {/* Risk threshold */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Target className="h-5 w-5 text-gray-600" />
            <h3 className="font-semibold text-gray-900">Umbral de Riesgo Mínimo</h3>
          </div>
          <p className="text-sm text-gray-600 mb-4">
            Solo se crearán campañas para clientas con un score de riesgo igual o superior a este valor
          </p>
          <div className="flex items-center gap-4">
            <input
              type="range"
              min="0.3"
              max="0.8"
              step="0.05"
              value={settings.minRiskScore}
              onChange={(e) => setSettings({ ...settings, minRiskScore: parseFloat(e.target.value) })}
              className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-purple-600"
            />
            <div className="text-lg font-bold text-gray-900 min-w-[60px]">
              {Math.round(settings.minRiskScore * 100)}%
            </div>
          </div>
          <div className="flex justify-between text-xs text-gray-500 mt-2">
            <span>30% (Más clientas)</span>
            <span>80% (Solo alto riesgo)</span>
          </div>
        </div>

        {/* High priority threshold */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Bell className="h-5 w-5 text-gray-600" />
            <h3 className="font-semibold text-gray-900">Umbral de Alta Prioridad</h3>
          </div>
          <p className="text-sm text-gray-600 mb-4">
            Clientas con este score o superior se enviarán en las próximas 24h
          </p>
          <div className="flex items-center gap-4">
            <input
              type="range"
              min="0.5"
              max="0.9"
              step="0.05"
              value={settings.highPriorityThreshold}
              onChange={(e) => setSettings({ ...settings, highPriorityThreshold: parseFloat(e.target.value) })}
              className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-red-600"
            />
            <div className="text-lg font-bold text-gray-900 min-w-[60px]">
              {Math.round(settings.highPriorityThreshold * 100)}%
            </div>
          </div>
        </div>

        {/* Analysis frequency */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Clock className="h-5 w-5 text-gray-600" />
            <h3 className="font-semibold text-gray-900">Frecuencia de Análisis</h3>
          </div>
          <p className="text-sm text-gray-600 mb-4">
            Con qué frecuencia el sistema debe analizar y detectar clientas en riesgo
          </p>
          <select
            value={settings.analysisFrequency}
            onChange={(e) => setSettings({ ...settings, analysisFrequency: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          >
            <option value="hourly">Cada hora (Máximo)</option>
            <option value="daily">Diario (Recomendado)</option>
            <option value="weekly">Semanal</option>
            <option value="manual">Solo manual</option>
          </select>
        </div>

        {/* Preferred send times */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Clock className="h-5 w-5 text-gray-600" />
            <h3 className="font-semibold text-gray-900">Horarios Preferidos de Envío</h3>
          </div>
          <p className="text-sm text-gray-600 mb-4">
            El sistema programará los envíos en estos horarios
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {['09:00', '11:00', '15:00', '17:00', '19:00'].map((time) => (
              <label
                key={time}
                className="flex items-center gap-2 p-3 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-purple-300 transition-colors"
              >
                <input
                  type="checkbox"
                  checked={settings.preferredSendTimes.includes(time)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setSettings({
                        ...settings,
                        preferredSendTimes: [...settings.preferredSendTimes, time]
                      })
                    } else {
                      setSettings({
                        ...settings,
                        preferredSendTimes: settings.preferredSendTimes.filter(t => t !== time)
                      })
                    }
                  }}
                  className="w-4 h-4 text-purple-600 bg-gray-100 border-gray-300 rounded focus:ring-purple-500"
                />
                <span className="text-sm font-medium text-gray-900">{time}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Exclude days */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Clock className="h-5 w-5 text-gray-600" />
            <h3 className="font-semibold text-gray-900">Días Excluidos</h3>
          </div>
          <p className="text-sm text-gray-600 mb-4">
            No se enviarán mensajes en estos días
          </p>
          <div className="grid grid-cols-7 gap-2">
            {['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'].map((day, index) => (
              <label
                key={day}
                className={`flex items-center justify-center p-3 border-2 rounded-lg cursor-pointer transition-colors ${
                  settings.excludeDays.includes(index)
                    ? 'border-red-300 bg-red-50 text-red-700'
                    : 'border-gray-200 hover:border-purple-300'
                }`}
              >
                <input
                  type="checkbox"
                  checked={settings.excludeDays.includes(index)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setSettings({
                        ...settings,
                        excludeDays: [...settings.excludeDays, index]
                      })
                    } else {
                      setSettings({
                        ...settings,
                        excludeDays: settings.excludeDays.filter(d => d !== index)
                      })
                    }
                  }}
                  className="sr-only"
                />
                <span className="text-sm font-medium">{day}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Auto-send */}
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-gray-900">Envío Automático</h3>
            <p className="text-sm text-gray-600 mt-1">
              Las campañas programadas se enviarán automáticamente sin intervención manual
            </p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={settings.autoSendEnabled}
              onChange={(e) => setSettings({ ...settings, autoSendEnabled: e.target.checked })}
              className="sr-only peer"
            />
            <div className="w-14 h-7 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:start-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-purple-600"></div>
          </label>
        </div>

        {/* Notifications */}
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-gray-900">Notificaciones</h3>
            <p className="text-sm text-gray-600 mt-1">
              Recibir notificaciones sobre respuestas de clientas y conversiones
            </p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={settings.notificationsEnabled}
              onChange={(e) => setSettings({ ...settings, notificationsEnabled: e.target.checked })}
              className="sr-only peer"
            />
            <div className="w-14 h-7 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:start-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-purple-600"></div>
          </label>
        </div>
      </div>

      {/* Warning box */}
      {!settings.enabled && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <Bell className="h-5 w-5 text-yellow-600 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="font-semibold text-yellow-900">Sistema desactivado</h4>
              <p className="text-sm text-yellow-800 mt-1">
                El sistema de retención automático está desactivado. No se detectarán ni contactarán
                clientas en riesgo hasta que lo actives de nuevo.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Save button */}
      <div className="flex items-center justify-end gap-3">
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="flex items-center gap-2 px-6 py-3 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSaving ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
              <span>Guardando...</span>
            </>
          ) : (
            <>
              <Save className="h-5 w-5" />
              <span>Guardar Configuración</span>
            </>
          )}
        </button>
      </div>

      {/* Info box */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <Settings className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="font-semibold text-blue-900">💡 Recomendaciones</h4>
            <ul className="text-sm text-blue-800 mt-2 space-y-1">
              <li>• Mantén el umbral mínimo en 40% para captar clientas en riesgo temprano</li>
              <li>• Usa horarios de 11:00 y 17:00 para máximo engagement</li>
              <li>• Excluye domingos para respetar días de descanso</li>
              <li>• Activa envío automático para recuperación 24/7 sin intervención</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
