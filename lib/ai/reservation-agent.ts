// Agente autónomo de reservas con NLP
// Procesa mensajes de WhatsApp y crea/modifica citas automáticamente

interface ReservationIntent {
  type: 'create' | 'modify' | 'cancel' | 'inquiry' | 'unknown'
  confidence: number
  entities: {
    clientName?: string
    service?: string
    date?: string
    time?: string
    appointmentId?: string
  }
}

interface ReservationContext {
  clientId: string
  clientName: string
  phone: string
  conversationHistory: Array<{
    role: 'user' | 'assistant'
    content: string
    timestamp: Date
  }>
  lastAppointment?: {
    id: string
    service: string
    date: string
  }
}

type ReservationAction =
  | {
      type: 'create_appointment'
      data: {
        clientId: string
        service?: string
        date?: string
        time?: string
      }
    }
  | {
      type: 'update_appointment'
      data: {
        appointmentId: string
        updates: {
          date?: string
          time?: string
        }
      }
    }
  | {
      type: 'cancel_appointment'
      data: {
        appointmentId: string
      }
    }
  | {
      type: 'send_confirmation'
      data: {
        clientId: string
        appointmentDetails: ReservationIntent['entities']
      }
    }

export class ReservationAgent {
  private readonly systemPrompt = `Eres Elena, asistente virtual de un salón de belleza.

Tu objetivo es ayudar a las clientas a:
- Agendar nuevas citas
- Modificar citas existentes
- Cancelar citas
- Consultar disponibilidad
- Obtener información sobre servicios

Reglas importantes:
1. Sé amable, profesional y cercana
2. Confirma siempre los detalles antes de agendar
3. Si falta información, pregunta de forma natural
4. Usa emojis con moderación (1-2 por mensaje)
5. Responde en español de España
6. Si no entiendes algo, pide aclaración
7. Nunca inventes horarios o servicios
8. Siempre confirma con la clienta antes de modificar/cancelar

Información del salón:
- Horario: Lunes a Sábado 9:00 - 20:00
- Servicios: Corte, Tinte, Mechas, Manicura, Pedicura, Facial
- Duración típica: 30-90 minutos según servicio
- Se requiere confirmación 24h antes`

  async processMessage(
    message: string,
    context: ReservationContext
  ): Promise<{
    intent: ReservationIntent
    response: string
    actions: ReservationAction[]
  }> {
    // 1. Detectar intención del mensaje
    const intent = await this.detectIntent(message, context)

    // 2. Generar respuesta apropiada
    const response = await this.generateResponse(message, intent, context)

    // 3. Determinar acciones a ejecutar
    const actions = await this.determineActions(intent, context)

    return { intent, response, actions }
  }

  private async detectIntent(
    message: string,
    context: ReservationContext
  ): Promise<ReservationIntent> {
    // Usar Claude API para detectar intención
    const prompt = `Analiza el siguiente mensaje de una clienta y extrae:
1. Intención principal (create/modify/cancel/inquiry/unknown)
2. Nivel de confianza (0-1)
3. Entidades mencionadas (nombre, servicio, fecha, hora)

Mensaje: "${message}"

Contexto:
- Cliente: ${context.clientName}
- Última cita: ${context.lastAppointment ? `${context.lastAppointment.service} el ${context.lastAppointment.date}` : 'ninguna'}

Responde en formato JSON:
{
  "type": "create|modify|cancel|inquiry|unknown",
  "confidence": 0.95,
  "entities": {
    "clientName": "María",
    "service": "corte",
    "date": "mañana",
    "time": "10:00"
  }
}`

    try {
      // TODO: Integrar con Claude API real
      const result = await this.callClaudeAPI(prompt)
      return this.parseIntentResponse(result)
    } catch (error) {
      console.error('[Agent] Error detectando intención:', error)
      return {
        type: 'unknown',
        confidence: 0,
        entities: {}
      }
    }
  }

  private async generateResponse(
    message: string,
    intent: ReservationIntent,
    context: ReservationContext
  ): Promise<string> {
    // Construir conversación completa
    const conversationHistory = context.conversationHistory
      .map(msg => `${msg.role === 'user' ? 'Cliente' : 'Elena'}: ${msg.content}`)
      .join('\n')

    const prompt = `${this.systemPrompt}

Historial de conversación:
${conversationHistory}

Cliente: ${message}

Intención detectada: ${intent.type} (confianza: ${intent.confidence})
Entidades: ${JSON.stringify(intent.entities)}

Responde de forma natural y profesional. Si la intención es clara y tienes toda la información, confirma la acción. Si falta información, pregunta amablemente.`

    try {
      const response = await this.callClaudeAPI(prompt)
      return response.trim()
    } catch (error) {
      console.error('[Agent] Error generando respuesta:', error)
      return 'Disculpa, tengo un problema técnico. ¿Puedes intentar de nuevo en un momento? 😊'
    }
  }

  private async determineActions(
    intent: ReservationIntent,
    context: ReservationContext
  ): Promise<ReservationAction[]> {
    const actions: ReservationAction[] = []

    // Solo ejecutar acciones si la confianza es alta
    if (intent.confidence < 0.7) {
      return actions
    }

    switch (intent.type) {
      case 'create':
        if (this.hasAllEntities(intent, ['service', 'date', 'time'])) {
          actions.push({
            type: 'create_appointment',
            data: {
              clientId: context.clientId,
              service: intent.entities.service,
              date: intent.entities.date,
              time: intent.entities.time
            }
          })
          actions.push({
            type: 'send_confirmation',
            data: {
              clientId: context.clientId,
              appointmentDetails: intent.entities
            }
          })
        }
        break

      case 'modify':
        if (intent.entities.appointmentId) {
          actions.push({
            type: 'update_appointment',
            data: {
              appointmentId: intent.entities.appointmentId,
              updates: {
                date: intent.entities.date,
                time: intent.entities.time
              }
            }
          })
        }
        break

      case 'cancel':
        {
          const appointmentId = intent.entities.appointmentId ?? context.lastAppointment?.id
          if (!appointmentId) break

          actions.push({
            type: 'cancel_appointment',
            data: {
              appointmentId
            }
          })
        }
        break
    }

    return actions
  }

  private hasAllEntities(intent: ReservationIntent, required: string[]): boolean {
    return required.every(key => intent.entities[key as keyof typeof intent.entities])
  }

  private async callClaudeAPI(prompt: string): Promise<string> {
    // TODO: Implementar llamada real a Claude API
    // Por ahora retornar respuesta mock

    // En producción:
    // const response = await fetch('https://api.anthropic.com/v1/messages', {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json',
    //     'x-api-key': process.env.ANTHROPIC_API_KEY,
    //     'anthropic-version': '2023-06-01'
    //   },
    //   body: JSON.stringify({
    //     model: 'claude-3-5-sonnet-20241022',
    //     max_tokens: 1024,
    //     messages: [{ role: 'user', content: prompt }]
    //   })
    // })

    return 'Respuesta mock del agente'
  }

  private parseIntentResponse(response: string): ReservationIntent {
    try {
      const parsed = JSON.parse(response)
      return parsed
    } catch (error) {
      return {
        type: 'unknown',
        confidence: 0,
        entities: {}
      }
    }
  }

  // Helpers para parsing de fechas en español
  parseSpanishDate(dateStr: string): Date | null {
    const today = new Date()
    const normalized = dateStr.toLowerCase().trim()

    // Patrones comunes
    const patterns: Record<string, () => Date> = {
      'hoy': () => today,
      'mañana': () => {
        const tomorrow = new Date(today)
        tomorrow.setDate(tomorrow.getDate() + 1)
        return tomorrow
      },
      'pasado mañana': () => {
        const day = new Date(today)
        day.setDate(day.getDate() + 2)
        return day
      },
      'lunes': () => this.getNextWeekday(1),
      'martes': () => this.getNextWeekday(2),
      'miércoles': () => this.getNextWeekday(3),
      'jueves': () => this.getNextWeekday(4),
      'viernes': () => this.getNextWeekday(5),
      'sábado': () => this.getNextWeekday(6),
      'domingo': () => this.getNextWeekday(0)
    }

    if (patterns[normalized]) {
      return patterns[normalized]()
    }

    // Intentar formato DD/MM/YYYY o DD-MM-YYYY
    const dateMatch = normalized.match(/(\d{1,2})[\/\-](\d{1,2})[\/\-]?(\d{2,4})?/)
    if (dateMatch) {
      const day = parseInt(dateMatch[1])
      const month = parseInt(dateMatch[2]) - 1
      const year = dateMatch[3] ? parseInt(dateMatch[3]) : today.getFullYear()
      return new Date(year, month, day)
    }

    return null
  }

  private getNextWeekday(targetDay: number): Date {
    const today = new Date()
    const currentDay = today.getDay()
    let daysUntil = targetDay - currentDay

    if (daysUntil <= 0) {
      daysUntil += 7
    }

    const result = new Date(today)
    result.setDate(result.getDate() + daysUntil)
    return result
  }

  parseSpanishTime(timeStr: string): string | null {
    const normalized = timeStr.toLowerCase().trim()

    // Formato HH:MM
    const timeMatch = normalized.match(/(\d{1,2}):?(\d{2})/)
    if (timeMatch) {
      const hours = parseInt(timeMatch[1])
      const minutes = timeMatch[2] || '00'
      return `${hours.toString().padStart(2, '0')}:${minutes}`
    }

    // Formato "X de la mañana/tarde"
    const textMatch = normalized.match(/(\d{1,2})\s*(de\s*)?(la\s*)?(mañana|tarde|noche)/)
    if (textMatch) {
      let hours = parseInt(textMatch[1])
      const period = textMatch[4]

      if (period === 'tarde' && hours < 12) {
        hours += 12
      } else if (period === 'noche' && hours < 12) {
        hours += 12
      }

      return `${hours.toString().padStart(2, '0')}:00`
    }

    return null
  }
}

// Instancia singleton
export const reservationAgent = new ReservationAgent()
