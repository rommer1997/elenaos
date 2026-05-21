import { NextRequest, NextResponse } from 'next/server'
import { lemonSqueezy } from '@/lib/billing/lemon-squeezy'

// Webhook para eventos de Lemon Squeezy
export async function POST(request: NextRequest) {
  try {
    const body = await request.text()
    const signature = request.headers.get('x-signature') || ''
    const secret = process.env.LEMON_SQUEEZY_WEBHOOK_SECRET || ''

    // Verificar firma del webhook
    const isValid = await lemonSqueezy.verifyWebhook(body, signature, secret)

    if (!isValid) {
      console.error('[Billing] Invalid webhook signature')
      return NextResponse.json({ error: 'Invalid signature' }, { status: 401 })
    }

    const event = JSON.parse(body)
    const eventName = event.meta.event_name

    console.log(`[Billing] Webhook received: ${eventName}`)

    // Procesar evento según tipo
    switch (eventName) {
      case 'subscription_created':
        await handleSubscriptionCreated(event)
        break

      case 'subscription_updated':
        await handleSubscriptionUpdated(event)
        break

      case 'subscription_cancelled':
        await handleSubscriptionCancelled(event)
        break

      case 'subscription_resumed':
        await handleSubscriptionResumed(event)
        break

      case 'subscription_expired':
        await handleSubscriptionExpired(event)
        break

      case 'subscription_paused':
        await handleSubscriptionPaused(event)
        break

      case 'subscription_unpaused':
        await handleSubscriptionUnpaused(event)
        break

      case 'subscription_payment_success':
        await handlePaymentSuccess(event)
        break

      case 'subscription_payment_failed':
        await handlePaymentFailed(event)
        break

      case 'subscription_payment_recovered':
        await handlePaymentRecovered(event)
        break

      default:
        console.log(`[Billing] Unhandled event: ${eventName}`)
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error('[Billing] Webhook error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

async function handleSubscriptionCreated(event: any) {
  const subscription = event.data.attributes
  const customData = subscription.custom_data

  console.log('[Billing] Subscription created:', subscription.id)

  // TODO: Guardar suscripción en Supabase
  // await supabase.from('subscriptions').insert({
  //   id: subscription.id,
  //   tenant_id: customData.tenant_id,
  //   plan_id: customData.plan_id,
  //   status: subscription.status,
  //   customer_email: subscription.user_email,
  //   customer_name: subscription.user_name,
  //   variant_id: subscription.variant_id,
  //   renews_at: subscription.renews_at,
  //   trial_ends_at: subscription.trial_ends_at
  // })

  // Enviar email de bienvenida
  await sendWelcomeEmail(subscription.user_email, customData.plan_id)

  // Crear notificación
  await createNotification({
    tenant_id: customData.tenant_id,
    type: 'subscription_created',
    message: `Suscripción ${customData.plan_id} activada correctamente`
  })
}

async function handleSubscriptionUpdated(event: any) {
  const subscription = event.data.attributes

  console.log('[Billing] Subscription updated:', subscription.id)

  // TODO: Actualizar en Supabase
  // await supabase
  //   .from('subscriptions')
  //   .update({
  //     status: subscription.status,
  //     variant_id: subscription.variant_id,
  //     renews_at: subscription.renews_at
  //   })
  //   .eq('id', subscription.id)

  // Si cambió el plan, notificar
  const customData = subscription.custom_data
  if (customData.plan_changed) {
    await createNotification({
      tenant_id: customData.tenant_id,
      type: 'plan_changed',
      message: `Plan actualizado a ${customData.new_plan_id}`
    })
  }
}

async function handleSubscriptionCancelled(event: any) {
  const subscription = event.data.attributes
  const customData = subscription.custom_data

  console.log('[Billing] Subscription cancelled:', subscription.id)

  // TODO: Actualizar estado en Supabase
  // await supabase
  //   .from('subscriptions')
  //   .update({
  //     status: 'cancelled',
  //     ends_at: subscription.ends_at
  //   })
  //   .eq('id', subscription.id)

  // Notificar al usuario
  await createNotification({
    tenant_id: customData.tenant_id,
    type: 'subscription_cancelled',
    message: `Tu suscripción ha sido cancelada. Tendrás acceso hasta ${subscription.ends_at}`
  })

  // Enviar email de cancelación
  await sendCancellationEmail(subscription.user_email, subscription.ends_at)
}

async function handleSubscriptionResumed(event: any) {
  const subscription = event.data.attributes
  const customData = subscription.custom_data

  console.log('[Billing] Subscription resumed:', subscription.id)

  // TODO: Actualizar en Supabase
  // await supabase
  //   .from('subscriptions')
  //   .update({
  //     status: 'active',
  //     ends_at: null
  //   })
  //   .eq('id', subscription.id)

  await createNotification({
    tenant_id: customData.tenant_id,
    type: 'subscription_resumed',
    message: 'Tu suscripción ha sido reactivada'
  })
}

async function handleSubscriptionExpired(event: any) {
  const subscription = event.data.attributes
  const customData = subscription.custom_data

  console.log('[Billing] Subscription expired:', subscription.id)

  // TODO: Actualizar estado y marcar tenant como inactivo
  // await supabase
  //   .from('subscriptions')
  //   .update({ status: 'expired' })
  //   .eq('id', subscription.id)

  // await supabase
  //   .from('tenants')
  //   .update({ is_active: false })
  //   .eq('id', customData.tenant_id)

  await createNotification({
    tenant_id: customData.tenant_id,
    type: 'subscription_expired',
    message: 'Tu suscripción ha expirado. Renueva para continuar usando ElenaOS'
  })

  await sendExpirationEmail(subscription.user_email)
}

async function handleSubscriptionPaused(event: any) {
  const subscription = event.data.attributes
  const customData = subscription.custom_data

  console.log('[Billing] Subscription paused:', subscription.id)

  // TODO: Actualizar en Supabase
  // await supabase
  //   .from('subscriptions')
  //   .update({ status: 'paused' })
  //   .eq('id', subscription.id)

  await createNotification({
    tenant_id: customData.tenant_id,
    type: 'subscription_paused',
    message: 'Tu suscripción ha sido pausada'
  })
}

async function handleSubscriptionUnpaused(event: any) {
  const subscription = event.data.attributes
  const customData = subscription.custom_data

  console.log('[Billing] Subscription unpaused:', subscription.id)

  // TODO: Actualizar en Supabase
  // await supabase
  //   .from('subscriptions')
  //   .update({ status: 'active' })
  //   .eq('id', subscription.id)

  await createNotification({
    tenant_id: customData.tenant_id,
    type: 'subscription_unpaused',
    message: 'Tu suscripción ha sido reactivada'
  })
}

async function handlePaymentSuccess(event: any) {
  const subscription = event.data.attributes
  const customData = subscription.custom_data

  console.log('[Billing] Payment success:', subscription.id)

  // TODO: Registrar pago en Supabase
  // await supabase.from('payments').insert({
  //   subscription_id: subscription.id,
  //   tenant_id: customData.tenant_id,
  //   amount: subscription.amount,
  //   currency: subscription.currency,
  //   status: 'success',
  //   paid_at: new Date()
  // })
}

async function handlePaymentFailed(event: any) {
  const subscription = event.data.attributes
  const customData = subscription.custom_data

  console.log('[Billing] Payment failed:', subscription.id)

  // TODO: Registrar fallo en Supabase
  // await supabase.from('payments').insert({
  //   subscription_id: subscription.id,
  //   tenant_id: customData.tenant_id,
  //   amount: subscription.amount,
  //   status: 'failed',
  //   attempted_at: new Date()
  // })

  await createNotification({
    tenant_id: customData.tenant_id,
    type: 'payment_failed',
    message: 'El pago de tu suscripción ha fallado. Por favor actualiza tu método de pago'
  })

  await sendPaymentFailedEmail(subscription.user_email)
}

async function handlePaymentRecovered(event: any) {
  const subscription = event.data.attributes
  const customData = subscription.custom_data

  console.log('[Billing] Payment recovered:', subscription.id)

  await createNotification({
    tenant_id: customData.tenant_id,
    type: 'payment_recovered',
    message: 'Tu pago ha sido procesado exitosamente'
  })
}

// Helper functions
async function sendWelcomeEmail(email: string, planId: string) {
  // TODO: Implementar con Resend
  console.log(`[Email] Welcome email sent to ${email} for plan ${planId}`)
}

async function sendCancellationEmail(email: string, endsAt: string) {
  // TODO: Implementar con Resend
  console.log(`[Email] Cancellation email sent to ${email}, ends at ${endsAt}`)
}

async function sendExpirationEmail(email: string) {
  // TODO: Implementar con Resend
  console.log(`[Email] Expiration email sent to ${email}`)
}

async function sendPaymentFailedEmail(email: string) {
  // TODO: Implementar con Resend
  console.log(`[Email] Payment failed email sent to ${email}`)
}

async function createNotification(data: any) {
  // TODO: Implementar sistema de notificaciones
  console.log('[Notification] Created:', data)
}
