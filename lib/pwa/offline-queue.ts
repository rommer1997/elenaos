// Cola de operaciones offline para sincronizar cuando vuelva la conexión

interface OfflineOperation {
  id: string
  type: 'appointment' | 'client' | 'message' | 'invoice'
  action: 'create' | 'update' | 'delete'
  data: any
  timestamp: number
}

const QUEUE_KEY = 'offline-operations-queue'

export function addToOfflineQueue(operation: Omit<OfflineOperation, 'id' | 'timestamp'>) {
  const queue = getOfflineQueue()

  const newOperation: OfflineOperation = {
    ...operation,
    id: crypto.randomUUID(),
    timestamp: Date.now()
  }

  queue.push(newOperation)
  localStorage.setItem(QUEUE_KEY, JSON.stringify(queue))

  console.log('[Offline Queue] Operación añadida:', newOperation)
  return newOperation.id
}

export function getOfflineQueue(): OfflineOperation[] {
  if (typeof window === 'undefined') return []

  try {
    const queue = localStorage.getItem(QUEUE_KEY)
    return queue ? JSON.parse(queue) : []
  } catch (error) {
    console.error('[Offline Queue] Error al leer cola:', error)
    return []
  }
}

export function removeFromOfflineQueue(operationId: string) {
  const queue = getOfflineQueue()
  const filtered = queue.filter(op => op.id !== operationId)
  localStorage.setItem(QUEUE_KEY, JSON.stringify(filtered))
  console.log('[Offline Queue] Operación eliminada:', operationId)
}

export function clearOfflineQueue() {
  localStorage.removeItem(QUEUE_KEY)
  console.log('[Offline Queue] Cola limpiada')
}

export async function syncOfflineQueue() {
  const queue = getOfflineQueue()

  if (queue.length === 0) {
    console.log('[Offline Queue] No hay operaciones pendientes')
    return { synced: 0, failed: 0 }
  }

  console.log(`[Offline Queue] Sincronizando ${queue.length} operaciones...`)

  let synced = 0
  let failed = 0

  for (const operation of queue) {
    try {
      // TODO: Implementar sincronización con Supabase según el tipo de operación
      switch (operation.type) {
        case 'appointment':
          // await syncAppointment(operation)
          break
        case 'client':
          // await syncClient(operation)
          break
        case 'message':
          // await syncMessage(operation)
          break
        case 'invoice':
          // await syncInvoice(operation)
          break
      }

      removeFromOfflineQueue(operation.id)
      synced++
    } catch (error) {
      console.error(`[Offline Queue] Error al sincronizar operación ${operation.id}:`, error)
      failed++
    }
  }

  console.log(`[Offline Queue] Sincronización completada: ${synced} exitosas, ${failed} fallidas`)

  return { synced, failed }
}

// Iniciar sincronización automática cuando se recupera la conexión
if (typeof window !== 'undefined') {
  window.addEventListener('online', () => {
    console.log('[Offline Queue] Conexión detectada, iniciando sincronización...')
    syncOfflineQueue()
  })
}
