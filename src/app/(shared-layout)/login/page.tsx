'use client'
import React, { useState } from 'react'
import { Button, Input, Link, useDisclosure } from '@nextui-org/react'
import { Open_Sans as OpenSans } from 'next/font/google'
import { yupResolver } from '@hookform/resolvers/yup'
import { Controller, useForm } from 'react-hook-form'
import { schemaLogin } from '@/schemas/login'
import { createSession, resendCode } from './actions'
import { toast } from 'react-hot-toast'
import { useAuthContext } from '@/context/AuthContext'
import { EyeSlashFilledIcon } from '@/app/components/EyeSlashFilledIcon/EyeSlashFilledIcon'
import { EyeFilledIcon } from '@/app/components/EyeFilledIcon/EyeFilledIcon'
import InputMask from 'react-input-mask'
import ConfirmationCodeModal from '@/app/components/ConfirmationCodeModal/ConfirmationCodeModal'

const fontOpenSans = OpenSans({ subsets: ['latin'] })

export default function Login() {
  const [isVisible, setIsVisible] = useState<boolean>(false)
  const toggleVisibility = () => setIsVisible(!isVisible)
  const { handleAuthWithToken, handleSetSendCodeProps } = useAuthContext()
  const [loading, setLoading] = useState(false)
  const { isOpen, onOpen, onOpenChange } = useDisclosure()
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<ILogin>({
    resolver: yupResolver(schemaLogin),
    mode: 'onSubmit',
    shouldFocusError: false,
  })

  const handleLogin = async (data: ILogin) => {
    setLoading(true)
    data.phone =
      '55' + data.phone.replace('(', '').replace(')', '').replace('-', '')

    const { access_token, error, phone, userId } = await createSession(data)
    setLoading(false)

    if (error) {
      toast.error(error)
    } else if (access_token) {
      handleAuthWithToken(access_token)
    } else if (phone && userId) {
      handleResendCode(userId)
      handleSetSendCodeProps({ userId, phone })
      onOpen()
    }
  }

  async function handleResendCode(userId: string) {
    await resendCode(userId)
  }

  return (
    <div className="h-full w-screen bg-[#1F67CE] flex flex-col">
      <h1
        className={`${fontOpenSans.className} mt-10 text-center text-[18px] font-bold text-white`}
      >
        Bem-vindo de volta!
      </h1>
      <p
        className={`${fontOpenSans.className} text-center text-[12px] font-normal text-white my-2`}
      >
        Estamos felizes em te ver novamente! Conecte-se e aproveite!
      </p>
      <form
        className="flex flex-col w-[90%] mx-auto"
        onSubmit={handleSubmit(handleLogin)}
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
        <label
          htmlFor={'password'}
          className="text-[#CCFFFFFF] text-sm mb-1 mt-2"
        >
          Senha <span className="text-[#DA1414]">*</span>
        </label>
        <Input
          size="md"
          type={!isVisible ? 'password' : 'text'}
          {...register('password')}
          labelPlacement="inside"
          errorMessage={errors.password?.message}
          isInvalid={!!errors.password?.message}
          placeholder={'Senha'}
          color={errors.password?.message ? 'danger' : undefined}
          variant={errors.password?.message ? 'bordered' : undefined}
          endContent={
            <button
              className="focus:outline-none"
              type="button"
              onClick={toggleVisibility}
            >
              {isVisible ? (
                <EyeSlashFilledIcon className="text-2xl text-default-400 pointer-events-none" />
              ) : (
                <EyeFilledIcon className="text-2xl text-default-400 pointer-events-none" />
              )}
            </button>
          }
        />

        <div className="w-full flex justify-end">
          <Link href={'/recover-password'}>
            <p
              className={`text-white text-[12px] my-2 ${fontOpenSans.className}`}
            >
              Esqueci minha senha
            </p>
          </Link>
        </div>

        <Button
          type="submit"
          isLoading={loading}
          className={`mt-6 rounded-3xl bg-[#00409F] text-white text-[14px] ${fontOpenSans.className}`}
        >
          Entrar
        </Button>
        <Button
          as={Link}
          href="/register"
          variant="bordered"
          className={`mt-4 rounded-3xl bg-[#1F67CE] text-white text-[14px] ${fontOpenSans.className} border-solid border-white`}
        >
          Criar conta
        </Button>
      </form>
      <ConfirmationCodeModal isOpen={isOpen} onClose={onOpenChange} />
    </div>
  )
}
