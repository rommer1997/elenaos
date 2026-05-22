'use client'

import { useEffect, useState } from 'react'
import { X, Plus, Trash2, Save, Send, FileText } from 'lucide-react'
import { useUser } from '@/hooks/useUser'
import { createClient } from '@/lib/supabase/client'

interface InvoiceModalProps {
  isOpen: boolean
  onClose: () => void
  invoiceId?: string
}

interface InvoiceLine {
  id: string
  description: string
  quantity: number
  unitPrice: number
  taxRate: number
}

export function InvoiceModal({ isOpen, onClose, invoiceId }: InvoiceModalProps) {
  const { tenant } = useUser()
  const [clientSearch, setClientSearch] = useState('')
  const [clients, setClients] = useState<any[]>([])
  const [selectedClient, setSelectedClient] = useState<any | null>(null)

  const [clientName, setClientName] = useState('')
  const [clientNIF, setClientNIF] = useState('')
  const [clientAddress, setClientAddress] = useState('')
  const [invoiceDate, setInvoiceDate] = useState(new Date().toISOString().split('T')[0])
  const [dueDate, setDueDate] = useState('')
  const [lines, setLines] = useState<InvoiceLine[]>([
    {
      id: '1',
      description: '',
      quantity: 1,
      unitPrice: 0,
      taxRate: 21
    }
  ])
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    if (isOpen && tenant?.schema_name) {
      loadClients()
    }
  }, [isOpen, tenant?.schema_name])

  const loadClients = async () => {
    if (!tenant?.schema_name) return
    const supabase = createClient()
    try {
      const { data, error } = await supabase
        .schema(tenant.schema_name)
        .from('clients')
        .select('*')
      if (error) throw error
      setClients(data || [])
    } catch (e) {
      console.error('Error loading clients:', e)
    }
  }

  const filteredClients = clients.filter(c =>
    `${c.first_name} ${c.last_name || ''}`.toLowerCase().includes(clientSearch.toLowerCase()) ||
    (c.phone && c.phone.includes(clientSearch))
  )

  const addLine = () => {
    setLines([
      ...lines,
      {
        id: Date.now().toString(),
        description: '',
        quantity: 1,
        unitPrice: 0,
        taxRate: 21
      }
    ])
  }

  const removeLine = (id: string) => {
    if (lines.length > 1) {
      setLines(lines.filter(line => line.id !== id))
    }
  }

  const updateLine = (id: string, field: keyof InvoiceLine, value: any) => {
    setLines(lines.map(line =>
      line.id === id ? { ...line, [field]: value } : line
    ))
  }

  const calculateSubtotal = () => {
    return lines.reduce((sum, line) => sum + (line.quantity * line.unitPrice), 0)
  }

  const calculateTax = () => {
    return lines.reduce((sum, line) => {
      const lineTotal = line.quantity * line.unitPrice
      return sum + (lineTotal * line.taxRate / 100)
    }, 0)
  }

  const calculateTotal = () => {
    return calculateSubtotal() + calculateTax()
  }

  const handleSave = async (sendImmediately: boolean = false) => {
    if (!tenant?.schema_name) {
      alert('Información del salón no disponible')
      return
    }

    setIsSaving(true)
    const supabase = createClient()

    try {
      const year = new Date(invoiceDate).getFullYear()
      const { data: maxSeqData, error: maxSeqError } = await supabase
        .schema(tenant.schema_name)
        .from('invoices')
        .select('sequence_number')
        .eq('year', year)
        .order('sequence_number', { ascending: false })
        .limit(1)

      if (maxSeqError) throw maxSeqError

      const nextSequence = maxSeqData && maxSeqData.length > 0 
        ? maxSeqData[0].sequence_number + 1 
        : 1

      const invoiceNumber = `FAC-${year}-${nextSequence.toString().padStart(4, '0')}`

      const subtotal = calculateSubtotal()
      const taxAmount = calculateTax()
      const totalAmount = calculateTotal()

      const invoicePayload = {
        tenant_id: tenant.id,
        number: invoiceNumber,
        series: 'FAC',
        year,
        sequence_number: nextSequence,
        client_id: selectedClient?.id || null,
        client_name: clientName,
        client_nif: clientNIF,
        client_address: clientAddress || null,
        issue_date: invoiceDate,
        due_date: dueDate || null,
        status: sendImmediately ? 'sent' : 'draft',
        subtotal,
        tax_amount: taxAmount,
        total_amount: totalAmount,
        verifactu_status: sendImmediately ? 'sent' : 'pending',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }

      const { data: insertedInvoice, error: insertError } = await supabase
        .schema(tenant.schema_name)
        .from('invoices')
        .insert(invoicePayload)
        .select()
        .single()

      if (insertError) throw insertError

      if (insertedInvoice && lines.length > 0) {
        const linePayloads = lines.map((line, index) => {
          const lineSubtotal = line.quantity * line.unitPrice
          const lineTax = lineSubtotal * line.taxRate / 100
          const lineTotal = lineSubtotal + lineTax

          return {
            invoice_id: insertedInvoice.id,
            line_number: index + 1,
            description: line.description,
            quantity: line.quantity,
            unit_price: line.unitPrice,
            tax_rate: line.taxRate,
            line_subtotal: lineSubtotal,
            line_tax: lineTax,
            line_total: lineTotal
          }
        })

        const { error: linesError } = await supabase
          .schema(tenant.schema_name)
          .from('invoice_lines')
          .insert(linePayloads)

        if (linesError) throw linesError
      }

      if (sendImmediately) {
        alert('✅ Factura guardada y enviada correctamente')
      } else {
        alert('✅ Factura guardada como borrador')
      }

      onClose()
    } catch (error) {
      console.error('Error saving invoice:', error)
      alert('❌ Error guardando factura')
    } finally {
      setIsSaving(false)
    }
  }

  if (!isOpen) return null

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/50 z-50" onClick={onClose} />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
        <div
          className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto pointer-events-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200 sticky top-0 bg-white z-10">
            <div className="flex items-center gap-3">
              <FileText className="h-6 w-6 text-purple-600" />
              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  {invoiceId ? 'Editar Factura' : 'Nueva Factura'}
                </h2>
                <p className="text-sm text-gray-600">Cumple con VeriFactu (AEAT)</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Body */}
          <div className="p-6 space-y-6">
            {/* Client info */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Datos del Cliente</h3>
              
              {/* Client Autocomplete Search */}
              <div className="mb-4 relative">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Buscar Clienta Existente (Opcional)
                </label>
                <input
                  type="text"
                  value={clientSearch}
                  onChange={(e) => {
                    setClientSearch(e.target.value)
                    setSelectedClient(null)
                  }}
                  placeholder="Escribe nombre o teléfono para buscar..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
                {clientSearch && !selectedClient && (
                  <div className="absolute z-20 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                    {filteredClients.length > 0 ? (
                      filteredClients.map((c) => (
                        <button
                          key={c.id}
                          type="button"
                          onClick={() => {
                            setSelectedClient(c)
                            setClientName(`${c.first_name} ${c.last_name || ''}`.trim())
                            setClientNIF(c.nif || '')
                            setClientAddress(c.notes || '')
                            setClientSearch('')
                          }}
                          className="w-full text-left px-4 py-2 hover:bg-purple-50 flex justify-between items-center border-b border-gray-100 last:border-0"
                        >
                          <div>
                            <span className="font-medium text-gray-900">
                              {c.first_name} {c.last_name || ''}
                            </span>
                            <span className="text-xs text-gray-500 ml-2">({c.phone})</span>
                          </div>
                        </button>
                      ))
                    ) : (
                      <div className="px-4 py-2 text-sm text-gray-500">
                        No se encontraron clientas
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nombre completo o Razón Social *
                  </label>
                  <input
                    type="text"
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    placeholder="Carmen López García"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    NIF/DNI *
                  </label>
                  <input
                    type="text"
                    value={clientNIF}
                    onChange={(e) => setClientNIF(e.target.value)}
                    placeholder="12345678A"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Dirección
                  </label>
                  <input
                    type="text"
                    value={clientAddress}
                    onChange={(e) => setClientAddress(e.target.value)}
                    placeholder="Calle Ejemplo, 123, 28001 Madrid"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            {/* Invoice dates */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Fechas</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Fecha de emisión *
                  </label>
                  <input
                    type="date"
                    value={invoiceDate}
                    onChange={(e) => setInvoiceDate(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Fecha de vencimiento
                  </label>
                  <input
                    type="date"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            {/* Invoice lines */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Líneas de Factura</h3>
                <button
                  onClick={addLine}
                  className="flex items-center gap-2 px-3 py-1.5 text-sm text-purple-700 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors"
                >
                  <Plus className="h-4 w-4" />
                  <span>Añadir línea</span>
                </button>
              </div>

              <div className="space-y-3">
                {lines.map((line, index) => (
                  <div key={line.id} className="flex gap-3 items-start">
                    <div className="flex-1 grid grid-cols-12 gap-3">
                      {/* Description */}
                      <div className="col-span-5">
                        {index === 0 && (
                          <label className="block text-xs font-medium text-gray-700 mb-1">
                            Descripción
                          </label>
                        )}
                        <input
                          type="text"
                          value={line.description}
                          onChange={(e) => updateLine(line.id, 'description', e.target.value)}
                          placeholder="Ej: Manicura clásica"
                          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        />
                      </div>

                      {/* Quantity */}
                      <div className="col-span-2">
                        {index === 0 && (
                          <label className="block text-xs font-medium text-gray-700 mb-1">
                            Cant.
                          </label>
                        )}
                        <input
                          type="number"
                          min="1"
                          value={line.quantity}
                          onChange={(e) => updateLine(line.id, 'quantity', parseInt(e.target.value) || 1)}
                          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        />
                      </div>

                      {/* Unit price */}
                      <div className="col-span-2">
                        {index === 0 && (
                          <label className="block text-xs font-medium text-gray-700 mb-1">
                            Precio (€)
                          </label>
                        )}
                        <input
                          type="number"
                          min="0"
                          step="0.01"
                          value={line.unitPrice}
                          onChange={(e) => updateLine(line.id, 'unitPrice', parseFloat(e.target.value) || 0)}
                          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        />
                      </div>

                      {/* Tax rate */}
                      <div className="col-span-2">
                        {index === 0 && (
                          <label className="block text-xs font-medium text-gray-700 mb-1">
                            IVA (%)
                          </label>
                        )}
                        <select
                          value={line.taxRate}
                          onChange={(e) => updateLine(line.id, 'taxRate', parseInt(e.target.value))}
                          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        >
                          <option value="0">0%</option>
                          <option value="4">4%</option>
                          <option value="10">10%</option>
                          <option value="21">21%</option>
                        </select>
                      </div>

                      {/* Subtotal */}
                      <div className="col-span-1 flex items-end">
                        {index === 0 && (
                          <label className="block text-xs font-medium text-gray-700 mb-1 w-full text-right">
                            Total
                          </label>
                        )}
                        <div className="text-sm font-semibold text-gray-900 text-right w-full">
                          €{(line.quantity * line.unitPrice).toFixed(2)}
                        </div>
                      </div>
                    </div>

                    {/* Remove button */}
                    <button
                      onClick={() => removeLine(line.id)}
                      disabled={lines.length === 1}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-30 disabled:cursor-not-allowed mt-6"
                      title="Eliminar línea"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Totals */}
            <div className="bg-gray-50 rounded-lg p-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Subtotal:</span>
                <span className="font-medium text-gray-900">€{calculateSubtotal().toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">IVA:</span>
                <span className="font-medium text-gray-900">€{calculateTax().toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-lg font-bold border-t pt-2">
                <span className="text-gray-900">Total:</span>
                <span className="text-purple-600">€{calculateTotal().toFixed(2)}</span>
              </div>
            </div>

            {/* VeriFactu info */}
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <FileText className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-green-900">Cumplimiento VeriFactu</h4>
                  <p className="text-sm text-green-800 mt-1">
                    Esta factura se registrará automáticamente en el sistema VeriFactu de la AEAT
                    cumpliendo con la Ley Antifraude. El código QR y la huella digital se generarán
                    automáticamente.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200 bg-gray-50 sticky bottom-0">
            <button
              onClick={onClose}
              disabled={isSaving}
              className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              Cancelar
            </button>
            <button
              onClick={() => handleSave(false)}
              disabled={isSaving || !clientName || !clientNIF}
              className="flex items-center gap-2 px-4 py-2 text-purple-700 bg-purple-50 border border-purple-200 rounded-lg hover:bg-purple-100 transition-colors disabled:opacity-50"
            >
              <Save className="h-4 w-4" />
              <span>Guardar borrador</span>
            </button>
            <button
              onClick={() => handleSave(true)}
              disabled={isSaving || !clientName || !clientNIF}
              className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition-colors disabled:opacity-50"
            >
              {isSaving ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                  <span>Guardando...</span>
                </>
              ) : (
                <>
                  <Send className="h-4 w-4" />
                  <span>Guardar y enviar</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </>
  )
}
