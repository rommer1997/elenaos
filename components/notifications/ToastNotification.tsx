'use client'

import { useEffect, useState } from 'react'
import { X, AlertCircle, CheckCircle, Info, AlertTriangle } from 'lucide-react'

export type ToastType = 'success' | 'error' | 'warning' | 'info' | 'urgent'

interface ToastNotificationProps {
  id: string
  type: ToastType
  title: string
  message: string
  duration?: number
  onClose: (id: string) => void
}

export function ToastNotification({
  id,
  type,
  title,
  message,
  duration = 5000,
  onClose
}: ToastNotificationProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [isExiting, setIsExiting] = useState(false)

  useEffect(() => {
    // Entrance animation
    setTimeout(() => setIsVisible(true), 10)

    // Auto-close (except urgent)
    if (type !== 'urgent' && duration > 0) {
      const timer = setTimeout(() => {
        handleClose()
      }, duration)

      return () => clearTimeout(timer)
    }
  }, [duration, type])

  const handleClose = () => {
    setIsExiting(true)
    setTimeout(() => {
      onClose(id)
    }, 300)
  }

  const config = {
    success: {
      icon: CheckCircle,
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200',
      iconColor: 'text-green-600',
      titleColor: 'text-green-900',
      textColor: 'text-green-800'
    },
    error: {
      icon: AlertCircle,
      bgColor: 'bg-red-50',
      borderColor: 'border-red-200',
      iconColor: 'text-red-600',
      titleColor: 'text-red-900',
      textColor: 'text-red-800'
    },
    warning: {
      icon: AlertTriangle,
      bgColor: 'bg-orange-50',
      borderColor: 'border-orange-200',
      iconColor: 'text-orange-600',
      titleColor: 'text-orange-900',
      textColor: 'text-orange-800'
    },
    info: {
      icon: Info,
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200',
      iconColor: 'text-blue-600',
      titleColor: 'text-blue-900',
      textColor: 'text-blue-800'
    },
    urgent: {
      icon: AlertTriangle,
      bgColor: 'bg-red-100',
      borderColor: 'border-red-400',
      iconColor: 'text-red-700',
      titleColor: 'text-red-900',
      textColor: 'text-red-800'
    }
  }

  const { icon: Icon, bgColor, borderColor, iconColor, titleColor, textColor } = config[type]

  return (
    <div
      className={`pointer-events-auto w-full max-w-md transition-all duration-300 ${
        isVisible && !isExiting
          ? 'translate-x-0 opacity-100'
          : 'translate-x-full opacity-0'
      }`}
    >
      <div
        className={`${bgColor} ${borderColor} border-2 rounded-xl shadow-lg p-4 ${
          type === 'urgent' ? 'animate-pulse-border' : ''
        }`}
      >
        <div className="flex gap-3">
          {/* Icon */}
          <div className="flex-shrink-0">
            <Icon className={`h-6 w-6 ${iconColor}`} />
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <h4 className={`font-bold text-sm mb-1 ${titleColor}`}>
              {title}
            </h4>
            <p className={`text-sm ${textColor}`}>
              {message}
            </p>

            {/* Action buttons for urgent */}
            {type === 'urgent' && (
              <div className="mt-3 flex gap-2">
                <button className="px-3 py-1.5 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 transition-colors">
                  Ver ahora
                </button>
                <button
                  onClick={handleClose}
                  className="px-3 py-1.5 bg-white border border-red-200 text-red-700 rounded-lg text-sm font-medium hover:bg-red-50 transition-colors"
                >
                  Más tarde
                </button>
              </div>
            )}
          </div>

          {/* Close button */}
          <button
            onClick={handleClose}
            className={`flex-shrink-0 ${iconColor} hover:opacity-70 transition-opacity`}
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Progress bar (non-urgent only) */}
        {type !== 'urgent' && duration > 0 && (
          <div className="mt-3 h-1 bg-white/30 rounded-full overflow-hidden">
            <div
              className={`h-full ${iconColor} bg-current transition-all`}
              style={{
                animation: `progress ${duration}ms linear`,
                width: '0%'
              }}
            />
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes progress {
          from {
            width: 100%;
          }
          to {
            width: 0%;
          }
        }
        @keyframes pulse-border {
          0%, 100% {
            border-color: #fca5a5;
          }
          50% {
            border-color: #dc2626;
          }
        }
        .animate-pulse-border {
          animation: pulse-border 2s ease-in-out infinite;
        }
      `}</style>
    </div>
  )
}
