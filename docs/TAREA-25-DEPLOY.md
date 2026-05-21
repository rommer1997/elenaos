# Tarea #25: Deploy a Producción

**Estado**: 🚧 En Progreso  
**Fecha Inicio**: 2026-05-21  
**Prioridad**: Crítica  
**Fase**: FASE 10.1 - Deploy

---

## Objetivo

Desplegar ElenaOS a producción en Vercel con todas las integraciones configuradas y funcionando.

---

## Checklist Pre-Deploy

### Código y Build

- [ ] **Build local exitoso**: `npm run build`
- [ ] **No errores TypeScript**: `npm run type-check`
- [ ] **No warnings críticos**: Revisar output del build
- [ ] **Bundle size aceptable**: First Load JS < 300KB
- [ ] **No console.log olvidados**: Buscar con grep
- [ ] **No TODOs críticos**: Revisar comentarios pendientes

### Testing

- [ ] **QA Checklist completado**: > 95% de verificaciones pasadas
- [ ] **Flujos críticos testeados**:
  - [ ] Onboarding completo (3 pasos)
  - [ ] Crear y completar cita
  - [ ] Cliente en riesgo → Campaña → Reactivación
  - [ ] Generar y descargar factura
  - [ ] Cambiar plan de suscripción
- [ ] **Lighthouse score > 90**: Performance, Accessibility, Best Practices
- [ ] **No vulnerabilidades críticas**: `npm audit`
- [ ] **Cross-browser testing**: Chrome, Firefox, Safari
- [ ] **Responsive testing**: Mobile, Tablet, Desktop
- [ ] **PWA funcional**: Instalación, offline, notificaciones
- [ ] **No errores en consola**: Navegación completa sin errors

### Configuración

- [ ] **.env.production preparado**: Todas las variables
- [ ] **API keys de producción**: Supabase, Claude, WhatsApp, Lemon Squeezy
- [ ] **URLs de webhooks actualizadas**: Con dominio de producción
- [ ] **CORS configurado**: Permitir dominio de producción
- [ ] **Rate limits configurados**: API endpoints protegidos

---

## Paso 1: Configurar Supabase (Producción)

### 1.1 Crear Proyecto

1. Ir a [supabase.com](https://supabase.com)
2. Click "New Project"
3. Nombre: `elenaos-production`
4. Región: `Europe West (Frankfurt)` — más cercana a España
5. Password de DB: Generar fuerte y guardar
6. Pricing: Free tier para empezar (escalar después)
7. Crear

**Tiempo estimado**: 5 minutos (setup del proyecto)

### 1.2 Configurar Database Schema

**Opción A: SQL Editor**

```sql
-- Ejecutar en Supabase SQL Editor

-- 1. Tabla de Tenants (Salones)
CREATE TABLE tenants (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  address TEXT,
  logo_url TEXT,
  theme_color TEXT DEFAULT 'purple',
  settings JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Tabla de Usuarios
CREATE TABLE users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT,
  role TEXT CHECK (role IN ('owner', 'staff')) DEFAULT 'staff',
  permissions JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Tabla de Clientes
CREATE TABLE clients (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  phone TEXT,
  email TEXT,
  birth_date DATE,
  photo_url TEXT,
  last_visit_date DATE,
  total_visits INTEGER DEFAULT 0,
  total_spent DECIMAL(10,2) DEFAULT 0,
  risk_level TEXT CHECK (risk_level IN ('low', 'medium', 'high', 'critical')) DEFAULT 'low',
  segment TEXT CHECK (segment IN ('vip', 'at_risk', 'new', 'inactive', 'regular')) DEFAULT 'regular',
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Tabla de Staff
CREATE TABLE staff_members (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  color TEXT DEFAULT 'purple',
  photo_url TEXT,
  specialties TEXT[],
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Tabla de Servicios
CREATE TABLE services (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  duration INTEGER NOT NULL, -- minutos
  price DECIMAL(10,2) NOT NULL,
  description TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Tabla de Citas
CREATE TABLE appointments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
  client_id UUID REFERENCES clients(id) ON DELETE CASCADE,
  staff_id UUID REFERENCES staff_members(id) ON DELETE SET NULL,
  service_id UUID REFERENCES services(id) ON DELETE SET NULL,
  date DATE NOT NULL,
  time TIME NOT NULL,
  duration INTEGER NOT NULL, -- minutos
  status TEXT CHECK (status IN ('pending', 'confirmed', 'in_progress', 'completed', 'cancelled')) DEFAULT 'pending',
  price DECIMAL(10,2),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. Tabla de Productos (Inventario)
CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  category TEXT,
  sku TEXT,
  stock INTEGER DEFAULT 0,
  min_stock INTEGER DEFAULT 10,
  purchase_price DECIMAL(10,2),
  sale_price DECIMAL(10,2),
  photo_url TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. Tabla de Movimientos de Stock
CREATE TABLE stock_movements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  type TEXT CHECK (type IN ('in', 'out')) NOT NULL,
  quantity INTEGER NOT NULL,
  reason TEXT,
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. Tabla de Facturas
CREATE TABLE invoices (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
  client_id UUID REFERENCES clients(id) ON DELETE SET NULL,
  appointment_id UUID REFERENCES appointments(id) ON DELETE SET NULL,
  number TEXT NOT NULL,
  date DATE NOT NULL,
  subtotal DECIMAL(10,2) NOT NULL,
  tax DECIMAL(10,2) DEFAULT 0,
  total DECIMAL(10,2) NOT NULL,
  status TEXT CHECK (status IN ('draft', 'sent', 'paid', 'overdue', 'cancelled')) DEFAULT 'draft',
  verifactu_hash TEXT,
  pdf_url TEXT,
  items JSONB NOT NULL, -- [{name, quantity, price, total}]
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(tenant_id, number)
);

-- 10. Tabla de Mensajes WhatsApp
CREATE TABLE whatsapp_messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
  client_id UUID REFERENCES clients(id) ON DELETE CASCADE,
  direction TEXT CHECK (direction IN ('inbound', 'outbound')) NOT NULL,
  content TEXT NOT NULL,
  status TEXT CHECK (status IN ('sent', 'delivered', 'read', 'failed')) DEFAULT 'sent',
  intent JSONB, -- {type, confidence, entities}
  whatsapp_id TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 11. Tabla de Campañas de Retención
CREATE TABLE retention_campaigns (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  segment TEXT NOT NULL,
  template TEXT NOT NULL,
  status TEXT CHECK (status IN ('draft', 'scheduled', 'sending', 'completed', 'paused')) DEFAULT 'draft',
  scheduled_at TIMESTAMPTZ,
  sent_count INTEGER DEFAULT 0,
  delivered_count INTEGER DEFAULT 0,
  response_count INTEGER DEFAULT 0,
  reactivated_count INTEGER DEFAULT 0,
  response_rate DECIMAL(5,2),
  roi DECIMAL(10,2),
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 12. Tabla de Suscripciones (Billing)
CREATE TABLE subscriptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
  lemon_squeezy_id TEXT UNIQUE,
  plan TEXT CHECK (plan IN ('starter', 'professional', 'enterprise')) NOT NULL,
  status TEXT CHECK (status IN ('active', 'paused', 'cancelled', 'expired')) NOT NULL,
  current_period_start TIMESTAMPTZ,
  current_period_end TIMESTAMPTZ,
  cancel_at TIMESTAMPTZ,
  cancelled_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices para performance
CREATE INDEX idx_clients_tenant ON clients(tenant_id);
CREATE INDEX idx_clients_phone ON clients(phone);
CREATE INDEX idx_clients_risk ON clients(tenant_id, risk_level);
CREATE INDEX idx_appointments_tenant ON appointments(tenant_id);
CREATE INDEX idx_appointments_date ON appointments(tenant_id, date);
CREATE INDEX idx_appointments_client ON appointments(client_id);
CREATE INDEX idx_invoices_tenant ON invoices(tenant_id);
CREATE INDEX idx_whatsapp_tenant_client ON whatsapp_messages(tenant_id, client_id);
```

**Opción B: Migraciones** (recomendado para tracking)

Crear archivo `supabase/migrations/20260521000000_initial_schema.sql` con el SQL de arriba.

### 1.3 Configurar Row Level Security (RLS)

**⚠️ CRÍTICO**: Habilitar RLS en todas las tablas para multi-tenancy seguro.

```sql
-- Habilitar RLS en todas las tablas
ALTER TABLE tenants ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE staff_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE stock_movements ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE whatsapp_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE retention_campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;

-- Políticas para TENANTS
CREATE POLICY "Users can view their own tenant"
  ON tenants FOR SELECT
  USING (id IN (
    SELECT tenant_id FROM users WHERE id = auth.uid()
  ));

CREATE POLICY "Users can update their own tenant"
  ON tenants FOR UPDATE
  USING (id IN (
    SELECT tenant_id FROM users WHERE id = auth.uid()
  ));

-- Políticas para USERS
CREATE POLICY "Users can view users from their tenant"
  ON users FOR SELECT
  USING (tenant_id IN (
    SELECT tenant_id FROM users WHERE id = auth.uid()
  ));

-- Políticas para CLIENTS (y todas las demás tablas)
CREATE POLICY "Users can view clients from their tenant"
  ON clients FOR SELECT
  USING (tenant_id IN (
    SELECT tenant_id FROM users WHERE id = auth.uid()
  ));

CREATE POLICY "Users can insert clients to their tenant"
  ON clients FOR INSERT
  WITH CHECK (tenant_id IN (
    SELECT tenant_id FROM users WHERE id = auth.uid()
  ));

CREATE POLICY "Users can update clients from their tenant"
  ON clients FOR UPDATE
  USING (tenant_id IN (
    SELECT tenant_id FROM users WHERE id = auth.uid()
  ));

CREATE POLICY "Users can delete clients from their tenant"
  ON clients FOR DELETE
  USING (tenant_id IN (
    SELECT tenant_id FROM users WHERE id = auth.uid()
  ));

-- Repetir políticas similares para:
-- staff_members, services, appointments, products, stock_movements,
-- invoices, whatsapp_messages, retention_campaigns, subscriptions
```

### 1.4 Configurar Storage

**Buckets necesarios**:

1. **logos**: Logos de salones
2. **photos**: Fotos de clientes y staff
3. **documents**: PDFs de facturas

**Crear buckets**:
1. Storage → New Bucket
2. Nombre: `logos` (público)
3. Repetir para `photos` (privado) y `documents` (privado)

**Políticas de Storage**:
```sql
-- Logos públicos
CREATE POLICY "Anyone can view logos"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'logos');

CREATE POLICY "Authenticated users can upload logos"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'logos' AND auth.role() = 'authenticated');

-- Photos privadas
CREATE POLICY "Users can view photos from their tenant"
  ON storage.objects FOR SELECT
  USING (
    bucket_id = 'photos' AND
    (storage.foldername(name))[1] IN (
      SELECT tenant_id::text FROM users WHERE id = auth.uid()
    )
  );
```

### 1.5 Configurar Authentication

**Providers a habilitar**:
- ✅ Email/Password (ya habilitado)
- ✅ Magic Link (opcional)
- ❌ OAuth (Google, etc) — para V2

**Settings**:
- **Site URL**: `https://app.elenaos.com`
- **Redirect URLs**: `https://app.elenaos.com/**`
- **Email Templates**: Personalizar con branding de ElenaOS

**JWT Settings**:
- JWT expiry: 3600 (1 hora)
- Refresh token rotation: ✅ Enabled

### 1.6 Obtener Keys

**Project Settings → API**:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGc... # ⚠️ NUNCA exponer en cliente
```

Guardar en `.env.production`

---

## Paso 2: Configurar WhatsApp Business API

### 2.1 Obtener Acceso

**Requisitos**:
- Cuenta de Facebook Business
- Número de teléfono verificado
- App de Meta creada

**Pasos**:
1. [Meta for Developers](https://developers.facebook.com)
2. Crear App → Tipo: Business
3. Agregar producto: WhatsApp
4. WhatsApp → Getting Started
5. Seleccionar/crear número de teléfono
6. Verificar número con código SMS

### 2.2 Obtener Credenciales

**Phone Number ID**:
```
WhatsApp → API Setup → Phone Number ID
Copiar: 123456789012345
```

**Access Token** (temporal):
```
WhatsApp → API Setup → Temporary Access Token
Copiar: EAAxxxxx...
```

**⚠️ Para producción**: Generar System User Token permanente
1. Business Settings → System Users
2. Crear usuario: `elenaos-production`
3. Asignar a la app
4. Generate Token con permisos: `whatsapp_business_messaging`

### 2.3 Configurar Webhook

**URL del Webhook**:
```
https://app.elenaos.com/api/whatsapp/webhook
```

**Pasos**:
1. WhatsApp → Configuration → Webhook
2. Callback URL: `https://app.elenaos.com/api/whatsapp/webhook`
3. Verify Token: Generar uno fuerte (ej: `whatsapp_elenaos_2026_secure_token`)
4. Subscribe to: `messages`
5. Verify and Save

**Variables de entorno**:
```bash
WHATSAPP_PHONE_NUMBER_ID=123456789012345
WHATSAPP_ACCESS_TOKEN=EAAxxxxx...
WHATSAPP_WEBHOOK_VERIFY_TOKEN=whatsapp_elenaos_2026_secure_token
```

### 2.4 Testear Webhook

**Enviar mensaje de prueba**:
```bash
curl -X POST "https://graph.facebook.com/v17.0/PHONE_NUMBER_ID/messages" \
  -H "Authorization: Bearer ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "messaging_product": "whatsapp",
    "to": "34600000001",
    "type": "text",
    "text": {
      "body": "Hola desde ElenaOS 👋"
    }
  }'
```

**Verificar**:
- Mensaje recibido en WhatsApp
- Respuesta registrada en logs de Vercel
- Webhook handler procesa correctamente

---

## Paso 3: Configurar Anthropic Claude API

### 3.1 Crear Cuenta

1. [console.anthropic.com](https://console.anthropic.com)
2. Registrarse/Login
3. Verificar email

### 3.2 Obtener API Key

1. Settings → API Keys
2. Create Key
3. Nombre: `elenaos-production`
4. Copiar key (solo se muestra una vez)

```bash
ANTHROPIC_API_KEY=sk-ant-xxxxx...
```

### 3.3 Configurar Límites

**Pricing**: Pay-as-you-go

**Modelos a usar**:
- `claude-3-5-sonnet-20241022` — Predicción de riesgo, NLP, generación de mensajes
- `claude-3-haiku-20240307` — Tareas simples (si necesitas optimizar costo)

**Configurar rate limits** (opcional):
- Máx requests/min: 50
- Máx tokens/mes: 1M (ajustar según tráfico esperado)

### 3.4 Testear API

```bash
curl https://api.anthropic.com/v1/messages \
  -H "x-api-key: $ANTHROPIC_API_KEY" \
  -H "anthropic-version: 2023-06-01" \
  -H "content-type: application/json" \
  -d '{
    "model": "claude-3-5-sonnet-20241022",
    "max_tokens": 1024,
    "messages": [{
      "role": "user",
      "content": "Hola, ¿estás funcionando?"
    }]
  }'
```

---

## Paso 4: Configurar Lemon Squeezy

### 4.1 Crear Cuenta

1. [lemonsqueezy.com](https://lemonsqueezy.com)
2. Crear cuenta de vendedor
3. Completar perfil y verificación

### 4.2 Crear Store

1. Dashboard → Stores → New Store
2. Nombre: `ElenaOS`
3. URL: `elenaos`
4. Currency: EUR
5. Save

### 4.3 Crear Productos (3 Planes)

**Plan 1: Starter**
- Nombre: `ElenaOS Starter`
- Tipo: Subscription
- Precio: €29/mes o €290/año
- Descripción: Plan básico para 1 salón
- Features:
  - 1 salón
  - 50 clientas
  - Agenda básica
  - CRM básico
  - Soporte email

**Plan 2: Professional** ⭐
- Nombre: `ElenaOS Professional`
- Tipo: Subscription
- Precio: €79/mes o €790/año
- Descripción: Plan completo con IA
- Features:
  - Multi-salón
  - Clientas ilimitadas
  - Motor de retención IA
  - Agente de reservas IA
  - WhatsApp automático
  - Facturación fiscal
  - Inventario
  - Soporte prioritario

**Plan 3: Enterprise**
- Nombre: `ElenaOS Enterprise`
- Tipo: Subscription
- Precio: €199/mes o €1,990/año
- Descripción: White-label con todo
- Features:
  - Todo de Professional
  - White-label (marca propia)
  - API access
  - Onboarding dedicado
  - Soporte 24/7
  - Llamadas mensuales

### 4.4 Obtener API Key

1. Settings → API
2. Create API Key
3. Nombre: `elenaos-production`
4. Copiar key

```bash
LEMON_SQUEEZY_API_KEY=xxxxx...
LEMON_SQUEEZY_STORE_ID=12345
```

### 4.5 Obtener Variant IDs

Cada plan tiene un `variant_id` que necesitas para el checkout.

1. Products → ElenaOS Starter → Copy Variant ID
2. Repetir para Professional y Enterprise

```bash
NEXT_PUBLIC_LEMON_SQUEEZY_STARTER_VARIANT_ID=123456
NEXT_PUBLIC_LEMON_SQUEEZY_PROFESSIONAL_VARIANT_ID=123457
NEXT_PUBLIC_LEMON_SQUEEZY_ENTERPRISE_VARIANT_ID=123458
```

### 4.6 Configurar Webhook

1. Settings → Webhooks → New Webhook
2. URL: `https://app.elenaos.com/api/billing/webhook`
3. Eventos a suscribir:
   - subscription_created
   - subscription_updated
   - subscription_cancelled
   - subscription_resumed
   - subscription_expired
   - subscription_paused
   - subscription_unpaused
   - subscription_payment_success
   - subscription_payment_failed
   - subscription_payment_recovered
4. Signing Secret: Copiar (para verificar signatures)

```bash
LEMON_SQUEEZY_WEBHOOK_SECRET=xxxxx...
```

### 4.7 Activar Test Mode

Para testing previo a lanzamiento:
1. Settings → Test Mode → Enable
2. Usar Variant IDs de test
3. Tarjetas de prueba: 4242 4242 4242 4242

⚠️ **Desactivar Test Mode antes de lanzamiento público**

---

## Paso 5: Configurar Resend (Emails)

### 5.1 Crear Cuenta

1. [resend.com](https://resend.com)
2. Crear cuenta
3. Verificar email

### 5.2 Verificar Dominio

**Opción A: Usar dominio propio** (recomendado)

1. Domains → Add Domain
2. Dominio: `app.elenaos.com`
3. Copiar registros DNS:
   ```
   TXT: resend._domainkey.app.elenaos.com
   CNAME: bounce.app.elenaos.com
   ```
4. Añadir a tu proveedor de DNS (Cloudflare, Namecheap, etc)
5. Verify Domain

**Opción B: Usar dominio compartido de Resend** (para empezar)

Usar `onboarding.resend.dev` (limitado a 100 emails/día)

### 5.3 Obtener API Key

1. API Keys → Create
2. Nombre: `elenaos-production`
3. Permissions: Send emails
4. Copiar key

```bash
RESEND_API_KEY=re_xxxxx...
```

### 5.4 Crear Templates de Email

**Welcome Email**:
```typescript
// lib/email/templates/welcome.ts
export const welcomeEmail = (name: string) => ({
  from: 'ElenaOS <hola@app.elenaos.com>',
  subject: '¡Bienvenida a ElenaOS! 💅',
  html: `
    <h1>¡Hola ${name}!</h1>
    <p>Estamos emocionados de tenerte en ElenaOS.</p>
    <p>Tu salón ahora tiene superpoderes de IA 🚀</p>
    <a href="https://app.elenaos.com/dashboard">Ir al Dashboard</a>
  `
})
```

**Invoice Email**, **Password Reset**, etc.

---

## Paso 6: Deploy a Vercel

### 6.1 Instalar Vercel CLI

```bash
npm install -g vercel
```

### 6.2 Login

```bash
vercel login
```

### 6.3 Link Project

```bash
cd /Users/rom/Desktop/POWERED\ BY\ ROMMER\ VOLCANES/elenaos
vercel link
```

Seleccionar:
- Scope: Tu cuenta/team
- Link to existing project: No (nuevo)
- Project name: `elenaos`
- Directory: `./`

### 6.4 Configurar Variables de Entorno

**Opción A: CLI**

```bash
# Supabase
vercel env add NEXT_PUBLIC_SUPABASE_URL production
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY production
vercel env add SUPABASE_SERVICE_ROLE_KEY production

# WhatsApp
vercel env add WHATSAPP_PHONE_NUMBER_ID production
vercel env add WHATSAPP_ACCESS_TOKEN production
vercel env add WHATSAPP_WEBHOOK_VERIFY_TOKEN production

# Claude
vercel env add ANTHROPIC_API_KEY production

# Lemon Squeezy
vercel env add LEMON_SQUEEZY_API_KEY production
vercel env add LEMON_SQUEEZY_STORE_ID production
vercel env add LEMON_SQUEEZY_WEBHOOK_SECRET production
vercel env add NEXT_PUBLIC_LEMON_SQUEEZY_STARTER_VARIANT_ID production
vercel env add NEXT_PUBLIC_LEMON_SQUEEZY_PROFESSIONAL_VARIANT_ID production
vercel env add NEXT_PUBLIC_LEMON_SQUEEZY_ENTERPRISE_VARIANT_ID production

# Resend
vercel env add RESEND_API_KEY production

# App
vercel env add NEXT_PUBLIC_APP_URL production
# Valor: https://app.elenaos.com
```

**Opción B: Dashboard** (más visual)

1. vercel.com → Tu proyecto
2. Settings → Environment Variables
3. Añadir cada variable

### 6.5 Deploy a Production

```bash
vercel --prod
```

**Output esperado**:
```
🔍 Inspect: https://vercel.com/tu-usuario/elenaos/xxxxx
✅ Production: https://elenaos.vercel.app
```

### 6.6 Verificar Deploy

**Checklist post-deploy**:
- [ ] App carga sin errores: https://elenaos.vercel.app
- [ ] Login funciona
- [ ] Registro funciona
- [ ] Onboarding completo
- [ ] Dashboard muestra datos mock correctamente
- [ ] Navegación entre páginas funciona
- [ ] PWA se puede instalar
- [ ] No errores en consola del browser
- [ ] No errores en logs de Vercel

**Revisar logs**:
```bash
vercel logs
```

O en dashboard: Deployments → Latest → Logs

---

## Paso 7: Configurar Dominio Custom

### 7.1 Comprar Dominio (si no tienes)

Proveedores recomendados:
- [Namecheap](https://namecheap.com)
- [Cloudflare Registrar](https://cloudflare.com)

Comprar: `elenaos.com`

### 7.2 Añadir Dominio en Vercel

1. Project Settings → Domains
2. Add Domain
3. Dominio: `app.elenaos.com`
4. Add

### 7.3 Configurar DNS

Vercel te dará registros para añadir:

**Opción A: CNAME** (recomendado)
```
Type: CNAME
Name: app
Value: cname.vercel-dns.com
```

**Opción B: A Record**
```
Type: A
Name: app
Value: 76.76.21.21
```

Añadir en tu proveedor de DNS (Namecheap, Cloudflare, etc).

### 7.4 Esperar Propagación

- Tiempo: 5 minutos a 48 horas (usualmente < 1 hora)
- Verificar: `nslookup app.elenaos.com`

### 7.5 SSL Automático

Vercel genera certificado SSL automáticamente (Let's Encrypt).

Verificar: https://app.elenaos.com (debe mostrar candado verde)

### 7.6 Actualizar URLs

**Actualizar en**:
- Variables de entorno: `NEXT_PUBLIC_APP_URL=https://app.elenaos.com`
- Supabase Site URL: `https://app.elenaos.com`
- WhatsApp Webhook: `https://app.elenaos.com/api/whatsapp/webhook`
- Lemon Squeezy Webhook: `https://app.elenaos.com/api/billing/webhook`

Re-deploy:
```bash
vercel --prod
```

---

## Paso 8: Smoke Testing en Producción

### 8.1 Flujo de Onboarding

1. Ir a https://app.elenaos.com
2. Click "Registrarse"
3. Email: `test-prod@elenaos.com`
4. Password: `TestProd2026!`
5. Confirmar email en bandeja
6. Completar onboarding:
   - Paso 1: Salón Test Producción
   - Paso 2: Añadir staff + servicios
   - Paso 3: Empezar desde cero
7. Ver celebración con confetti
8. Llegar a dashboard

**Verificar**:
- [ ] Registro exitoso
- [ ] Email de confirmación recibido
- [ ] Onboarding se completa sin errores
- [ ] Datos se guardan en Supabase
- [ ] Dashboard carga correctamente

### 8.2 Flujo de Cita

1. Login con usuario de test
2. Ir a Agenda
3. Crear nueva cita:
   - Cliente: María Test
   - Servicio: Corte de Pelo
   - Fecha: Mañana
   - Hora: 10:00
   - Staff: Seleccionar
4. Guardar
5. Ver cita en calendario

**Verificar**:
- [ ] Modal abre correctamente
- [ ] Formulario valida
- [ ] Cita se guarda en DB
- [ ] Cita aparece en calendario
- [ ] No errores en consola

### 8.3 Flujo de Facturación

1. Completar cita de test
2. Click "Generar Factura"
3. Verificar datos prellenados
4. Preview PDF
5. Descargar

**Verificar**:
- [ ] Modal de factura abre
- [ ] Cálculos correctos
- [ ] VeriFactu hash generado
- [ ] PDF descarga
- [ ] Factura en lista

### 8.4 Flujo de Billing

1. Ir a Billing
2. Click "Seleccionar Plan" en Professional
3. Redirige a Lemon Squeezy checkout
4. ⚠️ **NO completar compra real** (usar test mode)

**Verificar**:
- [ ] Checkout URL válida
- [ ] Lemon Squeezy carga
- [ ] Plan correcto mostrado
- [ ] Precio correcto

### 8.5 Webhooks

**WhatsApp**:
1. Enviar mensaje de prueba a número de WhatsApp
2. Verificar que webhook recibe en logs de Vercel
3. Verificar que agente IA responde

**Lemon Squeezy**:
1. Simular evento desde dashboard de Lemon Squeezy
2. Verificar que webhook procesa en logs

**Verificar**:
- [ ] Webhooks reciben requests
- [ ] Signatures válidas
- [ ] Eventos procesan correctamente
- [ ] No errores 500

---

## Paso 9: Monitoreo y Observabilidad

### 9.1 Vercel Analytics

Vercel Analytics ya está incluido en proyectos de Vercel.

**Activar**:
1. Project → Analytics
2. Enable

**Métricas disponibles**:
- Page views
- Unique visitors
- Top pages
- Devices
- Locations

### 9.2 Vercel Logs

**Ver logs en tiempo real**:
```bash
vercel logs --follow
```

**Filtrar por función**:
```bash
vercel logs --follow api/whatsapp/webhook
```

### 9.3 Sentry (Error Tracking) - Opcional

**Si quieres tracking avanzado**:

1. [sentry.io](https://sentry.io)
2. Crear proyecto: `elenaos`
3. Obtener DSN
4. Instalar SDK:
```bash
npm install @sentry/nextjs
npx @sentry/wizard@latest -i nextjs
```
5. Configurar DSN en `.env.production`

### 9.4 Supabase Logs

Dashboard de Supabase → Logs

**Ver**:
- API requests
- Database queries lentas
- Errors
- Auth events

### 9.5 Configurar Alertas

**Vercel**:
- Project Settings → Notifications
- Activar: Deployment failed, Error rate spike

**Supabase**:
- Project Settings → Notifications
- Activar: Database CPU > 80%, Storage > 80%

---

## Paso 10: Documentar y Handoff

### 10.1 Crear Documento de Producción

Archivo: `docs/PRODUCTION.md`

**Contenido**:
- URLs de producción
- Credenciales (vault seguro, no en git)
- Contactos de soporte de cada servicio
- Runbook de incidentes comunes
- Proceso de rollback
- Backup strategy

### 10.2 Credenciales en Vault Seguro

**Usar**:
- 1Password
- Bitwarden
- LastPass

**Guardar**:
- Todas las API keys
- Passwords de servicios
- Service role key de Supabase
- Acceso a dashboards

⚠️ **NUNCA commitear credenciales a git**

### 10.3 Plan de Rollback

**Si algo falla en producción**:

```bash
# Ver deployments anteriores
vercel ls

# Rollback a deployment previo
vercel rollback [deployment-url]
```

O en dashboard: Deployments → Deployment anterior → ... → Promote to Production

### 10.4 Backup de Base de Datos

**Supabase automático**:
- Backups diarios incluidos en todos los planes
- Retención: 7 días (Free), 30 días (Pro)

**Backup manual**:
```bash
# Exportar schema
pg_dump -h db.xxxxx.supabase.co -U postgres -s > schema.sql

# Exportar datos
pg_dump -h db.xxxxx.supabase.co -U postgres -a > data.sql
```

Programar backups semanales con cron.

---

## Criterios de Aceptación

- [ ] **Supabase configurado**: DB schema, RLS, Storage, Auth
- [ ] **WhatsApp API configurado**: Webhook funcional, mensajes se envían/reciben
- [ ] **Claude API configurada**: Requests funcionan, rate limits configurados
- [ ] **Lemon Squeezy configurado**: 3 planes creados, webhook funcional
- [ ] **Resend configurado**: Dominio verificado, emails se envían
- [ ] **Vercel deploy exitoso**: App en https://app.elenaos.com
- [ ] **SSL activo**: HTTPS con candado verde
- [ ] **Webhooks funcionando**: WhatsApp y Lemon Squeezy procesan eventos
- [ ] **Smoke tests pasados**: Onboarding, citas, facturas funcionan
- [ ] **No errores críticos**: Logs limpios, no 500s
- [ ] **Performance aceptable**: Lighthouse > 85 en producción
- [ ] **Monitoreo activo**: Analytics y logs configurados
- [ ] **Documentación de producción**: Credenciales seguras, runbook creado
- [ ] **Plan de rollback documentado**: Proceso claro de reversión

---

## Estimación de Tiempo

- Paso 1 (Supabase): 2 horas
- Paso 2 (WhatsApp): 1 hora
- Paso 3 (Claude): 30 minutos
- Paso 4 (Lemon Squeezy): 1.5 horas
- Paso 5 (Resend): 30 minutos
- Paso 6 (Vercel Deploy): 1 hora
- Paso 7 (Dominio): 1 hora (+ espera DNS)
- Paso 8 (Smoke Testing): 1 hora
- Paso 9 (Monitoreo): 30 minutos
- Paso 10 (Documentación): 30 minutos

**Total**: ~9 horas de trabajo + espera de propagación DNS

---

## Riesgos y Mitigaciones

| Riesgo | Probabilidad | Impacto | Mitigación |
|--------|--------------|---------|------------|
| DNS no propaga | Media | Alto | Usar dominio de Vercel temporalmente |
| Webhooks no funcionan | Media | Alto | Testear con ngrok localmente primero |
| Rate limits de APIs | Baja | Medio | Configurar límites conservadores |
| Build falla en Vercel | Baja | Alto | Testear build local antes de deploy |
| Credenciales expuestas | Baja | Crítico | Usar variables de entorno, revisar .gitignore |
| RLS mal configurado | Media | Crítico | Testear con múltiples usuarios/tenants |

---

## Próximos Pasos Después del Deploy

1. **Tarea #26**: Piloto con 3-5 salones beta
2. Monitorear performance y errores primeros 7 días
3. Recoger feedback de usuarios piloto
4. Iterar según aprendizajes
5. Marketing y lanzamiento público

---

**Estado**: 🚧 Listo para comenzar deploy
