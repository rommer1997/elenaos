-- =============================================================================
-- ElenaOS - Schema MVP SIMPLIFICADO con RLS
-- =============================================================================
-- Arquitectura: RLS (Row Level Security) con tenant_id
-- Más simple, más fácil de mantener, suficiente para MVP
-- =============================================================================

-- PASO 1: Extensiones
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- =============================================================================
-- TABLAS GLOBALES (public schema)
-- =============================================================================

-- -----------------------------------------------------------------------------
-- 1. TENANTS (Salones)
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.tenants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  subdomain TEXT UNIQUE,

  -- Plan
  plan_type TEXT NOT NULL DEFAULT 'starter' CHECK (plan_type IN ('starter', 'professional', 'enterprise')),
  is_active BOOLEAN DEFAULT true,
  trial_ends_at TIMESTAMPTZ DEFAULT (now() + INTERVAL '14 days'),

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_tenants_slug ON public.tenants(slug);

-- -----------------------------------------------------------------------------
-- 2. USER PROFILES
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.user_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
  role TEXT NOT NULL DEFAULT 'admin' CHECK (role IN ('admin', 'staff')),
  first_name TEXT,
  last_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_user_profiles_tenant ON public.user_profiles(tenant_id);

-- -----------------------------------------------------------------------------
-- 3. PERSONAL (Staff Members)
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.staff_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,

  name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  role TEXT, -- "Estilista", "Técnico de uñas", etc.
  specialties TEXT[] DEFAULT '{}',
  calendar_color TEXT DEFAULT '#9333ea',
  availability JSONB DEFAULT '{}',

  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_staff_tenant ON public.staff_members(tenant_id);

-- -----------------------------------------------------------------------------
-- 4. SERVICIOS
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,

  name TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'Peluquería',
  description TEXT,
  duration INTEGER NOT NULL DEFAULT 30, -- minutos
  price NUMERIC(10,2) NOT NULL DEFAULT 0,
  products TEXT[] DEFAULT '{}',

  active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_services_tenant ON public.services(tenant_id);
CREATE INDEX idx_services_active ON public.services(tenant_id, active);

-- -----------------------------------------------------------------------------
-- 5. CLIENTES
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.clients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,

  first_name TEXT NOT NULL,
  last_name TEXT,
  phone TEXT NOT NULL,
  email TEXT,
  birth_date DATE,

  -- Retención
  visit_count INTEGER DEFAULT 0,
  last_visit_date DATE,
  avg_visit_interval_days NUMERIC(10,2),
  predicted_next_visit DATE,
  churn_risk_score NUMERIC(3,2) DEFAULT 0, -- 0.00 a 1.00
  lifetime_value NUMERIC(10,2) DEFAULT 0,

  -- Consentimientos
  gdpr_consent BOOLEAN DEFAULT false,
  gdpr_consent_date TIMESTAMPTZ,
  marketing_consent BOOLEAN DEFAULT false,
  whatsapp_opt_out BOOLEAN DEFAULT false,

  -- Metadata
  preferred_staff_id UUID REFERENCES public.staff_members(id),
  notes TEXT,
  ai_notes TEXT,
  tags TEXT[] DEFAULT '{}',

  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_clients_tenant ON public.clients(tenant_id);
CREATE INDEX idx_clients_phone ON public.clients(tenant_id, phone);
CREATE INDEX idx_clients_risk ON public.clients(tenant_id, churn_risk_score);
CREATE INDEX idx_clients_search ON public.clients USING gin(to_tsvector('spanish', first_name || ' ' || COALESCE(last_name, '')));

-- -----------------------------------------------------------------------------
-- 6. CITAS (Appointments)
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.appointments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,

  client_id UUID NOT NULL REFERENCES public.clients(id) ON DELETE CASCADE,
  staff_id UUID NOT NULL REFERENCES public.staff_members(id) ON DELETE CASCADE,
  service_id UUID NOT NULL REFERENCES public.services(id) ON DELETE CASCADE,

  date DATE NOT NULL,
  time TIME NOT NULL,
  duration INTEGER NOT NULL, -- minutos

  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'in_progress', 'completed', 'cancelled', 'no_show')),

  price NUMERIC(10,2) NOT NULL,
  notes TEXT,

  -- Notificaciones
  reminder_sent BOOLEAN DEFAULT false,
  confirmation_sent BOOLEAN DEFAULT false,

  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_appointments_tenant ON public.appointments(tenant_id);
CREATE INDEX idx_appointments_date ON public.appointments(tenant_id, date);
CREATE INDEX idx_appointments_client ON public.appointments(client_id);
CREATE INDEX idx_appointments_staff ON public.appointments(staff_id);

-- -----------------------------------------------------------------------------
-- 7. PRODUCTOS (Inventario)
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,

  name TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'General',
  brand TEXT,
  sku TEXT,

  stock INTEGER NOT NULL DEFAULT 0,
  min_stock INTEGER DEFAULT 5,
  max_stock INTEGER DEFAULT 50,

  cost NUMERIC(10,2) DEFAULT 0,
  price NUMERIC(10,2) DEFAULT 0,
  unit TEXT DEFAULT 'unidad',

  location TEXT,
  supplier TEXT,
  last_restock_date DATE,

  active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_products_tenant ON public.products(tenant_id);
CREATE INDEX idx_products_stock ON public.products(tenant_id, stock);

-- -----------------------------------------------------------------------------
-- 8. FACTURAS (Invoices)
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.invoices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,

  client_id UUID NOT NULL REFERENCES public.clients(id) ON DELETE CASCADE,
  appointment_id UUID REFERENCES public.appointments(id),

  number TEXT NOT NULL, -- "2024-00001"
  date DATE NOT NULL DEFAULT CURRENT_DATE,

  subtotal NUMERIC(10,2) NOT NULL,
  tax_amount NUMERIC(10,2) NOT NULL,
  total NUMERIC(10,2) NOT NULL,

  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'cancelled')),
  payment_method TEXT,
  paid_at TIMESTAMPTZ,

  notes TEXT,

  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_invoices_tenant ON public.invoices(tenant_id);
CREATE INDEX idx_invoices_date ON public.invoices(tenant_id, date);
CREATE INDEX idx_invoices_number ON public.invoices(tenant_id, number);

-- -----------------------------------------------------------------------------
-- 9. SETTINGS DEL SALÓN
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.salon_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL UNIQUE REFERENCES public.tenants(id) ON DELETE CASCADE,

  -- Apariencia
  primary_color TEXT DEFAULT '#9333ea',
  secondary_color TEXT DEFAULT '#ec4899',
  logo_url TEXT,

  -- Info del negocio
  business_name TEXT,
  tax_id TEXT,
  address TEXT,
  city TEXT,
  postal_code TEXT,
  phone TEXT,
  email TEXT,

  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_salon_settings_tenant ON public.salon_settings(tenant_id);

-- =============================================================================
-- ROW LEVEL SECURITY (RLS)
-- =============================================================================

-- Función helper para obtener tenant_id del usuario actual
CREATE OR REPLACE FUNCTION auth.user_tenant_id()
RETURNS UUID AS $$
  SELECT tenant_id FROM public.user_profiles WHERE id = auth.uid()
$$ LANGUAGE sql SECURITY DEFINER;

-- Habilitar RLS en todas las tablas
ALTER TABLE public.staff_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.salon_settings ENABLE ROW LEVEL SECURITY;

-- Políticas RLS: Staff Members
CREATE POLICY tenant_isolation ON public.staff_members
  USING (tenant_id = auth.user_tenant_id());

CREATE POLICY tenant_isolation_insert ON public.staff_members
  FOR INSERT WITH CHECK (tenant_id = auth.user_tenant_id());

-- Políticas RLS: Services
CREATE POLICY tenant_isolation ON public.services
  USING (tenant_id = auth.user_tenant_id());

CREATE POLICY tenant_isolation_insert ON public.services
  FOR INSERT WITH CHECK (tenant_id = auth.user_tenant_id());

-- Políticas RLS: Clients
CREATE POLICY tenant_isolation ON public.clients
  USING (tenant_id = auth.user_tenant_id());

CREATE POLICY tenant_isolation_insert ON public.clients
  FOR INSERT WITH CHECK (tenant_id = auth.user_tenant_id());

-- Políticas RLS: Appointments
CREATE POLICY tenant_isolation ON public.appointments
  USING (tenant_id = auth.user_tenant_id());

CREATE POLICY tenant_isolation_insert ON public.appointments
  FOR INSERT WITH CHECK (tenant_id = auth.user_tenant_id());

-- Políticas RLS: Products
CREATE POLICY tenant_isolation ON public.products
  USING (tenant_id = auth.user_tenant_id());

CREATE POLICY tenant_isolation_insert ON public.products
  FOR INSERT WITH CHECK (tenant_id = auth.user_tenant_id());

-- Políticas RLS: Invoices
CREATE POLICY tenant_isolation ON public.invoices
  USING (tenant_id = auth.user_tenant_id());

CREATE POLICY tenant_isolation_insert ON public.invoices
  FOR INSERT WITH CHECK (tenant_id = auth.user_tenant_id());

-- Políticas RLS: Salon Settings
CREATE POLICY tenant_isolation ON public.salon_settings
  USING (tenant_id = auth.user_tenant_id());

CREATE POLICY tenant_isolation_insert ON public.salon_settings
  FOR INSERT WITH CHECK (tenant_id = auth.user_tenant_id());

-- =============================================================================
-- TRIGGER: Auto-crear tenant y profile al registrarse
-- =============================================================================

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  new_tenant_id UUID;
  new_slug TEXT;
BEGIN
  -- Crear tenant
  new_slug := lower(regexp_replace(
    COALESCE(NEW.raw_user_meta_data->>'salon_name', 'salon') || '-' || substring(NEW.id::TEXT from 1 for 8),
    '[^a-z0-9]+', '-', 'g'
  ));

  INSERT INTO public.tenants (name, slug, subdomain)
  VALUES (
    COALESCE(NEW.raw_user_meta_data->>'salon_name', 'Mi Salón'),
    new_slug,
    new_slug
  )
  RETURNING id INTO new_tenant_id;

  -- Crear user_profile
  INSERT INTO public.user_profiles (id, tenant_id, role, first_name, last_name)
  VALUES (
    NEW.id,
    new_tenant_id,
    'admin',
    NEW.raw_user_meta_data->>'first_name',
    NEW.raw_user_meta_data->>'last_name'
  );

  -- Crear salon_settings por defecto
  INSERT INTO public.salon_settings (tenant_id)
  VALUES (new_tenant_id);

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger en auth.users
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- =============================================================================
-- FUNCIONES ÚTILES
-- =============================================================================

-- Función para actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Aplicar trigger de updated_at a todas las tablas
CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.staff_members FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.services FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.clients FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.appointments FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.products FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.invoices FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- =============================================================================
-- LISTO! Este schema está optimizado para MVP
-- =============================================================================

-- Para verificar que todo se creó correctamente:
-- SELECT tablename FROM pg_tables WHERE schemaname = 'public' ORDER BY tablename;
