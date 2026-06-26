'use client'
import React, { useState } from 'react'
import { Button, useDisclosure, Image, Spinner } from '@nextui-org/react'
import { Open_Sans as OpenSans } from 'next/font/google'
import CreateEventModal from '@/app/components/CreateEventModal/CreateEventModal'
import BannerCarousel from '@/app/components/BannerCarousel/BannerCarousel'
import PromoBanner from '@/app/components/PromoBanner/PromoBanner'
import { useEventsContext } from '@/context/EventsContext'
import { syncWc2026Results } from './actions'
import toast from 'react-hot-toast'

const fontOpenSans = OpenSans({ subsets: ['latin'] })

export default function HomeAdmin() {
  const { isOpen, onOpen, onOpenChange } = useDisclosure()
  const { setCurrentModalIndex } = useEventsContext()
  const [isSyncing, setIsSyncing] = useState(false)

  async function handleSyncResults() {
    setIsSyncing(true)
    try {
      const result = await syncWc2026Results()
      toast.success(
        `Sync concluído: ${result.updated} partida(s) atualizada(s) de ${result.total}.`,
      )
    } catch {
      toast.error('Falha ao sincronizar resultados. Tente novamente.')
    } finally {
      setIsSyncing(false)
    }
  }

  return (
    <div className={`w-full flex flex-col pb-4 ${fontOpenSans.className}`}>
      <h1 className="text-center text-rs-heading text-base sm:text-[18px] font-bold mt-8 sm:mt-10">
        Painel Admin
      </h1>
      <p className="text-rs-heading mt-1.5 mb-4 text-center text-xs sm:text-sm px-4">
        Gerencie eventos, resultados e configurações do bolão.
      </p>

      <BannerCarousel />

      <div className="flex flex-col gap-3 mt-4 px-4 sm:px-0 sm:w-[90%] sm:mx-auto">
        <Button
          onClick={() => setCurrentModalIndex(0)}
          onPress={onOpen}
          startContent={
            <Image
              src="/addcircle.svg"
              alt="add circle"
              width={20}
              height={20}
            />
          }
          className="w-full bg-rs-gold px-[14px] py-[10px] text-[13px] sm:text-[14px] font-bold text-rs-ink"
        >
          Criar evento
        </Button>
        <Button
          onPress={handleSyncResults}
          isDisabled={isSyncing}
          variant="bordered"
          className="w-full border-2 border-rs-gold bg-transparent px-[14px] py-[10px] text-[13px] sm:text-[14px] font-bold text-rs-gold"
        >
          {isSyncing ? (
            <Spinner size="sm" color="warning" />
          ) : (
            '⚽ Sincronizar Resultados Copa 2026'
          )}
        </Button>
      </div>

      <div className="mt-6">
        <PromoBanner />
      </div>

      <CreateEventModal isOpen={isOpen} onClose={onOpenChange} />
    </div>
  )
}
