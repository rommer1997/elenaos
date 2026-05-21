/**
 * Cliente de Supabase para MIDDLEWARE
 * Refresca la sesión automáticamente
 */

import { createServerClient } from '@supabase/ssr'
import { type NextRequest, NextResponse } from 'next/server'

export async function updateSession(request: NextRequest) {
  const supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            request.cookies.set(name, value)
            supabaseResponse.cookies.set(name, value, options)
          })
        },
      },
    }
  )

  // IMPORTANTE: No escribir ninguna lógica entre createServerClient y
  // supabase.auth.getUser(). Un simple error puede hacer que el usuario
  // sea redirigido aleatoriamente fuera de la aplicación

  const {
    data: { user },
  } = await supabase.auth.getUser()

  const protectedPaths = [
    '/dashboard',
    '/agenda',
    '/clientes',
    '/retencion',
    '/agente',
    '/facturacion',
    '/inventario',
    '/personal',
    '/servicios',
    '/configuracion',
    '/billing',
    '/station',
    '/onboarding',
  ]
  const isProtectedPath = protectedPaths.some((path) =>
    request.nextUrl.pathname === path || request.nextUrl.pathname.startsWith(`${path}/`)
  )

  // Proteger rutas privadas
  if (
    !user &&
    !request.nextUrl.pathname.startsWith('/login') &&
    !request.nextUrl.pathname.startsWith('/registro') &&
    isProtectedPath
  ) {
    // No autenticado, redirigir a login
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    return NextResponse.redirect(url)
  }

  // Si está autenticado y va a /login o /registro, redirigir al dashboard
  if (
    user &&
    (request.nextUrl.pathname === '/login' ||
      request.nextUrl.pathname === '/registro')
  ) {
    const url = request.nextUrl.clone()
    url.pathname = '/dashboard'
    return NextResponse.redirect(url)
  }

  return supabaseResponse
}
