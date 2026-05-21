# 📄 VeriFactu - Sistema de Facturación AEAT

**Actualizado:** 20 Mayo 2026  
**Estado:** ✅ UI completada (Tarea #11)  
**Pendiente:** Integración con API VeriFactu de AEAT

---

## 🎯 ¿Qué es VeriFactu?

**VeriFactu** es el sistema obligatorio de la Agencia Tributaria Española (AEAT) para software de facturación, en vigor desde **julio 2024** (Ley Antifraude).

**Objetivo:** Garantizar la integridad e inalterabilidad de las facturas mediante:
- Registro en tiempo real con la AEAT
- Huella digital (hash) de cada factura
- Código QR con información fiscal
- Trazabilidad completa

**Sanción por incumplimiento:** Hasta €50,000 por infracción grave.

---

## 📋 Requisitos Legales

### Datos obligatorios en cada factura:

1. **Emisor (Salón):**
   - Razón social
   - NIF
   - Dirección fiscal
   - Número de factura secuencial

2. **Receptor (Cliente):**
   - Nombre completo o razón social
   - NIF/DNI
   - Dirección (opcional pero recomendado)

3. **Factura:**
   - Fecha de emisión
   - Fecha de vencimiento (opcional)
   - Líneas con: descripción, cantidad, precio unitario, IVA
   - Subtotal, IVA desglosado, Total

4. **VeriFactu:**
   - **Huella digital (hash)** de la factura anterior (encadenamiento)
   - **Código QR** con datos fiscales
   - **Registro en AEAT** en las siguientes 4 horas

---

## 🏗️ Arquitectura del Sistema

### Flujo de Facturación:

```
1. Usuario crea factura en ElenaOS
   ↓
2. Sistema valida datos obligatorios
   ↓
3. Se calcula huella digital (SHA-256)
   - Incluye: número factura, NIF, fecha, importe, hash anterior
   ↓
4. Se genera código QR
   - Contiene: NIF salón, número factura, fecha, importe, hash
   ↓
5. Se guarda en BD local
   ↓
6. Se envía a AEAT (API VeriFactu)
   - Endpoint: https://www2.agenciatributaria.gob.es/wlpl/BUCV-JDIT/VeriFactuServicioWeb
   - Método: POST
   - Auth: Certificado digital del salón
   ↓
7. AEAT responde con:
   - ✅ Código de registro (CSV)
   - ✅ Timestamp de registro
   - ❌ Errores de validación
   ↓
8. Se actualiza factura con CSV
   ↓
9. Se genera PDF final con QR
```

---

## 🔧 Implementación en ElenaOS

### 1. Schema de Base de Datos

```sql
-- Tabla: invoices (dentro del schema del tenant)
CREATE TABLE invoices (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID NOT NULL REFERENCES tenants(id),
  
  -- Numeración
  number VARCHAR(50) NOT NULL UNIQUE, -- FAC-2026-0001
  series VARCHAR(10) DEFAULT 'FAC',
  year INTEGER NOT NULL,
  sequence_number INTEGER NOT NULL,
  
  -- Cliente
  client_id UUID REFERENCES clients(id),
  client_name VARCHAR(255) NOT NULL,
  client_nif VARCHAR(20) NOT NULL,
  client_address TEXT,
  
  -- Fechas
  issue_date DATE NOT NULL,
  due_date DATE,
  
  -- Estado
  status VARCHAR(20) NOT NULL DEFAULT 'draft', 
  -- draft, sent, paid, overdue, cancelled
  
  -- Importes
  subtotal DECIMAL(10,2) NOT NULL,
  tax_amount DECIMAL(10,2) NOT NULL,
  total_amount DECIMAL(10,2) NOT NULL,
  
  -- VeriFactu
  verifactu_status VARCHAR(20) DEFAULT 'pending',
  -- pending, sent, verified, error
  verifactu_hash VARCHAR(64), -- SHA-256 de la factura
  verifactu_previous_hash VARCHAR(64), -- Hash de factura anterior
  verifactu_qr_code TEXT, -- Datos del QR
  verifactu_csv VARCHAR(50), -- Código Seguro Verificación de AEAT
  verifactu_sent_at TIMESTAMPTZ,
  verifactu_verified_at TIMESTAMPTZ,
  verifactu_error TEXT,
  
  -- Metadatos
  created_by UUID,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabla: invoice_lines
CREATE TABLE invoice_lines (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  invoice_id UUID NOT NULL REFERENCES invoices(id) ON DELETE CASCADE,
  
  line_number INTEGER NOT NULL,
  description VARCHAR(255) NOT NULL,
  quantity DECIMAL(10,2) NOT NULL DEFAULT 1,
  unit_price DECIMAL(10,2) NOT NULL,
  tax_rate DECIMAL(5,2) NOT NULL DEFAULT 21.00,
  
  line_subtotal DECIMAL(10,2) NOT NULL, -- quantity * unit_price
  line_tax DECIMAL(10,2) NOT NULL, -- line_subtotal * tax_rate / 100
  line_total DECIMAL(10,2) NOT NULL, -- line_subtotal + line_tax
  
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices
CREATE INDEX idx_invoices_tenant ON invoices(tenant_id);
CREATE INDEX idx_invoices_client ON invoices(client_id);
CREATE INDEX idx_invoices_status ON invoices(status);
CREATE INDEX idx_invoices_issue_date ON invoices(issue_date);
CREATE INDEX idx_invoices_verifactu_status ON invoices(verifactu_status);

-- Trigger para actualizar updated_at
CREATE TRIGGER update_invoices_updated_at
  BEFORE UPDATE ON invoices
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
```

---

### 2. Librería VeriFactu (`lib/verifactu/client.ts`)

```typescript
import crypto from 'crypto'
import QRCode from 'qrcode'

interface InvoiceData {
  tenantNIF: string
  number: string
  issueDate: string
  totalAmount: number
  previousHash?: string
}

interface VeriFactuResponse {
  success: boolean
  csv?: string // Código Seguro Verificación
  timestamp?: string
  error?: string
}

/**
 * Calcula el hash SHA-256 de una factura (huella digital)
 */
export function calculateInvoiceHash(invoice: InvoiceData): string {
  const data = [
    invoice.tenantNIF,
    invoice.number,
    invoice.issueDate,
    invoice.totalAmount.toFixed(2),
    invoice.previousHash || ''
  ].join('|')

  return crypto
    .createHash('sha256')
    .update(data, 'utf8')
    .digest('hex')
}

/**
 * Genera el código QR para la factura
 */
export async function generateInvoiceQR(invoice: InvoiceData, hash: string): Promise<string> {
  // Formato del QR según especificación AEAT
  const qrData = [
    `NIF=${invoice.tenantNIF}`,
    `NUM=${invoice.number}`,
    `FECHA=${invoice.issueDate}`,
    `IMPORTE=${invoice.totalAmount.toFixed(2)}`,
    `HASH=${hash.substring(0, 16)}` // Primeros 16 caracteres del hash
  ].join('&')

  // Generar QR como Data URL
  const qrCodeDataURL = await QRCode.toDataURL(qrData, {
    errorCorrectionLevel: 'M',
    width: 200
  })

  return qrCodeDataURL
}

/**
 * Envía la factura a la API de VeriFactu (AEAT)
 */
export async function sendToVeriFactu(
  invoice: InvoiceData,
  hash: string,
  certificatePath: string
): Promise<VeriFactuResponse> {
  try {
    // TODO: Implementar llamada real a AEAT
    // Requiere:
    // - Certificado digital del salón (FNMT o equivalente)
    // - Endpoint: https://www2.agenciatributaria.gob.es/wlpl/BUCV-JDIT/VeriFactuServicioWeb
    // - XML firmado con el certificado

    // Mock response para desarrollo
    await new Promise(resolve => setTimeout(resolve, 1000))

    return {
      success: true,
      csv: `CSV${Date.now()}`,
      timestamp: new Date().toISOString()
    }
  } catch (error) {
    console.error('Error sending to VeriFactu:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Error desconocido'
    }
  }
}

/**
 * Verifica el estado de una factura en VeriFactu
 */
export async function verifyInvoiceStatus(
  nif: string,
  invoiceNumber: string,
  csv: string
): Promise<{ verified: boolean; details?: any }> {
  try {
    // TODO: Implementar consulta a AEAT
    // Endpoint de consulta

    return {
      verified: true,
      details: {
        status: 'verified',
        timestamp: new Date().toISOString()
      }
    }
  } catch (error) {
    console.error('Error verifying invoice:', error)
    return { verified: false }
  }
}
```

---

### 3. API Endpoints

#### `POST /api/invoices/create`

Crea una nueva factura y la registra en VeriFactu.

**Request:**
```json
{
  "clientId": "uuid",
  "clientName": "Carmen López",
  "clientNIF": "12345678A",
  "clientAddress": "Calle...",
  "issueDate": "2026-05-20",
  "dueDate": "2026-06-20",
  "lines": [
    {
      "description": "Manicura clásica",
      "quantity": 1,
      "unitPrice": 25.00,
      "taxRate": 21
    }
  ],
  "sendImmediately": true
}
```

**Response:**
```json
{
  "success": true,
  "invoiceId": "uuid",
  "invoiceNumber": "FAC-2026-0045",
  "total": 30.25,
  "veriFactuStatus": "sent",
  "csv": "CSV1234567890"
}
```

---

#### `GET /api/invoices`

Obtiene lista de facturas con filtros.

**Query params:**
- `status`: draft, sent, paid, overdue
- `from`: fecha desde (YYYY-MM-DD)
- `to`: fecha hasta
- `clientId`: filtrar por cliente

**Response:**
```json
{
  "invoices": [
    {
      "id": "uuid",
      "number": "FAC-2026-0045",
      "clientName": "Carmen López",
      "issueDate": "2026-05-20",
      "dueDate": "2026-06-20",
      "totalAmount": 30.25,
      "status": "paid",
      "veriFactuStatus": "verified"
    }
  ],
  "total": 1
}
```

---

#### `GET /api/invoices/[id]/pdf`

Genera y descarga el PDF de una factura.

**Response:** PDF file con:
- Datos del salón y cliente
- Líneas de factura
- Totales desglosados
- **Código QR** (VeriFactu)
- **CSV** de registro AEAT
- Nota legal de VeriFactu

---

#### `POST /api/invoices/[id]/send`

Envía factura por email al cliente.

**Request:**
```json
{
  "email": "cliente@email.com",
  "message": "Adjunto encontrarás tu factura..."
}
```

---

#### `POST /api/invoices/[id]/mark-paid`

Marca factura como pagada.

---

## 📄 Generación de PDF

Usar librería **`react-pdf`** o **`pdfkit`** para generar PDFs.

**Estructura del PDF:**

```
┌─────────────────────────────────────────┐
│  LOGO SALÓN          FAC-2026-0045      │
│  Nombre del Salón                       │
│  NIF: B12345678                         │
│  Dirección fiscal                       │
├─────────────────────────────────────────┤
│  FACTURA A:                             │
│  Carmen López García                    │
│  NIF: 12345678A                         │
│  Dirección...                           │
├─────────────────────────────────────────┤
│  Fecha: 20/05/2026                      │
│  Vencimiento: 20/06/2026                │
├─────────────────────────────────────────┤
│  CONCEPTOS                              │
│  ┌──────────────────────────────────┐   │
│  │ Descripción    Cant  Precio  Total│  │
│  │ Manicura       1     25.00   25.00│  │
│  └──────────────────────────────────┘   │
│                                         │
│  Subtotal:                     25.00€   │
│  IVA (21%):                     5.25€   │
│  ──────────────────────────────────     │
│  TOTAL:                        30.25€   │
├─────────────────────────────────────────┤
│           [CÓDIGO QR]                   │
│     Verificación VeriFactu              │
│     CSV: CSV1234567890                  │
└─────────────────────────────────────────┘
```

---

## 🔐 Certificado Digital

Para conectar con la AEAT necesitas un **certificado digital**:

### Opciones:

1. **FNMT (Fábrica Nacional de Moneda y Timbre)**
   - Certificado de persona jurídica
   - Coste: ~€25/año
   - Trámite: https://www.sede.fnmt.gob.es

2. **Certificado de entidad sin personalidad jurídica**
   - Para autónomos
   - Similar proceso

3. **Certificado de representante**
   - El administrador puede firmar en nombre del salón

### Instalación del certificado:

```typescript
// Node.js con certificado .pfx
import https from 'https'
import fs from 'fs'

const agent = new https.Agent({
  pfx: fs.readFileSync('/path/to/certificate.pfx'),
  passphrase: 'password'
})

// Usar en llamadas a AEAT
fetch('https://aeat.endpoint', {
  agent,
  method: 'POST',
  body: xmlData
})
```

---

## 🧪 Testing

### Entorno de Pruebas AEAT:

La AEAT proporciona un entorno de pruebas:
- URL: https://www7.aeat.gob.es/wlpl/BUCV-JDIT/VeriFactuPruebas
- Certificado de pruebas disponible

### Test 1: Calcular hash

```typescript
import { calculateInvoiceHash } from '@/lib/verifactu/client'

const invoice = {
  tenantNIF: 'B12345678',
  number: 'FAC-2026-0001',
  issueDate: '2026-05-20',
  totalAmount: 30.25,
  previousHash: undefined // Primera factura
}

const hash = calculateInvoiceHash(invoice)
console.log(hash) // 64 caracteres hexadecimales
```

### Test 2: Generar QR

```typescript
import { generateInvoiceQR } from '@/lib/verifactu/client'

const qrDataURL = await generateInvoiceQR(invoice, hash)
// qrDataURL = "data:image/png;base64,..."

// Mostrar en HTML:
// <img src={qrDataURL} alt="QR VeriFactu" />
```

### Test 3: Envío a AEAT (mock)

```typescript
import { sendToVeriFactu } from '@/lib/verifactu/client'

const response = await sendToVeriFactu(
  invoice,
  hash,
  '/path/to/cert.pfx'
)

console.log(response)
// { success: true, csv: 'CSV1234...', timestamp: '...' }
```

---

## 📊 Reportes y Cumplimiento

### Libro de Facturas:

Obligatorio mantener registro de:
- Facturas emitidas (ordenadas por número)
- Facturas rectificativas
- Hashes y CSVs de VeriFactu

**Exportar:**
```typescript
POST /api/invoices/export

{
  "format": "csv" | "excel" | "pdf",
  "from": "2026-01-01",
  "to": "2026-12-31"
}
```

### Declaración trimestral IVA:

El sistema debe poder generar:
- Total Base Imponible por tipo de IVA
- Total IVA repercutido
- Listado de facturas del trimestre

---

## ⚠️ Errores Comunes

### Error 1: Hash inválido
**Causa:** Cambios en factura después de calcular hash  
**Solución:** Recalcular hash antes de enviar

### Error 2: Numeración duplicada
**Causa:** Dos facturas con mismo número  
**Solución:** Usar secuencia de BD con `SERIAL` o `SEQUENCE`

### Error 3: Certificado expirado
**Causa:** Certificado digital caducado  
**Solución:** Renovar certificado en FNMT

### Error 4: NIF inválido
**Causa:** NIF no validado  
**Solución:** Validar con algoritmo de NIF español

---

## 📚 Referencias

- [Ley Antifraude (Ley 11/2021)](https://www.boe.es/buscar/act.php?id=BOE-A-2021-11473)
- [Reglamento VeriFactu](https://www.agenciatributaria.es/AEAT.internet/verifactu)
- [Especificaciones técnicas VeriFactu (PDF)](https://www.agenciatributaria.es/static_files/AEAT/Contenidos_Comunes/La_Agencia_Tributaria/Modelos_y_formularios/Certificados_y_registros/VeriFactu_Especificaciones.pdf)
- [FNMT - Certificados digitales](https://www.sede.fnmt.gob.es)

---

## 🚀 Próximos Pasos

### Para producción:

1. ✅ Obtener certificado digital del salón
2. ✅ Implementar `lib/verifactu/client.ts` con llamadas reales
3. ✅ Crear endpoints `/api/invoices/*`
4. ✅ Implementar generación de PDF con QR
5. ✅ Configurar cron job para reintentos de envío fallidos
6. ✅ Testing exhaustivo en entorno de pruebas AEAT
7. ✅ Documentar procedimiento de alta en AEAT

### Features V2:

- [ ] Facturas rectificativas (devoluciones)
- [ ] Facturas periódicas (abonos mensuales)
- [ ] Series de facturas (A, B, C)
- [ ] Cobros automáticos (Stripe/Redsys)
- [ ] Recordatorios de pago automáticos
- [ ] Integración con contabilidad (ej: Holded, Sage)

---

**Última actualización:** 20 Mayo 2026  
**Responsable:** Claude (Powered by Rommer Volcanes)  
**Estado:** UI completada - Pendiente integración AEAT real
