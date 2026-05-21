'use client'

import { useState } from 'react'
import { ChevronDown, HelpCircle } from 'lucide-react'

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  const faqs = [
    {
      question: '¿Cómo funciona la prueba gratis de 14 días?',
      answer: 'Puedes probar ElenaOS completamente gratis durante 14 días sin necesidad de introducir tu tarjeta de crédito. Tendrás acceso a todas las funcionalidades del plan Professional. Si decides continuar, simplemente añade tu método de pago. Si no, tu cuenta se desactivará automáticamente sin cargos.'
    },
    {
      question: '¿ElenaOS realmente recupera clientas automáticamente?',
      answer: 'Sí. Nuestro motor de IA analiza el comportamiento de cada clienta y detecta cuándo está en riesgo de no volver. Luego genera y envía automáticamente un mensaje personalizado por WhatsApp en el momento perfecto. El 60% de las clientas contactadas vuelven a agendar sin que tengas que hacer nada.'
    },
    {
      question: '¿Necesito conocimientos técnicos para usar ElenaOS?',
      answer: 'No, para nada. ElenaOS está diseñado para ser extremadamente fácil de usar. El proceso de configuración inicial te guía paso a paso (solo 3 pasos) y en menos de 10 minutos ya puedes empezar a gestionar tu salón. Si necesitas ayuda, nuestro equipo de soporte está disponible.'
    },
    {
      question: '¿Puedo importar mi base de datos de clientas?',
      answer: 'Sí, puedes importar tus clientas desde Excel, CSV o desde otras plataformas como Google Calendar, Planity, etc. Nuestro equipo te ayuda en el proceso de migración para que no pierdas ningún dato importante.'
    },
    {
      question: '¿Qué pasa con el cumplimiento legal (VeriFactu)?',
      answer: 'ElenaOS incluye facturación con cumplimiento total de la Ley Antifraude 2024 y VeriFactu. Todas las facturas generan automáticamente el código QR, el hash de encadenamiento y se envían a la AEAT. No tienes que preocuparte por multas o sanciones.'
    },
    {
      question: '¿Puedo cancelar mi suscripción en cualquier momento?',
      answer: 'Sí, puedes cancelar tu suscripción cuando quieras desde tu panel de configuración. No hay permanencia ni penalizaciones. Si cancelas, mantendrás acceso hasta el final de tu período de facturación actual.'
    },
    {
      question: '¿Los mensajes de WhatsApp tienen un coste adicional?',
      answer: 'No. Los mensajes de retención generados por la IA están incluidos en tu plan (hasta los límites especificados). Solo pagas tu suscripción mensual de ElenaOS. No hay sorpresas ni costes ocultos.'
    },
    {
      question: '¿ElenaOS funciona en móvil?',
      answer: 'Sí, ElenaOS es una PWA (Progressive Web App) que funciona perfectamente en móvil, tablet y ordenador. Puedes añadirla a tu pantalla de inicio y usarla como una app nativa. Todos tus datos se sincronizan en tiempo real entre dispositivos.'
    },
    {
      question: '¿Mis datos están seguros?',
      answer: 'Absolutamente. Usamos encriptación de grado bancario, todos los datos se almacenan en servidores certificados en la UE (GDPR compliant), y hacemos backups automáticos diarios. Nunca compartimos ni vendemos tu información.'
    },
    {
      question: '¿Ofrecen formación o soporte para empezar?',
      answer: 'Sí. Todos los planes incluyen acceso a nuestra academia con videotutoriales. El plan Professional incluye soporte prioritario por email, y el plan Enterprise incluye onboarding personalizado con un account manager dedicado que te ayudará a configurar todo.'
    }
  ]

  return (
    <section id="faq" className="py-20 bg-gradient-to-b from-white to-purple-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-100 rounded-full text-purple-700 font-medium text-sm mb-4">
            <HelpCircle className="h-4 w-4" />
            <span>Preguntas Frecuentes</span>
          </div>
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4" style={{ fontFamily: 'var(--font-cormorant)' }}>
            ¿Tienes dudas?{' '}
            <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Te las resolvemos
            </span>
          </h2>
          <p className="text-xl text-gray-600">
            Las respuestas a las preguntas más comunes sobre ElenaOS
          </p>
        </div>

        {/* FAQ Accordion */}
        <div className="space-y-4">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index

            return (
              <div
                key={index}
                className="bg-white rounded-2xl border-2 border-purple-100 overflow-hidden transition-all hover:border-purple-300"
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                  className="w-full flex items-center justify-between p-6 text-left hover:bg-purple-50 transition-colors"
                >
                  <span className="font-bold text-gray-900 pr-8">
                    {faq.question}
                  </span>
                  <ChevronDown
                    className={`h-6 w-6 text-purple-600 flex-shrink-0 transition-transform ${
                      isOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>

                {isOpen && (
                  <div className="px-6 pb-6">
                    <div className="pt-4 border-t border-purple-100">
                      <p className="text-gray-700 leading-relaxed">
                        {faq.answer}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>

        {/* Contact */}
        <div className="mt-12 text-center bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-8 border-2 border-purple-200">
          <p className="text-gray-700 mb-4">
            ¿No encuentras la respuesta que buscas?
          </p>
          <a
            href="mailto:soporte@elenaos.app"
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full font-semibold hover:shadow-xl hover:scale-105 transition-all"
          >
            Contacta con nuestro equipo
          </a>
        </div>
      </div>
    </section>
  )
}
