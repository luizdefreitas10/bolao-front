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
  
  const fontOpenSans = OpenSans({ subsets: ['latin'] })
  
  interface CustomModalProps {
    isOpen: boolean
    onClose: () => void
  }
  
  export default function ConfirmationCodeModal({
    isOpen,
    onClose,
  }: CustomModalProps) {
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
              <ModalBody>
                <Input
                  type="text"
                  size="md"
                  label="Código SMS"
                  labelPlacement="inside"
                  placeholder="0000"
                  className="mt-4"
                />
                <p
                  className={`${fontOpenSans.className} text-[12px] text-white font-normal`}
                >
                  Insira o código SMS enviado para o telefone (81) 91234-5678
                  informado no cadastro. Não recebeu o código?{' '}
                  <Link
                    href="/recover-password"
                    className="text-white text-[12px] underline"
                  >
                    Solicite novamente.
                  </Link>
                </p>
              </ModalBody>
              <ModalFooter className="flex flex-col space-y-4">
                <Button
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
            </>
          )}
        </ModalContent>
      </Modal>
    )
  }
  