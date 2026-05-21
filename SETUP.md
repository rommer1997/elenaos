# 🚀 Setup y Testing de ElenaOS

**Actualizado:** 20 Mayo 2026 23:30  
**Estado:** ✅ Fase 0 + Tarea #4 completadas

---

## ✅ Tareas Completadas

- ✅ Tarea #1: Estructura del proyecto Next.js 14
- ✅ Tarea #2: Schema SQL multi-tenant configurado
- ✅ Tarea #3: Sistema de autenticación implementado
- ✅ Tarea #4: Layout del dashboard con sistema de temas

**Lo que funciona ahora:**
- ✅ Registro de nuevo salón con usuario admin
- ✅ Login/logout
- ✅ Creación automática de tenant + schema + user_profile
- ✅ Protección de rutas (middleware)
- ✅ Dashboard con sidebar, header y navegación completa
- ✅ Sistema de temas personalizable por tenant
- ✅ Layout responsive (mobile, tablet, desktop)

---

## 📋 Pasos para Probar ElenaOS

### 1. Configurar Variables de Entorno

```bash
# Copiar el template
cp .env.example .env.local

# Editar .env.local con tus keys
# Por ahora solo necesitas:
# NEXT_PUBLIC_SUPABASE_URL
# NEXT_PUBLIC_SUPABASE_ANON_KEY
```

**Obtener las keys:**
1. Ir a [supabase.com](https://supabase.com) y crear proyecto
2. Settings → API → Copiar URL y anon key
3. Pegar en `.env.local`

### 2. Aplicar el Schema SQL

**Paso 2.1: Schema principal**

1. En tu proyecto de Supabase, ir a **SQL Editor**
2. Abrir `supabase/schema.sql`
3. Copiar TODO el contenido (600+ líneas)
4. Pegar en el SQL Editor
5. Click en **Run** (Cmd/Ctrl + Enter)
6. Verificar que dice "Success. No rows returned"

**Paso 2.2: Funciones RPC para sistema de temas**

1. Abrir `supabase/rpc-functions.sql`
2. Copiar TODO el contenido
3. Pegar en el SQL Editor
4. Click en **Run**
5. Verificar que dice "Success"

**Verificar schema:**
```sql
-- Ver tablas creadas
SELECT tablename FROM pg_tables WHERE schemaname = 'public';
-- Deberías ver: tenants, user_profiles, billing_events
```

**Verificar funciones RPC:**
```sql
-- Ver funciones creadas
SELECT proname FROM pg_proc WHERE proname LIKE 'get_%salon%';
-- Deberías ver: get_my_salon_settings, get_salon_settings, get_tenant_config
```

### 3. Iniciar el Servidor de Desarrollo

```bash
npm run dev
```

Abrir [http://localhost:3000](http://localhost:3000)

---

## 🧪 Testing del Flujo Completo

### Test 1: Registro de Nuevo Salón

1. Ir a [http://localhost:3000](http://localhost:3000)
2. Click en "Crear mi salón gratis"
3. Completar el formulario:
   - **Nombre del salón:** "Belleza Laura" (ejemplo)
   - **Nombre:** "Laura"
   - **Apellido:** "García"
   - **Email:** "laura@test.com"
   - **Contraseña:** "password123"
   - ✅ Aceptar términos
4. Click en "Crear mi salón gratis"

**Resultado esperado:**
- ✅ Usuario creado en Supabase Auth
- ✅ Tenant creado en `public.tenants`
- ✅ Schema `salon_abc123` creado con 11 tablas
- ✅ User profile creado en `public.user_profiles` con role=admin
- ✅ Redirigido a `/dashboard`
- ✅ Dashboard muestra tu nombre, salón y plan

### Test 2: Logout y Login

1. En el dashboard, click en "Cerrar sesión"
2. **Resultado esperado:** Redirigido a `/login`
3. Login con:
   - **Email:** laura@test.com
   - **Contraseña:** password123
4. **Resultado esperado:** Redirigido a `/dashboard`

### Test 3: Protección de Rutas

1. Logout (cerrar sesión)
2. Intentar acceder a [http://localhost:3000/dashboard](http://localhost:3000/dashboard)
3. **Resultado esperado:** Redirigido automáticamente a `/login`

### Test 4: Verificar en Supabase

**Ver tenant creado:**
```sql
SELECT * FROM public.tenants;
```

**Ver user profile:**
```sql
SELECT * FROM public.user_profiles;
```

**Ver schemas creados:**
```sql
SELECT schema_name
FROM information_schema.schemata
WHERE schema_name LIKE 'salon_%';
```

**Ver tablas del tenant:**
```sql
-- Reemplazar 'salon_abc123' con tu schema_name
SELECT tablename
FROM pg_tables
WHERE schemaname = 'salon_abc123';

-- Deberías ver 11 tablas:
-- clients, appointments, staff, services, whatsapp_messages,
-- retention_campaigns, invoices, invoice_lines, inventory_items,
-- inventory_movements, salon_settings
```

---

## 🐛 Troubleshooting

### Error: "Failed to fetch"

**Problema:** Variables de entorno no configuradas  
**Solución:**
1. Verificar que `.env.local` existe
2. Verificar que las keys son correctas
3. Reiniciar servidor: `Ctrl+C` y `npm run dev`

### Error: "relation 'tenants' does not exist"

**Problema:** Schema SQL no aplicado  
**Solución:**
1. Ir a Supabase SQL Editor
2. Ejecutar `supabase/schema.sql` completo
3. Verificar que la ejecución fue exitosa

### Error: "Failed to create tenant"

**Problema:** Función `create_tenant_schema()` no existe  
**Solución:**
1. Verificar que ejecutaste TODO el schema.sql
2. Verificar que la función existe:
   ```sql
   SELECT proname FROM pg_proc WHERE proname = 'create_tenant_schema';
   ```
3. Si no existe, ejecutar schema.sql otra vez

### Registro funciona pero no crea schema

**Problema:** Trigger no configurado  
**Solución:**
```sql
-- Verificar trigger
SELECT * FROM pg_trigger WHERE tgname = 'on_tenant_created';

-- Si no existe, ejecutar esta parte del schema.sql:
CREATE TRIGGER on_tenant_created
  AFTER INSERT ON public.tenants
  FOR EACH ROW
  EXECUTE FUNCTION trigger_create_tenant_schema();
```

---

## 📂 Estructura de Archivos Creados

### Autenticación:
```
app/(auth)/
├── layout.tsx              # Layout de páginas de auth
├── login/
│   └── page.tsx            # Página de login
├── registro/
│   └── page.tsx            # Página de registro
└── actions.ts              # Server actions (login, signup, logout)
```

### Dashboard:
```
app/(dashboard)/
├── layout.tsx              # Layout protegido
└── page.tsx                # Dashboard placeholder
```

### Supabase:
```
lib/supabase/
├── client.ts               # Cliente para browser
├── server.ts               # Cliente para server
└── middleware.ts           # Cliente para middleware

supabase/
├── schema.sql              # Schema completo (600+ líneas)
└── README.md               # Guía de configuración
```

### Hooks:
```
hooks/
└── useUser.ts              # Hook para acceder a usuario autenticado
```

### Middleware:
```
middleware.ts               # Protección de rutas + refresh session
```

---

## 🎯 Próximas Tareas

### Tarea #5: Módulo de Agenda (Siguiente)
- Vista día/semana/mes
- Crear citas
- Drag & drop

### Tarea #6-7: CRM con IA
- Lista de clientas con filtros
- Ficha completa con score de riesgo
- Notas generadas con Claude

---

## 💡 Tips para Desarrollo

### Ver logs en tiempo real:

```bash
# Terminal 1: Servidor Next.js
npm run dev

# Terminal 2 (opcional): Logs de Supabase
# Si usas Supabase CLI:
supabase functions logs
```

### Resetear un tenant:

```sql
-- ⚠️ CUIDADO: Esto borra TODOS los datos del salón
DROP SCHEMA salon_abc123 CASCADE;
DELETE FROM public.tenants WHERE schema_name = 'salon_abc123';
```

### Crear tenant de prueba directamente:

```sql
INSERT INTO public.tenants (name, slug, subdomain, schema_name, plan_type)
VALUES ('Salón Demo', 'salon-demo', 'demo', 'salon_demo', 'growth');

-- Esto crea automáticamente el schema 'salon_demo' con todas las tablas
```

---

## 📊 Estadísticas Actuales

**Archivos creados:** 42  
**Líneas de código:** ~5,800  
**Tareas completadas:** 5 de 27 (19%)  
**Tiempo invertido:** ~5.5 horas

---

## 🚀 Comandos Útiles

```bash
# Desarrollo
npm run dev                  # Iniciar servidor (puerto 3000)
npm run build                # Build de producción
npm run lint                 # Linting

# Supabase (si usas CLI)
supabase start               # Iniciar Supabase local
supabase db push             # Aplicar schema
supabase db reset            # Resetear DB local
supabase gen types typescript # Generar tipos
```

---

**¿Todo funcionando?** 🎉

Si completaste los tests exitosamente, estás listo para continuar con la Tarea #5: Módulo de Agenda.

**¿Problemas?** Revisa la sección de Troubleshooting o consulta:
- `supabase/README.md` — Guía detallada de Supabase
- `.env.example` — Variables de entorno necesarias
- `docs/PROGRESO.md` — Estado del proyecto

---

**Última actualización:** 20 Mayo 2026 23:30  
**Responsable:** Claude (Powered by Rommer Volcanes)
