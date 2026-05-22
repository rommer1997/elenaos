'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import type { Database } from '@/types/supabase'

type TenantInsert = Database['public']['Tables']['tenants']['Insert']
type UserProfileInsert = Database['public']['Tables']['user_profiles']['Insert']
type ProfileInsert = Database['public']['Tables']['profiles']['Insert']

function getAppUrl() {
  return process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
}

function normalizeRequired(value: FormDataEntryValue | null) {
  return String(value ?? '').trim()
}

function createSlug(value: string) {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 48)
}

function getAuthErrorCode(message: string) {
  const lowerMessage = message.toLowerCase()

  if (lowerMessage.includes('confirm') || lowerMessage.includes('verified')) {
    return 'email_not_confirmed'
  }

  return 'invalid_credentials'
}

function isMissingTableError(error: { code?: string; message?: string } | null) {
  return (
    error?.code === '42P01' ||
    error?.code === 'PGRST205' ||
    Boolean(error?.message?.toLowerCase().includes('could not find the table'))
  )
}

/**
 * Login con email y password
 */
export async function login(formData: FormData): Promise<void> {
  const supabase = await createClient()

  const data = {
    email: normalizeRequired(formData.get('email')).toLowerCase(),
    password: normalizeRequired(formData.get('password')),
  }

  const { error } = await supabase.auth.signInWithPassword(data)

  if (error) {
    console.error('Login error:', error.message)
    redirect(`/login?error=${getAuthErrorCode(error.message)}`)
  }

  revalidatePath('/', 'layout')
  redirect('/dashboard')
}

/**
 * Signup: crea usuario, salón y perfil del dueño.
 */
export async function signup(formData: FormData): Promise<void> {
  const supabase = await createClient()

  const email = normalizeRequired(formData.get('email')).toLowerCase()
  const password = normalizeRequired(formData.get('password'))
  const firstName = normalizeRequired(formData.get('firstName'))
  const lastName = normalizeRequired(formData.get('lastName'))
  const salonName = normalizeRequired(formData.get('salonName'))

  if (!email || !password || !firstName || !lastName || !salonName) {
    redirect('/registro?error=Completa todos los campos obligatorios.')
  }

  if (password.length < 6) {
    redirect('/registro?error=La contraseña debe tener al menos 6 caracteres.')
  }

  const { data: authData, error: authError } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: `${firstName} ${lastName}`,
        first_name: firstName,
        last_name: lastName,
        salon_name: salonName,
      },
      emailRedirectTo: `${getAppUrl()}/auth/callback`,
    },
  })

  if (authError) {
    console.error('Auth error:', authError.message)
    redirect(`/registro?error=${encodeURIComponent(authError.message)}`)
  }

  if (!authData.user) {
    redirect('/registro?error=Usuario no creado. Intenta de nuevo.')
  }

  const admin = createAdminClient()
  const userId = authData.user.id

  const { data: existingProfile, error: existingProfileError } = await admin
    .from('user_profiles')
    .select('id, tenant_id')
    .eq('id', userId)
    .maybeSingle()

  if (existingProfileError && !isMissingTableError(existingProfileError)) {
    console.error('Existing profile check error:', existingProfileError.message)
  }

  if (existingProfile?.tenant_id) {
    revalidatePath('/', 'layout')
    redirect('/registro?success=true')
  }

  if (isMissingTableError(existingProfileError)) {
    const profilePayload: ProfileInsert = {
      id: userId,
      email,
      full_name: `${firstName} ${lastName}`,
    }

    const { error: simpleProfileError } = await admin
      .from('profiles')
      .upsert(profilePayload, { onConflict: 'id' })

    if (simpleProfileError) {
      console.error('Simple profile provisioning error:', simpleProfileError.message)
      redirect('/registro?error=La cuenta se creó, pero no pudimos preparar tu perfil. Contacta soporte.')
    }

    revalidatePath('/', 'layout')
    redirect('/registro?success=true')
  }

  const slugBase = createSlug(salonName) || `salon-${userId.slice(0, 8)}`
  const uniqueSuffix = userId.replace(/-/g, '').slice(0, 8)
  const slug = `${slugBase}-${uniqueSuffix}`.slice(0, 63)

  const tenantPayload: TenantInsert = {
    name: salonName,
    slug,
    subdomain: slug,
    schema_name: `salon_${userId.replace(/-/g, '').slice(0, 12)}`,
    plan_type: 'starter',
    is_active: true,
    trial_ends_at: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
  }

  const { data: tenant, error: tenantError } = await admin
    .from('tenants')
    .insert(tenantPayload)
    .select('id')
    .single()

  if (tenantError || !tenant) {
    console.error('Tenant provisioning error:', tenantError?.message)
    redirect('/registro?error=La cuenta se creó, pero no pudimos preparar el salón. Contacta soporte.')
  }

  const profilePayload: UserProfileInsert = {
    id: userId,
    tenant_id: tenant.id,
    role: 'admin',
    first_name: firstName,
    last_name: lastName,
  }

  const { error: profileError } = await admin
    .from('user_profiles')
    .insert(profilePayload)

  if (profileError) {
    console.error('Profile provisioning error:', profileError.message)
    redirect('/registro?error=El salón se creó, pero no pudimos preparar tu perfil. Contacta soporte.')
  }

  revalidatePath('/', 'layout')
  redirect('/registro?success=true')
}

/**
 * Solicitar recuperación de contraseña.
 */
export async function requestPasswordReset(formData: FormData): Promise<void> {
  const supabase = await createClient()
  const email = normalizeRequired(formData.get('email')).toLowerCase()

  if (!email) {
    redirect('/recuperar-password?error=Escribe tu email.')
  }

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${getAppUrl()}/auth/callback?next=/dashboard`,
  })

  if (error) {
    console.error('Password reset error:', error.message)
    redirect(`/recuperar-password?error=${encodeURIComponent(error.message)}`)
  }

  redirect('/recuperar-password?success=true')
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
