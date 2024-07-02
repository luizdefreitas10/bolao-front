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
} from '@nextui-org/react'
import { useEventsContext } from '@/context/EventsContext'
import toast from 'react-hot-toast'
import { handleAxiosError } from '@/services/api/error'
import RoundService from '@/services/api/models/round'
import MatchService from '@/services/api/models/match'
import { matchesSchema } from '@/schemas/match'

interface IFormInput {
  matches: {
    homeTeam: string
    awayTeam: string
    round: string
    dateTime: DateValue
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
  } = useEventsContext()

  const [rounds, setRounds] = useState<IRound[]>([])
  const [loading, setLoading] = useState(false)

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<IFormInput>({
    resolver: yupResolver(matchesSchema) as any,
    defaultValues: {
      matches: Array(calculatePairs()).fill({
        homeTeam: '',
        awayTeam: '',
        round: selectedRound,
        dateTime: null,
      }),
    },
  })

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'matches',
  })

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

    setLoading(true)
    let wasError = false
    for (const match of data.matches) {
      try {
        const { create } = await MatchService()
        const response = await create({
          date: new Date(match.dateTime.toString()),
          roundId: match.round,
          teamIdAway: match.awayTeam,
          teamIdHome: match.homeTeam,
        })
        // console.log(response);
      } catch (error) {
        wasError = true
        const customError = handleAxiosError(error)
        toast.error(customError.message)
      }
    }
    setLoading(false)
    if (!wasError) {
      onClose()
      setCurrentModalIndex(0)
    }
  }

  function calculatePairs(): number {
    return Math.floor(selectedTeams.length / 2)
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
          {fields.map((field, index) => (
            <div className="space-y-4" key={field.id}>
              <h1>{`Partida ${index + 1}`}</h1>
              <Select
                {...register(`matches.${index}.round`)}
                classNames={{
                  selectorIcon: 'text-black',
                }}
                isInvalid={
                  !!(errors?.matches && errors?.matches[index]?.round?.message)
                }
                errorMessage={
                  (errors?.matches && errors?.matches[index]?.round?.message) ||
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
                    errors?.matches && errors?.matches[index]?.homeTeam?.message
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
                    errors?.matches && errors?.matches[index]?.awayTeam?.message
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
            </div>
          ))}
        </div>
      </ModalBody>
      <ModalFooter className="flex flex-col space-y-4">
        <Button
          type="submit"
          className={`text-[14px] text-white font-bold bg-[#00764B] rounded-full`}
        >
          Avançar
        </Button>
        <Button
          onClick={handlePreviousModal}
          variant="bordered"
          className={`text-[14px] text-white font-bold border-white rounded-full`}
        >
          Voltar
        </Button>
        <Button
          onClick={onClose}
          className={`text-[14px] text-white font-bold bg-[#E40000] rounded-full`}
        >
          Fechar
        </Button>
      </ModalFooter>
    </form>
  )
}
