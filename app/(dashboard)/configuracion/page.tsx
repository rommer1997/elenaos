'use client'

import { useState } from 'react'
import {
  Settings,
  Palette,
  Building2,
  Users as UsersIcon,
  Bell,
  Shield,
  Database
} from 'lucide-react'
import { AppearanceSettings } from '@/components/configuracion/AppearanceSettings'
import { BusinessSettings } from '@/components/configuracion/BusinessSettings'
import { StaffSettings } from '@/components/configuracion/StaffSettings'
import { NotificationSettings } from '@/components/configuracion/NotificationSettings'

type TabType = 'appearance' | 'business' | 'staff' | 'notifications' | 'security' | 'integrations'

export default function ConfiguracionPage() {
  const [activeTab, setActiveTab] = useState<TabType>('appearance')

  const tabs = [
    { id: 'appearance' as TabType, label: 'Apariencia', icon: Palette },
    { id: 'business' as TabType, label: 'Datos del Salón', icon: Building2 },
    { id: 'staff' as TabType, label: 'Personal', icon: UsersIcon },
    { id: 'notifications' as TabType, label: 'Notificaciones', icon: Bell },
    { id: 'security' as TabType, label: 'Seguridad', icon: Shield },
    { id: 'integrations' as TabType, label: 'Integraciones', icon: Database },
  ]

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center gap-3">
            <Settings className="h-8 w-8 text-purple-600" />
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Configuración</h1>
              <p className="text-gray-600 mt-1">
                Personaliza tu salón y gestiona la configuración del sistema
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4">
          <nav className="flex gap-6 overflow-x-auto">
            {tabs.map((tab) => {
              const Icon = tab.icon
              const isActive = activeTab === tab.id

              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-4 border-b-2 font-medium transition-colors whitespace-nowrap ${
                    isActive
                      ? 'border-purple-600 text-purple-600'
                      : 'border-transparent text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  <span>{tab.label}</span>
                </button>
              )
            })}
          </nav>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        {activeTab === 'appearance' && <AppearanceSettings />}
        {activeTab === 'business' && <BusinessSettings />}
        {activeTab === 'staff' && <StaffSettings />}
        {activeTab === 'notifications' && <NotificationSettings />}
        {activeTab === 'security' && (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <Shield className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Configuración de Seguridad
            </h3>
            <p className="text-gray-600">
              Próximamente: Autenticación de dos factores, gestión de sesiones y permisos.
            </p>
          </div>
        )}
        {activeTab === 'integrations' && (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <Database className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Integraciones
            </h3>
            <p className="text-gray-600">
              Próximamente: WhatsApp, Stripe, Google Calendar, y más.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
