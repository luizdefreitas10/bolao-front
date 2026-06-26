import React from 'react'
import { Image } from '@nextui-org/react'

type SportsIconProps = {
  className?: string
}

export default function SportsIcon({ className = '' }: SportsIconProps) {
  return (
    <Image
      src="/sportsicon.png"
      alt=""
      aria-hidden
      className={`h-5 w-5 shrink-0 brightness-0 dark:brightness-100 ${className}`}
    />
  )
}
