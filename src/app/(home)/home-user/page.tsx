'use client'
import React, { useEffect, useState } from 'react'
import MyHistoryModal from '@/app/components/MyHistoryModal/MyHistoryModal'
import useWindowWidth from '@/utils/window-width-hook'
import {
  Button,
  Image,
  Radio,
  RadioGroup,
  Spinner,
  useDisclosure,
} from '@nextui-org/react'
import { fetchChampionshipsWithRounds, submitPredictions } from './actions'
import { parseCookies } from 'nookies'
import toast from 'react-hot-toast'

export default function HomeUser() {
  const { isOpen, onOpen, onOpenChange } = useDisclosure()
  const [loading, setLoading] = useState<boolean>(false)
  const [championships, setChampionships] = useState<IChampionshipWithRounds[]>(
    [],
  )
  const [matchPredictionScores, setMatchPredictionScores] = useState<
    IPrediction[]
  >([])
  const [fetchCompleted, setFetchCompleted] = useState<boolean>(false)
  const [existMatches, setExistMatches] = useState<boolean>(false)

  const windowWidth = useWindowWidth()
  const isMobile = windowWidth && windowWidth < 640

  const { 'qxute-bolao:x-token': token } = parseCookies()

  const getChampionships = async (token: string) => {
    const result = await fetchChampionshipsWithRounds(token)
    return result
  }

  const sendPredictions = async (data: IPrediction, token: string) => {
    const result = await submitPredictions(data, token)
    if (result.isError === true && result.error !== undefined) {
      toast.error(result.error)
    }
    return result
  }

  useEffect(() => {
    setLoading(true)
    getChampionships(token)
      .then((data) => {
        if (data.championships) {
          const championships = data.championships
          setChampionships(championships)
        }
      })
      .catch((e) => toast.error(e))
      .finally(() => {
        setLoading(false)
        setFetchCompleted(true)
      })
  }, [token])

  useEffect(() => {
    const initialScores = championships.flatMap((championship) =>
      championship.rounds.flatMap((round) =>
        round.matchs.map((match) => ({
          predictionHome: 0,
          predictionAway: 0,
          playerId: null,
          matchId: match.id,
        })),
      ),
    )

    setMatchPredictionScores(initialScores)

    const matchs = championships.flatMap((championship) =>
      championship.rounds.flatMap((round) => round.matchs),
    )

    if (matchs.length > 0) {
      setExistMatches(true)
    }
  }, [championships])

  const increaseScore = (index: number, type: 'home' | 'away') => {
    setMatchPredictionScores((prevScores) =>
      prevScores.map((score, i) =>
        i === index
          ? {
              ...score,
              predictionHome:
                type === 'home'
                  ? score.predictionHome + 1
                  : score.predictionHome,
              predictionAway:
                type === 'away'
                  ? score.predictionAway + 1
                  : score.predictionAway,
            }
          : score,
      ),
    )
  }

  const decreaseScore = (index: number, type: 'home' | 'away') => {
    setMatchPredictionScores((prevScores) =>
      prevScores.map((score, i) =>
        i === index
          ? {
              ...score,
              predictionHome:
                type === 'home' && score.predictionHome > 0
                  ? score.predictionHome - 1
                  : score.predictionHome,
              predictionAway:
                type === 'away' && score.predictionAway > 0
                  ? score.predictionAway - 1
                  : score.predictionAway,
            }
          : score,
      ),
    )
  }

  const handleSubmit = async (event: React.FormEvent) => {
    setLoading(true)
    event.preventDefault()
    let hasError = false
    let resultError = null
    try {
      matchPredictionScores.forEach(async (matchPrediction) => {
        const result = await sendPredictions(matchPrediction, token)
        if (result.isError === true && result.error !== undefined) {
          hasError = true
          resultError = result.error
        }
      })
      setLoading(false)
      if (hasError) {
        toast.error(`Erro ao enviar palpite: ${resultError}`)
      } else {
        toast.success('Palpite enviado com sucesso!')
      }
    } catch (error) {
      setLoading(false)
      toast.error(`Erro ao enviar palpite: ${error}`)
    }
  }

  const handlePlayerSelection = (matchIndex: number, playerId: string) => {
    setMatchPredictionScores((prevScores) =>
      prevScores.map((score, i) =>
        i === matchIndex
          ? {
              ...score,
              playerId: playerId.toString(),
            }
          : score,
      ),
    )
  }

  return (
    <form
      className={`flex flex-col mx-auto w-[100%] h-full bg-white-texture `}
      onSubmit={handleSubmit}
    >
      <h1 className={`text-center text-[#00409F] text-[18px] font-bold  mt-10`}>
        Resultado correto
      </h1>
      <p className="text-[#00409F] mt-2 mb-4 text-center">
        Lorem ipsum dolor sit amet consectetur. Laoreet.
      </p>
      {loading ? (
        <Spinner />
      ) : (
        <div className="flex flex-col w-[100%] space-y-6 mx-auto">
          {fetchCompleted && !existMatches ? (
            <h1 className="text-center text-[#00409F] text-[18px] font-bold">
              Nenhuma partida encontrada!
            </h1>
          ) : (
            championships.flatMap((championship) =>
              championship.rounds.flatMap((round) =>
                round.matchs.map((match, matchIndex) => (
                  <div key={`match-${match.id}`}>
                    <div
                      key={`match-container-${matchIndex}`}
                      className="flex flex-col w-[90%] mx-auto"
                    >
                      <div className="flex flex-col bg-[#1F67CE] p-4 rounded-lg">
                        <div className="flex w-full justify-between">
                          <div className="flex space-x-2">
                            <Image src="/sportsicon.png" alt="sports icon" />
                            <h1 className="text-white text-[12px] font-normal">
                              {round.name} do {championship.name}
                            </h1>
                          </div>
                          <h1 className="text-white text-[12px] font-normal">
                            {new Date(match.date).toLocaleDateString('pt-BR')}
                          </h1>
                        </div>
                        <div className="flex justify-center items-center mt-4">
                          <div className="flex flex-col justify-center items-center">
                            <h1 className="text-center text-white mb-4">
                              {match.teamHome.name}
                            </h1>
                            <div className="flex justify-center items-center">
                              <div className="flex justify-center items-center">
                                <Button
                                  size={isMobile ? 'sm' : 'md'}
                                  variant="bordered"
                                  className="text-white border-solid border-[1px] border-white bg-[#00409F]"
                                  onClick={() =>
                                    decreaseScore(matchIndex, 'home')
                                  }
                                >
                                  -
                                </Button>
                                <h1 className="mx-3 text-[16px text-white]">
                                  {
                                    matchPredictionScores[matchIndex]
                                      ?.predictionHome
                                  }
                                </h1>
                                <Button
                                  size={isMobile ? 'sm' : 'md'}
                                  variant="bordered"
                                  className="text-white border-solid border-[1px] border-white bg-[#00409F]"
                                  onClick={() =>
                                    increaseScore(matchIndex, 'home')
                                  }
                                >
                                  +
                                </Button>
                              </div>
                            </div>
                          </div>
                          <h1 className="mx-4">X</h1>
                          <div className="flex flex-col justify-center items-center">
                            <h1 className="text-center text-white mb-4">
                              {match.teamAway.name}
                            </h1>
                            <div className="flex justify-center items-center">
                              <Button
                                size={isMobile ? 'sm' : 'md'}
                                variant="bordered"
                                className="text-white border-solid border-[1px] border-white bg-[#00409F]"
                                onClick={() =>
                                  decreaseScore(matchIndex, 'away')
                                }
                              >
                                -
                              </Button>
                              <h1 className="mx-3 text-[16px text-white]">
                                {
                                  matchPredictionScores[matchIndex]
                                    ?.predictionAway
                                }
                              </h1>
                              <Button
                                size={isMobile ? 'sm' : 'md'}
                                variant="bordered"
                                className="text-white border-solid border-[1px] border-white bg-[#00409F]"
                                onClick={() =>
                                  increaseScore(matchIndex, 'away')
                                }
                              >
                                +
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    {match.lastPlayerTeam && (
                      <div key={matchIndex} className="my-8">
                        <h1
                          className={`text-center text-[#00409F] text-[18px] font-bold  mt-10`}
                        >
                          Quem fará o último gol do {match.lastPlayerTeam.name}?
                        </h1>
                        <p className="text-[#00409F] mt-2 mb-4 text-center">
                          Lorem ipsum dolor sit amet consectetur. Laoreet.
                        </p>
                        <div className="flex flex-col p-4 bg-[#1F67CE] rounded-lg w-[90%] mx-auto">
                          <div className="flex w-full justify-between">
                            <div className="flex space-x-2">
                              <Image src="/sportsicon.png" alt="sports icon" />
                              <h1 className="text-white text-[12px] font-normal">
                                {round.name} - {match.teamHome.name} X{' '}
                                {match.teamAway.name}
                              </h1>
                            </div>
                            <h1 className="text-white text-[12px] font-normal">
                              {new Date(match.date).toLocaleDateString('pt-BR')}
                            </h1>
                          </div>
                          <div className="flex space-x-2 items-center mt-4">
                            <Image
                              src="/sportlogo.svg"
                              alt="sport logo"
                              className="w-[28px] h-[28px]"
                            />
                            <h1 className="text-white text-[12px] font-normal">
                              Jogadores - {match.lastPlayerTeam.name}
                            </h1>
                          </div>
                          <hr className="w-full h-[1px] bg-white mt-4" />
                          <RadioGroup
                            className="mt-4 flex"
                            onChange={(
                              event: React.ChangeEvent<HTMLInputElement>,
                            ) =>
                              handlePlayerSelection(
                                matchIndex,
                                event.target.value,
                              )
                            }
                          >
                            {match.players.map((player) => (
                              <div
                                className="bg-[#00409F] flex justify-between items-center p-2 space-x-2 rounded-sm"
                                key={player.id}
                              >
                                <div className="flex justify-center items-center space-x-2">
                                  <Image
                                    src="/sportlogo.svg"
                                    alt={player.name}
                                  />
                                  <h1 className="">{player.name}</h1>
                                </div>
                                <Radio
                                  color="success"
                                  className="custom-radio-order justify-between"
                                  value={`${player.id}`}
                                  classNames={{
                                    label: 'hidden',
                                  }}
                                >
                                  {player.name}
                                </Radio>
                              </div>
                            ))}
                          </RadioGroup>
                        </div>
                      </div>
                    )}
                  </div>
                )),
              ),
            )
          )}
        </div>
      )}

      <Button
        type="submit"
        className={` rounded-full bg-[#00764B] text-white text-[14px] font-bold flex justify-center items-center px-4 py-3 my-2 mt-8 w-[90%] mx-auto`}
      >
        {loading ? <Spinner /> : 'Aposte Já!'}
      </Button>
      <Button
        variant="bordered"
        onPress={onOpen}
        startContent={<Image src="/historyicon.svg" alt="history" />}
        className={`border-[2px] border-solid border-[#00764B] text-[#00764B] rounded-full bg-transparent text-[14px] font-bold flex justify-center items-center px-4 py-3 my-2 mb-8 w-[90%] mx-auto`}
      >
        Meu histórico
      </Button>
      <div className="bg-[#00409F] w-full h-[250px] flex justify-center items-center">
        <div className="w-[90%] bg-black h-[160px] rounded-xl flex justify-center items-center">
          <h1>betvip banner</h1>
        </div>
      </div>
      <MyHistoryModal isOpen={isOpen} onClose={onOpenChange} />
    </form>
  )
}
