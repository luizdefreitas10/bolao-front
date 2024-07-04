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
  const [buttonIsLoading, setButtonIsLoading] = useState<boolean>(false)
  const [championships, setChampionships] = useState<IChampionshipWithRounds[]>(
    [],
  )
  const [matchPredictionScores, setMatchPredictionScores] = useState<
    IPrediction[]
  >([])
  const [fetchCompleted, setFetchCompleted] = useState<boolean>(false)
  const [existMatches, setExistMatches] = useState<boolean>(false)

  const [disabledMatches, setDisabledMatches] = useState<{
    [key: string]: boolean
  }>({})

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
          disabled: match?.predictions?.length !== 0,
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

  const increaseScore = (matchId: string, type: 'home' | 'away') => {
    setMatchPredictionScores((prevScores) =>
      prevScores.map((score) =>
        score.matchId === matchId
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

  const decreaseScore = (matchId: string, type: 'home' | 'away') => {
    setMatchPredictionScores((prevScores) =>
      prevScores.map((score) =>
        score.matchId === matchId
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
    setButtonIsLoading(true)
    event.preventDefault()

    let hasError = false
    let resultError = null

    const enabledPredictions = matchPredictionScores.filter(
      (score) => !score.disabled,
    )

    try {
      for (const matchPrediction of enabledPredictions) {
        const result = await sendPredictions(
          {
            matchId: matchPrediction.matchId,
            predictionAway: matchPrediction.predictionAway,
            predictionHome: matchPrediction.predictionHome,
            playerId: matchPrediction.playerId,
          },
          token,
        )

        if (result.isError === true) {
          hasError = true
          resultError = result.error
        } else {
          setDisabledMatches((prevState) => ({
            ...prevState,
            [matchPrediction.matchId]: true,
          }))
        }
      }

      setButtonIsLoading(false)

      if (enabledPredictions.length === 0) {
        toast.error(`Não há partidas para enviar palpites.`)
      } else if (!hasError && resultError === null) {
        toast.success('Palpite enviado com sucesso!')
      }
    } catch (error) {
      setLoading(false)
      toast.error(`Erro ao enviar palpite: ${error}`)
    }
  }

  const handlePlayerSelection = (matchId: string, playerId: string) => {
    setMatchPredictionScores((prevScores) =>
      prevScores.map((score) =>
        score.matchId === matchId ? { ...score, playerId } : score,
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
                      <div
                        className={`flex flex-col bg-[#1F67CE] p-4 rounded-lg ${match?.predictions?.length !== 0 || disabledMatches[match.id] ? 'opacity-50 pointer-events-none' : ''}`}
                      >
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
                                    decreaseScore(match.id, 'home')
                                  }
                                >
                                  -
                                </Button>
                                <div className="mx-3 text-[16px text-white]">
                                  {match.predictions.length !== 0
                                    ? match.predictions.map(
                                        (predict, predictIndex) => (
                                          <h1
                                            key={predictIndex}
                                            className="mx-3 text-[16px]  text-white"
                                          >
                                            {predict.predictionHome}
                                          </h1>
                                        ),
                                      )
                                    : matchPredictionScores.find(
                                        (scorePrediction) =>
                                          scorePrediction.matchId === match.id,
                                      )?.predictionHome}
                                </div>
                                <Button
                                  size={isMobile ? 'sm' : 'md'}
                                  variant="bordered"
                                  className="text-white border-solid border-[1px] border-white bg-[#00409F]"
                                  onClick={() =>
                                    increaseScore(match.id, 'home')
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
                                onClick={() => decreaseScore(match.id, 'away')}
                              >
                                -
                              </Button>
                              <div className="mx-3 text-[16px text-white]">
                                {match.predictions.length !== 0
                                  ? match.predictions.map(
                                      (predict, predictIndex) => (
                                        <h1
                                          key={predictIndex}
                                          className="mx-3 text-[16px]  text-white"
                                        >
                                          {predict.predictionAway}
                                        </h1>
                                      ),
                                    )
                                  : matchPredictionScores.find(
                                      (score) => score.matchId === match.id,
                                    )?.predictionAway}
                              </div>
                              <Button
                                size={isMobile ? 'sm' : 'md'}
                                variant="bordered"
                                className="text-white border-solid border-[1px] border-white bg-[#00409F]"
                                onClick={() => increaseScore(match.id, 'away')}
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
                        <div
                          className={`flex flex-col p-4 bg-[#1F67CE] rounded-lg w-[90%] mx-auto ${match?.predictions?.length !== 0 || disabledMatches[match.id] ? 'opacity-50 pointer-events-none' : ''}`}
                        >
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
                            defaultValue={
                              match?.predictions?.find(
                                (prediction) =>
                                  prediction.predictionType === 'PLAYER',
                              )?.lastPlayerToScoreId ||
                              matchPredictionScores.find(
                                (score) => score.matchId === match.id,
                              )?.playerId ||
                              undefined
                            }
                            className="mt-4 flex"
                            onChange={(event) =>
                              handlePlayerSelection(
                                match.id,
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
        {buttonIsLoading ? <Spinner /> : 'Aposte Já!'}
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
