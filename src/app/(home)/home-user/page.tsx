'use client'
import React, { useEffect, useMemo, useState } from 'react'
import MyHistoryModal from '@/app/components/MyHistoryModal/MyHistoryModal'
import BetConfirmationModal from '@/app/components/BetConfirmationModal/BetConfirmationModal'
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
import { getLogo, isDefaultLogo } from '@/utils/getLogo'
import { getPlayerPhoto } from '@/utils/getPlayerPhoto'
import { formatMatchDateTime } from '@/utils/formatDate'
import PromoBanner from '@/app/components/PromoBanner/PromoBanner'

export default function HomeUser() {
  const { isOpen, onOpen, onOpenChange } = useDisclosure()
  const {
    isOpen: isConfirmOpen,
    onOpen: onConfirmOpen,
    onOpenChange: onConfirmOpenChange,
  } = useDisclosure()
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

  const handleOpenConfirmModal = (event: React.FormEvent) => {
    event.preventDefault()
    const hasPending = matchPredictionScores.some((s) => !s.disabled)
    if (!hasPending) {
      toast.error('Não há partidas disponíveis para palpite.')
      return
    }
    onConfirmOpen()
  }

  const handleConfirmSubmit = async (finalPredictions: IPrediction[]) => {
    setButtonIsLoading(true)

    let hasError = false
    let resultError = null

    const enabledPredictions = finalPredictions.filter((s) => !s.disabled)

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
          setMatchPredictionScores((prev) =>
            prev.map((p) =>
              p.matchId === matchPrediction.matchId
                ? { ...matchPrediction }
                : p,
            ),
          )
        }
      }

      setButtonIsLoading(false)

      if (!hasError && resultError === null) {
        toast.success('Palpite enviado com sucesso!')
        onConfirmOpenChange()
      }
    } catch (error) {
      setButtonIsLoading(false)
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

  const sortedMatches = useMemo(() => {
    return championships
      .flatMap((championship) =>
        championship.rounds.flatMap((round) =>
          round.matchs.map((match) => ({ championship, round, match })),
        ),
      )
      .sort(
        (a, b) =>
          new Date(a.match.date).getTime() - new Date(b.match.date).getTime(),
      )
  }, [championships])

  return (
    <form
      className="mx-auto flex h-full w-full flex-col bg-rs-background px-2 pb-8"
      onSubmit={handleOpenConfirmModal}
    >
      <h1 className="mt-10 text-center text-lg font-bold text-rs-heading">
        Resultado correto
      </h1>
      <p className="mb-4 mt-2 text-center text-sm text-rs-muted">
        Informe o placar e escolha quem fará o último gol.
      </p>
      {loading ? (
        <Spinner />
      ) : (
        <div className="flex flex-col w-[100%] space-y-6 mx-auto">
          {fetchCompleted && !existMatches ? (
            <h1 className="text-center text-rs-heading text-[18px] font-bold">
              Nenhuma partida encontrada!
            </h1>
          ) : (
            sortedMatches.map(({ championship, round, match }, matchIndex) => (
              <div key={`match-${match.id}`}>
                <div
                  key={`match-container-${matchIndex}`}
                  className="flex flex-col w-[90%] mx-auto"
                >
                  <div
                    className={`flex flex-col rounded-xl border border-rs-gold/20 bg-rs-ink p-4 text-white ${match?.predictions?.length !== 0 || disabledMatches[match.id] ? 'pointer-events-none opacity-50' : ''}`}
                  >
                    <div className="flex w-full justify-between">
                      <div className="flex space-x-2">
                        <Image src="/sportsicon.png" alt="sports icon" />
                        <h1 className="text-white text-[12px] font-normal">
                          {round.name} do {championship.name}
                        </h1>
                      </div>
                      <h1 className="text-white text-[12px] font-normal">
                        {formatMatchDateTime(match.date)}
                      </h1>
                    </div>
                    <div className="flex justify-center items-center mt-4">
                      <div className="flex flex-col justify-center items-center">
                        <Image
                          src={getLogo(
                            match.teamHome.name,
                            match.teamHome.logoUrl,
                          )}
                          alt={match.teamHome.name}
                          className={`w-[40px] h-[40px] rounded-full mb-2 object-cover ${isDefaultLogo(getLogo(match.teamHome.name, match.teamHome.logoUrl)) ? 'bg-white p-1' : ''}`}
                        />
                        <h1 className="text-center text-white mb-4">
                          {match.teamHome.name}
                        </h1>
                        <div className="flex justify-center items-center">
                          <div className="flex justify-center items-center">
                            <Button
                              size={isMobile ? 'sm' : 'md'}
                              variant="bordered"
                              className="border border-rs-gold bg-transparent text-rs-gold"
                              onClick={() => decreaseScore(match.id, 'home')}
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
                              className="border border-rs-gold bg-transparent text-rs-gold"
                              onClick={() => increaseScore(match.id, 'home')}
                            >
                              +
                            </Button>
                          </div>
                        </div>
                      </div>
                      <h1 className="mx-4 text-rs-gold">X</h1>
                      <div className="flex flex-col justify-center items-center">
                        <Image
                          src={getLogo(
                            match.teamAway.name,
                            match.teamAway.logoUrl,
                          )}
                          alt={match.teamAway.name}
                          className={`w-[40px] h-[40px] rounded-full mb-2 object-cover ${isDefaultLogo(getLogo(match.teamAway.name, match.teamAway.logoUrl)) ? 'bg-white p-1' : ''}`}
                        />
                        <h1 className="text-center text-white mb-4">
                          {match.teamAway.name}
                        </h1>
                        <div className="flex justify-center items-center">
                          <Button
                            size={isMobile ? 'sm' : 'md'}
                            variant="bordered"
                            className="border border-rs-gold bg-transparent text-rs-gold"
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
                            className="border border-rs-gold bg-transparent text-rs-gold"
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
                      className={`text-center text-rs-heading text-[18px] font-bold  mt-10`}
                    >
                      Quem fará o último gol do {match.lastPlayerTeam.name}?
                    </h1>
                    <p className="mb-4 mt-2 text-center text-sm text-rs-muted">
                      Selecione o jogador que você acredita que fará o último
                      gol.
                    </p>
                    <div
                      className={`mx-auto flex w-[90%] flex-col rounded-xl border border-rs-gold/20 bg-rs-ink p-4 text-white ${match?.predictions?.length !== 0 || disabledMatches[match.id] ? 'pointer-events-none opacity-50' : ''}`}
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
                          {formatMatchDateTime(match.date)}
                        </h1>
                      </div>
                      <div className="flex space-x-2 items-center mt-4">
                        <Image
                          src={getLogo(
                            match.lastPlayerTeam.name,
                            match.lastPlayerTeam.logoUrl,
                          )}
                          alt={match.lastPlayerTeam.name}
                          className={`w-[28px] h-[28px] rounded-full object-cover ${isDefaultLogo(getLogo(match.lastPlayerTeam.name, match.lastPlayerTeam.logoUrl)) ? 'bg-white p-0.5' : ''}`}
                        />
                        <h1 className="text-white text-[12px] font-normal">
                          Jogadores - {match.lastPlayerTeam.name}
                        </h1>
                      </div>
                      <hr className="mt-4 h-px w-full bg-rs-gold/30" />
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
                          handlePlayerSelection(match.id, event.target.value)
                        }
                      >
                        {match.players.map((player) => (
                          <div
                            className="flex items-center justify-between space-x-2 rounded-lg border border-rs-gold/20 bg-rs-card-elevated p-2 text-rs-heading"
                            key={player.id}
                          >
                            <div className="flex justify-center items-center space-x-2">
                              <Image
                                src={getPlayerPhoto(player.photoUrl)}
                                alt={player.name}
                                className="w-[28px] h-[28px] rounded-full object-cover"
                              />
                              <h1 className="">{player.name}</h1>
                            </div>
                            <Radio
                              color="primary"
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
            ))
          )}
        </div>
      )}

      <Button
        type="submit"
        className={` rounded-full bg-rs-gold text-rs-ink text-[14px] font-bold flex justify-center items-center px-4 py-3 my-2 mt-8 w-[90%] mx-auto`}
      >
        {buttonIsLoading ? <Spinner /> : 'Aposte Já!'}
      </Button>
      <Button
        variant="bordered"
        onPress={onOpen}
        startContent={<Image src="/historyicon.svg" alt="history" />}
        className={`border-[2px] border-solid border-rs-gold text-rs-gold rounded-full bg-transparent text-[14px] font-bold flex justify-center items-center px-4 py-3 my-2 mb-8 w-[90%] mx-auto`}
      >
        Meu histórico
      </Button>
      <PromoBanner />
      <MyHistoryModal isOpen={isOpen} onClose={onOpenChange} />
      <BetConfirmationModal
        isOpen={isConfirmOpen}
        onClose={onConfirmOpenChange}
        sortedMatches={sortedMatches}
        initialPredictions={matchPredictionScores}
        onConfirm={handleConfirmSubmit}
        isSubmitting={buttonIsLoading}
      />
    </form>
  )
}
