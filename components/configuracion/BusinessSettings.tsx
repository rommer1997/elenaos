'use client'

import { useState } from 'react'
import { Save, MapPin, Phone, Mail, Clock } from 'lucide-react'

export function BusinessSettings() {
  const [settings, setSettings] = useState({
    businessName: 'Elena Beauty Salon',
    legalName: 'Elena Beauty Salon S.L.',
    nif: 'B12345678',
    address: 'Calle Gran Vía, 123',
    city: 'Madrid',
    postalCode: '28013',
    province: 'Madrid',
    country: 'España',
    phone: '+34 666 123 456',
    email: 'info@elenabeauty.com',
    website: 'https://elenabeauty.com',
    // Business hours
    monday: { open: '09:00', close: '20:00', closed: false },
    tuesday: { open: '09:00', close: '20:00', closed: false },
    wednesday: { open: '09:00', close: '20:00', closed: false },
    thursday: { open: '09:00', close: '20:00', closed: false },
    friday: { open: '09:00', close: '20:00', closed: false },
    saturday: { open: '10:00', close: '18:00', closed: false },
    sunday: { open: '10:00', close: '14:00', closed: true }
  })

  const [isSaving, setIsSaving] = useState(false)

  const days = [
    { key: 'monday', label: 'Lunes' },
    { key: 'tuesday', label: 'Martes' },
    { key: 'wednesday', label: 'Miércoles' },
    { key: 'thursday', label: 'Jueves' },
    { key: 'friday', label: 'Viernes' },
    { key: 'saturday', label: 'Sábado' },
    { key: 'sunday', label: 'Domingo' }
  ]

  const handleSave = async () => {
    setIsSaving(true)

    try {
      // TODO: Implementar guardado en BD
      await new Promise(resolve => setTimeout(resolve, 1000))

      alert('✅ Datos del salón guardados correctamente')
    } catch (error) {
      console.error('Error saving settings:', error)
      alert('❌ Error guardando datos')
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Business info */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Información del Negocio</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nombre comercial *
            </label>
            <input
              type="text"
              value={settings.businessName}
              onChange={(e) => setSettings({ ...settings, businessName: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Razón social
            </label>
            <input
              type="text"
              value={settings.legalName}
              onChange={(e) => setSettings({ ...settings, legalName: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              NIF / CIF *
            </label>
            <input
              type="text"
              value={settings.nif}
              onChange={(e) => setSettings({ ...settings, nif: e.target.value })}
              placeholder="B12345678"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>

      {/* Address */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center gap-2 mb-4">
          <MapPin className="h-5 w-5 text-purple-600" />
          <h3 className="text-lg font-semibold text-gray-900">Dirección</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Dirección *
            </label>
            <input
              type="text"
              value={settings.address}
              onChange={(e) => setSettings({ ...settings, address: e.target.value })}
              placeholder="Calle, número, piso, puerta"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Ciudad *
            </label>
            <input
              type="text"
              value={settings.city}
              onChange={(e) => setSettings({ ...settings, city: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Código Postal *
            </label>
            <input
              type="text"
              value={settings.postalCode}
              onChange={(e) => setSettings({ ...settings, postalCode: e.target.value })}
              placeholder="28013"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Provincia *
            </label>
            <input
              type="text"
              value={settings.province}
              onChange={(e) => setSettings({ ...settings, province: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              País *
            </label>
            <input
              type="text"
              value={settings.country}
              onChange={(e) => setSettings({ ...settings, country: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>

      {/* Contact */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center gap-2 mb-4">
          <Phone className="h-5 w-5 text-purple-600" />
          <h3 className="text-lg font-semibold text-gray-900">Contacto</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Teléfono *
            </label>
            <input
              type="tel"
              value={settings.phone}
              onChange={(e) => setSettings({ ...settings, phone: e.target.value })}
              placeholder="+34 666 123 456"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email *
            </label>
            <input
              type="email"
              value={settings.email}
              onChange={(e) => setSettings({ ...settings, email: e.target.value })}
              placeholder="info@salon.com"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Sitio web
            </label>
            <input
              type="url"
              value={settings.website}
              onChange={(e) => setSettings({ ...settings, website: e.target.value })}
              placeholder="https://misalon.com"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>

      {/* Business hours */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center gap-2 mb-4">
          <Clock className="h-5 w-5 text-purple-600" />
          <h3 className="text-lg font-semibold text-gray-900">Horario de Apertura</h3>
        </div>
        <div className="space-y-3">
          {days.map(({ key, label }) => {
            const daySettings = settings[key as keyof typeof settings] as any

            return (
              <div key={key} className="flex items-center gap-4">
                <div className="w-24 font-medium text-gray-700">{label}</div>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={daySettings.closed}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        [key]: { ...daySettings, closed: e.target.checked }
                      })
                    }
                    className="w-4 h-4 text-purple-600 rounded focus:ring-purple-500"
                  />
                  <span className="text-sm text-gray-600">Cerrado</span>
                </label>
                {!daySettings.closed && (
                  <>
                    <input
                      type="time"
                      value={daySettings.open}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          [key]: { ...daySettings, open: e.target.value }
                        })
                      }
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                    <span className="text-gray-500">-</span>
                    <input
                      type="time"
                      value={daySettings.close}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          [key]: { ...daySettings, close: e.target.value }
                        })
                      }
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </>
                )}
              </div>
            )
          })}
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
              <span>Guardar Cambios</span>
            </>
          )}
        </button>
      </div>
    </div>
  )
}
