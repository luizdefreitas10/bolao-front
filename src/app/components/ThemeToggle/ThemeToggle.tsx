'use client'

import React from 'react'
import { useTheme } from '@/context/ThemeContext'
import { Button } from '@nextui-org/react'
import { FiMoon, FiSun } from 'react-icons/fi'

export default function ThemeToggle() {
  const { theme, toggleTheme, mounted } = useTheme()

  if (!mounted) {
    return (
      <Button
        isIconOnly
        variant="light"
        aria-label="Alternar tema"
        className="text-rs-muted"
        size="sm"
      />
    )
  }

  return (
    <Button
      isIconOnly
      variant="light"
      aria-label={theme === 'dark' ? 'Ativar modo claro' : 'Ativar modo escuro'}
      onPress={toggleTheme}
      className="text-rs-gold hover:bg-rs-gold/10"
      size="sm"
    >
      {theme === 'dark' ? <FiSun size={18} /> : <FiMoon size={18} />}
    </Button>
  )
}
