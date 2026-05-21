import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { generateRetentionMessage, type ClientProfile } from '@/lib/ai/message-generator'
import { calculateChurnRisk, type ClientData } from '@/lib/ai/risk-calculator'

interface GenerateMessageRequest {
  clientId: string
}

/**
 * POST /api/ai/generate-message
 * Genera un mensaje personalizado de retención para una clienta
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

    const body: GenerateMessageRequest = await request.json()
    const { clientId } = body

    if (!clientId) {
      return NextResponse.json(
        { error: 'clientId es requerido' },
        { status: 400 }
      )
    }

    // TODO: Obtener datos de la clienta con sus visitas
    // const { data: client } = await supabase
    //   .schema(getSchemaName(tenantId))
    //   .from('clients')
    //   .select(`
    //     *,
    //     visits:appointments(date, service_id, price)
    //   `)
    //   .eq('id', clientId)
    //   .single()

    // Mock data para demostración
    const mockClientData: ClientData = {
      id: clientId,
      first_name: 'Carmen',
      last_name: 'López',
      phone: '+34666123456',
      visits: [
        { date: '2026-03-15', service_id: 'service-1', price: 45 },
        { date: '2026-04-20', service_id: 'service-2', price: 55 },
        { date: '2026-05-15', service_id: 'service-1', price: 45 }
      ],
      whatsapp_opt_out: false,
      created_at: '2024-01-10T10:00:00Z'
    }

    // Calcular riesgo
    const riskCalculation = calculateChurnRisk(mockClientData)

    // Construir perfil para Claude
    const clientProfile: ClientProfile = {
      id: clientId,
      firstName: mockClientData.first_name,
      lastName: mockClientData.last_name,
      phone: mockClientData.phone,
      riskCalculation,
      preferredServices: ['Manicura', 'Pedicura'],
      lastVisitDate: '2026-05-15',
      lastVisitService: 'Manicura clásica'
    }

    // Generar mensaje con Claude
    const generatedMessage = await generateRetentionMessage(clientProfile)

    return NextResponse.json({
      success: true,
      message: generatedMessage.message,
      tone: generatedMessage.tone,
      engagementScore: generatedMessage.estimatedEngagementScore,
      riskScore: riskCalculation.riskScore,
      riskLevel: riskCalculation.riskLevel
    })
  } catch (error) {
    console.error('Error generating AI message:', error)
    return NextResponse.json(
      { error: 'Error generando mensaje con IA' },
      { status: 500 }
    )
  }
}
