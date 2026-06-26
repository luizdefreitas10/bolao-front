'use client'

import React, { ReactNode } from 'react'
import { AuthProvider } from '@/context/AuthContext'
import { EventsProvider } from '@/context/EventsContext'
import { ThemeProvider } from '@/context/ThemeContext'
import { NextUIProvider } from '@nextui-org/react'

export default function Providers({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider>
      <AuthProvider>
        <EventsProvider>
          <NextUIProvider locale="pt-BR">
            <main className="min-h-screen bg-rs-background">{children}</main>
          </NextUIProvider>
        </EventsProvider>
      </AuthProvider>
    </ThemeProvider>
  )
}
