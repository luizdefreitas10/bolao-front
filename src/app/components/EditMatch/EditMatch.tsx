import React from 'react'
import { useEventsContext } from '@/context/EventsContext'
import { editMatchesSchema } from '@/schemas/match'
import { handleAxiosError } from '@/services/api/error'
import PlayerService from '@/services/api/models/players'
import { yupResolver } from '@hookform/resolvers/yup'
import {
  Button,
  Checkbox,
  DateInput,
  DateValue,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Select,
  SelectItem,
} from '@nextui-org/react'
import { useEffect, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { MdEdit } from 'react-icons/md'
import { NewPlayerEdit } from '../NewPlayerEdit/NewPlayerEdit'
import { CalendarDateTime, parseDateTime } from '@internationalized/date'
import { DateTime } from 'luxon'
import MatchService from '@/services/api/models/match'

export interface IFormInput {
  homeTeam: string
  awayTeam: string
  dateTime: DateValue
  lastPlayerTeam: string
  players: { name: string }[]
}

interface ModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function EditMatchModal({ isOpen, onClose }: ModalProps) {
  const { editSelectedMatch, setEditSelectedMatch, setRefreshRounds } =
    useEventsContext()
  const [teams, setTeams] = useState<{ id: string; name: string }[]>([])
  const [players, setPlayers] = useState<IPlayer[]>([])
  const [shouldSelectTeamLastPlayer, setShouldSelectTeamLastPlayer] =
    useState(false)
  const [selectedTeam, setSelectedTeam] = useState(
    editSelectedMatch?.lastPlayerTeam?.id || '',
  )
  const [accrualDateTime, setAccrualDateTime] = useState<DateValue | null>(null)
  const [loading, setLoading] = useState(false)
  const [selectedPlayers, setSelectedPlayers] = useState<string[]>([])
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
    setValue,
    reset,
  } = useForm<IFormInput>({
    mode: 'onSubmit',
    resolver: yupResolver(editMatchesSchema) as any,

    defaultValues: {
      homeTeam: editSelectedMatch?.teamHome.name,
      awayTeam: editSelectedMatch?.teamAway.name,
      //   dateTime: undefined as unknown as DateValue,
      dateTime: editSelectedMatch?.date,
      lastPlayerTeam: editSelectedMatch?.lastPlayerTeam?.id || '',
      players: [{ name: '' }],
    },
  })

  useEffect(() => {
    if (editSelectedMatch) {
      const list = [editSelectedMatch.teamHome, editSelectedMatch.teamAway]
      setTeams(list)
      if (editSelectedMatch.lastPlayerTeam) {
        fetchPlayers(editSelectedMatch.lastPlayerTeam?.id)
      }
      if (editSelectedMatch.players) {
        const list: string[] = []
        for (const player of editSelectedMatch.players) {
          list.push(player.name)
        }
        setSelectedPlayers(list)
      }
    }
  }, [editSelectedMatch])

  const fetchPlayers = async (teamId: string) => {
    if (teamId) {
      setLoading(true)
      try {
        const { fetchPlayersByTeam } = await PlayerService()
        const response = await fetchPlayersByTeam(teamId)
        setPlayers(response)
      } catch (error) {
        const customError = handleAxiosError(error)
        toast.error(customError.message)
      } finally {
        setLoading(false)
      }
    }
  }

  useEffect(() => {
    if (editSelectedMatch) {
      const list = [editSelectedMatch.teamAway, editSelectedMatch.teamHome]
      setTeams(list)
      if (editSelectedMatch.lastPlayerTeam) {
        fetchPlayers(editSelectedMatch.lastPlayerTeam?.id)
      }

      setValue('homeTeam', editSelectedMatch.teamHome.name)
      setValue('awayTeam', editSelectedMatch.teamAway.name)
      const dateValue = getDefaultValueDate()
      if (dateValue) {
        setAccrualDateTime(dateValue)
        setValue('dateTime', dateValue)
      }
      if (editSelectedMatch.lastPlayerTeam) {
        setShouldSelectTeamLastPlayer(true)
        setSelectedTeam(editSelectedMatch.lastPlayerTeam.id)
      } else {
        setShouldSelectTeamLastPlayer(false)
      }

      if (editSelectedMatch.lastPlayerTeam) {
        setValue('lastPlayerTeam', editSelectedMatch.lastPlayerTeam?.id)
      }
      if (editSelectedMatch?.players) {
        setPlayers(editSelectedMatch?.players)
      }
    }
  }, [editSelectedMatch, setValue])
  const getDefaultValueDate = (): CalendarDateTime | null => {
    if (editSelectedMatch?.date) {
      const dateTime = DateTime.fromISO(editSelectedMatch.date, {
        zone: 'America/Sao_Paulo',
      })

      const isoString = dateTime.toISO()
      if (isoString) {
        return parseDateTime(isoString.substring(0, 16))
      }
    }
    return null
  }

  async function handleEdit(data: IFormInput) {
    /**
     * Verifica se campo dateTime foi alterado, se foi, realiza chamada a API pra atualização
     */
    let hasCallUpdateDate = false
    if (data.dateTime && accrualDateTime) {
      const currentDateTime = DateTime.fromJSDate(
        new Date(data.dateTime.toString()),
      )
      const accrualDateTimeFormated = DateTime.fromJSDate(
        new Date(accrualDateTime.toString()),
      )
      if (!currentDateTime.equals(accrualDateTimeFormated)) {
        if (editSelectedMatch?.id) {
          setLoading(true)
          try {
            const { updateDateMatch } = await MatchService()
            await updateDateMatch(
              editSelectedMatch?.id,
              new Date(data.dateTime.toString()),
            )
            hasCallUpdateDate = true
          } catch (error) {
            const customError = handleAxiosError(error)
            toast.error(customError.message)
          } finally {
            setLoading(false)
          }
        }
      }
    }
    /**
     * Fim dateTime
     */

    /**
     * Players
     *
     */

    const playersInput = data.players.filter((item) => item.name !== '')

    if (
      data.lastPlayerTeam &&
      (selectedPlayers.length > 0 || playersInput.length > 0)
    ) {
      const allPlayers: string[] = []
      if (selectedPlayers.length > 0) {
        for (const player of selectedPlayers) {
          allPlayers.push(player)
        }
      }
      if (playersInput.length > 0) {
        for (const player of playersInput) {
          if (player.name) {
            allPlayers.push(player.name)
          }
        }
      }

      if (editSelectedMatch?.id) {
        setLoading(true)
        try {
          const { updatePlayersMatch } = await PlayerService()
          await updatePlayersMatch(
            editSelectedMatch?.id,
            data.lastPlayerTeam,
            allPlayers,
          )
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

    /**
     *
     * Fim players
     */

    if (hasCallUpdateDate) {
      setRefreshRounds(true)
      handleOnClose()
    }
  }

  const onChange = (values: string[]) => {
    setSelectedPlayers(values)

    // handleSelectPlayers(values);
  }

  const handleSelectCheckbox = (value: boolean) => {
    setShouldSelectTeamLastPlayer(value)
    if (value) {
      setSelectedTeam(teams[0].id)
      fetchPlayers(teams[0].id)
      setValue('lastPlayerTeam', teams[0].id)
    } else {
      setSelectedTeam('')
      setValue('lastPlayerTeam', '')
    }
  }

  function handleOnClose() {
    setEditSelectedMatch(undefined)
    setShouldSelectTeamLastPlayer(false)
    setSelectedPlayers([])
    setPlayers([])
    reset()
    setTeams([])
    onClose()
  }

  return (
    <Modal
      scrollBehavior="outside"
      isOpen={isOpen}
      onOpenChange={handleOnClose}
      size="4xl"
      closeButton={<img src="/closeicon.png" alt="close" />}
    >
      <ModalContent className={`bg-[#1F67CE]`}>
        {() => (
          <form onSubmit={handleSubmit(handleEdit)}>
            <ModalHeader className="flex space-x-2 items-center">
              <MdEdit />
              <h1>Editar </h1>
            </ModalHeader>
            <ModalBody className="space-y-2">
              <Controller
                control={control}
                name={'dateTime'}
                render={({ field }) => (
                  <DateInput
                    label="Data e Hora"
                    hideTimeZone
                    hourCycle={24}
                    granularity="minute"
                    {...field}
                    isInvalid={!!errors?.dateTime?.message}
                    errorMessage={errors?.dateTime?.message || ''}
                    // defaultValue={parseZonedDateTime(`${editSelectedMatch?.date.substring(0,16)}[America/Sao_Paulo]`)}
                    // defaultValue={getDefaultValue()}
                  />
                )}
              />
              <Input
                {...register('homeTeam')}
                color="default"
                label="Time casa"
                isDisabled
                defaultValue={editSelectedMatch?.teamHome.name}
              />
              <Input
                {...register('awayTeam')}
                color="default"
                label="Time fora"
                isDisabled
                defaultValue={editSelectedMatch?.teamAway.name}
              />
              {!shouldSelectTeamLastPlayer && (
                <Checkbox
                  classNames={{
                    label: 'text-white',
                  }}
                  defaultChecked={false}
                  defaultSelected={false}
                  onChange={(e) => {
                    handleSelectCheckbox(e.target.checked)
                  }}
                >
                  <p>Adicionar jogadores para palpite de último marcador.</p>
                </Checkbox>
              )}
              {shouldSelectTeamLastPlayer && (
                <>
                  <Select
                    classNames={{ selectorIcon: 'text-black' }}
                    color="default"
                    label="Selecione o time do último marcador"
                    className="w-full"
                    defaultSelectedKeys={[selectedTeam]}
                    {...register('lastPlayerTeam')}
                    onChange={(selectedItems) => {
                      if (!selectedItems.target.value) {
                        setShouldSelectTeamLastPlayer(false)
                      }
                      setSelectedTeam(selectedItems.target.value)
                      setPlayers([])
                      fetchPlayers(selectedItems.target.value)
                      setValue('lastPlayerTeam', selectedItems.target.value)
                      setSelectedPlayers([])
                      setValue('players', [{ name: '' }])
                    }}
                  >
                    {teams?.map((team) => (
                      <SelectItem
                        key={team.id}
                        value={team.id}
                        className="text-black"
                      >
                        {team.name}
                      </SelectItem>
                    ))}
                  </Select>
                  {players.length > 0 && (
                    <Select
                      classNames={{ selectorIcon: 'text-black' }}
                      color="default"
                      label="Selecione os jogadores"
                      className="w-full"
                      selectionMode="multiple"
                      defaultSelectedKeys={(
                        (editSelectedMatch?.lastPlayerTeam?.id ===
                          selectedTeam &&
                          editSelectedMatch.players) ||
                        []
                      ).map((item) => item.name)}
                      onSelectionChange={(keys) =>
                        onChange(Array.from(keys) as string[])
                      }
                    >
                      {(players || []).map((player) => (
                        <SelectItem
                          key={player.name}
                          value={player.name}
                          className="text-black"
                        >
                          {player.name}
                        </SelectItem>
                      ))}
                    </Select>
                  )}

                  <NewPlayerEdit
                    errors={errors}
                    register={register}
                    control={control}
                    setValue={setValue}
                  />
                </>
              )}
            </ModalBody>
            <ModalFooter className="flex flex-col space-y-4">
              <Button
                isDisabled={!!loading}
                type="submit"
                className={`text-[14px] text-white font-bold bg-[#00764B] rounded-full`}
              >
                Salvar
              </Button>
              <Button
                onClick={handleOnClose}
                variant="bordered"
                className={`text-[14px] text-white font-bold bg-[#00764B] rounded-full`}
              >
                Fechar
              </Button>
            </ModalFooter>
          </form>
        )}
      </ModalContent>
    </Modal>
  )
}
