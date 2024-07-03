import React, { useState } from 'react'
import { useAuthContext } from '@/context/AuthContext'
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Image,
  Input,
  Button,
  Link,
} from '@nextui-org/react'
import { Open_Sans as OpenSans } from 'next/font/google'
import CountdownComponent from '../Countdown/Countdown'
import toast from 'react-hot-toast'
import { useForm } from 'react-hook-form'
import { schemaSendCode } from '@/schemas/user'
import { yupResolver } from '@hookform/resolvers/yup'
import { resendCode, validateCode } from '@/app/(shared-layout)/login/actions'

const fontOpenSans = OpenSans({ subsets: ['latin'] })

interface CustomModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function ConfirmationCodeModal({
  isOpen,
  onClose,
}: CustomModalProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ISendCodeProps>({
    resolver: yupResolver(schemaSendCode),
    mode: 'onSubmit',
    shouldFocusError: false,
  })
  const [loading, setLoading] = useState(false)
  const {
    sendCodeProps,
    handleResendCodeAvailable,
    resendCodeAvailable,
    handleAuthWithToken,
  } = useAuthContext()

  async function handleResendCode() {
    setLoading(true)
    if (sendCodeProps?.userId) {
      const { error } = await resendCode(sendCodeProps?.userId)
      setLoading(false)
      handleResendCodeAvailable(false)
      if (error) {
        toast.error(error)
      }
    }
  }

  async function handleSendCode(data: ISendCodeProps) {
    setLoading(true)
    if (sendCodeProps?.userId) {
      const { error, access_token } = await validateCode(
        sendCodeProps?.userId,
        data.code,
      )
      setLoading(false)
      handleResendCodeAvailable(false)
      if (error) {
        toast.error(error)
      } else if (access_token) {
        handleAuthWithToken(access_token)
      }
    }
  }

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onClose}
      size="4xl"
      closeButton={<img src="/closeicon.png" alt="close" />}
    >
      <ModalContent className={`${fontOpenSans.className} bg-[#1F67CE]`}>
        {(onClose) => (
          <>
            <ModalHeader className="flex space-x-2 items-center">
              <Image src="/mailicon.png" alt="mail icon" />
              <h1>Confirmação do código</h1>
            </ModalHeader>
            <form onSubmit={handleSubmit(handleSendCode)}>
              <ModalBody>
                <Input
                  type="text"
                  size="md"
                  label="Código SMS"
                  labelPlacement="inside"
                  placeholder="0000"
                  className="mt-4"
                  {...register('code')}
                  errorMessage={errors.code?.message}
                  isInvalid={!!errors.code?.message}
                />
                <p
                  className={`${fontOpenSans.className} text-[12px] text-white font-normal`}
                >
                  Insira o código SMS enviado para o telefone (XX) XXXXXX-
                  {sendCodeProps?.phone.substring(9, 13)} informado no cadastro.
                  Não recebeu o código?{' '}
                  {resendCodeAvailable ? (
                    <Link
                      onPress={() => handleResendCode()}
                      className="text-white text-[12px] underline cursor-pointer"
                    >
                      Solicite novamente.
                    </Link>
                  ) : (
                    <CountdownComponent />
                  )}
                </p>
              </ModalBody>
              <ModalFooter className="flex flex-col space-y-4">
                <Button
                  isLoading={loading}
                  type="submit"
                  className={`${fontOpenSans.className} text-[14px] text-white font-bold bg-[#00764B] rounded-full`}
                >
                  Confirmar código
                </Button>
                <Button
                  onPress={onClose}
                  className={`${fontOpenSans.className} text-[14px] text-white font-bold bg-[#E40000] rounded-full`}
                >
                  Fechar
                </Button>
              </ModalFooter>
            </form>
          </>
        )}
      </ModalContent>
    </Modal>
  )
}
