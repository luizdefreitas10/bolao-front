import React from 'react'
import type { Metadata } from 'next'
import { Open_Sans as OpenSans } from 'next/font/google'
import '../globals.css'
import Header from '../components/Header/Header'
import Footer from '../components/Footer/Footer'

const openSans = OpenSans({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Bolão QXUTE + BETVIP - Home',
  description: 'Bolão QXUTE + BETVIP',
}

export default function HomeLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <div className={`${openSans.className}`}>
      <Header />
      <div className="bg-white-texture h-full w-full bg-white flex justify-center items-center mb-32">
        {children}
      </div>
      <Footer />
    </div>
  )
}
