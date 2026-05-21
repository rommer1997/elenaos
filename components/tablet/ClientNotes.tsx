'use client'

import { useState } from 'react'
import { MessageSquare, Star, Calendar } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import { es } from 'date-fns/locale'

interface HistoryItem {
  date: string
  service: string
  satisfaction: number
}

interface ClientNotesProps {
  clientName: string
  notes: string
  history: HistoryItem[]
}

export function ClientNotes({ clientName, notes, history }: ClientNotesProps) {
  const [newNote, setNewNote] = useState('')

  const handleAddNote = () => {
    if (!newNote.trim()) return

    console.log('Adding note:', newNote)
    // TODO: Guardar nota en DB
    setNewNote('')
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h3 className="text-xl font-bold text-gray-900 mb-4">
        Historial de {clientName}
      </h3>

      {/* History */}
      <div className="mb-6">
        <h4 className="text-sm font-semibold text-gray-700 mb-3">
          Últimas visitas
        </h4>
        <div className="space-y-3">
          {history.map((item, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
            >
              <div className="flex items-center gap-3">
                <Calendar className="h-4 w-4 text-gray-400" />
                <div>
                  <div className="font-medium text-gray-900">{item.service}</div>
                  <div className="text-xs text-gray-600">
                    {formatDistanceToNow(new Date(item.date), {
                      addSuffix: true,
                      locale: es
                    })}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`h-4 w-4 ${
                      i < item.satisfaction
                        ? 'fill-yellow-400 text-yellow-400'
                        : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Add new note */}
      <div>
        <h4 className="text-sm font-semibold text-gray-700 mb-3">
          Añadir nota
        </h4>
        <div className="flex gap-2">
          <input
            type="text"
            value={newNote}
            onChange={(e) => setNewNote(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleAddNote()}
            placeholder="Ej: Cliente muy satisfecha con el color..."
            className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
          <button
            onClick={handleAddNote}
            disabled={!newNote.trim()}
            className="px-6 py-3 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <MessageSquare className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  )
}
