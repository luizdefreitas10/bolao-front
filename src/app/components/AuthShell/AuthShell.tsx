'use client'

import React from 'react'
import BrandLogo from '@/app/components/BrandLogo/BrandLogo'
import { Open_Sans as OpenSans } from 'next/font/google'

const fontOpenSans = OpenSans({ subsets: ['latin'] })

type AuthShellProps = {
  title: string
  subtitle?: string
  children: React.ReactNode
}

export default function AuthShell({
  title,
  subtitle,
  children,
}: AuthShellProps) {
  return (
    <div
      className={`${fontOpenSans.className} flex min-h-full w-full flex-col items-center px-4 py-8`}
    >
      <BrandLogo variant="stacked" height={88} className="mb-6" />
      <div className="w-full max-w-md rounded-2xl border border-rs-border bg-rs-card p-6 shadow-sm">
        <h1 className="text-center text-lg font-bold text-rs-heading">
          {title}
        </h1>
        {subtitle ? (
          <p className="my-3 text-center text-sm leading-relaxed text-rs-muted">
            {subtitle}
          </p>
        ) : null}
        {children}
      </div>
    </div>
  )
}
