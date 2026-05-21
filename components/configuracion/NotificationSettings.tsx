'use client'

import { useState } from 'react'
import { Save, Bell } from 'lucide-react'

export function NotificationSettings() {
  const [settings, setSettings] = useState({
    emailNewAppointment: true,
    emailCancelledAppointment: true,
    emailNewClient: false,
    emailLowStock: true,
    emailInvoicePaid: true,
    pushNewAppointment: true,
    pushUpcoming: true,
    pushLowStock: true,
    whatsappClientResponse: true,
    whatsappNewAppointment: false
  })

  const [isSaving, setIsSaving] = useState(false)

  const handleSave = async () => {
    setIsSaving(true)

    try {
      // TODO: Implementar guardado en BD
      await new Promise(resolve => setTimeout(resolve, 1000))

      alert('✅ Preferencias de notificaciones guardadas')
    } catch (error) {
      console.error('Error saving settings:', error)
      alert('❌ Error guardando preferencias')
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Email notifications */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Notificaciones por Email</h3>
        <div className="space-y-3">
          <label className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors">
            <div>
              <div className="font-medium text-gray-900">Nueva cita</div>
              <div className="text-sm text-gray-600">Cuando una clienta agenda una nueva cita</div>
            </div>
            <input
              type="checkbox"
              checked={settings.emailNewAppointment}
              onChange={(e) => setSettings({ ...settings, emailNewAppointment: e.target.checked })}
              className="w-5 h-5 text-purple-600 rounded focus:ring-purple-500"
            />
          </label>

          <label className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors">
            <div>
              <div className="font-medium text-gray-900">Cita cancelada</div>
              <div className="text-sm text-gray-600">Cuando se cancela una cita</div>
            </div>
            <input
              type="checkbox"
              checked={settings.emailCancelledAppointment}
              onChange={(e) => setSettings({ ...settings, emailCancelledAppointment: e.target.checked })}
              className="w-5 h-5 text-purple-600 rounded focus:ring-purple-500"
            />
          </label>

          <label className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors">
            <div>
              <div className="font-medium text-gray-900">Nueva clienta</div>
              <div className="text-sm text-gray-600">Cuando se registra una nueva clienta</div>
            </div>
            <input
              type="checkbox"
              checked={settings.emailNewClient}
              onChange={(e) => setSettings({ ...settings, emailNewClient: e.target.checked })}
              className="w-5 h-5 text-purple-600 rounded focus:ring-purple-500"
            />
          </label>

          <label className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors">
            <div>
              <div className="font-medium text-gray-900">Stock bajo</div>
              <div className="text-sm text-gray-600">Cuando un producto alcanza el stock mínimo</div>
            </div>
            <input
              type="checkbox"
              checked={settings.emailLowStock}
              onChange={(e) => setSettings({ ...settings, emailLowStock: e.target.checked })}
              className="w-5 h-5 text-purple-600 rounded focus:ring-purple-500"
            />
          </label>

          <label className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors">
            <div>
              <div className="font-medium text-gray-900">Factura pagada</div>
              <div className="text-sm text-gray-600">Cuando se marca una factura como pagada</div>
            </div>
            <input
              type="checkbox"
              checked={settings.emailInvoicePaid}
              onChange={(e) => setSettings({ ...settings, emailInvoicePaid: e.target.checked })}
              className="w-5 h-5 text-purple-600 rounded focus:ring-purple-500"
            />
          </label>
        </div>
      </div>

      {/* Push notifications */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Notificaciones Push</h3>
        <div className="space-y-3">
          <label className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors">
            <div>
              <div className="font-medium text-gray-900">Nueva cita</div>
              <div className="text-sm text-gray-600">Notificación instantánea en el navegador</div>
            </div>
            <input
              type="checkbox"
              checked={settings.pushNewAppointment}
              onChange={(e) => setSettings({ ...settings, pushNewAppointment: e.target.checked })}
              className="w-5 h-5 text-purple-600 rounded focus:ring-purple-500"
            />
          </label>

          <label className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors">
            <div>
              <div className="font-medium text-gray-900">Recordatorio de citas</div>
              <div className="text-sm text-gray-600">30 minutos antes de cada cita</div>
            </div>
            <input
              type="checkbox"
              checked={settings.pushUpcoming}
              onChange={(e) => setSettings({ ...settings, pushUpcoming: e.target.checked })}
              className="w-5 h-5 text-purple-600 rounded focus:ring-purple-500"
            />
          </label>

          <label className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors">
            <div>
              <div className="font-medium text-gray-900">Alertas de stock</div>
              <div className="text-sm text-gray-600">Cuando un producto se agota</div>
            </div>
            <input
              type="checkbox"
              checked={settings.pushLowStock}
              onChange={(e) => setSettings({ ...settings, pushLowStock: e.target.checked })}
              className="w-5 h-5 text-purple-600 rounded focus:ring-purple-500"
            />
          </label>
        </div>
      </div>

      {/* WhatsApp notifications */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Notificaciones WhatsApp</h3>
        <div className="space-y-3">
          <label className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors">
            <div>
              <div className="font-medium text-gray-900">Respuesta de clienta</div>
              <div className="text-sm text-gray-600">Cuando una clienta responde a un mensaje de retención</div>
            </div>
            <input
              type="checkbox"
              checked={settings.whatsappClientResponse}
              onChange={(e) => setSettings({ ...settings, whatsappClientResponse: e.target.checked })}
              className="w-5 h-5 text-purple-600 rounded focus:ring-purple-500"
            />
          </label>

          <label className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors">
            <div>
              <div className="font-medium text-gray-900">Confirmación de cita</div>
              <div className="text-sm text-gray-600">Recibir copia de mensajes de confirmación</div>
            </div>
            <input
              type="checkbox"
              checked={settings.whatsappNewAppointment}
              onChange={(e) => setSettings({ ...settings, whatsappNewAppointment: e.target.checked })}
              className="w-5 h-5 text-purple-600 rounded focus:ring-purple-500"
            />
          </label>
        </div>
      </div>

      {/* Save button */}
      <div className="flex items-center justify-end gap-3 bg-white rounded-lg shadow-sm p-6">
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="flex items-center gap-2 px-6 py-3 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition-colors disabled:opacity-50"
        >
          {isSaving ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
              <span>Guardando...</span>
            </>
          ) : (
            <>
              <Save className="h-5 w-5" />
              <span>Guardar Preferencias</span>
            </>
          )}
        </button>
      </div>

      {/* Info box */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <Bell className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="font-semibold text-blue-900">Mantente Informado</h4>
            <p className="text-sm text-blue-800 mt-1">
              Las notificaciones te ayudan a estar al tanto de todo lo que sucede en tu salón.
              Puedes desactivar las que no necesites en cualquier momento.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
