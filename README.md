# 💅 ElenaOS

**El sistema operativo para centros de estética modernos**

> Sistema de gestión integral con IA que predice cuándo una clienta está en riesgo de perderse y automatiza su reactivación con WhatsApp personalizados.

---

## 🎯 ¿Qué es ElenaOS?

ElenaOS es un **SaaS multi-tenant completo para salones de belleza** que combina:
- Agenda inteligente con sincronización en tiempo real
- CRM avanzado con predicción de riesgo de abandono
- Motor de retención con IA (Claude API)
- Agente de reservas por WhatsApp con procesamiento NLP
- Facturación fiscal (VeriFactu/TicketBAI)
- Sistema de billing con Lemon Squeezy
- Vista tablet optimizada para estaciones de trabajo
- PWA para instalación y uso offline

**Propuesta de valor:** *"Tu salón lleno. Sin perseguir a nadie."*

---

## 🚀 Quick Start

### Requisitos Previos

- Node.js 18+
- npm o yarn
- Cuenta de Supabase
- Cuenta de Lemon Squeezy (para billing)
- WhatsApp Business API (Meta Cloud)
- API key de Anthropic Claude

### Instalación

```bash
# 1. Clonar repositorio
git clone https://github.com/tu-usuario/elenaos.git
cd elenaos

# 2. Instalar dependencias
npm install

# 3. Copiar variables de entorno
cp .env.example .env.local

# 4. Configurar .env.local (ver sección Variables de Entorno)

# 5. Iniciar servidor de desarrollo
npm run dev
```

Abrir [http://localhost:3000](http://localhost:3000)

### Variables de Entorno

Crear archivo `.env.local` con:

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu-anon-key
SUPABASE_SERVICE_ROLE_KEY=tu-service-role-key

# WhatsApp Business API (Meta Cloud)
WHATSAPP_PHONE_NUMBER_ID=tu-phone-number-id
WHATSAPP_ACCESS_TOKEN=tu-access-token
WHATSAPP_WEBHOOK_VERIFY_TOKEN=tu-webhook-verify-token

# Anthropic Claude API
ANTHROPIC_API_KEY=tu-api-key

# Lemon Squeezy
LEMON_SQUEEZY_API_KEY=tu-api-key
LEMON_SQUEEZY_STORE_ID=tu-store-id
LEMON_SQUEEZY_WEBHOOK_SECRET=tu-webhook-secret
NEXT_PUBLIC_LEMON_SQUEEZY_STARTER_VARIANT_ID=variant-id
NEXT_PUBLIC_LEMON_SQUEEZY_PROFESSIONAL_VARIANT_ID=variant-id
NEXT_PUBLIC_LEMON_SQUEEZY_ENTERPRISE_VARIANT_ID=variant-id

# Resend (Emails)
RESEND_API_KEY=tu-api-key

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

---

## 📁 Estructura del Proyecto

```
elenaos/
├── app/                           # Next.js 14 App Router
│   ├── (auth)/                   # Rutas de autenticación
│   │   ├── login/                # Login
│   │   ├── signup/               # Registro
│   │   └── onboarding/           # Onboarding 3 pasos
│   ├── (dashboard)/              # Dashboard protegido (layout con sidebar)
│   │   ├── dashboard/            # Página principal
│   │   ├── agenda/               # Calendario y citas
│   │   ├── clientes/             # CRM - Lista y ficha de clientes
│   │   ├── retencion/            # Motor de retención con IA
│   │   ├── agente/               # Agente de reservas IA
│   │   ├── facturacion/          # Facturas y VeriFactu
│   │   ├── inventario/           # Productos y stock
│   │   ├── personal/             # Staff y servicios
│   │   ├── configuracion/        # Settings
│   │   └── billing/              # Suscripción y pagos
│   ├── (tablet)/                 # Vista optimizada para tablet
│   │   └── station/              # Estación de trabajo
│   ├── api/                      # API Routes
│   │   ├── whatsapp/webhook/    # Webhook WhatsApp
│   │   └── billing/webhook/      # Webhook Lemon Squeezy
│   └── offline/                  # Página offline (PWA)
├── components/                    # Componentes React
│   ├── dashboard/                # Header, Sidebar, etc
│   ├── agenda/                   # Calendario, modales citas
│   ├── clientes/                 # Lista, ficha, segmentación
│   ├── retencion/                # Dashboard retención, alertas
│   ├── agent/                    # Visor conversaciones, config
│   ├── tablet/                   # Componentes vista tablet
│   ├── pwa/                      # InstallPrompt, UpdatePrompt
│   └── ui/                       # Componentes base (shadcn/ui)
├── lib/                          # Lógica de negocio
│   ├── supabase/                 # Cliente Supabase
│   ├── ai/                       # Integración Claude API
│   ├── whatsapp/                 # SDK WhatsApp Business
│   ├── billing/                  # SDK Lemon Squeezy
│   ├── invoicing/                # VeriFactu, PDF
│   └── pwa/                      # PWA utils
├── hooks/                        # Custom React hooks
├── types/                        # TypeScript types
├── utils/                        # Utilidades generales
├── public/                       # Assets estáticos
│   ├── manifest.json             # PWA manifest
│   ├── sw.js                     # Service Worker
│   └── icons/                    # Iconos PWA (múltiples tamaños)
└── docs/                         # Documentación
    ├── 00-idea-elenaos.md
    ├── 01-brief-elenaos.md
    ├── PLAN-DESARROLLO-ELENAOS.md
    ├── TAREA-XX-COMPLETADA.md   # Documentación por tarea
    ├── QA-CHECKLIST.md           # 350+ verificaciones
    ├── TESTING-GUIDE.md          # Guía de testing
    └── USER-MANUAL.md            # Manual de usuario
```

---

## 🛠️ Tech Stack

### Frontend
- **Next.js 14** — React framework con App Router
- **TypeScript** — Type safety
- **TailwindCSS** — Styling con tema personalizado purple-pink
- **shadcn/ui** — Componentes base accesibles
- **Lucide React** — Iconografía
- **date-fns** — Manejo de fechas con locale español
- **React Hook Form** — Formularios
- **Zustand** — State management (si es necesario)

### Backend & Database
- **Supabase** — Backend as a Service
  - PostgreSQL con Row Level Security (RLS)
  - Authentication (email/password, OAuth)
  - Storage (logos, documentos)
  - Realtime subscriptions
  - Edge Functions
- **Multi-tenancy** — Arquitectura con tabla `tenants` y aislamiento por RLS

### Integraciones
- **Anthropic Claude API** — IA para:
  - Predicción de riesgo de clientes
  - Generación de mensajes personalizados
  - Procesamiento NLP de conversaciones
  - Agente de reservas inteligente
- **WhatsApp Business API** (Meta Cloud) — Mensajería bidireccional
- **Lemon Squeezy** — Billing y suscripciones SaaS
- **Resend** — Envío de emails transaccionales

### PWA
- **Service Worker** — Cache, offline, background sync
- **Web App Manifest** — Instalación en home screen
- **Push Notifications** — Notificaciones en tiempo real

### Deploy & Hosting
- **Vercel** — Hosting y CI/CD
- **Vercel Analytics** — Performance monitoring
- **Sentry** (opcional) — Error tracking

### Compliance
- **VeriFactu** — Cumplimiento AEAT España
- **TicketBAI** — País Vasco
- **Facturae** — Formato XML facturas

---

## ✨ Features Principales

### 1. 🔐 Autenticación y Onboarding
- Login/Registro con Supabase Auth
- Onboarding de 3 pasos con validación
- Wizard de configuración inicial
- Celebración con confetti al completar

### 2. 📊 Dashboard Principal
- 4 métricas diarias en tiempo real
- Timeline de agenda con cita actual destacada
- Feed de actividad reciente
- Métricas de retención con gráficos

### 3. 📅 Agenda Inteligente
- 3 vistas: Día, Semana, Lista
- Crear/editar/eliminar citas con modal
- Estados: Pendiente, Confirmada, En progreso, Completada, Cancelada
- Filtros por staff, servicio, estado
- Búsqueda instantánea
- Sincronización tiempo real (Supabase Realtime)

### 4. 👥 CRM Completo
- Lista de clientes con búsqueda y filtros avanzados
- Segmentación: VIP, En riesgo, Nuevas, Inactivas
- Ficha completa con historial de citas
- Análisis de riesgo con IA (Claude)
- Recomendaciones personalizadas
- Notas privadas
- Integración con WhatsApp

### 5. 🎯 Motor de Retención con IA
- Dashboard con KPIs de retención
- Alertas automáticas de clientes en riesgo (>30 días sin cita)
- Niveles de riesgo: Medio (30d), Alto (60d), Crítico (90d)
- Campañas de reactivación por WhatsApp
- Templates personalizables con variables
- Seguimiento de respuestas y conversiones
- ROI de campañas

### 6. 🤖 Agente de Reservas IA
- Procesamiento de lenguaje natural (NLP) en español
- Detección de intenciones: crear/modificar/cancelar citas
- Extracción de entidades: servicio, fecha, hora
- Respuestas naturales generadas por IA
- Modo automático con confirmación opcional
- Visor de conversaciones en tiempo real
- Configuración de horarios y reglas

### 7. 🧾 Facturación Fiscal
- Generación de facturas con numeración automática
- Cumplimiento VeriFactu (AEAT)
- Generación de hash de verificación
- QR de validación
- Descargar PDF con logo
- Envío por email
- Estados: Borrador, Enviada, Pagada, Vencida

### 8. 📦 Inventario
- Gestión de productos
- Control de stock con alertas
- Historial de movimientos
- Categorías y búsqueda

### 9. 👨‍💼 Personal y Servicios
- Gestión de staff con disponibilidad
- Calendario de horarios
- 10 colores para diferenciación
- Catálogo de servicios con 10 categorías
- Precios y duraciones

### 10. 💳 Billing y Suscripciones
- 3 planes: Starter, Professional, Enterprise
- Checkout con Lemon Squeezy
- Webhooks para eventos de suscripción
- Historial de facturas
- Cambio de plan
- Cancelación y reactivación

### 11. 📱 Vista Tablet (Estación)
- Interfaz optimizada para tablets (iPad)
- Cita actual destacada con info ampliada
- Cola de citas siguientes
- Acciones rápidas (completar, pausar, mensaje, productos, foto, factura)
- Historial de cliente
- Reloj en tiempo real

### 12. 📲 PWA (Progressive Web App)
- Instalación en home screen
- Funcionalidad offline
- Cache inteligente
- Notificaciones push
- Actualizaciones automáticas
- Sincronización en background

### 13. ⚙️ Configuración
- 6 temas de color (purple, pink, blue, green, orange, cyan)
- Upload de logo
- Datos del salón
- Preferencias de notificaciones

---

## 🗄️ Arquitectura de Base de Datos

### Multi-tenancy con RLS

ElenaOS usa **Row Level Security (RLS)** de Supabase para aislar datos por tenant.

**Tablas principales**:

```sql
-- Tenants (salones)
tenants
├── id (uuid)
├── name
├── logo_url
├── theme_color
└── settings (jsonb)

-- Users (dueños y staff)
users
├── id (uuid)
├── tenant_id (FK)
├── email
├── role (owner | staff)
└── permissions

-- Clientes
clients
├── id (uuid)
├── tenant_id (FK)
├── name
├── phone
├── email
├── last_visit_date
├── risk_level
└── notes

-- Citas
appointments
├── id (uuid)
├── tenant_id (FK)
├── client_id (FK)
├── staff_id (FK)
├── service_id (FK)
├── date
├── time
├── duration
├── status
└── price

-- Personal
staff_members
├── id (uuid)
├── tenant_id (FK)
├── name
├── color
└── specialties

-- Servicios
services
├── id (uuid)
├── tenant_id (FK)
├── name
├── category
├── duration
└── price

-- Productos (Inventario)
products
├── id (uuid)
├── tenant_id (FK)
├── name
├── stock
└── price

-- Facturas
invoices
├── id (uuid)
├── tenant_id (FK)
├── client_id (FK)
├── number
├── date
├── total
├── verifactu_hash
└── status

-- Mensajes WhatsApp
whatsapp_messages
├── id (uuid)
├── tenant_id (FK)
├── client_id (FK)
├── direction (inbound | outbound)
├── content
├── status
└── intent (jsonb)

-- Campañas de retención
retention_campaigns
├── id (uuid)
├── tenant_id (FK)
├── name
├── segment
├── template
├── sent_count
├── response_rate
└── roi
```

**Políticas RLS**: Cada tabla tiene políticas que filtran por `tenant_id` automáticamente según el usuario autenticado.

---

## 🔐 Seguridad

### Autenticación
- JWT tokens con Supabase Auth
- Session management con refresh tokens
- Logout invalida tokens
- Rate limiting en endpoints de login

### Autorización
- Row Level Security (RLS) en todas las tablas
- Usuarios solo acceden a su tenant
- Roles: Owner (admin completo), Staff (limitado)
- API endpoints verifican permisos

### Input Validation
- Validación server-side de todos los inputs
- Sanitización de HTML
- Prevención SQL injection (prepared statements)
- Prevención XSS
- File upload validation (tipo, tamaño)

### API Keys
- Nunca expuestas en cliente
- Guardadas en variables de entorno
- No en git (.gitignore)
- Rotación posible

### Webhooks
- Signature verification en todos los webhooks
- Validación de payload
- Idempotencia para evitar duplicados

---

## 🧪 Testing

Ver documentación completa en:
- **QA Checklist**: `docs/QA-CHECKLIST.md` (350+ verificaciones)
- **Testing Guide**: `docs/TESTING-GUIDE.md` (metodologías y herramientas)

### Testing Manual

**Usuarios de prueba**:
```
Admin: admin@test.elenaos.com / TestAdmin123!
Staff: elena@test.elenaos.com / TestStaff123!
```

**Tarjetas de prueba (Lemon Squeezy)**:
```
Visa Success: 4242 4242 4242 4242
Visa Decline: 4000 0000 0000 0002
```

### Flujos Críticos a Testear

1. **Onboarding Completo** (3 pasos)
2. **Crear y Completar Cita**
3. **Cliente en Riesgo → Reactivación**
4. **Generar Factura**
5. **Cambiar Plan de Suscripción**

### Testing Automatizado (Futuro)

```bash
# E2E con Playwright
npm run test:e2e

# Unit tests con Vitest
npm run test:unit

# Lighthouse (Performance)
npm run lighthouse
```

### Checklist Pre-Deploy

- [ ] Build sin errores (`npm run build`)
- [ ] QA checklist > 95% completado
- [ ] Lighthouse score > 90
- [ ] No vulnerabilidades críticas (`npm audit`)
- [ ] Tested en Chrome/Firefox/Safari
- [ ] Tested en iOS y Android
- [ ] Responsive verified (mobile/tablet/desktop)
- [ ] No console errors
- [ ] Variables de entorno de producción configuradas
- [ ] Database migrations aplicadas

---

## 🚀 Deploy a Producción

### Vercel

```bash
# 1. Instalar Vercel CLI
npm i -g vercel

# 2. Login
vercel login

# 3. Deploy
vercel --prod
```

### Variables de Entorno en Vercel

Configurar en dashboard de Vercel:
- Todas las variables de `.env.local`
- `NEXT_PUBLIC_APP_URL` = tu dominio de producción

### Database (Supabase)

1. Crear proyecto en Supabase
2. Ejecutar migraciones (si las hay)
3. Habilitar RLS en todas las tablas
4. Configurar políticas de seguridad
5. Copiar URL y keys a Vercel

### Webhooks

Configurar URLs de webhooks en:

**WhatsApp Business API**:
```
https://tu-dominio.com/api/whatsapp/webhook
```

**Lemon Squeezy**:
```
https://tu-dominio.com/api/billing/webhook
```

Verificar signatures en ambos.

### Dominio Custom

1. Comprar dominio (Namecheap, Cloudflare)
2. Configurar DNS en Vercel
3. Habilitar SSL automático

---

## 📊 Roadmap

### ✅ Completado (Fases 1-9)

- Fundación y arquitectura
- Autenticación y onboarding
- Dashboard principal
- Agenda con 3 vistas
- CRM completo
- Motor de retención con IA
- Agente de reservas IA
- Facturación y VeriFactu
- Inventario
- Personal y servicios
- Billing con Lemon Squeezy
- Vista tablet
- PWA
- Testing y QA completo
- Documentación técnica y de usuario

### 🚧 En Progreso

- **Fase 10** (Deploy): Producción y piloto con 3-5 salones

### 📋 Roadmap Futuro (V2)

- Dashboard de métricas avanzadas
- Integración con Instagram/Facebook
- Marketing automation completo
- Reportes y analytics
- App móvil nativa (React Native + Expo)
- Sistema de recompensas y fidelización
- Marketplace de productos
- API pública para integraciones

---

## 📖 Manual de Usuario

Ver manual completo en: **`docs/USER-MANUAL.md`**

Incluye:
- Primeros pasos y onboarding
- Guía de cada módulo con capturas
- Tips y mejores prácticas
- Preguntas frecuentes
- Soporte y contacto

---

## 🤝 Contribuir

Actualmente en desarrollo privado. Para contribuir:

1. Fork el repositorio
2. Crear branch con feature (`git checkout -b feature/nueva-feature`)
3. Commit con mensaje descriptivo
4. Push a tu branch
5. Abrir Pull Request

**Reglas**:
- Todo en español (código, comentarios, docs)
- Seguir convenciones del proyecto
- Testear antes de PR
- Documentar cambios en `docs/04-decisions.md`

---

## 📄 Licencia

Propietario: Rommer Volcanes  
Licencia: Todos los derechos reservados

---

## 💬 Soporte

- **Email**: soporte@elenaos.com
- **Documentación**: [docs.elenaos.com](https://docs.elenaos.com)
- **Chat en vivo**: Disponible en la app

---

## 🙏 Agradecimientos

- **shadcn/ui** por los componentes base
- **Supabase** por el BaaS increíble
- **Anthropic** por Claude API
- **Vercel** por el hosting y DX

---

**ElenaOS** — *Tu salón lleno. Sin perseguir a nadie.* 💅

Powered by [Rommer Volcanes](https://rommer.dev)
