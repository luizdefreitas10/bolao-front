import React from 'react'
import { useEventsContext } from '@/context/EventsContext'
import { schemaSetResultMatch } from '@/schemas/match'
import { handleAxiosError } from '@/services/api/error'
import MatchService from '@/services/api/models/match'
import { formatDateToCustomString } from '@/utils/formatDate'
import { getLogo, isDefaultLogo } from '@/utils/getLogo'
import { getPlayerPhoto } from '@/utils/getPlayerPhoto'
import { yupResolver } from '@hookform/resolvers/yup'
import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Image,
  RadioGroup,
  Radio,
} from '@nextui-org/react'
import { Open_Sans as OpenSans } from 'next/font/google'
import { useEffect, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import SportsIcon from '../SportsIcon/SportsIcon'
import {
  eventModalBodyClassName,
  eventModalHeaderClassName,
} from '../form/formClassNames'

const fontOpenSans = OpenSans({ subsets: ['latin'] })

interface CustomModalProps {
  isOpen: boolean
  onClose: () => void
}

function teamLogoClassName(
  name?: string,
  logoUrl?: string | null,
  size: 'sm' | 'md' = 'md',
) {
  const logo = getLogo(name, logoUrl)
  const sizeClass = size === 'sm' ? 'h-7 w-7' : 'h-10 w-10'
  return `${sizeClass} rounded-full object-cover ${isDefaultLogo(logo) ? 'bg-white p-1' : ''}`
}

export default function SetResultModal({ isOpen, onClose }: CustomModalProps) {
  const {
    selectedMatchSetResult,
    setSelectedMatchSetResult,
    setRefreshRounds,
  } = useEventsContext()
  const [loading, setLoading] = useState<boolean>(false)
  const [payload, setPayload] = useState<ISetResultMatch>()
  const [shouldShowConfirmationCard, setShouldShowConfirmationCard] =
    useState(false)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    control,
    setValue,
  } = useForm<ISetResultMatch>({
    defaultValues: {
      lastPlayerId: '',
    },
    resolver: yupResolver(
      schemaSetResultMatch(selectedMatchSetResult?.match?.players || []),
    ),
    mode: 'onSubmit',
    shouldFocusError: false,
  })

  useEffect(() => {
    if (selectedMatchSetResult?.match.lastPlayerToScore?.id) {
      setValue(
        'lastPlayerId',
        selectedMatchSetResult?.match.lastPlayerToScore?.id,
      )
    }
    if (selectedMatchSetResult) {
      setValue('scoreAway', selectedMatchSetResult.match.scoreAway)
      setValue('scoreHome', selectedMatchSetResult.match.scoreHome)
    }
  }, [selectedMatchSetResult, setValue])

  function handleOnClose() {
    setSelectedMatchSetResult(undefined)
    reset()
    setPayload(undefined)
    setShouldShowConfirmationCard(false)
    onClose()
  }

  function handleSave(data: ISetResultMatch) {
    setShouldShowConfirmationCard(true)
    setPayload(data)
  }

  async function handleConfirm() {
    if (selectedMatchSetResult?.match.id && payload) {
      setLoading(true)
      try {
        const { updateScore } = await MatchService()
        await updateScore({
          matchId: selectedMatchSetResult?.match.id,
          scoreAway: payload?.scoreAway,
          scoreHome: payload.scoreHome,
          lastPlayerId: payload.lastPlayerId,
        })
        setRefreshRounds(true)
        handleOnClose()
      } catch (error) {
        const customError = handleAxiosError(error)
        toast.error(customError.message)
      } finally {
        setLoading(false)
      }
    }
  }

  const handleScoreInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value
    if (value.length > 2) {
      value = value.slice(0, 2)
    }
    e.target.value = value
  }

  function getPlayerName(id?: string) {
    if (id) {
      const player = selectedMatchSetResult?.match?.players?.find(
        (item) => item.id === id,
      )
      if (player) {
        return player.name
      }
    }
  }

  const match = selectedMatchSetResult?.match
  const lastPlayerTeam = match?.lastPlayerTeam

  return (
    <Modal
      scrollBehavior="outside"
      isOpen={isOpen}
      onOpenChange={handleOnClose}
      size="4xl"
      closeButton={<img src="/closeicon.png" alt="close" />}
    >
      <ModalContent
        className={`${fontOpenSans.className} bg-rs-modal text-rs-heading`}
      >
        {(onClose) => (
          <>
            <ModalHeader className={eventModalHeaderClassName}>
              <Image src="/historyicon.svg" alt="mail icon" />
              <h1>Definir resultado</h1>
            </ModalHeader>

            {shouldShowConfirmationCard ? (
              <div className="mx-auto my-10 flex w-[90%] flex-col gap-2 rounded-lg bg-rs-card-elevated p-4 text-rs-heading">
                <p>Confirme antes de salvar</p>
                <p>
                  {match?.teamHome.name}: {payload?.scoreHome}
                </p>
                <p>
                  {match?.teamAway.name}: {payload?.scoreAway}
                </p>
                {lastPlayerTeam && (
                  <p>
                    Último jogador a marcar do {lastPlayerTeam.name}:{' '}
                    {getPlayerName(payload?.lastPlayerId)}
                  </p>
                )}

                <Button
                  onPress={handleConfirm}
                  type="button"
                  className={`${fontOpenSans.className} mt-6 rounded-full bg-[#E40000] text-[14px] font-bold text-white`}
                >
                  Confirmar
                </Button>
                <Button
                  onPress={() => {
                    setPayload(undefined)
                    setShouldShowConfirmationCard(false)
                  }}
                  type="button"
                  className={`${fontOpenSans.className} rounded-full bg-[#E40000] text-[14px] font-bold text-white`}
                >
                  Voltar
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit(handleSave)}>
                <ModalBody className={eventModalBodyClassName}>
                  <p className="text-rs-heading">
                    Defina abaixo o resultado da partida:
                  </p>
                  <div className="mx-auto flex w-[90%] flex-col rounded-lg bg-rs-card-elevated p-4 text-rs-heading">
                    <div className="flex w-full justify-between">
                      <div className="flex space-x-2">
                        <SportsIcon />
                        <h1 className="text-[12px] font-normal">
                          {selectedMatchSetResult?.championship.name} -{' '}
                          {selectedMatchSetResult?.name}
                        </h1>
                      </div>
                      {selectedMatchSetResult && (
                        <h1 className="text-[12px] font-normal">
                          {formatDateToCustomString(
                            new Date(selectedMatchSetResult.match.date),
                          )}
                        </h1>
                      )}
                    </div>
                    <div className="mt-4 flex items-center justify-evenly">
                      <div className="flex flex-col items-center gap-2">
                        <Image
                          src={getLogo(
                            match?.teamHome.name,
                            match?.teamHome.logoUrl,
                          )}
                          alt={match?.teamHome.name}
                          className={teamLogoClassName(
                            match?.teamHome.name,
                            match?.teamHome.logoUrl,
                          )}
                        />
                        <h1 className="text-center">{match?.teamHome.name}</h1>
                        <div className="flex items-center justify-center">
                          <input
                            defaultValue="0"
                            type="number"
                            className="w-8 bg-transparent text-center text-base font-semibold text-rs-heading outline-none"
                            {...register('scoreHome')}
                            onInput={handleScoreInputChange}
                          />
                        </div>
                      </div>
                      <h1 className="mx-4 text-rs-muted">X</h1>
                      <div className="flex flex-col items-center gap-2">
                        <Image
                          src={getLogo(
                            match?.teamAway.name,
                            match?.teamAway.logoUrl,
                          )}
                          alt={match?.teamAway.name}
                          className={teamLogoClassName(
                            match?.teamAway.name,
                            match?.teamAway.logoUrl,
                          )}
                        />
                        <h1 className="text-center">{match?.teamAway.name}</h1>
                        <div className="flex items-center justify-center">
                          <input
                            defaultValue="0"
                            type="number"
                            className="w-8 bg-transparent text-center text-base font-semibold text-rs-heading outline-none"
                            {...register('scoreAway')}
                            onInput={handleScoreInputChange}
                          />
                        </div>
                      </div>
                    </div>
                    {(errors.scoreAway?.message ||
                      errors.scoreHome?.message) && (
                      <p className="text-[12px] text-red-500">
                        * Preencha os dois placares
                      </p>
                    )}

                    {lastPlayerTeam && match?.players?.length > 0 && (
                      <>
                        <hr className="mt-4 h-px w-full border-0 bg-rs-border" />

                        <h1 className="my-4 text-[12px] font-semibold">
                          Selecione o marcador do último jogo do{' '}
                          {lastPlayerTeam.name}:
                        </h1>
                        {errors.lastPlayerId?.message && (
                          <p className="mb-4 text-[12px] text-red-500">
                            * Escolha o último marcador do {lastPlayerTeam.name}
                          </p>
                        )}
                        <div className="flex items-center gap-3">
                          <Image
                            src={getLogo(
                              lastPlayerTeam.name,
                              lastPlayerTeam.logoUrl,
                            )}
                            alt={lastPlayerTeam.name}
                            className={teamLogoClassName(
                              lastPlayerTeam.name,
                              lastPlayerTeam.logoUrl,
                              'sm',
                            )}
                          />
                          <h1 className="text-[16px] font-normal">
                            {lastPlayerTeam.name}
                          </h1>
                        </div>
                        <Controller
                          name="lastPlayerId"
                          control={control}
                          defaultValue={match.lastPlayerToScore?.id || ''}
                          render={({ field }) => (
                            <RadioGroup
                              {...field}
                              value={field.value || ''}
                              className="mt-4 flex"
                            >
                              {match.players.map((player) => (
                                <div
                                  className="flex items-center justify-between space-x-2 rounded-lg border border-rs-border bg-rs-modal p-2 text-rs-heading"
                                  key={player.id}
                                >
                                  <div className="flex items-center justify-center space-x-2">
                                    <Image
                                      src={getPlayerPhoto(
                                        player.photoUrl,
                                        player.name,
                                      )}
                                      alt={player.name}
                                      className="h-7 w-7 rounded-full object-cover"
                                    />
                                    <h1>{player.name}</h1>
                                  </div>
                                  <Radio
                                    color="primary"
                                    value={player.id}
                                    classNames={{
                                      label: 'hidden',
                                    }}
                                  >
                                    {player.name}
                                  </Radio>
                                </div>
                              ))}
                            </RadioGroup>
                          )}
                        />
                      </>
                    )}
                  </div>
                </ModalBody>
                <ModalFooter className="flex flex-col space-y-4">
                  <Button
                    isDisabled={!!loading}
                    type="submit"
                    className={`${fontOpenSans.className} rounded-full bg-[#E40000] text-[14px] font-bold text-white`}
                  >
                    Salvar resultado
                  </Button>
                  <Button
                    onPress={onClose}
                    className={`${fontOpenSans.className} rounded-full bg-[#E40000] text-[14px] font-bold text-white`}
                  >
                    Fechar
                  </Button>
                </ModalFooter>
              </form>
            )}
          </>
        )}
      </ModalContent>
    </Modal>
  )
}
