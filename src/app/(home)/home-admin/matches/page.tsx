'use client'
import React, { useState, useEffect, useMemo } from 'react'
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
import PromoBanner from '@/app/components/PromoBanner/PromoBanner'
import { useEventsContext } from '@/context/EventsContext'
import toast from 'react-hot-toast'
import { handleAxiosError } from '@/services/api/error'
import RoundService from '@/services/api/models/round'
import RoundMatchsCardAdmin from '@/app/components/RoundMatchsCardAdmin/RoundMatchsCardAdmin'

const fontOpenSans = OpenSans({ subsets: ['latin'] })

function hasMatches(rounds: IRoundWithMatchsAndChampionship[]) {
  return rounds.some((round) => round.matchs.some((match) => match.id))
}

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

  const waitingHasMatches = useMemo(
    () => hasMatches(roundsWaiting),
    [roundsWaiting],
  )
  const doneHasMatches = useMemo(() => hasMatches(roundsDone), [roundsDone])

  return (
    <div
      className={`flex h-full w-full flex-col items-center ${fontOpenSans.className}`}
    >
      <h1 className="mt-10 text-center text-[18px] font-bold text-rs-heading">
        Partidas
      </h1>
      <p className="mb-4 mt-2 text-center text-sm text-rs-muted">
        Gerencie os eventos, edite partidas e defina resultados.
      </p>
      <div className="flex w-[90%] flex-col items-center">
        {loading ? (
          <div className="flex h-[200px] w-full items-center justify-center">
            <Spinner />
          </div>
        ) : (
          <Tabs radius="full" variant="solid" color="secondary">
            <Tab key="waiting" title="Aguardando" className="w-full">
              {waitingHasMatches ? (
                <RoundMatchsCardAdmin rounds={roundsWaiting} />
              ) : (
                <div className="my-10 flex w-full justify-center">
                  <p className="text-[16px] text-rs-heading">Sem partidas.</p>
                </div>
              )}
            </Tab>
            <Tab key="done" title="Finalizadas" className="w-full">
              {doneHasMatches ? (
                <RoundMatchsCardAdmin rounds={roundsDone} isDone />
              ) : (
                <div className="my-10 flex w-full justify-center">
                  <p className="text-[16px] text-rs-heading">Sem partidas.</p>
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
        className="mx-auto mb-6 mt-4 w-[90%] bg-rs-gold px-[14px] py-[10px] text-[14px] font-bold text-rs-ink"
      >
        Criar evento
      </Button>
      <PromoBanner />
      <CreateEventModal isOpen={isOpen} onClose={onOpenChange} />
    </div>
  )
}
