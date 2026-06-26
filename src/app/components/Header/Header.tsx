'use client'

import React, { useState } from 'react'
import {
  Navbar,
  NavbarBrand,
  NavbarMenuToggle,
  NavbarMenu,
  NavbarMenuItem,
  NavbarContent,
  Link,
} from '@nextui-org/react'
import { useAuthContext } from '@/context/AuthContext'
import { parseCookies } from 'nookies'
import { decodeToken } from '@/utils/jwt'
import { useRouter } from 'next/navigation'
import BrandLogo from '@/app/components/BrandLogo/BrandLogo'
import ThemeToggle from '@/app/components/ThemeToggle/ThemeToggle'

export default function Header() {
  const { handleSignOut } = useAuthContext()
  const { 'qxute-bolao:x-token': sessionKey } = parseCookies()
  const decoded = decodeToken(sessionKey)
  const { push } = useRouter()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const menuItemsDefault = [
    { menuItem: 'Home', route: '/' },
    { menuItem: 'Registro', route: '/register' },
    { menuItem: 'Login', route: '/login' },
    { menuItem: 'Redefinir senha', route: '/recover-password' },
  ]

  const menuItemsAuth = [
    {
      menuItem: 'Home',
      function: () => {
        decoded?.role === 'ADMIN' ? push('/home-admin') : push('/home-user')
        setIsMenuOpen(false)
      },
    },
    {
      menuItem: 'Partidas',
      function: () => {
        push('/home-admin/matches')
        setIsMenuOpen(false)
      },
      onlyAdmin: true,
    },
    {
      menuItem: 'Redefinir senha',
      function: () => {
        push('/recover-password')
        setIsMenuOpen(false)
      },
    },
    {
      menuItem: 'Sair',
      function: () => {
        handleSignOut()
        setIsMenuOpen(false)
      },
    },
  ]

  return (
    <Navbar
      isMenuOpen={isMenuOpen}
      onMenuOpenChange={setIsMenuOpen}
      isBordered
      maxWidth="full"
      className="border-rs-border bg-rs-navbar"
    >
      <NavbarContent>
        <NavbarMenuToggle className="text-rs-heading" />
        <ThemeToggle />
      </NavbarContent>

      <NavbarContent className="pr-4 md:pr-16" justify="center">
        <NavbarBrand>
          <Link className="cursor-pointer" href="/">
            <BrandLogo variant="horizontal" height={28} priority />
          </Link>
        </NavbarBrand>
      </NavbarContent>

      <NavbarMenu className="bg-rs-surface pt-6">
        {!sessionKey
          ? menuItemsDefault.map((item, index) => (
              <NavbarMenuItem key={`${item.menuItem}-${index}`}>
                <Link
                  className="w-full text-rs-heading"
                  color={index === 2 ? 'primary' : 'foreground'}
                  href={item.route.toLowerCase()}
                  size="lg"
                >
                  {item.menuItem}
                </Link>
              </NavbarMenuItem>
            ))
          : menuItemsAuth.map((item, index) =>
              !(item.onlyAdmin && decoded?.role !== 'ADMIN') ? (
                <NavbarMenuItem key={`${item.menuItem}-${index}`}>
                  <Link
                    className="w-full cursor-pointer text-rs-heading"
                    onPress={item.function}
                    size="lg"
                    color="primary"
                  >
                    {item.menuItem}
                  </Link>
                </NavbarMenuItem>
              ) : null,
            )}
      </NavbarMenu>
    </Navbar>
  )
}
