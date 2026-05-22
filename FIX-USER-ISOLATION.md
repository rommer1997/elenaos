# 🔧 FIX: Aislamiento de usuarios y datos

## Problema identificado

Los usuarios nuevos estaban viendo datos de otros usuarios porque:

1. ❌ No se creaba automáticamente el `tenant` (salón) al registrar un usuario
2. ❌ No se creaba el `user_profile` vinculado al tenant
3. ❌ El hook `useUser` usaba valores hardcodeados (`schema_name: 'public'`) en lugar de consultar la base de datos
4. ❌ Todos los usuarios compartían el mismo "tenant ficticio"

## Solución implementada

### 1. Trigger de base de datos (`supabase/trigger-auto-create-tenant.sql`)

Se creó un trigger que se ejecuta **automáticamente** cuando un usuario se registra en `auth.users`:

- ✅ Crea un `tenant` único para cada usuario
- ✅ Genera un `slug` y `schema_name` únicos
- ✅ Crea el `user_profile` vinculado al tenant
- ✅ El trigger `on_tenant_created` crea el schema personalizado con todas las tablas

### 2. Hook actualizado (`hooks/useUser.ts`)

El hook ahora:

- ✅ Consulta la tabla `user_profiles` para obtener el perfil real
- ✅ Consulta la tabla `tenants` para obtener el salón del usuario
- ✅ Carga el `schema_name` correcto para cada usuario
- ✅ Maneja errores si no encuentra el perfil o tenant

### 3. Signup mejorado (`app/(auth)/actions.ts`)

La función de registro ahora:

- ✅ Pasa `first_name`, `last_name` y `salon_name` al `user_metadata`
- ✅ Espera a que el trigger cree el tenant y perfil
- ✅ Redirige al onboarding después del registro

## Pasos para aplicar el fix

### Paso 1: Aplicar el trigger en Supabase

1. Ve al **SQL Editor** en tu dashboard de Supabase
2. Abre el archivo `supabase/trigger-auto-create-tenant.sql`
3. Copia todo el contenido
4. Pégalo en el SQL Editor
5. Haz clic en **Run**

### Paso 2: Verificar que el trigger se creó

Ejecuta esta consulta en el SQL Editor:

```sql
SELECT 
  tgname AS trigger_name,
  tgenabled AS is_enabled
FROM pg_trigger
WHERE tgname = 'on_auth_user_created';
```

Deberías ver:
```
trigger_name          | is_enabled
----------------------|------------
on_auth_user_created  | O
```

### Paso 3: Limpiar usuarios de prueba (OPCIONAL)

Si ya tienes usuarios de prueba que no tienen tenant/profile, puedes:

**Opción A: Eliminar usuarios de prueba**

```sql
-- Ver usuarios sin tenant
SELECT 
  u.id,
  u.email,
  up.tenant_id
FROM auth.users u
LEFT JOIN public.user_profiles up ON up.id = u.id
WHERE up.tenant_id IS NULL;

-- Eliminar usuarios sin tenant (CUIDADO: esto elimina usuarios)
DELETE FROM auth.users
WHERE id IN (
  SELECT u.id
  FROM auth.users u
  LEFT JOIN public.user_profiles up ON up.id = u.id
  WHERE up.tenant_id IS NULL
);
```

**Opción B: Crear tenant manualmente para usuarios existentes**

```sql
-- Ejecutar esta función para cada usuario existente
-- Reemplaza 'USER_ID_AQUI' con el ID del usuario
DO $$
DECLARE
  user_id UUID := 'USER_ID_AQUI'; -- CAMBIA ESTO
  user_email TEXT;
  user_meta JSONB;
  new_tenant_id UUID;
  new_slug TEXT;
  new_schema_name TEXT;
BEGIN
  -- Obtener datos del usuario
  SELECT email, raw_user_meta_data INTO user_email, user_meta
  FROM auth.users
  WHERE id = user_id;

  -- Crear tenant
  new_slug := lower(regexp_replace(
    COALESCE(user_meta->>'salon_name', 'salon') || '-' || substring(user_id::TEXT from 1 for 8),
    '[^a-z0-9]+', '-', 'g'
  ));
  
  new_schema_name := 'salon_' || substring(replace(user_id::TEXT, '-', '') from 1 for 12);

  INSERT INTO public.tenants (name, slug, subdomain, schema_name, plan_type, is_active, trial_ends_at)
  VALUES (
    COALESCE(user_meta->>'salon_name', 'Mi Salón'),
    new_slug,
    new_slug,
    new_schema_name,
    'starter',
    true,
    NOW() + INTERVAL '14 days'
  )
  RETURNING id INTO new_tenant_id;

  -- Crear user_profile
  INSERT INTO public.user_profiles (id, tenant_id, role, first_name, last_name)
  VALUES (
    user_id,
    new_tenant_id,
    'admin',
    user_meta->>'first_name',
    user_meta->>'last_name'
  );

  RAISE NOTICE 'Tenant % creado para usuario %', new_tenant_id, user_email;
END $$;
```

### Paso 4: Verificar el fix

1. **Registra un nuevo usuario**
2. Ve al SQL Editor y ejecuta:

```sql
SELECT 
  u.email,
  up.first_name,
  up.last_name,
  up.role,
  t.name AS salon_name,
  t.schema_name,
  t.plan_type
FROM auth.users u
JOIN public.user_profiles up ON up.id = u.id
JOIN public.tenants t ON t.id = up.tenant_id
ORDER BY u.created_at DESC
LIMIT 5;
```

3. Deberías ver cada usuario con su propio tenant y schema

### Paso 5: Probar en la aplicación

1. Crea dos usuarios diferentes:
   - Usuario A: `test1@ejemplo.com` con salón "Belleza Laura"
   - Usuario B: `test2@ejemplo.com` con salón "Estética María"

2. Inicia sesión con cada uno y verifica:
   - ✅ Cada usuario ve su propio nombre de salón en el dashboard
   - ✅ Los datos no se mezclan entre usuarios
   - ✅ El schema_name es diferente para cada uno

## Verificación de aislamiento RLS

Las políticas RLS (Row Level Security) garantizan que cada usuario solo puede acceder a los datos de su tenant. Para verificar:

```sql
-- Ver políticas RLS en una tabla
SELECT 
  schemaname,
  tablename,
  policyname,
  roles,
  cmd
FROM pg_policies
WHERE tablename = 'clients'
AND schemaname LIKE 'salon_%'
LIMIT 5;
```

## Próximos pasos

Una vez aplicado el fix:

1. ✅ Cada nuevo usuario que se registre tendrá su propio tenant
2. ✅ Los datos estarán completamente aislados por schema
3. ✅ Las políticas RLS evitarán accesos cruzados
4. ✅ El sistema será multi-tenant real

## Soporte

Si encuentras algún problema:

1. Revisa los logs de Supabase en el dashboard
2. Verifica que el trigger esté habilitado
3. Comprueba que las tablas `tenants` y `user_profiles` existan
4. Contacta a soporte si el problema persiste

---

**Última actualización:** 2026-05-22
**Versión:** 1.0
**Estado:** ✅ Listo para aplicar
