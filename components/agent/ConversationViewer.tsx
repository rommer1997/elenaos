'use client'

import { useState, useEffect, useRef } from 'react'
import { MessageCircle, Send, Bot, User, CheckCheck, Clock } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import { es } from 'date-fns/locale'

interface Message {
  id: string
  direction: 'inbound' | 'outbound'
  content: string
  timestamp: Date
  status: 'sent' | 'delivered' | 'read'
  intent?: string
}

interface ConversationViewerProps {
  clientId: string
  clientName: string
  clientPhone: string
}

export function ConversationViewer({ clientId, clientName, clientPhone }: ConversationViewerProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [agentMode, setAgentMode] = useState<'auto' | 'manual'>('auto')
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Mock messages
  useEffect(() => {
    const mockMessages: Message[] = [
      {
        id: '1',
        direction: 'inbound',
        content: 'Hola! Quería agendar una cita para un corte de pelo',
        timestamp: new Date(Date.now() - 1000 * 60 * 15),
        status: 'read',
        intent: 'create_appointment'
      },
      {
        id: '2',
        direction: 'outbound',
        content: '¡Hola María! 😊 Perfecto, te ayudo con eso. ¿Qué día te vendría bien?',
        timestamp: new Date(Date.now() - 1000 * 60 * 14),
        status: 'read'
      },
      {
        id: '3',
        direction: 'inbound',
        content: 'El viernes si es posible, por la mañana',
        timestamp: new Date(Date.now() - 1000 * 60 * 13),
        status: 'read',
        intent: 'create_appointment'
      },
      {
        id: '4',
        direction: 'outbound',
        content: 'Perfecto! Tengo disponible el viernes a las 10:00 o a las 11:30. ¿Cuál prefieres?',
        timestamp: new Date(Date.now() - 1000 * 60 * 12),
        status: 'read'
      },
      {
        id: '5',
        direction: 'inbound',
        content: 'A las 10 está genial',
        timestamp: new Date(Date.now() - 1000 * 60 * 11),
        status: 'read',
        intent: 'confirm_appointment'
      },
      {
        id: '6',
        direction: 'outbound',
        content: '✅ ¡Listo! Te he agendado para el viernes 24 de mayo a las 10:00 para un corte de pelo. Te enviaré un recordatorio el día anterior. ¡Nos vemos! 💇‍♀️',
        timestamp: new Date(Date.now() - 1000 * 60 * 10),
        status: 'read'
      }
    ]

    setMessages(mockMessages)
  }, [clientId])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return

    setIsLoading(true)

    // Añadir mensaje del usuario
    const userMessage: Message = {
      id: Date.now().toString(),
      direction: 'outbound',
      content: newMessage,
      timestamp: new Date(),
      status: 'sent'
    }

    setMessages(prev => [...prev, userMessage])
    setNewMessage('')

    // Simular respuesta del agente si está en modo auto
    if (agentMode === 'auto') {
      setTimeout(() => {
        const botMessage: Message = {
          id: (Date.now() + 1).toString(),
          direction: 'outbound',
          content: 'Mensaje enviado manualmente. El agente no procesará este mensaje.',
          timestamp: new Date(),
          status: 'sent'
        }
        setMessages(prev => [...prev, botMessage])
        setIsLoading(false)
      }, 1000)
    } else {
      setIsLoading(false)
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'sent':
        return <Clock className="h-3 w-3" />
      case 'delivered':
        return <CheckCheck className="h-3 w-3" />
      case 'read':
        return <CheckCheck className="h-3 w-3 text-blue-500" />
      default:
        return null
    }
  }

  const getIntentBadge = (intent?: string) => {
    if (!intent) return null

    const intentColors: Record<string, string> = {
      create_appointment: 'bg-green-100 text-green-700',
      modify_appointment: 'bg-blue-100 text-blue-700',
      cancel_appointment: 'bg-red-100 text-red-700',
      confirm_appointment: 'bg-purple-100 text-purple-700',
      inquiry: 'bg-gray-100 text-gray-700'
    }

    const intentLabels: Record<string, string> = {
      create_appointment: 'Crear cita',
      modify_appointment: 'Modificar',
      cancel_appointment: 'Cancelar',
      confirm_appointment: 'Confirmar',
      inquiry: 'Consulta'
    }

    return (
      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${intentColors[intent] || 'bg-gray-100 text-gray-700'}`}>
        <Bot className="h-3 w-3" />
        {intentLabels[intent] || intent}
      </span>
    )
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 h-full flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
              <MessageCircle className="h-5 w-5 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-gray-900">{clientName}</h3>
              <p className="text-sm text-gray-600">{clientPhone}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setAgentMode(agentMode === 'auto' ? 'manual' : 'auto')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                agentMode === 'auto'
                  ? 'bg-green-100 text-green-700'
                  : 'bg-gray-100 text-gray-700'
              }`}
            >
              {agentMode === 'auto' ? '🤖 Agente activo' : '👤 Manual'}
            </button>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.direction === 'outbound' ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`max-w-[75%] ${message.direction === 'outbound' ? 'order-2' : 'order-1'}`}>
              {/* Intent badge for inbound messages */}
              {message.direction === 'inbound' && message.intent && (
                <div className="mb-1">
                  {getIntentBadge(message.intent)}
                </div>
              )}

              {/* Message bubble */}
              <div
                className={`px-4 py-2 rounded-2xl ${
                  message.direction === 'outbound'
                    ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-br-sm'
                    : 'bg-gray-100 text-gray-900 rounded-bl-sm'
                }`}
              >
                <p className="text-sm whitespace-pre-wrap">{message.content}</p>
              </div>

              {/* Timestamp and status */}
              <div className={`flex items-center gap-1 mt-1 ${
                message.direction === 'outbound' ? 'justify-end' : 'justify-start'
              }`}>
                <span className="text-xs text-gray-500">
                  {formatDistanceToNow(message.timestamp, {
                    addSuffix: true,
                    locale: es
                  })}
                </span>
                {message.direction === 'outbound' && getStatusIcon(message.status)}
              </div>
            </div>

            {/* Avatar */}
            <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
              message.direction === 'outbound' ? 'order-1 ml-2' : 'order-2 mr-2'
            } ${
              message.direction === 'outbound'
                ? 'bg-gradient-to-br from-purple-500 to-pink-500'
                : 'bg-gray-200'
            }`}>
              {message.direction === 'outbound' ? (
                <Bot className="h-4 w-4 text-white" />
              ) : (
                <User className="h-4 w-4 text-gray-600" />
              )}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t border-gray-200">
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder="Escribe un mensaje..."
            disabled={agentMode === 'auto'}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:bg-gray-50 disabled:cursor-not-allowed"
          />
          <button
            onClick={handleSendMessage}
            disabled={!newMessage.trim() || isLoading || agentMode === 'auto'}
            className="px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-medium hover:from-purple-700 hover:to-pink-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send className="h-5 w-5" />
          </button>
        </div>

        {agentMode === 'auto' && (
          <p className="text-xs text-gray-500 mt-2">
            💡 El agente está respondiendo automáticamente. Cambia a modo manual para enviar mensajes.
          </p>
        )}
      </div>
    </div>
  )
}
