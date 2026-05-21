# Checklist de QA - ElenaOS

**Fecha**: 2026-05-21  
**Versión**: 1.0.0  
**Responsable**: Equipo de QA

---

## 🎯 Objetivo

Verificar que todas las funcionalidades de ElenaOS funcionan correctamente antes del lanzamiento.

---

## 1. Autenticación y Onboarding

### Login/Registro
- [ ] Registro con email válido funciona
- [ ] Validación de email fuerte (min 8 chars, mayúsculas, números)
- [ ] Login con credenciales correctas funciona
- [ ] Login con credenciales incorrectas muestra error
- [ ] Logout funciona correctamente
- [ ] Sesión persiste al recargar página
- [ ] Link de "Olvidé mi contraseña" funciona

### Onboarding (3 pasos)
- [ ] Paso 1: Formulario de salón valida campos requeridos
- [ ] Paso 1: Upload de logo funciona (preview correcto)
- [ ] Paso 1: Selector de 6 paletas de color funciona
- [ ] Paso 2: Añadir miembro del equipo funciona
- [ ] Paso 2: 6 servicios sugeridos por IA se muestran
- [ ] Paso 2: Añadir servicio personalizado funciona
- [ ] Paso 3: Opciones de importación de clientes visibles
- [ ] Celebración con confetti se muestra al finalizar
- [ ] Redirección a dashboard después de onboarding
- [ ] No se puede volver atrás después de completar

---

## 2. Dashboard Principal

### Métricas Diarias
- [ ] 4 cards de métricas se muestran correctamente
- [ ] Números calculan correctamente
- [ ] Indicadores de cambio (TrendingUp/Down) según valor
- [ ] Barra de progreso de facturación calcula bien
- [ ] Alertas se muestran si hay pendientes/urgencias
- [ ] Hover effects funcionan en cards

### Timeline de Agenda
- [ ] 8 citas se muestran en orden cronológico
- [ ] Cita actual destacada con pulse animation
- [ ] Estados diferenciados (completada/progreso/confirmada/pendiente)
- [ ] Marcadores de timeline con colores correctos
- [ ] Summary footer muestra stats correctos
- [ ] Scroll funciona si hay muchas citas

### Feed de Actividad
- [ ] Actividades se muestran en orden cronológico
- [ ] Timestamps relativos en español
- [ ] Actividades urgentes destacadas en naranja
- [ ] Dot verde pulsa (live indicator)
- [ ] Scroll funciona
- [ ] Emojis se muestran correctamente

### Métricas de Retención
- [ ] 3 cards principales con gradientes correctos
- [ ] Tasa de retención muestra % correcto
- [ ] Barra de progreso purple calcula bien
- [ ] ROI calcula correctamente (5806%)
- [ ] Tabla de top 3 campañas completa
- [ ] Progress bars por campaña funcionan
- [ ] Link a /retencion funciona

---

## 3. Agenda

### Vista de Calendario
- [ ] Calendario muestra mes actual
- [ ] Navegación entre meses funciona
- [ ] Días con citas tienen indicador
- [ ] Click en día muestra citas de ese día
- [ ] Vista semanal funciona
- [ ] Vista diaria funciona

### Crear Cita
- [ ] Modal se abre con botón "Nueva Cita"
- [ ] Selector de cliente funciona
- [ ] Selector de servicio funciona
- [ ] Selector de fecha y hora funciona
- [ ] Selector de staff funciona
- [ ] Duración se calcula automáticamente
- [ ] Precio se muestra según servicio
- [ ] Botón "Crear" guarda cita
- [ ] Modal se cierra después de crear
- [ ] Nueva cita aparece en calendario

### Editar/Eliminar Cita
- [ ] Click en cita abre modal de edición
- [ ] Campos prellenados con datos actuales
- [ ] Edición guarda cambios
- [ ] Botón "Eliminar" pide confirmación
- [ ] Confirmación elimina cita
- [ ] Cancelar no elimina cita

### Estados de Cita
- [ ] Estado "Pendiente" en naranja
- [ ] Estado "Confirmada" en verde
- [ ] Estado "En progreso" en azul con pulse
- [ ] Estado "Completada" en gris
- [ ] Estado "Cancelada" en rojo
- [ ] Cambio de estado actualiza UI

---

## 4. CRM - Gestión de Clientes

### Lista de Clientes
- [ ] Lista se muestra con todos los clientes
- [ ] Búsqueda por nombre funciona
- [ ] Búsqueda por teléfono funciona
- [ ] Búsqueda por email funciona
- [ ] Filtros por estado funcionan
- [ ] Ordenamiento por columnas funciona
- [ ] Paginación funciona
- [ ] Stats cards muestran números correctos

### Añadir Cliente
- [ ] Modal se abre con botón "Nuevo Cliente"
- [ ] Validación de campos requeridos
- [ ] Validación de email formato correcto
- [ ] Validación de teléfono formato correcto
- [ ] Upload de foto funciona
- [ ] Botón "Guardar" crea cliente
- [ ] Nuevo cliente aparece en lista

### Ficha de Cliente
- [ ] Click en cliente abre ficha completa
- [ ] Información básica se muestra
- [ ] Historial de citas se muestra
- [ ] Notas se muestran
- [ ] Añadir nota funciona
- [ ] Predicción de riesgo con IA se muestra
- [ ] Recomendaciones de IA visibles
- [ ] Botón "Enviar WhatsApp" funciona

### Segmentación
- [ ] Filtro "VIP" funciona
- [ ] Filtro "En riesgo" funciona
- [ ] Filtro "Nuevas" funciona
- [ ] Filtro "Inactivas" funciona
- [ ] Combinación de filtros funciona

---

## 5. Motor de Retención con IA

### Dashboard de Retención
- [ ] KPIs principales se muestran
- [ ] Tasa de retención calcula correctamente
- [ ] Gráfico de tendencia se renderiza
- [ ] Lista de clientas en riesgo completa
- [ ] Niveles de riesgo diferenciados por color

### Alertas de Riesgo
- [ ] Clientas con >30 días sin cita marcadas
- [ ] Clientas con >60 días nivel "alto"
- [ ] Clientas con >90 días nivel "crítico"
- [ ] Click en alerta abre ficha de cliente
- [ ] Opciones de acción rápida funcionan

### Campañas de Reactivación
- [ ] Crear campaña WhatsApp funciona
- [ ] Selector de segmento funciona
- [ ] Template de mensaje editable
- [ ] Variables personalizadas se reemplazan
- [ ] Preview del mensaje correcto
- [ ] Programar envío funciona
- [ ] Envío inmediato funciona
- [ ] Historial de campañas se muestra

### Métricas de Campaña
- [ ] Mensajes enviados contador correcto
- [ ] Tasa de respuesta calcula bien
- [ ] Clientas reactivadas se trackean
- [ ] ROI se calcula correctamente
- [ ] Top campañas ordenadas por performance

---

## 6. Agente de Reservas con IA

### Configuración del Agente
- [ ] Toggle enabled/disabled funciona
- [ ] Slider de retraso de respuesta funciona
- [ ] Inputs de horario funcionan
- [ ] Checkbox de auto-confirm funciona
- [ ] Checkbox de aprobación humana funciona
- [ ] Input de conversaciones máximas funciona
- [ ] Select de idioma funciona
- [ ] Botón "Guardar" persiste config
- [ ] Estadísticas se muestran

### Visor de Conversaciones
- [ ] Mensajes se muestran en orden
- [ ] Burbujas diferenciadas inbound/outbound
- [ ] Timestamps relativos en español
- [ ] Intent badges se muestran correctamente
- [ ] Status icons (sent/delivered/read)
- [ ] Toggle auto/manual funciona
- [ ] Input deshabilitado en modo auto
- [ ] Scroll automático a último mensaje

### Procesamiento NLP
- [ ] Detección de intención "crear cita"
- [ ] Detección de intención "modificar"
- [ ] Detección de intención "cancelar"
- [ ] Extracción de servicio
- [ ] Extracción de fecha en español
- [ ] Extracción de hora
- [ ] Respuesta natural generada
- [ ] Acciones ejecutadas si confidence > 0.7

---

## 7. Facturación

### Lista de Facturas
- [ ] Tabs funcionan (todas/borradores/enviadas/pagadas/vencidas)
- [ ] Facturas se muestran en lista
- [ ] Búsqueda por número funciona
- [ ] Búsqueda por cliente funciona
- [ ] Filtros por fecha funcionan
- [ ] Stats cards calculan correctamente

### Crear Factura
- [ ] Modal se abre con botón "Nueva Factura"
- [ ] Selector de cliente funciona
- [ ] Añadir líneas de factura funciona
- [ ] Cálculo de subtotal correcto
- [ ] Cálculo de IVA correcto
- [ ] Cálculo de total correcto
- [ ] Preview de factura se genera
- [ ] Botón "Guardar borrador" funciona
- [ ] Botón "Enviar" marca como enviada

### VeriFactu (AEAT)
- [ ] Hash de factura se genera
- [ ] QR de verificación se muestra
- [ ] Envío a AEAT funciona
- [ ] Código de respuesta AEAT guardado
- [ ] Badge "Enviada a AEAT" visible

### Descargar PDF
- [ ] Botón "Descargar PDF" funciona
- [ ] PDF generado correctamente
- [ ] Logo del salón en PDF
- [ ] Datos fiscales completos
- [ ] QR de VeriFactu en PDF

---

## 8. Inventario

### Lista de Productos
- [ ] Productos se muestran en grid
- [ ] Búsqueda por nombre funciona
- [ ] Filtros por categoría funcionan
- [ ] Filtros por stock funcionan
- [ ] Productos con stock bajo destacados
- [ ] Stats cards correctas

### Añadir Producto
- [ ] Modal se abre con botón "Nuevo Producto"
- [ ] Upload de imagen funciona
- [ ] Campos de producto validan
- [ ] Stock inicial se guarda
- [ ] Precio se guarda
- [ ] Categorías funcionan
- [ ] Nuevo producto aparece en lista

### Gestión de Stock
- [ ] Añadir stock funciona
- [ ] Restar stock funciona
- [ ] Historial de movimientos se registra
- [ ] Alertas de stock bajo se crean
- [ ] Restock automático (si configurado)

---

## 9. Personal y Servicios

### Gestión de Personal
- [ ] Lista de staff se muestra
- [ ] Modal de añadir staff funciona
- [ ] Upload de foto funciona
- [ ] Especialidades se guardan
- [ ] Selector de color (10 opciones) funciona
- [ ] Calendario de disponibilidad funciona
- [ ] Horario semanal se guarda
- [ ] Editar staff funciona
- [ ] Eliminar staff pide confirmación

### Gestión de Servicios
- [ ] Lista de servicios se muestra
- [ ] Modal de añadir servicio funciona
- [ ] 10 categorías disponibles
- [ ] Duración en minutos valida
- [ ] Precio valida
- [ ] Productos asociados funcionan
- [ ] Editar servicio funciona
- [ ] Eliminar servicio pide confirmación

---

## 10. Configuración

### Apariencia
- [ ] 6 temas de color disponibles
- [ ] Preview del tema funciona
- [ ] Aplicar tema actualiza toda la UI
- [ ] Upload de logo funciona
- [ ] Logo se muestra en sidebar
- [ ] Configuración se guarda

### Datos del Salón
- [ ] Formulario prellenado con datos actuales
- [ ] Edición de nombre funciona
- [ ] Edición de dirección funciona
- [ ] Edición de teléfono funciona
- [ ] Edición de email funciona
- [ ] Botón "Guardar" persiste cambios

### Notificaciones
- [ ] Toggle de notificaciones email funciona
- [ ] Toggle de notificaciones push funciona
- [ ] Selector de frecuencia funciona
- [ ] Tipos de notificación configurables
- [ ] Configuración se guarda

---

## 11. Billing y Suscripción

### Planes de Precios
- [ ] 3 planes se muestran (Starter/Professional/Enterprise)
- [ ] Toggle mensual/anual funciona
- [ ] Precio anual muestra 20% descuento
- [ ] Plan actual con border verde
- [ ] Professional destacado con badge
- [ ] Botón "Seleccionar Plan" funciona
- [ ] Redirección a Lemon Squeezy

### Suscripción Actual
- [ ] Card de suscripción se muestra
- [ ] Estado correcto (activa/cancelada/expirada)
- [ ] Fecha de renovación visible
- [ ] Botón "Gestionar pago" abre portal
- [ ] Botón "Cancelar" pide confirmación
- [ ] Confirmación cancela suscripción
- [ ] Botón "Reactivar" funciona

### Historial de Facturas
- [ ] Tabla de facturas se muestra
- [ ] 5 columnas completas
- [ ] Últimas facturas ordenadas por fecha
- [ ] Badge "Pagada" visible
- [ ] Botón "Descargar PDF" funciona

---

## 12. Vista Tablet (Estación)

### Header
- [ ] Logo visible
- [ ] Reloj actualiza cada segundo
- [ ] Fecha en español correcta
- [ ] Selector de staff funciona
- [ ] Botón settings visible

### Cita Actual
- [ ] Card destacada con border purple
- [ ] Nombre de cliente grande
- [ ] Dot verde pulsante
- [ ] Time range correcto
- [ ] 3 info cards visibles
- [ ] Barra de progreso interactiva
- [ ] Slider actualiza porcentaje
- [ ] Alert de notas si existen

### Cola de Citas
- [ ] Siguiente cita destacada con badge
- [ ] 3 citas visibles
- [ ] Status icons correctos
- [ ] Pending muestra warning
- [ ] Empty state si no hay más

### Acciones Rápidas
- [ ] 6 botones en grid 2×3
- [ ] Iconos grandes visibles
- [ ] Colores distintivos
- [ ] Active scale feedback
- [ ] Click ejecuta acción

### Historial y Notas
- [ ] Historial de visitas se muestra
- [ ] Estrellas según valoración
- [ ] Timestamps relativos
- [ ] Input de nota funciona
- [ ] Enter to submit
- [ ] Nota se guarda

---

## 13. PWA (Progressive Web App)

### Instalación
- [ ] Manifest.json carga correctamente
- [ ] Service Worker registra sin errores
- [ ] Prompt de instalación aparece (después 30s)
- [ ] Botón "Instalar" muestra prompt nativo
- [ ] App se instala correctamente
- [ ] Icono aparece en home screen
- [ ] App abre en standalone mode

### Offline
- [ ] Recursos críticos cachean en install
- [ ] App funciona sin conexión
- [ ] Página offline se muestra si necesario
- [ ] Sync automática cuando vuelve conexión
- [ ] Offline queue guarda operaciones

### Notificaciones Push
- [ ] Permiso de notificaciones se pide
- [ ] Suscripción push se crea
- [ ] Notificaciones se reciben
- [ ] Click en notificación abre app
- [ ] Badge en icono funciona

### Updates
- [ ] Service Worker detecta updates
- [ ] Prompt de update se muestra
- [ ] Botón "Actualizar" recarga app
- [ ] Nueva versión se aplica

---

## 14. Responsive Design

### Mobile (< 768px)
- [ ] Sidebar colapsa a hamburger menu
- [ ] Grids cambian a 1 columna
- [ ] Cards apiladas verticalmente
- [ ] Tablas scroll horizontal
- [ ] Botones touch-friendly (min 44px)
- [ ] Text legible sin zoom
- [ ] Forms usables
- [ ] Modals full-screen

### Tablet (768px - 1024px)
- [ ] Grids en 2 columnas
- [ ] Sidebar visible pero estrecha
- [ ] Dashboard en 2 columnas
- [ ] Tablas visibles completas
- [ ] Touch targets adecuados

### Desktop (> 1024px)
- [ ] Sidebar completa visible
- [ ] Grids en 3-4 columnas
- [ ] Dashboard usa espacio completo
- [ ] Hover effects funcionan
- [ ] Modals centrados

---

## 15. Performance

### Carga Inicial
- [ ] First Contentful Paint < 1.5s
- [ ] Time to Interactive < 3s
- [ ] Largest Contentful Paint < 2.5s
- [ ] No layout shifts (CLS < 0.1)

### Runtime
- [ ] Smooth scroll (60fps)
- [ ] Transiciones sin lag
- [ ] Inputs responsive (<100ms)
- [ ] No memory leaks
- [ ] Imágenes optimizadas

### Network
- [ ] Requests minimizados
- [ ] Assets comprimidos (gzip)
- [ ] Imágenes lazy-loaded
- [ ] Fonts preloaded
- [ ] API calls debounced

---

## 16. Seguridad

### Autenticación
- [ ] Passwords hasheadas
- [ ] Sesiones con JWT
- [ ] Refresh tokens funcionan
- [ ] CSRF protection activa
- [ ] Rate limiting en login

### Autorización
- [ ] RLS en Supabase activo
- [ ] Usuarios solo ven su tenant
- [ ] No se puede acceder a otros tenants
- [ ] Roles funcionan correctamente

### Input Validation
- [ ] Todos los inputs validados
- [ ] SQL injection prevenida
- [ ] XSS prevenida
- [ ] CSRF tokens en forms
- [ ] File uploads validados (tipo, tamaño)

### API Keys
- [ ] No expuestas en cliente
- [ ] Guardadas en .env
- [ ] No en git (.gitignore)
- [ ] Rotación posible

---

## 17. Integrations

### WhatsApp Business API
- [ ] Webhook recibe mensajes
- [ ] Signature validation funciona
- [ ] Mensajes se envían correctamente
- [ ] Errores se manejan
- [ ] Rate limits respetados

### Lemon Squeezy
- [ ] Checkout flow completo
- [ ] Webhook recibe eventos
- [ ] Signature validation funciona
- [ ] Suscripciones se crean
- [ ] Cancelaciones se procesan
- [ ] Cambios de plan funcionan

### Claude API
- [ ] API key válida
- [ ] Requests funcionan
- [ ] Responses se parsean
- [ ] Errores se manejan
- [ ] Rate limits manejados

---

## 18. Accesibilidad

### WCAG 2.1 AA
- [ ] Contraste de colores suficiente (4.5:1)
- [ ] Todo navegable con teclado
- [ ] Focus indicators visibles
- [ ] Alt text en imágenes
- [ ] Labels en form inputs
- [ ] Headings jerárquicos
- [ ] ARIA labels donde necesario
- [ ] Screen reader friendly

---

## 19. Cross-Browser

### Desktop
- [ ] Chrome (latest) ✓
- [ ] Firefox (latest) ✓
- [ ] Safari (latest) ✓
- [ ] Edge (latest) ✓

### Mobile
- [ ] Safari iOS (latest) ✓
- [ ] Chrome Android (latest) ✓
- [ ] Firefox Android (latest) ✓

---

## 20. Errores y Edge Cases

### Manejo de Errores
- [ ] 404 página personalizada
- [ ] 500 página personalizada
- [ ] Network errors muestran mensaje
- [ ] Form errors inline
- [ ] Toast notifications para acciones
- [ ] Retry buttons donde aplica

### Edge Cases
- [ ] Sin datos muestra empty state
- [ ] Carga muestra skeleton/spinner
- [ ] Demasiados items: paginación
- [ ] Fechas inválidas rechazadas
- [ ] Duplicados prevenidos
- [ ] Concurrent edits manejados

---

## ✅ Criterios de Aprobación

Para aprobar QA y pasar a producción:

1. **Críticos**: 100% de tests críticos pasados
2. **Altos**: > 95% de tests altos pasados
3. **Medios**: > 90% de tests medios pasados
4. **Performance**: Lighthouse score > 90
5. **Seguridad**: 0 vulnerabilidades críticas
6. **Accesibilidad**: WCAG 2.1 AA compliant

---

## 📊 Reporte Final

**Fecha de QA**: _______  
**Tester**: _______

**Resultados**:
- Críticos: ___ / ___ (___%)
- Altos: ___ / ___ (___%)
- Medios: ___ / ___ (___%)
- Bajos: ___ / ___ (___%)

**Total**: ___ / ___ (___%)

**Bugs Encontrados**: ___  
**Bugs Resueltos**: ___  
**Bugs Pendientes**: ___

**Aprobado para Producción**: [ ] SÍ [ ] NO

**Observaciones**:
_______________________________________
_______________________________________
_______________________________________
