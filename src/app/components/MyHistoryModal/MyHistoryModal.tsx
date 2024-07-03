import React from 'react'

import { getPredictions } from '@/app/(home)/home-user/actions'
import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Image,
} from '@nextui-org/react'
import { Open_Sans as OpenSans } from 'next/font/google'
import { parseCookies } from 'nookies'
import { useEffect, useState } from 'react'

const fontOpenSans = OpenSans({ subsets: ['latin'] })

interface CustomModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function MyHistoryModal({ isOpen, onClose }: CustomModalProps) {
  const [userPredictions, setUserPredictions] = useState<
    IPredictionsGetResponse[]
  >([])
  const [totalCorrectPredictions, setTotalCorrectPredictions] =
    useState<number>(0)
  const [totalIncorrectPredictions, setTotalIncorrectPredictions] =
    useState<number>(0)
  const { 'qxute-bolao:x-token': token } = parseCookies()

  const getUserPredictions = async (token: string) => {
    const { predictions } = await getPredictions(token)
    return predictions
  }

  useEffect(() => {
    getUserPredictions(token).then((listOfPredictions) => {
      let correctPredictions = 0
      let incorrectPredictions = 0

      const userPredictions = listOfPredictions?.map((prediction) => {
        const userPlayerPredStatus = prediction.predictionPlayer.status
        const userScorePredStatus = prediction.predictionScore.status

        if (userPlayerPredStatus === 'HIT' && userScorePredStatus === 'HIT') {
          correctPredictions += 1
        } else if (
          Object.keys(prediction.predictionPlayer).length === 0 &&
          prediction.predictionScore.status === 'HIT'
        ) {
          correctPredictions += 1
        } else if (
          userPlayerPredStatus === 'MISS' ||
          userScorePredStatus === 'MISS'
        ) {
          incorrectPredictions += 1
        }

        return prediction
      })

      setUserPredictions(userPredictions || [])
      setTotalCorrectPredictions(correctPredictions)
      setTotalIncorrectPredictions(incorrectPredictions)
    })
  }, [])

  return (
    <Modal
      scrollBehavior="outside"
      isOpen={isOpen}
      onOpenChange={onClose}
      size="4xl"
      closeButton={<img src="/closeicon.png" alt="close" />}
    >
      <ModalContent className={`${fontOpenSans.className} bg-[#1F67CE]`}>
        {(onClose) => (
          <>
            <ModalHeader className="flex space-x-2 items-center">
              <Image src="/whitehistoryicon.svg" alt="mail icon" />
              <h1>Meu histórico</h1>
            </ModalHeader>
            <ModalBody className="space-y-2">
              <p>
                Confira abaixo o histórico dos resultados dos seus palpites!
              </p>
              <Button
                variant="bordered"
                startContent={<Image src="/filtericon.svg" alt="filter" />}
                className="font-bold text-white text-[14px] border-white rounded-full"
              >
                Filtrar por
              </Button>
              <div className="flex justify-around mt-4">
                <div className="flex flex-col justify-center items-center space-y-2">
                  <h1>Total de acertos</h1>
                  <span className="bg-[#00764B] w-[50px] flex justify-center items-center py-2 rounded-[4px] border-white border-[1px] border-solid">
                    {totalCorrectPredictions}
                  </span>
                </div>
                <div className="flex flex-col justify-center items-center space-y-2">
                  <h1>Total de erros</h1>
                  <span className="bg-[#E40000] w-[50px] flex justify-center items-center py-2 rounded-[4px] border-white border-[1px] border-solid">
                    {totalIncorrectPredictions}
                  </span>
                </div>
              </div>

              {userPredictions.map(
                (userPrediction, index) =>
                  userPrediction.match.status === 'DONE' && (
                    <div
                      key={index}
                      className="flex flex-col p-4 bg-[#00409F] rounded-lg w-[90%] mx-auto justify-center items-center"
                    >
                      <div className="flex w-full justify-between">
                        <div className="flex space-x-2">
                          <Image src="/sportsicon.png" alt="sports icon" />
                          <h1 className="text-white text-[12px] font-normal">
                            {userPrediction.match.roundName}
                          </h1>
                        </div>
                        <h1 className="text-white text-[12px] font-normal">
                          {new Date(
                            userPrediction.match.date,
                          ).toLocaleDateString('pt-BR')}
                        </h1>
                      </div>
                      <div className="flex justify-between items-center mt-4 w-full">
                        <div className="flex flex-col space-y-4">
                          <h1 className="text-center">
                            {userPrediction.match.teamHome}
                          </h1>
                          <div className="flex justify-center items-center">
                            <h1 className="mx-3 text-[16px text-white] font-semibold">
                              {userPrediction.predictionScore.predictionHome}
                            </h1>
                          </div>
                        </div>
                        <h1 className="mx-4">X</h1>
                        <div className="flex flex-col space-y-4">
                          <h1 className="text-center">
                            {userPrediction.match.teamAway}
                          </h1>
                          <div className="flex justify-center items-center">
                            <h1 className="mx-3 text-[16px text-white] font-semibold">
                              {userPrediction.predictionScore.predictionAway}
                            </h1>
                          </div>
                        </div>
                      </div>
                      {userPrediction.predictionPlayer.player && (
                        <div key={userPrediction.match.id} className="w-full">
                          <hr className="w-full h-[1px] border-t-[1px] border-t-[#1F67CE] mt-4" />
                          <h1 className="text-[12px] font-semibold text-white text-center mt-4">
                            Marcador do último gol do{' '}
                            {userPrediction.match.teamHome}:
                          </h1>
                          <h1 className="flex justify-center items-center gap-2 mt-4">
                            <Image src="/player.png" alt="player" />
                            {userPrediction.predictionPlayer.player}
                          </h1>
                        </div>
                      )}
                      <hr className="w-full h-[1px] border-t-[1px] border-t-[#1F67CE] mt-4" />
                      {Object.keys(userPrediction.predictionPlayer).length ===
                      0 ? (
                        userPrediction.predictionScore.status === 'HIT' ? (
                          <h1 className="flex justify-center items-center gap-2 mt-4">
                            <Image src="/checkicon.svg" alt="check" />
                            Você acertou o palpite!
                          </h1>
                        ) : (
                          <h1 className="flex justify-center items-center gap-2 mt-4">
                            <Image src="/wrongicon.svg" alt="check" />
                            Você errou o palpite!
                          </h1>
                        )
                      ) : userPrediction.predictionPlayer.status === 'HIT' &&
                        userPrediction.predictionScore.status === 'HIT' ? (
                        <h1 className="flex justify-center items-center gap-2 mt-4">
                          <Image src="/checkicon.svg" alt="check" />
                          Você acertou o palpite!
                        </h1>
                      ) : (
                        <h1 className="flex justify-center items-center gap-2 mt-4">
                          <Image src="/wrongicon.svg" alt="check" />
                          Você errou o palpite!
                        </h1>
                      )}
                    </div>
                  ),
              )}
            </ModalBody>
            <ModalFooter className="flex flex-col space-y-4">
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
