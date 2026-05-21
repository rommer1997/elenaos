-- =============================================================================
-- ElenaOS - Schema Multi-tenant para Supabase
-- =============================================================================
-- Arquitectura: Schema-per-tenant
-- Cada salón tiene su propio schema con tablas aisladas
-- =============================================================================

-- -----------------------------------------------------------------------------
-- EXTENSIONES NECESARIAS
-- -----------------------------------------------------------------------------

-- UUID generation
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Vector search para IA (búsqueda semántica)
CREATE EXTENSION IF NOT EXISTS vector;

-- Trigram similarity para búsqueda fuzzy
CREATE EXTENSION IF NOT EXISTS pg_trgm;


-- =============================================================================
-- SCHEMA GLOBAL (public)
-- =============================================================================

-- -----------------------------------------------------------------------------
-- 1. TENANTS (Registro de todos los salones)
-- -----------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.tenants (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL, -- URL-safe: "belleza-laura"
  subdomain TEXT UNIQUE, -- "belleza-laura.elenaos.app"
  schema_name TEXT UNIQUE NOT NULL, -- "salon_abc123"

  -- Plan y estado
  plan_type TEXT NOT NULL DEFAULT 'starter' CHECK (plan_type IN ('starter', 'growth', 'studio_pro')),
  is_active BOOLEAN DEFAULT true,

  -- Trial y suscripción
  trial_ends_at TIMESTAMPTZ,
  subscription_ends_at TIMESTAMPTZ,

  -- Integración Lemon Squeezy
  lemon_squeezy_customer_id TEXT,
  lemon_squeezy_subscription_id TEXT,
  lemon_squeezy_license_key TEXT,

  -- Metadata
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Índices
CREATE INDEX IF NOT EXISTS idx_tenants_slug ON public.tenants(slug);
CREATE INDEX IF NOT EXISTS idx_tenants_subdomain ON public.tenants(subdomain);
CREATE INDEX IF NOT EXISTS idx_tenants_is_active ON public.tenants(is_active);

-- Trigger para updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_tenants_updated_at
  BEFORE UPDATE ON public.tenants
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();


-- -----------------------------------------------------------------------------
-- 2. BILLING EVENTS (Webhooks de Lemon Squeezy)
-- -----------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.billing_events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID REFERENCES public.tenants(id) ON DELETE CASCADE,
  event_type TEXT NOT NULL, -- subscription_created, subscription_updated, etc.
  payload JSONB NOT NULL,
  processed BOOLEAN DEFAULT false,
  processed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_billing_events_tenant ON public.billing_events(tenant_id);
CREATE INDEX IF NOT EXISTS idx_billing_events_processed ON public.billing_events(processed);


-- -----------------------------------------------------------------------------
-- 3. USER PROFILES (Extensión de auth.users de Supabase)
-- -----------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.user_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  tenant_id UUID REFERENCES public.tenants(id) ON DELETE CASCADE,
  role TEXT NOT NULL DEFAULT 'staff' CHECK (role IN ('admin', 'manager', 'staff', 'receptionist')),
  first_name TEXT,
  last_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_user_profiles_tenant ON public.user_profiles(tenant_id);
CREATE INDEX IF NOT EXISTS idx_user_profiles_role ON public.user_profiles(role);

CREATE TRIGGER update_user_profiles_updated_at
  BEFORE UPDATE ON public.user_profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();


-- =============================================================================
-- FUNCIÓN: CREAR SCHEMA POR TENANT
-- =============================================================================

CREATE OR REPLACE FUNCTION create_tenant_schema(tenant_id UUID, schema_name TEXT)
RETURNS void AS $$
BEGIN
  -- Crear el schema
  EXECUTE format('CREATE SCHEMA IF NOT EXISTS %I', schema_name);

  -- Dar permisos al usuario de Supabase
  EXECUTE format('GRANT USAGE ON SCHEMA %I TO postgres, anon, authenticated, service_role', schema_name);
  EXECUTE format('GRANT ALL ON ALL TABLES IN SCHEMA %I TO postgres, authenticated, service_role', schema_name);
  EXECUTE format('GRANT SELECT ON ALL TABLES IN SCHEMA %I TO anon', schema_name);
  EXECUTE format('ALTER DEFAULT PRIVILEGES IN SCHEMA %I GRANT ALL ON TABLES TO postgres, authenticated, service_role', schema_name);
  EXECUTE format('ALTER DEFAULT PRIVILEGES IN SCHEMA %I GRANT SELECT ON TABLES TO anon', schema_name);

  -- -----------------------------------------------------------------------------
  -- TABLA: salon_settings
  -- -----------------------------------------------------------------------------
  EXECUTE format('
    CREATE TABLE %I.salon_settings (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      salon_id UUID NOT NULL,

      -- Identidad
      salon_name TEXT NOT NULL,
      logo_url TEXT,

      -- Colores (hex)
      primary_color TEXT DEFAULT ''#C084FC'',
      secondary_color TEXT DEFAULT ''#F9A8D4'',
      accent_color TEXT DEFAULT ''#FDE68A'',
      background_color TEXT DEFAULT ''#FAFAFA'',
      surface_color TEXT DEFAULT ''#FFFFFF'',
      text_color TEXT DEFAULT ''#111827'',

      -- Fuentes
      font_heading TEXT DEFAULT ''Playfair Display'',
      font_body TEXT DEFAULT ''Inter'',

      -- Tema
      theme_mode TEXT DEFAULT ''light'' CHECK (theme_mode IN (''light'', ''dark'', ''auto'')),

      -- WhatsApp
      whatsapp_sender_name TEXT,
      whatsapp_signature TEXT,

      -- Horarios (JSONB: {"monday": {"open": "09:00", "close": "20:00"}, ...})
      opening_hours JSONB DEFAULT ''{}''::jsonb,
      timezone TEXT DEFAULT ''Europe/Madrid'',

      -- Fiscal
      business_name TEXT,
      tax_id TEXT, -- NIF/CIF
      address TEXT,
      postal_code TEXT,
      city TEXT,
      country TEXT DEFAULT ''ES'',

      created_at TIMESTAMPTZ DEFAULT now(),
      updated_at TIMESTAMPTZ DEFAULT now()
    )
  ', schema_name);

  -- -----------------------------------------------------------------------------
  -- TABLA: staff (Personal del salón)
  -- -----------------------------------------------------------------------------
  EXECUTE format('
    CREATE TABLE %I.staff (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      name TEXT NOT NULL,
      email TEXT,
      role TEXT, -- "Esteticista", "Recepcionista", etc.
      specialties TEXT[], -- ["Manicura", "Pedicura", "Cejas"]
      calendar_color TEXT DEFAULT ''#3B82F6'',
      is_active BOOLEAN DEFAULT true,
      created_at TIMESTAMPTZ DEFAULT now(),
      updated_at TIMESTAMPTZ DEFAULT now()
    )
  ', schema_name);

  EXECUTE format('CREATE INDEX ON %I.staff(is_active)', schema_name);

  -- -----------------------------------------------------------------------------
  -- TABLA: services (Catálogo de servicios)
  -- -----------------------------------------------------------------------------
  EXECUTE format('
    CREATE TABLE %I.services (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      name TEXT NOT NULL,
      description TEXT,
      duration_minutes INTEGER NOT NULL DEFAULT 60,
      price NUMERIC(10,2) NOT NULL,
      category TEXT, -- "Manicura", "Pedicura", "Cejas", "Tratamientos"
      products_used JSONB DEFAULT ''[]''::jsonb, -- [{"product_id": "...", "quantity": 1}]
      is_active BOOLEAN DEFAULT true,
      created_at TIMESTAMPTZ DEFAULT now(),
      updated_at TIMESTAMPTZ DEFAULT now()
    )
  ', schema_name);

  EXECUTE format('CREATE INDEX ON %I.services(is_active)', schema_name);
  EXECUTE format('CREATE INDEX ON %I.services(category)', schema_name);

  -- -----------------------------------------------------------------------------
  -- TABLA: clients (Ficha completa de clientas)
  -- -----------------------------------------------------------------------------
  EXECUTE format('
    CREATE TABLE %I.clients (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

      -- Datos básicos
      first_name TEXT NOT NULL,
      last_name TEXT,
      phone TEXT UNIQUE NOT NULL, -- Número WhatsApp
      email TEXT,
      birth_date DATE,

      -- RGPD
      gdpr_consent BOOLEAN DEFAULT false,
      gdpr_consent_date TIMESTAMPTZ,
      marketing_consent BOOLEAN DEFAULT false,
      whatsapp_opt_out BOOLEAN DEFAULT false,

      -- Métricas de retención (calculadas por IA)
      visit_count INTEGER DEFAULT 0,
      avg_visit_interval_days NUMERIC(5,2), -- Media de días entre visitas
      last_visit_date DATE,
      predicted_next_visit DATE, -- IA calcula esto
      churn_risk_score NUMERIC(3,2) CHECK (churn_risk_score >= 0 AND churn_risk_score <= 1), -- 0.00 a 1.00

      -- Valor
      lifetime_value NUMERIC(10,2) DEFAULT 0,

      -- Preferencias
      preferred_staff_id UUID REFERENCES %I.staff(id) ON DELETE SET NULL,

      -- Notas
      notes TEXT, -- Notas manuales
      ai_notes TEXT, -- Notas generadas por Claude

      -- Tags
      tags TEXT[], -- ["VIP", "Nueva", "Fiel", etc.]

      created_at TIMESTAMPTZ DEFAULT now(),
      updated_at TIMESTAMPTZ DEFAULT now()
    )
  ', schema_name, schema_name);

  -- Índices críticos para performance
  EXECUTE format('CREATE INDEX ON %I.clients(phone)', schema_name);
  EXECUTE format('CREATE INDEX ON %I.clients(email)', schema_name);
  EXECUTE format('CREATE INDEX ON %I.clients(churn_risk_score DESC NULLS LAST)', schema_name);
  EXECUTE format('CREATE INDEX ON %I.clients(last_visit_date DESC NULLS LAST)', schema_name);
  EXECUTE format('CREATE INDEX ON %I.clients(whatsapp_opt_out)', schema_name);
  EXECUTE format('CREATE INDEX ON %I.clients USING gin(tags)', schema_name);

  -- Índice trigram para búsqueda fuzzy por nombre
  EXECUTE format('CREATE INDEX ON %I.clients USING gin(first_name gin_trgm_ops)', schema_name);
  EXECUTE format('CREATE INDEX ON %I.clients USING gin(last_name gin_trgm_ops)', schema_name);

  -- -----------------------------------------------------------------------------
  -- TABLA: appointments (Citas)
  -- -----------------------------------------------------------------------------
  EXECUTE format('
    CREATE TABLE %I.appointments (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      client_id UUID REFERENCES %I.clients(id) ON DELETE CASCADE,
      staff_id UUID REFERENCES %I.staff(id) ON DELETE SET NULL,
      service_id UUID REFERENCES %I.services(id) ON DELETE SET NULL,

      -- Horario
      start_time TIMESTAMPTZ NOT NULL,
      end_time TIMESTAMPTZ NOT NULL,

      -- Estado
      status TEXT DEFAULT ''scheduled'' CHECK (status IN (''scheduled'', ''confirmed'', ''completed'', ''cancelled'', ''no_show'')),

      -- Precio y notas
      price NUMERIC(10,2),
      notes TEXT,

      -- Origen de la cita
      source TEXT DEFAULT ''manual'' CHECK (source IN (''manual'', ''whatsapp_bot'', ''online'', ''walk_in'')),

      -- Relación con factura
      invoice_id UUID,

      created_at TIMESTAMPTZ DEFAULT now(),
      updated_at TIMESTAMPTZ DEFAULT now(),

      -- Constraint: end_time debe ser después de start_time
      CONSTRAINT valid_time_range CHECK (end_time > start_time)
    )
  ', schema_name, schema_name, schema_name, schema_name);

  -- Índices para queries comunes
  EXECUTE format('CREATE INDEX ON %I.appointments(client_id)', schema_name);
  EXECUTE format('CREATE INDEX ON %I.appointments(staff_id)', schema_name);
  EXECUTE format('CREATE INDEX ON %I.appointments(start_time)', schema_name);
  EXECUTE format('CREATE INDEX ON %I.appointments(status)', schema_name);
  EXECUTE format('CREATE INDEX ON %I.appointments(source)', schema_name);

  -- Índice compuesto para agenda del día
  EXECUTE format('CREATE INDEX ON %I.appointments(start_time, staff_id) WHERE status != ''cancelled''', schema_name);

  -- -----------------------------------------------------------------------------
  -- TABLA: whatsapp_messages (Historial WhatsApp)
  -- -----------------------------------------------------------------------------
  EXECUTE format('
    CREATE TABLE %I.whatsapp_messages (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      client_id UUID REFERENCES %I.clients(id) ON DELETE CASCADE,
      campaign_id UUID, -- Relación con retention_campaigns

      -- Dirección
      direction TEXT NOT NULL CHECK (direction IN (''outbound'', ''inbound'')),

      -- Contenido
      message_content TEXT NOT NULL,

      -- Estado (solo para outbound)
      status TEXT CHECK (status IN (''sent'', ''delivered'', ''read'', ''replied'', ''failed'')),

      -- Timestamps
      sent_at TIMESTAMPTZ,
      delivered_at TIMESTAMPTZ,
      read_at TIMESTAMPTZ,

      created_at TIMESTAMPTZ DEFAULT now()
    )
  ', schema_name, schema_name);

  EXECUTE format('CREATE INDEX ON %I.whatsapp_messages(client_id)', schema_name);
  EXECUTE format('CREATE INDEX ON %I.whatsapp_messages(campaign_id)', schema_name);
  EXECUTE format('CREATE INDEX ON %I.whatsapp_messages(direction)', schema_name);
  EXECUTE format('CREATE INDEX ON %I.whatsapp_messages(created_at DESC)', schema_name);

  -- -----------------------------------------------------------------------------
  -- TABLA: retention_campaigns (Campañas de retención programadas)
  -- -----------------------------------------------------------------------------
  EXECUTE format('
    CREATE TABLE %I.retention_campaigns (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      client_id UUID REFERENCES %I.clients(id) ON DELETE CASCADE,
      rule_id UUID, -- ID de la regla que generó esta campaña

      -- Estado
      status TEXT DEFAULT ''scheduled'' CHECK (status IN (''scheduled'', ''sent'', ''replied'', ''converted'', ''failed'')),

      -- Timing
      scheduled_for TIMESTAMPTZ NOT NULL,
      sent_at TIMESTAMPTZ,

      -- Contenido
      message_content TEXT, -- Mensaje generado por IA
      response_content TEXT, -- Respuesta de la clienta

      -- Conversión
      appointment_created_id UUID, -- Si convirtió, ID de la cita creada

      created_at TIMESTAMPTZ DEFAULT now(),
      updated_at TIMESTAMPTZ DEFAULT now()
    )
  ', schema_name, schema_name);

  EXECUTE format('CREATE INDEX ON %I.retention_campaigns(client_id)', schema_name);
  EXECUTE format('CREATE INDEX ON %I.retention_campaigns(status)', schema_name);
  EXECUTE format('CREATE INDEX ON %I.retention_campaigns(scheduled_for)', schema_name);
  EXECUTE format('CREATE INDEX ON %I.retention_campaigns(sent_at)', schema_name);

  -- Índice para jobs: campañas pendientes de enviar
  EXECUTE format('CREATE INDEX ON %I.retention_campaigns(scheduled_for, status) WHERE status = ''scheduled'' AND scheduled_for <= now()', schema_name);

  -- -----------------------------------------------------------------------------
  -- TABLA: invoices (Facturas)
  -- -----------------------------------------------------------------------------
  EXECUTE format('
    CREATE TABLE %I.invoices (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      invoice_number TEXT UNIQUE NOT NULL, -- FAC-2026-0001
      client_id UUID REFERENCES %I.clients(id) ON DELETE SET NULL,

      -- Fechas
      issue_date DATE NOT NULL,
      due_date DATE,

      -- Estado
      status TEXT DEFAULT ''draft'' CHECK (status IN (''draft'', ''sent'', ''paid'', ''overdue'', ''cancelled'')),

      -- Montos
      subtotal NUMERIC(10,2) NOT NULL,
      tax_rate NUMERIC(5,2) DEFAULT 21.00, -- IVA en España
      tax_amount NUMERIC(10,2),
      total NUMERIC(10,2) NOT NULL,

      -- Pago
      payment_method TEXT, -- ''cash'', ''card'', ''bizum'', ''transfer''

      -- Facturación electrónica
      facturae_xml TEXT, -- XML Facturae 3.2.2
      verifactu_sent BOOLEAN DEFAULT false, -- Enviado a AEAT VeriFactu
      verifactu_code TEXT, -- Código QR de verificación

      -- Notas
      notes TEXT,

      created_at TIMESTAMPTZ DEFAULT now(),
      updated_at TIMESTAMPTZ DEFAULT now()
    )
  ', schema_name, schema_name);

  EXECUTE format('CREATE INDEX ON %I.invoices(client_id)', schema_name);
  EXECUTE format('CREATE INDEX ON %I.invoices(invoice_number)', schema_name);
  EXECUTE format('CREATE INDEX ON %I.invoices(issue_date DESC)', schema_name);
  EXECUTE format('CREATE INDEX ON %I.invoices(status)', schema_name);

  -- -----------------------------------------------------------------------------
  -- TABLA: invoice_lines (Líneas de factura)
  -- -----------------------------------------------------------------------------
  EXECUTE format('
    CREATE TABLE %I.invoice_lines (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      invoice_id UUID REFERENCES %I.invoices(id) ON DELETE CASCADE,

      -- Detalle
      description TEXT NOT NULL,
      quantity NUMERIC(10,2) DEFAULT 1,
      unit_price NUMERIC(10,2) NOT NULL,
      total NUMERIC(10,2) NOT NULL,

      created_at TIMESTAMPTZ DEFAULT now()
    )
  ', schema_name, schema_name);

  EXECUTE format('CREATE INDEX ON %I.invoice_lines(invoice_id)', schema_name);

  -- -----------------------------------------------------------------------------
  -- TABLA: inventory_items (Productos en stock)
  -- -----------------------------------------------------------------------------
  EXECUTE format('
    CREATE TABLE %I.inventory_items (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      name TEXT NOT NULL,
      code TEXT, -- Código de barras o SKU
      supplier TEXT,

      -- Precios
      cost_price NUMERIC(10,2) NOT NULL DEFAULT 0,
      sale_price NUMERIC(10,2) NOT NULL DEFAULT 0,

      -- Stock
      current_stock NUMERIC(10,2) DEFAULT 0,
      min_stock_alert NUMERIC(10,2) DEFAULT 5, -- Alerta cuando baja de este nivel

      created_at TIMESTAMPTZ DEFAULT now(),
      updated_at TIMESTAMPTZ DEFAULT now()
    )
  ', schema_name);

  EXECUTE format('CREATE INDEX ON %I.inventory_items(current_stock)', schema_name);

  -- -----------------------------------------------------------------------------
  -- TABLA: inventory_movements (Movimientos de stock)
  -- -----------------------------------------------------------------------------
  EXECUTE format('
    CREATE TABLE %I.inventory_movements (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      item_id UUID REFERENCES %I.inventory_items(id) ON DELETE CASCADE,

      -- Tipo de movimiento
      type TEXT NOT NULL CHECK (type IN (''in'', ''out'', ''adjustment'')),

      -- Cantidad (positiva para in, negativa para out)
      quantity NUMERIC(10,2) NOT NULL,

      -- Razón
      reason TEXT,

      -- Quién lo registró
      created_by UUID, -- user_id
      created_at TIMESTAMPTZ DEFAULT now()
    )
  ', schema_name, schema_name);

  EXECUTE format('CREATE INDEX ON %I.inventory_movements(item_id)', schema_name);
  EXECUTE format('CREATE INDEX ON %I.inventory_movements(created_at DESC)', schema_name);

  -- -----------------------------------------------------------------------------
  -- HABILITAR ROW LEVEL SECURITY EN TODAS LAS TABLAS
  -- -----------------------------------------------------------------------------

  EXECUTE format('ALTER TABLE %I.salon_settings ENABLE ROW LEVEL SECURITY', schema_name);
  EXECUTE format('ALTER TABLE %I.staff ENABLE ROW LEVEL SECURITY', schema_name);
  EXECUTE format('ALTER TABLE %I.services ENABLE ROW LEVEL SECURITY', schema_name);
  EXECUTE format('ALTER TABLE %I.clients ENABLE ROW LEVEL SECURITY', schema_name);
  EXECUTE format('ALTER TABLE %I.appointments ENABLE ROW LEVEL SECURITY', schema_name);
  EXECUTE format('ALTER TABLE %I.whatsapp_messages ENABLE ROW LEVEL SECURITY', schema_name);
  EXECUTE format('ALTER TABLE %I.retention_campaigns ENABLE ROW LEVEL SECURITY', schema_name);
  EXECUTE format('ALTER TABLE %I.invoices ENABLE ROW LEVEL SECURITY', schema_name);
  EXECUTE format('ALTER TABLE %I.invoice_lines ENABLE ROW LEVEL SECURITY', schema_name);
  EXECUTE format('ALTER TABLE %I.inventory_items ENABLE ROW LEVEL SECURITY', schema_name);
  EXECUTE format('ALTER TABLE %I.inventory_movements ENABLE ROW LEVEL SECURITY', schema_name);

  -- Políticas RLS: cada usuario autenticado solo puede acceder al schema
  -- del tenant al que pertenece en public.user_profiles.
  EXECUTE format('
    CREATE POLICY tenant_isolation_policy ON %I.salon_settings
      FOR ALL TO authenticated
      USING (
        EXISTS (
          SELECT 1 FROM public.tenants t
          JOIN public.user_profiles up ON up.tenant_id = t.id
          WHERE up.id = auth.uid() AND t.schema_name = %L
        )
      )
      WITH CHECK (
        EXISTS (
          SELECT 1 FROM public.tenants t
          JOIN public.user_profiles up ON up.tenant_id = t.id
          WHERE up.id = auth.uid() AND t.schema_name = %L
        )
      )
  ', schema_name, schema_name, schema_name);

  EXECUTE format('
    CREATE POLICY tenant_isolation_policy ON %I.staff
      FOR ALL TO authenticated
      USING (EXISTS (SELECT 1 FROM public.tenants t JOIN public.user_profiles up ON up.tenant_id = t.id WHERE up.id = auth.uid() AND t.schema_name = %L))
      WITH CHECK (EXISTS (SELECT 1 FROM public.tenants t JOIN public.user_profiles up ON up.tenant_id = t.id WHERE up.id = auth.uid() AND t.schema_name = %L))
  ', schema_name, schema_name, schema_name);

  EXECUTE format('
    CREATE POLICY tenant_isolation_policy ON %I.services
      FOR ALL TO authenticated
      USING (EXISTS (SELECT 1 FROM public.tenants t JOIN public.user_profiles up ON up.tenant_id = t.id WHERE up.id = auth.uid() AND t.schema_name = %L))
      WITH CHECK (EXISTS (SELECT 1 FROM public.tenants t JOIN public.user_profiles up ON up.tenant_id = t.id WHERE up.id = auth.uid() AND t.schema_name = %L))
  ', schema_name, schema_name, schema_name);

  EXECUTE format('
    CREATE POLICY tenant_isolation_policy ON %I.clients
      FOR ALL TO authenticated
      USING (EXISTS (SELECT 1 FROM public.tenants t JOIN public.user_profiles up ON up.tenant_id = t.id WHERE up.id = auth.uid() AND t.schema_name = %L))
      WITH CHECK (EXISTS (SELECT 1 FROM public.tenants t JOIN public.user_profiles up ON up.tenant_id = t.id WHERE up.id = auth.uid() AND t.schema_name = %L))
  ', schema_name, schema_name, schema_name);

  EXECUTE format('
    CREATE POLICY tenant_isolation_policy ON %I.appointments
      FOR ALL TO authenticated
      USING (EXISTS (SELECT 1 FROM public.tenants t JOIN public.user_profiles up ON up.tenant_id = t.id WHERE up.id = auth.uid() AND t.schema_name = %L))
      WITH CHECK (EXISTS (SELECT 1 FROM public.tenants t JOIN public.user_profiles up ON up.tenant_id = t.id WHERE up.id = auth.uid() AND t.schema_name = %L))
  ', schema_name, schema_name, schema_name);

  EXECUTE format('
    CREATE POLICY tenant_isolation_policy ON %I.whatsapp_messages
      FOR ALL TO authenticated
      USING (EXISTS (SELECT 1 FROM public.tenants t JOIN public.user_profiles up ON up.tenant_id = t.id WHERE up.id = auth.uid() AND t.schema_name = %L))
      WITH CHECK (EXISTS (SELECT 1 FROM public.tenants t JOIN public.user_profiles up ON up.tenant_id = t.id WHERE up.id = auth.uid() AND t.schema_name = %L))
  ', schema_name, schema_name, schema_name);

  EXECUTE format('
    CREATE POLICY tenant_isolation_policy ON %I.retention_campaigns
      FOR ALL TO authenticated
      USING (EXISTS (SELECT 1 FROM public.tenants t JOIN public.user_profiles up ON up.tenant_id = t.id WHERE up.id = auth.uid() AND t.schema_name = %L))
      WITH CHECK (EXISTS (SELECT 1 FROM public.tenants t JOIN public.user_profiles up ON up.tenant_id = t.id WHERE up.id = auth.uid() AND t.schema_name = %L))
  ', schema_name, schema_name, schema_name);

  EXECUTE format('
    CREATE POLICY tenant_isolation_policy ON %I.invoices
      FOR ALL TO authenticated
      USING (EXISTS (SELECT 1 FROM public.tenants t JOIN public.user_profiles up ON up.tenant_id = t.id WHERE up.id = auth.uid() AND t.schema_name = %L))
      WITH CHECK (EXISTS (SELECT 1 FROM public.tenants t JOIN public.user_profiles up ON up.tenant_id = t.id WHERE up.id = auth.uid() AND t.schema_name = %L))
  ', schema_name, schema_name, schema_name);

  EXECUTE format('
    CREATE POLICY tenant_isolation_policy ON %I.invoice_lines
      FOR ALL TO authenticated
      USING (EXISTS (SELECT 1 FROM public.tenants t JOIN public.user_profiles up ON up.tenant_id = t.id WHERE up.id = auth.uid() AND t.schema_name = %L))
      WITH CHECK (EXISTS (SELECT 1 FROM public.tenants t JOIN public.user_profiles up ON up.tenant_id = t.id WHERE up.id = auth.uid() AND t.schema_name = %L))
  ', schema_name, schema_name, schema_name);

  EXECUTE format('
    CREATE POLICY tenant_isolation_policy ON %I.inventory_items
      FOR ALL TO authenticated
      USING (EXISTS (SELECT 1 FROM public.tenants t JOIN public.user_profiles up ON up.tenant_id = t.id WHERE up.id = auth.uid() AND t.schema_name = %L))
      WITH CHECK (EXISTS (SELECT 1 FROM public.tenants t JOIN public.user_profiles up ON up.tenant_id = t.id WHERE up.id = auth.uid() AND t.schema_name = %L))
  ', schema_name, schema_name, schema_name);

  EXECUTE format('
    CREATE POLICY tenant_isolation_policy ON %I.inventory_movements
      FOR ALL TO authenticated
      USING (EXISTS (SELECT 1 FROM public.tenants t JOIN public.user_profiles up ON up.tenant_id = t.id WHERE up.id = auth.uid() AND t.schema_name = %L))
      WITH CHECK (EXISTS (SELECT 1 FROM public.tenants t JOIN public.user_profiles up ON up.tenant_id = t.id WHERE up.id = auth.uid() AND t.schema_name = %L))
  ', schema_name, schema_name, schema_name);

  RAISE NOTICE 'Schema % creado exitosamente para tenant %', schema_name, tenant_id;

END;
$$ LANGUAGE plpgsql SECURITY DEFINER;


-- =============================================================================
-- TRIGGER: CREAR SCHEMA AUTOMÁTICAMENTE AL INSERTAR TENANT
-- =============================================================================

CREATE OR REPLACE FUNCTION trigger_create_tenant_schema()
RETURNS TRIGGER AS $$
BEGIN
  -- Crear schema con nombre único
  PERFORM create_tenant_schema(NEW.id, NEW.schema_name);

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_tenant_created
  AFTER INSERT ON public.tenants
  FOR EACH ROW
  EXECUTE FUNCTION trigger_create_tenant_schema();


-- =============================================================================
-- FUNCIÓN HELPER: GET TENANT SCHEMA
-- =============================================================================

CREATE OR REPLACE FUNCTION get_tenant_schema(user_id UUID)
RETURNS TEXT AS $$
DECLARE
  tenant_schema TEXT;
BEGIN
  SELECT t.schema_name INTO tenant_schema
  FROM public.tenants t
  JOIN public.user_profiles up ON up.tenant_id = t.id
  WHERE up.id = user_id
  LIMIT 1;

  RETURN tenant_schema;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;


-- =============================================================================
-- POLÍTICAS RLS PARA TABLAS GLOBALES
-- =============================================================================

-- Tenants: usuarios solo ven su propio tenant
ALTER TABLE public.tenants ENABLE ROW LEVEL SECURITY;

CREATE POLICY tenant_select_policy ON public.tenants
  FOR SELECT TO authenticated
  USING (
    id IN (
      SELECT tenant_id
      FROM public.user_profiles
      WHERE id = auth.uid()
    )
  );

-- User profiles: usuarios solo ven perfiles de su tenant
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY user_profiles_select_policy ON public.user_profiles
  FOR SELECT TO authenticated
  USING (
    tenant_id IN (
      SELECT tenant_id
      FROM public.user_profiles
      WHERE id = auth.uid()
    )
  );


-- =============================================================================
-- FUNCIONES UTILITARIAS
-- =============================================================================

-- Generar número de factura automático
CREATE OR REPLACE FUNCTION generate_invoice_number(tenant_schema TEXT)
RETURNS TEXT AS $$
DECLARE
  year TEXT;
  sequence_num INTEGER;
  invoice_num TEXT;
BEGIN
  year := EXTRACT(YEAR FROM CURRENT_DATE)::TEXT;

  -- Obtener siguiente número en secuencia
  EXECUTE format('
    SELECT COALESCE(MAX(
      CAST(SUBSTRING(invoice_number FROM ''FAC-%s-(\d+)'') AS INTEGER)
    ), 0) + 1
    FROM %I.invoices
    WHERE invoice_number LIKE ''FAC-%s-%%''
  ', year, tenant_schema, year) INTO sequence_num;

  -- Formatear como FAC-2026-0001
  invoice_num := format('FAC-%s-%s', year, LPAD(sequence_num::TEXT, 4, '0'));

  RETURN invoice_num;
END;
$$ LANGUAGE plpgsql;


-- =============================================================================
-- DATOS DE EJEMPLO (OPCIONAL - COMENTAR EN PRODUCCIÓN)
-- =============================================================================

-- Descomentar para crear un tenant de prueba:
/*
INSERT INTO public.tenants (name, slug, subdomain, schema_name, plan_type)
VALUES ('Salón de Prueba', 'salon-prueba', 'salon-prueba', 'salon_demo', 'growth');
*/


-- =============================================================================
-- FIN DEL SCHEMA
-- =============================================================================

-- Para aplicar este schema en Supabase:
-- 1. Ir a SQL Editor en el dashboard de Supabase
-- 2. Copiar y pegar este archivo completo
-- 3. Ejecutar
--
-- O desde la CLI:
-- supabase db push
