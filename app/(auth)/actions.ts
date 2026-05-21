'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import type { Database } from '@/types/supabase'

type TenantInsert = Database['public']['Tables']['tenants']['Insert']
type UserProfileInsert = Database['public']['Tables']['user_profiles']['Insert']

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
 * Signup: Crear usuario + tenant + user_profile
 */
export async function signup(formData: FormData): Promise<void> {
  const supabase = await createClient()

  // Datos del usuario
  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const firstName = formData.get('firstName') as string
  const lastName = formData.get('lastName') as string

  // Datos del salón
  const salonName = formData.get('salonName') as string
  const salonSlug = formData
    .get('salonSlug') as string ||
    salonName
      .toLowerCase()
      .normalize('NFD')
      .replace(/[̀-ͯ]/g, '') // Quitar acentos
      .replace(/[^a-z0-9]+/g, '-') // Reemplazar espacios y caracteres especiales por -
      .replace(/^-+|-+$/g, '') // Quitar - al inicio y final

  // 1. Crear usuario en Supabase Auth
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        first_name: firstName,
        last_name: lastName,
      },
    },
  })

  if (authError) {
    console.error('Auth error:', authError.message)
    redirect('/registro?error=auth_failed')
  }

  if (!authData.user) {
    redirect('/registro?error=user_creation_failed')
  }

  // 2. Crear tenant (salón)
  const schemaName = `salon_${authData.user.id.replace(/-/g, '').substring(0, 12)}`

  const { data: tenant, error: tenantError } = await supabase
    .from('tenants')
    .insert({
      name: salonName,
      slug: salonSlug,
      subdomain: salonSlug,
      schema_name: schemaName,
      plan_type: 'starter',
      is_active: true,
      // Trial de 14 días
      trial_ends_at: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
    } satisfies TenantInsert)
    .select()
    .single()

  if (tenantError || !tenant) {
    console.error('Error creating tenant:', tenantError)
    redirect('/registro?error=tenant_creation_failed')
  }

  // 3. Crear user_profile
  const { error: profileError } = await supabase
    .from('user_profiles')
    .insert({
      id: authData.user.id,
      tenant_id: tenant.id,
      role: 'admin', // El creador es admin
      first_name: firstName,
      last_name: lastName,
    } satisfies UserProfileInsert)

  if (profileError) {
    console.error('Error creating user profile:', profileError)
    redirect('/registro?error=profile_creation_failed')
  }

  // 4. Login automático
  const { error: loginError } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (loginError) {
    console.error('Login error:', loginError.message)
    redirect('/login?error=auto_login_failed')
  }

  revalidatePath('/', 'layout')
  redirect('/dashboard')
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
