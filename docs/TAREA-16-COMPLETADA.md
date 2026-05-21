# Tarea #16: Flujo de Onboarding (3 pasos)

**Estado**: ✅ Completada  
**Fecha**: 2026-05-21  
**Prioridad**: Alta  
**Fase**: FASE 6.2

---

## Resumen

Flujo completo de onboarding para nuevos salones en 3 pasos:
1. **Tu Salón**: Información básica, WhatsApp, logo y paleta de colores
2. **Tu Equipo**: Personal con especialidades + servicios con sugerencias de IA
3. **Tus Clientas**: Opciones de importación (CSV, empezar vacío, o integraciones futuras)
4. **Celebración**: Pantalla de éxito con confetti, resumen y próximos pasos

**Características**:
- Barra de progreso visual con 3 pasos
- Navegación hacia atrás permitida
- Validaciones en cada paso
- UI consistente con gradientes purple-pink
- Animaciones y feedback visual
- Puede completarse parcialmente (opcionales)

---

## Archivos Creados

### 1. Página Principal de Onboarding

**Archivo**: `app/(auth)/onboarding/page.tsx` (115 líneas)

Controlador principal del flujo de onboarding.

**Estado Global**:
```typescript
{
  salon: {
    name: string
    whatsapp: string
    city: string
    postalCode: string
    logo: File | null
    logoPreview: string
    colorPalette: string
  },
  team: {
    staff: Array<{ id, name, specialties }>
    services: Array<{ id, name, duration, price }>
  },
  clients: {
    method: 'csv' | 'empty' | 'integration'
    csvFile: File | null
    csvData: any[]
  }
}
```

**Navegación**:
- `currentStep`: 1-4 (3 pasos + celebración)
- `handleStep1Complete(data)`: Avanza a paso 2
- `handleStep2Complete(data)`: Avanza a paso 3
- `handleStep3Complete(data)`: Avanza a celebración
- `handleBack()`: Retrocede un paso

**Barra de Progreso**:
- 3 círculos numerados conectados con líneas
- Estados:
  - Completado: ✓ en verde
  - Actual: Número con gradiente purple-pink, scale-110
  - Pendiente: Número en gris
- Líneas conectoras verdes cuando completado
- Texto "Paso X de 3" centrado

**Background**: Gradiente `from-purple-50 via-pink-50 to-white`

---

### 2. Paso 1: Tu Salón

**Archivo**: `components/onboarding/Step1Salon.tsx` (167 líneas)

Información básica del salón.

**Header**:
- Icono Store en gradiente purple-pink
- Título: "¡Bienvenida a ElenaOS! 👋"
- Subtítulo: "Vamos a configurar tu salón en menos de 5 minutos"

**Campos del Formulario**:

1. **Nombre del salón** *
   - Input text, required
   - Placeholder: "Ej: Elena Beauty Salon"
   - Full width

2. **WhatsApp del salón** *
   - Input tel, required
   - Placeholder: "+34 666 123 456"
   - Helper text: "Usaremos este número para enviar mensajes de retención"
   - Grid col 1/2

3. **Ciudad** *
   - Input text, required
   - Placeholder: "Madrid"
   - Grid col 2/2

4. **Código postal**
   - Input text, opcional
   - Placeholder: "28013"
   - Full width

5. **Logo del salón (opcional)**
   - File upload (image/*)
   - Preview box 24x24 con border dashed
   - Muestra preview inmediato al subir
   - Botón "Subir logo" o "Cambiar logo"
   - Helper: "PNG, JPG o SVG. Tamaño recomendado: 200x200px"

6. **Paleta de colores**
   - Grid 2 cols (md: 3 cols)
   - 6 paletas predefinidas:
     1. Purple Dream: #9333ea + #ec4899
     2. Ocean Blue: #0ea5e9 + #06b6d4
     3. Forest Green: #10b981 + #059669
     4. Sunset Orange: #f97316 + #f59e0b
     5. Pink Elegance: #ec4899 + #f472b6
     6. Royal Purple: #7c3aed + #a855f7
   - Cada card muestra 2 cuadrados de color + nombre
   - Seleccionada: border-purple-500, ring-4 ring-purple-200
   - Hover: scale-105

**CTA Button**:
- "Continuar" con icono ArrowRight
- Gradiente purple-to-pink
- Hover: shadow-xl, scale-105
- Full width

**Validación**:
- Nombre, WhatsApp y Ciudad son obligatorios
- Resto opcional

---

### 3. Paso 2: Tu Equipo

**Archivo**: `components/onboarding/Step2Team.tsx` (290 líneas)

Configuración de personal y servicios.

**Header**:
- Icono Users en gradiente
- Título: "Tu equipo y servicios"
- Subtítulo: "Añade tu personal y los servicios que ofreces (puedes hacerlo después)"

**Sección 1: Personal del Salón**

**Header con botón "Añadir personal"**

**Formulario inline** (cuando showStaffForm = true):
- Background purple-50 con border purple-200
- Input: Nombre completo
- Input: Especialidades (ej: Corte, Color, Peinados)
- Botones: "Añadir" (purple) + "Cancelar" (gray)

**Lista de personal añadido**:
- Cards gray-50 con border gray-200
- Muestra: Nombre (bold) + Especialidades (small)
- Botón X para eliminar (text-red-600)
- Si vacío: Mensaje en card dashed "Aún no has añadido personal..."

**Sección 2: Servicios**

**Header con botón "Añadir servicio"**

**Sugerencias de IA** (si services.length === 0):
- Background gradiente purple-50 to pink-50
- Título con icono Sparkles: "Servicios sugeridos por IA"
- Grid 2 columnas con 6 servicios:
  1. Corte de Pelo - 30 min - €25
  2. Tinte Completo - 120 min - €85
  3. Mechas - 180 min - €120
  4. Manicura Semipermanente - 60 min - €35
  5. Pedicura Completa - 45 min - €30
  6. Facial Hidratante - 60 min - €45
- Cada card con hover border-purple-400
- Click añade directamente a la lista

**Formulario inline** (cuando showServiceForm = true):
- Input: Nombre del servicio
- Grid 2 cols:
  - Duración (min) - input number
  - Precio (€) - input number
- Botones: "Añadir" + "Cancelar"

**Lista de servicios añadidos**:
- Cards gray-50 con icono Scissors
- Muestra: Nombre + "XX min • €XX"
- Botón X para eliminar

**Botones de Navegación**:
- "Atrás" con ArrowLeft (border gray)
- "Continuar" con ArrowRight (gradiente, flex-1)

**Estado**:
- Personal y servicios son opcionales
- Puede continuar sin añadir nada

---

### 4. Paso 3: Tus Clientas

**Archivo**: `components/onboarding/Step3Clients.tsx` (215 líneas)

Opciones para importar base de clientes.

**Header**:
- Icono Users en gradiente
- Título: "Importa tus clientas"
- Subtítulo: "Elige cómo quieres añadir tu base de clientes"

**Opción A: Subir archivo CSV**

- Icono Upload en gradiente blue
- Título: "Subir archivo CSV"
- Descripción: "Importa tu base de datos existente desde un archivo CSV o Excel"

**Cuando seleccionada**:
- Card expandible con background white
- Botón "Seleccionar archivo CSV" (purple)
- Input file (.csv, .xlsx, .xls)
- Al seleccionar archivo:
  - Badge verde con nombre y tamaño
  - Vista previa tabla (primeras 5 filas)
  - Helper: "💡 Tu CSV debe incluir: Nombre, Email, Teléfono, Última visita"

**Opción B: Empezar desde cero**

- Icono Zap en gradiente green
- Título: "Empezar desde cero"
- Descripción: "Añadiré mis clientas manualmente conforme vayan llegando al salón"

**Opción C: Conectar Booksy / Fresha**

- Icono Link en gray (disabled)
- Badge naranja "PRÓXIMAMENTE"
- Título: "Conectar Booksy / Fresha"
- Descripción: "Importa automáticamente tu base de clientes desde otras plataformas"
- Estado: disabled, opacity-60, cursor-not-allowed

**Info Box**:
- Background blue-50 con border-left blue
- "No te preocupes: Puedes añadir o importar más clientas en cualquier momento desde tu dashboard."

**Botones de Navegación**:
- "Atrás" con ArrowLeft
- "Finalizar configuración" con ArrowRight
- Disabled si no hay método seleccionado
- Muestra spinner si isProcessing = true
- Simula procesamiento de 2 segundos

**Estados de Selección**:
- Seleccionada: border-purple-500, bg-purple-50, ring-4
- No seleccionada: border-gray-200, hover:border-purple-300

---

### 5. Pantalla de Celebración

**Archivo**: `components/onboarding/Celebration.tsx` (180 líneas)

Confirmación de finalización exitosa.

**Efecto de Confetti**:
- 50 círculos de colores cayendo
- Animación CSS: translateY + rotate
- Colores: purple, pink, violet, orange, green
- Duración: 5 segundos, luego desaparece
- Position fixed, pointer-events-none

**Icono de Éxito**:
- CheckCircle2 grande en gradiente green-to-emerald
- Dentro de círculo de 24x24
- Animación bounce-slow (2s infinite)
- Sparkles amarillo pulsando en esquina superior derecha

**Mensajes**:
1. Headline: "¡Felicidades! 🎉" (4xl-5xl)
2. Subheadline: "{salonName} está listo para despegar" (2xl-3xl con gradiente)

**Resumen de Configuración**:
- Card con gradiente purple-50 to pink-50
- 3 checks verdes:
  1. "Información del salón" - Nombre, ubicación y colores personalizados
  2. "Personal y servicios" - Equipo configurado y catálogo listo
  3. "Base de clientas" - Sistema de importación configurado

**Próximos Pasos Sugeridos**:
- Card blue-50 con border-left blue
- Icono 🚀
- Lista numerada:
  1. Conecta tu WhatsApp Business para activar el motor de retención
  2. Crea tu primera cita desde el calendario
  3. Explora el dashboard para familiarizarte con las métricas

**CTA Principal**:
- Link a /dashboard
- "Ir a mi Dashboard" con ArrowRight
- Gradiente purple-to-pink
- Extra grande (px-10 py-5, text-xl)
- Hover: shadow-2xl, scale-105

**Link de Ayuda**:
- Texto: "¿Necesitas ayuda? Visita nuestro centro de ayuda"
- Link a /ayuda en purple

**Animaciones CSS**:
```css
@keyframes confetti {
  0%: translateY(0) rotate(0deg) opacity(1)
  100%: translateY(100vh) rotate(720deg) opacity(0)
}

@keyframes bounce-slow {
  0%, 100%: translateY(0)
  50%: translateY(-10px)
}
```

---

## Flujo de Datos

### Paso 1 → Paso 2
```typescript
{
  name: "Elena Beauty Salon",
  whatsapp: "+34666123456",
  city: "Madrid",
  postalCode: "28013",
  logo: File,
  logoPreview: "data:image/png;base64...",
  colorPalette: "purple-dream"
}
```

### Paso 2 → Paso 3
```typescript
{
  staff: [
    {
      id: 1234567890,
      name: "María López",
      specialties: "Corte, Color, Peinados"
    }
  ],
  services: [
    {
      id: 1234567891,
      name: "Corte de Pelo",
      duration: 30,
      price: 25
    }
  ]
}
```

### Paso 3 → Celebración
```typescript
{
  method: "csv", // or "empty" or "integration"
  csvFile: File | null,
  csvData: [
    ["Nombre", "Email", "Teléfono", "Última visita"],
    ["Ana García", "ana@example.com", "+34666111222", "2025-01-15"],
    // ...
  ]
}
```

---

## Funcionalidades Implementadas

### ✅ Sistema de Navegación
- [x] Barra de progreso visual con 3 pasos
- [x] Estados: Completado (✓), Actual (número), Pendiente (gris)
- [x] Navegación secuencial (1→2→3→4)
- [x] Botón "Atrás" en pasos 2 y 3
- [x] No se puede saltar pasos

### ✅ Paso 1: Tu Salón
- [x] Formulario con 5 campos (3 obligatorios)
- [x] Upload de logo con preview instantáneo
- [x] 6 paletas de colores predefinidas
- [x] Selector visual de paletas
- [x] Validación de campos requeridos
- [x] Submit guarda data y avanza

### ✅ Paso 2: Tu Equipo
- [x] Sección personal con formulario inline
- [x] Lista dinámica de staff añadido
- [x] Eliminar staff individual
- [x] Sección servicios con formulario inline
- [x] 6 servicios sugeridos por IA
- [x] Click en sugerencia añade directamente
- [x] Lista dinámica de servicios
- [x] Eliminar servicio individual
- [x] Ambas secciones opcionales
- [x] Navegación atrás/adelante

### ✅ Paso 3: Tus Clientas
- [x] 3 opciones de importación
- [x] Upload CSV con preview de datos
- [x] Opción "empezar vacío"
- [x] Opción integraciones (disabled, próximamente)
- [x] Validación: debe seleccionar una opción
- [x] Simulación de procesamiento (2s)
- [x] Info box con aclaración

### ✅ Celebración
- [x] Efecto confetti animado (50 partículas)
- [x] Icono de éxito con bounce animation
- [x] Mensaje personalizado con nombre del salón
- [x] Resumen de configuración (3 checks)
- [x] Próximos pasos sugeridos (3 items)
- [x] CTA grande a dashboard
- [x] Link de ayuda

---

## Patrones de Diseño

### Layout Consistente
- Cards blancas con `rounded-3xl`
- Shadow: `shadow-2xl`
- Border: `border-2 border-purple-100`
- Padding: `p-8 lg:p-12`
- Max width: `max-w-4xl` (steps) o `max-w-3xl` (celebration)

### Headers de Paso
```jsx
<div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
  <Icon className="h-8 w-8 text-white" />
</div>
<h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
  {titulo}
</h1>
<p className="text-gray-600 text-lg">
  {subtitulo}
</p>
```

### Inputs
- Border: `border-2 border-gray-200`
- Focus: `focus:border-purple-500 focus:ring-0`
- Rounded: `rounded-xl`
- Padding: `px-4 py-3`
- Text size aumentado para mejor legibilidad

### Botones Primarios
```jsx
className="py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-bold text-lg hover:shadow-xl hover:scale-105 transition-all"
```

### Botones Secundarios (Atrás)
```jsx
className="px-8 py-4 border-2 border-gray-300 text-gray-700 rounded-xl font-bold hover:bg-gray-50"
```

### Cards Seleccionables
```jsx
className={`p-6 rounded-2xl border-2 transition-all ${
  selected 
    ? 'border-purple-500 bg-purple-50 ring-4 ring-purple-200'
    : 'border-gray-200 hover:border-purple-300'
}`}
```

### Formularios Inline
- Background: `bg-purple-50`
- Border: `border-2 border-purple-200`
- Rounded: `rounded-xl`
- Padding: `p-4`
- Botones dentro: primario purple + secundario gray

---

## Validaciones

### Paso 1
- ✅ Nombre del salón: required, min 2 caracteres
- ✅ WhatsApp: required, formato tel
- ✅ Ciudad: required
- ⚪ Código postal: opcional
- ⚪ Logo: opcional
- ✅ Paleta: pre-seleccionada (purple-dream)

### Paso 2
- ⚪ Personal: opcional, puede estar vacío
- ⚪ Servicios: opcional, puede estar vacío
- ✅ Si añade staff: nombre requerido
- ✅ Si añade servicio: nombre, duración y precio requeridos

### Paso 3
- ✅ Debe seleccionar un método (csv, empty, integration)
- ✅ Si CSV: debe subir archivo
- ⚪ Resto de opciones no requieren inputs adicionales

---

## Testing Realizado

### ✅ Navegación
- [x] Barra de progreso actualiza correctamente
- [x] Paso actual destacado visualmente
- [x] Pasos completados muestran ✓ verde
- [x] No se puede saltar pasos
- [x] Botón atrás funciona (paso 2 y 3)

### ✅ Paso 1
- [x] Todos los inputs aceptan texto
- [x] Upload de logo genera preview correcto
- [x] Selección de paleta funciona
- [x] Validación evita submit vacío
- [x] Data se guarda correctamente
- [x] Avanza a paso 2 al completar

### ✅ Paso 2
- [x] Formulario de staff añade correctamente
- [x] Eliminar staff funciona
- [x] Formulario de servicio añade correctamente
- [x] Servicios sugeridos añaden con 1 click
- [x] Eliminar servicio funciona
- [x] Puede continuar sin añadir nada
- [x] Botón atrás vuelve a paso 1
- [x] Data persiste al ir atrás/adelante

### ✅ Paso 3
- [x] Selección de opciones funciona
- [x] Upload CSV muestra preview
- [x] No permite continuar sin selección
- [x] Simulación de procesamiento funciona
- [x] Botón atrás vuelve a paso 2

### ✅ Celebración
- [x] Confetti se muestra correctamente
- [x] Confetti desaparece después de 5s
- [x] Nombre del salón se muestra correcto
- [x] Link a dashboard funciona
- [x] Animaciones smooth (bounce, pulse)

---

## User Experience

### Flujo Completo (Happy Path)
1. Usuario entra a /onboarding
2. Ve "Paso 1 de 3"
3. Rellena nombre: "Mi Salón"
4. Añade WhatsApp: "+34666123456"
5. Añade ciudad: "Madrid"
6. Sube logo (opcional)
7. Selecciona paleta "Ocean Blue"
8. Click "Continuar" → Paso 2
9. Ve "Paso 2 de 3" (paso 1 con ✓ verde)
10. Click "Añadir personal"
11. Añade: "María" - "Corte, Color"
12. Ve sugerencias de servicios IA
13. Click en "Corte de Pelo" → se añade automáticamente
14. Click en "Tinte Completo" → se añade
15. Click "Continuar" → Paso 3
16. Ve "Paso 3 de 3" (pasos 1-2 con ✓)
17. Selecciona "Empezar desde cero"
18. Click "Finalizar configuración"
19. Ve spinner "Procesando..." (2s)
20. 🎉 Pantalla de celebración con confetti
21. Ve resumen de configuración
22. Click "Ir a mi Dashboard"
23. Redirige a /dashboard

**Tiempo total**: ~3-5 minutos

### Flujo Mínimo (Fast Path)
1. Paso 1: Solo campos obligatorios (nombre, WhatsApp, ciudad)
2. Click "Continuar"
3. Paso 2: No añade nada (skip)
4. Click "Continuar"
5. Paso 3: "Empezar desde cero"
6. Click "Finalizar"
7. Celebración
8. Dashboard

**Tiempo total**: ~1 minuto

---

## Integraciones Futuras

### Backend (Supabase)

**Tabla `tenants`**:
```sql
CREATE TABLE tenants (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  whatsapp TEXT NOT NULL,
  city TEXT NOT NULL,
  postal_code TEXT,
  logo_url TEXT,
  color_palette TEXT DEFAULT 'purple-dream',
  onboarding_completed BOOLEAN DEFAULT false,
  onboarding_completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

**Trigger al completar onboarding**:
```typescript
// POST /api/onboarding/complete
{
  salon: {...},
  team: {...},
  clients: {...}
}

// Backend logic:
1. Crear tenant en DB
2. Subir logo a Storage (si existe)
3. Crear staff_members (si existen)
4. Crear services (si existen)
5. Procesar CSV y crear clients (si existe)
6. Calcular visit_frequency inicial
7. Calcular predicted_next_visit
8. Marcar onboarding_completed = true
9. Retornar tenant_id
```

**Jobs en Background**:
```typescript
// Después de importar clientas
async function processClientsOnboarding(tenantId, clients) {
  for (const client of clients) {
    // Calcular frecuencia de visita basada en historial
    const visitFrequency = calculateVisitFrequency(client.visits)
    
    // Predecir próxima visita
    const lastVisit = new Date(client.lastVisit)
    const predictedNext = new Date(lastVisit)
    predictedNext.setDate(predictedNext.getDate() + visitFrequency)
    
    // Guardar en DB
    await supabase.from('clients').update({
      visit_frequency: visitFrequency,
      predicted_next_visit: predictedNext
    }).eq('id', client.id)
  }
}
```

### WhatsApp Integration

**Paso adicional (futuro)**:
- Entre Step 3 y Celebration
- "Conecta tu WhatsApp"
- QR Code de WhatsApp Business API
- Instrucciones paso a paso
- Skip option

### Analytics

**Trackear eventos**:
- `onboarding_started`
- `onboarding_step1_completed`
- `onboarding_step2_completed`
- `onboarding_step3_completed`
- `onboarding_completed`
- `onboarding_abandoned` (en qué paso)

**Métricas**:
- Completion rate
- Average time per step
- Drop-off points
- Method selected (CSV vs empty vs integration)
- Services added (manual vs AI suggested)

---

## Mejoras Futuras

### UX Improvements
1. **Auto-save**: Guardar progreso en localStorage
2. **Resume**: Si abandona, puede reanudar después
3. **Skip options**: "Configurar después" en cada paso
4. **Progress percentage**: "75% completado"
5. **Estimated time**: "~2 minutos restantes"

### Step 1 Enhancements
1. **Logo crop tool**: Recortar imagen después de subir
2. **Custom colors**: Selector de color libre (no solo presets)
3. **Timezone selector**: Zona horaria del salón
4. **Language selector**: Español, Catalán, Inglés

### Step 2 Enhancements
1. **Drag & drop**: Reordenar personal y servicios
2. **Import services**: Desde plantilla o CSV
3. **Staff photos**: Subir fotos del equipo
4. **Service categories**: Agrupar servicios

### Step 3 Enhancements
1. **CSV validator**: Validar formato antes de procesar
2. **Field mapper**: Mapear columnas CSV a campos ElenaOS
3. **Duplicate detection**: Evitar clientas duplicadas
4. **Booksy/Fresha integration**: API real cuando disponible
5. **Google Contacts**: Importar desde Google

### Celebration Enhancements
1. **Share button**: Compartir en redes sociales
2. **Print summary**: PDF con resumen de configuración
3. **Video tutorial**: Embedded tour del dashboard
4. **Schedule demo**: Agendar llamada con onboarding specialist

---

## Decisiones Técnicas

### ¿Por qué 3 pasos en vez de 1 largo?
Reduce cognitive load. Cada paso tiene un objetivo claro y manageable. Mejor completion rate que un formulario largo intimidante.

### ¿Por qué permitir skip en Step 2 y 3?
No todos los salones tienen la info lista al momento. Permitir configuración básica y completar después reduce fricción y aumenta signups.

### ¿Por qué sugerencias de IA en servicios?
Acelera onboarding. El 80% de salones ofrecen servicios similares. IA puede pre-popular catálogo en 1 click en vez de typing manual.

### ¿Por qué confetti en celebración?
Celebrar hitos pequeños aumenta dopamina y engagement. El confetti hace memorable la finalización y crea sensación de logro.

### ¿Por qué no pedir tarjeta de crédito en onboarding?
Reduce friction. Queremos que prueben el producto primero. Billing se maneja después en dashboard durante trial period.

### ¿Por qué guardar logo como File en vez de subir inmediatamente?
Evita uploads innecesarios si usuario abandona. Solo subimos al completar onboarding exitosamente. Más eficiente.

---

## Métricas de Código

- **Total líneas**: ~970 líneas
- **Archivos creados**: 5 archivos
- **Componentes**: 4 steps + 1 controller
- **Formularios**: 3 principales + 2 inline
- **Animaciones CSS**: 2 (confetti, bounce)
- **Estados manejados**: 3 objetos anidados
- **Validaciones**: 6 campos required

**Desglose**:
- Page controller: ~115 líneas
- Step1Salon: ~167 líneas
- Step2Team: ~290 líneas
- Step3Clients: ~215 líneas
- Celebration: ~180 líneas

---

## Accesibilidad

### Keyboard Navigation
- Todos los inputs accesibles con Tab
- Forms submitables con Enter
- Botones focusables y clickables
- File inputs con label clickeable

### Screen Readers
- Labels descriptivos en todos los inputs
- Helper text asociado con aria-describedby
- Progress bar con rol y aria-valuenow
- Headings jerárquicos (h1 → h3)

### Visual
- Contraste AAA en texto principal
- Focus rings visibles en todos los controles
- Iconos siempre acompañados de texto
- Estados claramente diferenciados

### Errors & Validation
- Mensajes de error claros
- Required fields marcados con *
- Validation feedback instantáneo
- No se puede avanzar con datos inválidos

---

## Conclusión

Flujo de onboarding completo en 3 pasos que:
- Configura información esencial del salón
- Permite setup opcional de equipo y servicios
- Ofrece múltiples opciones de importación de clientas
- Celebra la finalización con animaciones
- Guía próximos pasos claramente

**Características clave**:
- Navegación intuitiva con progreso visual
- Campos opcionales para reducir fricción
- Sugerencias de IA para acelerar setup
- Preview inmediato de uploads
- Validaciones que previenen errores
- Celebración memorable con confetti

El onboarding está diseñado para ser completado en menos de 5 minutos pero permite configuración mínima en ~1 minuto. Balance perfecto entre thoroughness y speed.

**Criterios de Aceptación**: ✅ Todos cumplidos
- [x] 3 pasos de configuración secuenciales
- [x] Paso 1: Info salón + WhatsApp + logo + colores
- [x] Paso 2: Personal con especialidades + servicios
- [x] Paso 3: Opciones importación clientas
- [x] Sugerencias IA de servicios
- [x] Upload CSV con preview
- [x] Pantalla celebración con confetti
- [x] Resumen de configuración
- [x] CTA a dashboard
- [x] Navegación atrás permitida
- [x] Validaciones en cada paso
- [x] Diseño consistente purple-pink
- [x] Responsive mobile y desktop
