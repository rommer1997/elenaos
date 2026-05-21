import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { generateClientInsights, type ClientProfile } from '@/lib/ai/message-generator'
import { calculateChurnRisk, type ClientData } from '@/lib/ai/risk-calculator'

interface GenerateInsightsRequest {
  clientId: string
}

/**
 * POST /api/ai/generate-insights
 * Genera insights de IA sobre una clienta
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

    const body: GenerateInsightsRequest = await request.json()
    const { clientId } = body

    if (!clientId) {
      return NextResponse.json(
        { error: 'clientId es requerido' },
        { status: 400 }
      )
    }

    // TODO: Obtener datos reales de la clienta
    const mockClientData: ClientData = {
      id: clientId,
      first_name: 'Carmen',
      last_name: 'López',
      phone: '+34666123456',
      visits: [
        { date: '2026-01-10', service_id: 'service-1', price: 45 },
        { date: '2026-02-08', service_id: 'service-2', price: 55 },
        { date: '2026-03-15', service_id: 'service-1', price: 45 },
        { date: '2026-04-20', service_id: 'service-3', price: 65 },
        { date: '2026-05-15', service_id: 'service-1', price: 45 }
      ],
      whatsapp_opt_out: false,
      created_at: '2024-01-10T10:00:00Z'
    }

    // Calcular riesgo
    const riskCalculation = calculateChurnRisk(mockClientData)

    // Construir perfil
    const clientProfile: ClientProfile = {
      id: clientId,
      firstName: mockClientData.first_name,
      lastName: mockClientData.last_name,
      phone: mockClientData.phone,
      riskCalculation,
      preferredServices: ['Manicura', 'Pedicura', 'Tratamiento facial'],
      notes: 'Prefiere citas por la tarde'
    }

    // Generar insights con Claude
    const insights = await generateClientInsights(clientProfile)

    return NextResponse.json({
      success: true,
      insights,
      riskScore: riskCalculation.riskScore,
      riskLevel: riskCalculation.riskLevel,
      visitCount: riskCalculation.visitCount,
      lifetimeValue: riskCalculation.lifetimeValue
    })
  } catch (error) {
    console.error('Error generating AI insights:', error)
    return NextResponse.json(
      { error: 'Error generando insights con IA' },
      { status: 500 }
    )
  }
}
