'use client'
import { Button, Input, Checkbox, useDisclosure } from '@nextui-org/react'
import { Open_Sans as OpenSans } from 'next/font/google'
import React, { useState } from 'react'
import { EyeSlashFilledIcon } from '../../components/EyeSlashFilledIcon/EyeSlashFilledIcon'
import { EyeFilledIcon } from '../../components/EyeFilledIcon/EyeFilledIcon'
import ConfirmationCodeModal from '@/app/components/ConfirmationCodeModal/ConfirmationCodeModal'
import AuthShell from '@/app/components/AuthShell/AuthShell'
import { Controller, useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { schemaRegisterUser } from '@/schemas/user'
import InputMask from 'react-input-mask'
import { createUser } from './actions'
import toast from 'react-hot-toast'
import { useAuthContext } from '@/context/AuthContext'
const fontOpenSans = OpenSans({ subsets: ['latin'] })

export default function Register() {
  const [isVisible, setIsVisible] = useState<boolean>(false)
  const { isOpen, onOpen, onOpenChange } = useDisclosure()
  const { handleSetSendCodeProps } = useAuthContext()

  const [loading, setLoading] = useState(false)
  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<INewUser>({
    resolver: yupResolver(schemaRegisterUser),
    mode: 'onSubmit',
    shouldFocusError: false,
  })

  async function handleRegister(data: INewUser) {
    setLoading(true)
    data.phone =
      '55' + data.phone.replace('(', '').replace(')', '').replace('-', '')

    const { userId, error } = await createUser(data)
    setLoading(false)
    if (error) {
      toast.error(error)
    } else if (userId) {
      reset()
      handleSetSendCodeProps({ userId, phone: data.phone })
      onOpen()
    }
  }

  const toggleVisibility = () => setIsVisible(!isVisible)

  return (
    <AuthShell
      title="Criar conta"
      subtitle="Cadastre-se e participe do bolão da Resenha da Sorte."
    >
      <form
        onSubmit={handleSubmit(handleRegister)}
        className="mx-auto flex w-full flex-col"
      >
        <Input
          size="md"
          type="text"
          label="Nome completo"
          labelPlacement="inside"
          placeholder="Digite seu nome completo"
          className="mt-4"
          errorMessage={errors.fullName?.message}
          isInvalid={!!errors.fullName?.message}
          color={errors.fullName?.message ? 'danger' : undefined}
          variant={errors.fullName?.message ? 'bordered' : undefined}
          {...register('fullName')}
        />
        <Input
          size="md"
          type="date"
          label="Data de nascimento"
          labelPlacement="inside"
          placeholder="DD/MM/YYYY"
          className="mt-4 text-[#000]"
          errorMessage={errors.birthdate?.message}
          isInvalid={!!errors.birthdate?.message}
          color={errors.birthdate?.message ? 'danger' : undefined}
          variant={errors.birthdate?.message ? 'bordered' : undefined}
          {...register('birthdate')}
        />
        <Controller
          control={control}
          name={'phone'}
          render={({ field }) => (
            <InputMask mask={'(99)99999-9999'} {...field} type="text">
              <Input
                placeholder={'(99)99999-9999'}
                className="mt-4"
                size="md"
                type="tel"
                label="Telefone"
                labelPlacement="inside"
                errorMessage={errors.phone?.message}
                isInvalid={!!errors.phone?.message}
                color={errors.phone?.message ? 'danger' : undefined}
                variant={errors.phone?.message ? 'bordered' : undefined}
              />
            </InputMask>
          )}
        />

        <Input
          size="md"
          {...register('password')}
          errorMessage={errors.password?.message}
          isInvalid={!!errors.password?.message}
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
          type={isVisible ? 'text' : 'password'}
          label="Senha"
          labelPlacement="inside"
          placeholder="Digite sua senha"
          className="mt-4"
        />
        <Input
          size="md"
          {...register('confirmPassword')}
          errorMessage={errors.confirmPassword?.message}
          isInvalid={!!errors.confirmPassword?.message}
          color={errors.confirmPassword?.message ? 'danger' : undefined}
          variant={errors.confirmPassword?.message ? 'bordered' : undefined}
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
          type={isVisible ? 'text' : 'password'}
          label="Confirmar senha"
          labelPlacement="inside"
          placeholder="Digite sua senha novamente"
          className="mt-4"
        />
        <Checkbox
          {...register('askTerms')}
          isInvalid={!!errors.askTerms?.message}
          className="my-6"
          classNames={{
            label: 'text-rs-muted',
          }}
        >
          <div>
            Eu aceito os{' '}
            <span className="font-bold text-rs-heading">Termos de Use</span> e{' '}
            <span className="font-bold text-rs-heading">
              Políticas de Privacidade
            </span>
          </div>
          <p className="text-[0.75rem] text-red-600">
            {errors.askTerms?.message}
          </p>
        </Checkbox>

        <Button
          isLoading={loading}
          type="submit"
          className={`mt-6 rounded-full bg-rs-gold text-sm text-rs-ink ${fontOpenSans.className}`}
        >
          Criar conta
        </Button>
      </form>
      <ConfirmationCodeModal isOpen={isOpen} onClose={onOpenChange} />
    </AuthShell>
  )
}
