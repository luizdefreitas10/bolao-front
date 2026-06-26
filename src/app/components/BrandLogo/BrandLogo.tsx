'use client'

import React from 'react'
import { useTheme } from '@/context/ThemeContext'
import Image from 'next/image'

type BrandLogoProps = {
  variant?: 'horizontal' | 'stacked' | 'icon'
  tone?: 'auto' | 'light' | 'dark' | 'gold'
  className?: string
  height?: number
  priority?: boolean
}

function resolveLogoSrc(
  variant: 'horizontal' | 'stacked' | 'icon',
  tone: 'auto' | 'light' | 'dark' | 'gold',
  theme: 'light' | 'dark',
) {
  if (tone === 'light') return `/brand/logo-${variant}-light.svg`
  if (tone === 'dark') return `/brand/logo-${variant}-dark.svg`
  if (tone === 'gold') return `/brand/logo-${variant}-gold.svg`

  return theme === 'dark'
    ? `/brand/logo-${variant}-gold.svg`
    : `/brand/logo-${variant}-dark.svg`
}

const aspectRatios = {
  horizontal: 1499.84 / 205.4,
  stacked: 1249.35 / 302.16,
  icon: 1,
}

export default function BrandLogo({
  variant = 'horizontal',
  tone = 'auto',
  className = '',
  height = variant === 'icon' ? 36 : 32,
  priority = false,
}: BrandLogoProps) {
  const { theme, mounted } = useTheme()
  const resolvedTheme = mounted ? theme : 'dark'
  const src = resolveLogoSrc(variant, tone, resolvedTheme)
  const width =
    variant === 'icon' ? height : Math.round(height * aspectRatios[variant])

  return (
    <Image
      src={src}
      alt="Resenha da Sorte"
      width={width}
      height={height}
      priority={priority}
      className={`object-contain ${className}`}
    />
  )
}
