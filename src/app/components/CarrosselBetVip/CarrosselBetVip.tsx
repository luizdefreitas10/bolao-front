import React from 'react'
import { Button } from '@nextui-org/react'
import { Open_Sans as OpenSans } from 'next/font/google'

const fontOpenSans = OpenSans({ subsets: ['latin'] })

export default function CarrosselBetVip() {
  return (
    <div className="flex flex-col bg-[#1F67CE] p-10">
      <h1
        className={`text-center ${fontOpenSans.className} text-[18px] font-extrabold mb-6`}
      >
        BOLÃO LOREM IPSUM
      </h1>
      <p>
        Lorem ipsum dolor sit amet consectetur. Tortor arcu quisque vestibulum
        aenean sed morbi laoreet diam. Urna tellus nunc fusce hendrerit eget
        dolor neque sit.
      </p>
      <Button
        variant="bordered"
        className={`mt-6 border-solid border-white text-white text-[14px] font-bold rounded-full ${fontOpenSans.className}`}
      >
        Como Funciona
      </Button>
      <div className="w-[100%] bg-black mx-auto h-[160px] rounded-xl flex justify-center items-center mt-8">
        <h1>betvip banner</h1>
      </div>
    </div>
  )
}
