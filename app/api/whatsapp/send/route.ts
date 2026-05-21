import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { getWhatsAppClient } from '@/lib/whatsapp/client'
import { buildTemplateComponents } from '@/lib/whatsapp/templates'

interface SendMessageRequest {
  clientId: string
  message: string
  templateName?: string
  templateParams?: string[]
}

/**
 * POST /api/whatsapp/send
 * Envía un mensaje de WhatsApp a un cliente
 */
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()

    // Verificar autenticación
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const body: SendMessageRequest = await request.json()
    const { clientId, message, templateName, templateParams } = body

    if (!clientId || (!message && !templateName)) {
      return NextResponse.json(
        { error: 'clientId y (message o templateName) son requeridos' },
        { status: 400 }
      )
    }

    // Obtener información del cliente
    // TODO: Implementar query real con el schema del tenant
    // Por ahora usamos datos mock
    const clientPhone = '+34666123456' // Mock

    // Verificar que el cliente acepta mensajes de WhatsApp
    // if (client.whatsapp_opt_out) {
    //   return NextResponse.json(
    //     { error: 'El cliente ha rechazado recibir mensajes de WhatsApp' },
    //     { status: 403 }
    //   )
    // }

    const whatsapp = getWhatsAppClient()
    let result

    if (templateName && templateParams) {
      // Enviar con template
      const components = buildTemplateComponents(templateParams)
      result = await whatsapp.sendTemplateMessage(clientPhone, templateName, 'es', components)
    } else {
      // Enviar mensaje simple
      result = await whatsapp.sendTextMessage(clientPhone, message)
    }

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 500 })
    }

    // Guardar mensaje en la base de datos
    // TODO: Implementar guardado en schema del tenant
    // await supabase.from('whatsapp_messages').insert({
    //   client_id: clientId,
    //   tenant_id: user.tenant_id,
    //   direction: 'outbound',
    //   message_id: result.messageId,
    //   to_number: clientPhone,
    //   message_text: message,
    //   template_name: templateName,
    //   status: 'sent',
    //   sent_at: new Date().toISOString(),
    // })

    return NextResponse.json({
      success: true,
      messageId: result.messageId,
    })
  } catch (error) {
    console.error('Error sending WhatsApp message:', error)
    return NextResponse.json(
      { error: 'Error enviando mensaje' },
      { status: 500 }
    )
  }
}
