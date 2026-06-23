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
    () => userPredictions.filter((prediction) => prediction.match.status === 'DONE'),
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
      <ModalContent className={`${fontOpenSans.className} bg-[#1F67CE]`}>
        {(onClose) => (
          <>
            <ModalHeader className="flex space-x-2 items-center">
              <Image src="/whitehistoryicon.svg" alt="mail icon" />
              <h1>Meu histórico</h1>
            </ModalHeader>
            <ModalBody className="space-y-2">
              <p>
                Confira abaixo o histórico dos resultados dos seus palpites!
              </p>
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  <Image src="/filtericon.svg" alt="filter" />
                  <span className="font-bold text-white text-[14px]">
                    Filtrar por
                  </span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {filterOptions.map((option) => (
                    <Button
                      key={option.value}
                      size="sm"
                      variant={historyFilter === option.value ? 'solid' : 'bordered'}
                      className={`rounded-full font-bold text-[14px] ${
                        historyFilter === option.value
                          ? option.value === 'HIT'
                            ? 'bg-[#00764B] text-white'
                            : option.value === 'MISS'
                              ? 'bg-[#E40000] text-white'
                              : 'bg-white text-[#1F67CE]'
                          : 'border-white text-white bg-transparent'
                      }`}
                      onPress={() => setHistoryFilter(option.value)}
                    >
                      {option.label}
                    </Button>
                  ))}
                </div>
              </div>
              <div className="flex justify-around mt-4">
                <button
                  type="button"
                  onClick={() => setHistoryFilter('HIT')}
                  className="flex flex-col justify-center items-center space-y-2"
                >
                  <h1>Total de acertos</h1>
                  <span className="bg-[#00764B] w-[50px] flex justify-center items-center py-2 rounded-[4px] border-white border-[1px] border-solid">
                    {totalCorrectPredictions}
                  </span>
                </button>
                <button
                  type="button"
                  onClick={() => setHistoryFilter('MISS')}
                  className="flex flex-col justify-center items-center space-y-2"
                >
                  <h1>Total de erros</h1>
                  <span className="bg-[#E40000] w-[50px] flex justify-center items-center py-2 rounded-[4px] border-white border-[1px] border-solid">
                    {totalIncorrectPredictions}
                  </span>
                </button>
              </div>

              {filteredPredictions.length === 0 ? (
                <p className="text-center text-white text-[14px] mt-6">
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
                    className="flex flex-col p-4 bg-[#00409F] rounded-lg w-[90%] mx-auto justify-center items-center"
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
                        <h1 className="mx-4">X</h1>
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
                          <hr className="w-full h-[1px] border-t-[1px] border-t-[#1F67CE] mt-4" />
                          <h1 className="text-[12px] font-semibold text-white text-center mt-4">
                            Marcador do último gol do{' '}
                            {userPrediction.predictionPlayer.team ||
                              getTeamName(userPrediction.match.teamHome)}
                            :
                          </h1>
                          <h1 className="flex justify-center items-center gap-2 mt-4">
                            <Image
                              src={getPlayerPhoto(
                                userPrediction.predictionPlayer.photoUrl,
                                userPrediction.predictionPlayer.player,
                              )}
                              alt={userPrediction.predictionPlayer.player}
                              className="w-[28px] h-[28px] rounded-full object-cover"
                            />
                            {userPrediction.predictionPlayer.player}
                          </h1>
                        </div>
                      )}
                      <hr className="w-full h-[1px] border-t-[1px] border-t-[#1F67CE] mt-4" />
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
                className={`${fontOpenSans.className} text-[14px] text-white font-bold bg-[#E40000] rounded-full`}
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
