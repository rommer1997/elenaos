'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
// Removed unused type imports

/**
 * Login con email y password
 */
export async function login(formData: FormData): Promise<void> {
  const supabase = await createClient()

  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  }

  const { error } = await supabase.auth.signInWithPassword(data)

  if (error) {
    // TODO: Implement proper error handling with useFormState
    console.error('Login error:', error.message)
    redirect('/login?error=invalid_credentials')
  }

  revalidatePath('/', 'layout')
  redirect('/dashboard')
}

/**
 * Signup: Crear usuario (versión simplificada)
 */
export async function signup(formData: FormData): Promise<void> {
  const supabase = await createClient()

  // Datos del usuario
  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const firstName = formData.get('firstName') as string
  const lastName = formData.get('lastName') as string
  const salonName = formData.get('salonName') as string

  // Crear usuario en Supabase Auth
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: `${firstName} ${lastName}`,
        salon_name: salonName,
      },
      emailRedirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/callback`,
    },
  })

  if (authError) {
    console.error('Auth error:', authError.message)
    redirect(`/registro?error=${encodeURIComponent(authError.message)}`)
  }

  if (!authData.user) {
    redirect('/registro?error=Usuario no creado. Intenta de nuevo.')
  }

  // Redirigir a página de confirmación
  revalidatePath('/', 'layout')
  redirect('/registro?success=true')
}

/**
 * Logout
 */
export async function logout() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  revalidatePath('/', 'layout')
  redirect('/login')
}
