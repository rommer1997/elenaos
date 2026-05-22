'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { CheckCircle2, Sparkles, ArrowRight } from 'lucide-react'

interface CelebrationProps {
  salonName: string
}

export function Celebration({ salonName }: CelebrationProps) {
  const [showConfetti, setShowConfetti] = useState(true)

  useEffect(() => {
    // Hide confetti after 5 seconds
    const timer = setTimeout(() => {
      setShowConfetti(false)
    }, 5000)

    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="relative w-full max-w-3xl">
      {/* Confetti effect */}
      {showConfetti && (
        <div className="fixed inset-0 pointer-events-none z-50">
          {[...Array(50)].map((_, i) => (
            <div
              key={i}
              className="absolute animate-confetti"
              style={{
                left: `${Math.random() * 100}%`,
                top: '-10%',
                animationDelay: `${Math.random() * 2}s`,
                animationDuration: `${2 + Math.random() * 2}s`
              }}
            >
              <div
                className="w-3 h-3 rounded-full"
                style={{
                  backgroundColor: ['#9333ea', '#ec4899', '#8b5cf6', '#f59e0b', '#10b981'][
                    Math.floor(Math.random() * 5)
                  ]
                }}
              />
            </div>
          ))}
        </div>
      )}

      <div className="bg-white rounded-3xl shadow-2xl p-8 lg:p-12 border-2 border-purple-100 text-center">
        {/* Success icon */}
        <div className="relative inline-block mb-6">
          <div className="w-24 h-24 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto animate-bounce-slow">
            <CheckCircle2 className="h-12 w-12 text-white" />
          </div>
          <div className="absolute -top-2 -right-2">
            <Sparkles className="h-8 w-8 text-yellow-400 animate-pulse" />
          </div>
        </div>

        {/* Main message */}
        <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
          ¡Felicidades! 🎉
        </h1>
        <h2 className="text-2xl lg:text-3xl font-semibold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-6">
          {salonName} está listo para despegar
        </h2>

        {/* Summary */}
        <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-6 mb-8 border-2 border-purple-200">
          <h3 className="font-bold text-gray-900 mb-4 text-lg">
            Tu salón está configurado con:
          </h3>
          <div className="space-y-3">
            <div className="flex items-center gap-3 text-left">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                <CheckCircle2 className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <div className="font-semibold text-gray-900">Información del salón</div>
                <div className="text-sm text-gray-600">Nombre, ubicación y colores personalizados</div>
              </div>
            </div>
            <div className="flex items-center gap-3 text-left">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                <CheckCircle2 className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <div className="font-semibold text-gray-900">Personal y servicios</div>
                <div className="text-sm text-gray-600">Equipo configurado y catálogo listo</div>
              </div>
            </div>
            <div className="flex items-center gap-3 text-left">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                <CheckCircle2 className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <div className="font-semibold text-gray-900">Base de clientas</div>
                <div className="text-sm text-gray-600">Sistema de importación configurado</div>
              </div>
            </div>
          </div>
        </div>

        {/* Next steps */}
        <div className="bg-blue-50 border-l-4 border-blue-400 p-6 rounded-lg mb-8 text-left">
          <h4 className="font-bold text-blue-900 mb-3">🚀 Próximos pasos sugeridos:</h4>
          <ul className="space-y-2 text-sm text-blue-800">
            <li className="flex items-start gap-2">
              <span className="font-bold">1.</span>
              <span>Conecta tu WhatsApp Business para activar el motor de retención</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="font-bold">2.</span>
              <span>Crea tu primera cita desde el calendario</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="font-bold">3.</span>
              <span>Explora el dashboard para familiarizarte con las métricas</span>
            </li>
          </ul>
        </div>

        {/* CTA */}
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-3 px-10 py-5 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-2xl font-bold text-xl hover:shadow-2xl hover:scale-105 transition-all"
        >
          Ir a mi Dashboard
          <ArrowRight className="h-6 w-6" />
        </Link>

        {/* Help link */}
        <div className="mt-8 text-sm text-gray-600">
          ¿Necesitas ayuda?{' '}
          <Link href="/ayuda" className="text-purple-600 font-semibold hover:underline">
            Visita nuestro centro de ayuda
          </Link>
        </div>
      </div>

      <style jsx>{`
        @keyframes confetti {
          0% {
            transform: translateY(0) rotate(0deg);
            opacity: 1;
          }
          100% {
            transform: translateY(100vh) rotate(720deg);
            opacity: 0;
          }
        }
        .animate-confetti {
          animation: confetti linear forwards;
        }
        @keyframes bounce-slow {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-10px);
          }
        }
        .animate-bounce-slow {
          animation: bounce-slow 2s ease-in-out infinite;
        }
      `}</style>
    </div>
  )
}
