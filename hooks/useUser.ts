'use client'

import { useCallback, useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { User } from '@supabase/supabase-js'

interface SimpleProfile {
  id: string
  email: string | null
  full_name: string | null
  avatar_url: string | null
  first_name?: string
  last_name?: string
  role?: string
}

interface SimpleTenant {
  id?: string
  name: string
  subdomain?: string
  schema_name?: string
  plan_type?: string
  trial_ends_at?: string
}

interface UseUserReturn {
  user: User | null
  profile: SimpleProfile | null
  tenant: SimpleTenant | null
  isLoading: boolean
  error: Error | null
}

export function useUser(): UseUserReturn {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<SimpleProfile | null>(null)
  const [tenant, setTenant] = useState<SimpleTenant | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  const loadUser = useCallback(async () => {
    const supabase = createClient()

    try {
      setIsLoading(true)
      setError(null)

      const {
        data: { user: authUser },
        error: authError,
      } = await supabase.auth.getUser()

      if (authError) {
        throw authError
      }

      if (!authUser) {
        setUser(null)
        setProfile(null)
        setTenant(null)
        setIsLoading(false)
        return
      }

      // Cargar user_profile desde la base de datos
      const { data: userProfileData, error: profileError } = await supabase
        .from('user_profiles')
        .select('id, tenant_id, role, first_name, last_name, avatar_url')
        .eq('id', authUser.id)
        .maybeSingle()

      if (profileError) {
        console.error('Error loading user profile:', profileError)
        throw new Error('No se pudo cargar el perfil de usuario')
      }

      if (!userProfileData) {
        console.error('User profile not found for user:', authUser.id)
        throw new Error('Perfil de usuario no encontrado. Por favor contacta soporte.')
      }

      // Cargar tenant desde la base de datos
      const { data: tenantData, error: tenantError } = await supabase
        .from('tenants')
        .select('id, name, slug, subdomain, schema_name, plan_type, trial_ends_at, is_active')
        .eq('id', userProfileData.tenant_id)
        .maybeSingle()

      if (tenantError) {
        console.error('Error loading tenant:', tenantError)
        throw new Error('No se pudo cargar la información del salón')
      }

      if (!tenantData) {
        console.error('Tenant not found for tenant_id:', userProfileData.tenant_id)
        throw new Error('Salón no encontrado. Por favor contacta soporte.')
      }

      // Construir el perfil desde la base de datos
      const simpleProfile: SimpleProfile = {
        id: userProfileData.id,
        email: authUser.email ?? null,
        full_name: userProfileData.first_name && userProfileData.last_name
          ? `${userProfileData.first_name} ${userProfileData.last_name}`
          : authUser.user_metadata?.full_name || null,
        avatar_url: userProfileData.avatar_url || null,
        first_name: userProfileData.first_name || authUser.user_metadata?.first_name,
        last_name: userProfileData.last_name || authUser.user_metadata?.last_name,
        role: userProfileData.role || 'admin',
      }

      // Construir tenant desde la base de datos
      const simpleTenant: SimpleTenant = {
        id: tenantData.id,
        name: tenantData.name,
        subdomain: tenantData.subdomain || undefined,
        schema_name: tenantData.schema_name,
        plan_type: tenantData.plan_type || 'starter',
        trial_ends_at: tenantData.trial_ends_at || undefined,
      }

      setUser(authUser)
      setProfile(simpleProfile)
      setTenant(simpleTenant)
      setIsLoading(false)
    } catch (err) {
      console.error('Error loading user:', err)
      setUser(null)
      setProfile(null)
      setTenant(null)
      setError(err instanceof Error ? err : new Error('Error cargando usuario'))
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    const supabase = createClient()

    loadUser()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        loadUser()
        return
      }

      setUser(null)
      setProfile(null)
      setTenant(null)
      setIsLoading(false)
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [loadUser])

  return {
    user,
    profile,
    tenant,
    isLoading,
    error,
  }
}
