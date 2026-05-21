/**
 * Cliente para WhatsApp Business API (Meta Cloud)
 * Documentación: https://developers.facebook.com/docs/whatsapp/cloud-api
 */

interface WhatsAppConfig {
  phoneNumberId: string
  accessToken: string
  verifyToken: string
  apiVersion: string
}

interface SendMessageParams {
  to: string
  message: string
  templateName?: string
  templateParams?: string[]
}

interface SendMessageResponse {
  success: boolean
  messageId?: string
  error?: string
}

interface WhatsAppTemplateComponent {
  type: string
  parameters?: Array<{
    type: string
    text?: string
  }>
}

interface IncomingWhatsAppWebhook {
  entry?: Array<{
    changes?: Array<{
      value?: {
        messages?: Array<{
          from: string
          id: string
          timestamp: string
          text?: {
            body?: string
          }
        }>
      }
    }>
  }>
}

class WhatsAppClient {
  private config: WhatsAppConfig

  constructor() {
    this.config = {
      phoneNumberId: process.env.WHATSAPP_PHONE_NUMBER_ID || '',
      accessToken: process.env.WHATSAPP_ACCESS_TOKEN || '',
      verifyToken:
        process.env.WHATSAPP_VERIFY_TOKEN ||
        process.env.WHATSAPP_WEBHOOK_VERIFY_TOKEN ||
        '',
      apiVersion: process.env.WHATSAPP_API_VERSION || 'v18.0',
    }
  }

  /**
   * Envía un mensaje de texto simple
   */
  async sendTextMessage(to: string, message: string): Promise<SendMessageResponse> {
    try {
      const url = `https://graph.facebook.com/${this.config.apiVersion}/${this.config.phoneNumberId}/messages`

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${this.config.accessToken}`,
        },
        body: JSON.stringify({
          messaging_product: 'whatsapp',
          recipient_type: 'individual',
          to: to.replace(/\D/g, ''), // Remover caracteres no numéricos
          type: 'text',
          text: {
            preview_url: false,
            body: message,
          },
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        console.error('WhatsApp API error:', data)
        return {
          success: false,
          error: data.error?.message || 'Error enviando mensaje',
        }
      }

      return {
        success: true,
        messageId: data.messages?.[0]?.id,
      }
    } catch (error) {
      console.error('Error sending WhatsApp message:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Error desconocido',
      }
    }
  }

  /**
   * Envía un mensaje usando un template aprobado
   */
  async sendTemplateMessage(
    to: string,
    templateName: string,
    languageCode: string = 'es',
    components?: WhatsAppTemplateComponent[]
  ): Promise<SendMessageResponse> {
    try {
      const url = `https://graph.facebook.com/${this.config.apiVersion}/${this.config.phoneNumberId}/messages`

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${this.config.accessToken}`,
        },
        body: JSON.stringify({
          messaging_product: 'whatsapp',
          recipient_type: 'individual',
          to: to.replace(/\D/g, ''),
          type: 'template',
          template: {
            name: templateName,
            language: {
              code: languageCode,
            },
            components: components || [],
          },
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        console.error('WhatsApp API error:', data)
        return {
          success: false,
          error: data.error?.message || 'Error enviando template',
        }
      }

      return {
        success: true,
        messageId: data.messages?.[0]?.id,
      }
    } catch (error) {
      console.error('Error sending WhatsApp template:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Error desconocido',
      }
    }
  }

  /**
   * Envía un recordatorio de cita
   */
  async sendAppointmentReminder(
    to: string,
    clientName: string,
    appointmentDate: string,
    appointmentTime: string,
    serviceName: string
  ): Promise<SendMessageResponse> {
    const message = `Hola ${clientName}! 👋

Te recordamos tu cita:
📅 ${appointmentDate}
⏰ ${appointmentTime}
💅 ${serviceName}

¡Te esperamos!

Si necesitas cancelar o cambiar la hora, responde a este mensaje.`

    return this.sendTextMessage(to, message)
  }

  /**
   * Envía un mensaje de retención (cliente en riesgo)
   */
  async sendRetentionMessage(
    to: string,
    clientName: string,
    daysSinceLastVisit: number,
    personalizedMessage?: string
  ): Promise<SendMessageResponse> {
    const defaultMessage = `Hola ${clientName}! 👋

¡Te echamos de menos! Han pasado ${daysSinceLastVisit} días desde tu última visita.

¿Te gustaría reservar una cita? Tenemos disponibilidad esta semana y nos encantaría volver a verte.

Responde a este mensaje y te ayudamos a agendar. 💅✨`

    return this.sendTextMessage(to, personalizedMessage || defaultMessage)
  }

  /**
   * Verifica el token del webhook
   */
  verifyWebhook(mode: string, token: string, challenge: string): string | null {
    if (mode === 'subscribe' && token === this.config.verifyToken) {
      return challenge
    }
    return null
  }

  /**
   * Procesa un mensaje entrante del webhook
   */
  processIncomingMessage(body: IncomingWhatsAppWebhook): {
    from: string
    message: string
    messageId: string
    timestamp: number
  } | null {
    try {
      const entry = body.entry?.[0]
      const change = entry?.changes?.[0]
      const value = change?.value

      if (!value?.messages?.[0]) {
        return null
      }

      const message = value.messages[0]
      const from = message.from
      const messageText = message.text?.body || ''
      const messageId = message.id
      const timestamp = parseInt(message.timestamp)

      return {
        from,
        message: messageText,
        messageId,
        timestamp,
      }
    } catch (error) {
      console.error('Error processing incoming message:', error)
      return null
    }
  }
}

// Singleton instance
let whatsappClient: WhatsAppClient | null = null

export function getWhatsAppClient(): WhatsAppClient {
  if (!whatsappClient) {
    whatsappClient = new WhatsAppClient()
  }
  return whatsappClient
}

export type { SendMessageResponse, SendMessageParams }
