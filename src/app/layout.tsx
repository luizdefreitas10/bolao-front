import React from 'react'
import type { Metadata } from 'next'
import './globals.css'
import Providers from './providers'
import { Suspense } from 'react'
import Loading from './loading'
import { Toaster } from 'react-hot-toast'
import { THEME_STORAGE_KEY } from '@/context/ThemeContext'

export const metadata: Metadata = {
  title: 'Bolão Resenha da Sorte',
  description: 'Palpite nos jogos com o bolão oficial da Resenha da Sorte.',
}

const themeInitScript = `(function(){try{var k='${THEME_STORAGE_KEY}';var t=localStorage.getItem(k);var d=t==='dark'||(!t&&window.matchMedia('(prefers-color-scheme: dark)').matches);document.documentElement.classList.toggle('dark',d);document.documentElement.dataset.theme=d?'dark':'light';}catch(e){}})();`

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pt-br" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body className="overflow-x-hidden">
        <Providers>{children}</Providers>
        <Suspense fallback={<Loading />} />
        <Toaster
          position="bottom-center"
          toastOptions={{
            className: 'bg-rs-card text-rs-heading border border-rs-border',
          }}
        />
      </body>
    </html>
  )
}
