import { useEventsContext } from '@/context/EventsContext'
import { schemaTeams } from '@/schemas/team'
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
} from '@nextui-org/react'
import { useState } from 'react'
import { useFieldArray, useForm } from 'react-hook-form'

interface CloseButtonprops {
  onClose: () => void
}

export default function CreateTeamsModal({ onClose }: CloseButtonprops) {
  const [isDisabledButton, setIsDisabledButton] = useState<boolean>(false)
  const { handleNextModal, handlePreviousModal } = useEventsContext()

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<INewTeams>({
    resolver: yupResolver(schemaTeams),
    mode: 'onSubmit',
    shouldFocusError: false,
    defaultValues: {
      names: [{ name: '' }, { name: '' }], // Dois inputs por padrão
    },
  })

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'names',
  })

  // const teamsInputLabels = [
  //   'Time 1',
  //   'Time 2',
  //   'Time 3',
  //   'Time 4',
  //   'Time 5',
  //   'Time 6',
  //   'Time 7',
  //   'Time 8',
  // ]

  const handleCreateTeams = (data: INewTeams) => {
    console.log(data)
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
          <Select
            // onChange={(e) => setSelectedChampionship(e.target.value)}
            classNames={{
              selectorIcon: 'text-black',
            }}
            color="default"
            label="Selecione o campeonato"
            className="w-full"
            selectionMode="multiple"
          >
            <SelectItem key={1} value={1} className="text-black">
              {1}
            </SelectItem>
            <SelectItem key={2} value={2} className="text-black">
              {2}
            </SelectItem>
            {/* {championships.map((championship) => (
                <SelectItem
                  key={championship.id}
                  value={championship.id}
                  className="text-black"
                >
                  {championship.name}
                </SelectItem>
              ))} */}
          </Select>
          <div className="space-y-10">
            {fields.map((field, index) => (
              <div key={field.id} className="flex space-x-2 items-center">
                <Input
                  type="text"
                  placeholder={`Nome ${index + 1}`}
                  {...register(`names.${index}.name`)}
                  className={`border ${errors.names?.[index]?.name ? 'border-red-500' : 'border-gray-300'}`}
                />
                {index > 1 && (
                  <Button
                    type="button"
                    onClick={() => remove(index)}
                    className="bg-red-500 text-white"
                  >
                    Remover
                  </Button>
                )}
                {errors.names?.[index]?.name && (
                  <span className="text-red-500 text-sm">
                    {errors?.names[index]?.name?.message}
                  </span>
                )}
              </div>
            ))}
            {/* {teamsInputLabels.map((label) => (
            <Input
              key={label}
              label={<label className="text-white font-bold">{label}</label>}
              placeholder="Nome do time"
              labelPlacement="outside"
              type="text"
            />
          ))} */}
          </div>
        </ModalBody>
        <ModalFooter className="flex flex-col space-y-4">
          <Button
            type="button"
            onClick={() => append({ name: '' })}
            className="bg-blue-500 text-white"
          >
            Adicionar
          </Button>
          <Button
            isDisabled={isDisabledButton}
            onClick={handleNextModal}
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
