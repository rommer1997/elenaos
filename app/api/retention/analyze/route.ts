import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { runRetentionAnalysis } from '@/lib/ai/retention-engine'

/**
 * POST /api/retention/analyze
 * Ejecuta el análisis de retención para detectar clientas en riesgo
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

    // TODO: Obtener tenant_id del usuario
    const tenantId = 'mock-tenant-id'

    // Ejecutar análisis de retención
    const result = await runRetentionAnalysis(tenantId)

    return NextResponse.json({
      success: true,
      result,
    })
  } catch (error) {
    console.error('Error running retention analysis:', error)
    return NextResponse.json(
      { error: 'Error ejecutando análisis de retención' },
      { status: 500 }
    )
  }
}
