-- =====================================================
-- FIX: Crear tenants para usuarios existentes
-- =====================================================
-- Este script crea tenants y user_profiles para usuarios
-- que se registraron ANTES de que el trigger estuviera activo
-- =====================================================

-- PASO 1: Ver usuarios que necesitan corrección
SELECT
  u.id,
  u.email,
  u.created_at,
  u.raw_user_meta_data->>'salon_name' AS salon_name,
  u.raw_user_meta_data->>'first_name' AS first_name,
  u.raw_user_meta_data->>'last_name' AS last_name
FROM auth.users u
LEFT JOIN public.user_profiles up ON up.id = u.id
WHERE up.id IS NULL
ORDER BY u.created_at;

-- Si ves usuarios aquí, continúa con el PASO 2

\echo ''
\echo 'Usuarios encontrados sin tenant. Creando tenants...'
\echo ''

-- PASO 2: Crear tenants y profiles para cada usuario sin tenant
DO $$
DECLARE
  user_record RECORD;
  new_tenant_id UUID;
  new_slug TEXT;
  new_schema_name TEXT;
  salon_name_from_meta TEXT;
BEGIN
  -- Iterar sobre cada usuario sin user_profile
  FOR user_record IN
    SELECT
      u.id,
      u.email,
      u.raw_user_meta_data
    FROM auth.users u
    LEFT JOIN public.user_profiles up ON up.id = u.id
    WHERE up.id IS NULL
  LOOP
    -- Obtener nombre del salón desde metadata
    salon_name_from_meta := COALESCE(
      user_record.raw_user_meta_data->>'salon_name',
      'Mi Salón'
    );

    -- Generar slug único
    new_slug := lower(
      regexp_replace(
        salon_name_from_meta || '-' || substring(user_record.id::TEXT from 1 for 8),
        '[^a-z0-9]+',
        '-',
        'g'
      )
    );

    -- Generar nombre de schema único
    new_schema_name := 'salon_' || substring(replace(user_record.id::TEXT, '-', '') from 1 for 12);

    -- Crear tenant
    INSERT INTO public.tenants (
      name,
      slug,
      subdomain,
      schema_name,
      plan_type,
      is_active,
      trial_ends_at
    ) VALUES (
      salon_name_from_meta,
      new_slug,
      new_slug,
      new_schema_name,
      'starter',
      true,
      NOW() + INTERVAL '14 days'
    )
    RETURNING id INTO new_tenant_id;

    -- Crear user_profile
    INSERT INTO public.user_profiles (
      id,
      tenant_id,
      role,
      first_name,
      last_name,
      avatar_url
    ) VALUES (
      user_record.id,
      new_tenant_id,
      'admin',
      user_record.raw_user_meta_data->>'first_name',
      user_record.raw_user_meta_data->>'last_name',
      user_record.raw_user_meta_data->>'avatar_url'
    );

    RAISE NOTICE 'Tenant % creado para usuario % (%)',
      new_tenant_id, user_record.email, salon_name_from_meta;

    -- El trigger on_tenant_created se encargará de crear el schema automáticamente
  END LOOP;

  RAISE NOTICE 'Proceso completado. Todos los usuarios tienen tenant ahora.';
END $$;

\echo ''
\echo '=================================================='
\echo 'FIX COMPLETADO'
\echo '=================================================='
\echo ''

-- PASO 3: Verificar que todos los usuarios ahora tienen tenant
SELECT
  u.email,
  up.first_name,
  up.last_name,
  t.name AS salon_name,
  t.schema_name,
  CASE
    WHEN EXISTS (
      SELECT 1 FROM information_schema.schemata
      WHERE schema_name = t.schema_name
    ) THEN '✅ Schema existe'
    ELSE '❌ Schema NO existe (espera unos segundos y vuelve a consultar)'
  END AS schema_status
FROM auth.users u
JOIN public.user_profiles up ON up.id = u.id
JOIN public.tenants t ON t.id = up.tenant_id
ORDER BY u.created_at DESC;

\echo ''
\echo 'Todos los usuarios deberían tener ahora:'
\echo '- Un user_profile'
\echo '- Un tenant vinculado'
\echo '- Un schema creado (puede tardar unos segundos)'
\echo ''
\echo 'Si algún schema muestra "NO existe", espera 10 segundos'
\echo 'y ejecuta de nuevo la consulta del PASO 3.'
\echo ''
