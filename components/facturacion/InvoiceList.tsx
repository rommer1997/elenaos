'use client'

import { useEffect, useState } from 'react'
import {
  FileText,
  Download,
  Send,
  Eye,
  MoreVertical,
  CheckCircle,
  Clock,
  XCircle,
  AlertTriangle,
  Search
} from 'lucide-react'
import { useUser } from '@/hooks/useUser'
import { createClient } from '@/lib/supabase/client'
import type { Invoice } from '@/types'

type ViewType = 'all' | 'draft' | 'sent' | 'paid' | 'overdue'

interface InvoiceListProps {
  view: ViewType
}

export function InvoiceList({ view }: InvoiceListProps) {
  const { tenant } = useUser()
  const [searchQuery, setSearchQuery] = useState('')
  const [invoices, setInvoices] = useState<Invoice[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (!tenant?.schema_name) return
    loadInvoices()
  }, [tenant?.schema_name])

  const loadInvoices = async () => {
    if (!tenant?.schema_name) return
    setIsLoading(true)
    const supabase = createClient()
    try {
      const { data, error } = await supabase
        .schema(tenant.schema_name)
        .from('invoices')
        .select(`
          *,
          client:clients(first_name, last_name)
        `)
      if (error) throw error
      setInvoices(data || [])
    } catch (e) {
      console.error('Error loading invoices:', e)
      setInvoices([])
    } finally {
      setIsLoading(false)
    }
  }

  const filteredInvoices = invoices
    .filter(invoice => {
      if (view !== 'all' && invoice.status !== view) {
        return false
      }
      if (searchQuery) {
        const query = searchQuery.toLowerCase()
        const clientName = invoice.client ? `${invoice.client.first_name} ${invoice.client.last_name || ''}`.toLowerCase() : ''
        return (
          invoice.invoice_number.toLowerCase().includes(query) ||
          clientName.includes(query)
        )
      }
      return true
    })

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'draft':
        return {
          icon: Clock,
          label: 'Borrador',
          className: 'bg-gray-100 text-gray-800'
        }
      case 'sent':
        return {
          icon: Send,
          label: 'Enviada',
          className: 'bg-blue-100 text-blue-800'
        }
      case 'paid':
        return {
          icon: CheckCircle,
          label: 'Pagada',
          className: 'bg-green-100 text-green-800'
        }
      case 'overdue':
        return {
          icon: XCircle,
          label: 'Vencida',
          className: 'bg-red-100 text-red-800'
        }
      default:
        return {
          icon: Clock,
          label: 'Desconocido',
          className: 'bg-gray-100 text-gray-800'
        }
    }
  }

  const getVeriFactuBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return {
          label: 'Pendiente AEAT',
          className: 'bg-gray-100 text-gray-700'
        }
      case 'sent':
        return {
          label: 'Enviada AEAT',
          className: 'bg-blue-100 text-blue-700'
        }
      case 'verified':
        return {
          label: '✓ Verificada AEAT',
          className: 'bg-green-100 text-green-700'
        }
      case 'error':
        return {
          label: '⚠ Error AEAT',
          className: 'bg-red-100 text-red-700'
        }
      default:
        return {
          label: 'Desconocido',
          className: 'bg-gray-100 text-gray-700'
        }
    }
  }

  return (
    <div className="space-y-6">
      {/* Search */}
      <div className="bg-white rounded-lg shadow-sm p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar por número de factura o cliente..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Invoice list */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        {filteredInvoices.length === 0 ? (
          <div className="p-12 text-center">
            <FileText className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              No hay facturas
            </h3>
            <p className="text-gray-600">
              {searchQuery
                ? 'No se encontraron resultados para tu búsqueda'
                : 'Crea tu primera factura para comenzar'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Número
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Cliente
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Fecha
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Vencimiento
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Importe
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Estado
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    VeriFactu
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredInvoices.map((invoice) => {
                  const statusBadge = getStatusBadge(invoice.status)
                  const StatusIcon = statusBadge.icon
                  const clientName = invoice.client ? `${invoice.client.first_name} ${invoice.client.last_name || ''}`.trim() : 'Cliente sin nombre'
                  const veriFactuStatus = invoice.verifactu_sent ? 'verified' : 'pending'
                  const veriFactuBadge = getVeriFactuBadge(veriFactuStatus)

                  return (
                    <tr key={invoice.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <FileText className="h-4 w-4 text-gray-400" />
                          <span className="font-medium text-gray-900">{invoice.invoice_number}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{clientName}</div>
                        {invoice.payment_method && (
                          <div className="text-xs text-gray-500">{invoice.payment_method}</div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {new Date(invoice.issue_date).toLocaleDateString('es-ES')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {new Date(invoice.due_date || invoice.issue_date).toLocaleDateString('es-ES')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-semibold text-gray-900">
                          €{invoice.total.toFixed(2)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${statusBadge.className}`}>
                          <StatusIcon className="h-3 w-3" />
                          {statusBadge.label}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${veriFactuBadge.className}`}>
                          {veriFactuBadge.label}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                            title="Ver factura"
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                          <button
                            className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                            title="Descargar PDF"
                          >
                            <Download className="h-4 w-4" />
                          </button>
                          {invoice.status === 'draft' && (
                            <button
                              className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                              title="Enviar factura"
                            >
                              <Send className="h-4 w-4" />
                            </button>
                          )}
                          <button
                            className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                            title="Más opciones"
                          >
                            <MoreVertical className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Info box */}
      {view === 'overdue' && filteredInvoices.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="font-semibold text-red-900">Facturas Vencidas</h4>
              <p className="text-sm text-red-800 mt-1">
                Tienes {filteredInvoices.length} factura(s) vencida(s). Considera enviar un recordatorio de pago
                o activar el sistema de cobro automático.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
