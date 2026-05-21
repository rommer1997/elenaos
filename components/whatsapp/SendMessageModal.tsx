'use client'

import { useState } from 'react'
import { X, Send, Sparkles, MessageCircle } from 'lucide-react'

interface SendMessageModalProps {
  isOpen: boolean
  onClose: () => void
  clientId: string
  clientName: string
  clientPhone: string
}

export function SendMessageModal({
  isOpen,
  onClose,
  clientId,
  clientName,
  clientPhone,
}: SendMessageModalProps) {
  const [message, setMessage] = useState('')
  const [isSending, setIsSending] = useState(false)
  const [isGeneratingAI, setIsGeneratingAI] = useState(false)

  const sendMessage = async () => {
    if (!message.trim()) {
      alert('Escribe un mensaje')
      return
    }

    setIsSending(true)

    try {
      const response = await fetch('/api/whatsapp/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          clientId,
          message: message.trim(),
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Error enviando mensaje')
      }

      alert('✅ Mensaje enviado correctamente')
      setMessage('')
      onClose()
    } catch (error) {
      console.error('Error:', error)
      alert('❌ Error enviando mensaje: ' + (error instanceof Error ? error.message : 'Error desconocido'))
    } finally {
      setIsSending(false)
    }
  }

  const generateAIMessage = async () => {
    setIsGeneratingAI(true)

    try {
      const response = await fetch('/api/ai/generate-message', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          clientId,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Error generando mensaje')
      }

      setMessage(data.message)
    } catch (error) {
      console.error('Error generating AI message:', error)
      alert('❌ Error generando mensaje con IA: ' + (error instanceof Error ? error.message : 'Error desconocido'))
    } finally {
      setIsGeneratingAI(false)
    }
  }

  const applyQuickMessage = (template: string) => {
    setMessage(template)
  }

  const quickMessages = [
    {
      label: 'Recordatorio simple',
      template: `Hola ${clientName}! 👋\n\n¡Te echamos de menos! ¿Te gustaría reservar una cita?\n\nResponde a este mensaje y te ayudamos a agendar. 💅`,
    },
    {
      label: 'Oferta especial',
      template: `Hola ${clientName}! 🎉\n\nTenemos una oferta especial solo para ti: 20% de descuento en tu próxima visita.\n\n¿Reservamos? ¡Te esperamos! 💅✨`,
    },
    {
      label: 'Nueva disponibilidad',
      template: `Hola ${clientName}! 📅\n\nTenemos nuevos horarios disponibles esta semana. ¿Te gustaría reservar?\n\nResponde y te cuento las opciones. 💅`,
    },
  ]

  if (!isOpen) return null

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/50 z-50" onClick={onClose} />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
        <div
          className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto pointer-events-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <div className="flex items-center gap-3">
              <MessageCircle className="h-6 w-6 text-green-600" />
              <div>
                <h2 className="text-xl font-bold text-gray-900">Enviar WhatsApp</h2>
                <p className="text-sm text-gray-600">
                  A: {clientName} ({clientPhone})
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Body */}
          <div className="p-6 space-y-6">
            {/* AI Generate Button */}
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-4">
              <button
                onClick={generateAIMessage}
                disabled={isGeneratingAI}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
              >
                {isGeneratingAI ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                    <span>Generando mensaje con IA...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="h-5 w-5" />
                    <span>Generar mensaje personalizado con IA</span>
                  </>
                )}
              </button>
              <p className="text-xs text-gray-600 text-center mt-2">
                Claude analizará el perfil de la cliente y generará un mensaje personalizado
              </p>
            </div>

            {/* Quick messages */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Mensajes rápidos
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {quickMessages.map((quick) => (
                  <button
                    key={quick.label}
                    onClick={() => applyQuickMessage(quick.template)}
                    className="px-3 py-2 text-sm text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors text-left"
                  >
                    {quick.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Message textarea */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Mensaje
              </label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={8}
                placeholder="Escribe tu mensaje aquí..."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
              />
              <div className="flex justify-between items-center mt-2">
                <span className="text-xs text-gray-500">
                  {message.length} caracteres
                </span>
                <span className="text-xs text-gray-500">
                  WhatsApp permite hasta 4096 caracteres
                </span>
              </div>
            </div>

            {/* Preview */}
            {message && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="text-xs font-medium text-green-800 uppercase mb-2">
                  Vista previa
                </div>
                <div className="bg-white rounded-lg p-3 shadow-sm">
                  <p className="text-sm text-gray-900 whitespace-pre-wrap">{message}</p>
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200 bg-gray-50">
            <button
              onClick={onClose}
              disabled={isSending}
              className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              Cancelar
            </button>
            <button
              onClick={sendMessage}
              disabled={isSending || !message.trim()}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors disabled:opacity-50"
            >
              {isSending ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                  <span>Enviando...</span>
                </>
              ) : (
                <>
                  <Send className="h-4 w-4" />
                  <span>Enviar WhatsApp</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </>
  )
}
