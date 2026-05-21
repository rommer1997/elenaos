/**
 * Tipos generados automáticamente desde el schema de Supabase
 *
 * TODO: Generar estos tipos después de aplicar el schema con:
 * npx supabase gen types typescript --project-id TU_PROJECT_ID > types/supabase.ts
 *
 * Por ahora usamos un placeholder
 */

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      tenants: {
        Row: {
          id: string
          name: string
          slug: string
          subdomain: string | null
          schema_name: string
          plan_type: 'starter' | 'growth' | 'studio_pro'
          is_active: boolean
          trial_ends_at: string | null
          subscription_ends_at: string | null
          lemon_squeezy_customer_id: string | null
          lemon_squeezy_subscription_id: string | null
          lemon_squeezy_license_key: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          slug: string
          subdomain?: string | null
          schema_name: string
          plan_type?: 'starter' | 'growth' | 'studio_pro'
          is_active?: boolean
          trial_ends_at?: string | null
          subscription_ends_at?: string | null
          lemon_squeezy_customer_id?: string | null
          lemon_squeezy_subscription_id?: string | null
          lemon_squeezy_license_key?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          slug?: string
          subdomain?: string | null
          schema_name?: string
          plan_type?: 'starter' | 'growth' | 'studio_pro'
          is_active?: boolean
          trial_ends_at?: string | null
          subscription_ends_at?: string | null
          lemon_squeezy_customer_id?: string | null
          lemon_squeezy_subscription_id?: string | null
          lemon_squeezy_license_key?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      user_profiles: {
        Row: {
          id: string
          tenant_id: string
          role: 'admin' | 'manager' | 'staff' | 'receptionist'
          first_name: string | null
          last_name: string | null
          avatar_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          tenant_id: string
          role?: 'admin' | 'manager' | 'staff' | 'receptionist'
          first_name?: string | null
          last_name?: string | null
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          tenant_id?: string
          role?: 'admin' | 'manager' | 'staff' | 'receptionist'
          first_name?: string | null
          last_name?: string | null
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      billing_events: {
        Row: {
          id: string
          tenant_id: string | null
          event_type: string
          payload: Json
          processed: boolean
          processed_at: string | null
          created_at: string
        }
        Insert: {
          id?: string
          tenant_id?: string | null
          event_type: string
          payload: Json
          processed?: boolean
          processed_at?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          tenant_id?: string | null
          event_type?: string
          payload?: Json
          processed?: boolean
          processed_at?: string | null
          created_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      create_tenant_schema: {
        Args: {
          tenant_id: string
          schema_name: string
        }
        Returns: void
      }
      get_tenant_schema: {
        Args: {
          user_id: string
        }
        Returns: string
      }
      generate_invoice_number: {
        Args: {
          tenant_schema: string
        }
        Returns: string
      }
      get_my_salon_settings: {
        Args: Record<PropertyKey, never>
        Returns: {
          theme_colors?: Json
          logo_url?: string | null
          business_name?: string | null
        } | null
      }
      update_salon_theme: {
        Args: {
          p_schema_name: string
          p_colors: Json
        }
        Returns: void
      }
    }
    Enums: {
      [_ in never]: never
    }
  }
}
