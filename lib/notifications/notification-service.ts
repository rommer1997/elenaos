// Service for handling notification logic and Supabase Realtime integration

export type NotificationType =
  | 'appointment_confirmed'
  | 'appointment_cancelled'
  | 'campaign_response'
  | 'invoice_paid'
  | 'low_stock'
  | 'client_reactivated'
  | 'vip_response'
  | 'daily_summary'

export type NotificationPriority = 'urgent' | 'normal' | 'low'

export interface Notification {
  id: string
  tenantId: string
  type: NotificationType
  priority: NotificationPriority
  title: string
  message: string
  icon: string
  data?: Record<string, any>
  read: boolean
  createdAt: Date
}

/**
 * Determines if a notification should trigger an urgent toast
 */
export function isUrgentNotification(type: NotificationType): boolean {
  const urgentTypes: NotificationType[] = [
    'appointment_cancelled',
    'vip_response',
    'low_stock'
  ]
  return urgentTypes.includes(type)
}

/**
 * Get icon emoji for notification type
 */
export function getNotificationIcon(type: NotificationType): string {
  const icons: Record<NotificationType, string> = {
    appointment_confirmed: '📅',
    appointment_cancelled: '🚨',
    campaign_response: '💬',
    invoice_paid: '💰',
    low_stock: '⚠️',
    client_reactivated: '🎉',
    vip_response: '⭐',
    daily_summary: '📊'
  }
  return icons[type]
}

/**
 * Format notification message based on type and data
 */
export function formatNotificationMessage(
  type: NotificationType,
  data: Record<string, any>
): { title: string; message: string } {
  switch (type) {
    case 'appointment_confirmed':
      return {
        title: 'Cita confirmada',
        message: `${data.clientName} confirmó su cita para ${data.date} a las ${data.time}`
      }

    case 'appointment_cancelled':
      return {
        title: '🚨 Cita cancelada',
        message: `${data.clientName} canceló su cita de ${data.service} programada para ${data.time}`
      }

    case 'campaign_response':
      return {
        title: 'Respuesta de campaña',
        message: `${data.clientName} respondió al mensaje de retención`
      }

    case 'invoice_paid':
      return {
        title: 'Factura pagada',
        message: `Factura #${data.invoiceNumber} de ${data.clientName} ha sido pagada (€${data.amount})`
      }

    case 'low_stock':
      return {
        title: '⚠️ Stock bajo',
        message: `${data.productName} tiene solo ${data.quantity} unidades restantes`
      }

    case 'client_reactivated':
      return {
        title: 'Cliente reactivada',
        message: `${data.clientName} agendó cita después de ${data.daysSinceLastVisit} días`
      }

    case 'vip_response':
      return {
        title: '⭐ Cliente VIP respondió',
        message: `${data.clientName} (VIP) respondió a tu mensaje. Responde pronto.`
      }

    case 'daily_summary':
      return {
        title: '📊 Resumen del día',
        message: `${data.appointments} citas, €${data.revenue} facturado, ${data.messages} mensajes enviados`
      }

    default:
      return {
        title: 'Notificación',
        message: 'Nueva actualización disponible'
      }
  }
}

/**
 * Create a notification object
 */
export function createNotification(
  tenantId: string,
  type: NotificationType,
  data: Record<string, any>
): Omit<Notification, 'id' | 'createdAt'> {
  const { title, message } = formatNotificationMessage(type, data)
  const priority = isUrgentNotification(type) ? 'urgent' : 'normal'
  const icon = getNotificationIcon(type)

  return {
    tenantId,
    type,
    priority,
    title,
    message,
    icon,
    data,
    read: false
  }
}

/**
 * Subscribe to Supabase Realtime notifications
 * @example
 * const unsubscribe = subscribeToNotifications(tenantId, (notification) => {
 *   showToast(notification.priority === 'urgent' ? 'urgent' : 'info', notification.title, notification.message)
 * })
 */
export function subscribeToNotifications(
  tenantId: string,
  onNotification: (notification: Notification) => void
): () => void {
  // TODO: Implement Supabase Realtime subscription
  // const supabase = createClient()
  // const channel = supabase
  //   .channel('notifications')
  //   .on(
  //     'postgres_changes',
  //     {
  //       event: 'INSERT',
  //       schema: 'public',
  //       table: 'notifications',
  //       filter: `tenant_id=eq.${tenantId}`
  //     },
  //     (payload) => {
  //       onNotification(payload.new as Notification)
  //     }
  //   )
  //   .subscribe()
  //
  // return () => {
  //   supabase.removeChannel(channel)
  // }

  // Mock implementation
  console.log(`Subscribed to notifications for tenant ${tenantId}`)
  return () => {
    console.log('Unsubscribed from notifications')
  }
}

/**
 * Mark notification as read
 */
export async function markNotificationAsRead(notificationId: string): Promise<void> {
  // TODO: Implement Supabase update
  // await supabase
  //   .from('notifications')
  //   .update({ read: true })
  //   .eq('id', notificationId)

  console.log(`Marked notification ${notificationId} as read`)
}

/**
 * Mark all notifications as read for tenant
 */
export async function markAllNotificationsAsRead(tenantId: string): Promise<void> {
  // TODO: Implement Supabase update
  // await supabase
  //   .from('notifications')
  //   .update({ read: true })
  //   .eq('tenant_id', tenantId)
  //   .eq('read', false)

  console.log(`Marked all notifications as read for tenant ${tenantId}`)
}

/**
 * Delete notification
 */
export async function deleteNotification(notificationId: string): Promise<void> {
  // TODO: Implement Supabase delete
  // await supabase
  //   .from('notifications')
  //   .delete()
  //   .eq('id', notificationId)

  console.log(`Deleted notification ${notificationId}`)
}

/**
 * Get unread notification count
 */
export async function getUnreadCount(tenantId: string): Promise<number> {
  // TODO: Implement Supabase query
  // const { count } = await supabase
  //   .from('notifications')
  //   .select('*', { count: 'exact', head: true })
  //   .eq('tenant_id', tenantId)
  //   .eq('read', false)
  //
  // return count || 0

  // Mock
  return 3
}
