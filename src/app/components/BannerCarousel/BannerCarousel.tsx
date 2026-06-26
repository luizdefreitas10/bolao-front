'use client'

import React, { useCallback, useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import BrandLogo from '@/app/components/BrandLogo/BrandLogo'

const INTERVAL_MS = 5000

const variants = {
  enter: (dir: number) => ({
    x: dir > 0 ? '100%' : '-100%',
    opacity: 0,
  }),
  center: { x: 0, opacity: 1 },
  exit: (dir: number) => ({
    x: dir > 0 ? '-100%' : '100%',
    opacity: 0,
  }),
}

const transition = {
  type: 'tween',
  ease: 'easeInOut',
  duration: 0.45,
} as const

/* ─── Slide definitions ────────────────────────────────────────────────────── */

/** Shared slide base: dark card that contrasts against both light and dark page backgrounds */
const slideBase =
  'relative flex h-full w-full flex-col items-center justify-center overflow-hidden bg-[#111111] px-4'

function SlideAdmin() {
  return (
    <div className={`${slideBase} gap-2`}>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,#f9cf1d28_0%,transparent_70%)]" />
      <BrandLogo variant="stacked" tone="gold" height={56} priority />
      <p className="z-10 mt-1 text-center text-xs font-medium text-[#a3a3a3] sm:text-sm">
        Bolão Copa do Mundo 2026 · Painel Admin
      </p>
    </div>
  )
}

function SlidePalpite() {
  return (
    <div className={`${slideBase} gap-3`}>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,#f9cf1d1c_0%,transparent_65%)]" />
      <span className="text-4xl">⚽</span>
      <h2 className="z-10 text-center text-sm font-bold text-[#fafafa] sm:text-base">
        Acerte o Placar e o Goleador
      </h2>
      <div className="z-10 flex flex-wrap justify-center gap-2">
        {['Placar Exato', 'Último Goleador', 'Pontuação Máxima'].map(
          (label) => (
            <span
              key={label}
              className="rounded-full border border-[#f9cf1d55] bg-[#f9cf1d18] px-3 py-0.5 text-[10px] font-semibold text-[#f9cf1d] sm:text-xs"
            >
              {label}
            </span>
          ),
        )}
      </div>
      <p className="z-10 text-center text-[10px] text-[#a3a3a3] sm:text-xs">
        Palpite em cada jogo e acompanhe sua pontuação em tempo real.
      </p>
    </div>
  )
}

function SlideSync() {
  return (
    <div className={`${slideBase} gap-3`}>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,#162416_0%,transparent_60%)]" />
      <span className="text-4xl">🔄</span>
      <h2 className="z-10 text-center text-sm font-bold text-[#fafafa] sm:text-base">
        Resultados em Tempo Real
      </h2>
      <p className="z-10 max-w-[260px] text-center text-[10px] text-[#a3a3a3] sm:text-xs">
        Sincronize os resultados da Copa do Mundo 2026 direto da API oficial com
        um clique.
      </p>
      <div className="z-10 flex items-center gap-1.5 rounded-full border border-[#22c55e55] bg-[#22c55e18] px-3 py-1">
        <div className="h-1.5 w-1.5 rounded-full bg-[#22c55e]" />
        <span className="text-[10px] font-semibold text-[#22c55e] sm:text-xs">
          wcup2026.org · API oficial
        </span>
      </div>
    </div>
  )
}

function SlideBrand() {
  return (
    <div className={`${slideBase} gap-4`}>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,#f9cf1d1e_0%,transparent_70%)]" />
      <BrandLogo variant="horizontal" tone="gold" height={38} />
      <p className="z-10 max-w-[260px] text-center text-[10px] text-[#a3a3a3] sm:text-xs">
        Acompanhe análises, odds e os melhores palpites da Copa do Mundo 2026.
      </p>
      <div className="z-10 flex gap-3">
        <span className="text-lg">📱</span>
        <span className="text-lg">🏆</span>
        <span className="text-lg">🎯</span>
      </div>
    </div>
  )
}

const SLIDES = [SlideAdmin, SlidePalpite, SlideSync, SlideBrand]

/* ─── Carousel ──────────────────────────────────────────────────────────────── */

export default function BannerCarousel() {
  const [current, setCurrent] = useState(0)
  const [direction, setDirection] = useState(1)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const touchStartX = useRef<number | null>(null)

  const advance = useCallback((delta: 1 | -1) => {
    setDirection(delta)
    setCurrent((c) => (c + delta + SLIDES.length) % SLIDES.length)
  }, [])

  const resetTimer = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current)
    timerRef.current = setInterval(() => advance(1), INTERVAL_MS)
  }, [advance])

  useEffect(() => {
    resetTimer()
    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [resetTimer])

  const goTo = (idx: number) => {
    setDirection(idx > current ? 1 : -1)
    setCurrent(idx)
    resetTimer()
  }

  const onTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX
  }

  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return
    const delta = touchStartX.current - e.changedTouches[0].clientX
    if (Math.abs(delta) > 40) {
      advance(delta > 0 ? 1 : -1)
      resetTimer()
    }
    touchStartX.current = null
  }

  const CurrentSlide = SLIDES[current]

  return (
    <div className="mx-auto w-full px-4 sm:px-0 sm:w-[90%]">
      {/* Carousel track */}
      <div
        className="relative h-[190px] sm:h-[200px] overflow-hidden rounded-xl border border-[#f9cf1d66] shadow-[0_0_0_1px_rgba(249,207,29,0.1)]"
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        <AnimatePresence initial={false} custom={direction} mode="wait">
          <motion.div
            key={current}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={transition}
            className="absolute inset-0"
          >
            <CurrentSlide />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Dot indicators */}
      <div className="mt-2.5 flex justify-center gap-1.5">
        {SLIDES.map((_, i) => (
          <button
            key={i}
            aria-label={`Banner ${i + 1}`}
            onClick={() => goTo(i)}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              i === current
                ? 'w-5 bg-[#f9cf1d]'
                : 'w-1.5 bg-[#a3a3a3] opacity-40'
            }`}
          />
        ))}
      </div>
    </div>
  )
}
