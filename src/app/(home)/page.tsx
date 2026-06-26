'use client'

import React from 'react'
import HeroSection from '../components/HeroSection/HeroSection'
import HowItWorks from '../components/HowItWorks/HowItWorks'
import PromoBanner from '../components/PromoBanner/PromoBanner'

export default function Home() {
  return (
    <main className="flex w-full flex-col">
      <HeroSection />
      <HowItWorks />
      <PromoBanner />
    </main>
  )
}
