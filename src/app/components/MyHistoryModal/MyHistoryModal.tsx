import React from 'react'

import { getPredictions } from '@/app/(home)/home-user/actions'
import { formatMatchDateTime } from '@/utils/formatDate'
import { getLogo, isDefaultLogo } from '@/utils/getLogo'
import { getPlayerPhoto } from '@/utils/getPlayerPhoto'
import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Image,
} from '@nextui-org/react'
import { Open_Sans as OpenSans } from 'next/font/google'
import { parseCookies } from 'nookies'
import { useEffect, useMemo, useState } from 'react'

const fontOpenSans = OpenSans({ subsets: ['latin'] })

type HistoryFilter = 'all' | 'HIT' | 'MISS'

function getTeamName(
  team: string | { name: string; logoUrl?: string | null },
): string {
  return typeof team === 'string' ? team : team.name
}

function getTeamLogoUrl(
  team: string | { name: string; logoUrl?: string | null },
): string | null | undefined {
  return typeof team === 'string' ? undefined : team.logoUrl
}

function isPredictionHit(prediction: IPredictionsGetResponse): boolean {
  const userPlayerPredStatus = prediction.predictionPlayer?.status
  const userScorePredStatus = prediction.predictionScore?.status
  const hasPlayerPrediction = !!prediction.predictionPlayer?.player

  if (hasPlayerPrediction) {
    return userPlayerPredStatus === 'HIT' && userScorePredStatus === 'HIT'
  }

  return userScorePredStatus === 'HIT'
}

function isPredictionMiss(prediction: IPredictionsGetResponse): boolean {
  const userPlayerPredStatus = prediction.predictionPlayer?.status
  const userScorePredStatus = prediction.predictionScore?.status

  return userPlayerPredStatus === 'MISS' || userScorePredStatus === 'MISS'
}

interface CustomModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function MyHistoryModal({ isOpen, onClose }: CustomModalProps) {
  const [userPredictions, setUserPredictions] = useState<
    IPredictionsGetResponse[]
  >([])
  const [totalCorrectPredictions, setTotalCorrectPredictions] =
    useState<number>(0)
  const [totalIncorrectPredictions, setTotalIncorrectPredictions] =
    useState<number>(0)
  const [historyFilter, setHistoryFilter] = useState<HistoryFilter>('all')
  const { 'qxute-bolao:x-token': token } = parseCookies()

  const getUserPredictions = async (token: string) => {
    return getPredictions(token)
  }

  useEffect(() => {
    if (!isOpen) {
      setHistoryFilter('all')
      return
    }

    getUserPredictions(token).then((result) => {
      if (result.isError || !result.predictions) {
        return
      }

      let correctPredictions = 0
      let incorrectPredictions = 0

      const predictions = result.predictions.map((prediction) => {
        if (prediction.match.status !== 'DONE') {
          return prediction
        }

        if (isPredictionHit(prediction)) {
          correctPredictions += 1
        } else if (isPredictionMiss(prediction)) {
          incorrectPredictions += 1
        }

        return prediction
      })

      setUserPredictions(predictions)
      setTotalCorrectPredictions(correctPredictions)
      setTotalIncorrectPredictions(incorrectPredictions)
    })
  }, [isOpen, token])

  const finishedPredictions = useMemo(
    () =>
      userPredictions.filter(
        (prediction) => prediction.match.status === 'DONE',
      ),
    [userPredictions],
  )

  const filteredPredictions = useMemo(() => {
    if (historyFilter === 'all') {
      return finishedPredictions
    }

    if (historyFilter === 'HIT') {
      return finishedPredictions.filter(isPredictionHit)
    }

    return finishedPredictions.filter(isPredictionMiss)
  }, [finishedPredictions, historyFilter])

  const filterOptions: { value: HistoryFilter; label: string }[] = [
    { value: 'all', label: 'Todos' },
    { value: 'HIT', label: 'Acertos' },
    { value: 'MISS', label: 'Erros' },
  ]

  return (
    <Modal
      scrollBehavior="outside"
      isOpen={isOpen}
      onOpenChange={onClose}
      size="4xl"
      closeButton={<img src="/closeicon.png" alt="close" />}
    >
      <ModalContent
        className={`${fontOpenSans.className} border border-rs-border bg-rs-modal text-rs-heading`}
      >
        {(onClose) => (
          <>
            <ModalHeader className="flex items-center space-x-2 text-rs-heading">
              <Image src="/historyicon.svg" alt="histórico" />
              <h1>Meu histórico</h1>
            </ModalHeader>
            <ModalBody className="space-y-2 text-rs-muted">
              <p className="text-rs-muted">
                Confira abaixo o histórico dos resultados dos seus palpites!
              </p>
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  <Image src="/filtericon.svg" alt="filter" />
                  <span className="text-[14px] font-bold text-rs-heading">
                    Filtrar por
                  </span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {filterOptions.map((option) => (
                    <Button
                      key={option.value}
                      size="sm"
                      variant={
                        historyFilter === option.value ? 'solid' : 'bordered'
                      }
                      className={`rounded-full text-[14px] font-bold ${
                        historyFilter === option.value
                          ? option.value === 'HIT'
                            ? 'bg-rs-gold text-rs-ink'
                            : option.value === 'MISS'
                              ? 'bg-[#E40000] text-white'
                              : 'bg-rs-gold text-rs-ink'
                          : 'border-rs-border bg-transparent text-rs-muted'
                      }`}
                      onPress={() => setHistoryFilter(option.value)}
                    >
                      {option.label}
                    </Button>
                  ))}
                </div>
              </div>
              <div className="mt-4 flex justify-around">
                <button
                  type="button"
                  onClick={() => setHistoryFilter('HIT')}
                  className="flex flex-col items-center justify-center space-y-2 text-rs-heading"
                >
                  <h1>Total de acertos</h1>
                  <span className="flex w-[50px] items-center justify-center rounded border border-rs-gold/40 bg-rs-gold py-2 text-rs-ink">
                    {totalCorrectPredictions}
                  </span>
                </button>
                <button
                  type="button"
                  onClick={() => setHistoryFilter('MISS')}
                  className="flex flex-col items-center justify-center space-y-2 text-rs-heading"
                >
                  <h1>Total de erros</h1>
                  <span className="flex w-[50px] items-center justify-center rounded border border-[#E40000]/40 bg-[#E40000] py-2 text-white">
                    {totalIncorrectPredictions}
                  </span>
                </button>
              </div>

              {filteredPredictions.length === 0 ? (
                <p className="mt-6 text-center text-[14px] text-rs-muted">
                  {historyFilter === 'HIT'
                    ? 'Nenhum palpite acertado encontrado.'
                    : historyFilter === 'MISS'
                      ? 'Nenhum palpite errado encontrado.'
                      : 'Nenhum palpite finalizado encontrado.'}
                </p>
              ) : (
                filteredPredictions.map((userPrediction, index) => (
                  <div
                    key={`${userPrediction.match.roundName}-${getTeamName(userPrediction.match.teamHome)}-${getTeamName(userPrediction.match.teamAway)}-${index}`}
                    className="mx-auto flex w-[90%] flex-col items-center justify-center rounded-xl border border-rs-gold/20 bg-rs-ink p-4 text-white"
                  >
                    <div className="flex w-full justify-between">
                      <div className="flex space-x-2">
                        <Image src="/sportsicon.png" alt="sports icon" />
                        <h1 className="text-white text-[12px] font-normal">
                          {userPrediction.match.roundName}
                        </h1>
                      </div>
                      <h1 className="text-white text-[12px] font-normal">
                        {formatMatchDateTime(userPrediction.match.date)}
                      </h1>
                    </div>
                    <div className="flex justify-between items-center mt-4 w-full">
                      <div className="flex flex-col items-center space-y-2">
                        <Image
                          src={getLogo(
                            getTeamName(userPrediction.match.teamHome),
                            getTeamLogoUrl(userPrediction.match.teamHome),
                          )}
                          alt={getTeamName(userPrediction.match.teamHome)}
                          className={`w-[36px] h-[36px] rounded-full object-cover ${isDefaultLogo(getLogo(getTeamName(userPrediction.match.teamHome), getTeamLogoUrl(userPrediction.match.teamHome))) ? 'bg-white p-1' : ''}`}
                        />
                        <h1 className="text-center">
                          {getTeamName(userPrediction.match.teamHome)}
                        </h1>
                        <div className="flex justify-center items-center">
                          <h1 className="mx-3 text-[16px text-white] font-semibold">
                            {userPrediction.predictionScore.predictionHome}
                          </h1>
                        </div>
                      </div>
                      <h1 className="mx-4 text-rs-gold">X</h1>
                      <div className="flex flex-col items-center space-y-2">
                        <Image
                          src={getLogo(
                            getTeamName(userPrediction.match.teamAway),
                            getTeamLogoUrl(userPrediction.match.teamAway),
                          )}
                          alt={getTeamName(userPrediction.match.teamAway)}
                          className={`w-[36px] h-[36px] rounded-full object-cover ${isDefaultLogo(getLogo(getTeamName(userPrediction.match.teamAway), getTeamLogoUrl(userPrediction.match.teamAway))) ? 'bg-white p-1' : ''}`}
                        />
                        <h1 className="text-center">
                          {getTeamName(userPrediction.match.teamAway)}
                        </h1>
                        <div className="flex justify-center items-center">
                          <h1 className="mx-3 text-[16px text-white] font-semibold">
                            {userPrediction.predictionScore.predictionAway}
                          </h1>
                        </div>
                      </div>
                    </div>
                    {userPrediction.predictionPlayer.player && (
                      <div key={userPrediction.match.id} className="w-full">
                        <hr className="w-full h-[1px] border-t-[1px] border-t-rs-gold mt-4" />
                        <h1 className="mt-4 text-center text-[12px] font-semibold text-rs-gold">
                          Marcador do último gol do{' '}
                          {userPrediction.predictionPlayer.team ||
                            getTeamName(userPrediction.match.teamHome)}
                          :
                        </h1>
                        <h1 className="flex justify-center items-center gap-2 mt-4">
                          <Image
                            src={getPlayerPhoto(
                              userPrediction.predictionPlayer.photoUrl,
                            )}
                            alt={userPrediction.predictionPlayer.player}
                            className="w-[28px] h-[28px] rounded-full object-cover"
                          />
                          {userPrediction.predictionPlayer.player}
                        </h1>
                      </div>
                    )}
                    <hr className="w-full h-[1px] border-t-[1px] border-t-rs-gold mt-4" />
                    {isPredictionHit(userPrediction) ? (
                      <h1 className="flex justify-center items-center gap-2 mt-4">
                        <Image src="/checkicon.svg" alt="check" />
                        Você acertou o palpite!
                      </h1>
                    ) : (
                      <h1 className="flex justify-center items-center gap-2 mt-4">
                        <Image src="/wrongicon.svg" alt="check" />
                        Você errou o palpite!
                      </h1>
                    )}
                  </div>
                ))
              )}
            </ModalBody>
            <ModalFooter className="flex flex-col space-y-4">
              <Button
                onPress={onClose}
                className={`${fontOpenSans.className} rounded-full bg-rs-gold text-[14px] font-bold text-rs-ink`}
              >
                Fechar
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  )
}
