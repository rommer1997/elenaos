// Service Worker para ElenaOS PWA
const CACHE_NAME = 'elenaos-v1'
const OFFLINE_URL = '/offline'

// Recursos críticos para cachear en instalación
const CRITICAL_ASSETS = [
  '/',
  '/dashboard',
  '/offline',
  '/manifest.json',
  '/icons/elenaos-icon.svg'
]

// Instalación del Service Worker
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[SW] Cacheando recursos críticos')
      return cache.addAll(CRITICAL_ASSETS)
    })
  )
  self.skipWaiting()
})

// Activación del Service Worker
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME)
          .map((name) => {
            console.log('[SW] Eliminando cache antigua:', name)
            return caches.delete(name)
          })
      )
    })
  )
  self.clients.claim()
})

// Estrategia de caching: Network First con fallback a Cache
self.addEventListener('fetch', (event) => {
  // Solo cachear requests GET
  if (event.request.method !== 'GET') return

  // Ignorar requests a APIs externas
  if (!event.request.url.startsWith(self.location.origin)) return

  // Ignorar requests a Supabase
  if (event.request.url.includes('supabase.co')) return

  event.respondWith(
    fetch(event.request)
      .then((response) => {
        // Clonar la respuesta porque solo se puede leer una vez
        const responseClone = response.clone()

        // Cachear respuestas exitosas
        if (response.status === 200) {
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseClone)
          })
        }

        return response
      })
      .catch(() => {
        // Si falla la red, intentar desde cache
        return caches.match(event.request).then((cachedResponse) => {
          if (cachedResponse) {
            return cachedResponse
          }

          // Si es una página HTML y no está en cache, mostrar offline page
          if (event.request.headers.get('accept').includes('text/html')) {
            return caches.match(OFFLINE_URL)
          }

          return new Response('Recurso no disponible offline', {
            status: 503,
            statusText: 'Service Unavailable'
          })
        })
      })
  )
})

// Sincronización en background
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-appointments') {
    event.waitUntil(syncAppointments())
  }
})

async function syncAppointments() {
  console.log('[SW] Sincronizando citas pendientes...')
  // Aquí se implementará la lógica de sincronización con Supabase
  // Por ahora es un stub para cuando se conecte el backend
}

// Push notifications
self.addEventListener('push', (event) => {
  const data = event.data ? event.data.json() : {}

  const options = {
    body: data.body || 'Nueva notificación de ElenaOS',
    icon: '/icons/elenaos-icon.svg',
    badge: '/icons/elenaos-icon.svg',
    vibrate: [200, 100, 200],
    data: {
      url: data.url || '/dashboard'
    },
    actions: [
      {
        action: 'open',
        title: 'Ver ahora'
      },
      {
        action: 'close',
        title: 'Cerrar'
      }
    ]
  }

  event.waitUntil(
    self.registration.showNotification(data.title || 'ElenaOS', options)
  )
})

// Click en notificación
self.addEventListener('notificationclick', (event) => {
  event.notification.close()

  if (event.action === 'open' || !event.action) {
    const urlToOpen = event.notification.data.url

    event.waitUntil(
      clients.matchAll({ type: 'window', includeUncontrolled: true })
        .then((windowClients) => {
          // Buscar si ya hay una ventana abierta
          for (let client of windowClients) {
            if (client.url === urlToOpen && 'focus' in client) {
              return client.focus()
            }
          }
          // Si no hay ventana abierta, abrir una nueva
          if (clients.openWindow) {
            return clients.openWindow(urlToOpen)
          }
        })
    )
  }
})
