'use client'

import { useState, useEffect } from 'react'
import { Sidebar } from '@/components/dashboard/Sidebar'
import { Header } from '@/components/dashboard/Header'
import { MobileNav } from '@/components/dashboard/MobileNav'
import { useUser } from '@/hooks/useUser'
import { useLoadSalonTheme } from '@/lib/theme/apply'
import { useRouter } from 'next/navigation'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { user, tenant, isLoading } = useUser()
  const router = useRouter()
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false)

  useLoadSalonTheme(Boolean(user))

  useEffect(() => {
    if (!isLoading && !user) {
      router.replace('/login')
    }
  }, [isLoading, router, user])

  if (!isLoading && !user) {
    return null
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando...</p>
        </div>
      </div>
    )
  }

  const toggleSidebar = () => {
    // En desktop, colapsa/expande el sidebar
    // En mobile, abre/cierra el sidebar overlay
    if (window.innerWidth >= 1024) {
      setIsSidebarCollapsed(!isSidebarCollapsed)
    } else {
      setIsMobileSidebarOpen(!isMobileSidebarOpen)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar Desktop - siempre visible en lg+ */}
      <div className="hidden lg:block fixed inset-y-0 left-0 z-40">
        <Sidebar
          salonName={tenant?.name}
          isCollapsed={isSidebarCollapsed}
        />
      </div>

      {/* Sidebar Mobile - overlay con backdrop */}
      {isMobileSidebarOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            onClick={() => setIsMobileSidebarOpen(false)}
          />
          {/* Sidebar */}
          <div className="fixed inset-y-0 left-0 z-50 lg:hidden">
            <Sidebar salonName={tenant?.name} isCollapsed={false} />
          </div>
        </>
      )}

      {/* Main content */}
      <div
        className={`
          min-h-screen flex flex-col
          lg:transition-all lg:duration-300
          ${isSidebarCollapsed ? 'lg:pl-16' : 'lg:pl-64'}
        `}
      >
        {/* Header */}
        <Header
          onToggleSidebar={toggleSidebar}
          isSidebarCollapsed={isMobileSidebarOpen}
        />

        {/* Page content */}
        <main className="flex-1 pb-16 lg:pb-0">
          {children}
        </main>

        {/* Mobile bottom nav */}
        <MobileNav />
      </div>
    </div>
  )
}
