-- =====================================================
-- RPC FUNCTIONS PARA SISTEMA DE TEMAS
-- =====================================================
-- Este archivo contiene funciones RPC que permiten leer
-- y actualizar configuración de salones en schemas dinámicos
-- =====================================================

-- Función: Obtener configuración del salón
-- Permite leer salon_settings desde el schema del tenant
CREATE OR REPLACE FUNCTION get_salon_settings(p_schema_name TEXT)
RETURNS JSON AS $$
DECLARE
  result JSON;
BEGIN
  -- Verificar que el schema existe
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.schemata
    WHERE schema_name = p_schema_name
  ) THEN
    RAISE EXCEPTION 'Schema % no existe', p_schema_name;
  END IF;

  -- Obtener configuración del salón
  EXECUTE format(
    'SELECT row_to_json(t) FROM %I.salon_settings t LIMIT 1',
    p_schema_name
  ) INTO result;

  RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Función: Actualizar colores del tema
-- Permite actualizar theme_colors en salon_settings
CREATE OR REPLACE FUNCTION update_salon_theme(
  p_schema_name TEXT,
  p_colors JSONB
)
RETURNS BOOLEAN AS $$
DECLARE
  current_settings JSONB;
  updated_colors JSONB;
BEGIN
  -- Verificar que el schema existe
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.schemata
    WHERE schema_name = p_schema_name
  ) THEN
    RAISE EXCEPTION 'Schema % no existe', p_schema_name;
  END IF;

  -- Obtener colores actuales
  EXECUTE format(
    'SELECT theme_colors FROM %I.salon_settings LIMIT 1',
    p_schema_name
  ) INTO current_settings;

  -- Mergear con los nuevos colores (mantener los no especificados)
  updated_colors := COALESCE(current_settings, '{}'::JSONB) || p_colors;

  -- Actualizar
  EXECUTE format(
    'UPDATE %I.salon_settings SET theme_colors = $1, updated_at = NOW()',
    p_schema_name
  ) USING updated_colors;

  RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Función: Obtener configuración completa del tenant
-- Útil para obtener múltiples configuraciones en una sola llamada
CREATE OR REPLACE FUNCTION get_tenant_config(p_tenant_id UUID)
RETURNS JSON AS $$
DECLARE
  tenant_schema TEXT;
  salon_config JSON;
  result JSON;
BEGIN
  -- Obtener schema_name del tenant
  SELECT schema_name INTO tenant_schema
  FROM public.tenants
  WHERE id = p_tenant_id;

  IF tenant_schema IS NULL THEN
    RAISE EXCEPTION 'Tenant % no encontrado', p_tenant_id;
  END IF;

  -- Obtener configuración del salón
  EXECUTE format(
    'SELECT row_to_json(t) FROM %I.salon_settings t LIMIT 1',
    tenant_schema
  ) INTO salon_config;

  -- Construir respuesta con info del tenant + configuración
  SELECT json_build_object(
    'tenant', row_to_json(t),
    'salon_settings', salon_config
  ) INTO result
  FROM public.tenants t
  WHERE t.id = p_tenant_id;

  RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Función: Actualizar logo del salón
CREATE OR REPLACE FUNCTION update_salon_logo(
  p_schema_name TEXT,
  p_logo_url TEXT
)
RETURNS BOOLEAN AS $$
BEGIN
  -- Verificar que el schema existe
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.schemata
    WHERE schema_name = p_schema_name
  ) THEN
    RAISE EXCEPTION 'Schema % no existe', p_schema_name;
  END IF;

  -- Actualizar logo
  EXECUTE format(
    'UPDATE %I.salon_settings SET logo_url = $1, updated_at = NOW()',
    p_schema_name
  ) USING p_logo_url;

  RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Función: Obtener todas las configuraciones del salón de forma segura
-- Solo permite acceso si el usuario pertenece a ese tenant
CREATE OR REPLACE FUNCTION get_my_salon_settings()
RETURNS JSON AS $$
DECLARE
  user_tenant_id UUID;
  tenant_schema TEXT;
  result JSON;
BEGIN
  -- Obtener tenant_id del usuario autenticado
  SELECT tenant_id INTO user_tenant_id
  FROM public.user_profiles
  WHERE user_id = auth.uid();

  IF user_tenant_id IS NULL THEN
    RAISE EXCEPTION 'Usuario no tiene tenant asociado';
  END IF;

  -- Obtener schema del tenant
  SELECT schema_name INTO tenant_schema
  FROM public.tenants
  WHERE id = user_tenant_id;

  IF tenant_schema IS NULL THEN
    RAISE EXCEPTION 'Tenant no encontrado';
  END IF;

  -- Obtener configuración
  EXECUTE format(
    'SELECT row_to_json(t) FROM %I.salon_settings t LIMIT 1',
    tenant_schema
  ) INTO result;

  RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- PERMISOS
-- =====================================================
-- Permitir ejecución de estas funciones a usuarios autenticados
GRANT EXECUTE ON FUNCTION get_salon_settings(TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION update_salon_theme(TEXT, JSONB) TO authenticated;
GRANT EXECUTE ON FUNCTION get_tenant_config(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION update_salon_logo(TEXT, TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION get_my_salon_settings() TO authenticated;

-- =====================================================
-- INSTRUCCIONES DE USO
-- =====================================================
-- 1. Ejecutar este archivo completo en el SQL Editor de Supabase
-- 2. Las funciones quedarán disponibles para llamar desde el cliente:
--
--    const { data } = await supabase.rpc('get_my_salon_settings')
--
--    const { data } = await supabase.rpc('update_salon_theme', {
--      p_schema_name: 'salon_abc123',
--      p_colors: { primary: '#9333ea', secondary: '#ec4899' }
--    })
--
-- =====================================================
