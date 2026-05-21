'use client'

import { Star, Quote } from 'lucide-react'

export function Testimonials() {
  const testimonials = [
    {
      name: 'Elena García',
      role: 'Propietaria de Elena Beauty Salon',
      location: 'Madrid',
      image: '👩‍💼',
      rating: 5,
      text: 'Desde que uso ElenaOS he recuperado más de 40 clientas que creía perdidas para siempre. Los mensajes automáticos son tan naturales que muchas piensan que los escribo yo misma. En 3 meses recuperé €4,200 en revenue.'
    },
    {
      name: 'María López',
      role: 'Directora de María Studio',
      location: 'Barcelona',
      image: '👩‍🦰',
      rating: 5,
      text: 'Lo mejor es que todo funciona solo. La IA detecta las clientas en riesgo y les envía mensajes personalizados por WhatsApp. Yo solo me entero cuando empiezan a responder y agendar de nuevo. Es magia.'
    },
    {
      name: 'Carmen Rodríguez',
      role: 'Gerente de Belleza Total',
      location: 'Valencia',
      image: '👩‍💻',
      rating: 5,
      text: 'Antes usaba 4 aplicaciones diferentes: una para agenda, otra para clientas, otra para facturas... ElenaOS lo tiene todo integrado y funciona perfectamente. Ahorro 2 horas diarias en gestión.'
    }
  ]

  return (
    <section id="testimonios" className="py-20 bg-gradient-to-b from-purple-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-100 rounded-full text-purple-700 font-medium text-sm mb-4">
            <Star className="h-4 w-4 fill-purple-700" />
            <span>Testimonios Reales</span>
          </div>
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4" style={{ fontFamily: 'var(--font-cormorant)' }}>
            Salones que ya están{' '}
            <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              recuperando clientas
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Más de 500 salones confían en ElenaOS para no perder ni una sola clienta
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="relative bg-white rounded-3xl p-8 border-2 border-purple-100 hover:border-purple-300 transition-all hover:shadow-2xl group"
            >
              {/* Quote icon */}
              <div className="absolute -top-4 -left-4 w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-lg">
                <Quote className="h-6 w-6 text-white" />
              </div>

              {/* Rating */}
              <div className="flex gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 text-yellow-400 fill-yellow-400" />
                ))}
              </div>

              {/* Text */}
              <p className="text-gray-700 leading-relaxed mb-6 italic">
                &quot;{testimonial.text}&quot;
              </p>

              {/* Author */}
              <div className="flex items-center gap-4 pt-6 border-t border-gray-200">
                <div className="text-5xl">{testimonial.image}</div>
                <div>
                  <div className="font-bold text-gray-900">{testimonial.name}</div>
                  <div className="text-sm text-gray-600">{testimonial.role}</div>
                  <div className="text-xs text-purple-600 font-medium">{testimonial.location}</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Stats */}
        <div className="mt-16 grid md:grid-cols-4 gap-8">
          <div className="text-center">
            <div className="text-5xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
              500+
            </div>
            <div className="text-gray-600 font-medium">Salones activos</div>
          </div>
          <div className="text-center">
            <div className="text-5xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
              62%
            </div>
            <div className="text-gray-600 font-medium">Tasa de respuesta</div>
          </div>
          <div className="text-center">
            <div className="text-5xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
              €890K
            </div>
            <div className="text-gray-600 font-medium">Revenue recuperado</div>
          </div>
          <div className="text-center">
            <div className="text-5xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
              4.9/5
            </div>
            <div className="text-gray-600 font-medium">Valoración media</div>
          </div>
        </div>
      </div>
    </section>
  )
}
