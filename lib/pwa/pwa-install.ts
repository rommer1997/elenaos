'use client'

import { useEffect, useState } from 'react'

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

export function usePWAInstall() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null)
  const [isInstallable, setIsInstallable] = useState(false)
  const [isInstalled, setIsInstalled] = useState(false)

  useEffect(() => {
    // Verificar si ya está instalada
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true)
      return
    }

    // Escuchar el evento beforeinstallprompt
    const handler = (e: Event) => {
      e.preventDefault()
      const promptEvent = e as BeforeInstallPromptEvent
      setDeferredPrompt(promptEvent)
      setIsInstallable(true)
      console.log('[PWA] App instalable detectada')
    }

    window.addEventListener('beforeinstallprompt', handler)

    // Escuchar cuando se instala la app
    window.addEventListener('appinstalled', () => {
      console.log('[PWA] App instalada exitosamente')
      setIsInstalled(true)
      setIsInstallable(false)
      setDeferredPrompt(null)
    })

    return () => {
      window.removeEventListener('beforeinstallprompt', handler)
    }
  }, [])

  const installPWA = async () => {
    if (!deferredPrompt) {
      console.log('[PWA] No hay prompt disponible')
      return false
    }

    try {
      await deferredPrompt.prompt()
      const choiceResult = await deferredPrompt.userChoice

      if (choiceResult.outcome === 'accepted') {
        console.log('[PWA] Usuario aceptó instalar')
        setDeferredPrompt(null)
        setIsInstallable(false)
        return true
      } else {
        console.log('[PWA] Usuario rechazó instalar')
        return false
      }
    } catch (error) {
      console.error('[PWA] Error al instalar:', error)
      return false
    }
  }

  return {
    isInstallable,
    isInstalled,
    installPWA
  }
}

export function registerServiceWorker() {
  if (typeof window === 'undefined' || !('serviceWorker' in navigator)) {
    console.log('[PWA] Service Workers no soportados')
    return
  }

  window.addEventListener('load', async () => {
    try {
      const registration = await navigator.serviceWorker.register('/sw.js', {
        scope: '/'
      })

      console.log('[PWA] Service Worker registrado:', registration.scope)

      // Verificar actualizaciones cada hora
      setInterval(() => {
        registration.update()
      }, 60 * 60 * 1000)

      // Escuchar cuando hay una nueva versión disponible
      registration.addEventListener('updatefound', () => {
        const newWorker = registration.installing
        if (!newWorker) return

        newWorker.addEventListener('statechange', () => {
          if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
            console.log('[PWA] Nueva versión disponible')
            // Aquí se puede mostrar un toast al usuario
            if (window.confirm('Nueva versión disponible. ¿Recargar ahora?')) {
              window.location.reload()
            }
          }
        })
      })
    } catch (error) {
      console.error('[PWA] Error al registrar Service Worker:', error)
    }
  })
}

export async function requestNotificationPermission() {
  if (!('Notification' in window)) {
    console.log('[PWA] Notificaciones no soportadas')
    return false
  }

  if (Notification.permission === 'granted') {
    return true
  }

  if (Notification.permission !== 'denied') {
    const permission = await Notification.requestPermission()
    return permission === 'granted'
  }

  return false
}

export async function subscribeToPushNotifications() {
  if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
    console.log('[PWA] Push notifications no soportadas')
    return null
  }

  try {
    const registration = await navigator.serviceWorker.ready

    // Verificar si ya hay una suscripción
    let subscription = await registration.pushManager.getSubscription()

    if (!subscription) {
      // Crear nueva suscripción
      // NOTA: Necesitarás generar VAPID keys para producción
      subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(
          process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY || ''
        )
      })

      console.log('[PWA] Nueva suscripción push creada')
    }

    return subscription
  } catch (error) {
    console.error('[PWA] Error al suscribir a push:', error)
    return null
  }
}

function urlBase64ToUint8Array(base64String: string) {
  const padding = '='.repeat((4 - base64String.length % 4) % 4)
  const base64 = (base64String + padding)
    .replace(/\-/g, '+')
    .replace(/_/g, '/')

  const rawData = window.atob(base64)
  const outputArray = new Uint8Array(rawData.length)

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i)
  }
  return outputArray
}
