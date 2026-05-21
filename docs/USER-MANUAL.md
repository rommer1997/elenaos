# Manual de Usuario - ElenaOS

**Guía completa para propietarias de salones de belleza**

Versión 1.0.0 | Última actualización: Mayo 2026

---

## 📋 Tabla de Contenidos

1. [Primeros Pasos](#primeros-pasos)
2. [Dashboard](#dashboard)
3. [Agenda](#agenda)
4. [Clientes (CRM)](#clientes-crm)
5. [Retención de Clientas](#retención-de-clientas)
6. [Agente de Reservas IA](#agente-de-reservas-ia)
7. [Facturación](#facturación)
8. [Inventario](#inventario)
9. [Personal y Servicios](#personal-y-servicios)
10. [Vista Tablet](#vista-tablet)
11. [Configuración](#configuración)
12. [Preguntas Frecuentes](#preguntas-frecuentes)

---

## Primeros Pasos

### Crear tu Cuenta

1. Ve a [app.elenaos.com/register](https://app.elenaos.com/register)
2. Introduce tu email y crea una contraseña segura
3. Verifica tu email (revisa spam si no lo ves)
4. Inicia sesión

### Onboarding (3 pasos)

#### Paso 1: Información de tu Salón

- **Nombre del salón**: El nombre comercial
- **Teléfono**: Número de WhatsApp del salón
- **Ciudad y código postal**: Para geolocalización
- **Logo**: Sube el logo de tu salón (opcional)
- **Colores**: Elige una paleta de 6 colores

💡 **Consejo**: El logo aparecerá en facturas y notificaciones.

#### Paso 2: Tu Equipo y Servicios

**Añadir miembros del equipo**:
- Nombre
- Email (opcional)
- Especialidades
- Color (para calendario)

**Servicios**:
ElenaOS sugiere 6 servicios comunes con IA:
- Corte (€25, 30 min)
- Tinte Completo (€85, 90 min)
- Mechas (€120, 120 min)
- Manicura (€35, 45 min)
- Pedicura (€30, 45 min)
- Facial (€45, 60 min)

Puedes añadir más servicios personalizados.

#### Paso 3: Importar Clientas

Opciones:
- **Empezar desde cero**: Ideal si es un salón nuevo
- **Subir CSV**: Si tienes datos en Excel
- **Integraciones**: (Próximamente)

### ¡Listo!

Verás una celebración con confetti 🎉 y serás redirigida al dashboard.

---

## Dashboard

### Vista General

El dashboard es tu "centro de control" diario. Muestra:

#### 1. Métricas del Día (4 Cards)

**Citas de Hoy**:
- Total de citas programadas
- Completadas (verde)
- Confirmadas (azul)
- Pendientes (naranja) ⚠️

**Facturación Estimada**:
- Dinero que esperas facturar hoy
- Barra de progreso vs objetivo
- Facturado hasta el momento

**Alertas de Clientas en Riesgo**:
- Número de clientas que no vienen hace >30 días
- Prioridad alta si >60 días
- Click para ver lista completa

**Mensajes WhatsApp**:
- Pendientes de responder
- Enviados hoy
- Tasa de respuesta

#### 2. Agenda de Hoy (Timeline)

Vista vertical de tus citas:
- **Cita actual**: Destacada en azul con animación
- **Completadas**: En gris
- **Próximas**: En blanco

Información por cita:
- Hora
- Cliente
- Servicio
- Duración
- Estado (✓ Confirmada / ⏳ Pendiente)

#### 3. Actividad Reciente

Feed en tiempo real:
- Respuestas WhatsApp 💬
- Citas confirmadas ✅
- Stock bajo ⚠️
- Clientas reactivadas 🎉

Dot verde pulsante indica "en vivo".

#### 4. Métricas de Retención

**Este mes**:
- Tasa de retención: 68% (vs 62% mes anterior)
- Clientas reactivadas: 23
- ROI WhatsApp: 5806% 🚀

**Top 3 Campañas**:
Tabla con tus campañas más exitosas:
- Mensajes enviados
- Respuestas (%)
- Clientas reactivadas
- Tasa de reactivación

💡 **Tip**: Revisa el dashboard cada mañana para planificar tu día.

---

## Agenda

### Vista de Calendario

**3 Vistas**:
- **Mes**: Vista general de disponibilidad
- **Semana**: Ver citas de la semana
- **Día**: Detalle hora por hora

**Navegación**:
- Flechas ← → para cambiar período
- Botón "Hoy" para volver a hoy
- Click en día para ver citas

### Crear una Cita

1. Click botón "Nueva Cita" (morado)
2. Llenar formulario:
   - **Cliente**: Buscar por nombre o teléfono
   - **Servicio**: Seleccionar del menú
   - **Fecha**: Calendario
   - **Hora**: Selector de hora
   - **Staff**: Quién atenderá
   - **Duración**: Auto-calculada según servicio
   - **Precio**: Auto-calculado según servicio
   - **Notas**: Opcional (alergias, preferencias, etc.)

3. Click "Crear"

✅ La cita aparece en el calendario.

### Estados de Cita

**Pendiente** (Naranja ⏳):
- Cita creada pero sin confirmar
- Cliente no ha respondido
- **Acción**: Enviar recordatorio

**Confirmada** (Verde ✓):
- Cliente confirmó que vendrá
- Vía WhatsApp o llamada

**En Progreso** (Azul ⏱️):
- Cita está ocurriendo ahora
- Aparece destacada en timeline

**Completada** (Gris ✓):
- Cita finalizada
- **Siguiente paso**: Generar factura

**Cancelada** (Rojo ✕):
- Cliente canceló
- Motivo documentado (opcional)

### Editar una Cita

1. Click en cita del calendario
2. Modal se abre con datos actuales
3. Modificar lo necesario
4. "Guardar Cambios"

### Eliminar una Cita

1. Abrir cita
2. Botón "Eliminar" (abajo)
3. Confirmar

⚠️ **Cuidado**: No se puede deshacer.

### Marcar como Completada

1. Abrir cita
2. Botón "Marcar Completada"
3. **Automático**: Se abre modal de factura
4. Generar factura (ver sección Facturación)

### Confirmar Cita

**Manual**:
1. Abrir cita
2. Click "Confirmar"
3. Enviar WhatsApp de confirmación (opcional)

**Automático**:
El agente IA confirma automáticamente cuando cliente responde "sí" al recordatorio.

---

## Clientes (CRM)

### Lista de Clientas

Vista general de todas tus clientas.

**Búsqueda**:
- Por nombre
- Por teléfono
- Por email

**Filtros**:
- **VIP**: Clientas que gastan más o vienen regularmente
- **En Riesgo**: >30 días sin venir
- **Nuevas**: Primera cita hace <30 días
- **Inactivas**: >90 días sin venir

**Stats en Top**:
- Total de clientas
- Nuevas este mes
- En riesgo
- Tasa de retención

### Añadir Cliente

1. Botón "Nuevo Cliente" (verde)
2. Formulario:
   - Nombre completo
   - Teléfono (requerido para WhatsApp)
   - Email (opcional)
   - Fecha de nacimiento (opcional)
   - Notas
   - Foto (opcional)

3. "Guardar"

### Ficha de Cliente

Click en cualquier cliente para ver su ficha completa.

#### Información Básica
- Nombre, teléfono, email
- Días desde última visita
- Gasto total
- Promedio por visita

#### Predicción de Riesgo con IA

ElenaOS analiza el comportamiento y predice:
- **Bajo Riesgo** (Verde): Viene regularmente
- **Riesgo Medio** (Naranja): 30-60 días sin venir
- **Riesgo Alto** (Rojo): >60 días sin venir

**Recomendaciones de IA**:
- "Enviar oferta personalizada"
- "Recordar próxima cita"
- "Oferta de cumpleaños"

#### Historial de Citas

Lista de todas las citas pasadas:
- Fecha
- Servicio
- Precio
- Valoración (estrellas)

#### Notas

Añadir notas importantes:
- Alergias
- Preferencias de color
- "Le gusta el café con leche"
- Cualquier detalle que ayude

#### Acciones Rápidas

- **Enviar WhatsApp**: Abre chat
- **Nueva Cita**: Crear cita para esta cliente
- **Ver Facturas**: Historial de pagos

### Editar Cliente

1. Abrir ficha
2. Botón "Editar" (arriba derecha)
3. Modificar campos
4. "Guardar"

### Segmentos Automáticos

ElenaOS crea segmentos automáticamente:

**VIP**:
- Gasto total >€500
- O visitas >10
- O frecuencia <45 días entre visitas

**En Riesgo**:
- Última visita hace 30-90 días
- Solía venir regularmente

**Inactivas**:
- Última visita hace >90 días
- **Acción**: Campaña de reactivación

---

## Retención de Clientas

**El corazón de ElenaOS**. Aquí ves el poder del motor de IA.

### Dashboard de Retención

#### KPIs Principales

**Tasa de Retención Mensual**:
- % de clientas que volvieron este mes
- Comparado con mes anterior
- Objetivo: >70%

**Clientas Reactivadas**:
- Cuántas clientas "inactivas" volvieron
- Gracias a campañas de WhatsApp

**ROI de Campañas**:
- Por cada €1 invertido (€49/mes de ElenaOS)
- Cuánto recuperas en facturación
- Promedio: 5806% 🚀

#### Clientas en Riesgo

Lista de clientas que no vienen hace >30 días.

**Niveles**:
- **30-60 días**: Riesgo medio (naranja)
- **60-90 días**: Riesgo alto (rojo)
- **>90 días**: Riesgo crítico (rojo oscuro)

**Por cada clienta**:
- Nombre
- Días sin venir
- Último servicio
- Gasto histórico
- **Acción sugerida** por IA

### Crear Campaña de Reactivación

1. Botón "Nueva Campaña"
2. **Paso 1: Seleccionar Segmento**
   - En riesgo (30-60 días)
   - Alto riesgo (60-90 días)
   - Inactivas (>90 días)
   - Personalizado (elegir clientas manualmente)

3. **Paso 2: Mensaje WhatsApp**

**Template sugerido**:
```
¡Hola {nombre}! 👋

Te echamos de menos en {salón}. Hace {días} días que no vienes y queremos verte de nuevo 💇‍♀️

¿Qué te parece si agendamos una cita? Tengo disponible:
- Jueves 10:00
- Viernes 15:00
- Sábado 11:30

¿Cuál te viene mejor? 😊
```

**Variables disponibles**:
- `{nombre}`: Nombre de la cliente
- `{salón}`: Nombre de tu salón
- `{días}`: Días desde última visita
- `{servicio}`: Último servicio que pidió

4. **Paso 3: Programar Envío**
   - Enviar ahora
   - Programar para fecha/hora específica

5. **Revisar y Enviar**

### Métricas de Campaña

Cada campaña muestra:
- **Enviados**: Cuántos mensajes salieron
- **Entregados**: Cuántos llegaron
- **Leídos**: Cuántos vieron el mensaje (check azul)
- **Respuestas**: Cuántas respondieron
- **Citas agendadas**: Cuántas reservaron
- **Tasa de conversión**: % que agendaron

### Top Campañas

ElenaOS rankea tus campañas por performance:

🥇 **Oferta Cumpleaños**:
- Enviados: 8
- Respuestas: 7 (87%)
- Reactivadas: 6
- Tasa: 75%

🥈 **Recordatorio 30 días**:
- Enviados: 15
- Respuestas: 12 (80%)
- Reactivadas: 8
- Tasa: 53%

🥉 **Recuperación 60 días**:
- Enviados: 12
- Respuestas: 8 (67%)
- Reactivadas: 5
- Tasa: 42%

💡 **Insight**: Mensajes personalizados tienen 3× mejor tasa que genéricos.

---

## Agente de Reservas IA

**Tu asistente virtual que gestiona WhatsApp automáticamente**.

### ¿Qué hace el Agente?

El agente de IA:
✅ Lee mensajes entrantes de clientas
✅ Entiende qué quieren (crear, modificar, cancelar cita)
✅ Extrae fecha, hora y servicio del mensaje
✅ Responde de forma natural en español
✅ Agenda la cita automáticamente
✅ Escala a ti si no está seguro

### Configuración

Ve a **Agente IA** en el menú.

#### Estado del Agente

**Toggle ON/OFF**:
- 🟢 Activo: Responde automáticamente
- 🔴 Desactivado: Solo modo manual

#### Retraso de Respuesta

Slider de 0-10 segundos.

**Recomendado**: 2 segundos
- Más natural (parece humano escribiendo)
- Evita respuestas "robóticas" instantáneas

#### Horario de Atención

Configura cuándo el agente responde:
- **Inicio**: 09:00 (default)
- **Fin**: 20:00 (default)

Fuera de horario, el agente dice:
> "Gracias por tu mensaje. Nuestro horario es de 9:00 a 20:00. Te responderemos mañana 😊"

#### Configuraciones Avanzadas

**Confirmación Automática**:
- ✅ ON: Agente confirma citas sin tu aprobación
- ❌ OFF: Te pregunta antes de confirmar

**Requerir Aprobación Humana**:
- ✅ ON: Citas creadas por agente necesitan tu OK
- ❌ OFF: Se crean directamente

**Conversaciones Máximas**:
Límite de chats simultáneos (default: 10).

**Idioma**:
- Español (default)
- Catalán
- English

### Ver Conversaciones

**Visor en tiempo real** de chats con clientas.

**Elementos**:
- Burbujas de mensajes (cliente en gris, agente en morado)
- **Intent badges**: Qué detectó el agente
  - 🟢 Crear cita
  - 🔵 Modificar
  - 🔴 Cancelar
  - 🟣 Confirmar
  - ⚪ Consulta

- Timestamps ("hace 5 minutos")
- Status icons (enviado ✓, leído ✓✓)

**Modo Manual**:
Toggle para desactivar agente y responder tú manualmente.

### Ejemplos de Conversaciones

#### Ejemplo 1: Crear Cita

**Cliente**: "Hola! Quiero agendar un corte para mañana a las 10"

**Agente detecta**:
- Intención: Crear cita ✅
- Servicio: Corte
- Fecha: Mañana (22 mayo)
- Hora: 10:00

**Agente responde**: 
> "¡Perfecto! Te he agendado para mañana 22 de mayo a las 10:00 para un corte de pelo. Te enviaré un recordatorio el día anterior. ¡Nos vemos! 💇‍♀️"

**Acción**: Cita creada automáticamente.

#### Ejemplo 2: Modificar Hora

**Cliente**: "Puedo cambiar mi cita del viernes a las 11 en vez de las 10?"

**Agente detecta**:
- Intención: Modificar ✅
- Cita: Viernes
- Nueva hora: 11:00

**Agente responde**:
> "Claro que sí! He cambiado tu cita del viernes a las 11:00. ¿Te va bien así? 👍"

**Acción**: Cita actualizada.

#### Ejemplo 3: Falta Información

**Cliente**: "Quiero agendar una cita"

**Agente detecta**:
- Intención: Crear cita ✅
- Pero falta: servicio, fecha, hora

**Agente responde**:
> "¡Genial! 😊 ¿Qué servicio te interesa? Tenemos corte, tinte, mechas, manicura, pedicura y facial."

**Acción**: Pregunta para obtener más info.

### Estadísticas del Agente

- **Mensajes procesados**: 142
- **Precisión**: 87%
- **Citas creadas**: 23

---

## Facturación

### Lista de Facturas

**5 Tabs**:
- **Todas**: Vista completa
- **Borradores**: Sin enviar aún
- **Enviadas**: Enviadas pero no pagadas
- **Pagadas**: Completadas ✅
- **Vencidas**: Pasó fecha de pago ⚠️

**Por cada factura**:
- Número (FV-2026-001)
- Cliente
- Fecha
- Total
- Estado
- Acciones (ver, descargar PDF, enviar)

### Crear Factura

Hay 2 formas:

#### Opción 1: Desde Cita Completada

1. Marcar cita como completada
2. **Automático**: Modal de factura se abre
3. Datos prellenados (cliente, servicios)
4. Añadir líneas adicionales si necesario
5. "Generar y Enviar"

#### Opción 2: Manual

1. Facturación → "Nueva Factura"
2. Seleccionar cliente
3. Añadir líneas:
   - Descripción
   - Cantidad
   - Precio unitario
   - IVA (21% default)

4. Ver preview
5. Generar

### Elementos de Factura

**Datos del Salón**:
- Nombre comercial
- Dirección
- CIF
- Teléfono

**Datos del Cliente**:
- Nombre
- Dirección (si disponible)
- Email

**Líneas**:
- Descripción del servicio/producto
- Cantidad × Precio unitario
- Subtotal

**Cálculos**:
- **Base imponible**: Suma de líneas
- **IVA (21%)**: Base × 0.21
- **Total**: Base + IVA

**VeriFactu** (AEAT):
- Hash único de verificación
- QR code
- Código de respuesta AEAT

### VeriFactu (Cumplimiento AEAT)

ElenaOS cumple con la normativa VeriFactu de la Agencia Tributaria.

**Qué significa**:
Cada factura tiene un "hash" (código único) que verifica que:
- No ha sido modificada
- Está registrada oficialmente
- Cumple con Hacienda

**En la factura verás**:
- Hash VeriFactu: `ABC123...`
- QR code (escaneable por AEAT)
- "Enviada a AEAT" badge verde

**Automático**: No tienes que hacer nada. ElenaOS lo hace por ti.

### Enviar Factura

**Por Email**:
1. Abrir factura
2. "Enviar por Email"
3. **Automático**: Email con PDF adjunto

**Por WhatsApp**:
1. Abrir factura
2. "Enviar por WhatsApp"
3. Se envía como documento PDF

### Descargar PDF

1. Lista de facturas
2. Click "Descargar PDF"
3. Se descarga a tu ordenador

**El PDF incluye**:
- Logo de tu salón
- Todos los datos fiscales
- QR VeriFactu
- Aspecto profesional

---

## Inventario

### Lista de Productos

Vista de todos tus productos.

**Vista Grid**: Cards con foto del producto.

**Información visible**:
- Foto
- Nombre
- Categoría
- Stock actual
- Precio

**Alertas de Stock Bajo**:
Productos con <5 unidades se destacan en naranja.

### Añadir Producto

1. "Nuevo Producto"
2. Formulario:
   - Nombre
   - Categoría (Tintes, Cuidado, Herramientas, etc.)
   - Descripción
   - Stock inicial
   - Stock mínimo (alerta)
   - Precio de compra
   - Precio de venta
   - Foto (opcional)

3. "Guardar"

### Gestión de Stock

**Añadir Stock**:
1. Abrir producto
2. "Añadir Stock"
3. Cantidad
4. Motivo: "Compra", "Devolución", "Ajuste"
5. Guardar

**Restar Stock**:
1. Abrir producto
2. "Restar Stock"
3. Cantidad
4. Motivo: "Venta", "Uso en servicio", "Pérdida"

**Historial de Movimientos**:
Cada producto tiene historial:
- Fecha
- Tipo (entrada/salida)
- Cantidad
- Motivo
- Usuario que lo hizo

### Alertas de Stock Bajo

**Automático**: ElenaOS te alerta cuando un producto llega al mínimo.

**En Dashboard**:
⚠️ "Tinte Rubio Platino tiene solo 3 unidades"

**En Feed de Actividad**:
⚠️ Alerta urgente destacada en naranja

**Acción recomendada**: Hacer pedido a proveedor.

### Registrar Productos en Cita

**Desde Vista Tablet**:
1. Durante la cita
2. "Registrar Productos"
3. Seleccionar productos usados
4. Cantidad de cada uno
5. Guardar

**Efecto**:
- Stock se reduce automáticamente
- Se registra en historial
- Aparece en costes de la cita

---

## Personal y Servicios

### Gestión de Personal

**Lista de Staff**:
Todos los miembros de tu equipo.

**Por cada persona**:
- Foto
- Nombre
- Especialidades
- Color (para calendario)
- Disponibilidad

**Añadir Staff**:
1. "Nuevo Miembro"
2. Datos:
   - Nombre
   - Email (opcional)
   - Teléfono
   - Especialidades (múltiples)
   - Color (10 opciones)

3. **Disponibilidad semanal**:
   - Lunes: 9:00 - 18:00
   - Martes: 9:00 - 18:00
   - ... (configurable por día)
   - Días libres

4. Guardar

**Editar/Eliminar**:
- Click en miembro
- Editar datos
- O "Eliminar" (pide confirmación)

### Gestión de Servicios

**Lista de Servicios**:
Todos los servicios que ofreces.

**Por cada servicio**:
- Nombre
- Categoría
- Duración
- Precio
- Productos asociados

**10 Categorías**:
- Corte
- Tinte
- Mechas/Balayage
- Peinados
- Manicura
- Pedicura
- Tratamientos Faciales
- Depilación
- Cejas/Pestañas
- Otros

**Añadir Servicio**:
1. "Nuevo Servicio"
2. Datos:
   - Nombre: "Tinte Completo"
   - Categoría: Tinte
   - Duración: 90 minutos
   - Precio: €85
   - Descripción
   - Productos: Asociar productos del inventario

3. Guardar

**Para qué sirven los productos asociados**:
Cuando creas una cita con este servicio, ElenaOS te recuerda los productos que necesitarás.

---

## Vista Tablet

**Interfaz optimizada para esteticistas en la estación de trabajo**.

### Acceso

1. Abrir tablet
2. Ir a `app.elenaos.com/station`
3. Seleccionar tu nombre (arriba derecha)

### Pantalla Principal

**Layout 3 columnas**:
- **Izquierda (2 cols)**: Cita actual + Historial cliente
- **Derecha (1 col)**: Acciones rápidas + Cola

#### Header

- **Logo**: ElenaOS
- **Reloj en vivo**: Hora actual (actualiza cada segundo)
- **Fecha**: "miércoles, 21 de mayo"
- **Selector de Staff**: Cambiar entre esteticistas
- **Botón Settings**

#### Cita Actual

**Card grande destacada**:
- Nombre de la cliente (grande)
- Dot verde pulsante: "En progreso"
- Tiempo: 11:30 - 13:00 (90 min)
- Servicio: Corte + Tinte
- Precio: €85
- Teléfono: +34 612 345 678

**Barra de Progreso**:
Slider interactivo para marcar progreso del servicio:
- 0%: Inicio
- 50%: En proceso
- 100%: Completado

Muévelo con el dedo según avances.

**Notas Importantes** (si existen):
⚠️ Alert naranja:
> "Alergia al amoníaco. Prefiere rubio natural."

#### Acciones Rápidas

**6 botones grandes** (touch-friendly):

1. **Marcar Completada** (Verde)
   - Finaliza la cita
   - Abre modal de factura

2. **Pausar Timer** (Naranja)
   - Si necesitas break
   - Timer se pausa

3. **Enviar WhatsApp** (Morado)
   - Envía mensaje rápido a la cliente
   - Templates pre-definidos

4. **Registrar Productos** (Azul)
   - Productos usados en la cita
   - Reduce stock automáticamente

5. **Tomar Foto Antes/Después** (Rosa)
   - Documenta el resultado
   - Se guarda en historial

6. **Generar Factura** (Gris)
   - Crea factura directamente
   - Sin completar cita aún

#### Cola de Siguientes Citas

**Próximas 3 citas**:

**Primera (destacada en morado)**:
- Badge "SIGUIENTE"
- 13:00 - Ana García - Manicura
- ✅ Confirmada

**Segunda**:
- 14:00 - Carmen Rodríguez - Corte
- ⏳ Pendiente de confirmación

**Tercera**:
- 15:30 - Laura Pérez - Mechas
- ✅ Confirmada

#### Historial del Cliente

**Últimas visitas**:
- 15 abril - Corte ⭐⭐⭐⭐⭐
- 10 marzo - Mechas ⭐⭐⭐⭐⭐
- 5 febrero - Tinte ⭐⭐⭐⭐

**Añadir Nota**:
Input grande:
> "Cliente muy satisfecha con el color. Próxima vez quiere mechas más claras"

Enter o botón para guardar.

### Completar Cita

1. Mover slider a 100%
2. Click "Marcar Completada"
3. Modal de factura se abre
4. Revisar/añadir productos
5. "Generar y Enviar"

**Automático**:
- Siguiente cita pasa a ser "actual"
- Stats se actualizan
- Cliente queda satisfecha 😊

---

## Configuración

### Apariencia

**6 Temas de Color**:
- Purple & Pink (default)
- Blue & Cyan
- Green & Emerald
- Orange & Red
- Pink & Rose
- Indigo & Purple

**Cambiar tema**:
1. Configuración → Apariencia
2. Click en paleta
3. Ver preview en vivo
4. "Aplicar"

**Logo**:
- Subir logo personalizado
- Se muestra en:
  - Sidebar
  - Facturas
  - Emails
  - Landing page

### Datos del Salón

- Nombre comercial
- Dirección completa
- Ciudad, código postal
- Teléfono
- Email de contacto
- CIF (para facturas)

**Editar**:
1. Cambiar campos necesarios
2. "Guardar Cambios"

### Notificaciones

**Email**:
- ✅ Recordatorios de citas
- ✅ Facturas generadas
- ✅ Clientas en riesgo
- ✅ Stock bajo

**Push (PWA)**:
- ✅ Respuestas WhatsApp urgentes
- ✅ Citas confirmadas
- ✅ Alertas importantes

**Frecuencia**:
- Tiempo real
- Resumen diario (9:00 AM)
- Resumen semanal (Lunes)

### Usuarios y Permisos

**Roles**:
- **Owner**: Acceso completo
- **Admin**: Todo menos billing
- **Staff**: Solo su agenda y clientes

**Añadir Usuario**:
1. Configuración → Usuarios
2. "Invitar Usuario"
3. Email
4. Rol
5. Enviar invitación

### Mi Suscripción

Ver sección [Suscripción](#suscripción) abajo.

---

## Suscripción

Ve a **Suscripción** en el menú.

### Tu Plan Actual

**Card de suscripción**:
- Plan: Professional
- Precio: €49/mes
- Estado: ✅ Activa
- Próxima renovación: 21 junio 2026

**Incluido en tu plan**:
- Hasta 5 miembros del equipo
- Clientas ilimitadas
- 2000 mensajes WhatsApp/mes
- Motor de retención con IA
- Agente de reservas autónomo
- Soporte prioritario

**Acciones**:
- **Gestionar método de pago**: Abre portal de Lemon Squeezy
- **Cancelar suscripción**: (con confirmación)

### Cambiar de Plan

**3 Planes disponibles**:

**Starter (€29/mes)**:
- 2 staff
- 200 clientas
- 500 mensajes WhatsApp
- Soporte email

**Professional (€49/mes)** ⭐ Más Popular:
- 5 staff
- Clientas ilimitadas
- 2000 mensajes WhatsApp
- Motor IA + Agente
- Soporte prioritario

**Enterprise (€99/mes)**:
- Staff ilimitado
- 10,000 mensajes WhatsApp
- API access
- Soporte 24/7
- White label

**Descuento anual**:
Paga anualmente y ahorra 20%.

**Cambiar plan**:
1. Click "Seleccionar Plan"
2. Redirige a checkout
3. Completar pago
4. Cambio inmediato

### Historial de Facturas

Tabla con tus pagos:
- Fecha
- Descripción (Plan Professional - Mayo)
- Monto
- Estado (Pagada ✅)
- PDF descargable

---

## Preguntas Frecuentes

### General

**¿Necesito instalar algo?**
No. ElenaOS funciona en el navegador. Opcionalmente puedes instalarlo como app en tu móvil/tablet.

**¿Funciona offline?**
Sí, con la PWA instalada. Las acciones se sincronizan cuando vuelve la conexión.

**¿Es seguro?**
Sí. Todos los datos están encriptados. Cumplimos con GDPR. Backups diarios.

**¿Puedo probar gratis?**
Sí, 14 días de prueba sin tarjeta de crédito.

### Agenda

**¿Cómo confirmo una cita masivamente?**
En Agenda → Filtrar "Pendientes" → Seleccionar múltiples → "Confirmar Seleccionadas".

**¿Puedo ver agenda de todo el equipo?**
Sí. En Agenda → Vista Semana → Ver todas las esteticistas.

**¿Cómo bloqueo horas?**
Crear cita con cliente "Bloqueado" y servicio "No disponible".

### Clientes

**¿Cómo importo desde Excel?**
Clientes → Importar → Subir CSV. Template disponible.

**¿Puedo fusionar clientes duplicados?**
Sí. Abrir uno → "Fusionar con..." → Seleccionar el otro.

**¿Cómo marco una cliente como VIP?**
Abrir ficha → Toggle "VIP" (arriba).

### Retención

**¿Cuánto cuesta enviar WhatsApp?**
Incluido en tu plan. 500-10,000 mensajes/mes según plan.

**¿Las clientas ven que es automático?**
No. Los mensajes parecen escritos por ti.

**¿Puedo pausar el agente IA?**
Sí. Agente IA → Toggle OFF.

### Facturación

**¿Qué es VeriFactu?**
Normativa de la AEAT para facturación electrónica. ElenaOS cumple automáticamente.

**¿Puedo editar una factura enviada?**
No. Pero puedes crear una factura rectificativa.

**¿Dónde se guardan los PDFs?**
En la nube (Supabase). Accesibles desde Lista de Facturas.

### Inventario

**¿Cómo sé cuánto producto gasté este mes?**
Inventario → Reportes → Consumo Mensual.

**¿Puedo configurar pedidos automáticos?**
Proximamente. Por ahora recibes alertas de stock bajo.

### Tablet

**¿Qué tablets son compatibles?**
Cualquier tablet moderna (iPad, Android). Recomendado: 10" o más.

**¿Puede cada esteticista tener su tablet?**
Sí. Seleccionan su nombre en el header.

**¿Funciona sin internet?**
Con PWA instalada, sí. Sincroniza después.

### Suscripción

**¿Puedo cancelar cuando quiera?**
Sí. Sin compromiso. Cancelas y tienes acceso hasta fin de período.

**¿Qué pasa si se vence mi tarjeta?**
Recibes email de aviso. 7 días para actualizar antes de bloqueo.

**¿Ofrecen descuentos?**
Sí. 20% pagando anualmente. Contacta para descuentos por múltiples salones.

---

## Soporte

**¿Necesitas ayuda?**

📧 **Email**: support@elenaos.com  
📱 **WhatsApp**: +34 XXX XXX XXX  
📚 **Centro de Ayuda**: help.elenaos.com  
💬 **Chat en vivo**: Botón abajo derecha en la app

**Horario**:
- Lunes a Viernes: 9:00 - 20:00
- Sábados: 10:00 - 14:00

**Tiempo de respuesta**:
- Plan Professional: <4 horas
- Plan Enterprise: <1 hora

---

**¡Gracias por elegir ElenaOS!** 💜

Estamos aquí para ayudarte a hacer crecer tu salón.

*Manual v1.0.0 - Mayo 2026*
