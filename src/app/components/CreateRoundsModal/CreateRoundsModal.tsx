import { useEventsContext } from '@/context/EventsContext'
import { schemaRound } from '@/schemas/round'
import { yupResolver } from '@hookform/resolvers/yup'
import {
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Input,
  Image,
} from '@nextui-org/react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'

interface CloseButtonprops {
  onClose: () => void
}

export default function CreateRoundsModal({ onClose }: CloseButtonprops) {
  const [isDisabledButton, setIsDisabledButton] = useState<boolean>(false)
  const { handleNextModal, handlePreviousModal, selectedChampionship } =
    useEventsContext()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<INewRoundForm>({
    resolver: yupResolver(schemaRound),
    mode: 'onSubmit',
    shouldFocusError: false,
  })

  const handleCreateRound = (data: INewRoundForm) => {
    handleNextModal()
    console.log(data)
  }

  return (
    <>
      <ModalHeader className="flex space-x-2 items-center">
        <Image src="/stadiumicon.svg" alt="stadium icon" />
        <h1>2. Rodadas </h1>
      </ModalHeader>
      <form onSubmit={handleSubmit(handleCreateRound)}>
        <ModalBody className="space-y-2">
          <p>
            Lorem ipsum dolor sit amet consectetur. Nulla ac nisl pellentesque
            netus diam. Vel urna mattis.
          </p>

          <Input
            type="text"
            size="md"
            label="Nome da rodada"
            placeholder="Ex: 11ª Rodada"
            errorMessage={errors.name?.message}
            isInvalid={!!errors.name?.message}
            color={errors.name?.message ? 'danger' : undefined}
            variant={errors.name?.message ? 'bordered' : undefined}
            // onChange={(e) => handleInputChange(e)}
            {...register('name')}
          />
        </ModalBody>
        <ModalFooter className="flex flex-col space-y-4">
          <Button
            isDisabled={isDisabledButton}
            // onClick={handleNextModal}
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
