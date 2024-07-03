import React from 'react'

import { useEventsContext } from '@/context/EventsContext'
import { schemaTeams } from '@/schemas/team'
import { handleAxiosError } from '@/services/api/error'
import TeamService from '@/services/api/models/teams'
import { yupResolver } from '@hookform/resolvers/yup'
import {
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Input,
  Image,
  Select,
  SelectItem,
  Divider,
} from '@nextui-org/react'
import { useEffect, useState } from 'react'
import { useFieldArray, useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { MdAddCircleOutline, MdOutlineRemoveCircle } from 'react-icons/md'

interface CloseButtonprops {
  onClose: () => void
}

export default function CreateTeamsModal({ onClose }: CloseButtonprops) {
  const [isDisabledButton, setIsDisabledButton] = useState<boolean>(false)
  const [shouldDisableAddNewTeam, setShouldDisableAddNewTeam] = useState(true)
  const {
    handleNextModal,
    handlePreviousModal,
    currentModalIndex,
    handleSetSelectedTeams,
    selectedTeams,
  } = useEventsContext()
  const [teams, setTeams] = useState<ITeam[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (
      (selectedTeams.length === 0 || selectedTeams.length === 1) &&
      shouldDisableAddNewTeam
    ) {
      setIsDisabledButton(true)
    } else {
      setIsDisabledButton(false)
    }
  }, [selectedTeams, shouldDisableAddNewTeam])

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<INewTeamsForm>({
    resolver: yupResolver(schemaTeams),
    mode: 'onSubmit',
    shouldFocusError: false,
    defaultValues: {
      names: [{ name: '' }],
    },
  })

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'names',
  })

  useEffect(() => {
    if (shouldDisableAddNewTeam) reset()
  }, [shouldDisableAddNewTeam])

  useEffect(() => {
    if (currentModalIndex === 2) handleFetchTeams()
  }, [currentModalIndex])

  async function handleFetchTeams() {
    setLoading(true)
    try {
      const { fetchTeams } = await TeamService()
      const response = await fetchTeams()
      setTeams(response)
    } catch (error) {
      const customError = handleAxiosError(error)
      toast.error(customError.message)
    } finally {
      setLoading(false)
    }
  }

  const handleCreateTeams = async (data: INewTeamsForm) => {
    setLoading(true)
    const newTeams: ITeam[] = []
    const { create } = await TeamService()
    for (const team of data.names) {
      try {
        const isExist = selectedTeams.find((item) => item.name === team.name)
        if (!isExist) {
          const response = await create({ name: team.name })
          newTeams.push({
            id: response.teamId,
            name: response.teamName,
          })
        }
      } catch (error) {
        const customError = handleAxiosError(error)
        toast.error(
          `'Ocorreu o seguinte erro na criação do time ${team.name}: '${customError.message}`,
        )
      }
    }
    selectedTeams.map((item) => {
      newTeams.push({
        id: item.id,
        name: item.name,
        // selected: item.selected,
      })
    })
    handleSetSelectedTeams(newTeams)
    setLoading(false)
    if (newTeams.length <= 1) {
      toast.error('Adicione pelo menos dois times.')
    } else {
      handleNextModal()
    }
  }

  const handleSelectTeams = (selectedIds: string[]) => {
    const selectedTeams = selectedIds
      .map((id) => {
        const team = teams.find((team) => team.id === id)
        return team ? { id: team.id, name: team.name, selected: false } : null
      })
      .filter(Boolean) as ITeam[]
    handleSetSelectedTeams(selectedTeams)
  }
  const onChange = (values: string[]) => {
    handleSelectTeams(values)
  }

  return (
    <>
      <ModalHeader className="flex space-x-2 items-center">
        <Image src="/sportsicon.png" alt="stadium icon" />
        <h1>3. Times </h1>
      </ModalHeader>
      <form onSubmit={handleSubmit(handleCreateTeams)}>
        <ModalBody className="space-y-2">
          <p>
            Lorem ipsum dolor sit amet consectetur. Nulla ac nisl pellentesque
            netus diam. Vel urna mattis.
          </p>
          {teams?.length > 0 && (
            <Select
              classNames={{
                selectorIcon: 'text-black',
              }}
              defaultSelectedKeys={selectedTeams.map((item) => item.id) || ''}
              color="default"
              label="Selecione os times"
              className="w-full"
              selectionMode="multiple"
              onSelectionChange={(keys) =>
                onChange(Array.from(keys) as string[])
              }
            >
              {teams.map((team) => (
                <SelectItem
                  key={team.id}
                  value={team.id}
                  className="text-black"
                >
                  {team.name}
                </SelectItem>
              ))}
            </Select>
          )}
          <div className="space-y-5">
            {fields.map((field, index) => (
              <div key={field.id} className="flex space-x-2 items-center">
                {shouldDisableAddNewTeam ? (
                  <Button
                    className={`min-w-[1rem] bg-[#fff]`}
                    onClick={() =>
                      setShouldDisableAddNewTeam(!shouldDisableAddNewTeam)
                    }
                  >
                    <MdAddCircleOutline className="text-[#1F66CE] text-[16px]" />
                  </Button>
                ) : (
                  <Button
                    className={`min-w-[1rem] bg-[#E40000]`}
                    onClick={() =>
                      fields.length === 1
                        ? setShouldDisableAddNewTeam(true)
                        : remove(index)
                    }
                  >
                    <MdOutlineRemoveCircle className="text-[#fff]" />
                  </Button>
                )}

                <Input
                  type="text"
                  isDisabled={index === 0 && shouldDisableAddNewTeam}
                  placeholder={`Nome novo time ${index + 1}`}
                  errorMessage={
                    errors?.names && errors?.names[index]?.name?.message
                  }
                  isInvalid={
                    errors?.names && !!errors?.names[index]?.name?.message
                  }
                  color={
                    errors?.names && errors?.names[index]?.name?.message
                      ? 'danger'
                      : undefined
                  }
                  variant={
                    errors?.names && errors?.names[index]?.name?.message
                      ? 'bordered'
                      : undefined
                  }
                  {...register(`names.${index}.name`)}
                />
              </div>
            ))}
            {!shouldDisableAddNewTeam && (
              <Button
                type="button"
                onClick={() => append({ name: '' })}
                variant="bordered"
                className={`text-[14px] text-white font-bold border-white rounded-full w-full`}
              >
                Adicionar novo time
              </Button>
            )}
          </div>
          <Divider className="my-4 bg-[#FFFFFF]" />
        </ModalBody>

        <ModalFooter className="flex flex-col space-y-4">
          {selectedTeams.length > 0 && shouldDisableAddNewTeam ? (
            <Button
              isDisabled={isDisabledButton || !!loading}
              onClick={handleNextModal}
              type="button"
              className={`text-[14px] text-white font-bold bg-[#00764B] rounded-full`}
            >
              Avançar
            </Button>
          ) : (
            <Button
              isDisabled={isDisabledButton}
              // onClick={handleNextModal}
              type="submit"
              className={`text-[14px] text-white font-bold bg-[#00764B] rounded-full`}
            >
              Avançar
            </Button>
          )}

          <Button
            onClick={handlePreviousModal}
            variant="bordered"
            className={`text-[14px] text-white font-bold border-white rounded-full`}
          >
            Voltar
          </Button>
          <Button
            onPress={onClose}
            className={`text-[14px] text-white font-bold bg-[#E40000] rounded-full`}
          >
            Fechar
          </Button>
        </ModalFooter>
      </form>
    </>
  )
}
