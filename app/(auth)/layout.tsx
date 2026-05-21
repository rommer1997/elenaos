import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'ElenaOS - Sistema operativo para centros de estética',
  description: 'Tu salón lleno. Sin perseguir a nadie.',
}

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 via-pink-50 to-yellow-50">
      <div className="w-full max-w-md px-4">
        {/* Logo */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            ElenaOS
          </h1>
          <p className="text-gray-600 mt-2">
            El sistema operativo para tu salón
          </p>
        </div>

        {/* Content */}
        {children}

        {/* Footer */}
        <div className="text-center mt-8 text-sm text-gray-500">
          <p>© 2026 ElenaOS. Powered by Rommer Volcanes</p>
        </div>
      </div>
    </div>
  )
}
