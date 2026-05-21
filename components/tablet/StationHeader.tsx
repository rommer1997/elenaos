'use client'

import { Clock, User, Settings } from 'lucide-react'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'

interface StationHeaderProps {
  staffName: string
  currentTime: Date
  onStaffChange: (name: string) => void
}

export function StationHeader({ staffName, currentTime, onStaffChange }: StationHeaderProps) {
  const staffMembers = ['Elena', 'Carmen', 'María', 'Ana']

  return (
    <div className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-4">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            ElenaOS
          </h1>
          <span className="text-sm text-gray-500">Estación de trabajo</span>
        </div>

        {/* Center - Time */}
        <div className="flex items-center gap-3 px-6 py-3 bg-gray-50 rounded-xl">
          <Clock className="h-6 w-6 text-gray-600" />
          <div>
            <div className="text-2xl font-bold text-gray-900">
              {format(currentTime, 'HH:mm:ss')}
            </div>
            <div className="text-sm text-gray-600">
              {format(currentTime, "EEEE, d 'de' MMMM", { locale: es })}
            </div>
          </div>
        </div>

        {/* Right - Staff selector */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3">
            <User className="h-5 w-5 text-gray-600" />
            <select
              value={staffName}
              onChange={(e) => onStaffChange(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg font-medium text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              {staffMembers.map((name) => (
                <option key={name} value={name}>
                  {name}
                </option>
              ))}
            </select>
          </div>

          <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <Settings className="h-6 w-6 text-gray-600" />
          </button>
        </div>
      </div>
    </div>
  )
}
