# 📱 Configuración WhatsApp Business API

**Actualizado:** 21 Mayo 2026  
**Estado:** ✅ Integración completada (Tarea #8)

---

## 🎯 Resumen

ElenaOS integra WhatsApp Business API (Meta Cloud) para enviar mensajes automáticos de retención a clientas en riesgo. Esta es la **feature diferenciadora** del producto.

---

## 📋 Requisitos Previos

1. **Cuenta de Facebook Business:** Necesitas una cuenta de Facebook Business Manager
2. **Número de teléfono:** Un número de teléfono dedicado para WhatsApp Business
3. **Verificación:** El número debe ser verificado por Meta
4. **Templates aprobados:** Los mensajes masivos requieren templates aprobados por Meta

---

## 🚀 Setup Inicial

### 1. Crear App en Meta for Developers

1. Ir a [developers.facebook.com](https://developers.facebook.com/)
2. Crear nueva app → Tipo: **Business**
3. Nombre: "ElenaOS WhatsApp Integration"
4. Añadir producto: **WhatsApp**

### 2. Configurar WhatsApp Business API

1. En el dashboard de la app, ir a **WhatsApp → Getting Started**
2. Seleccionar o crear un **WhatsApp Business Account**
3. Añadir un número de teléfono:
   - Opción A: Usar número de prueba de Meta (solo desarrollo)
   - Opción B: Registrar tu propio número (producción)

### 3. Obtener Credenciales

Necesitas 3 valores para el archivo `.env.local`:

```bash
# WhatsApp Business API
WHATSAPP_PHONE_NUMBER_ID=<phone-number-id>
WHATSAPP_ACCESS_TOKEN=<temporary-token>
WHATSAPP_VERIFY_TOKEN=<tu-token-personalizado>
WHATSAPP_API_VERSION=v18.0
```

**Dónde encontrarlos:**

- **Phone Number ID**: WhatsApp → API Setup → Phone Number ID
- **Access Token**: WhatsApp → API Setup → Temporary access token
  - ⚠️ El token temporal expira en 24h. Para producción, genera un **System User Token** permanente
- **Verify Token**: Lo defines tú (ejemplo: `elenaos_webhook_2024`)

### 4. Configurar Webhook

El webhook permite recibir mensajes entrantes de clientas.

**En Meta:**

1. WhatsApp → Configuration → Webhook
2. Callback URL: `https://tu-dominio.com/api/webhooks/whatsapp`
3. Verify Token: El mismo que pusiste en `.env.local`
4. Webhook fields: Marca **messages**
5. Click en **Verify and Save**

**Testing local con ngrok:**

```bash
# Instalar ngrok
brew install ngrok

# Iniciar tunnel
ngrok http 3000

# Usar la URL de ngrok como Callback URL
# Ejemplo: https://abc123.ngrok.io/api/webhooks/whatsapp
```

### 5. Aprobar Templates de Mensajes

Los templates deben ser pre-aprobados por Meta antes de usarlos.

**Crear template:**

1. WhatsApp → Message Templates → Create Template
2. Elegir categoría:
   - **UTILITY**: Recordatorios, confirmaciones (alta prioridad de aprobación)
   - **MARKETING**: Ofertas, promociones (requiere opt-in)
3. Nombre: `appointment_reminder` (solo minúsculas y guiones bajos)
4. Idioma: **Spanish**
5. Contenido: Ver `lib/whatsapp/templates.ts` para los templates recomendados

**Ejemplo template UTILITY:**

```
Hola {{1}}! 👋

Te recordamos tu cita:
📅 {{2}}
⏰ {{3}}
💅 {{4}}

¡Te esperamos!
```

**Tiempo de aprobación:** 15 minutos - 24 horas

---

## 🧪 Testing

### Test 1: Verificar Webhook

```bash
# El webhook debe responder al challenge de Meta
curl "http://localhost:3000/api/webhooks/whatsapp?hub.mode=subscribe&hub.verify_token=tu-token&hub.challenge=test123"

# Debe devolver: test123
```

### Test 2: Enviar Mensaje de Prueba

Desde la consola de Meta:

1. WhatsApp → API Setup
2. En "Send and receive messages"
3. To: Tu número de teléfono
4. Message: "Test message"
5. Send message

Deberías recibir el mensaje en WhatsApp.

### Test 3: Enviar Mensaje desde ElenaOS

1. Ir a una ficha de clienta
2. Click en "Enviar WhatsApp"
3. Escribir mensaje o usar "Generar con IA"
4. Enviar

**Verificar:**
- El mensaje llega a WhatsApp de la clienta
- Se guarda en la base de datos (tabla `whatsapp_messages`)
- El webhook recibe respuestas

---

## 📦 Archivos Creados

### Backend
- `lib/whatsapp/client.ts` — Cliente para WhatsApp Business API
- `lib/whatsapp/templates.ts` — Templates de mensajes pre-aprobados
- `app/api/webhooks/whatsapp/route.ts` — Webhook GET (verify) y POST (receive)
- `app/api/whatsapp/send/route.ts` — API para enviar mensajes

### Frontend
- `components/whatsapp/SendMessageModal.tsx` — Modal para enviar mensajes

---

## 🔑 Funcionalidades Implementadas

### Cliente WhatsApp (`lib/whatsapp/client.ts`)

```typescript
const whatsapp = getWhatsAppClient()

// Enviar mensaje simple
await whatsapp.sendTextMessage('+34666123456', 'Hola!')

// Enviar con template
await whatsapp.sendTemplateMessage('+34666123456', 'appointment_reminder', 'es', components)

// Recordatorio de cita
await whatsapp.sendAppointmentReminder(phone, name, date, time, service)

// Mensaje de retención
await whatsapp.sendRetentionMessage(phone, name, daysSinceLastVisit)

// Verificar webhook
whatsapp.verifyWebhook(mode, token, challenge)

// Procesar mensaje entrante
whatsapp.processIncomingMessage(webhookBody)
```

### Templates Disponibles

Ver `lib/whatsapp/templates.ts`:

1. **appointment_reminder** — Recordatorio de cita
2. **appointment_confirmation** — Confirmación de cita
3. **retention_message** — Cliente en riesgo
4. **special_offer** — Oferta especial
5. **post_visit_thanks** — Agradecimiento post-visita
6. **appointment_cancelled** — Cancelación de cita

---

## 🛡️ Seguridad y Cumplimiento

### RGPD y Opt-out

```typescript
// Verificar consentimiento antes de enviar
if (client.whatsapp_opt_out) {
  // NO enviar mensaje
  return { error: 'Cliente opt-out' }
}

if (!client.marketing_consent && messageType === 'MARKETING') {
  // NO enviar mensajes de marketing sin consentimiento
  return { error: 'Sin consentimiento de marketing' }
}
```

### Rate Limits

WhatsApp tiene límites de mensajes:

- **Tier 1**: 1,000 conversaciones únicas / 24h
- **Tier 2**: 10,000 conversaciones únicas / 24h (tras verificación)
- **Tier 3**: 100,000 conversaciones únicas / 24h

**Implementar rate limiting en producción.**

### Costos

- **Conversaciones de Servicio** (UTILITY): ~€0.005 por conversación
- **Conversaciones de Marketing**: ~€0.009 por conversación
- **Ventana de 24h**: Mensajes gratis dentro de 24h tras respuesta de la clienta

---

## 🚀 Próximos Pasos

### Tarea #9: Motor de Predicción con IA

Implementar el motor que:
1. Calcula score de riesgo por clienta
2. Predice próxima visita
3. Identifica clientas en riesgo automáticamente
4. Genera mensajes personalizados con Claude
5. Programa envíos automáticos

### Tarea #10: UI del Módulo de Retención

Crear dashboard de retención:
- Lista de clientas en riesgo
- Campañas programadas
- Historial de mensajes
- Métricas de conversión

---

## 📊 Métricas a Monitorear

- **Mensajes enviados** por día/semana/mes
- **Tasa de respuesta** de clientas
- **Tasa de conversión** (respuesta → cita agendada)
- **ROI** (costo mensajes vs. ingresos recuperados)
- **Opt-out rate** (clientas que rechazan mensajes)

---

## 🐛 Troubleshooting

### Error: "Webhook verification failed"

**Causa:** El verify token no coincide  
**Solución:** Verificar que `WHATSAPP_VERIFY_TOKEN` en `.env.local` coincide con el token en Meta

### Error: "Invalid access token"

**Causa:** Token expirado o inválido  
**Solución:**
1. Generar nuevo token temporal en Meta
2. Para producción, crear System User Token permanente

### Error: "Message template not found"

**Causa:** Template no aprobado o nombre incorrecto  
**Solución:**
1. Verificar que el template esté aprobado en Meta
2. Usar el nombre exacto (case sensitive)
3. Esperar aprobación si acaba de crearse

### Mensajes no llegan

**Verificar:**
1. Número de teléfono en formato internacional (+34...)
2. Template aprobado (para templates)
3. Cliente no ha bloqueado el número
4. Cliente tiene WhatsApp en ese número
5. Rate limit no excedido

---

## 📚 Referencias

- [WhatsApp Business API Docs](https://developers.facebook.com/docs/whatsapp/cloud-api)
- [Message Templates](https://developers.facebook.com/docs/whatsapp/message-templates)
- [Webhooks](https://developers.facebook.com/docs/whatsapp/webhooks)
- [Pricing](https://developers.facebook.com/docs/whatsapp/pricing)

---

**Última actualización:** 21 Mayo 2026  
**Responsable:** Claude (Powered by Rommer Volcanes)
