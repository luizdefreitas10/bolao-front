import React from 'react'
import type { Metadata } from 'next'
import { Open_Sans as OpenSans } from 'next/font/google'
import '../globals.css'
import Header from '../components/Header/Header'
import Footer from '../components/Footer/Footer'

const openSans = OpenSans({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Bolão QXUTE + BETVIP - Login',
  description: 'Bolão QXUTE + BETVIP',
}

export default function LoginLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <div className={`${openSans.className} flex flex-col items-center `}>
      <Header />
      <div
        className="w-full overflow-auto"
        style={{
          height: 'calc(100vh - 200px)',
        }}
      >
        {children}
      </div>
      <Footer />
    </div>
  )
}
