import React from 'react'
import type { Metadata } from 'next'
import { Open_Sans as OpenSans } from 'next/font/google'
import '../globals.css'
import Header from '../components/Header/Header'
import Footer from '../components/Footer/Footer'

const openSans = OpenSans({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Bolão Resenha da Sorte — Acesso',
  description: 'Entre ou cadastre-se no bolão da Resenha da Sorte.',
}

export default function SharedLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <div className={`${openSans.className} flex min-h-screen flex-col`}>
      <Header />
      <div
        className="w-full flex-1 overflow-auto bg-rs-background pb-36"
        style={{ minHeight: 'calc(100vh - 200px)' }}
      >
        {children}
      </div>
      <Footer />
    </div>
  )
}
