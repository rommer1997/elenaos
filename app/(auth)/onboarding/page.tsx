'use client'

import { useState } from 'react'
import { Step1Salon } from '@/components/onboarding/Step1Salon'
import { Step2Team } from '@/components/onboarding/Step2Team'
import { Step3Clients } from '@/components/onboarding/Step3Clients'
import { Celebration } from '@/components/onboarding/Celebration'

export default function OnboardingPage() {
  const [currentStep, setCurrentStep] = useState(1)
  const [onboardingData, setOnboardingData] = useState({
    // Step 1
    salon: {
      name: '',
      whatsapp: '',
      city: '',
      postalCode: '',
      logo: null as File | null,
      logoPreview: '',
      colorPalette: 'purple-dream'
    },
    // Step 2
    team: {
      staff: [] as any[],
      services: [] as any[]
    },
    // Step 3
    clients: {
      method: '' as 'csv' | 'empty' | 'integration',
      csvFile: null as File | null,
      csvData: [] as any[]
    }
  })

  const handleStep1Complete = (data: any) => {
    setOnboardingData({ ...onboardingData, salon: data })
    setCurrentStep(2)
  }

  const handleStep2Complete = (data: any) => {
    setOnboardingData({ ...onboardingData, team: data })
    setCurrentStep(3)
  }

  const handleStep3Complete = (data: any) => {
    setOnboardingData({ ...onboardingData, clients: data })
    setCurrentStep(4)
  }

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-white flex items-center justify-center p-4">
      {currentStep < 4 && (
        <div className="w-full max-w-4xl">
          {/* Progress bar */}
          <div className="mb-8">
            <div className="flex items-center justify-center gap-4 mb-4">
              {[1, 2, 3].map((step) => (
                <div key={step} className="flex items-center">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all ${
                      step < currentStep
                        ? 'bg-green-500 text-white'
                        : step === currentStep
                        ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white scale-110'
                        : 'bg-gray-200 text-gray-500'
                    }`}
                  >
                    {step < currentStep ? '✓' : step}
                  </div>
                  {step < 3 && (
                    <div
                      className={`w-16 h-1 mx-2 rounded-full ${
                        step < currentStep ? 'bg-green-500' : 'bg-gray-200'
                      }`}
                    />
                  )}
                </div>
              ))}
            </div>
            <div className="text-center text-sm text-gray-600">
              Paso {currentStep} de 3
            </div>
          </div>

          {/* Steps */}
          {currentStep === 1 && (
            <Step1Salon
              data={onboardingData.salon}
              onComplete={handleStep1Complete}
            />
          )}

          {currentStep === 2 && (
            <Step2Team
              data={onboardingData.team}
              onComplete={handleStep2Complete}
              onBack={handleBack}
            />
          )}

          {currentStep === 3 && (
            <Step3Clients
              data={onboardingData.clients}
              onComplete={handleStep3Complete}
              onBack={handleBack}
            />
          )}
        </div>
      )}

      {currentStep === 4 && (
        <Celebration salonName={onboardingData.salon.name} />
      )}
    </div>
  )
}
