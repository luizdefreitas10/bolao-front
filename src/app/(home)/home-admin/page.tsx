'use client'
import React, { useState } from 'react'
import { Button, useDisclosure, Image, Spinner } from '@nextui-org/react'
import { Open_Sans as OpenSans } from 'next/font/google'
import CreateEventModal from '@/app/components/CreateEventModal/CreateEventModal'
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
    <div className={`w-full h-full flex flex-col ${fontOpenSans.className}`}>
      <h1 className={`text-center text-rs-heading text-[18px] font-bold mt-10`}>
        Painel Admin
      </h1>
      <p className="text-rs-heading mt-2 mb-4 text-center">
        Gerencie eventos, resultados e configurações do bolão.
      </p>
      <div className="mx-auto h-[201px] w-[90%] rounded-xl border border-rs-gold bg-rs-card" />
      <Button
        onClick={() => setCurrentModalIndex(0)}
        onPress={onOpen}
        startContent={<Image src="/addcircle.svg" alt="add circle" />}
        className="mx-auto mt-4 w-[90%] bg-rs-gold px-[14px] py-[10px] text-[14px] font-bold text-rs-ink"
      >
        Criar evento
      </Button>
      <Button
        onPress={handleSyncResults}
        isDisabled={isSyncing}
        variant="bordered"
        className="mx-auto mb-6 mt-3 w-[90%] border-2 border-rs-gold bg-transparent px-[14px] py-[10px] text-[14px] font-bold text-rs-gold"
      >
        {isSyncing ? (
          <Spinner size="sm" color="warning" />
        ) : (
          '⚽ Sincronizar Resultados Copa 2026'
        )}
      </Button>
      <PromoBanner />
      <CreateEventModal isOpen={isOpen} onClose={onOpenChange} />
    </div>
  )
}
