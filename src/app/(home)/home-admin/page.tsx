'use client'
import React from 'react'
import { Button, useDisclosure, Image } from '@nextui-org/react'
import { Open_Sans as OpenSans } from 'next/font/google'
import CreateEventModal from '@/app/components/CreateEventModal/CreateEventModal'
import { useEventsContext } from '@/context/EventsContext'

const fontOpenSans = OpenSans({ subsets: ['latin'] })

export default function HomeAdmin() {
  const { isOpen, onOpen, onOpenChange } = useDisclosure()
  const { setCurrentModalIndex } = useEventsContext()

  return (
    <div className={`w-full h-full flex flex-col ${fontOpenSans.className}`}>
      <h1 className={`text-center text-[#00409F] text-[18px] font-bold mt-10`}>
        Lorem Ipsum
      </h1>
      <p className="text-[#00409F] mt-2 mb-4 text-center">
        Lorem ipsum dolor sit amet consectetur. Laoreet.
      </p>
      <div className="w-[90%] h-[201px] bg-white border-solid border-[1px] border-[#00764B] rounded-xl mx-auto"></div>
      <Button
        onClick={() => setCurrentModalIndex(0)}
        onPress={onOpen}
        startContent={<Image src="/addcircle.svg" alt="add circle" />}
        className="w-[90%] mx-auto mt-4 mb-6 bg-[#00764B] text-white font-bold text-[14px] py-[10px] px-[14px]"
      >
        Criar evento
      </Button>
      <div className="bg-[#00409F] w-full h-[250px] flex justify-center items-center">
        <div className="w-[90%] bg-black h-[160px] rounded-xl flex justify-center items-center">
          <h1>betvip banner</h1>
        </div>
      </div>
      <CreateEventModal isOpen={isOpen} onClose={onOpenChange} />
    </div>
  )
}
