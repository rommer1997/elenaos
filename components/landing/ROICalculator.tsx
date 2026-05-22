'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Calculator, TrendingUp, AlertCircle } from 'lucide-react'

export function ROICalculator() {
  const [clients, setClients] = useState(100)
  const [ticketMedio, setTicketMedio] = useState(45)

  // Cálculos
  const churnRate = 0.25 // 25% de pérdida anual (estándar industria belleza)
  const clientsLostPerMonth = Math.round((clients * churnRate) / 12)
  const monthlyLoss = clientsLostPerMonth * ticketMedio * 3 // 3 visitas promedio al año
  const yearlyLoss = monthlyLoss * 12

  // Con ElenaOS (recupera 60% de clientas en riesgo)
  const recoveryRate = 0.6
  const clientsRecovered = Math.round(clientsLostPerMonth * recoveryRate)
  const monthlySavings = clientsRecovered * ticketMedio * 3
  const yearlySavings = monthlySavings * 12

  return (
    <section id="calculadora" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-100 rounded-full text-purple-700 font-medium text-sm mb-4">
            <Calculator className="h-4 w-4" />
            <span>Calculadora ROI</span>
          </div>
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4" style={{ fontFamily: 'var(--font-cormorant)' }}>
            ¿Cuánto dinero estás{' '}
            <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              perdiendo cada mes?
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Descubre cuánto revenue puedes recuperar con ElenaOS en tu salón
          </p>
        </div>

        {/* Calculator */}
        <div className="max-w-5xl mx-auto">
          <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-3xl p-8 lg:p-12 border-2 border-purple-200">
            <div className="grid lg:grid-cols-2 gap-12">
              {/* Left - Inputs */}
              <div className="space-y-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">
                  Datos de tu salón
                </h3>

                {/* Slider 1 */}
                <div>
                  <label className="flex items-center justify-between mb-3">
                    <span className="text-gray-700 font-semibold">Número de clientas activas</span>
                    <span className="text-3xl font-bold text-purple-600">{clients}</span>
                  </label>
                  <input
                    type="range"
                    min="20"
                    max="500"
                    step="10"
                    value={clients}
                    onChange={(e) => setClients(Number(e.target.value))}
                    className="w-full h-3 bg-white rounded-full appearance-none cursor-pointer slider-purple"
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-2">
                    <span>20</span>
                    <span>500</span>
                  </div>
                </div>

                {/* Slider 2 */}
                <div>
                  <label className="flex items-center justify-between mb-3">
                    <span className="text-gray-700 font-semibold">Ticket medio por visita</span>
                    <span className="text-3xl font-bold text-purple-600">€{ticketMedio}</span>
                  </label>
                  <input
                    type="range"
                    min="20"
                    max="150"
                    step="5"
                    value={ticketMedio}
                    onChange={(e) => setTicketMedio(Number(e.target.value))}
                    className="w-full h-3 bg-white rounded-full appearance-none cursor-pointer slider-purple"
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-2">
                    <span>€20</span>
                    <span>€150</span>
                  </div>
                </div>

                {/* Info box */}
                <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded-lg">
                  <div className="flex gap-3">
                    <AlertCircle className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                    <div className="text-sm text-blue-800">
                      <strong>¿Sabías qué?</strong> El 25% de las clientas de salones de belleza no vuelven cada año. ElenaOS puede recuperar hasta el 60% de ellas.
                    </div>
                  </div>
                </div>
              </div>

              {/* Right - Results */}
              <div className="space-y-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">
                  Tu pérdida actual
                </h3>

                {/* Loss stats */}
                <div className="bg-white rounded-2xl p-6 border-2 border-red-200">
                  <div className="flex items-start justify-between mb-2">
                    <div className="text-sm font-medium text-gray-600">Sin ElenaOS pierdes:</div>
                    <div className="px-2 py-1 bg-red-100 text-red-700 rounded-full text-xs font-bold">
                      PÉRDIDA
                    </div>
                  </div>
                  <div className="text-4xl font-bold text-red-600 mb-1">
                    €{monthlyLoss.toLocaleString()}/mes
                  </div>
                  <div className="text-sm text-gray-600">
                    {clientsLostPerMonth} clientas perdidas × €{ticketMedio} × 3 visitas/año
                  </div>
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <div className="text-xs text-gray-500">Pérdida anual</div>
                    <div className="text-2xl font-bold text-gray-900">
                      €{yearlyLoss.toLocaleString()}
                    </div>
                  </div>
                </div>

                {/* Savings stats */}
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6 border-2 border-green-300">
                  <div className="flex items-start justify-between mb-2">
                    <div className="text-sm font-medium text-gray-700">Con ElenaOS recuperas:</div>
                    <div className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold flex items-center gap-1">
                      <TrendingUp className="h-3 w-3" />
                      +60%
                    </div>
                  </div>
                  <div className="text-4xl font-bold text-green-600 mb-1">
                    €{monthlySavings.toLocaleString()}/mes
                  </div>
                  <div className="text-sm text-gray-700">
                    {clientsRecovered} clientas recuperadas automáticamente
                  </div>
                  <div className="mt-4 pt-4 border-t border-green-200">
                    <div className="text-xs text-gray-600">Revenue recuperado anual</div>
                    <div className="text-2xl font-bold text-gray-900">
                      €{yearlySavings.toLocaleString()}
                    </div>
                  </div>
                </div>

                {/* ROI */}
                <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl p-6 text-white">
                  <div className="text-sm font-medium mb-2">Retorno de inversión (ROI)</div>
                  <div className="text-5xl font-bold mb-2">
                    {Math.round((monthlySavings / 49) * 100)}%
                  </div>
                  <div className="text-sm opacity-90">
                    Con una inversión de solo €49/mes, recuperas {Math.round(monthlySavings / 49)}× más
                  </div>
                </div>
              </div>
            </div>

            {/* CTA */}
            <div className="mt-8 pt-8 border-t-2 border-purple-200 text-center">
              <Link
                href="/registro"
                className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full font-bold text-lg hover:shadow-2xl hover:scale-105 transition-all"
              >
                Empieza a recuperar clientas hoy
                <TrendingUp className="h-5 w-5" />
              </Link>
              <p className="text-sm text-gray-600 mt-4">
                Sin tarjeta de crédito • Prueba gratis 14 días • Cancela cuando quieras
              </p>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .slider-purple::-webkit-slider-thumb {
          appearance: none;
          width: 24px;
          height: 24px;
          background: linear-gradient(135deg, #9333ea 0%, #ec4899 100%);
          border-radius: 50%;
          cursor: pointer;
          box-shadow: 0 2px 8px rgba(147, 51, 234, 0.4);
        }
        .slider-purple::-moz-range-thumb {
          width: 24px;
          height: 24px;
          background: linear-gradient(135deg, #9333ea 0%, #ec4899 100%);
          border-radius: 50%;
          cursor: pointer;
          border: none;
          box-shadow: 0 2px 8px rgba(147, 51, 234, 0.4);
        }
      `}</style>
    </section>
  )
}
