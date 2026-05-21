// =============================================================================
// ElenaOS - Tipos TypeScript Globales
// =============================================================================

export type JsonValue =
  | string
  | number
  | boolean
  | null
  | JsonValue[]
  | { [key: string]: JsonValue | undefined }

// -----------------------------------------------------------------------------
// Auth & Users
// -----------------------------------------------------------------------------

export type UserRole = 'admin' | 'manager' | 'staff' | 'receptionist'

export interface User {
  id: string
  email: string
  role: UserRole
  tenant_id: string
  tenant_schema: string
  first_name?: string
  last_name?: string
  avatar_url?: string
  created_at: string
  updated_at: string
}

export interface Tenant {
  id: string
  name: string
  slug: string
  subdomain: string
  schema_name: string
  plan_type: 'starter' | 'growth' | 'studio_pro'
  is_active: boolean
  trial_ends_at?: string
  subscription_ends_at?: string
  created_at: string
}

// -----------------------------------------------------------------------------
// Clients (Clientas)
// -----------------------------------------------------------------------------

export type ClientRiskLevel = 'active' | 'warm' | 'at_risk' | 'lost'

export interface Client {
  id: string
  first_name: string
  last_name?: string
  phone: string
  email?: string
  birth_date?: string
  gdpr_consent: boolean
  gdpr_consent_date?: string
  marketing_consent: boolean
  whatsapp_opt_out: boolean
  visit_count: number
  avg_visit_interval_days?: number
  last_visit_date?: string
  predicted_next_visit?: string
  churn_risk_score?: number
  risk_level?: ClientRiskLevel
  lifetime_value: number
  preferred_staff_id?: string
  notes?: string
  ai_notes?: string
  tags?: string[]
  created_at: string
  updated_at: string
}

// -----------------------------------------------------------------------------
// Appointments (Citas)
// -----------------------------------------------------------------------------

export type AppointmentStatus =
  | 'scheduled'
  | 'confirmed'
  | 'completed'
  | 'cancelled'
  | 'no_show'

export type AppointmentSource =
  | 'manual'
  | 'whatsapp_bot'
  | 'online'
  | 'walk_in'

export interface Appointment {
  id: string
  tenant_id: string
  client_id: string
  client?: Client
  staff_id: string
  staff?: Staff
  service_id: string
  service?: Service
  start_time: string
  end_time: string
  status: AppointmentStatus
  price?: number
  notes?: string
  source?: AppointmentSource
  invoice_id?: string
  created_at: string
  updated_at: string
  // Campos adicionales para display (joins)
  client_name?: string
  staff_name?: string
  service_name?: string
  service_color?: string
}

// -----------------------------------------------------------------------------
// Staff (Personal)
// -----------------------------------------------------------------------------

export interface Staff {
  id: string
  tenant_id: string
  first_name: string
  last_name: string
  email?: string
  phone?: string
  role: string
  specialties?: string[]
  calendar_color?: string
  is_active: boolean
  created_at: string
  updated_at: string
}

// -----------------------------------------------------------------------------
// Services (Servicios)
// -----------------------------------------------------------------------------

export interface Service {
  id: string
  tenant_id: string
  name: string
  description?: string
  duration: number // minutos
  price: number
  category?: string
  color?: string
  products_used?: Record<string, JsonValue>
  is_active: boolean
  created_at: string
  updated_at: string
}

// -----------------------------------------------------------------------------
// WhatsApp
// -----------------------------------------------------------------------------

export type MessageDirection = 'outbound' | 'inbound'

export type MessageStatus = 'sent' | 'delivered' | 'read' | 'replied' | 'failed'

export interface WhatsAppMessage {
  id: string
  client_id: string
  campaign_id?: string
  direction: MessageDirection
  message_content: string
  status: MessageStatus
  sent_at?: string
  delivered_at?: string
  read_at?: string
  created_at: string
}

export type CampaignStatus =
  | 'scheduled'
  | 'sent'
  | 'replied'
  | 'converted'
  | 'failed'

export interface RetentionCampaign {
  id: string
  client_id: string
  client?: Client
  rule_id?: string
  status: CampaignStatus
  scheduled_for: string
  sent_at?: string
  message_content?: string
  response_content?: string
  appointment_created_id?: string
  created_at: string
}

// -----------------------------------------------------------------------------
// Invoices (Facturas)
// -----------------------------------------------------------------------------

export type InvoiceStatus =
  | 'draft'
  | 'sent'
  | 'paid'
  | 'overdue'
  | 'cancelled'

export interface Invoice {
  id: string
  invoice_number: string
  client_id: string
  client?: Client
  issue_date: string
  due_date?: string
  status: InvoiceStatus
  subtotal: number
  tax_rate: number
  tax_amount: number
  total: number
  payment_method?: string
  facturae_xml?: string
  verifactu_sent: boolean
  verifactu_code?: string
  notes?: string
  created_at: string
}

export interface InvoiceLine {
  id: string
  invoice_id: string
  description: string
  quantity: number
  unit_price: number
  total: number
}

// -----------------------------------------------------------------------------
// Inventory (Inventario)
// -----------------------------------------------------------------------------

export interface InventoryItem {
  id: string
  name: string
  code?: string
  supplier?: string
  cost_price: number
  sale_price: number
  current_stock: number
  min_stock_alert: number
  created_at: string
}

export type MovementType = 'in' | 'out' | 'adjustment'

export interface InventoryMovement {
  id: string
  item_id: string
  item?: InventoryItem
  type: MovementType
  quantity: number
  reason?: string
  created_by: string
  created_at: string
}

// -----------------------------------------------------------------------------
// Salon Settings (Configuración del Salón)
// -----------------------------------------------------------------------------

export interface SalonSettings {
  id: string
  salon_id: string
  salon_name: string
  logo_url?: string
  // Colores
  primary_color: string
  secondary_color: string
  accent_color: string
  background_color: string
  surface_color: string
  text_color: string
  // Fuentes
  font_heading: string
  font_body: string
  // Tema
  theme_mode: 'light' | 'dark' | 'auto'
  // WhatsApp
  whatsapp_sender_name?: string
  whatsapp_signature?: string
  // Horarios
  opening_hours?: Record<string, JsonValue>
  timezone: string
  // Fiscal
  business_name?: string
  tax_id?: string
  address?: string
  postal_code?: string
  city?: string
  country: string
  updated_at: string
}

// -----------------------------------------------------------------------------
// Dashboard & Analytics
// -----------------------------------------------------------------------------

export interface DashboardMetrics {
  today: {
    appointments_total: number
    appointments_confirmed: number
    appointments_completed: number
    revenue_estimated: number
    clients_at_risk: number
    whatsapp_pending: number
  }
  month: {
    revenue: number
    appointments: number
    clients_reactivated: number
    retention_rate: number
    whatsapp_sent: number
    whatsapp_response_rate: number
    roi: number
  }
}

// -----------------------------------------------------------------------------
// API Responses
// -----------------------------------------------------------------------------

export interface ApiResponse<T = unknown> {
  data?: T
  error?: string
  message?: string
}

export interface PaginatedResponse<T> {
  data: T[]
  pagination: {
    page: number
    per_page: number
    total: number
    total_pages: number
  }
}
