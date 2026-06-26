import React from 'react'
import { Button } from '@nextui-org/react'
import { Open_Sans as OpenSans } from 'next/font/google'
import Link from 'next/link'

const fontOpenSans = OpenSans({ subsets: ['latin'] })

const steps = [
  {
    title: 'Passo 1',
    description: 'Faça login ou crie sua conta no bolão.',
  },
  {
    title: 'Passo 2',
    description: 'Escolha os jogos e informe seu palpite de placar.',
  },
  {
    title: 'Passo 3',
    description: 'Indique quem fará o último gol e acompanhe seu histórico.',
  },
]

export default function HowItWorks() {
  return (
    <section className="flex flex-col bg-rs-surface px-6 py-12">
      <h2
        className={`${fontOpenSans.className} mb-8 text-center text-lg font-extrabold text-rs-heading md:text-xl`}
      >
        Como funciona?
      </h2>
      <div className="mx-auto flex w-full max-w-lg flex-col items-center space-y-6">
        {steps.map((step) => (
          <div
            key={step.title}
            className="flex w-full flex-col items-center gap-3 rounded-2xl border border-rs-border bg-rs-card p-5"
          >
            <Button
              className={`${fontOpenSans.className} bg-rs-gold px-6 py-3 text-xs font-bold text-rs-ink`}
            >
              {step.title.toUpperCase()}
            </Button>
            <p className="text-center text-sm text-rs-muted md:text-base">
              {step.description}
            </p>
          </div>
        ))}
      </div>

      <Button
        as={Link}
        href="/login"
        className={`${fontOpenSans.className} mx-auto mt-10 w-[85%] max-w-md rounded-full bg-rs-gold text-sm font-bold text-rs-ink`}
      >
        Participar
      </Button>
    </section>
  )
}
