import React from 'react'
import type { Metadata } from 'next'
import { Open_Sans as OpenSans } from 'next/font/google'
import '../globals.css'
import Header from '../components/Header/Header'
import Footer from '../components/Footer/Footer'

const openSans = OpenSans({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Bolão Resenha da Sorte',
  description: 'Palpite nos jogos com o bolão oficial da Resenha da Sorte.',
}

export default function HomeLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <div className={`${openSans.className} min-h-screen`}>
      <Header />
      <div className="mb-32 min-h-[calc(100vh-200px)] w-full bg-rs-background pb-8">
        {children}
      </div>
      <Footer />
    </div>
  )
}
