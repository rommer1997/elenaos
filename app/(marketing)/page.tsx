'use client'

import { Hero } from '@/components/landing/Hero'
import { ROICalculator } from '@/components/landing/ROICalculator'
import { HowItWorks } from '@/components/landing/HowItWorks'
import { Features } from '@/components/landing/Features'
import { Testimonials } from '@/components/landing/Testimonials'
import { Pricing } from '@/components/landing/Pricing'
import { FAQ } from '@/components/landing/FAQ'
import { FinalCTA } from '@/components/landing/FinalCTA'

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 via-purple-50 to-white">
      <Hero />
      <ROICalculator />
      <HowItWorks />
      <Features />
      <Testimonials />
      <Pricing />
      <FAQ />
      <FinalCTA />
    </div>
  )
}
