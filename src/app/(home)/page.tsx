'use client'
import React from 'react'
import Swiper from '../components/Swiper/Swiper'
import CarrosselBetVip from '../components/CarrosselBetVip/CarrosselBetVip'
import HowItWorks from '../components/HowItWorks/HowItWorks'
import BetVipBanner from '../components/BetVipBanner/BetVipBanner'

export default function Home() {
  return (
    <main className={`w-full h-full flex flex-col justify-around`}>
      <Swiper />
      <CarrosselBetVip />
      <HowItWorks />
      <BetVipBanner />
    </main>
  )
}
