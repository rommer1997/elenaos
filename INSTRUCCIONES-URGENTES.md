# 🚨 INSTRUCCIONES URGENTES - Corrección de aislamiento de usuarios

## Problema encontrado

**Todos los usuarios comparten los mismos datos** porque no se está creando un tenant (salón) individual para cada usuario nuevo.

## Solución (5 minutos)

### PASO 1: Aplicar trigger en Supabase (2 min)

1. **Abre el SQL Editor** en tu dashboard de Supabase
   - URL: https://supabase.com/dashboard/project/TU_PROJECT_ID/sql

2. **Copia y pega este código** completo:

```sql
-- Copiar todo el contenido del archivo:
-- supabase/trigger-auto-create-tenant.sql
```

O mejor aún, abre el archivo `supabase/trigger-auto-create-tenant.sql` y copia todo su contenido.

3. **Haz clic en "Run"** (botón verde abajo a la derecha)

4. **Verifica que funcionó** ejecutando:

```sql
SELECT tgname, tgenabled
FROM pg_trigger
WHERE tgname = 'on_auth_user_created';
```

Debes ver: `on_auth_user_created | O`

### PASO 2: Corregir usuarios existentes (2 min)

Si ya tienes usuarios de prueba sin tenant:

1. **En el mismo SQL Editor**, ejecuta:

```sql
-- Copiar todo el contenido del archivo:
-- supabase/fix-existing-users.sql
```

O abre el archivo `supabase/fix-existing-users.sql` y ejecuta su contenido.

2. **Verifica que funcionó** con:

```sql
SELECT
  u.email,
  t.name AS salon_name,
  t.schema_name
FROM auth.users u
JOIN public.user_profiles up ON up.id = u.id
JOIN public.tenants t ON t.id = up.tenant_id;
```

Debes ver todos tus usuarios con su respectivo salón.

### PASO 3: Prueba en la aplicación (1 min)

1. **Abre tu aplicación** en el navegador
2. **Cierra sesión** si estás logueado
3. **Crea un nuevo usuario de prueba**:
   - Email: `prueba@ejemplo.com`
   - Nombre: "Usuario"
   - Apellido: "Prueba"
   - Salón: "Salón de Prueba"

4. **Verifica en el dashboard** que muestra "Salón de Prueba" en la sección de Tu Salón

5. **Crea otro usuario**:
   - Email: `prueba2@ejemplo.com`
   - Salón: "Otro Salón"

6. **Inicia sesión con el primer usuario** y verifica que solo ve "Salón de Prueba"
7. **Inicia sesión con el segundo usuario** y verifica que solo ve "Otro Salón"

## ✅ Confirmación de éxito

Si todo funciona correctamente:

- ✅ Cada usuario ve su propio salón
- ✅ Los datos no se mezclan entre usuarios
- ✅ Al crear un cliente en un usuario, el otro no lo ve

## ❌ Si algo falla

### Error: "Perfil de usuario no encontrado"

**Causa:** El trigger no se ejecutó o no está habilitado.

**Solución:**
1. Verifica que el trigger existe:
   ```sql
   SELECT * FROM pg_trigger WHERE tgname = 'on_auth_user_created';
   ```
2. Si no existe, vuelve al PASO 1
3. Elimina el usuario problemático y créalo de nuevo

### Error: "Salón no encontrado"

**Causa:** El tenant no se creó correctamente.

**Solución:**
1. Ejecuta el script de corrección del PASO 2
2. Si persiste, verifica manualmente:
   ```sql
   SELECT * FROM public.tenants ORDER BY created_at DESC;
   ```

### Los datos todavía se mezclan

**Causa:** Las políticas RLS no están funcionando.

**Solución:**
1. Verifica que RLS está habilitado:
   ```sql
   SELECT tablename, rowsecurity
   FROM pg_tables
   WHERE schemaname = 'public'
   AND tablename IN ('tenants', 'user_profiles');
   ```
2. Ambas deben mostrar `rowsecurity = true`
3. Si no, ejecuta:
   ```sql
   ALTER TABLE public.tenants ENABLE ROW LEVEL SECURITY;
   ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
   ```

## 📋 Verificación completa (OPCIONAL)

Si quieres hacer una verificación exhaustiva, ejecuta:

```sql
-- Copiar todo el contenido del archivo:
-- supabase/verify-setup.sql
```

Este script te mostrará un reporte completo del estado de tu configuración.

## 🔍 Debugging

Si necesitas ver qué está pasando:

1. **Ver logs de Supabase:**
   - Dashboard > Logs > Postgres Logs

2. **Ver usuarios y tenants:**
   ```sql
   SELECT
     u.email,
     u.created_at,
     up.id AS profile_id,
     up.tenant_id,
     t.name AS salon_name
   FROM auth.users u
   LEFT JOIN public.user_profiles up ON up.id = u.id
   LEFT JOIN public.tenants t ON t.id = up.tenant_id
   ORDER BY u.created_at DESC;
   ```

3. **Ver schemas creados:**
   ```sql
   SELECT schema_name
   FROM information_schema.schemata
   WHERE schema_name LIKE 'salon_%';
   ```

## 📞 Soporte

Si después de seguir estos pasos el problema persiste:

1. Toma screenshots del error
2. Ejecuta el script `verify-setup.sql` y copia el resultado
3. Contacta con el resultado

---

**Tiempo estimado total:** 5 minutos
**Nivel de dificultad:** Bajo (copiar y pegar SQL)
**Impacto:** CRÍTICO - Arregla el aislamiento de datos entre usuarios

---

## Archivos modificados

✅ Creados:
- `supabase/trigger-auto-create-tenant.sql` (trigger para auto-crear tenants)
- `supabase/fix-existing-users.sql` (corrección para usuarios existentes)
- `supabase/verify-setup.sql` (script de verificación)
- `FIX-USER-ISOLATION.md` (documentación completa)
- `INSTRUCCIONES-URGENTES.md` (este archivo)

✅ Actualizados:
- `hooks/useUser.ts` (ahora consulta tablas reales en lugar de usar metadata)
- `app/(auth)/actions.ts` (signup mejorado con metadatos completos)

❌ Sin cambios (ya estaban bien):
- `lib/supabase/client.ts`
- `lib/supabase/server.ts`
- `lib/supabase/middleware.ts`
- `middleware.ts`
- `supabase/schema.sql` (el schema ya estaba correcto, solo faltaba el trigger)

---

**AHORA MISMO:** Ve al PASO 1 y ejecuta el trigger. ¡En 2 minutos estará arreglado!
