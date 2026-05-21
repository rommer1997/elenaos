'use client'

import { useState, useEffect } from 'react'
import { StationHeader } from '@/components/tablet/StationHeader'
import { CurrentAppointment } from '@/components/tablet/CurrentAppointment'
import { UpcomingQueue } from '@/components/tablet/UpcomingQueue'
import { QuickActions } from '@/components/tablet/QuickActions'
import { ClientNotes } from '@/components/tablet/ClientNotes'

export default function StationPage() {
  const [currentTime, setCurrentTime] = useState(new Date())
  const [staffMember, setStaffMember] = useState<string>('Elena')

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  // Mock data
  const currentAppointment = {
    id: '1',
    clientName: 'María López',
    clientPhone: '+34 612 345 678',
    service: 'Corte + Tinte',
    startTime: '11:30',
    endTime: '13:00',
    duration: 90,
    price: 85,
    notes: 'Alergia al amoníaco. Prefiere rubio natural.',
    history: [
      { date: '2026-04-15', service: 'Corte', satisfaction: 5 },
      { date: '2026-03-10', service: 'Mechas', satisfaction: 5 },
      { date: '2026-02-05', service: 'Tinte completo', satisfaction: 4 }
    ],
    progress: 45 // % completado
  }

  const upcomingQueue = [
    {
      id: '2',
      clientName: 'Ana García',
      service: 'Manicura',
      startTime: '13:00',
      status: 'confirmed' as const
    },
    {
      id: '3',
      clientName: 'Carmen Rodríguez',
      service: 'Corte',
      startTime: '14:00',
      status: 'pending' as const
    },
    {
      id: '4',
      clientName: 'Laura Pérez',
      service: 'Mechas',
      startTime: '15:30',
      status: 'confirmed' as const
    }
  ]

  return (
    <div className="h-screen flex flex-col">
      {/* Header */}
      <StationHeader
        staffName={staffMember}
        currentTime={currentTime}
        onStaffChange={setStaffMember}
      />

      {/* Main content */}
      <div className="flex-1 grid grid-cols-3 gap-6 p-6 overflow-hidden">
        {/* Left column - Current appointment */}
        <div className="col-span-2 space-y-6 overflow-y-auto">
          <CurrentAppointment appointment={currentAppointment} />
          <ClientNotes
            clientName={currentAppointment.clientName}
            notes={currentAppointment.notes}
            history={currentAppointment.history}
          />
        </div>

        {/* Right column - Queue and actions */}
        <div className="space-y-6 overflow-y-auto">
          <QuickActions appointmentId={currentAppointment.id} />
          <UpcomingQueue appointments={upcomingQueue} />
        </div>
      </div>
    </div>
  )
}
