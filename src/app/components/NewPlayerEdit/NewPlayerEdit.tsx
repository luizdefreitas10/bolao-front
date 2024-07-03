import { Button, Input } from '@nextui-org/react'
import React, { useEffect, useState } from 'react'
import { FieldErrors, UseFormSetValue, useFieldArray } from 'react-hook-form'
import { Control, UseFormRegister } from 'react-hook-form'
import { MdAddCircleOutline, MdOutlineRemoveCircle } from 'react-icons/md'
import { IFormInput } from '../EditMatch/EditMatch'

interface NewPlayerProps {
  register: UseFormRegister<any>
  control?: Control<any, any>
  errors: FieldErrors<IFormInput>
  setValue: UseFormSetValue<IFormInput>
}

export function NewPlayerEdit({
  control,
  register,
  errors,
  setValue,
}: NewPlayerProps) {
  const [shouldDisableAddNewTeam, setShouldDisableAddNewTeam] = useState(true)
  const { fields, remove, append, update } = useFieldArray({
    control,
    name: `players`,
  })

  useEffect(() => {
    if (shouldDisableAddNewTeam) {
      update(0, '')
      setValue(`players.${0}.name`, '')
      remove(0)
      append({ name: '' })
    }
  }, [shouldDisableAddNewTeam])

  const addPlayer = () => {
    append({
      name: '',
    })
  }

  return (
    <>
      {fields.map((player, indexPlayers) => (
        <div key={indexPlayers} className="flex space-x-2 items-center">
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
                  : remove(indexPlayers)
              }
            >
              <MdOutlineRemoveCircle className="text-[#fff]" />
            </Button>
          )}
          <Input
            type="text"
            isDisabled={indexPlayers === 0 && shouldDisableAddNewTeam}
            placeholder={`Nome novo jogador ${indexPlayers + 1}`}
            isInvalid={
              !!(errors.players && errors.players[indexPlayers]?.message)
            }
            errorMessage={
              (errors.players && errors.players[indexPlayers]?.message) || ''
            }
            color={
              errors.players && errors.players[indexPlayers]?.message
                ? 'danger'
                : undefined
            }
            variant={
              errors.players && errors.players[indexPlayers]?.message
                ? 'bordered'
                : undefined
            }
            {...register(`players.${indexPlayers}.name`)}
          />
        </div>
      ))}
      {!shouldDisableAddNewTeam && (
        <Button
          type="button"
          variant="bordered"
          className={`text-[14px] text-white font-bold border-white rounded-full w-full`}
          onClick={() => addPlayer()}
        >
          Novo Jogador
        </Button>
      )}
    </>
  )
}
