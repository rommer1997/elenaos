import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { getRetentionMetrics } from '@/lib/ai/retention-engine'

/**
 * GET /api/retention/metrics
 * Obtiene métricas de las campañas de retención
 */
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()

    // Verificar autenticación
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    // TODO: Obtener tenant_id del usuario
    const tenantId = 'mock-tenant-id'

    // Obtener días del query param (default: 30)
    const { searchParams } = new URL(request.url)
    const days = parseInt(searchParams.get('days') || '30')

    const metrics = await getRetentionMetrics(tenantId, days)

    return NextResponse.json({
      success: true,
      metrics,
      period: `${days} días`
    })
  } catch (error) {
    console.error('Error getting retention metrics:', error)
    return NextResponse.json(
      { error: 'Error obteniendo métricas' },
      { status: 500 }
    )
  }
}
