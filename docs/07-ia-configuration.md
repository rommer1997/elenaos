# 🤖 Configuración de IA en ElenaOS

ElenaOS usa IA para generar mensajes de retención personalizados para tus clientas. Tienes dos opciones:

## Opciones disponibles

### 1️⃣ Google Gemini (RECOMENDADO - GRATIS) ⭐

**Modelo:** Gemini 2.0 Flash Experimental

**Ventajas:**
- ✅ **Completamente gratis** hasta 1,500 requests/día
- ✅ Ultra-rápido (generación en < 1 segundo)
- ✅ Excelente calidad en español
- ✅ Setup súper simple (1 API key)
- ✅ Suficiente para 99% de salones

**Límites gratuitos:**
- 1,500 requests/día (RPD)
- 15 requests/minuto (RPM)
- 32,000 tokens por request
- Contexto de 1M tokens

**¿Es suficiente?**
Para un salón típico con 50 clientas en riesgo, generarías ~50 mensajes/día = **3% del límite**. Sobra muchísimo.

**Cómo configurar:**
Ver guía completa en: `CONFIGURAR-GEMINI.md`

**Resumen rápido:**
1. Obtén API key: https://aistudio.google.com/apikey
2. Añade a `.env.local`: `GEMINI_API_KEY=tu-key-aqui`
3. Reinicia el servidor

---

### 2️⃣ Anthropic Claude (Alternativa - DE PAGO)

**Modelo:** Claude 3.5 Sonnet

**Ventajas:**
- ⭐ Máxima calidad en generación de texto
- ⭐ Mejor comprensión de contexto complejo
- ⭐ Excelente en tareas creativas

**Desventajas:**
- ❌ **De pago desde el primer request**
- ❌ $3 por 1 millón de tokens (input)
- ❌ $15 por 1 millón de tokens (output)

**Costo estimado:**
- 1 mensaje de retención ≈ 500 tokens ≈ $0.0015
- 1,000 mensajes/mes ≈ $1.50/mes
- 10,000 mensajes/mes ≈ $15/mes

**¿Cuándo usar Claude?**
- Si superas los límites gratuitos de Gemini
- Si necesitas la máxima calidad posible
- Si ya tienes créditos de Anthropic

**Cómo configurar:**
1. Obtén API key: https://console.anthropic.com/settings/keys
2. Añade a `.env.local`: `ANTHROPIC_API_KEY=tu-key-aqui`
3. Reinicia el servidor

---

## Configuración del sistema

ElenaOS detecta automáticamente qué proveedor usar basándose en las variables de entorno:

### Prioridad de selección:

1. **Si existe `GEMINI_API_KEY`** → Usa Gemini (gratis)
2. **Si NO existe Gemini pero sí `ANTHROPIC_API_KEY`** → Usa Claude (de pago)
3. **Si NO existe ninguna** → Usa mensajes de fallback (generados sin IA)

### Ambos configurados (fallback automático):

Si tienes **ambas API keys** configuradas:

- ✅ Prioridad: Gemini (por ser gratis)
- ✅ Fallback: Si Gemini falla → usa Claude
- ✅ Fallback final: Si ambos fallan → mensajes genéricos

---

## Comparación detallada

| Característica | Gemini 2.0 Flash | Claude 3.5 Sonnet |
|----------------|------------------|-------------------|
| **Precio** | ✅ Gratis (1.5K/día) | ❌ $3-15/1M tokens |
| **Latencia** | ⚡ < 1 seg | 🚀 1-2 seg |
| **Calidad mensajes** | ⭐⭐⭐⭐ (9/10) | ⭐⭐⭐⭐⭐ (10/10) |
| **Español** | ✅ Nativo | ✅ Excelente |
| **Contexto** | 1M tokens | 200K tokens |
| **Personalización** | ⭐⭐⭐⭐ Alta | ⭐⭐⭐⭐⭐ Máxima |
| **Setup** | ✅ 2 minutos | ⚠️ 5 minutos + billing |
| **Limitaciones** | 1.5K requests/día | Solo límite de $$ |

---

## Ejemplos de mensajes generados

### Ejemplo 1: Cliente fiel (10+ visitas)

**Contexto:**
- Carmen, 35 años
- 12 visitas en el último año
- Última visita: hace 45 días (habitual: 30 días)
- Servicio favorito: Manicura + Pedicura

**Gemini:**
> Hola Carmen! 👋 Hace más de un mes que no te vemos y te echamos de menos. Tenemos hueco esta semana para tu manicura y pedicura favoritas. ¿Te viene bien el jueves por la tarde? Responde cuando puedas! 💅

**Claude:**
> Hola Carmen! Te echamos de menos por aquí. Hace ya 45 días desde tu última manicura y solemos verte cada mes. ¿Qué te parece si reservamos algo para esta semana? Tengo varios huecos que te pueden ir bien. ¡Espero verte pronto!

**Calidad:** Ambos excelentes, muy similares.

---

### Ejemplo 2: Cliente nueva (2-3 visitas)

**Contexto:**
- Laura, 28 años
- 3 visitas en total
- Última visita: hace 60 días
- Sin patrón claro aún

**Gemini:**
> Hola Laura! ¿Qué tal todo? Hace tiempo que no sabemos de ti y nos encantaría verte de nuevo por aquí. Si te apetece reservar una cita, tenemos disponibilidad estos días. ¡Un abrazo! 😊

**Claude:**
> Hola Laura! Vimos que hace tiempo que no vienes y queríamos saber cómo estás. Si necesitas reservar una cita o tienes alguna consulta, estamos aquí para ayudarte. ¡Esperamos saber de ti pronto!

**Calidad:** Gemini más casual, Claude más profesional. Ambos apropiados.

---

## Recomendación según tipo de negocio

### ✅ Usa Gemini si:
- Eres un salón pequeño/mediano (< 200 clientas)
- Quieres empezar sin inversión
- Generas < 1,500 mensajes/día
- La calidad de Gemini te parece suficiente (lo es)

### ✅ Usa Claude si:
- Eres una cadena grande (> 500 clientas)
- Generas > 1,500 mensajes/día
- Necesitas el máximo control de tono y personalización
- El presupuesto no es un problema

### ✅ Usa ambos si:
- Quieres Gemini como primario (gratis)
- Quieres Claude como fallback premium
- Quieres A/B testing entre ambos

---

## Monitoreo de uso

### Gemini:
- Dashboard: https://aistudio.google.com/apikey
- Ver requests por día
- Alertas cuando te acerques al límite

### Claude:
- Dashboard: https://console.anthropic.com/settings/usage
- Ver tokens consumidos
- Ver facturación mensual

---

## Migración entre proveedores

### De Claude → Gemini (para ahorrar):

1. Obtén API key de Gemini
2. Añade `GEMINI_API_KEY` a `.env.local`
3. Reinicia el servidor
4. (Opcional) Comenta `ANTHROPIC_API_KEY`

### De Gemini → Claude (para más calidad):

1. Obtén API key de Claude
2. Comenta `GEMINI_API_KEY` en `.env.local`
3. Añade `ANTHROPIC_API_KEY`
4. Habilita billing en Anthropic
5. Reinicia el servidor

### Usar ambos (fallback automático):

1. Configura ambas API keys
2. El sistema automáticamente:
   - Intenta Gemini primero
   - Si falla, intenta Claude
   - Si ambos fallan, mensaje genérico

---

## Límites y consideraciones

### Gemini (gratis):
- ✅ 1,500 requests/día = suficiente para 99% de casos
- ⚠️ Si superas el límite, espera al día siguiente
- ⚠️ O configura Claude como fallback

### Claude (de pago):
- ✅ Sin límites de requests (solo de $$)
- ⚠️ Facturación mensual basada en uso
- ⚠️ Necesitas configurar método de pago

---

## Troubleshooting

### "No se pudo generar mensaje con IA"

**Posibles causas:**
1. No hay API key configurada
2. API key inválida o expirada
3. Límite de requests excedido (Gemini)
4. Créditos agotados (Claude)
5. Servicio caído

**Solución:**
El sistema usará un mensaje de fallback genérico (no requiere IA).

---

## Preguntas frecuentes

**¿Puedo cambiar de proveedor en cualquier momento?**
Sí, solo cambia la env var y reinicia el servidor.

**¿Los mensajes son mejores con Claude?**
Ligeramente, pero para mensajes de retención, Gemini es más que suficiente.

**¿Qué pasa si se acaban los créditos/límites?**
El sistema usa mensajes de fallback automáticamente.

**¿Puedo entrenar los modelos con mis datos?**
No directamente, pero puedes ajustar los prompts en el código.

**¿Es seguro enviar datos de clientas a la IA?**
Sí, ni Gemini ni Claude almacenan datos de las requests. Todo es efímero.

---

## Configuración recomendada para empezar

**Para salones pequeños/medianos:**

```bash
# .env.local
GEMINI_API_KEY=tu-key-aqui
```

**Para salones grandes o cadenas:**

```bash
# .env.local
GEMINI_API_KEY=tu-key-aqui  # Primario (gratis)
ANTHROPIC_API_KEY=tu-key-aqui  # Fallback (de pago)
```

---

## Próximos pasos

1. **Lee la guía de Gemini:** `CONFIGURAR-GEMINI.md`
2. **Obtén tu API key:** https://aistudio.google.com/apikey
3. **Configura `.env.local`**
4. **Prueba generando un mensaje** desde la app

---

**Última actualización:** 2026-05-22  
**Modelo recomendado:** Gemini 2.0 Flash (gratis)  
**Alternativa premium:** Claude 3.5 Sonnet (de pago)
