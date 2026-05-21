'use client'

import { useEffect } from 'react'
import { registerServiceWorker } from '@/lib/pwa/pwa-install'
import { InstallPrompt } from './InstallPrompt'

export function PWAProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Registrar Service Worker
    registerServiceWorker()

    // Detectar modo standalone (app instalada)
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches
    if (isStandalone) {
      console.log('[PWA] Ejecutando en modo standalone')
      document.documentElement.classList.add('standalone')
    }

    // Prevenir zoom en iOS
    const preventZoom = (e: TouchEvent) => {
      if (e.touches.length > 1) {
        e.preventDefault()
      }
    }
    document.addEventListener('touchstart', preventZoom, { passive: false })

    // Ajustar viewport height en iOS
    const setVH = () => {
      const vh = window.innerHeight * 0.01
      document.documentElement.style.setProperty('--vh', `${vh}px`)
    }
    setVH()
    window.addEventListener('resize', setVH)

    return () => {
      document.removeEventListener('touchstart', preventZoom)
      window.removeEventListener('resize', setVH)
    }
  }, [])

  return (
    <>
      {children}
      <InstallPrompt />
    </>
  )
}
