# 🗄️ Configuración de Supabase para ElenaOS

Este directorio contiene todo lo necesario para configurar la base de datos multi-tenant de ElenaOS.

---

## 📋 Pasos para Configurar Supabase

### 1. Crear Proyecto en Supabase

1. Ir a [supabase.com](https://supabase.com)
2. Click en "Start your project"
3. Crear organización (si no tienes una)
4. Click en "New Project"
5. Completar:
   - **Name:** ElenaOS (o tu-salon-nombre)
   - **Database Password:** Generar password seguro (guardar en 1Password/LastPass)
   - **Region:** Elegir la más cercana a tus usuarios (Europe West si España)
   - **Pricing Plan:** Free (suficiente para desarrollo)

6. Esperar ~2 minutos mientras se crea el proyecto

### 2. Obtener API Keys

Una vez creado el proyecto:

1. Ir a **Settings** (⚙️ en sidebar) → **API**
2. Copiar:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon/public key** → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **service_role key** → `SUPABASE_SERVICE_ROLE_KEY` (⚠️ SECRETO, SOLO EN SERVIDOR)

3. Añadir a `.env.local`:
```bash
NEXT_PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbG...
SUPABASE_SERVICE_ROLE_KEY=eyJhbG... # ⚠️ NO EXPONER EN CLIENTE
```

### 3. Aplicar el Schema SQL

#### Opción A: Desde el Dashboard (Recomendado)

1. En tu proyecto Supabase, ir a **SQL Editor** (en sidebar)
2. Click en **New query**
3. Copiar TODO el contenido de `supabase/schema.sql`
4. Pegar en el editor
5. Click en **Run** (o Cmd/Ctrl + Enter)
6. ✅ Verificar que dice "Success. No rows returned"

#### Opción B: Desde CLI (Avanzado)

```bash
# Instalar Supabase CLI
npm install -g supabase

# Login
supabase login

# Link al proyecto
supabase link --project-ref tu-project-ref

# Push schema
supabase db push
```

### 4. Verificar que el Schema se Aplicó

1. Ir a **Table Editor** en Supabase
2. Deberías ver estas tablas en el schema `public`:
   - ✅ `tenants`
   - ✅ `user_profiles`
   - ✅ `billing_events`

3. Ir a **Database** → **Schemas**
4. Verificar que existen las funciones:
   - ✅ `create_tenant_schema()`
   - ✅ `get_tenant_schema()`
   - ✅ `generate_invoice_number()`

### 5. Crear Tenant de Prueba (Opcional)

Para testear, puedes crear un tenant de prueba:

```sql
INSERT INTO public.tenants (name, slug, subdomain, schema_name, plan_type)
VALUES ('Salón Demo', 'salon-demo', 'demo', 'salon_demo', 'growth');
```

Esto automáticamente creará el schema `salon_demo` con todas las tablas gracias al trigger.

Verificar:
```sql
SELECT * FROM public.tenants;
```

### 6. Configurar Auth (Email + Password)

1. Ir a **Authentication** → **Providers**
2. **Email** debería estar habilitado por defecto
3. Configurar:
   - ✅ **Enable Email Confirmations:** OFF (para desarrollo, ON en producción)
   - ✅ **Enable Email Signup:** ON
   - ✅ **Secure email change:** ON (recomendado)

4. (Opcional) Personalizar **Email Templates** en **Authentication** → **Email Templates**

### 7. Configurar RLS Policies (Seguridad)

Las políticas básicas ya están en `schema.sql`, pero puedes refinarlas:

1. Ir a **Authentication** → **Policies**
2. Verificar que las tablas tienen RLS habilitado (🔒)
3. Revisar las políticas creadas

⚠️ **IMPORTANTE:** En producción, refinar las políticas RLS por rol (admin, staff, etc.)

---

## 🧪 Testing del Setup

### Test 1: Crear Usuario

```typescript
// En tu app Next.js
import { createClient } from '@/lib/supabase/client'

const supabase = createClient()

const { data, error } = await supabase.auth.signUp({
  email: 'test@salon.com',
  password: 'password123',
})

console.log({ data, error })
```

### Test 2: Crear Tenant

```typescript
const { data: tenant, error } = await supabase
  .from('tenants')
  .insert({
    name: 'Mi Salón',
    slug: 'mi-salon',
    subdomain: 'mi-salon',
    schema_name: 'salon_abc123',
    plan_type: 'starter',
  })
  .select()
  .single()

console.log({ tenant, error })
```

### Test 3: Verificar Schema Creado

```sql
-- En SQL Editor
SELECT schema_name 
FROM information_schema.schemata 
WHERE schema_name LIKE 'salon_%';
```

Deberías ver los schemas de los tenants creados.

---

## 📊 Arquitectura Multi-tenant

ElenaOS usa **schema-per-tenant** para aislamiento total:

```
Supabase PostgreSQL
│
├── public (schema global)
│   ├── tenants              # Registro de salones
│   ├── user_profiles        # Perfiles de usuarios
│   └── billing_events       # Eventos de facturación
│
├── salon_abc123 (schema del Salón 1)
│   ├── clients              # Clientas del salón
│   ├── appointments         # Citas
│   ├── staff                # Personal
│   └── ... (11 tablas más)
│
└── salon_xyz456 (schema del Salón 2)
    └── ... (completamente aislado)
```

**Ventajas:**
- ✅ **Aislamiento total** — Imposible mezclar datos entre salones
- ✅ **Performance** — Índices independientes por tenant
- ✅ **Escalabilidad** — Mover tenant a otra DB si crece mucho
- ✅ **Seguridad** — RLS + aislamiento físico

---

## 🔐 Seguridad

### Variables de Entorno

```bash
# ✅ PÚBLICO (cliente)
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...

# ⚠️ PRIVADO (solo servidor)
SUPABASE_SERVICE_ROLE_KEY=...  # NUNCA exponer en cliente
```

### Row Level Security (RLS)

Todas las tablas tienen RLS habilitado. Las políticas actuales son básicas:

```sql
-- Ejemplo de política actual (básica)
CREATE POLICY tenant_isolation_policy ON salon_abc123.clients
  FOR ALL TO authenticated
  USING (true)  -- ⚠️ Muy permisivo
  WITH CHECK (true);
```

**TODO para producción:**
```sql
-- Política refinada por rol
CREATE POLICY clients_select_policy ON salon_abc123.clients
  FOR SELECT TO authenticated
  USING (
    -- Solo si el usuario pertenece a este tenant
    EXISTS (
      SELECT 1 FROM public.user_profiles up
      WHERE up.id = auth.uid()
      AND up.tenant_id = (SELECT id FROM public.tenants WHERE schema_name = 'salon_abc123')
    )
  );
```

---

## 🚀 Edge Functions (Próximamente)

Para los cron jobs diarios (motor de retención):

```bash
# Crear Edge Function
supabase functions new daily-retention-job

# Deploy
supabase functions deploy daily-retention-job --project-ref tu-project-ref
```

Ver `/supabase/functions/` cuando implementemos Fase 3.

---

## 📝 Troubleshooting

### Error: "permission denied for schema public"

**Solución:** Ejecutar el schema.sql completo otra vez. El script tiene los `GRANT` necesarios.

### Error: "function create_tenant_schema() does not exist"

**Solución:** La función no se creó. Verificar que ejecutaste TODO el `schema.sql`, no solo partes.

### Error: "relation 'tenants' does not exist"

**Solución:** Las tablas no se crearon. Ejecutar `schema.sql` desde el principio.

### Los schemas de tenants no se crean automáticamente

**Solución:** Verificar que el trigger `on_tenant_created` existe:

```sql
SELECT * FROM pg_trigger WHERE tgname = 'on_tenant_created';
```

---

## 📚 Recursos

- [Supabase Docs](https://supabase.com/docs)
- [Supabase Auth](https://supabase.com/docs/guides/auth)
- [Row Level Security](https://supabase.com/docs/guides/auth/row-level-security)
- [Multi-tenancy Guide](https://supabase.com/docs/guides/database/multi-tenancy)
- [@supabase/ssr](https://supabase.com/docs/guides/auth/server-side/nextjs)

---

**✅ Setup completado!** Ahora puedes seguir con la Tarea #3: Sistema de autenticación.
