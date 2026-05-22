-- =====================================================
-- TRIGGER: Crear tenant y user_profile automáticamente
-- =====================================================
-- Este trigger se ejecuta DESPUÉS de que un usuario
-- se registre en auth.users y crea:
-- 1. Un nuevo tenant (salón)
-- 2. El perfil de usuario vinculado al tenant
-- 3. El schema personalizado del tenant
-- =====================================================

-- Función que se ejecuta cuando se crea un nuevo usuario
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  new_tenant_id UUID;
  new_slug TEXT;
  new_schema_name TEXT;
  salon_name_from_meta TEXT;
BEGIN
  -- Obtener nombre del salón desde metadata (o usar default)
  salon_name_from_meta := COALESCE(
    NEW.raw_user_meta_data->>'salon_name',
    'Mi Salón'
  );

  -- Generar slug único (nombre del salón en formato URL-safe)
  new_slug := lower(
    regexp_replace(
      salon_name_from_meta || '-' || substring(NEW.id::TEXT from 1 for 8),
      '[^a-z0-9]+',
      '-',
      'g'
    )
  );

  -- Generar nombre único para el schema (salon_xxxxx)
  new_schema_name := 'salon_' || substring(replace(NEW.id::TEXT, '-', '') from 1 for 12);

  -- 1. CREAR TENANT
  INSERT INTO public.tenants (
    id,
    name,
    slug,
    subdomain,
    schema_name,
    plan_type,
    is_active,
    trial_ends_at
  ) VALUES (
    uuid_generate_v4(),
    salon_name_from_meta,
    new_slug,
    new_slug, -- subdomain igual al slug
    new_schema_name,
    'starter',
    true,
    NOW() + INTERVAL '14 days' -- 14 días de trial
  )
  RETURNING id INTO new_tenant_id;

  -- 2. CREAR USER PROFILE
  INSERT INTO public.user_profiles (
    id,
    tenant_id,
    role,
    first_name,
    last_name,
    avatar_url
  ) VALUES (
    NEW.id, -- Mismo ID que auth.users
    new_tenant_id,
    'admin', -- El primer usuario es admin
    NEW.raw_user_meta_data->>'first_name',
    NEW.raw_user_meta_data->>'last_name',
    NEW.raw_user_meta_data->>'avatar_url'
  );

  -- 3. El trigger on_tenant_created se encargará de crear el schema automáticamente

  RAISE NOTICE 'Tenant % creado para usuario %', new_tenant_id, NEW.email;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Eliminar trigger si existe (para re-ejecutar este script)
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Crear trigger en auth.users
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION handle_new_user();

-- =====================================================
-- INSTRUCCIONES DE APLICACIÓN
-- =====================================================
-- 1. Ir al SQL Editor en Supabase Dashboard
-- 2. Copiar y pegar este archivo completo
-- 3. Ejecutar
--
-- Este trigger se ejecutará automáticamente cada vez
-- que un usuario se registre, creando su tenant y perfil
-- de forma transparente.
-- =====================================================
