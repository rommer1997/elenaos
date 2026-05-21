/**
 * Motor de Retención Automática
 *
 * Orquesta todo el sistema:
 * 1. Detecta clientas en riesgo
 * 2. Genera mensajes personalizados
 * 3. Programa envíos automáticos
 * 4. Trackea resultados
 */

import { createClient } from '@/lib/supabase/server'
import { calculateChurnRisk, detectAtRiskClients, type ClientData, type RiskCalculation } from './risk-calculator'
import { generateRetentionMessage, type ClientProfile, type GeneratedMessage } from './message-generator'
import { getWhatsAppClient } from '@/lib/whatsapp/client'

export interface RetentionCampaign {
  id: string
  tenant_id: string
  client_id: string
  risk_score: number
  risk_level: string
  scheduled_date: string
  message: string
  status: 'pending' | 'sent' | 'failed' | 'cancelled'
  sent_at?: string
  response_received?: boolean
  response_at?: string
  converted_to_appointment?: boolean
  created_at: string
}

export interface CampaignResult {
  totalDetected: number
  campaignsCreated: number
  highPriority: number
  mediumPriority: number
  errors: string[]
}

/**
 * Ejecuta el análisis completo de retención para un tenant
 */
export async function runRetentionAnalysis(tenantId: string): Promise<CampaignResult> {
  const result: CampaignResult = {
    totalDetected: 0,
    campaignsCreated: 0,
    highPriority: 0,
    mediumPriority: 0,
    errors: []
  }

  try {
    const supabase = await createClient()

    // TODO: Implementar query real con el schema del tenant
    // Por ahora usamos datos mock para la estructura

    // 1. Obtener todas las clientas con sus visitas
    // const { data: clients, error } = await supabase
    //   .schema(getSchemaName(tenantId))
    //   .from('clients')
    //   .select(`
    //     *,
    //     visits:appointments(date, service_id, price)
    //   `)
    //   .eq('whatsapp_opt_out', false)

    // Mock data para demostración
    const clients: ClientData[] = [] // Aquí irían los datos reales

    // 2. Calcular riesgo para cada clienta
    const riskCalculations = detectAtRiskClients(clients, 0.40)
    result.totalDetected = riskCalculations.length

    // 3. Clasificar por prioridad
    result.highPriority = riskCalculations.filter(r => r.riskScore >= 0.60).length
    result.mediumPriority = riskCalculations.filter(r => r.riskScore >= 0.40 && r.riskScore < 0.60).length

    // 4. Generar campañas para clientes de alta prioridad primero
    for (const riskCalc of riskCalculations) {
      try {
        const campaign = await createRetentionCampaign(tenantId, riskCalc)
        if (campaign) {
          result.campaignsCreated++
        }
      } catch (error) {
        result.errors.push(`Error creando campaña para cliente ${riskCalc.clientId}: ${error}`)
      }
    }

    return result
  } catch (error) {
    console.error('Error running retention analysis:', error)
    result.errors.push(`Error general: ${error}`)
    return result
  }
}

/**
 * Crea una campaña de retención individual para una clienta
 */
export async function createRetentionCampaign(
  tenantId: string,
  riskCalc: RiskCalculation
): Promise<RetentionCampaign | null> {
  try {
    const supabase = await createClient()

    // TODO: Obtener perfil completo de la clienta
    // const { data: client } = await supabase
    //   .schema(getSchemaName(tenantId))
    //   .from('clients')
    //   .select('*')
    //   .eq('id', riskCalc.clientId)
    //   .single()

    // Mock profile
    const clientProfile: ClientProfile = {
      id: riskCalc.clientId,
      firstName: 'Cliente',
      lastName: 'Mock',
      phone: '+34666000000',
      riskCalculation: riskCalc
    }

    // Generar mensaje personalizado con Claude
    const generatedMessage = await generateRetentionMessage(clientProfile)

    // Calcular fecha de envío óptima
    const scheduledDate = calculateOptimalSendTime(riskCalc)

    // Guardar campaña en la base de datos
    // const { data: campaign, error } = await supabase
    //   .schema(getSchemaName(tenantId))
    //   .from('retention_campaigns')
    //   .insert({
    //     tenant_id: tenantId,
    //     client_id: riskCalc.clientId,
    //     risk_score: riskCalc.riskScore,
    //     risk_level: riskCalc.riskLevel,
    //     scheduled_date: scheduledDate,
    //     message: generatedMessage.message,
    //     status: 'pending'
    //   })
    //   .select()
    //   .single()

    // Mock campaign
    const campaign: RetentionCampaign = {
      id: `campaign-${Date.now()}`,
      tenant_id: tenantId,
      client_id: riskCalc.clientId,
      risk_score: riskCalc.riskScore,
      risk_level: riskCalc.riskLevel,
      scheduled_date: scheduledDate,
      message: generatedMessage.message,
      status: 'pending',
      created_at: new Date().toISOString()
    }

    return campaign
  } catch (error) {
    console.error('Error creating retention campaign:', error)
    return null
  }
}

/**
 * Calcula el momento óptimo para enviar el mensaje
 */
function calculateOptimalSendTime(riskCalc: RiskCalculation): string {
  const now = new Date()

  // Reglas para timing óptimo:
  // - Riesgo alto (>0.7): enviar inmediatamente (hoy a las 11:00 o 17:00)
  // - Riesgo medio (0.4-0.7): enviar mañana a las 11:00
  // - Evitar envíos en domingo o después de las 20:00

  let scheduledDate: Date

  if (riskCalc.riskScore >= 0.70) {
    // Alto riesgo: enviar hoy
    scheduledDate = new Date(now)

    // Si ya pasaron las 17:00, programar para mañana a las 11:00
    if (now.getHours() >= 17) {
      scheduledDate.setDate(now.getDate() + 1)
      scheduledDate.setHours(11, 0, 0, 0)
    } else if (now.getHours() < 11) {
      // Si es antes de las 11:00, programar para las 11:00
      scheduledDate.setHours(11, 0, 0, 0)
    } else {
      // Entre 11:00 y 17:00, programar para las 17:00
      scheduledDate.setHours(17, 0, 0, 0)
    }
  } else {
    // Riesgo medio: enviar mañana a las 11:00
    scheduledDate = new Date(now)
    scheduledDate.setDate(now.getDate() + 1)
    scheduledDate.setHours(11, 0, 0, 0)
  }

  // Evitar domingos
  if (scheduledDate.getDay() === 0) {
    scheduledDate.setDate(scheduledDate.getDate() + 1)
  }

  return scheduledDate.toISOString()
}

/**
 * Procesa campañas pendientes y envía mensajes
 */
export async function processPendingCampaigns(tenantId: string): Promise<{
  processed: number
  sent: number
  failed: number
}> {
  const result = {
    processed: 0,
    sent: 0,
    failed: 0
  }

  try {
    const supabase = await createClient()

    // TODO: Obtener campañas pendientes cuya fecha de envío ya pasó
    // const { data: campaigns, error } = await supabase
    //   .schema(getSchemaName(tenantId))
    //   .from('retention_campaigns')
    //   .select('*')
    //   .eq('status', 'pending')
    //   .lte('scheduled_date', new Date().toISOString())
    //   .limit(50) // Procesar máximo 50 por ejecución

    const campaigns: RetentionCampaign[] = [] // Mock

    for (const campaign of campaigns) {
      result.processed++

      try {
        // Obtener teléfono de la clienta
        // const { data: client } = await supabase
        //   .schema(getSchemaName(tenantId))
        //   .from('clients')
        //   .select('phone, first_name')
        //   .eq('id', campaign.client_id)
        //   .single()

        // Enviar mensaje por WhatsApp
        const whatsapp = getWhatsAppClient()
        const sendResult = await whatsapp.sendTextMessage(
          '+34666000000', // Mock phone
          campaign.message
        )

        if (sendResult.success) {
          // Actualizar campaña como enviada
          // await supabase
          //   .schema(getSchemaName(tenantId))
          //   .from('retention_campaigns')
          //   .update({
          //     status: 'sent',
          //     sent_at: new Date().toISOString()
          //   })
          //   .eq('id', campaign.id)

          result.sent++
        } else {
          throw new Error(sendResult.error)
        }
      } catch (error) {
        console.error(`Error processing campaign ${campaign.id}:`, error)

        // Marcar como fallida
        // await supabase
        //   .schema(getSchemaName(tenantId))
        //   .from('retention_campaigns')
        //   .update({ status: 'failed' })
        //   .eq('id', campaign.id)

        result.failed++
      }
    }

    return result
  } catch (error) {
    console.error('Error processing pending campaigns:', error)
    return result
  }
}

/**
 * Actualiza el estado de una campaña cuando la clienta responde
 */
export async function markCampaignAsResponded(
  tenantId: string,
  clientPhone: string
): Promise<void> {
  try {
    const supabase = await createClient()

    // TODO: Buscar cliente por teléfono y actualizar última campaña
    // const { data: client } = await supabase
    //   .schema(getSchemaName(tenantId))
    //   .from('clients')
    //   .select('id')
    //   .eq('phone', clientPhone)
    //   .single()

    // if (client) {
    //   await supabase
    //     .schema(getSchemaName(tenantId))
    //     .from('retention_campaigns')
    //     .update({
    //       response_received: true,
    //       response_at: new Date().toISOString()
    //     })
    //     .eq('client_id', client.id)
    //     .eq('status', 'sent')
    //     .order('sent_at', { ascending: false })
    //     .limit(1)
    // }
  } catch (error) {
    console.error('Error marking campaign as responded:', error)
  }
}

/**
 * Marca una campaña como convertida a cita
 */
export async function markCampaignAsConverted(
  tenantId: string,
  clientId: string
): Promise<void> {
  try {
    const supabase = await createClient()

    // TODO: Actualizar última campaña del cliente como convertida
    // await supabase
    //   .schema(getSchemaName(tenantId))
    //   .from('retention_campaigns')
    //   .update({ converted_to_appointment: true })
    //   .eq('client_id', clientId)
    //   .eq('status', 'sent')
    //   .order('sent_at', { ascending: false })
    //   .limit(1)
  } catch (error) {
    console.error('Error marking campaign as converted:', error)
  }
}

/**
 * Obtiene métricas de las campañas de retención
 */
export async function getRetentionMetrics(tenantId: string, days: number = 30): Promise<{
  totalCampaigns: number
  sentCampaigns: number
  responseRate: number
  conversionRate: number
  averageRiskScore: number
}> {
  try {
    const supabase = await createClient()

    const startDate = new Date()
    startDate.setDate(startDate.getDate() - days)

    // TODO: Queries reales
    // const { data: campaigns } = await supabase
    //   .schema(getSchemaName(tenantId))
    //   .from('retention_campaigns')
    //   .select('*')
    //   .gte('created_at', startDate.toISOString())

    return {
      totalCampaigns: 0,
      sentCampaigns: 0,
      responseRate: 0,
      conversionRate: 0,
      averageRiskScore: 0
    }
  } catch (error) {
    console.error('Error getting retention metrics:', error)
    return {
      totalCampaigns: 0,
      sentCampaigns: 0,
      responseRate: 0,
      conversionRate: 0,
      averageRiskScore: 0
    }
  }
}

/**
 * Helper para obtener el nombre del schema del tenant
 */
function getSchemaName(tenantId: string): string {
  return `tenant_${tenantId}`
}
