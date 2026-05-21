'use client'

import { useState } from 'react'
import { ArrowRight, ArrowLeft, Upload, Users, Zap, Link as LinkIcon } from 'lucide-react'

interface Step3Data {
  method?: string
  csvFile?: File | null
  csvData?: string[][]
}

interface Step3Props {
  data: Step3Data
  onComplete: (data: Step3Data) => void
  onBack: () => void
}

export function Step3Clients({ data, onComplete, onBack }: Step3Props) {
  const [selectedMethod, setSelectedMethod] = useState(data.method || '')
  const [csvFile, setCsvFile] = useState<File | null>(data.csvFile ?? null)
  const [csvPreview, setCsvPreview] = useState<string[][]>(data.csvData || [])
  const [isProcessing, setIsProcessing] = useState(false)

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setCsvFile(file)

      // Simulate CSV parsing
      const reader = new FileReader()
      reader.onload = (event) => {
        const text = event.target?.result as string
        const lines = text.split('\n').slice(0, 5) // Preview first 5 lines
        const preview = lines.map(line => line.split(','))
        setCsvPreview(preview)
      }
      reader.readAsText(file)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!selectedMethod) {
      alert('Por favor selecciona una opción para continuar')
      return
    }

    setIsProcessing(true)

    // Simulate processing
    await new Promise(resolve => setTimeout(resolve, 2000))

    onComplete({
      method: selectedMethod,
      csvFile: selectedMethod === 'csv' ? csvFile : null,
      csvData: selectedMethod === 'csv' ? csvPreview : []
    })
  }

  return (
    <div className="bg-white rounded-3xl shadow-2xl p-8 lg:p-12 border-2 border-purple-100">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <Users className="h-8 w-8 text-white" />
        </div>
        <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
          Importa tus clientas
        </h1>
        <p className="text-gray-600 text-lg">
          Elige cómo quieres añadir tu base de clientes
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Option A: CSV Upload */}
        <button
          type="button"
          onClick={() => setSelectedMethod('csv')}
          className={`w-full p-6 rounded-2xl border-2 transition-all text-left ${
            selectedMethod === 'csv'
              ? 'border-purple-500 bg-purple-50 ring-4 ring-purple-200'
              : 'border-gray-200 hover:border-purple-300 hover:bg-purple-50'
          }`}
        >
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center flex-shrink-0">
              <Upload className="h-6 w-6 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Subir archivo CSV
              </h3>
              <p className="text-gray-600 mb-4">
                Importa tu base de datos existente desde un archivo CSV o Excel
              </p>

              {selectedMethod === 'csv' && (
                <div className="bg-white rounded-lg p-4 border-2 border-purple-200">
                  <label className="block mb-3">
                    <div className="flex items-center justify-center gap-2 px-4 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors cursor-pointer">
                      <Upload className="h-5 w-5" />
                      <span className="font-medium">
                        {csvFile ? 'Cambiar archivo' : 'Seleccionar archivo CSV'}
                      </span>
                    </div>
                    <input
                      type="file"
                      accept=".csv,.xlsx,.xls"
                      onChange={handleFileUpload}
                      className="hidden"
                      onClick={(e) => e.stopPropagation()}
                    />
                  </label>

                  {csvFile && (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                      <div className="flex items-center gap-2 text-green-700">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span className="font-medium">{csvFile.name}</span>
                        <span className="text-sm">({Math.round(csvFile.size / 1024)} KB)</span>
                      </div>
                    </div>
                  )}

                  {csvPreview.length > 0 && (
                    <div className="mt-3 bg-gray-50 rounded-lg p-3 border border-gray-200">
                      <div className="text-sm font-medium text-gray-700 mb-2">
                        Vista previa (primeras 5 filas):
                      </div>
                      <div className="overflow-x-auto">
                        <table className="min-w-full text-xs">
                          <tbody>
                            {csvPreview.map((row, i) => (
                              <tr key={i} className={i === 0 ? 'font-semibold' : ''}>
                                {row.map((cell, j) => (
                                  <td key={j} className="px-2 py-1 border-b border-gray-200">
                                    {cell}
                                  </td>
                                ))}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}

                  <p className="text-xs text-gray-500 mt-3">
                    💡 Tu CSV debe incluir: Nombre, Email, Teléfono, Última visita
                  </p>
                </div>
              )}
            </div>
          </div>
        </button>

        {/* Option B: Start empty */}
        <button
          type="button"
          onClick={() => setSelectedMethod('empty')}
          className={`w-full p-6 rounded-2xl border-2 transition-all text-left ${
            selectedMethod === 'empty'
              ? 'border-purple-500 bg-purple-50 ring-4 ring-purple-200'
              : 'border-gray-200 hover:border-purple-300 hover:bg-purple-50'
          }`}
        >
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center flex-shrink-0">
              <Zap className="h-6 w-6 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Empezar desde cero
              </h3>
              <p className="text-gray-600">
                Añadiré mis clientas manualmente conforme vayan llegando al salón
              </p>
            </div>
          </div>
        </button>

        {/* Option C: Integration (coming soon) */}
        <button
          type="button"
          disabled
          className="w-full p-6 rounded-2xl border-2 border-gray-200 bg-gray-50 opacity-60 cursor-not-allowed text-left"
        >
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-gray-400 rounded-xl flex items-center justify-center flex-shrink-0">
              <LinkIcon className="h-6 w-6 text-white" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <h3 className="text-xl font-bold text-gray-900">
                  Conectar Booksy / Fresha
                </h3>
                <span className="px-2 py-1 bg-orange-100 text-orange-700 rounded-full text-xs font-bold">
                  PRÓXIMAMENTE
                </span>
              </div>
              <p className="text-gray-600">
                Importa automáticamente tu base de clientes desde otras plataformas
              </p>
            </div>
          </div>
        </button>

        {/* Info box */}
        <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded-lg">
          <p className="text-sm text-blue-800">
            <strong>No te preocupes:</strong> Puedes añadir o importar más clientas en cualquier momento desde tu dashboard. Esta configuración inicial es opcional.
          </p>
        </div>

        {/* Actions */}
        <div className="flex gap-4">
          <button
            type="button"
            onClick={onBack}
            className="px-8 py-4 border-2 border-gray-300 text-gray-700 rounded-xl font-bold hover:bg-gray-50 transition-colors flex items-center gap-2"
          >
            <ArrowLeft className="h-5 w-5" />
            Atrás
          </button>
          <button
            type="submit"
            disabled={!selectedMethod || isProcessing}
            className="flex-1 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-bold text-lg hover:shadow-xl hover:scale-105 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isProcessing ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                Procesando...
              </>
            ) : (
              <>
                Finalizar configuración
                <ArrowRight className="h-5 w-5" />
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  )
}
