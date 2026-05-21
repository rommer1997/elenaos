/**
 * Motor de cálculo de riesgo de abandono
 *
 * Calcula el churn risk score basado en múltiples factores:
 * - Tiempo desde última visita vs. frecuencia histórica
 * - Tendencia de visitas (aumentando/disminuyendo)
 * - Lifetime value
 * - Respuestas a mensajes previos
 */

export interface ClientVisit {
  date: string
  service_id: string
  price: number
}

export interface ClientData {
  id: string
  first_name: string
  last_name: string
  phone: string
  visits: ClientVisit[]
  whatsapp_opt_out: boolean
  last_whatsapp_response_date?: string
  created_at: string
}

export interface RiskCalculation {
  clientId: string
  riskScore: number // 0-1 (0 = activa, 1 = muy alto riesgo)
  riskLevel: 'active' | 'at_risk' | 'high_risk' | 'lost'
  daysSinceLastVisit: number
  avgVisitIntervalDays: number
  predictedNextVisit: string
  visitTrend: 'improving' | 'stable' | 'declining'
  lifetimeValue: number
  visitCount: number
  factors: RiskFactor[]
}

export interface RiskFactor {
  name: string
  weight: number
  value: number
  impact: 'positive' | 'negative' | 'neutral'
}

/**
 * Calcula el riesgo de abandono de una clienta
 */
export function calculateChurnRisk(client: ClientData): RiskCalculation {
  const visits = client.visits.sort((a, b) =>
    new Date(a.date).getTime() - new Date(b.date).getTime()
  )

  const visitCount = visits.length

  // Si no tiene visitas, riesgo máximo
  if (visitCount === 0) {
    return {
      clientId: client.id,
      riskScore: 1.0,
      riskLevel: 'lost',
      daysSinceLastVisit: 999,
      avgVisitIntervalDays: 0,
      predictedNextVisit: new Date().toISOString(),
      visitTrend: 'declining',
      lifetimeValue: 0,
      visitCount: 0,
      factors: []
    }
  }

  const lastVisit = visits[visits.length - 1]
  const daysSinceLastVisit = Math.floor(
    (Date.now() - new Date(lastVisit.date).getTime()) / (1000 * 60 * 60 * 24)
  )

  // Calcular intervalo promedio entre visitas
  const avgVisitIntervalDays = calculateAverageInterval(visits)

  // Calcular lifetime value
  const lifetimeValue = visits.reduce((sum, visit) => sum + visit.price, 0)

  // Calcular tendencia de visitas
  const visitTrend = calculateVisitTrend(visits)

  // Calcular factores de riesgo
  const factors = calculateRiskFactors(
    daysSinceLastVisit,
    avgVisitIntervalDays,
    visitTrend,
    lifetimeValue,
    visitCount,
    client.last_whatsapp_response_date
  )

  // Calcular score total (suma ponderada de factores)
  const riskScore = Math.min(1.0, Math.max(0.0,
    factors.reduce((sum, factor) => sum + factor.value * factor.weight, 0)
  ))

  // Determinar nivel de riesgo
  const riskLevel = getRiskLevel(riskScore)

  // Predecir próxima visita
  const predictedNextVisit = predictNextVisitDate(lastVisit.date, avgVisitIntervalDays)

  return {
    clientId: client.id,
    riskScore,
    riskLevel,
    daysSinceLastVisit,
    avgVisitIntervalDays,
    predictedNextVisit,
    visitTrend,
    lifetimeValue,
    visitCount,
    factors
  }
}

/**
 * Calcula el intervalo promedio entre visitas (en días)
 */
function calculateAverageInterval(visits: ClientVisit[]): number {
  if (visits.length < 2) return 30 // Default: 30 días

  const intervals: number[] = []

  for (let i = 1; i < visits.length; i++) {
    const prevDate = new Date(visits[i - 1].date).getTime()
    const currDate = new Date(visits[i].date).getTime()
    const intervalDays = (currDate - prevDate) / (1000 * 60 * 60 * 24)
    intervals.push(intervalDays)
  }

  return intervals.reduce((sum, interval) => sum + interval, 0) / intervals.length
}

/**
 * Calcula la tendencia de visitas comparando últimos 3 meses vs. 3 meses anteriores
 */
function calculateVisitTrend(visits: ClientVisit[]): 'improving' | 'stable' | 'declining' {
  if (visits.length < 2) return 'stable'

  const now = Date.now()
  const threeMonthsAgo = now - (90 * 24 * 60 * 60 * 1000)
  const sixMonthsAgo = now - (180 * 24 * 60 * 60 * 1000)

  const recentVisits = visits.filter(v =>
    new Date(v.date).getTime() >= threeMonthsAgo
  ).length

  const previousVisits = visits.filter(v => {
    const time = new Date(v.date).getTime()
    return time >= sixMonthsAgo && time < threeMonthsAgo
  }).length

  if (previousVisits === 0) return 'stable'

  const ratio = recentVisits / previousVisits

  if (ratio > 1.2) return 'improving'
  if (ratio < 0.8) return 'declining'
  return 'stable'
}

/**
 * Calcula los factores individuales de riesgo
 */
function calculateRiskFactors(
  daysSinceLastVisit: number,
  avgVisitIntervalDays: number,
  visitTrend: 'improving' | 'stable' | 'declining',
  lifetimeValue: number,
  visitCount: number,
  lastWhatsAppResponse?: string
): RiskFactor[] {
  const factors: RiskFactor[] = []

  // Factor 1: Ratio de días desde última visita vs. intervalo promedio
  const visitRatio = daysSinceLastVisit / avgVisitIntervalDays
  let recencyValue = 0
  let recencyImpact: 'positive' | 'negative' | 'neutral' = 'neutral'

  if (visitRatio < 0.9) {
    recencyValue = 0 // Bien, dentro de su frecuencia
    recencyImpact = 'positive'
  } else if (visitRatio < 1.5) {
    recencyValue = 0.3 // Empezando a retrasarse
    recencyImpact = 'neutral'
  } else if (visitRatio < 2.0) {
    recencyValue = 0.6 // Retrasada
    recencyImpact = 'negative'
  } else {
    recencyValue = 1.0 // Muy retrasada
    recencyImpact = 'negative'
  }

  factors.push({
    name: 'Tiempo desde última visita',
    weight: 0.40, // 40% del score total
    value: recencyValue,
    impact: recencyImpact
  })

  // Factor 2: Tendencia de visitas
  let trendValue = 0
  let trendImpact: 'positive' | 'negative' | 'neutral' = 'neutral'

  if (visitTrend === 'improving') {
    trendValue = -0.2 // Reduce el riesgo
    trendImpact = 'positive'
  } else if (visitTrend === 'declining') {
    trendValue = 0.5
    trendImpact = 'negative'
  } else {
    trendValue = 0
    trendImpact = 'neutral'
  }

  factors.push({
    name: 'Tendencia de visitas',
    weight: 0.25, // 25% del score total
    value: trendValue,
    impact: trendImpact
  })

  // Factor 3: Engagement con WhatsApp
  let engagementValue = 0
  let engagementImpact: 'positive' | 'negative' | 'neutral' = 'neutral'

  if (lastWhatsAppResponse) {
    const daysSinceResponse = Math.floor(
      (Date.now() - new Date(lastWhatsAppResponse).getTime()) / (1000 * 60 * 60 * 24)
    )

    if (daysSinceResponse < 30) {
      engagementValue = -0.3 // Reduce riesgo
      engagementImpact = 'positive'
    } else if (daysSinceResponse < 60) {
      engagementValue = 0
      engagementImpact = 'neutral'
    } else {
      engagementValue = 0.2
      engagementImpact = 'negative'
    }
  }

  factors.push({
    name: 'Engagement WhatsApp',
    weight: 0.15, // 15% del score total
    value: engagementValue,
    impact: engagementImpact
  })

  // Factor 4: Valor histórico (clientes de alto valor tienen más seguimiento)
  let valueValue = 0
  let valueImpact: 'positive' | 'negative' | 'neutral' = 'neutral'

  if (lifetimeValue > 1000) {
    valueValue = -0.1 // Reduce riesgo ligeramente
    valueImpact = 'positive'
  } else if (lifetimeValue < 200) {
    valueValue = 0.1
    valueImpact = 'negative'
  }

  factors.push({
    name: 'Lifetime Value',
    weight: 0.10, // 10% del score total
    value: valueValue,
    impact: valueImpact
  })

  // Factor 5: Fidelidad (número de visitas)
  let loyaltyValue = 0
  let loyaltyImpact: 'positive' | 'negative' | 'neutral' = 'neutral'

  if (visitCount >= 10) {
    loyaltyValue = -0.2 // Reduce riesgo
    loyaltyImpact = 'positive'
  } else if (visitCount >= 5) {
    loyaltyValue = 0
    loyaltyImpact = 'neutral'
  } else {
    loyaltyValue = 0.2
    loyaltyImpact = 'negative'
  }

  factors.push({
    name: 'Fidelidad (visitas totales)',
    weight: 0.10, // 10% del score total
    value: loyaltyValue,
    impact: loyaltyImpact
  })

  return factors
}

/**
 * Convierte el score numérico en nivel de riesgo
 */
function getRiskLevel(riskScore: number): 'active' | 'at_risk' | 'high_risk' | 'lost' {
  if (riskScore < 0.30) return 'active'
  if (riskScore < 0.60) return 'at_risk'
  if (riskScore < 0.85) return 'high_risk'
  return 'lost'
}

/**
 * Predice la fecha de la próxima visita basándose en el patrón histórico
 */
function predictNextVisitDate(lastVisitDate: string, avgIntervalDays: number): string {
  const lastVisit = new Date(lastVisitDate)
  const predictedDate = new Date(lastVisit.getTime() + (avgIntervalDays * 24 * 60 * 60 * 1000))
  return predictedDate.toISOString()
}

/**
 * Detecta todas las clientas en riesgo que necesitan contacto
 */
export function detectAtRiskClients(
  clients: ClientData[],
  minRiskScore: number = 0.40
): RiskCalculation[] {
  return clients
    .map(client => calculateChurnRisk(client))
    .filter(calc => calc.riskScore >= minRiskScore)
    .filter(calc => !calc.clientId.includes('whatsapp_opt_out')) // Filtrar opt-outs
    .sort((a, b) => b.riskScore - a.riskScore) // Ordenar por riesgo (mayor primero)
}
