import Link from 'next/link'
import { notFound } from 'next/navigation'

const pages: Record<string, { title: string; description: string }> = {
  demo: {
    title: 'Demo de ElenaOS',
    description: 'Estamos preparando una demo guiada para que puedas ver el sistema sin crear datos reales.',
  },
  changelog: {
    title: 'Novedades',
    description: 'Aquí publicaremos los cambios importantes del producto y mejoras de estabilidad.',
  },
  blog: {
    title: 'Blog',
    description: 'Contenido práctico para centros de estética, gestión de clientas y retención.',
  },
  academia: {
    title: 'Academia',
    description: 'Recursos de formación para sacar más partido a ElenaOS en el día a día del salón.',
  },
  guias: {
    title: 'Guías',
    description: 'Guías paso a paso para configurar tu salón, agenda, clientas y campañas.',
  },
  ayuda: {
    title: 'Ayuda',
    description: 'Centro de ayuda para resolver dudas frecuentes sobre cuenta, acceso y configuración.',
  },
  api: {
    title: 'API',
    description: 'Documentación técnica para futuras integraciones con ElenaOS.',
  },
  privacidad: {
    title: 'Política de privacidad',
    description: 'Resumen de cómo protegemos los datos de usuarios y salones dentro de ElenaOS.',
  },
  terminos: {
    title: 'Términos y condiciones',
    description: 'Condiciones básicas de uso del servicio ElenaOS.',
  },
  cookies: {
    title: 'Política de cookies',
    description: 'Información sobre el uso de cookies técnicas y de medición en ElenaOS.',
  },
  legal: {
    title: 'Aviso legal',
    description: 'Información legal del proyecto y canales de contacto.',
  },
}

export function generateStaticParams() {
  return Object.keys(pages).map((slug) => ({ slug }))
}

export default async function MarketingInfoPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const page = pages[slug]

  if (!page) {
    notFound()
  }

  return (
    <main className="min-h-screen bg-white">
      <section className="mx-auto flex min-h-screen max-w-3xl flex-col justify-center px-6 py-20">
        <Link href="/" className="mb-8 text-sm font-medium text-purple-700 hover:text-purple-800">
          Volver a ElenaOS
        </Link>
        <h1 className="text-4xl font-bold text-gray-950 sm:text-5xl">{page.title}</h1>
        <p className="mt-6 text-lg leading-8 text-gray-700">{page.description}</p>
        <div className="mt-10 rounded-lg border border-purple-100 bg-purple-50 p-5">
          <p className="text-sm leading-6 text-purple-950">
            Esta sección está en preparación. La dejamos disponible para evitar pantallas rotas
            mientras cerramos el MVP y sustituimos el contenido provisional por contenido final.
          </p>
        </div>
      </section>
    </main>
  )
}
