'use client'

import { useState } from 'react'
import { Upload, ArrowRight, Store } from 'lucide-react'

interface Step1Props {
  data: any
  onComplete: (data: any) => void
}

export function Step1Salon({ data, onComplete }: Step1Props) {
  const [formData, setFormData] = useState(data)

  const colorPalettes = [
    { id: 'purple-dream', name: 'Purple Dream', primary: '#9333ea', secondary: '#ec4899' },
    { id: 'ocean-blue', name: 'Ocean Blue', primary: '#0ea5e9', secondary: '#06b6d4' },
    { id: 'forest-green', name: 'Forest Green', primary: '#10b981', secondary: '#059669' },
    { id: 'sunset-orange', name: 'Sunset Orange', primary: '#f97316', secondary: '#f59e0b' },
    { id: 'pink-elegance', name: 'Pink Elegance', primary: '#ec4899', secondary: '#f472b6' },
    { id: 'royal-purple', name: 'Royal Purple', primary: '#7c3aed', secondary: '#a855f7' }
  ]

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setFormData({ ...formData, logo: file })

      const reader = new FileReader()
      reader.onloadend = () => {
        setFormData((prev: any) => ({ ...prev, logoPreview: reader.result as string }))
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onComplete(formData)
  }

  return (
    <div className="bg-white rounded-3xl shadow-2xl p-8 lg:p-12 border-2 border-purple-100">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <Store className="h-8 w-8 text-white" />
        </div>
        <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
          ¡Bienvenida a ElenaOS! 👋
        </h1>
        <p className="text-gray-600 text-lg">
          Vamos a configurar tu salón en menos de 5 minutos
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Salon name */}
        <div>
          <label className="block text-sm font-semibold text-gray-900 mb-2">
            Nombre de tu salón *
          </label>
          <input
            type="text"
            required
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="Ej: Elena Beauty Salon"
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:ring-0 transition-colors text-lg"
          />
        </div>

        {/* Grid: WhatsApp + City */}
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              WhatsApp del salón *
            </label>
            <input
              type="tel"
              required
              value={formData.whatsapp}
              onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
              placeholder="+34 666 123 456"
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:ring-0 transition-colors"
            />
            <p className="text-xs text-gray-500 mt-1">
              Usaremos este número para enviar mensajes de retención
            </p>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              Ciudad *
            </label>
            <input
              type="text"
              required
              value={formData.city}
              onChange={(e) => setFormData({ ...formData, city: e.target.value })}
              placeholder="Madrid"
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:ring-0 transition-colors"
            />
          </div>
        </div>

        {/* Postal code */}
        <div>
          <label className="block text-sm font-semibold text-gray-900 mb-2">
            Código postal
          </label>
          <input
            type="text"
            value={formData.postalCode}
            onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
            placeholder="28013"
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:ring-0 transition-colors"
          />
        </div>

        {/* Logo upload */}
        <div>
          <label className="block text-sm font-semibold text-gray-900 mb-2">
            Logo del salón (opcional)
          </label>
          <div className="flex items-center gap-4">
            {/* Preview */}
            <div className="w-24 h-24 border-2 border-dashed border-gray-300 rounded-xl flex items-center justify-center bg-gray-50">
              {formData.logoPreview ? (
                <img
                  src={formData.logoPreview}
                  alt="Logo preview"
                  className="max-w-full max-h-full object-contain rounded-lg"
                />
              ) : (
                <Upload className="h-8 w-8 text-gray-400" />
              )}
            </div>

            {/* Upload button */}
            <label className="cursor-pointer">
              <input
                type="file"
                accept="image/*"
                onChange={handleLogoUpload}
                className="hidden"
              />
              <div className="px-6 py-3 bg-purple-50 text-purple-700 rounded-xl border-2 border-purple-200 hover:bg-purple-100 transition-colors font-medium">
                {formData.logoPreview ? 'Cambiar logo' : 'Subir logo'}
              </div>
            </label>
          </div>
          <p className="text-xs text-gray-500 mt-2">
            PNG, JPG o SVG. Tamaño recomendado: 200x200px
          </p>
        </div>

        {/* Color palette */}
        <div>
          <label className="block text-sm font-semibold text-gray-900 mb-3">
            Elige la paleta de colores de tu salón
          </label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {colorPalettes.map((palette) => (
              <button
                key={palette.id}
                type="button"
                onClick={() => setFormData({ ...formData, colorPalette: palette.id })}
                className={`p-4 rounded-xl border-2 transition-all hover:scale-105 ${
                  formData.colorPalette === palette.id
                    ? 'border-purple-500 ring-4 ring-purple-200'
                    : 'border-gray-200 hover:border-purple-300'
                }`}
              >
                <div className="flex gap-2 mb-2">
                  <div
                    className="w-10 h-10 rounded-lg"
                    style={{ backgroundColor: palette.primary }}
                  />
                  <div
                    className="w-10 h-10 rounded-lg"
                    style={{ backgroundColor: palette.secondary }}
                  />
                </div>
                <div className="text-sm font-medium text-gray-900">
                  {palette.name}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="w-full py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-bold text-lg hover:shadow-xl hover:scale-105 transition-all flex items-center justify-center gap-2"
        >
          Continuar
          <ArrowRight className="h-5 w-5" />
        </button>
      </form>
    </div>
  )
}
