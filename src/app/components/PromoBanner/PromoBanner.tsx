'use client'

import React from 'react'
import BrandLogo from '@/app/components/BrandLogo/BrandLogo'

export default function PromoBanner() {
  return (
    <section className="flex w-full justify-center bg-rs-surface px-6 py-12">
      <div className="flex w-full max-w-3xl flex-col items-center gap-4 rounded-2xl border border-rs-border bg-rs-card px-6 py-10 shadow-sm">
        <BrandLogo variant="horizontal" tone="gold" height={40} />
        <p className="text-center text-sm text-rs-muted md:text-base">
          Acompanhe a Resenha da Sorte e fique por dentro das melhores odds e
          palpites da rodada.
        </p>
      </div>
    </section>
  )
}
