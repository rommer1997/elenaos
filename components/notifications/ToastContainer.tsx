'use client'

import { createContext, useContext, useState, ReactNode } from 'react'
import { ToastNotification, ToastType } from './ToastNotification'

interface Toast {
  id: string
  type: ToastType
  title: string
  message: string
  duration?: number
}

interface ToastContextType {
  showToast: (type: ToastType, title: string, message: string, duration?: number) => void
}

const ToastContext = createContext<ToastContextType | undefined>(undefined)

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])

  const showToast = (
    type: ToastType,
    title: string,
    message: string,
    duration?: number
  ) => {
    const id = Date.now().toString()
    const newToast: Toast = {
      id,
      type,
      title,
      message,
      duration: duration ?? (type === 'urgent' ? 0 : 5000)
    }

    setToasts((prev) => [...prev, newToast])
  }

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id))
  }

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}

      {/* Toast Container */}
      <div className="fixed top-4 right-4 z-50 flex flex-col gap-3 pointer-events-none">
        {toasts.map((toast) => (
          <ToastNotification
            key={toast.id}
            {...toast}
            onClose={removeToast}
          />
        ))}
      </div>
    </ToastContext.Provider>
  )
}

export function useToast() {
  const context = useContext(ToastContext)
  if (!context) {
    throw new Error('useToast must be used within ToastProvider')
  }
  return context
}
