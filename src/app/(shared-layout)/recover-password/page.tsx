'use client'
import React from 'react'
import { Button, Input, useDisclosure } from '@nextui-org/react'
import RecoverPasswordModal from '@/app/components/RecoverPasswordModal/RecoverPasswordModal'
import InputMask from 'react-input-mask'
import { yupResolver } from '@hookform/resolvers/yup'
import { Controller, useForm } from 'react-hook-form'
import { recoverPasswordSchema } from '@/schemas/recover-password'
import { useState } from 'react'

import toast from 'react-hot-toast'
import { resetPasswordValidateCode } from './actions'

export default function RecoverPassword() {
  const { isOpen, onOpen, onOpenChange } = useDisclosure()
  const [loading, setLoading] = useState(false)
  const [phone, setPhone] = useState<string>('')
  const [userIdForgotPassword, setUserIdForgotPassword] = useState<string>('')

  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<IRecoverPassword>({
    resolver: yupResolver(recoverPasswordSchema),
    mode: 'onSubmit',
    shouldFocusError: false,
  })

  const handleRecoverPassword = async (data: IRecoverPassword) => {
    setLoading(true)
    data.phone =
      '55' + data.phone.replace('(', '').replace(')', '').replace('-', '')
    setPhone(data.phone)

    const { isError, error, userId } = await resetPasswordValidateCode(
      data.phone,
    )

    if (userId) {
      setUserIdForgotPassword(userId)
    }

    setLoading(false)

    if (error) {
      toast.error(error)
    }

    if (isError === false) {
      onOpen()
    }
  }

  return (
    <div className="h-screen -mb-[148px] w-screen bg-[#1F67CE] flex flex-col">
      <h1 className={` mt-10 text-center text-[18px] font-bold text-white`}>
        Esqueceu a senha?
      </h1>
      <p className={` text-center text-[12px] font-normal text-white my-2`}>
        Insira o número do celular cadastrado na sua conta, que te enviaremos um
        código SMS para redefinição da senha.
      </p>
      <form
        className="flex flex-col w-[90%] mx-auto"
        onSubmit={handleSubmit(handleRecoverPassword)}
      >
        <label htmlFor={'phone'} className="text-[#CCFFFFFF] text-sm mb-1 mt-2">
          Celular <span className="text-[#DA1414]">*</span>
        </label>
        <Controller
          control={control}
          name={'phone'}
          defaultValue=""
          render={({ field }) => (
            <InputMask mask={'(99)99999-9999'} {...field} type="text">
              <Input
                placeholder={'(99)99999-9999'}
                size="md"
                type="tel"
                labelPlacement="inside"
                errorMessage={errors.phone?.message}
                isInvalid={!!errors.phone?.message}
                color={errors.phone?.message ? 'danger' : undefined}
                variant={errors.phone?.message ? 'bordered' : undefined}
              />
            </InputMask>
          )}
        />

        <Button
          type="submit"
          isLoading={loading}
          className={`mt-6 rounded-3xl bg-[#00409F] text-white text-[14px] `}
        >
          Enviar SMS de redefinição
        </Button>
      </form>
      <RecoverPasswordModal
        isOpen={isOpen}
        onClose={onOpenChange}
        phone={phone}
        userId={userIdForgotPassword}
      />
    </div>
  )
}
