import { createClient } from '@/lib/supabase/client'
import { useEffect } from 'react'
import type { Json } from '@/types/supabase'

export interface ThemeColors {
  primary: string
  secondary: string
  accent: string
  background: string
  text: string
}

export interface SalonTheme {
  colors: ThemeColors
  logo_url?: string
  brand_name?: string
}

interface SalonSettingsRpc {
  theme_colors?: ThemeColors
  logo_url?: string
  business_name?: string
}

const DEFAULT_THEME: ThemeColors = {
  primary: '#9333ea', // purple-600
  secondary: '#ec4899', // pink-600
  accent: '#8b5cf6', // violet-600
  background: '#ffffff',
  text: '#111827', // gray-900
}

/**
 * Obtiene la configuración de tema del salón desde la base de datos
 * Usa la función RPC get_my_salon_settings que verifica permisos automáticamente
 */
export async function getSalonTheme(): Promise<SalonTheme | null> {
  try {
    const supabase = createClient()

    // Llamar a la función RPC que obtiene settings del tenant del usuario autenticado
    const { data: settings, error: settingsError } = await supabase
      .rpc('get_my_salon_settings')

    if (settingsError) {
      console.error('Error fetching salon settings:', settingsError)
      return null
    }

    const typedSettings = settings as SalonSettingsRpc | null

    if (!typedSettings || !typedSettings.theme_colors) {
      return null
    }

    return {
      colors: typedSettings.theme_colors as ThemeColors,
      logo_url: typedSettings.logo_url,
      brand_name: typedSettings.business_name,
    }
  } catch (error) {
    console.error('Error in getSalonTheme:', error)
    return null
  }
}

/**
 * Aplica el tema del salón como CSS variables en el documento
 */
export function applyTheme(theme: SalonTheme | null) {
  const colors = theme?.colors || DEFAULT_THEME
  const root = document.documentElement

  // Aplicar CSS variables
  root.style.setProperty('--color-primary', colors.primary)
  root.style.setProperty('--color-secondary', colors.secondary)
  root.style.setProperty('--color-accent', colors.accent)
  root.style.setProperty('--color-background', colors.background)
  root.style.setProperty('--color-text', colors.text)

  // Convertir hex a RGB para usar con opacity
  const hexToRgb = (hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
    return result
      ? `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}`
      : '0, 0, 0'
  }

  root.style.setProperty('--color-primary-rgb', hexToRgb(colors.primary))
  root.style.setProperty('--color-secondary-rgb', hexToRgb(colors.secondary))
  root.style.setProperty('--color-accent-rgb', hexToRgb(colors.accent))
}

/**
 * Hook para cargar y aplicar el tema del salón
 * Uso: Llamar en el layout principal del dashboard
 */
export function useLoadSalonTheme(enabled = true) {
  useEffect(() => {
    if (!enabled) return

    // Por ahora, simplemente aplicar el tema por defecto
    // TODO: Implementar get_my_salon_settings RPC cuando tengamos la tabla de configuración
    applyTheme(null)
  }, [enabled])
}

/**
 * Actualiza los colores del tema del salón en la base de datos
 */
export async function updateSalonTheme(
  colors: Partial<ThemeColors>
): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = createClient()

    // Obtener tenant del usuario autenticado
    const user = await supabase.auth.getUser()
    if (!user.data.user?.id) {
      return { success: false, error: 'Usuario no autenticado' }
    }

    const { data: profile } = await supabase
      .from('user_profiles')
      .select('tenant_id')
      .eq('id', user.data.user.id)
      .single()

    if (!profile?.tenant_id) {
      return { success: false, error: 'Usuario sin tenant asociado' }
    }

    // Obtener schema_name
    const { data: tenant } = await supabase
      .from('tenants')
      .select('schema_name')
      .eq('id', profile.tenant_id)
      .single()

    if (!tenant?.schema_name) {
      return { success: false, error: 'Tenant no encontrado' }
    }

    // Actualizar configuración usando RPC
    const { error: updateError } = await supabase
      .rpc('update_salon_theme', {
        p_schema_name: tenant.schema_name,
        p_colors: colors as Record<string, Json>,
      })

    if (updateError) {
      return { success: false, error: updateError.message }
    }

    // Aplicar tema inmediatamente
    const currentTheme = await getSalonTheme()
    if (currentTheme) {
      applyTheme(currentTheme)
    }

    return { success: true }
  } catch (error) {
    console.error('Error updating salon theme:', error)
    return { success: false, error: 'Error inesperado' }
  }
}
