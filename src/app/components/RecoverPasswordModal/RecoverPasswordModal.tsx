import React from 'react'
import { resetPassword } from '@/app/(shared-layout)/recover-password/actions'
import { useAuthContext } from '@/context/AuthContext'
import { resetPasswordSchema } from '@/schemas/recover-password'
import { decodeToken } from '@/utils/jwt'
import { yupResolver } from '@hookform/resolvers/yup'
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
import { parseCookies } from 'nookies'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { EyeSlashFilledIcon } from '../EyeSlashFilledIcon/EyeSlashFilledIcon'
import { EyeFilledIcon } from '../EyeFilledIcon/EyeFilledIcon'
import { useRouter } from 'next/navigation'

const fontOpenSans = OpenSans({ subsets: ['latin'] })

interface CustomModalProps {
  isOpen: boolean
  onClose: () => void
  phone: string
  userId: string
}

export default function RecoverPasswordModal({
  isOpen,
  onClose,
  phone,
  userId,
}: CustomModalProps) {
  const { push } = useRouter()
  const [isVisible, setIsVisible] = useState<boolean>(false)
  const toggleVisibility = () => setIsVisible(!isVisible)
  const [currentModalIndex, setCurrentModalIndex] = useState<number>(0)
  const [loading, setLoading] = useState(false)
  useAuthContext()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IResetPassword>({
    resolver: yupResolver(resetPasswordSchema),
    mode: 'onSubmit',
    shouldFocusError: false,
  })

  const modalStepsResetPassword = ['code', 'newPassword']

  async function handleSendCode(data: IResetPassword) {
    setLoading(true)
    const { 'qxute-bolao:x-token': token } = parseCookies()
    const decode = decodeToken(token)

    const { error } = await resetPassword(data.code, data.newPassword, userId)
    setLoading(false)

    if (error) {
      toast.error(error)
    } else if (userId) {
      toast.success('Senha alterada com sucesso!')
      onClose()
      if (decode?.role) {
        push(decode.role === 'ADMIN' ? '/home-admin' : '/home-user')
      }
    }
  }

  const handleNextModal = () => {
    if (currentModalIndex < modalStepsResetPassword.length - 1) {
      setCurrentModalIndex(currentModalIndex + 1)
    }

    if (currentModalIndex === modalStepsResetPassword.length - 1) {
      handleSubmit(handleSendCode)()
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
                  Insira o código SMS enviado para o telefone {phone} informado
                  no cadastro. Não recebeu o código?{' '}
                  <Link
                    href="/recover-password"
                    className="text-white text-[12px] underline"
                  >
                    Solicite novamente.
                  </Link>
                </p>

                {currentModalIndex === 1 && (
                  <>
                    <p>Insira sua nova senha</p>
                    <Input
                      size="md"
                      type={!isVisible ? 'password' : 'text'}
                      {...register('newPassword')}
                      labelPlacement="inside"
                      errorMessage={errors.newPassword?.message}
                      isInvalid={!!errors.newPassword?.message}
                      placeholder={'Senha'}
                      color={errors.newPassword?.message ? 'danger' : undefined}
                      variant={
                        errors.newPassword?.message ? 'bordered' : undefined
                      }
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
                  </>
                )}
              </ModalBody>

              <ModalFooter className="flex flex-col space-y-4">
                <Button
                  isLoading={loading}
                  onClick={handleNextModal}
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
