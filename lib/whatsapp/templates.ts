/**
 * Templates de mensajes de WhatsApp
 *
 * IMPORTANTE: Los templates deben ser aprobados por Meta antes de usarse.
 * Este archivo contiene los templates que se enviarán para aprobación.
 */

export interface MessageTemplate {
  name: string
  category: 'MARKETING' | 'UTILITY' | 'AUTHENTICATION'
  language: string
  components: any[]
}

/**
 * Template: Recordatorio de cita
 * Categoría: UTILITY
 * Variables: {1} = nombre, {2} = fecha, {3} = hora, {4} = servicio
 */
export const APPOINTMENT_REMINDER: MessageTemplate = {
  name: 'appointment_reminder',
  category: 'UTILITY',
  language: 'es',
  components: [
    {
      type: 'BODY',
      text: 'Hola {{1}}! 👋\n\nTe recordamos tu cita:\n📅 {{2}}\n⏰ {{3}}\n💅 {{4}}\n\n¡Te esperamos!',
    },
  ],
}

/**
 * Template: Confirmación de cita
 * Categoría: UTILITY
 * Variables: {1} = nombre, {2} = fecha, {3} = hora
 */
export const APPOINTMENT_CONFIRMATION: MessageTemplate = {
  name: 'appointment_confirmation',
  category: 'UTILITY',
  language: 'es',
  components: [
    {
      type: 'BODY',
      text: '✅ ¡Cita confirmada!\n\nHola {{1}}, tu cita ha sido confirmada para:\n📅 {{2}}\n⏰ {{3}}\n\n¡Nos vemos pronto! 💅',
    },
  ],
}

/**
 * Template: Cliente en riesgo (retención)
 * Categoría: MARKETING
 * Variables: {1} = nombre, {2} = días desde última visita
 */
export const RETENTION_MESSAGE: MessageTemplate = {
  name: 'retention_message',
  category: 'MARKETING',
  language: 'es',
  components: [
    {
      type: 'BODY',
      text: 'Hola {{1}}! 👋\n\n¡Te echamos de menos! Han pasado {{2}} días desde tu última visita.\n\n¿Te gustaría reservar una cita? Tenemos disponibilidad esta semana. 💅✨',
    },
  ],
}

/**
 * Template: Oferta especial
 * Categoría: MARKETING
 * Variables: {1} = nombre, {2} = descuento, {3} = servicio
 */
export const SPECIAL_OFFER: MessageTemplate = {
  name: 'special_offer',
  category: 'MARKETING',
  language: 'es',
  components: [
    {
      type: 'BODY',
      text: '🎉 ¡Oferta especial para ti!\n\nHola {{1}}, por ser cliente VIP tienes {{2}}% de descuento en {{3}}.\n\n¿Reservamos una cita? Responde a este mensaje. 💅',
    },
  ],
}

/**
 * Template: Agradecimiento post-visita
 * Categoría: UTILITY
 * Variables: {1} = nombre
 */
export const POST_VISIT_THANKS: MessageTemplate = {
  name: 'post_visit_thanks',
  category: 'UTILITY',
  language: 'es',
  components: [
    {
      type: 'BODY',
      text: '¡Gracias por tu visita!\n\nHola {{1}}, esperamos que hayas disfrutado de tu experiencia. 💅\n\n¿Nos dejarías tu opinión? Tu feedback nos ayuda a mejorar.',
    },
  ],
}

/**
 * Template: Cancelación de cita
 * Categoría: UTILITY
 * Variables: {1} = nombre, {2} = fecha, {3} = hora
 */
export const APPOINTMENT_CANCELLED: MessageTemplate = {
  name: 'appointment_cancelled',
  category: 'UTILITY',
  language: 'es',
  components: [
    {
      type: 'BODY',
      text: 'Cita cancelada\n\nHola {{1}}, tu cita del {{2}} a las {{3}} ha sido cancelada.\n\nSi deseas reagendar, responde a este mensaje. 📅',
    },
  ],
}

/**
 * Helper: Construir componentes de template con parámetros
 */
export function buildTemplateComponents(params: string[]): any[] {
  return [
    {
      type: 'body',
      parameters: params.map((value) => ({
        type: 'text',
        text: value,
      })),
    },
  ]
}

/**
 * Obtener template por nombre
 */
export function getTemplate(name: string): MessageTemplate | null {
  const templates: Record<string, MessageTemplate> = {
    appointment_reminder: APPOINTMENT_REMINDER,
    appointment_confirmation: APPOINTMENT_CONFIRMATION,
    retention_message: RETENTION_MESSAGE,
    special_offer: SPECIAL_OFFER,
    post_visit_thanks: POST_VISIT_THANKS,
    appointment_cancelled: APPOINTMENT_CANCELLED,
  }

  return templates[name] || null
}

/**
 * Lista de todos los templates disponibles
 */
export const ALL_TEMPLATES = [
  APPOINTMENT_REMINDER,
  APPOINTMENT_CONFIRMATION,
  RETENTION_MESSAGE,
  SPECIAL_OFFER,
  POST_VISIT_THANKS,
  APPOINTMENT_CANCELLED,
]
