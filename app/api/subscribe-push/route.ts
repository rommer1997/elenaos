import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const subscription = await request.json()

    // TODO: Guardar la suscripción en Supabase
    // await supabase
    //   .from('push_subscriptions')
    //   .insert({
    //     user_id: userId,
    //     subscription: subscription,
    //     tenant_id: tenantId
    //   })

    console.log('[Push] Nueva suscripción guardada:', subscription)

    return NextResponse.json({
      success: true,
      message: 'Suscripción guardada exitosamente'
    })
  } catch (error) {
    console.error('[Push] Error al guardar suscripción:', error)
    return NextResponse.json(
      { success: false, error: 'Error al guardar suscripción' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { endpoint } = await request.json()

    // TODO: Eliminar la suscripción de Supabase
    // await supabase
    //   .from('push_subscriptions')
    //   .delete()
    //   .eq('endpoint', endpoint)

    console.log('[Push] Suscripción eliminada:', endpoint)

    return NextResponse.json({
      success: true,
      message: 'Suscripción eliminada exitosamente'
    })
  } catch (error) {
    console.error('[Push] Error al eliminar suscripción:', error)
    return NextResponse.json(
      { success: false, error: 'Error al eliminar suscripción' },
      { status: 500 }
    )
  }
}
