import { NextRequest, NextResponse } from 'next/server'
import { getWhatsAppClient } from '@/lib/whatsapp/client'
import { createClient } from '@/lib/supabase/server'

/**
 * GET - Verificación del webhook de WhatsApp
 * Meta llama este endpoint para verificar que el webhook es válido
 */
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const mode = searchParams.get('hub.mode')
  const token = searchParams.get('hub.verify_token')
  const challenge = searchParams.get('hub.challenge')

  console.log('Webhook verification request:', { mode, token, challenge })

  if (!mode || !token || !challenge) {
    return NextResponse.json({ error: 'Missing parameters' }, { status: 400 })
  }

  const whatsapp = getWhatsAppClient()
  const verifiedChallenge = whatsapp.verifyWebhook(mode, token, challenge)

  if (verifiedChallenge) {
    console.log('Webhook verified successfully')
    return new NextResponse(verifiedChallenge, { status: 200 })
  }

  console.error('Webhook verification failed')
  return NextResponse.json({ error: 'Verification failed' }, { status: 403 })
}

/**
 * POST - Recibir mensajes entrantes de WhatsApp
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    console.log('Incoming WhatsApp webhook:', JSON.stringify(body, null, 2))

    // Verificar que es un mensaje
    const entry = body.entry?.[0]
    if (!entry) {
      return NextResponse.json({ status: 'ok' }, { status: 200 })
    }

    const whatsapp = getWhatsAppClient()
    const incomingMessage = whatsapp.processIncomingMessage(body)

    if (!incomingMessage) {
      console.log('No message to process')
      return NextResponse.json({ status: 'ok' }, { status: 200 })
    }

    console.log('Processed message:', incomingMessage)

    // Guardar mensaje en la base de datos
    await saveIncomingMessage(incomingMessage)

    // TODO: Procesar el mensaje (respuestas automáticas, clasificación, etc.)
    // Por ahora solo lo guardamos

    return NextResponse.json({ status: 'ok' }, { status: 200 })
  } catch (error) {
    console.error('Error processing WhatsApp webhook:', error)
    // Siempre devolver 200 para que Meta no reintente
    return NextResponse.json({ status: 'ok' }, { status: 200 })
  }
}

/**
 * Guarda un mensaje entrante en la base de datos
 */
async function saveIncomingMessage(message: {
  from: string
  message: string
  messageId: string
  timestamp: number
}) {
  try {
    const supabase = await createClient()

    // TODO: Identificar el tenant y cliente por el número de teléfono
    // Por ahora guardamos en una tabla global de mensajes

    // Buscar cliente por teléfono
    // const { data: client } = await supabase
    //   .from('clients')
    //   .select('id, tenant_id')
    //   .eq('phone', message.from)
    //   .single()

    // Guardar mensaje
    // await supabase.from('whatsapp_messages').insert({
    //   client_id: client?.id,
    //   tenant_id: client?.tenant_id,
    //   direction: 'inbound',
    //   message_id: message.messageId,
    //   from_number: message.from,
    //   message_text: message.message,
    //   timestamp: new Date(message.timestamp * 1000).toISOString(),
    //   status: 'received',
    // })

    console.log('Message saved to database')
  } catch (error) {
    console.error('Error saving message to database:', error)
  }
}
