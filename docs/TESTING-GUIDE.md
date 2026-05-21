# Guía de Testing - ElenaOS

**Versión**: 1.0.0  
**Última actualización**: 2026-05-21

---

## 📋 Tabla de Contenidos

1. [Tipos de Testing](#tipos-de-testing)
2. [Ambiente de Testing](#ambiente-de-testing)
3. [Datos de Prueba](#datos-de-prueba)
4. [Testing Manual](#testing-manual)
5. [Testing Automatizado](#testing-automatizado)
6. [Testing de Performance](#testing-de-performance)
7. [Testing de Seguridad](#testing-de-seguridad)
8. [Testing en Dispositivos](#testing-en-dispositivos)
9. [Reportar Bugs](#reportar-bugs)

---

## Tipos de Testing

### 1. Functional Testing
Verificar que todas las funcionalidades funcionan según especificaciones.

**Scope**:
- Login/Logout
- CRUD operations (Create, Read, Update, Delete)
- Forms y validaciones
- Navegación entre páginas
- Búsquedas y filtros
- Integraciones (WhatsApp, Lemon Squeezy, Claude)

### 2. UI/UX Testing
Verificar la experiencia de usuario.

**Scope**:
- Design consistente
- Responsive en mobile/tablet/desktop
- Feedback visual (loading, success, error)
- Accesibilidad
- Navegación intuitiva

### 3. Performance Testing
Medir velocidad y eficiencia.

**Métricas**:
- First Contentful Paint (FCP)
- Largest Contentful Paint (LCP)
- Time to Interactive (TTI)
- Cumulative Layout Shift (CLS)

**Herramientas**:
- Lighthouse
- WebPageTest
- Chrome DevTools Performance

### 4. Security Testing
Identificar vulnerabilidades.

**Areas**:
- Autenticación
- Autorización
- Input validation
- SQL injection
- XSS
- CSRF
- API keys exposure

### 5. Integration Testing
Verificar que servicios externos funcionan.

**Integraciones**:
- Supabase (Auth, Database, Storage)
- WhatsApp Business API
- Lemon Squeezy
- Claude API
- Resend (Emails)

### 6. Regression Testing
Verificar que nuevos cambios no rompan funcionalidad existente.

**Cuando**:
- Después de cada feature nueva
- Después de bug fixes
- Antes de cada deploy

---

## Ambiente de Testing

### Development
**URL**: `http://localhost:3000`

**Configuración**:
```bash
# .env.local
NEXT_PUBLIC_SUPABASE_URL=https://dev-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=dev-anon-key

# APIs en sandbox mode
WHATSAPP_ACCESS_TOKEN=sandbox-token
LEMON_SQUEEZY_API_KEY=sandbox-key
ANTHROPIC_API_KEY=dev-key
```

### Staging
**URL**: `https://staging.elenaos.com`

**Propósito**:
- Testing pre-producción
- UAT (User Acceptance Testing)
- Demos para clientes

**Datos**: Mock data similar a producción

### Production
**URL**: `https://app.elenaos.com`

**Acceso**: Solo usuarios reales

---

## Datos de Prueba

### Usuarios de Test

**Admin**:
```
Email: admin@test.elenaos.com
Password: TestAdmin123!
Role: Owner
```

**Staff**:
```
Email: elena@test.elenaos.com
Password: TestStaff123!
Role: Staff Member
```

**Cliente**:
```
Nombre: María Test
Teléfono: +34 600 000 001
Email: maria@test.com
```

### Datos Mock

**Salón de Test**:
```
Nombre: Salón Belleza Test
Dirección: Calle Test 123, Madrid
Teléfono: +34 910 000 001
CIF: B12345678
```

**Servicios**:
- Corte de Pelo: €25, 30 min
- Tinte Completo: €85, 90 min
- Mechas: €120, 120 min
- Manicura: €35, 45 min
- Pedicura: €30, 45 min

**Staff Members**:
- Elena (Owner, Color: Purple)
- Carmen (Stylist, Color: Pink)
- María (Stylist, Color: Violet)
- Ana (Nail Tech, Color: Cyan)

### Tarjetas de Prueba (Lemon Squeezy Sandbox)

```
Visa Success: 4242 4242 4242 4242
Visa Decline: 4000 0000 0000 0002
Mastercard: 5555 5555 5555 4444

CVV: cualquier 3 dígitos
Expiry: cualquier fecha futura
```

---

## Testing Manual

### Checklist Diario

Antes de commit, verificar:

1. **Build sin errores**:
```bash
npm run build
```

2. **No errores en consola**:
- Abrir DevTools
- Navegar por toda la app
- No debe haber errors rojos

3. **Responsive funciona**:
- Toggle DevTools device toolbar
- Probar mobile (375px)
- Probar tablet (768px)
- Probar desktop (1440px)

4. **Links funcionan**:
- Todos los links navegan correctamente
- No hay 404s
- Back button funciona

### Flujos Críticos

**Flujo 1: Onboarding Completo**
1. Crear cuenta nueva
2. Completar 3 pasos de onboarding
3. Ver celebración
4. Llegar a dashboard
5. Verificar datos guardados

**Flujo 2: Crear y Completar Cita**
1. Login
2. Ir a Agenda
3. Click "Nueva Cita"
4. Llenar formulario
5. Guardar
6. Verificar cita en calendario
7. Marcar como completada
8. Verificar en historial

**Flujo 3: Cliente en Riesgo → Reactivación**
1. Identificar cliente en riesgo
2. Crear campaña de reactivación
3. Enviar WhatsApp
4. Simular respuesta
5. Agendar cita
6. Ver stats actualizadas

**Flujo 4: Generar Factura**
1. Completar cita
2. Generar factura
3. Verificar cálculos
4. Enviar a cliente
5. Descargar PDF
6. Verificar en lista

**Flujo 5: Cambiar Plan de Suscripción**
1. Ir a Billing
2. Ver plan actual
3. Seleccionar nuevo plan
4. Completar checkout
5. Verificar cambio aplicado
6. Ver nueva factura

---

## Testing Automatizado

### Setup (Futuro)

ElenaOS está preparado para testing automatizado:

**E2E con Playwright**:
```bash
npm install -D @playwright/test
npm run test:e2e
```

**Unit tests con Vitest**:
```bash
npm install -D vitest @testing-library/react
npm run test:unit
```

### Ejemplos de Tests

**Test de Login**:
```typescript
// tests/e2e/auth.spec.ts
import { test, expect } from '@playwright/test'

test('should login successfully', async ({ page }) => {
  await page.goto('/login')
  
  await page.fill('input[name="email"]', 'admin@test.elenaos.com')
  await page.fill('input[name="password"]', 'TestAdmin123!')
  await page.click('button[type="submit"]')
  
  await expect(page).toHaveURL('/dashboard')
  await expect(page.locator('h1')).toContainText('Bienvenida')
})
```

**Test de Crear Cita**:
```typescript
test('should create appointment', async ({ page }) => {
  await page.goto('/dashboard/agenda')
  await page.click('button:has-text("Nueva Cita")')
  
  await page.selectOption('select[name="client"]', 'maria-test')
  await page.selectOption('select[name="service"]', 'corte')
  await page.fill('input[name="date"]', '2026-05-25')
  await page.fill('input[name="time"]', '10:00')
  
  await page.click('button:has-text("Crear")')
  
  await expect(page.locator('.toast')).toContainText('Cita creada')
})
```

**Component Test**:
```typescript
// tests/unit/PricingPlans.test.tsx
import { render, screen } from '@testing-library/react'
import { PricingPlans } from '@/components/billing/PricingPlans'

describe('PricingPlans', () => {
  it('should show 3 plans', () => {
    render(<PricingPlans currentPlan="professional" />)
    
    expect(screen.getByText('Starter')).toBeInTheDocument()
    expect(screen.getByText('Professional')).toBeInTheDocument()
    expect(screen.getByText('Enterprise')).toBeInTheDocument()
  })
  
  it('should highlight current plan', () => {
    render(<PricingPlans currentPlan="professional" />)
    
    const currentPlanCard = screen.getByText('Professional').closest('div')
    expect(currentPlanCard).toHaveClass('border-green-500')
  })
})
```

---

## Testing de Performance

### Lighthouse Audit

**Ejecutar**:
1. Abrir Chrome DevTools
2. Tab "Lighthouse"
3. Seleccionar:
   - Performance ✓
   - Accessibility ✓
   - Best Practices ✓
   - SEO ✓
4. Generate report

**Targets**:
- Performance: > 90
- Accessibility: > 90
- Best Practices: > 90
- SEO: > 80

### Core Web Vitals

**LCP (Largest Contentful Paint)**:
- Good: < 2.5s
- Needs Improvement: 2.5s - 4s
- Poor: > 4s

**FID (First Input Delay)**:
- Good: < 100ms
- Needs Improvement: 100ms - 300ms
- Poor: > 300ms

**CLS (Cumulative Layout Shift)**:
- Good: < 0.1
- Needs Improvement: 0.1 - 0.25
- Poor: > 0.25

### Bundle Size

**Verificar**:
```bash
npm run build
npm run analyze
```

**Targets**:
- Main bundle: < 200KB
- Total JS: < 500KB
- First load JS: < 300KB

### Optimizaciones

Si performance baja:

1. **Imágenes**:
   - Usar Next.js Image component
   - Lazy load con loading="lazy"
   - Convertir a WebP

2. **Code Splitting**:
   - Dynamic imports para componentes grandes
   - Route-based splitting (automático en Next.js)

3. **Caching**:
   - Service Worker para assets
   - Stale-while-revalidate strategy

4. **CSS**:
   - Purge unused CSS
   - Critical CSS inline

---

## Testing de Seguridad

### Checklist de Seguridad

**Authentication**:
- [ ] Passwords nunca en plaintext
- [ ] JWT tokens secure (httpOnly cookies)
- [ ] Session timeout funciona
- [ ] Logout invalida tokens

**Authorization**:
- [ ] RLS en Supabase activo
- [ ] Users solo acceden a su tenant
- [ ] API endpoints verifican permisos

**Input Validation**:
- [ ] Todos los inputs validados server-side
- [ ] SQL injection prevenida (usar prepared statements)
- [ ] XSS prevenida (sanitizar HTML)
- [ ] File uploads validados (tipo, tamaño)

**API Keys**:
- [ ] No expuestas en cliente
- [ ] No en git (en .gitignore)
- [ ] Rotación posible

**HTTPS**:
- [ ] Forzar HTTPS en producción
- [ ] HSTS header activo
- [ ] Secure cookies

### Tools

**OWASP ZAP**:
```bash
# Automated security scan
docker run -t owasp/zap2docker-stable zap-baseline.py -t https://staging.elenaos.com
```

**npm audit**:
```bash
npm audit
npm audit fix
```

**Snyk**:
```bash
npx snyk test
```

---

## Testing en Dispositivos

### Browsers Desktop

**Chrome**:
- Windows 10/11
- macOS
- Linux

**Firefox**:
- Windows
- macOS

**Safari**:
- macOS latest

**Edge**:
- Windows

### Devices Mobile

**iOS**:
- iPhone SE (small screen)
- iPhone 14 (standard)
- iPhone 14 Pro Max (large)
- iPad Air (tablet)

**Android**:
- Samsung Galaxy S21 (standard)
- Google Pixel 6 (standard)
- Samsung Galaxy Tab (tablet)

### Browser DevTools

**Emular dispositivos**:
1. Chrome DevTools
2. Toggle device toolbar (Cmd+Shift+M)
3. Seleccionar device
4. Rotar orientación
5. Throttle network (3G)

**Responsive Breakpoints**:
- Mobile: 320px - 767px
- Tablet: 768px - 1023px
- Desktop: 1024px+

### Real Device Testing

**BrowserStack**:
- Acceso a devices reales remotos
- Testing cross-browser
- Screenshots automatizados

**Alternativa gratis**:
- Usar dispositivos reales del equipo
- Pedir a beta testers

---

## Reportar Bugs

### Template de Bug Report

```markdown
## Bug: [Título descriptivo]

**Prioridad**: [Crítica/Alta/Media/Baja]
**Módulo**: [Dashboard/Agenda/CRM/etc]
**Encontrado por**: [Nombre]
**Fecha**: [YYYY-MM-DD]

### Descripción
Descripción clara del problema.

### Pasos para Reproducir
1. Paso 1
2. Paso 2
3. Paso 3

### Comportamiento Esperado
Qué debería pasar.

### Comportamiento Actual
Qué pasa realmente.

### Screenshots/Videos
[Adjuntar si aplica]

### Ambiente
- Browser: Chrome 122
- OS: macOS 14
- Device: MacBook Pro
- Screen: 1440x900

### Console Errors
```
[Error logs aquí]
```

### Notas Adicionales
Cualquier información relevante.
```

### Ejemplo Real

```markdown
## Bug: Factura no se genera al completar cita

**Prioridad**: Alta
**Módulo**: Facturación
**Encontrado por**: Ana Testing
**Fecha**: 2026-05-21

### Descripción
Al marcar una cita como completada, debería abrirse modal para generar factura, pero no aparece.

### Pasos para Reproducir
1. Login como admin@test.elenaos.com
2. Ir a Agenda
3. Click en cita "María - Corte"
4. Click "Marcar Completada"
5. Modal de factura no aparece

### Comportamiento Esperado
Modal de "Generar Factura" debería abrirse automáticamente.

### Comportamiento Actual
Cita se marca como completada pero modal no aparece. Usuario tiene que ir manualmente a Facturación.

### Screenshots
[adjunto: screenshot-factura-bug.png]

### Ambiente
- Browser: Chrome 122
- OS: Windows 11
- Device: Desktop
- Screen: 1920x1080

### Console Errors
```
Uncaught TypeError: Cannot read property 'open' of undefined
  at handleComplete (appointments.tsx:45)
```

### Notas Adicionales
Parece que el modal de factura no está siendo importado correctamente en el componente de cita.
```

### Prioridades

**Crítica**:
- App no carga
- No se puede login
- Pérdida de datos
- Security vulnerability

**Alta**:
- Feature principal no funciona
- Afecta a muchos usuarios
- Workaround difícil

**Media**:
- Feature secundaria no funciona
- Afecta a pocos usuarios
- Workaround existe

**Baja**:
- UI/UX issue
- Typo
- Mejora nice-to-have

---

## ✅ Checklist Pre-Deploy

Antes de cada deploy a producción:

- [ ] Todos los tests críticos pasados
- [ ] QA checklist > 95% completado
- [ ] Lighthouse score > 90
- [ ] No vulnerabilidades críticas (npm audit)
- [ ] Tested en Chrome/Firefox/Safari
- [ ] Tested en iOS y Android
- [ ] Responsive verified (mobile/tablet/desktop)
- [ ] No console errors
- [ ] Build exitoso sin warnings
- [ ] .env.production configurado
- [ ] Database migrations aplicadas
- [ ] Rollback plan documentado
- [ ] Stakeholders notificados

---

## 📚 Recursos

**Documentation**:
- [Next.js Testing](https://nextjs.org/docs/testing)
- [Playwright Docs](https://playwright.dev/)
- [WCAG Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)

**Tools**:
- [Lighthouse CI](https://github.com/GoogleChrome/lighthouse-ci)
- [WebPageTest](https://www.webpagetest.org/)
- [BrowserStack](https://www.browserstack.com/)
- [OWASP ZAP](https://www.zaproxy.org/)

**Communities**:
- [Testing Library Discord](https://discord.gg/testing-library)
- [Playwright Slack](https://aka.ms/playwright-slack)

---

**Última actualización**: Mayo 2026  
**Mantenido por**: Equipo ElenaOS
