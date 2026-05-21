'use client'

import { useState } from 'react'
import { X, Plus, Trash2, Save, Send, FileText } from 'lucide-react'

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
    setIsSaving(true)

    try {
      // TODO: Implementar guardado en BD y envío a VeriFactu
      await new Promise(resolve => setTimeout(resolve, 1500))

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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nombre completo *
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
