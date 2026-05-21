import { NextRequest, NextResponse } from 'next/server'
import { reservationAgent } from '@/lib/ai/reservation-agent'

// Webhook para recibir mensajes de WhatsApp Business API
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Verificar que es un mensaje de WhatsApp
    if (body.object !== 'whatsapp_business_account') {
      return NextResponse.json({ error: 'Invalid webhook object' }, { status: 400 })
    }

    // Extraer mensajes entrantes
    const entry = body.entry?.[0]
    const changes = entry?.changes?.[0]
    const value = changes?.value

    if (!value?.messages) {
      return NextResponse.json({ status: 'no messages' })
    }

    // Procesar cada mensaje
    for (const message of value.messages) {
      await processIncomingMessage(message, value.metadata)
    }

    return NextResponse.json({ status: 'ok' })
  } catch (error) {
    console.error('[WhatsApp Webhook] Error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// Verificación del webhook (requerido por WhatsApp)
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const mode = searchParams.get('hub.mode')
  const token = searchParams.get('hub.verify_token')
  const challenge = searchParams.get('hub.challenge')

  const VERIFY_TOKEN =
    process.env.WHATSAPP_VERIFY_TOKEN ||
    process.env.WHATSAPP_WEBHOOK_VERIFY_TOKEN

  if (mode === 'subscribe' && token === VERIFY_TOKEN) {
    console.log('[WhatsApp Webhook] Verificación exitosa')
    return new NextResponse(challenge, { status: 200 })
  }

  return NextResponse.json(
    { error: 'Forbidden' },
    { status: 403 }
  )
}

async function processIncomingMessage(message: any, metadata: any) {
  try {
    const messageType = message.type
    const from = message.from // Número de teléfono del cliente
    const messageId = message.id

    // Solo procesar mensajes de texto por ahora
    if (messageType !== 'text') {
      console.log(`[WhatsApp] Tipo de mensaje no soportado: ${messageType}`)
      return
    }

    const messageText = message.text.body

    console.log(`[WhatsApp] Mensaje recibido de ${from}: ${messageText}`)

    // 1. Buscar o crear cliente en base de datos
    const client = await findOrCreateClient(from)

    // 2. Obtener contexto de conversación
    const context = await getConversationContext(client)

    // 3. Procesar mensaje con agente de IA
    const { intent, response, actions } = await reservationAgent.processMessage(
      messageText,
      context
    )

    console.log('[WhatsApp] Intención detectada:', intent)
    console.log('[WhatsApp] Acciones a ejecutar:', actions)

    // 4. Ejecutar acciones detectadas
    for (const action of actions) {
      await executeAction(action, client)
    }

    // 5. Enviar respuesta por WhatsApp
    await sendWhatsAppMessage(from, response)

    // 6. Guardar en historial de conversación
    await saveToConversationHistory(client.id, messageText, response)

    // 7. Crear notificación para el salón
    await createNotification({
      type: 'whatsapp_message',
      clientId: client.id,
      message: messageText,
      intent: intent.type,
      tenantId: client.tenantId
    })

  } catch (error) {
    console.error('[WhatsApp] Error procesando mensaje:', error)

    // Enviar mensaje de error genérico
    try {
      await sendWhatsAppMessage(
        message.from,
        'Disculpa, tengo un problema técnico. Un miembro de nuestro equipo te contactará pronto 😊'
      )
    } catch (sendError) {
      console.error('[WhatsApp] Error enviando mensaje de error:', sendError)
    }
  }
}

async function findOrCreateClient(phone: string): Promise<any> {
  // TODO: Implementar con Supabase

  // await supabase
  //   .from('clients')
  //   .select('*')
  //   .eq('phone', phone)
  //   .single()

  // Si no existe, crear nuevo cliente
  // await supabase
  //   .from('clients')
  //   .insert({
  //     phone,
  //     name: 'Cliente nuevo',
  //     source: 'whatsapp'
  //   })

  return {
    id: 'mock-client-id',
    name: 'María López',
    phone,
    tenantId: 'mock-tenant-id'
  }
}

async function getConversationContext(client: any): Promise<any> {
  // TODO: Obtener historial de conversación de últimas 24h

  // const history = await supabase
  //   .from('whatsapp_messages')
  //   .select('*')
  //   .eq('client_id', client.id)
  //   .gte('created_at', new Date(Date.now() - 24 * 60 * 60 * 1000))
  //   .order('created_at', { ascending: true })

  // const lastAppointment = await supabase
  //   .from('appointments')
  //   .select('*')
  //   .eq('client_id', client.id)
  //   .order('date', { ascending: false })
  //   .limit(1)
  //   .single()

  return {
    clientId: client.id,
    clientName: client.name,
    phone: client.phone,
    conversationHistory: [],
    lastAppointment: null
  }
}

async function executeAction(action: any, client: any) {
  console.log(`[WhatsApp] Ejecutando acción: ${action.type}`)

  switch (action.type) {
    case 'create_appointment':
      await createAppointment(action.data)
      break

    case 'update_appointment':
      await updateAppointment(action.data)
      break

    case 'cancel_appointment':
      await cancelAppointment(action.data)
      break

    case 'send_confirmation':
      await sendConfirmation(action.data)
      break
  }
}

async function createAppointment(data: any) {
  // TODO: Crear cita en Supabase

  // await supabase
  //   .from('appointments')
  //   .insert({
  //     client_id: data.clientId,
  //     service: data.service,
  //     date: data.date,
  //     time: data.time,
  //     status: 'confirmed',
  //     source: 'whatsapp_bot'
  //   })

  console.log('[WhatsApp] Cita creada:', data)
}

async function updateAppointment(data: any) {
  // TODO: Actualizar cita en Supabase
  console.log('[WhatsApp] Cita actualizada:', data)
}

async function cancelAppointment(data: any) {
  // TODO: Cancelar cita en Supabase
  console.log('[WhatsApp] Cita cancelada:', data)
}

async function sendConfirmation(data: any) {
  // Enviar mensaje de confirmación
  console.log('[WhatsApp] Confirmación enviada:', data)
}

async function sendWhatsAppMessage(to: string, message: string) {
  const WHATSAPP_API_URL = 'https://graph.facebook.com/v18.0'
  const PHONE_NUMBER_ID = process.env.WHATSAPP_PHONE_NUMBER_ID
  const ACCESS_TOKEN = process.env.WHATSAPP_ACCESS_TOKEN

  try {
    const response = await fetch(
      `${WHATSAPP_API_URL}/${PHONE_NUMBER_ID}/messages`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${ACCESS_TOKEN}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          messaging_product: 'whatsapp',
          to,
          type: 'text',
          text: {
            body: message
          }
        })
      }
    )

    if (!response.ok) {
      throw new Error(`WhatsApp API error: ${response.statusText}`)
    }

    const result = await response.json()
    console.log('[WhatsApp] Mensaje enviado:', result)

    return result
  } catch (error) {
    console.error('[WhatsApp] Error enviando mensaje:', error)
    throw error
  }
}

async function saveToConversationHistory(
  clientId: string,
  userMessage: string,
  botResponse: string
) {
  // TODO: Guardar en Supabase

  // await supabase.from('whatsapp_messages').insert([
  //   {
  //     client_id: clientId,
  //     direction: 'inbound',
  //     content: userMessage,
  //     created_at: new Date()
  //   },
  //   {
  //     client_id: clientId,
  //     direction: 'outbound',
  //     content: botResponse,
  //     created_at: new Date()
  //   }
  // ])

  console.log('[WhatsApp] Guardado en historial')
}

async function createNotification(data: any) {
  // TODO: Crear notificación en sistema
  console.log('[WhatsApp] Notificación creada:', data)
}
