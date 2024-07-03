import React from 'react'
import { useEventsContext } from '@/context/EventsContext'
import { schemaSetResultMatch } from '@/schemas/match'
import { handleAxiosError } from '@/services/api/error'
import MatchService from '@/services/api/models/match'
import { formatDateToCustomString } from '@/utils/formatDate'
import { getLogo } from '@/utils/getLogo'
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

const fontOpenSans = OpenSans({ subsets: ['latin'] })

interface CustomModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function SetResultModal({ isOpen, onClose }: CustomModalProps) {
  const {
    selectedMatchSetResult,
    setSelectedMatchSetResult,
    setRefreshRounds,
  } = useEventsContext()
  const [loading, setLoading] = useState<boolean>(false)
  // const [players, setPlayers] = useState<IPlayer[]>([]);
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
    // setPlayers([]);
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

  return (
    <Modal
      scrollBehavior="outside"
      isOpen={isOpen}
      onOpenChange={handleOnClose}
      size="4xl"
      closeButton={<img src="/closeicon.png" alt="close" />}
    >
      <ModalContent className={`${fontOpenSans.className} bg-[#1F67CE]`}>
        {(onClose) => (
          <>
            <ModalHeader className="flex space-x-2 items-center">
              <Image src="/historyicon.svg" alt="mail icon" />
              <h1>Definir resultado</h1>
            </ModalHeader>

            {shouldShowConfirmationCard ? (
              <div className="bg-[#00409F] flex flex-col gap-2 rounded-lg w-[90%] mx-auto my-10 p-4">
                <p>Confirme antes de salvar</p>
                <p>
                  {selectedMatchSetResult?.match.teamHome.name}:{' '}
                  {payload?.scoreHome}
                </p>
                <p>
                  {selectedMatchSetResult?.match.teamAway.name}:{' '}
                  {payload?.scoreAway}
                </p>
                {selectedMatchSetResult?.match.lastPlayerTeam && (
                  <p>
                    Último jogador a marcar do{' '}
                    {selectedMatchSetResult?.match.lastPlayerTeam?.name}:{' '}
                    {getPlayerName(payload?.lastPlayerId)}
                  </p>
                )}

                <Button
                  onPress={handleConfirm}
                  type="button"
                  className={`${fontOpenSans.className} mt-6 text-[14px] text-white font-bold bg-[#E40000] rounded-full`}
                >
                  Confirmar
                </Button>
                <Button
                  onPress={() => {
                    setPayload(undefined)
                    setShouldShowConfirmationCard(false)
                  }}
                  type="button"
                  className={`${fontOpenSans.className} text-[14px] text-white font-bold bg-[#E40000] rounded-full`}
                >
                  Voltar
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit(handleSave)}>
                <ModalBody className="space-y-2">
                  <p>Defina abaixo o resultado da partida:</p>
                  <div className="flex flex-col p-4 bg-[#00409F] rounded-lg w-[90%] mx-auto">
                    <div className="flex w-full justify-between">
                      <div className="flex space-x-2">
                        <Image src="/sportsicon.png" alt="sports icon" />
                        <h1 className="text-white text-[12px] font-normal">
                          {selectedMatchSetResult?.championship.name} -{' '}
                          {selectedMatchSetResult?.name}
                        </h1>
                      </div>
                      {selectedMatchSetResult && (
                        <h1 className="text-white text-[12px] font-normal">
                          {formatDateToCustomString(
                            new Date(selectedMatchSetResult?.match.date),
                          )}
                        </h1>
                      )}
                    </div>
                    <div className="flex justify-evenly items-center mt-4">
                      <div className="flex flex-col space-y-4">
                        <h1 className="text-center">
                          {selectedMatchSetResult?.match.teamHome.name}
                        </h1>
                        <div className="flex justify-center items-center">
                          <input
                            defaultValue="0"
                            type="number"
                            className="w-5 bg-transparent outline-none"
                            {...register('scoreHome')}
                            onInput={handleScoreInputChange}
                          />
                        </div>
                      </div>
                      <h1 className="mx-4">X</h1>
                      <div className="flex flex-col space-y-4">
                        <h1 className="text-center">
                          {selectedMatchSetResult?.match.teamAway.name}
                        </h1>
                        <div className="flex justify-center items-center">
                          <input
                            defaultValue="0"
                            type="number"
                            className="w-5 bg-transparent outline-none"
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

                    {selectedMatchSetResult?.match.lastPlayerTeam &&
                      selectedMatchSetResult?.match?.players?.length > 0 && (
                        <>
                          <hr className="w-full h-[1px] border-t-[1px] border-t-[#1F67CE] mt-4" />

                          <h1 className="text-[12px] font-semibold text-white my-4">
                            Selecione o marcador do último jogo do{' '}
                            {selectedMatchSetResult?.match.lastPlayerTeam?.name}
                            :
                          </h1>
                          {errors.lastPlayerId?.message && (
                            <p className="text-[12px] text-red-500 mb-4">
                              * Escolha o último marcador do{' '}
                              {
                                selectedMatchSetResult?.match.lastPlayerTeam
                                  .name
                              }
                            </p>
                          )}
                          <div className="flex items-center gap-3">
                            <div
                              className={`rounded-full w-[28px] h-[28px] ${getLogo(selectedMatchSetResult?.match.lastPlayerTeam?.name) === '/defaultlogo.svg' && 'bg-[#fff]'} `}
                            >
                              <Image
                                src={getLogo(
                                  selectedMatchSetResult?.match.lastPlayerTeam
                                    ?.name,
                                )}
                                alt="sport logo"
                                className="w-[16px] h-[16px]"
                              />
                            </div>
                            <h1 className="text-white text-[16px] font-normal">
                              {
                                selectedMatchSetResult?.match.lastPlayerTeam
                                  ?.name
                              }
                            </h1>
                          </div>
                          <Controller
                            name="lastPlayerId"
                            control={control}
                            defaultValue={
                              selectedMatchSetResult?.match.lastPlayerToScore
                                ?.id || ''
                            }
                            render={({ field }) => (
                              <RadioGroup
                                {...field}
                                value={field.value || ''}
                                className="mt-4 flex"
                              >
                                {selectedMatchSetResult?.match.players?.map(
                                  (player) => (
                                    <div
                                      className="bg-[#00409F] flex justify-between items-center p-2 space-x-2 rounded-sm"
                                      key={player.id}
                                    >
                                      <div className="flex justify-center items-center space-x-2">
                                        <div
                                          className={`rounded-full w-[28px] h-[28px] ${getLogo(selectedMatchSetResult?.match.lastPlayerTeam?.name) === '/defaultlogo.svg' && 'bg-[#fff]'}`}
                                        >
                                          <Image
                                            src={getLogo(
                                              selectedMatchSetResult?.match
                                                .lastPlayerTeam?.name,
                                            )}
                                            alt={player.name}
                                            width={28}
                                            height={28}
                                          />
                                        </div>
                                        <h1>{player.name}</h1>
                                      </div>
                                      <Radio
                                        color="success"
                                        value={player.id}
                                        classNames={{
                                          label: 'hidden',
                                        }}
                                      >
                                        {player.name}
                                      </Radio>
                                    </div>
                                  ),
                                )}
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
                    className={`${fontOpenSans.className} text-[14px] text-white font-bold bg-[#E40000] rounded-full`}
                  >
                    Salvar resultado
                  </Button>
                  <Button
                    onPress={onClose}
                    className={`${fontOpenSans.className} text-[14px] text-white font-bold bg-[#E40000] rounded-full`}
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
