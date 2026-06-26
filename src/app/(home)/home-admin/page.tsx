'use client'
import React from 'react'
import { Button, useDisclosure, Image } from '@nextui-org/react'
import { Open_Sans as OpenSans } from 'next/font/google'
import CreateEventModal from '@/app/components/CreateEventModal/CreateEventModal'
import PromoBanner from '@/app/components/PromoBanner/PromoBanner'
import { useEventsContext } from '@/context/EventsContext'

const fontOpenSans = OpenSans({ subsets: ['latin'] })

export default function HomeAdmin() {
  const { isOpen, onOpen, onOpenChange } = useDisclosure()
  const { setCurrentModalIndex } = useEventsContext()

  return (
    <div className={`w-full h-full flex flex-col ${fontOpenSans.className}`}>
      <h1 className={`text-center text-rs-heading text-[18px] font-bold mt-10`}>
        Lorem Ipsum
      </h1>
      <p className="text-rs-heading mt-2 mb-4 text-center">
        Lorem ipsum dolor sit amet consectetur. Laoreet.
      </p>
      <div className="mx-auto h-[201px] w-[90%] rounded-xl border border-rs-gold bg-rs-card" />
      <Button
        onClick={() => setCurrentModalIndex(0)}
        onPress={onOpen}
        startContent={<Image src="/addcircle.svg" alt="add circle" />}
        className="mx-auto mb-6 mt-4 w-[90%] bg-rs-gold px-[14px] py-[10px] text-[14px] font-bold text-rs-ink"
      >
        Criar evento
      </Button>
      <PromoBanner />
      <CreateEventModal isOpen={isOpen} onClose={onOpenChange} />
    </div>
  )
}
