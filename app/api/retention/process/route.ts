import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { processPendingCampaigns } from '@/lib/ai/retention-engine'

/**
 * POST /api/retention/process
 * Procesa campañas pendientes y envía mensajes programados
 *
 * Este endpoint debe ser llamado por un cron job cada hora
 */
export async function POST(request: NextRequest) {
  try {
    // Verificar autenticación con API key o Bearer token
    const authHeader = request.headers.get('authorization')

    if (!authHeader || authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    // TODO: Obtener todos los tenants activos y procesar sus campañas
    const tenantIds = ['mock-tenant-id'] // Mock

    const results = []

    for (const tenantId of tenantIds) {
      const result = await processPendingCampaigns(tenantId)
      results.push({
        tenantId,
        ...result
      })
    }

    return NextResponse.json({
      success: true,
      results,
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.error('Error processing retention campaigns:', error)
    return NextResponse.json(
      { error: 'Error procesando campañas' },
      { status: 500 }
    )
  }
}

/**
 * GET /api/retention/process
 * Status endpoint para verificar que el cron está configurado
 */
export async function GET() {
  return NextResponse.json({
    status: 'ok',
    endpoint: '/api/retention/process',
    description: 'Procesa campañas de retención pendientes',
    frequency: 'Debe ejecutarse cada hora vía cron job'
  })
}
