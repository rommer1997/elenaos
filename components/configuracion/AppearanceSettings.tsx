'use client'

import { useState } from 'react'
import { Save, Upload, RefreshCw, Eye, Palette } from 'lucide-react'

export function AppearanceSettings() {
  const [settings, setSettings] = useState({
    salonName: 'Elena Beauty Salon',
    primaryColor: '#9333ea', // purple-600
    secondaryColor: '#ec4899', // pink-600
    accentColor: '#8b5cf6', // violet-600
    logo: null as File | null,
    logoPreview: '' as string
  })

  const [isSaving, setIsSaving] = useState(false)
  const [showPreview, setShowPreview] = useState(false)

  const colorPresets = [
    { name: 'Purple Dream', primary: '#9333ea', secondary: '#ec4899', accent: '#8b5cf6' },
    { name: 'Ocean Blue', primary: '#0ea5e9', secondary: '#06b6d4', accent: '#3b82f6' },
    { name: 'Forest Green', primary: '#10b981', secondary: '#059669', accent: '#14b8a6' },
    { name: 'Sunset Orange', primary: '#f97316', secondary: '#f59e0b', accent: '#ef4444' },
    { name: 'Royal Purple', primary: '#7c3aed', secondary: '#a855f7', accent: '#c026d3' },
    { name: 'Pink Elegance', primary: '#ec4899', secondary: '#f472b6', accent: '#db2777' },
    { name: 'Dark Minimal', primary: '#1f2937', secondary: '#374151', accent: '#4b5563' },
    { name: 'Coral Reef', primary: '#fb7185', secondary: '#fbbf24', accent: '#f472b6' }
  ]

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setSettings({ ...settings, logo: file })

      // Create preview
      const reader = new FileReader()
      reader.onloadend = () => {
        setSettings(prev => ({ ...prev, logoPreview: reader.result as string }))
      }
      reader.readAsDataURL(file)
    }
  }

  const applyPreset = (preset: typeof colorPresets[0]) => {
    setSettings({
      ...settings,
      primaryColor: preset.primary,
      secondaryColor: preset.secondary,
      accentColor: preset.accent
    })
  }

  const handleSave = async () => {
    setIsSaving(true)

    try {
      // TODO: Implementar guardado en BD y actualización de CSS variables
      await new Promise(resolve => setTimeout(resolve, 1500))

      // Update CSS variables
      document.documentElement.style.setProperty('--primary-color', settings.primaryColor)
      document.documentElement.style.setProperty('--secondary-color', settings.secondaryColor)
      document.documentElement.style.setProperty('--accent-color', settings.accentColor)

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
      {/* Preview toggle */}
      <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-4 border border-purple-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Eye className="h-5 w-5 text-purple-600" />
            <div>
              <h3 className="font-semibold text-gray-900">Vista Previa</h3>
              <p className="text-sm text-gray-600">
                Visualiza cómo se verá tu salón con los cambios aplicados
              </p>
            </div>
          </div>
          <button
            onClick={() => setShowPreview(!showPreview)}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg text-sm font-medium hover:bg-purple-700 transition-colors"
          >
            {showPreview ? 'Ocultar' : 'Ver'} Vista Previa
          </button>
        </div>
      </div>

      {/* Preview panel */}
      {showPreview && (
        <div className="bg-white rounded-lg shadow-lg p-6 border-2 border-purple-200">
          <div className="text-sm font-medium text-gray-500 mb-4">VISTA PREVIA</div>
          <div
            className="rounded-lg p-6"
            style={{
              background: `linear-gradient(to right, ${settings.primaryColor}, ${settings.secondaryColor})`
            }}
          >
            <div className="text-white text-2xl font-bold mb-2">{settings.salonName}</div>
            <div className="flex gap-3">
              <div
                className="px-4 py-2 rounded-lg font-medium"
                style={{ backgroundColor: settings.primaryColor }}
              >
                Botón Principal
              </div>
              <div
                className="px-4 py-2 rounded-lg font-medium"
                style={{ backgroundColor: settings.accentColor }}
              >
                Botón Secundario
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Salon name */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Nombre del Salón</h3>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Nombre que aparecerá en el dashboard
          </label>
          <input
            type="text"
            value={settings.salonName}
            onChange={(e) => setSettings({ ...settings, salonName: e.target.value })}
            className="w-full max-w-md px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Logo upload */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Logo del Salón</h3>
        <div className="flex items-start gap-6">
          {/* Preview */}
          <div className="w-32 h-32 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center bg-gray-50">
            {settings.logoPreview ? (
              <img
                src={settings.logoPreview}
                alt="Logo preview"
                className="max-w-full max-h-full object-contain"
              />
            ) : (
              <div className="text-center p-4">
                <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                <div className="text-xs text-gray-500">Sin logo</div>
              </div>
            )}
          </div>

          {/* Upload */}
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Subir logo
            </label>
            <div className="flex gap-3">
              <label className="cursor-pointer">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleLogoUpload}
                  className="hidden"
                />
                <div className="px-4 py-2 bg-purple-50 text-purple-700 rounded-lg border border-purple-200 hover:bg-purple-100 transition-colors inline-flex items-center gap-2">
                  <Upload className="h-4 w-4" />
                  <span>Seleccionar archivo</span>
                </div>
              </label>
              {settings.logoPreview && (
                <button
                  onClick={() => setSettings({ ...settings, logo: null, logoPreview: '' })}
                  className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Eliminar
                </button>
              )}
            </div>
            <p className="text-xs text-gray-500 mt-2">
              Formatos: PNG, JPG, SVG. Tamaño recomendado: 200x200px
            </p>
          </div>
        </div>
      </div>

      {/* Color scheme */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Esquema de Colores</h3>

        {/* Presets */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Paletas predefinidas
          </label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {colorPresets.map((preset) => (
              <button
                key={preset.name}
                onClick={() => applyPreset(preset)}
                className="p-3 border-2 border-gray-200 rounded-lg hover:border-purple-300 transition-colors"
              >
                <div className="flex gap-1 mb-2">
                  <div
                    className="w-8 h-8 rounded"
                    style={{ backgroundColor: preset.primary }}
                  />
                  <div
                    className="w-8 h-8 rounded"
                    style={{ backgroundColor: preset.secondary }}
                  />
                  <div
                    className="w-8 h-8 rounded"
                    style={{ backgroundColor: preset.accent }}
                  />
                </div>
                <div className="text-xs font-medium text-gray-700">{preset.name}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Custom colors */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Colores personalizados
          </label>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm text-gray-600 mb-2">Color Principal</label>
              <div className="flex gap-3 items-center">
                <input
                  type="color"
                  value={settings.primaryColor}
                  onChange={(e) => setSettings({ ...settings, primaryColor: e.target.value })}
                  className="w-16 h-16 rounded-lg border-2 border-gray-300 cursor-pointer"
                />
                <div>
                  <div className="font-mono text-sm text-gray-900">{settings.primaryColor}</div>
                  <div className="text-xs text-gray-500">Botones y elementos principales</div>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm text-gray-600 mb-2">Color Secundario</label>
              <div className="flex gap-3 items-center">
                <input
                  type="color"
                  value={settings.secondaryColor}
                  onChange={(e) => setSettings({ ...settings, secondaryColor: e.target.value })}
                  className="w-16 h-16 rounded-lg border-2 border-gray-300 cursor-pointer"
                />
                <div>
                  <div className="font-mono text-sm text-gray-900">{settings.secondaryColor}</div>
                  <div className="text-xs text-gray-500">Gradientes y acentos</div>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm text-gray-600 mb-2">Color de Acento</label>
              <div className="flex gap-3 items-center">
                <input
                  type="color"
                  value={settings.accentColor}
                  onChange={(e) => setSettings({ ...settings, accentColor: e.target.value })}
                  className="w-16 h-16 rounded-lg border-2 border-gray-300 cursor-pointer"
                />
                <div>
                  <div className="font-mono text-sm text-gray-900">{settings.accentColor}</div>
                  <div className="text-xs text-gray-500">Botones secundarios</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Reset button */}
        <div className="mt-6 pt-6 border-t border-gray-200">
          <button
            onClick={() => applyPreset(colorPresets[0])}
            className="flex items-center gap-2 px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <RefreshCw className="h-4 w-4" />
            <span>Restablecer colores por defecto</span>
          </button>
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

      {/* Info box */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <Palette className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="font-semibold text-blue-900">💡 Consejo de diseño</h4>
            <p className="text-sm text-blue-800 mt-1">
              Elige colores que reflejen la personalidad de tu salón. Los colores cálidos (rosa, naranja)
              transmiten energía y cercanía, mientras que los fríos (azul, verde) transmiten calma y profesionalidad.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
