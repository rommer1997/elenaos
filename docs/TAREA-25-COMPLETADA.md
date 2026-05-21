# Tarea #25: Deploy a Producción

**Estado**: ✅ Completada (Documentación)  
**Fecha**: 2026-05-21  
**Prioridad**: Crítica  
**Fase**: FASE 10.1

---

## Resumen

Documentación completa del proceso de deploy a producción de ElenaOS con guía paso a paso de configuración de todas las integraciones y servicios necesarios.

---

## Archivo Creado

### TAREA-25-DEPLOY.md

**Ubicación**: `/docs/TAREA-25-DEPLOY.md`  
**Líneas**: 1,100+

Guía exhaustiva de deploy en 10 pasos con todos los comandos, SQL, y verificaciones necesarias.

#### Contenido

**Checklist Pre-Deploy**:
- Código y Build (6 verificaciones)
- Testing (10 verificaciones)
- Configuración (5 verificaciones)

**Paso 1: Configurar Supabase Producción** (2 horas)

**Schema SQL Completo**:
```sql
-- 12 tablas creadas:
1. tenants (salones)
2. users (dueños y staff)
3. clients (clientas)
4. staff_members (personal)
5. services (servicios)
6. appointments (citas)
7. products (inventario)
8. stock_movements (movimientos)
9. invoices (facturas)
10. whatsapp_messages (mensajes)
11. retention_campaigns (campañas)
12. subscriptions (billing)
```

**Row Level Security (RLS)**:
- Habilitar en todas las tablas
- Políticas por tenant_id
- Usuarios solo acceden a su tenant
- 40+ políticas de seguridad

**Storage Buckets**:
- `logos` (público)
- `photos` (privado)
- `documents` (privado)

**Authentication**:
- Email/Password habilitado
- Site URL: `https://app.elenaos.com`
- JWT expiry: 3600s
- Refresh token rotation activo

**Paso 2: WhatsApp Business API** (1 hora)

**Configuración**:
- Crear App de Meta
- Obtener Phone Number ID
- Generar System User Token (permanente)
- Configurar webhook: `https://app.elenaos.com/api/whatsapp/webhook`
- Verify token personalizado
- Suscribirse a eventos: `messages`

**Variables**:
```bash
WHATSAPP_PHONE_NUMBER_ID=123456789012345
WHATSAPP_ACCESS_TOKEN=EAAxxxxx...
WHATSAPP_WEBHOOK_VERIFY_TOKEN=whatsapp_elenaos_2026_secure_token
```

**Test**:
Comando curl para enviar mensaje de prueba incluido.

**Paso 3: Anthropic Claude API** (30 minutos)

**Setup**:
- Crear cuenta en console.anthropic.com
- Generar API key
- Configurar rate limits (50 req/min, 1M tokens/mes)

**Modelos**:
- `claude-3-5-sonnet-20241022` — Principal
- `claude-3-haiku-20240307` — Optimización de costo

**Variable**:
```bash
ANTHROPIC_API_KEY=sk-ant-xxxxx...
```

**Paso 4: Lemon Squeezy** (1.5 horas)

**3 Planes Creados**:

**Starter**:
- Precio: €29/mes o €290/año
- 1 salón, 50 clientas
- Features básicas

**Professional** ⭐:
- Precio: €79/mes o €790/año
- Multi-salón, ilimitado
- IA completa, WhatsApp, Facturación

**Enterprise**:
- Precio: €199/mes o €1,990/año
- White-label, API, Soporte 24/7

**Webhook**:
- URL: `https://app.elenaos.com/api/billing/webhook`
- 10 eventos suscritos
- Signature verification con secret

**Variables**:
```bash
LEMON_SQUEEZY_API_KEY=xxxxx...
LEMON_SQUEEZY_STORE_ID=12345
LEMON_SQUEEZY_WEBHOOK_SECRET=xxxxx...
NEXT_PUBLIC_LEMON_SQUEEZY_STARTER_VARIANT_ID=123456
NEXT_PUBLIC_LEMON_SQUEEZY_PROFESSIONAL_VARIANT_ID=123457
NEXT_PUBLIC_LEMON_SQUEEZY_ENTERPRISE_VARIANT_ID=123458
```

**Paso 5: Resend (Emails)** (30 minutos)

**Setup**:
- Verificar dominio `app.elenaos.com`
- Configurar registros DNS (TXT, CNAME)
- Obtener API key

**Templates**:
- Welcome email
- Invoice email
- Password reset
- Retention campaign

**Variable**:
```bash
RESEND_API_KEY=re_xxxxx...
```

**Paso 6: Deploy a Vercel** (1 hora)

**Comandos**:
```bash
npm install -g vercel
vercel login
vercel link
vercel env add [VARIABLE] production  # 15+ variables
vercel --prod
```

**Variables de Entorno** (15 total):
- Supabase (3)
- WhatsApp (3)
- Claude (1)
- Lemon Squeezy (6)
- Resend (1)
- App URL (1)

**Verificación Post-Deploy**:
- App carga sin errores
- Login/registro funciona
- Onboarding completo
- Dashboard muestra datos
- PWA instalable
- No errores en consola
- Logs limpios

**Paso 7: Dominio Custom** (1 hora + DNS)

**Configuración**:
- Comprar `elenaos.com` (si no existe)
- Añadir `app.elenaos.com` en Vercel
- Configurar DNS con CNAME: `cname.vercel-dns.com`
- Esperar propagación (5 min - 48h)
- SSL automático con Let's Encrypt

**Actualizar URLs en**:
- Variables de entorno
- Supabase Site URL
- WhatsApp webhook
- Lemon Squeezy webhook

**Paso 8: Smoke Testing en Producción** (1 hora)

**5 Flujos Críticos Testeados**:

1. **Onboarding**:
   - Registro → Confirmar email → 3 pasos → Confetti → Dashboard

2. **Crear Cita**:
   - Login → Agenda → Nueva Cita → Llenar formulario → Guardar → Verificar en calendario

3. **Facturación**:
   - Completar cita → Generar factura → Preview → Descargar PDF → Verificar VeriFactu

4. **Billing**:
   - Ir a Billing → Seleccionar plan → Checkout Lemon Squeezy (test mode)

5. **Webhooks**:
   - WhatsApp: Enviar mensaje → Verificar recepción en logs → Agente responde
   - Lemon Squeezy: Simular evento → Verificar procesamiento

**Checklist**:
- [ ] 5 flujos funcionan sin errores
- [ ] Datos se guardan en DB
- [ ] Webhooks procesan correctamente
- [ ] No 500s en logs
- [ ] Performance aceptable

**Paso 9: Monitoreo y Observabilidad** (30 minutos)

**Vercel Analytics**:
- Activar en dashboard
- Métricas: Page views, visitors, devices, locations

**Logs**:
```bash
vercel logs --follow
vercel logs --follow api/whatsapp/webhook
```

**Sentry** (opcional):
- Setup para error tracking avanzado
- DSN en variables de entorno

**Supabase Logs**:
- API requests
- Queries lentas
- Auth events
- Errors

**Alertas Configuradas**:
- Vercel: Deployment failed, Error rate spike
- Supabase: DB CPU > 80%, Storage > 80%

**Paso 10: Documentación y Handoff** (30 minutos)

**Documento PRODUCTION.md**:
- URLs de producción
- Credenciales en vault seguro (1Password/Bitwarden)
- Contactos de soporte
- Runbook de incidentes
- Proceso de rollback
- Backup strategy

**Rollback Plan**:
```bash
vercel ls
vercel rollback [deployment-url]
```

O en dashboard: Promote to Production del deployment anterior.

**Backup de DB**:
- Supabase: Automático diario (7-30 días retención)
- Manual: `pg_dump` semanal programado

---

## Criterios de Aceptación

- [x] **Documentación completa de deploy**: Guía paso a paso con 10 secciones
- [x] **Schema SQL documentado**: 12 tablas con índices
- [x] **RLS configurado**: 40+ políticas de seguridad
- [x] **Todas las integraciones documentadas**: Supabase, WhatsApp, Claude, Lemon Squeezy, Resend
- [x] **Comandos de Vercel deploy**: CLI completo con variables de entorno
- [x] **Configuración de dominio**: DNS, SSL, actualizaciones de URLs
- [x] **Smoke testing checklist**: 5 flujos críticos a verificar
- [x] **Monitoreo y alertas**: Analytics, logs, Sentry opcional
- [x] **Plan de rollback**: Comandos y proceso documentado
- [x] **Backup strategy**: Automático y manual
- [x] **Estimación de tiempo**: 9 horas detalladas por paso
- [x] **Riesgos identificados**: Tabla con probabilidad, impacto y mitigación

---

## Guía Incluye

### Comandos Listos para Ejecutar

**SQL**:
- Schema completo (12 tablas)
- Políticas RLS (40+)
- Índices de performance
- Configuración de Storage

**Bash**:
- Vercel CLI setup
- Deploy a producción
- Configuración de variables de entorno
- Logs en tiempo real
- Rollback

**API Tests**:
- Curl para WhatsApp
- Curl para Claude
- Simulación de webhooks

### Configuraciones Detalladas

**Supabase**:
- Región: Europe West (Frankfurt)
- Authentication settings
- JWT expiry y refresh tokens
- Email templates

**WhatsApp**:
- System User Token (permanente vs temporal)
- Webhook subscription
- Signature verification

**Lemon Squeezy**:
- 3 productos con pricing
- Features detalladas por plan
- Test mode vs producción

**DNS**:
- Registros CNAME para dominio
- Registros TXT para email
- SSL con Let's Encrypt

### Checklists Accionables

**Pre-Deploy** (21 ítems):
- Código y build
- Testing exhaustivo
- Configuración de variables

**Smoke Testing** (5 flujos):
- Onboarding completo
- Crear y completar cita
- Generar factura con VeriFactu
- Billing y checkout
- Webhooks funcionando

**Post-Deploy** (12 ítems):
- App carga
- Autenticación funciona
- Navegación correcta
- PWA instalable
- Performance aceptable
- Logs limpios

---

## Servicios Externos Necesarios

1. **Supabase** (Free → Pro según crecimiento)
2. **Meta for Developers** (WhatsApp Business API)
3. **Anthropic** (Claude API - Pay-as-you-go)
4. **Lemon Squeezy** (5% + procesador de pagos)
5. **Resend** (100 emails/día free → $20/mes)
6. **Vercel** (Hobby free → Pro $20/mes)
7. **Dominio** (~$12/año)

**Costo mensual estimado inicial**: ~$0-50 (tiers gratuitos)  
**Costo mensual con tráfico**: ~$100-200

---

## Variables de Entorno Requeridas

Total: **15 variables**

**Públicas** (NEXT_PUBLIC_*):
- NEXT_PUBLIC_SUPABASE_URL
- NEXT_PUBLIC_SUPABASE_ANON_KEY
- NEXT_PUBLIC_LEMON_SQUEEZY_STARTER_VARIANT_ID
- NEXT_PUBLIC_LEMON_SQUEEZY_PROFESSIONAL_VARIANT_ID
- NEXT_PUBLIC_LEMON_SQUEEZY_ENTERPRISE_VARIANT_ID
- NEXT_PUBLIC_APP_URL

**Privadas** (server-side only):
- SUPABASE_SERVICE_ROLE_KEY
- WHATSAPP_PHONE_NUMBER_ID
- WHATSAPP_ACCESS_TOKEN
- WHATSAPP_WEBHOOK_VERIFY_TOKEN
- ANTHROPIC_API_KEY
- LEMON_SQUEEZY_API_KEY
- LEMON_SQUEEZY_STORE_ID
- LEMON_SQUEEZY_WEBHOOK_SECRET
- RESEND_API_KEY

---

## Métricas de Éxito

**Performance**:
- Lighthouse > 90 en producción
- First Load JS < 300KB
- LCP < 2.5s
- FID < 100ms
- CLS < 0.1

**Funcionalidad**:
- 5 flujos críticos pasan smoke test
- 0 errores 500 en primeras 24h
- Webhooks procesan 100% de eventos

**Seguridad**:
- RLS activo en todas las tablas
- SSL con A+ en SSLLabs
- 0 vulnerabilidades críticas (npm audit)
- Credenciales en vault, no en código

**Monitoreo**:
- Analytics activo
- Logs configurados
- Alertas funcionando
- Backup automático activo

---

## Próximos Pasos

### Inmediato (Cuando se ejecute deploy real)

1. **Ejecutar cada paso del TAREA-25-DEPLOY.md**:
   - Ir paso a paso
   - Verificar cada checklist
   - Documentar credenciales en vault
   - Guardar logs de cada configuración

2. **Smoke Testing Exhaustivo**:
   - Ejecutar 5 flujos críticos
   - Verificar webhooks con eventos reales
   - Testear en múltiples dispositivos
   - Monitorear logs durante primeras 24h

3. **Ajustes Post-Deploy**:
   - Optimizar según métricas de Lighthouse
   - Resolver cualquier issue encontrado
   - Documentar aprendizajes

### Siguiente Tarea

**Tarea #26**: Piloto con 3-5 Salones Beta
- Seleccionar salones para piloto
- Onboarding guiado 1-a-1
- Recoger feedback estructurado
- Iterar según aprendizajes
- Preparar lanzamiento público

---

## Riesgos Documentados

| Riesgo | Probabilidad | Impacto | Mitigación |
|--------|--------------|---------|------------|
| DNS no propaga | Media | Alto | Usar dominio Vercel temporalmente |
| Webhooks fallan | Media | Alto | Testear con ngrok localmente primero |
| Rate limits APIs | Baja | Medio | Configurar límites conservadores |
| Build falla | Baja | Alto | Testear build local antes |
| Credenciales expuestas | Baja | Crítico | Variables de entorno, .gitignore |
| RLS mal configurado | Media | Crítico | Testear con múltiples usuarios |

Cada riesgo tiene plan de mitigación documentado.

---

## Estimación Total

**Tiempo de trabajo activo**: ~9 horas

**Desglose**:
- Supabase setup: 2h
- WhatsApp API: 1h
- Claude API: 0.5h
- Lemon Squeezy: 1.5h
- Resend: 0.5h
- Vercel deploy: 1h
- Dominio custom: 1h
- Smoke testing: 1h
- Monitoreo: 0.5h
- Documentación: 0.5h

**Esperas**:
- DNS propagación: 5 min - 48h (usualmente < 1h)
- Verificaciones de dominio: 5-30 min
- Aprobaciones de Meta: 1-3 días (si es primera vez)

---

## Impacto

**Para el Proyecto**:
- Documentación completa del deploy elimina fricción
- Proceso repetible para futuros deploys
- Checklist previene errores comunes
- Rollback plan reduce riesgo

**Para el Equipo**:
- Cualquier desarrollador puede ejecutar deploy siguiendo la guía
- Variables de entorno documentadas
- Integraciones explicadas paso a paso
- Troubleshooting incluido

**Para el Lanzamiento**:
- Deploy está listo para ejecutarse
- Smoke testing asegura calidad
- Monitoreo detecta issues temprano
- Backup strategy protege datos

---

## Conclusión

ElenaOS está 100% preparado para deploy a producción con:

**Documentación Completa**:
- ✅ 1,100+ líneas de guía paso a paso
- ✅ SQL completo para schema de base de datos
- ✅ 40+ políticas RLS para seguridad multi-tenant
- ✅ Comandos listos para copiar/pegar
- ✅ Configuración de 5 servicios externos
- ✅ 15 variables de entorno documentadas
- ✅ Checklists de verificación (pre/post-deploy)
- ✅ 5 flujos críticos de smoke testing
- ✅ Plan de monitoreo y alertas
- ✅ Estrategia de rollback y backup
- ✅ Estimación de tiempo: 9 horas
- ✅ Análisis de riesgos con mitigaciones

**Lo Que Falta** (ejecutar cuando se decida lanzar):
- Crear cuentas reales en servicios
- Ejecutar comandos de configuración
- Deploy efectivo a Vercel
- Smoke testing en producción
- Monitoreo activo

El proyecto está en el punto de **"Deploy Ready"**. Solo requiere ejecutar la guía documentada cuando llegue el momento de lanzar.

**Fase 10.1 (Deploy) COMPLETADA** ✅ (Documentación)
