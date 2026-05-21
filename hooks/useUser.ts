'use client'

import { useCallback, useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { User } from '@supabase/supabase-js'
import type { User as AppUser, Tenant, UserRole } from '@/types'
import type { Database } from '@/types/supabase'

type UserProfileRow = Database['public']['Tables']['user_profiles']['Row']
type TenantRow = Database['public']['Tables']['tenants']['Row']

interface UseUserReturn {
  user: User | null
  profile: AppUser | null
  tenant: Tenant | null
  isLoading: boolean
  error: Error | null
}

function toAppProfile(profile: UserProfileRow, authUser: User, tenantSchema: string): AppUser {
  return {
    id: authUser.id,
    email: authUser.email ?? '',
    role: profile.role as UserRole,
    tenant_id: profile.tenant_id,
    tenant_schema: tenantSchema,
    first_name: profile.first_name ?? undefined,
    last_name: profile.last_name ?? undefined,
    avatar_url: profile.avatar_url ?? undefined,
    created_at: profile.created_at,
    updated_at: profile.updated_at,
  }
}

function toAppTenant(tenant: TenantRow): Tenant {
  return {
    id: tenant.id,
    name: tenant.name,
    slug: tenant.slug,
    subdomain: tenant.subdomain ?? '',
    schema_name: tenant.schema_name,
    plan_type: tenant.plan_type,
    is_active: tenant.is_active,
    trial_ends_at: tenant.trial_ends_at ?? undefined,
    subscription_ends_at: tenant.subscription_ends_at ?? undefined,
    created_at: tenant.created_at,
  }
}

export function useUser(): UseUserReturn {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<AppUser | null>(null)
  const [tenant, setTenant] = useState<Tenant | null>(null)
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
        return
      }

      const { data: userProfile, error: profileError } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', authUser.id)
        .single()

      if (profileError) {
        throw profileError
      }

      const { data: tenantData, error: tenantError } = await supabase
        .from('tenants')
        .select('*')
        .eq('id', userProfile.tenant_id)
        .single()

      if (tenantError) {
        throw tenantError
      }

      const appTenant = toAppTenant(tenantData)

      setUser(authUser)
      setTenant(appTenant)
      setProfile(toAppProfile(userProfile, authUser, appTenant.schema_name))
    } catch (err) {
      console.error('Error loading user:', err)
      setUser(null)
      setProfile(null)
      setTenant(null)
      setError(err instanceof Error ? err : new Error('Error cargando usuario'))
    } finally {
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
