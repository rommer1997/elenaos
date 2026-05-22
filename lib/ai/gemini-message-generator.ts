/**
 * Generador de mensajes personalizados con Google Gemini (FREE)
 *
 * Usa Gemini 2.0 Flash para generar mensajes de retención altamente personalizados
 * basándose en el perfil completo de la clienta
 *
 * Ventajas de Gemini:
 * - Tier gratuito MUY generoso (1,500 requests/día)
 * - Modelo flash muy rápido
 * - Compatible con la misma arquitectura
 */

import { GoogleGenerativeAI } from '@google/generative-ai'
import type { RiskCalculation } from './risk-calculator'

export interface ClientProfile {
  id: string
  firstName: string
  lastName: string
  phone: string
  riskCalculation: RiskCalculation
  visitCount?: number
  preferredServices?: string[]
  preferredStaff?: string
  notes?: string
  aiNotes?: string
  tags?: string[]
  lastVisitDate?: string
  lastVisitService?: string
}

export interface GeneratedMessage {
  message: string
  tone: 'friendly' | 'professional' | 'casual'
  callToAction: string
  estimatedEngagementScore: number // 0-1
  reasoning: string
}

/**
 * Genera un mensaje personalizado de retención usando Gemini
 */
export async function generateRetentionMessage(
  clientProfile: ClientProfile
): Promise<GeneratedMessage> {
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '')

  // Usar gemini-2.0-flash-exp (el más rápido y gratuito)
  const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' })

  const prompt = buildPromptForClient(clientProfile)

  try {
    const result = await model.generateContent(prompt)
    const responseText = result.response.text()

    return parseGeminiResponse(responseText)
  } catch (error) {
    console.error('Error generating message with Gemini:', error)

    // Fallback a mensaje genérico
    return generateFallbackMessage(clientProfile)
  }
}

/**
 * Construye el prompt para Gemini con toda la información de la clienta
 */
function buildPromptForClient(profile: ClientProfile): string {
  const { firstName, lastName, riskCalculation } = profile
  const { riskScore, daysSinceLastVisit, avgVisitIntervalDays, visitTrend, lifetimeValue, visitCount } = riskCalculation

  let contextualInfo = ''

  // Información de servicios preferidos
  if (profile.preferredServices && profile.preferredServices.length > 0) {
    contextualInfo += `\n- Sus servicios favoritos son: ${profile.preferredServices.join(', ')}`
  }

  // Información de staff preferido
  if (profile.preferredStaff) {
    contextualInfo += `\n- Prefiere atenderse con: ${profile.preferredStaff}`
  }

  // Última visita
  if (profile.lastVisitDate && profile.lastVisitService) {
    const lastVisitFormatted = new Date(profile.lastVisitDate).toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'long'
    })
    contextualInfo += `\n- Su última visita fue el ${lastVisitFormatted} para ${profile.lastVisitService}`
  }

  // Notas adicionales
  if (profile.notes) {
    contextualInfo += `\n- Notas adicionales: ${profile.notes}`
  }

  // Insights de IA previos
  if (profile.aiNotes) {
    contextualInfo += `\n- Perfil IA: ${profile.aiNotes}`
  }

  // Tags
  if (profile.tags && profile.tags.length > 0) {
    contextualInfo += `\n- Tags: ${profile.tags.join(', ')}`
  }

  const prompt = `Eres una asistente de marketing para un salón de belleza de alta gama llamado "Elena Beauty Salon".

Tu misión es generar un mensaje de WhatsApp personalizado para recuperar a una clienta que está en riesgo de abandono.

INFORMACIÓN DE LA CLIENTA:
- Nombre: ${firstName} ${lastName}
- Días desde última visita: ${daysSinceLastVisit}
- Frecuencia habitual: cada ${Math.round(avgVisitIntervalDays)} días
- Total de visitas: ${visitCount}
- Valor total gastado: ${lifetimeValue.toFixed(2)}€
- Tendencia: ${visitTrend === 'improving' ? 'mejorando' : visitTrend === 'declining' ? 'declinando' : 'estable'}
- Nivel de riesgo: ${riskScore < 0.4 ? 'bajo' : riskScore < 0.6 ? 'medio' : 'alto'}${contextualInfo}

INSTRUCCIONES:
1. Escribe un mensaje cálido, personal y NO intrusivo
2. Usa un tono ${visitCount > 10 ? 'cercano y familiar' : 'profesional pero amable'}
3. Menciona específicamente algo relevante de su historial (su servicio favorito, última visita, etc.)
4. NO uses emojis en exceso (máximo 2-3)
5. Incluye una llamada a la acción clara pero suave (no agresiva)
6. El mensaje debe tener entre 40-80 palabras
7. NO menciones descuentos a menos que sea una clienta VIP
8. Mantén un tono español de España (tuteo o usted según el perfil)

ESTRUCTURA REQUERIDA:
1. Saludo personalizado
2. Razón del mensaje (te echamos de menos, hace tiempo que no vienes, etc.)
3. Mención de algo específico (su servicio favorito, última visita, etc.)
4. Llamada a la acción (sutil)
5. Despedida cálida

FORMATO DE RESPUESTA:
Devuelve SOLO el mensaje, sin añadir explicaciones ni metadatos adicionales.`

  return prompt
}

/**
 * Parsea la respuesta de Gemini y extrae el mensaje
 */
function parseGeminiResponse(responseText: string): GeneratedMessage {
  // Gemini devuelve el mensaje directamente según nuestras instrucciones
  const message = responseText.trim()

  // Inferir tono basándose en el contenido
  let tone: 'friendly' | 'professional' | 'casual' = 'friendly'
  if (message.toLowerCase().includes('estimad') || message.includes('usted')) {
    tone = 'professional'
  } else if (message.includes('😊') || message.includes('tía') || message.includes('encanto')) {
    tone = 'casual'
  }

  // Extraer call to action (última oración usualmente)
  const sentences = message.split(/[.!?]+/).filter(s => s.trim())
  const callToAction = sentences[sentences.length - 1]?.trim() || 'Responde cuando puedas'

  // Score de engagement estimado basado en características del mensaje
  const estimatedEngagementScore = estimateEngagement(message)

  return {
    message,
    tone,
    callToAction,
    estimatedEngagementScore,
    reasoning: 'Generado por Google Gemini basado en perfil completo de la clienta'
  }
}

/**
 * Estima el engagement potencial del mensaje basándose en características
 */
function estimateEngagement(message: string): number {
  let score = 0.5 // Base score

  // Factores positivos
  if (message.length >= 40 && message.length <= 100) score += 0.1 // Longitud óptima
  if (message.includes('?')) score += 0.1 // Incluye pregunta
  if (message.match(/[😊👋💅✨]/)) score += 0.05 // Emojis apropiados
  if (message.toLowerCase().includes('te echamos de menos') ||
      message.toLowerCase().includes('te extrañamos')) score += 0.15 // Emotivo

  // Factores negativos
  if (message.length > 150) score -= 0.1 // Muy largo
  if ((message.match(/[!]/g) || []).length > 2) score -= 0.1 // Demasiados signos de exclamación
  if (message.toLowerCase().includes('descuento') ||
      message.toLowerCase().includes('oferta')) score -= 0.05 // Muy comercial

  return Math.min(1.0, Math.max(0.0, score))
}

/**
 * Genera un mensaje de fallback si Gemini no está disponible
 */
function generateFallbackMessage(profile: ClientProfile): GeneratedMessage {
  const { firstName, riskCalculation } = profile
  const { daysSinceLastVisit, visitCount } = riskCalculation

  let message = ''

  if (visitCount > 10) {
    // Cliente fiel
    message = `Hola ${firstName}! 👋 Te echamos de menos por aquí. Hace ${daysSinceLastVisit} días que no vienes y nos encantaría verte de nuevo.\n\n¿Te vendría bien esta semana? Tenemos horarios disponibles que te pueden interesar. Responde cuando puedas! 💅`
  } else if (visitCount >= 5) {
    // Cliente regular
    message = `Hola ${firstName}! Hace tiempo que no sabemos de ti. ¿Cómo estás?\n\nSi te apetece reservar una cita, tenemos disponibilidad estos días. Responde y te cuento los horarios. ¡Esperamos verte pronto! 😊`
  } else {
    // Cliente nueva
    message = `Hola ${firstName}! ¿Qué tal todo?\n\nVimos que hace tiempo que no vienes y nos gustaría saber si podemos ayudarte con algo. Si quieres reservar una cita, estamos aquí para ti. ¡Un saludo!`
  }

  return {
    message,
    tone: 'friendly',
    callToAction: 'Responde cuando puedas',
    estimatedEngagementScore: 0.6,
    reasoning: 'Mensaje de fallback generado automáticamente'
  }
}

/**
 * Genera múltiples variantes de mensaje y devuelve la mejor
 */
export async function generateBestMessage(
  clientProfile: ClientProfile,
  variants: number = 3
): Promise<GeneratedMessage> {
  const messages = await Promise.all(
    Array(variants).fill(null).map(() => generateRetentionMessage(clientProfile))
  )

  // Ordenar por engagement score y devolver la mejor
  messages.sort((a, b) => b.estimatedEngagementScore - a.estimatedEngagementScore)

  return messages[0]
}

/**
 * Genera insights sobre la clienta (para la sección de AI Insights)
 */
export async function generateClientInsights(
  clientProfile: ClientProfile
): Promise<string> {
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '')
  const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' })

  const prompt = buildInsightsPrompt(clientProfile)

  try {
    const result = await model.generateContent(prompt)
    return result.response.text()
  } catch (error) {
    console.error('Error generating insights:', error)
    return generateFallbackInsights(clientProfile)
  }
}

/**
 * Construye el prompt para generar insights
 */
function buildInsightsPrompt(profile: ClientProfile): string {
  const { riskCalculation, preferredServices, notes } = profile
  const visitCount = profile.visitCount ?? riskCalculation.visitCount

  return `Analiza el perfil de esta clienta de salón de belleza y genera insights accionables:

DATOS:
- Visitas totales: ${visitCount}
- Días desde última visita: ${riskCalculation.daysSinceLastVisit}
- Frecuencia habitual: ${Math.round(riskCalculation.avgVisitIntervalDays)} días
- Tendencia: ${riskCalculation.visitTrend}
- Valor total: ${riskCalculation.lifetimeValue.toFixed(2)}€
- Servicios preferidos: ${preferredServices?.join(', ') || 'No especificados'}
- Notas: ${notes || 'Ninguna'}

Genera un análisis breve (3-4 oraciones) que incluya:
1. Perfil de fidelidad
2. Recomendación de contacto (cuándo y cómo)
3. Oportunidades de upselling

Responde en español de España, tono profesional pero cercano.`
}

/**
 * Genera insights de fallback
 */
function generateFallbackInsights(profile: ClientProfile): string {
  const { riskCalculation } = profile
  const visitCount = profile.visitCount ?? riskCalculation.visitCount

  if (visitCount >= 10 && riskCalculation.riskScore < 0.4) {
    return 'Cliente muy fiel y satisfecha. Viene regularmente y mantiene un patrón estable. Es una candidata ideal para recomendaciones de servicios premium. Responde bien a comunicaciones personalizadas.'
  }

  if (riskCalculation.riskScore >= 0.6) {
    return `Cliente en riesgo de abandono. Lleva ${riskCalculation.daysSinceLastVisit} días sin visitar (su frecuencia habitual es de ${Math.round(riskCalculation.avgVisitIntervalDays)} días). Recomendación: contacto inmediato con mensaje personalizado ofreciendo disponibilidad.`
  }

  return 'Cliente con comportamiento estable. Mantener comunicación regular mediante recordatorios automáticos y ofertas personalizadas basadas en su historial.'
}
