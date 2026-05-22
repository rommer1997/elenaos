-- =====================================================
-- SCRIPT DE VERIFICACIÓN: ElenaOS Multi-tenant Setup
-- =====================================================
-- Este script verifica que todo esté correctamente
-- configurado para el sistema multi-tenant
-- =====================================================

-- 1. VERIFICAR EXTENSIONES
SELECT 'Extensiones instaladas' AS check_name;
SELECT
  extname AS extension_name,
  extversion AS version
FROM pg_extension
WHERE extname IN ('uuid-ossp', 'vector', 'pg_trgm');

-- Debe mostrar:
-- uuid-ossp
-- vector (si está instalada)
-- pg_trgm

\echo ''
\echo '=================================================='
\echo ''

-- 2. VERIFICAR TABLAS GLOBALES
SELECT 'Tablas globales' AS check_name;
SELECT
  table_name,
  (SELECT COUNT(*) FROM information_schema.columns WHERE table_schema = 'public' AND table_name = t.table_name) AS column_count
FROM information_schema.tables t
WHERE table_schema = 'public'
AND table_name IN ('tenants', 'user_profiles', 'billing_events')
ORDER BY table_name;

-- Debe mostrar:
-- tenants | 13
-- user_profiles | 7
-- billing_events | 7

\echo ''
\echo '=================================================='
\echo ''

-- 3. VERIFICAR TRIGGER DE AUTO-CREACIÓN DE TENANT
SELECT 'Triggers en auth.users' AS check_name;
SELECT
  tgname AS trigger_name,
  CASE tgenabled
    WHEN 'O' THEN 'Enabled'
    WHEN 'D' THEN 'Disabled'
    ELSE 'Unknown'
  END AS status,
  pg_get_functiondef(tgfoid) AS function_definition
FROM pg_trigger
WHERE tgname = 'on_auth_user_created';

-- Debe mostrar:
-- on_auth_user_created | Enabled | (función completa)

\echo ''
\echo '=================================================='
\echo ''

-- 4. VERIFICAR POLÍTICAS RLS
SELECT 'Políticas RLS en tablas globales' AS check_name;
SELECT
  schemaname,
  tablename,
  policyname,
  roles,
  cmd
FROM pg_policies
WHERE schemaname = 'public'
AND tablename IN ('tenants', 'user_profiles')
ORDER BY tablename, policyname;

-- Debe mostrar políticas tenant_select_policy y user_profiles_select_policy

\echo ''
\echo '=================================================='
\echo ''

-- 5. VERIFICAR USUARIOS Y TENANTS EXISTENTES
SELECT 'Usuarios registrados y sus tenants' AS check_name;
SELECT
  u.email,
  u.created_at AS user_created_at,
  up.first_name,
  up.last_name,
  up.role,
  t.name AS salon_name,
  t.schema_name,
  t.plan_type,
  t.is_active,
  -- Verificar que el schema existe
  CASE
    WHEN EXISTS (
      SELECT 1 FROM information_schema.schemata
      WHERE schema_name = t.schema_name
    ) THEN '✅ Schema existe'
    ELSE '❌ Schema NO existe'
  END AS schema_status
FROM auth.users u
LEFT JOIN public.user_profiles up ON up.id = u.id
LEFT JOIN public.tenants t ON t.id = up.tenant_id
ORDER BY u.created_at DESC;

-- Cada usuario debe tener:
-- - Un user_profile
-- - Un tenant vinculado
-- - Un schema creado

\echo ''
\echo '=================================================='
\echo ''

-- 6. VERIFICAR SCHEMAS CREADOS
SELECT 'Schemas de tenants creados' AS check_name;
SELECT
  schema_name,
  -- Contar tablas en el schema
  (
    SELECT COUNT(*)
    FROM information_schema.tables
    WHERE table_schema = s.schema_name
  ) AS table_count
FROM information_schema.schemata s
WHERE schema_name LIKE 'salon_%'
ORDER BY schema_name;

-- Cada schema debe tener 11 tablas:
-- salon_settings, staff, services, clients, appointments,
-- whatsapp_messages, retention_campaigns, invoices, invoice_lines,
-- inventory_items, inventory_movements

\echo ''
\echo '=================================================='
\echo ''

-- 7. VERIFICAR FUNCIONES RPC
SELECT 'Funciones RPC disponibles' AS check_name;
SELECT
  proname AS function_name,
  pg_get_function_arguments(oid) AS arguments
FROM pg_proc
WHERE proname IN (
  'create_tenant_schema',
  'get_tenant_schema',
  'get_salon_settings',
  'update_salon_theme',
  'get_tenant_config',
  'update_salon_logo',
  'get_my_salon_settings',
  'handle_new_user'
)
ORDER BY proname;

-- Debe mostrar todas las funciones listadas

\echo ''
\echo '=================================================='
\echo ''

-- 8. VERIFICAR USUARIOS SIN TENANT (PROBLEMA)
SELECT 'Usuarios sin tenant (REQUIERE CORRECCIÓN)' AS check_name;
SELECT
  u.id,
  u.email,
  u.created_at,
  CASE
    WHEN up.id IS NULL THEN '❌ Sin user_profile'
    WHEN up.tenant_id IS NULL THEN '❌ Sin tenant'
    ELSE '✅ OK'
  END AS status
FROM auth.users u
LEFT JOIN public.user_profiles up ON up.id = u.id
WHERE up.tenant_id IS NULL OR up.id IS NULL;

-- Si hay usuarios aquí, necesitas ejecutar el script de corrección manual
-- del archivo FIX-USER-ISOLATION.md

\echo ''
\echo '=================================================='
\echo 'VERIFICACIÓN COMPLETA'
\echo '=================================================='
\echo ''
\echo 'Revisa los resultados arriba:'
\echo '- ✅ = Configuración correcta'
\echo '- ❌ = Requiere corrección'
\echo ''
\echo 'Si hay usuarios sin tenant, sigue las instrucciones en:'
\echo 'FIX-USER-ISOLATION.md (Paso 3: Opción B)'
\echo ''
