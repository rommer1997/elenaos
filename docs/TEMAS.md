# 🎨 Sistema de Temas de ElenaOS

**Actualizado:** 20 Mayo 2026  
**Estado:** ✅ Implementado (Tarea #4)

---

## 📋 Resumen

ElenaOS incluye un sistema de temas personalizado que permite a cada salón configurar sus propios colores de marca. El sistema:

- ✅ Lee la configuración desde la base de datos (`salon_settings`)
- ✅ Aplica CSS variables dinámicamente
- ✅ Se carga automáticamente al entrar al dashboard
- ✅ Es multi-tenant (cada salón tiene su propio tema)
- ✅ Tiene valores por defecto (gradiente púrpura-rosa)

---

## 🎨 Colores por Defecto

```css
--color-primary: #9333ea     /* purple-600 */
--color-secondary: #ec4899   /* pink-600 */
--color-accent: #8b5cf6      /* violet-600 */
--color-background: #ffffff
--color-text: #111827        /* gray-900 */
```

Estos colores se aplican si el salón no ha personalizado su tema.

---

## 🏗️ Arquitectura

### 1. Base de Datos

Cada tenant tiene una tabla `salon_settings` con la columna `theme_colors` de tipo JSONB:

```sql
{
  "primary": "#9333ea",
  "secondary": "#ec4899",
  "accent": "#8b5cf6",
  "background": "#ffffff",
  "text": "#111827"
}
```

### 2. Funciones RPC en Supabase

**Archivo:** `supabase/rpc-functions.sql`

Funciones disponibles:

- `get_my_salon_settings()` - Obtiene settings del salón del usuario autenticado
- `update_salon_theme(schema_name, colors)` - Actualiza colores del tema
- `get_tenant_config(tenant_id)` - Obtiene configuración completa del tenant
- `update_salon_logo(schema_name, logo_url)` - Actualiza logo del salón

**IMPORTANTE:** Estas funciones deben ejecutarse en Supabase SQL Editor antes de usar el sistema de temas.

### 3. Librería de Temas

**Archivo:** `lib/theme/apply.ts`

**Funciones principales:**

```typescript
// Obtener tema del salón del usuario autenticado
getSalonTheme(): Promise<SalonTheme | null>

// Aplicar tema (CSS variables) al documento
applyTheme(theme: SalonTheme | null): void

// Hook para cargar tema automáticamente
useLoadSalonTheme(): void

// Actualizar tema del salón
updateSalonTheme(colors: Partial<ThemeColors>): Promise<{success: boolean}>
```

### 4. Integración en el Layout

**Archivo:** `app/(dashboard)/layout.tsx`

El layout del dashboard carga el tema automáticamente:

```typescript
useEffect(() => {
  if (user) {
    useLoadSalonTheme()
  }
}, [user])
```

---

## 🚀 Cómo Usar

### Para Desarrolladores

**Usar colores del tema en componentes:**

```typescript
// En Tailwind (usando valores por defecto)
<div className="bg-purple-600 text-white">

// Con CSS variables (se adapta al tema del salón)
<div style={{ backgroundColor: 'var(--color-primary)' }}>

// En styled-components o CSS modules
.button {
  background: var(--color-primary);
  color: var(--color-background);
}
```

**Usar con opacidad:**

```css
/* Usando versión RGB */
.overlay {
  background: rgba(var(--color-primary-rgb), 0.1);
}
```

### Para Usuarios (Próximamente en Configuración)

En la sección de Configuración → Apariencia (Tarea #14), los usuarios podrán:

1. Elegir colores de marca con color pickers
2. Ver preview en tiempo real
3. Subir logo personalizado
4. Guardar y aplicar cambios

---

## 🔧 Setup Inicial

### 1. Ejecutar funciones RPC

```bash
# En Supabase SQL Editor, ejecutar:
supabase/rpc-functions.sql
```

### 2. Verificar que funciona

```sql
-- Llamar a la función de prueba
SELECT get_my_salon_settings();

-- Debería devolver la configuración del salón
-- o NULL si no hay configuración todavía
```

### 3. Inicializar configuración de un salón

```sql
-- Reemplazar 'salon_abc123' con el schema_name real
INSERT INTO salon_abc123.salon_settings (
  business_name,
  theme_colors,
  created_at,
  updated_at
) VALUES (
  'Mi Salón de Belleza',
  '{"primary": "#9333ea", "secondary": "#ec4899", "accent": "#8b5cf6", "background": "#ffffff", "text": "#111827"}'::jsonb,
  NOW(),
  NOW()
);
```

---

## 🎨 Personalización Avanzada

### Cambiar colores programáticamente

```typescript
import { updateSalonTheme } from '@/lib/theme/apply'

// Cambiar solo el color primario
const result = await updateSalonTheme({
  primary: '#ff6b6b'  // Rojo coral
})

if (result.success) {
  console.log('Tema actualizado!')
} else {
  console.error('Error:', result.error)
}
```

### Aplicar tema manualmente

```typescript
import { applyTheme } from '@/lib/theme/apply'

const customTheme = {
  colors: {
    primary: '#ff6b6b',
    secondary: '#4ecdc4',
    accent: '#45b7d1',
    background: '#f7fff7',
    text: '#1a535c'
  },
  logo_url: 'https://...',
  brand_name: 'Mi Salón'
}

applyTheme(customTheme)
```

---

## 🐛 Troubleshooting

### El tema no se aplica

**Problema:** CSS variables siguen siendo las por defecto

**Soluciones:**

1. Verificar que las funciones RPC están creadas:
   ```sql
   SELECT proname FROM pg_proc WHERE proname = 'get_my_salon_settings';
   ```

2. Verificar que existe configuración en `salon_settings`:
   ```sql
   SELECT * FROM salon_abc123.salon_settings;
   ```

3. Verificar que el usuario está autenticado y tiene tenant asociado:
   ```sql
   SELECT * FROM public.user_profiles WHERE user_id = 'tu-user-id';
   ```

4. Ver errores en consola del navegador (F12 → Console)

### La función RPC no existe

**Error:** `function get_my_salon_settings() does not exist`

**Solución:** Ejecutar `supabase/rpc-functions.sql` en el SQL Editor de Supabase

### No tengo permisos para ejecutar la función

**Error:** `permission denied for function get_my_salon_settings`

**Solución:** Verificar que el GRANT está aplicado:
```sql
GRANT EXECUTE ON FUNCTION get_my_salon_settings() TO authenticated;
```

---

## 📝 Próximos Pasos

### Tarea #14: Editor de Apariencia

En esta tarea (Fase 5.2) se creará la interfaz para que los usuarios personalicen:

- ✅ Colores de marca (color pickers)
- ✅ Logo del salón (upload de imagen)
- ✅ Preview en tiempo real
- ✅ Reset a valores por defecto

**Componentes a crear:**

- `app/(dashboard)/configuracion/apariencia/page.tsx` - Página principal
- `components/settings/ColorPicker.tsx` - Selector de colores
- `components/settings/LogoUpload.tsx` - Upload de logo
- `components/settings/ThemePreview.tsx` - Vista previa del tema

---

## 🎯 Ejemplos de Uso

### Ejemplo 1: Botón con color primario

```tsx
function PrimaryButton({ children }: { children: React.ReactNode }) {
  return (
    <button
      style={{
        backgroundColor: 'var(--color-primary)',
        color: 'var(--color-background)',
      }}
      className="px-4 py-2 rounded-lg font-medium hover:opacity-90 transition"
    >
      {children}
    </button>
  )
}
```

### Ejemplo 2: Badge con color secundario

```tsx
function Badge({ label }: { label: string }) {
  return (
    <span
      style={{
        backgroundColor: `rgba(var(--color-secondary-rgb), 0.1)`,
        color: 'var(--color-secondary)',
      }}
      className="px-3 py-1 rounded-full text-sm font-medium"
    >
      {label}
    </span>
  )
}
```

### Ejemplo 3: Card con borde personalizado

```tsx
function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div
      style={{
        borderColor: 'var(--color-primary)',
      }}
      className="border-2 rounded-xl p-6"
    >
      <h3
        style={{ color: 'var(--color-primary)' }}
        className="text-lg font-semibold mb-4"
      >
        {title}
      </h3>
      {children}
    </div>
  )
}
```

---

## 📚 Referencias

- [CSS Custom Properties (MDN)](https://developer.mozilla.org/en-US/docs/Web/CSS/--*)
- [Tailwind CSS Variables](https://tailwindcss.com/docs/customizing-colors#using-css-variables)
- [Supabase RPC Functions](https://supabase.com/docs/guides/database/functions)

---

**Última actualización:** 20 Mayo 2026  
**Responsable:** Claude (Powered by Rommer Volcanes)
