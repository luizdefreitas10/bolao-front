'use client'

import React from 'react'
import { useForm, useFieldArray, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { useEffect, useState } from 'react'
import {
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Select,
  SelectItem,
  Image,
  DateInput,
  DateValue,
  Checkbox,
} from '@nextui-org/react'
import { useEventsContext } from '@/context/EventsContext'
import toast from 'react-hot-toast'
import { handleAxiosError } from '@/services/api/error'
import RoundService from '@/services/api/models/round'
import MatchService from '@/services/api/models/match'
import { matchesSchema } from '@/schemas/match'
import PlayerService from '@/services/api/models/players'
import { NewPlayer } from '../NewPlayer/NewPlayer'

export interface IFormInput {
  matches: {
    homeTeam: string
    awayTeam: string
    round: string
    dateTime: DateValue
    lastPlayerCheckbox: boolean
    lastPlayerTeam: string
    players: { name: string }[]
    selectedPlayers: string
  }[]
}

interface CloseButtonProps {
  onClose: () => void
}

export default function CreateMatchesModal({ onClose }: CloseButtonProps) {
  const {
    handlePreviousModal,
    selectedTeams,
    currentModalIndex,
    selectedChampionship,
    setCurrentModalIndex,
    selectedRound,
    setRefreshRounds,
  } = useEventsContext()

  const [players, setPlayers] = useState<{ [key: number]: IPlayer[] }>({})

  const [rounds, setRounds] = useState<IRound[]>([])
  const [loading, setLoading] = useState(false)
  const [shouldGetPlayers, setShouldGetPlayers] = useState(false)

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
    getValues,
    setError,
    watch,
    clearErrors,
    setValue,
  } = useForm<IFormInput>({
    mode: 'onChange',
    resolver: yupResolver(matchesSchema) as any,

    defaultValues: {
      matches: Array(calculatePairs()).fill({
        homeTeam: '',
        awayTeam: '',
        round: selectedRound,
        dateTime: null,
        lastPlayerTeam: '',
        lastPlayerCheckbox: false,
        selectedPlayers: [],
        players: [{ name: '' }],
      }),
    },
  })

  const { fields } = useFieldArray({
    control,
    name: 'matches',
  })

  const watchCheckboxes = watch('matches')

  useEffect(() => {
    watchCheckboxes.forEach((match, index) => {
      if (
        match.lastPlayerCheckbox &&
        !getValues(`matches.${index}.lastPlayerTeam`)
      ) {
        setError(`matches.${index}.lastPlayerTeam`, {
          type: 'required',
          message: 'Selecione o time do último marcador',
        })
      } else {
        clearErrors(`matches.${index}.lastPlayerTeam`)
      }
    })
  }, [watchCheckboxes, setError, clearErrors, getValues])

  useEffect(() => {
    if (currentModalIndex === 3) fetchRounds()
  }, [currentModalIndex])

  const fetchRounds = async () => {
    if (selectedChampionship) {
      setLoading(true)
      try {
        const { fetchRoundsByStatusAndChampionship } = await RoundService()
        const response = await fetchRoundsByStatusAndChampionship(
          selectedChampionship,
          'WAITING',
        )
        setRounds(response)
      } catch (error) {
        const customError = handleAxiosError(error)
        toast.error(customError.message)
      } finally {
        setLoading(false)
      }
    } else {
      toast.error('Necessário criar um campeonato.')
      setCurrentModalIndex(0)
    }
  }

  const fetchPlayers = async (index: number, teamId: string) => {
    if (teamId) {
      setLoading(true)
      try {
        const { fetchPlayersByTeam } = await PlayerService()
        const response = await fetchPlayersByTeam(teamId)
        return response
      } catch (error) {
        const customError = handleAxiosError(error)
        toast.error(customError.message)
      } finally {
        setLoading(false)
      }
    }
  }

  useEffect(() => {
    if (shouldGetPlayers) {
      fields.forEach((field, index) => {
        const teamId = watch(`matches.${index}.lastPlayerTeam`)
        if (teamId) {
          setLoading(true)
          fetchPlayers(index, teamId)
            .then((result) => {
              setPlayers((prev) => ({ ...prev, [index]: result || [] }))
            })
            .catch((error) => {
              const customError = handleAxiosError(error)
              toast.error(customError.message)
            })
            .finally(() => setLoading(false))
        }
      })
    }
    setShouldGetPlayers(false)
  }, [fields, watch, shouldGetPlayers])

  function isArrayEmptyOrAllItemsEmpty(array: { name: string }[]) {
    if (array.length === 0) {
      return true
    }

    return array.every((item) => !item.name)
  }

  const onSubmit = async (data: IFormInput) => {
    const seenTeams = new Set<string>()
    let duplicateFound = false

    for (const match of data.matches) {
      const key = `${match.homeTeam}-${match.round}`
      const reverseKey = `${match.awayTeam}-${match.round}`

      if (seenTeams.has(key) || seenTeams.has(reverseKey)) {
        duplicateFound = true
        break
      }

      seenTeams.add(key)
      seenTeams.add(reverseKey)
    }

    if (duplicateFound) {
      toast.error(`Existem times repetidos na mesma rodada.`)
      return
    }

    let hasError = false
    const { create } = await MatchService()
    const { create: createPlayer } = await PlayerService()
    for (const match of data.matches) {
      const index = data.matches.findIndex(
        (item) => item.lastPlayerTeam === match.lastPlayerTeam,
      )

      const selectedPlayers = getValues(`matches.${index}.selectedPlayers`)
      const listSelectedPlayers =
        selectedPlayers && typeof selectedPlayers === 'string'
          ? selectedPlayers.split(',')
          : []

      // verifica se existe players selecionados ou adicionados via input
      const lastPlayerTeamId =
        match.lastPlayerTeam &&
        (!isArrayEmptyOrAllItemsEmpty(match.players) ||
          listSelectedPlayers.length > 0)
          ? match.lastPlayerTeam
          : undefined
      setLoading(true)
      try {
        const response = await create({
          date: new Date(match.dateTime.toString()),
          roundId: match.round,
          teamIdAway: match.awayTeam,
          teamIdHome: match.homeTeam,
          lastPlayerTeamId: lastPlayerTeamId,
        })
        if (match.players.length > 0 && response.matchId) {
          for (const player of match.players) {
            if (player.name) {
              await createPlayer({
                matchId: response.matchId,
                name: player.name,
                teamId: match.lastPlayerTeam,
              })
            }
          }
          for (const player of listSelectedPlayers) {
            const playerExist = players[index].find(
              (item) => item.id === player,
            )
            if (playerExist?.name) {
              await createPlayer({
                matchId: response.matchId,
                name: playerExist.name,
                teamId: match.lastPlayerTeam,
              })
            }
          }
        }
      } catch (error) {
        hasError = true
        const customError = handleAxiosError(error)
        toast.error(customError.message)
      }
    }
    setLoading(false)
    if (!hasError) {
      onClose()
      setCurrentModalIndex(0)
      setRefreshRounds(true)
    }
  }

  function calculatePairs(): number {
    return Math.floor(selectedTeams.length / 2)
  }

  function nameTeams(id: string) {
    const team = selectedTeams.find((item) => item.id === id)

    return team?.name || null
  }

  function isFormValid(index: number) {
    const homeTeam = watch(`matches.${index}`).homeTeam
    const awayTeam = watch(`matches.${index}`).awayTeam
    const dateTime = watch(`matches.${index}`).dateTime
    const round = watch(`matches.${index}`).round

    if (homeTeam && awayTeam && dateTime && round) {
      return true
    } else {
      return false
    }
  }

  function handleSelectCheckbox(index: number, value: boolean) {
    if (isFormValid(index)) {
      setValue(`matches.${index}.lastPlayerCheckbox`, value)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <ModalHeader className="flex space-x-2 items-center">
        <Image src="/sportsicon.png" alt="stadium icon" />
        <h1>4. Partidas </h1>
      </ModalHeader>
      <ModalBody className="space-y-2">
        <p>
          Lorem ipsum dolor sit amet consectetur. Nulla ac nisl pellentesque
          netus diam. Vel urna mattis.
        </p>
        <div className="space-y-10">
          {fields.map((field, index) => {
            const watchCheckbox = watch(`matches.${index}.lastPlayerCheckbox`)
            const teamsLastPlayer = [
              getValues(`matches.${index}.homeTeam`),
              getValues(`matches.${index}.awayTeam`),
            ]
            return (
              <div className="space-y-4" key={field.id}>
                <h1>{`Partida ${index + 1}`}</h1>
                <Select
                  {...register(`matches.${index}.round`)}
                  classNames={{
                    selectorIcon: 'text-black',
                  }}
                  isInvalid={
                    !!(
                      errors?.matches && errors?.matches[index]?.round?.message
                    )
                  }
                  errorMessage={
                    (errors?.matches &&
                      errors?.matches[index]?.round?.message) ||
                    ''
                  }
                  color="default"
                  label="Selecione a rodada"
                  defaultSelectedKeys={[selectedRound || '']}
                >
                  {rounds.map((item) => (
                    <SelectItem
                      key={item.id}
                      value={item.id}
                      className="text-black"
                    >
                      {item.name}
                    </SelectItem>
                  ))}
                </Select>

                <Controller
                  control={control}
                  name={`matches.${index}.dateTime`}
                  render={({ field }) => (
                    <DateInput
                      label="Data e Hora"
                      hideTimeZone
                      hourCycle={24}
                      granularity="minute"
                      {...field}
                      isInvalid={!!errors?.matches?.[index]?.dateTime?.message}
                      errorMessage={
                        errors?.matches?.[index]?.dateTime?.message || ''
                      }
                    />
                  )}
                />
                <Select
                  {...register(`matches.${index}.homeTeam`)}
                  classNames={{
                    selectorIcon: 'text-black',
                  }}
                  color="default"
                  label="Selecione o time da casa"
                  isInvalid={
                    !!(
                      errors?.matches &&
                      errors?.matches[index]?.homeTeam?.message
                    )
                  }
                  errorMessage={
                    (errors?.matches &&
                      errors?.matches[index]?.homeTeam?.message) ||
                    ''
                  }
                >
                  {selectedTeams.map((team) => (
                    <SelectItem
                      key={team.id}
                      value={team.id}
                      className="text-black"
                    >
                      {team.name}
                    </SelectItem>
                  ))}
                </Select>

                <Select
                  {...register(`matches.${index}.awayTeam`)}
                  classNames={{
                    selectorIcon: 'text-black',
                  }}
                  color="default"
                  label="Selecione o time visitante"
                  isInvalid={
                    !!(
                      errors?.matches &&
                      errors?.matches[index]?.awayTeam?.message
                    )
                  }
                  errorMessage={
                    (errors?.matches &&
                      errors?.matches[index]?.awayTeam?.message) ||
                    ''
                  }
                >
                  {selectedTeams.map((team) => (
                    <SelectItem
                      key={team.id}
                      value={team.id}
                      className="text-black"
                    >
                      {team.name}
                    </SelectItem>
                  ))}
                </Select>
                <div className="flex flex-col gap-4">
                  <Checkbox
                    {...register(
                      `matches.${index}.lastPlayerCheckbox` as const,
                    )}
                    isDisabled={!isFormValid(index)}
                    classNames={{
                      label: 'text-white',
                    }}
                    defaultChecked={watch(
                      `matches.${index}.lastPlayerCheckbox`,
                    )}
                    onChange={(e) =>
                      handleSelectCheckbox(
                        index,
                        e.target.checked ? true : false,
                      )
                    }
                  >
                    <p>Adicionar jogadores para palpite de último marcador.</p>
                  </Checkbox>
                  {watchCheckbox && (
                    <>
                      <Controller
                        name={`matches.${index}.lastPlayerTeam`}
                        control={control}
                        // rules={{
                        //   required: watchCheckbox
                        //     ? "Selecione o time do último marcador"
                        //     : false,
                        // }}
                        render={({ field: { onChange } }) => (
                          <Select
                            {...field}
                            classNames={{
                              selectorIcon: 'text-black',
                            }}
                            isInvalid={
                              !!(
                                errors?.matches &&
                                errors?.matches[index]?.lastPlayerTeam?.message
                              )
                            }
                            errorMessage={
                              (errors?.matches &&
                                errors?.matches[index]?.lastPlayerTeam
                                  ?.message) ||
                              ''
                            }
                            defaultSelectedKeys={
                              [getValues(`matches.${index}.lastPlayerTeam`)] ||
                              ''
                            }
                            color="default"
                            label="Selecione o time do último marcador"
                            onChange={(e) => {
                              setValue(`matches.${index}.selectedPlayers`, '')
                              setShouldGetPlayers(true)
                              onChange(e.target.value)
                            }}

                            // }
                          >
                            {teamsLastPlayer.map((team) => (
                              <SelectItem
                                key={team}
                                value={team}
                                className="text-black"
                              >
                                {nameTeams(team)}
                              </SelectItem>
                            ))}
                          </Select>
                        )}
                      />

                      {watch(`matches.${index}`).lastPlayerTeam && (
                        <>
                          {players[index]?.length > 0 && (
                            <Select
                              classNames={{ selectorIcon: 'text-black' }}
                              color="default"
                              label="Selecione os jogadores"
                              className="w-full"
                              selectionMode="multiple"
                              // defaultSelectedKeys={
                              //   (selectedPlayers &&
                              //     selectedPlayers?.length > 0 &&
                              //     selectedPlayers?.map((item) => item.id) || "")

                              // }
                              {...register(
                                `matches.${index}.selectedPlayers` as const,
                              )}
                            >
                              {players[index]?.map((player) => (
                                <SelectItem
                                  key={player.id}
                                  value={player.id}
                                  className="text-black"
                                >
                                  {player.name}
                                </SelectItem>
                              ))}
                            </Select>
                          )}

                          <NewPlayer
                            errors={errors}
                            matchId={index}
                            register={register}
                            control={control}
                            setValue={setValue}
                          />
                        </>
                      )}
                    </>
                  )}
                </div>
              </div>
            )
          })}
        </div>
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
          onClick={handlePreviousModal}
          variant="bordered"
          className={`text-[14px] text-white font-bold bg-[#00764B] rounded-full`}
        >
          Voltar
        </Button>
      </ModalFooter>
    </form>
  )
}
