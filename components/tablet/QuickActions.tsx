'use client'

import { CheckCircle, Clock, MessageSquare, Package, Camera, FileText } from 'lucide-react'

interface QuickActionsProps {
  appointmentId: string
}

export function QuickActions({ appointmentId }: QuickActionsProps) {
  const handleAction = (action: string) => {
    console.log(`Action: ${action} for appointment ${appointmentId}`)
    // TODO: Implementar acciones
  }

  const actions = [
    {
      id: 'complete',
      label: 'Marcar Completada',
      icon: CheckCircle,
      color: 'bg-green-500 hover:bg-green-600',
      action: 'complete'
    },
    {
      id: 'pause',
      label: 'Pausar Timer',
      icon: Clock,
      color: 'bg-orange-500 hover:bg-orange-600',
      action: 'pause'
    },
    {
      id: 'message',
      label: 'Enviar WhatsApp',
      icon: MessageSquare,
      color: 'bg-purple-500 hover:bg-purple-600',
      action: 'message'
    },
    {
      id: 'products',
      label: 'Registrar Productos',
      icon: Package,
      color: 'bg-blue-500 hover:bg-blue-600',
      action: 'products'
    },
    {
      id: 'photo',
      label: 'Tomar Foto Antes/Después',
      icon: Camera,
      color: 'bg-pink-500 hover:bg-pink-600',
      action: 'photo'
    },
    {
      id: 'invoice',
      label: 'Generar Factura',
      icon: FileText,
      color: 'bg-gray-700 hover:bg-gray-800',
      action: 'invoice'
    }
  ]

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h3 className="text-xl font-bold text-gray-900 mb-4">
        Acciones Rápidas
      </h3>

      <div className="grid grid-cols-2 gap-3">
        {actions.map((action) => {
          const Icon = action.icon

          return (
            <button
              key={action.id}
              onClick={() => handleAction(action.action)}
              className={`flex flex-col items-center gap-2 p-4 ${action.color} text-white rounded-xl transition-all transform active:scale-95 shadow-lg`}
            >
              <Icon className="h-8 w-8" />
              <span className="text-xs font-medium text-center leading-tight">
                {action.label}
              </span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
