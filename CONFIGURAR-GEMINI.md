# 🤖 Configurar Google Gemini (IA GRATUITA)

## ¿Por qué Gemini en lugar de Claude?

✅ **GRATIS:** 1,500 requests por día sin costo  
✅ **RÁPIDO:** Gemini 2.0 Flash es ultra-rápido  
✅ **FÁCIL:** Una sola API key, sin configuración compleja  
✅ **SUFICIENTE:** Para un salón, 1,500 mensajes/día es más que suficiente  

❌ **Claude:** Requiere pago desde el primer request ($3-5 por cada 1M tokens)

---

## Paso 1: Obtener tu API Key de Gemini (2 minutos)

1. **Ve a Google AI Studio:**
   - URL: https://aistudio.google.com/apikey

2. **Inicia sesión** con tu cuenta de Google

3. **Haz clic en "Get API Key"** (botón azul arriba a la derecha)

4. **Selecciona o crea un proyecto:**
   - Si no tienes uno, haz clic en "Create API key in new project"
   - Si ya tienes uno, selecciónalo

5. **Copia tu API Key:**
   - Se verá algo como: `AIzaSyDx1234567890abcdefghijklmnop`
   - Guárdala en un lugar seguro

---

## Paso 2: Configurar en tu proyecto (1 minuto)

### Opción A: Si tienes `.env.local`

1. Abre el archivo `.env.local` en la raíz del proyecto
2. Añade o actualiza esta línea:

```bash
GEMINI_API_KEY=AIzaSyDx1234567890abcdefghijklmnop
```

3. Guarda el archivo

### Opción B: Si NO tienes `.env.local`

1. Copia el archivo `.env.example` y renómbralo a `.env.local`:

```bash
cp .env.example .env.local
```

2. Abre `.env.local` y busca la línea:

```bash
GEMINI_API_KEY=tu-gemini-api-key-aqui
```

3. Reemplaza `tu-gemini-api-key-aqui` con tu API key real
4. Guarda el archivo

---

## Paso 3: Instalar dependencias (30 segundos)

```bash
npm install
```

Esto instalará `@google/generative-ai` automáticamente.

---

## Paso 4: Reiniciar el servidor (10 segundos)

Si tu servidor de desarrollo ya estaba corriendo:

1. Detén el servidor (Ctrl + C)
2. Vuelve a iniciarlo:

```bash
npm run dev
```

---

## Paso 5: Probar que funciona (1 minuto)

### Opción A: Desde la aplicación

1. Ve a la página de **Retención** en tu dashboard
2. Selecciona una clienta
3. Haz clic en **"Generar mensaje con IA"**
4. Deberías ver un mensaje generado por Gemini

### Opción B: Desde la consola del servidor

Busca en los logs del servidor una línea como:

```
[AI] Mensaje generado con Gemini
```

Si ves esto, ¡funciona! ✅

---

## Límites del tier gratuito de Gemini

| Límite | Valor |
|--------|-------|
| Requests por día | 1,500 |
| Requests por minuto | 15 |
| Tokens por request | 32,000 |
| Contexto | 1M tokens |

**¿Es suficiente?**

Para un salón típico:
- 50 mensajes de retención por día = **3% del límite**
- 200 mensajes por día = **13% del límite**
- 1,000 mensajes por día = **66% del límite**

**Conclusión:** Más que suficiente para empezar. Si creces mucho, puedes subir al tier de pago ($7/1M tokens).

---

## Comparación Gemini vs Claude

| Característica | Gemini 2.0 Flash | Claude 3.5 Sonnet |
|----------------|------------------|-------------------|
| **Precio** | ✅ GRATIS (1,500/día) | ❌ $3/1M tokens |
| **Velocidad** | ⚡ Ultra-rápido | 🚀 Rápido |
| **Calidad** | ⭐⭐⭐⭐ Excelente | ⭐⭐⭐⭐⭐ Mejor |
| **Contexto** | 1M tokens | 200K tokens |
| **Español** | ✅ Nativo | ✅ Excelente |
| **Setup** | ✅ 1 API key | ⚠️ Requiere cuenta |

**Recomendación:** Empieza con Gemini gratis. Si necesitas MÁS calidad o superas los límites, cambia a Claude (fácil, solo cambiar la env var).

---

## Troubleshooting

### Error: "GEMINI_API_KEY is not defined"

**Causa:** No se cargó la variable de entorno.

**Solución:**
1. Verifica que `.env.local` existe
2. Verifica que la línea `GEMINI_API_KEY=...` está presente
3. Reinicia el servidor (`npm run dev`)

### Error: "API key not valid"

**Causa:** La API key es incorrecta o expiró.

**Solución:**
1. Ve a https://aistudio.google.com/apikey
2. Verifica que la key es correcta
3. Si expiró, genera una nueva
4. Actualiza `.env.local` con la nueva key
5. Reinicia el servidor

### Error: "Quota exceeded"

**Causa:** Superaste los 1,500 requests diarios.

**Solución:**
1. Espera hasta mañana (se resetea a las 00:00 UTC)
2. O configura Claude como fallback (ver abajo)

### Error: "Failed to generate message"

**Causa:** Gemini está caído o hay un problema de red.

**Solución:**
1. Verifica tu conexión a internet
2. Verifica el status de Gemini: https://status.cloud.google.com
3. El sistema automáticamente usará un mensaje de fallback

---

## Configurar Claude como fallback (OPCIONAL)

Si quieres tener Claude como respaldo cuando Gemini falle:

1. Obtén una API key de Claude: https://console.anthropic.com/settings/keys
2. Añade a `.env.local`:

```bash
ANTHROPIC_API_KEY=sk-ant-api...
```

3. El sistema priorizará Gemini pero usará Claude si Gemini falla

---

## Cambiar de Gemini a Claude

Si decides usar Claude en lugar de Gemini:

1. Comenta la línea de Gemini en `.env.local`:

```bash
# GEMINI_API_KEY=AIzaSy...
ANTHROPIC_API_KEY=sk-ant-api...
```

2. Reinicia el servidor

El sistema automáticamente detectará que no hay `GEMINI_API_KEY` y usará Claude.

---

## Monitorear uso de Gemini

Para ver cuántos requests estás usando:

1. Ve a: https://aistudio.google.com/apikey
2. Haz clic en tu API key
3. Ve a la pestaña **"Usage"**
4. Verás un gráfico de requests por día

---

## Upgrade a Gemini Pro (si necesitas más)

Si superas los límites gratuitos:

1. Ve a: https://console.cloud.google.com/apis/api/generativelanguage.googleapis.com
2. Habilita billing
3. El tier de pago cuesta **$7 por 1 millón de tokens** (muy barato)

Pero honestamente, con 1,500 requests/día gratuitos, es difícil que lo necesites al principio.

---

## Preguntas frecuentes

**¿Gemini es tan bueno como Claude?**

Para mensajes de retención de WhatsApp, sí. Gemini 2.0 Flash es excelente en tareas de generación de texto natural en español. Claude tiene una ligera ventaja en tareas muy complejas, pero para este caso, Gemini es perfecto.

**¿Puedo usar los dos?**

Sí. Si tienes ambas API keys configuradas, el sistema priorizará Gemini (gratis) y usará Claude como fallback.

**¿Los mensajes generados son diferentes?**

Ligeramente. Ambos usan el mismo prompt, así que la estructura es la misma. Gemini tiende a ser un poco más "alegre" y Claude un poco más "formal", pero ambos generan mensajes de calidad.

**¿Cuándo debería usar Claude en lugar de Gemini?**

- Si superas los 1,500 requests diarios
- Si necesitas el máximo nivel de calidad posible
- Si ya tienes créditos de Anthropic

Para la mayoría de salones, Gemini gratis es más que suficiente.

---

## Resumen

✅ **Obtener API key:** https://aistudio.google.com/apikey  
✅ **Añadir a `.env.local`:** `GEMINI_API_KEY=...`  
✅ **Instalar:** `npm install`  
✅ **Reiniciar:** `npm run dev`  
✅ **Probar:** Generar mensaje desde la app  

**Tiempo total:** 5 minutos  
**Costo:** $0 (gratis hasta 1,500 requests/día)

---

¿Dudas? Revisa el troubleshooting arriba o contacta soporte.
