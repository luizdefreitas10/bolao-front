'use client'

import React from 'react'
import { Link } from '@nextui-org/react'
import BrandLogo from '@/app/components/BrandLogo/BrandLogo'
import Image from 'next/image'
import twittericon from '../../../../public/twittericon.png'
import youtubeicon from '../../../../public/youtubeicon.png'
import instagramicon from '../../../../public/instagramicon.png'

export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="fixed bottom-0 z-50 flex h-auto w-full flex-col items-center justify-around space-y-4 border-t border-rs-border bg-rs-footer py-5 md:h-[120px] md:flex-row md:space-y-0 md:py-0">
      <BrandLogo variant="horizontal" tone="gold" height={24} />
      <p className="text-center text-xs text-neutral-400 md:text-sm">
        © {year} Resenha da Sorte — Todos os direitos reservados
      </p>
      <div className="flex cursor-pointer space-x-3">
        <Link
          href="https://twitter.com/EsportesDaSorte"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image src={twittericon} alt="Twitter" />
        </Link>
        <Link
          href="https://www.youtube.com/@esportesdasorteoficial"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image src={youtubeicon} alt="YouTube" />
        </Link>
        <Link
          href="https://www.instagram.com/esportesdasorte/"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image src={instagramicon} alt="Instagram" />
        </Link>
      </div>
    </footer>
  )
}
