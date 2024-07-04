import React from 'react'
import { useEventsContext } from '@/context/EventsContext'
import { schemaChampionship } from '@/schemas/championship'
import { handleAxiosError } from '@/services/api/error'
import ChampionshipService from '@/services/api/models/championship'
import { yupResolver } from '@hookform/resolvers/yup'
import {
  ModalHeader,
  ModalBody,
  Select,
  SelectItem,
  Checkbox,
  ModalFooter,
  Button,
  Input,
  Image,
} from '@nextui-org/react'
import { Open_Sans as OpenSans } from 'next/font/google'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'

const fontOpenSans = OpenSans({ subsets: ['latin'] })

interface CloseButtonprops {
  onClose: () => void
}

export default function CreateChampionshipModal({ onClose }: CloseButtonprops) {
  const [isDisabledButton, setIsDisabledButton] = useState<boolean>(true)
  const [championships, setChampionships] = useState<IChampionship[]>([])
  const [loading, setLoading] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<INewChampionship>({
    resolver: yupResolver(schemaChampionship),
    mode: 'onSubmit',
    shouldFocusError: false,
  })

  const {
    setSelectedChampionship,
    setIsDisabledInput,
    isDisabledInput,
    isDisabledCheckbox,
    handleNextModal,
    selectedChampionship,
    currentModalIndex,
  } = useEventsContext()

  useEffect(() => {
    if (currentModalIndex === 0) fetchChampionships()
  }, [currentModalIndex])

  useEffect(() => {
    const shouldDisableButton = selectedChampionship === null && isDisabledInput
    setIsDisabledButton(shouldDisableButton)
  }, [selectedChampionship, isDisabledInput])

  async function fetchChampionships() {
    setLoading(true)
    try {
      const { fetchChampionships } = await ChampionshipService()
      const response = await fetchChampionships()
      setChampionships(response)
    } catch (error) {
      const customError = handleAxiosError(error)
      toast.error(customError.message)
    } finally {
      setLoading(false)
    }
  }

  async function handleCreateChampionship(data: INewChampionship) {
    setLoading(true)
    try {
      const { create } = await ChampionshipService()
      const response = await create({ name: data.name })
      setSelectedChampionship(response.id)
      handleNextModal()
      setIsDisabledInput(true)
    } catch (error) {
      const customError = handleAxiosError(error)
      toast.error(customError.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <ModalHeader className="flex space-x-2 items-center">
        <Image src="/trophyicon.svg" alt="trophy icon" />
        <h1>1. Campeonato </h1>
      </ModalHeader>
      <form onSubmit={handleSubmit(handleCreateChampionship)}>
        <ModalBody className="space-y-2">
          <p>
            Lorem ipsum dolor sit amet consectetur. Nulla ac nisl pellentesque
            netus diam. Vel urna mattis.
          </p>
          {championships.length > 0 && (
            <Select
              defaultSelectedKeys={[selectedChampionship || '']}
              onChange={(e) => setSelectedChampionship(e.target.value)}
              classNames={{
                selectorIcon: 'text-black',
              }}
              color="default"
              label="Selecione o campeonato"
              className="w-full"
            >
              {championships.map((championship) => (
                <SelectItem
                  key={championship.id}
                  value={championship.id}
                  className="text-black"
                >
                  {championship.name}
                </SelectItem>
              ))}
            </Select>
          )}

          <Checkbox
            onClick={() => setIsDisabledInput(!isDisabledInput)}
            isDisabled={isDisabledCheckbox}
            size="lg"
            className="text-[12px]"
            classNames={{
              label: 'text-white',
            }}
          >
            Novo campeonato
          </Checkbox>
          {!isDisabledInput && (
            <Input
              isDisabled={isDisabledInput}
              type="text"
              size="md"
              label="Nome do campeonato"
              placeholder="Digite o nome do campeonato"
              errorMessage={errors.name?.message}
              isInvalid={!!errors.name?.message}
              color={errors.name?.message ? 'danger' : undefined}
              variant={errors.name?.message ? 'bordered' : undefined}
              {...register('name')}
              // onChange={(e) => setNewChampionshipName(e.target.value)}
            />
          )}
        </ModalBody>
        <ModalFooter className="flex flex-col space-y-4">
          {selectedChampionship && isDisabledInput ? (
            <Button
              type="button"
              isLoading={loading}
              onClick={() => handleNextModal()}
              isDisabled={isDisabledButton}
              className={`${fontOpenSans.className} text-[14px] text-white font-bold bg-[#00764B] rounded-full`}
            >
              Avançar
            </Button>
          ) : (
            <Button
              type="submit"
              isDisabled={isDisabledButton}
              className={`${fontOpenSans.className} text-[14px] text-white font-bold bg-[#00764B] rounded-full`}
            >
              Avançar
            </Button>
          )}

          <Button
            onPress={onClose}
            className={`${fontOpenSans.className} text-[14px] text-white font-bold bg-[#E40000] rounded-full`}
          >
            Fechar
          </Button>
        </ModalFooter>
      </form>
    </>
  )
}
