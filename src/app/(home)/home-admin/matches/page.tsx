'use client'
import React, { useState, useEffect } from 'react'
import {
  Button,
  useDisclosure,
  Image,
  Tabs,
  Tab,
  Spinner,
} from '@nextui-org/react'
import { Open_Sans as OpenSans } from 'next/font/google'
import CreateEventModal from '@/app/components/CreateEventModal/CreateEventModal'
import { useEventsContext } from '@/context/EventsContext'
import toast from 'react-hot-toast'
import { handleAxiosError } from '@/services/api/error'
import RoundService from '@/services/api/models/round'
import RoundMatchsCardAdmin from '@/app/components/RoundMatchsCardAdmin/RoundMatchsCardAdmin'

const fontOpenSans = OpenSans({ subsets: ['latin'] })

export default function HomeAdmin() {
  const { isOpen, onOpen, onOpenChange } = useDisclosure()
  const [loading, setLoading] = useState(true)
  const [roundsWaiting, setRoundsWaiting] = useState<
    IRoundWithMatchsAndChampionship[]
  >([])
  const [roundsDone, setRoundsDone] = useState<
    IRoundWithMatchsAndChampionship[]
  >([])
  const { setCurrentModalIndex, refreshRounds, setRefreshRounds } =
    useEventsContext()

  // useEffect(() => {
  //   fetchRounds('WAITING')
  //   fetchRounds('DONE')
  // }, [])

  useEffect(() => {
    if (refreshRounds) {
      refreshData()
    }
  }, [refreshRounds])

  async function refreshData() {
    setLoading(true)
    await fetchRounds('WAITING')
    await fetchRounds('DONE')
    setRefreshRounds(false)
    setLoading(false)
  }

  const fetchRounds = async (status: 'WAITING' | 'DONE') => {
    try {
      const { fetchRoundsByStatus } = await RoundService()
      const response = await fetchRoundsByStatus(status)

      switch (status) {
        case 'DONE':
          setRoundsDone([])
          setRoundsDone(response)
          return response

        default:
          setRoundsWaiting([])
          setRoundsWaiting(response)
          return response
      }
    } catch (error) {
      const customError = handleAxiosError(error)
      toast.error(customError.message)
    }
  }

  return (
    <div
      className={`w-full h-full flex flex-col items-center ${fontOpenSans.className}`}
    >
      <h1 className={`text-center text-[#00409F] text-[18px] font-bold mt-10`}>
        Lorem Ipsum
      </h1>
      <p className="text-[#00409F] mt-2 mb-4 text-center">
        Lorem ipsum dolor sit amet consectetur. Laoreet.
      </p>
      <div className="flex flex-col items-center w-[90%]">
        {loading ? (
          <div className="h-[200px] w-full flex items-center justify-center">
            <Spinner />
          </div>
        ) : (
          <Tabs radius="full" variant="solid" color="secondary">
            <Tab key="waiting" title="Aguardando" className="w-full">
              <>
                {roundsWaiting.findIndex((round) =>
                  round.matchs.find((match) => match.id),
                ) !== -1 ? (
                  <>
                    {roundsWaiting.map((round) => (
                      <RoundMatchsCardAdmin round={round} key={round.id} />
                    ))}
                  </>
                ) : (
                  <div className="w-full flex justify-center my-10">
                    <p className="text-[16px] text-[#00409F]">Sem partidas.</p>
                  </div>
                )}
              </>
            </Tab>
            <Tab key="done" title="Finalizadas" className="w-full">
              {roundsDone.findIndex((round) =>
                round.matchs.find((match) => match.id),
              ) !== -1 ? (
                <>
                  {roundsDone.map((round) => (
                    <RoundMatchsCardAdmin
                      round={round}
                      key={round.id}
                      isDone={true}
                    />
                  ))}
                </>
              ) : (
                <div className="w-full flex justify-center my-10">
                  <p className="text-[16px] text-[#00409F]">Sem partidas.</p>
                </div>
              )}
            </Tab>
          </Tabs>
        )}
      </div>
      <Button
        onClick={() => setCurrentModalIndex(0)}
        onPress={onOpen}
        startContent={<Image src="/addcircle.svg" alt="add circle" />}
        className="w-[90%] mx-auto mt-4 mb-6 bg-[#00409F] text-white font-bold text-[14px] py-[10px] px-[14px]"
      >
        Criar evento
      </Button>
      <div className="bg-[#00409F] w-full h-[250px] flex justify-center items-center">
        <div className="w-[90%] bg-black h-[160px] rounded-xl flex justify-center items-center">
          <h1>betvip banner</h1>
        </div>
      </div>
      <CreateEventModal isOpen={isOpen} onClose={onOpenChange} />
      {/* <SetResultModal
        isOpen={isOpenSetResultModal}
        onClose={onOpenChangeSetResultModal}
      /> */}
    </div>
  )
}
