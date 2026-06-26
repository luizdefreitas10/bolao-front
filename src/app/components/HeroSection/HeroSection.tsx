'use client'

import React from 'react'
import BrandLogo from '@/app/components/BrandLogo/BrandLogo'
import { Button } from '@nextui-org/react'
import Link from 'next/link'

export default function HeroSection() {
  return (
    <section className="relative w-full overflow-hidden bg-rs-hero px-6 py-14 md:py-20">
      <div className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full bg-rs-gold/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-20 -left-10 h-72 w-72 rounded-full bg-rs-gold/5 blur-3xl" />

      <div className="relative mx-auto flex max-w-4xl flex-col items-center text-center">
        <BrandLogo variant="stacked" tone="gold" height={120} priority />
        <p className="mt-6 max-w-xl text-sm leading-relaxed text-rs-muted md:text-base">
          Palpite nos jogos, dispute com a galera e acompanhe seu histórico em
          tempo real. O bolão oficial da Resenha da Sorte.
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Button
            as={Link}
            href="/login"
            className="rounded-full bg-rs-gold px-8 font-bold text-rs-ink"
          >
            Entrar e palpitar
          </Button>
          <Button
            as={Link}
            href="/register"
            variant="bordered"
            className="rounded-full border-rs-gold/60 text-rs-gold"
          >
            Criar conta
          </Button>
        </div>
      </div>
    </section>
  )
}
