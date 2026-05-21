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

      // Intentar cargar el perfil desde la tabla profiles (puede fallar y no pasa nada)
      let userProfile = null
      try {
        const { data, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', authUser.id)
          .maybeSingle()

        if (!profileError) {
          userProfile = data
        }
      } catch (e) {
        // Ignorar errores de la tabla profiles
        console.log('Using auth metadata only (profiles table not available)')
      }

      // Construir el perfil simple desde auth metadata
      const simpleProfile: SimpleProfile = {
        id: authUser.id,
        email: authUser.email ?? null,
        full_name: userProfile?.full_name || authUser.user_metadata?.full_name || null,
        avatar_url: userProfile?.avatar_url || authUser.user_metadata?.avatar_url || null,
        first_name: authUser.user_metadata?.full_name?.split(' ')[0],
        last_name: authUser.user_metadata?.full_name?.split(' ').slice(1).join(' '),
        role: 'owner', // Por defecto es owner en versión simplificada
      }

      // Construir tenant simple desde metadata
      const simpleTenant: SimpleTenant = {
        id: authUser.id, // Usar el user ID como tenant ID en versión simplificada
        name: authUser.user_metadata?.salon_name || 'Mi Salón',
        subdomain: 'demo',
        plan_type: 'starter',
        trial_ends_at: undefined,
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
