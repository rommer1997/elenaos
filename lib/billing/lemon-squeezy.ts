// Integración con Lemon Squeezy para billing SaaS

export interface LemonSqueezyConfig {
  apiKey: string
  storeId: string
  webhookSecret: string
}

export interface Plan {
  id: string
  name: string
  variantId: string
  price: number
  interval: 'month' | 'year'
  features: string[]
  limits: {
    staff: number
    clients: number
    appointments_per_month: number
    whatsapp_messages: number
    storage_gb: number
  }
}

export const PLANS: Record<string, Plan> = {
  starter: {
    id: 'starter',
    name: 'Starter',
    variantId:
      process.env.NEXT_PUBLIC_LEMON_SQUEEZY_STARTER_VARIANT_ID ||
      process.env.NEXT_PUBLIC_LEMON_VARIANT_STARTER ||
      '',
    price: 29,
    interval: 'month',
    features: [
      'Hasta 2 miembros del equipo',
      'Hasta 200 clientas',
      'Agenda ilimitada',
      '500 mensajes WhatsApp/mes',
      '5GB almacenamiento',
      'Soporte por email'
    ],
    limits: {
      staff: 2,
      clients: 200,
      appointments_per_month: -1, // ilimitado
      whatsapp_messages: 500,
      storage_gb: 5
    }
  },
  professional: {
    id: 'professional',
    name: 'Professional',
    variantId:
      process.env.NEXT_PUBLIC_LEMON_SQUEEZY_PROFESSIONAL_VARIANT_ID ||
      process.env.NEXT_PUBLIC_LEMON_VARIANT_PRO ||
      '',
    price: 49,
    interval: 'month',
    features: [
      'Hasta 5 miembros del equipo',
      'Clientas ilimitadas',
      'Agenda ilimitada',
      '2000 mensajes WhatsApp/mes',
      'Motor de retención con IA',
      'Agente de reservas autónomo',
      '20GB almacenamiento',
      'Soporte prioritario',
      'Múltiples ubicaciones'
    ],
    limits: {
      staff: 5,
      clients: -1,
      appointments_per_month: -1,
      whatsapp_messages: 2000,
      storage_gb: 20
    }
  },
  enterprise: {
    id: 'enterprise',
    name: 'Enterprise',
    variantId:
      process.env.NEXT_PUBLIC_LEMON_SQUEEZY_ENTERPRISE_VARIANT_ID ||
      process.env.NEXT_PUBLIC_LEMON_VARIANT_ENTERPRISE ||
      '',
    price: 99,
    interval: 'month',
    features: [
      'Equipo ilimitado',
      'Clientas ilimitadas',
      'Agenda ilimitada',
      '10000 mensajes WhatsApp/mes',
      'Motor de retención con IA',
      'Agente de reservas autónomo',
      'Análisis avanzado',
      'API access',
      '100GB almacenamiento',
      'Soporte 24/7',
      'Múltiples ubicaciones',
      'White label'
    ],
    limits: {
      staff: -1,
      clients: -1,
      appointments_per_month: -1,
      whatsapp_messages: 10000,
      storage_gb: 100
    }
  }
}

export class LemonSqueezy {
  private apiKey: string
  private storeId: string
  private baseUrl = 'https://api.lemonsqueezy.com/v1'

  constructor(config: LemonSqueezyConfig) {
    this.apiKey = config.apiKey
    this.storeId = config.storeId
  }

  private async request(endpoint: string, options: RequestInit = {}) {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      ...options,
      headers: {
        'Accept': 'application/vnd.api+json',
        'Content-Type': 'application/vnd.api+json',
        'Authorization': `Bearer ${this.apiKey}`,
        ...options.headers
      }
    })

    if (!response.ok) {
      throw new Error(`Lemon Squeezy API error: ${response.statusText}`)
    }

    return response.json()
  }

  // Crear checkout session
  async createCheckout(params: {
    variantId: string
    email: string
    name: string
    customData?: Record<string, unknown>
  }) {
    const { variantId, email, name, customData } = params

    const data = await this.request('/checkouts', {
      method: 'POST',
      body: JSON.stringify({
        data: {
          type: 'checkouts',
          attributes: {
            checkout_data: {
              email,
              name,
              custom: customData
            }
          },
          relationships: {
            store: {
              data: {
                type: 'stores',
                id: this.storeId
              }
            },
            variant: {
              data: {
                type: 'variants',
                id: variantId
              }
            }
          }
        }
      })
    })

    return {
      checkoutUrl: data.data.attributes.url,
      checkoutId: data.data.id
    }
  }

  // Obtener suscripción
  async getSubscription(subscriptionId: string) {
    const data = await this.request(`/subscriptions/${subscriptionId}`)

    return {
      id: data.data.id,
      status: data.data.attributes.status,
      customerEmail: data.data.attributes.user_email,
      customerName: data.data.attributes.user_name,
      variantId: data.data.relationships.variant.data.id,
      renewsAt: data.data.attributes.renews_at,
      endsAt: data.data.attributes.ends_at,
      trialEndsAt: data.data.attributes.trial_ends_at,
      customData: data.data.attributes.custom_data
    }
  }

  // Cancelar suscripción
  async cancelSubscription(subscriptionId: string) {
    return this.request(`/subscriptions/${subscriptionId}`, {
      method: 'DELETE'
    })
  }

  // Reanudar suscripción
  async resumeSubscription(subscriptionId: string) {
    return this.request(`/subscriptions/${subscriptionId}`, {
      method: 'PATCH',
      body: JSON.stringify({
        data: {
          type: 'subscriptions',
          id: subscriptionId,
          attributes: {
            cancelled: false
          }
        }
      })
    })
  }

  // Cambiar plan
  async changePlan(subscriptionId: string, newVariantId: string) {
    return this.request(`/subscriptions/${subscriptionId}`, {
      method: 'PATCH',
      body: JSON.stringify({
        data: {
          type: 'subscriptions',
          id: subscriptionId,
          relationships: {
            variant: {
              data: {
                type: 'variants',
                id: newVariantId
              }
            }
          }
        }
      })
    })
  }

  // Obtener portal del cliente
  async getCustomerPortal(customerId: string) {
    const data = await this.request(`/customers/${customerId}`)
    return data.data.attributes.urls.customer_portal
  }

  // Verificar webhook signature
  async verifyWebhook(payload: string, signature: string, secret: string): Promise<boolean> {
    if (!signature || !secret) return false

    const encoder = new TextEncoder()
    const key = await crypto.subtle.importKey(
      'raw',
      encoder.encode(secret),
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['sign']
    )
    const digest = await crypto.subtle.sign('HMAC', key, encoder.encode(payload))
    const expected = Array.from(new Uint8Array(digest))
      .map((byte) => byte.toString(16).padStart(2, '0'))
      .join('')

    return expected === signature
  }
}

// Instancia singleton
export const lemonSqueezy = new LemonSqueezy({
  apiKey: process.env.LEMON_SQUEEZY_API_KEY || '',
  storeId: process.env.LEMON_SQUEEZY_STORE_ID || '',
  webhookSecret: process.env.LEMON_SQUEEZY_WEBHOOK_SECRET || ''
})

// Helper para obtener plan actual del tenant
export async function getTenantPlan(_tenantId: string): Promise<Plan | null> {
  // TODO: Obtener de Supabase
  // const { data } = await supabase
  //   .from('subscriptions')
  //   .select('plan_id')
  //   .eq('tenant_id', tenantId)
  //   .single()

  // return PLANS[data.plan_id] || null

  // Mock: retornar plan professional por defecto
  return PLANS.professional
}

// Helper para verificar si tenant está dentro de límites
export async function checkTenantLimits(
  tenantId: string,
  resource: keyof Plan['limits']
): Promise<{ allowed: boolean; current: number; limit: number }> {
  const plan = await getTenantPlan(tenantId)

  if (!plan) {
    return { allowed: false, current: 0, limit: 0 }
  }

  const limit = plan.limits[resource]

  // -1 significa ilimitado
  if (limit === -1) {
    return { allowed: true, current: 0, limit: -1 }
  }

  // TODO: Obtener uso actual de Supabase
  // const current = await getCurrentUsage(tenantId, resource)
  const current = 0 // Mock

  return {
    allowed: current < limit,
    current,
    limit
  }
}
