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
import AuthShell from '@/app/components/AuthShell/AuthShell'

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
    <AuthShell
      title="Bem-vindo de volta!"
      subtitle="Entre na sua conta e continue palpitando no bolão da Resenha da Sorte."
    >
      <form
        className="mx-auto flex w-full flex-col"
        onSubmit={handleSubmit(handleLogin)}
      >
        <label htmlFor={'phone'} className="mb-1 mt-2 text-sm text-rs-muted">
          Celular <span className="text-danger">*</span>
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
        <label htmlFor={'password'} className="mb-1 mt-2 text-sm text-rs-muted">
          Senha <span className="text-danger">*</span>
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
              className={`my-2 text-xs text-rs-gold ${fontOpenSans.className}`}
            >
              Esqueci minha senha
            </p>
          </Link>
        </div>

        <Button
          type="submit"
          isLoading={loading}
          className={`mt-6 rounded-full bg-rs-gold text-sm text-rs-ink ${fontOpenSans.className}`}
        >
          Entrar
        </Button>
        <Button
          as={Link}
          href="/register"
          variant="bordered"
          className={`mt-4 rounded-full border-rs-gold text-sm text-rs-gold ${fontOpenSans.className}`}
        >
          Criar conta
        </Button>
      </form>
      <ConfirmationCodeModal isOpen={isOpen} onClose={onOpenChange} />
    </AuthShell>
  )
}
