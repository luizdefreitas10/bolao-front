'use client'
import React, { useState, useEffect } from 'react'
import {
  Button,
  Image,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Radio,
  RadioGroup,
  Spinner,
} from '@nextui-org/react'
import { Open_Sans as OpenSans } from 'next/font/google'
import { getLogo, isDefaultLogo } from '@/utils/getLogo'
import { getPlayerPhoto } from '@/utils/getPlayerPhoto'
import { formatMatchDateTime } from '@/utils/formatDate'
import {
  eventModalBodyClassName,
  eventModalHeaderClassName,
} from '../form/formClassNames'

const fontOpenSans = OpenSans({ subsets: ['latin'] })

interface SortedMatch {
  championship: IChampionshipWithRounds
  round: IChampionshipWithRounds['rounds'][number]
  match: IChampionshipWithRounds['rounds'][number]['matchs'][number]
}

interface BetConfirmationModalProps {
  isOpen: boolean
  onClose: () => void
  sortedMatches: SortedMatch[]
  initialPredictions: IPrediction[]
  onConfirm: (finalPredictions: IPrediction[]) => Promise<void>
  isSubmitting: boolean
}

export default function BetConfirmationModal({
  isOpen,
  onClose,
  sortedMatches,
  initialPredictions,
  onConfirm,
  isSubmitting,
}: BetConfirmationModalProps) {
  const [localPredictions, setLocalPredictions] = useState<IPrediction[]>([])

  useEffect(() => {
    if (isOpen) {
      setLocalPredictions(initialPredictions.map((p) => ({ ...p })))
    }
  }, [isOpen, initialPredictions])

  const pendingMatches = sortedMatches.filter(({ match }) => {
    const pred = localPredictions.find((p) => p.matchId === match.id)
    return !pred?.disabled && match.predictions.length === 0
  })

  const increase = (matchId: string, type: 'home' | 'away') => {
    setLocalPredictions((prev) =>
      prev.map((p) =>
        p.matchId !== matchId
          ? p
          : {
              ...p,
              predictionHome:
                type === 'home' ? p.predictionHome + 1 : p.predictionHome,
              predictionAway:
                type === 'away' ? p.predictionAway + 1 : p.predictionAway,
            },
      ),
    )
  }

  const decrease = (matchId: string, type: 'home' | 'away') => {
    setLocalPredictions((prev) =>
      prev.map((p) =>
        p.matchId !== matchId
          ? p
          : {
              ...p,
              predictionHome:
                type === 'home' && p.predictionHome > 0
                  ? p.predictionHome - 1
                  : p.predictionHome,
              predictionAway:
                type === 'away' && p.predictionAway > 0
                  ? p.predictionAway - 1
                  : p.predictionAway,
            },
      ),
    )
  }

  const selectPlayer = (matchId: string, playerId: string) => {
    setLocalPredictions((prev) =>
      prev.map((p) =>
        p.matchId === matchId ? { ...p, playerId } : p,
      ),
    )
  }

  const getPrediction = (matchId: string) =>
    localPredictions.find((p) => p.matchId === matchId)

  return (
    <Modal
      scrollBehavior="inside"
      isOpen={isOpen}
      onOpenChange={onClose}
      size="4xl"
      closeButton={<img src="/closeicon.png" alt="close" />}
    >
      <ModalContent
        className={`${fontOpenSans.className} bg-rs-modal text-rs-heading`}
      >
        {() => (
          <>
            <ModalHeader className={eventModalHeaderClassName}>
              <Image src="/sportsicon.png" alt="sports icon" />
              <h1>Confirmar palpites</h1>
            </ModalHeader>

            <ModalBody className={eventModalBodyClassName}>
              <p className="text-sm text-rs-muted">
                Revise e edite seus palpites antes de confirmar. Após o envio
                não será possível alterar.
              </p>

              {pendingMatches.length === 0 ? (
                <p className="py-6 text-center text-rs-muted">
                  Nenhuma partida disponível para palpite.
                </p>
              ) : (
                <div className="flex flex-col gap-6 py-2">
                  {pendingMatches.map(({ championship, round, match }) => {
                    const pred = getPrediction(match.id)
                    return (
                      <div
                        key={match.id}
                        className="flex flex-col gap-4 rounded-xl border border-rs-gold/20 bg-rs-ink p-4"
                      >
                        <div className="flex w-full justify-between text-[11px] text-rs-muted">
                          <span>
                            {round.name} · {championship.name}
                          </span>
                          <span>{formatMatchDateTime(match.date)}</span>
                        </div>

                        {/* Placar */}
                        <div className="flex items-center justify-center gap-6">
                          {/* Time da casa */}
                          <div className="flex flex-col items-center gap-2">
                            <Image
                              src={getLogo(
                                match.teamHome.name,
                                match.teamHome.logoUrl,
                              )}
                              alt={match.teamHome.name}
                              className={`h-10 w-10 rounded-full object-cover ${isDefaultLogo(getLogo(match.teamHome.name, match.teamHome.logoUrl)) ? 'bg-white p-1' : ''}`}
                            />
                            <span className="max-w-[80px] text-center text-xs text-white">
                              {match.teamHome.name}
                            </span>
                            <div className="flex items-center gap-2">
                              <Button
                                size="sm"
                                variant="bordered"
                                className="border border-rs-gold bg-transparent text-rs-gold"
                                onPress={() => decrease(match.id, 'home')}
                              >
                                -
                              </Button>
                              <span className="w-6 text-center text-base font-semibold text-white">
                                {pred?.predictionHome ?? 0}
                              </span>
                              <Button
                                size="sm"
                                variant="bordered"
                                className="border border-rs-gold bg-transparent text-rs-gold"
                                onPress={() => increase(match.id, 'home')}
                              >
                                +
                              </Button>
                            </div>
                          </div>

                          <span className="text-xl font-bold text-rs-gold">
                            X
                          </span>

                          {/* Time visitante */}
                          <div className="flex flex-col items-center gap-2">
                            <Image
                              src={getLogo(
                                match.teamAway.name,
                                match.teamAway.logoUrl,
                              )}
                              alt={match.teamAway.name}
                              className={`h-10 w-10 rounded-full object-cover ${isDefaultLogo(getLogo(match.teamAway.name, match.teamAway.logoUrl)) ? 'bg-white p-1' : ''}`}
                            />
                            <span className="max-w-[80px] text-center text-xs text-white">
                              {match.teamAway.name}
                            </span>
                            <div className="flex items-center gap-2">
                              <Button
                                size="sm"
                                variant="bordered"
                                className="border border-rs-gold bg-transparent text-rs-gold"
                                onPress={() => decrease(match.id, 'away')}
                              >
                                -
                              </Button>
                              <span className="w-6 text-center text-base font-semibold text-white">
                                {pred?.predictionAway ?? 0}
                              </span>
                              <Button
                                size="sm"
                                variant="bordered"
                                className="border border-rs-gold bg-transparent text-rs-gold"
                                onPress={() => increase(match.id, 'away')}
                              >
                                +
                              </Button>
                            </div>
                          </div>
                        </div>

                        {/* Jogador do último gol */}
                        {match.lastPlayerTeam && match.players.length > 0 && (
                          <div className="mt-2">
                            <div className="mb-3 flex items-center gap-2">
                              <Image
                                src={getLogo(
                                  match.lastPlayerTeam.name,
                                  match.lastPlayerTeam.logoUrl,
                                )}
                                alt={match.lastPlayerTeam.name}
                                className={`h-6 w-6 rounded-full object-cover ${isDefaultLogo(getLogo(match.lastPlayerTeam.name, match.lastPlayerTeam.logoUrl)) ? 'bg-white p-0.5' : ''}`}
                              />
                              <span className="text-xs text-rs-muted">
                                Último gol do {match.lastPlayerTeam.name}
                              </span>
                            </div>
                            <RadioGroup
                              value={pred?.playerId ?? ''}
                              onChange={(e) =>
                                selectPlayer(match.id, e.target.value)
                              }
                              className="flex flex-col gap-2"
                            >
                              {match.players.map((player) => (
                                <div
                                  key={player.id}
                                  className="flex items-center justify-between rounded-lg border border-rs-gold/20 bg-rs-card-elevated p-2"
                                >
                                  <div className="flex items-center gap-2">
                                    <Image
                                      src={getPlayerPhoto(player.photoUrl)}
                                      alt={player.name}
                                      className="h-7 w-7 rounded-full object-cover"
                                    />
                                    <span className="text-sm text-rs-heading">
                                      {player.name}
                                    </span>
                                  </div>
                                  <Radio
                                    color="primary"
                                    value={player.id}
                                    classNames={{ label: 'hidden' }}
                                  >
                                    {player.name}
                                  </Radio>
                                </div>
                              ))}
                            </RadioGroup>
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              )}
            </ModalBody>

            <ModalFooter className="flex flex-col gap-3">
              <Button
                isDisabled={isSubmitting || pendingMatches.length === 0}
                onPress={() => onConfirm(localPredictions)}
                className={`${fontOpenSans.className} w-full rounded-full bg-rs-gold text-[14px] font-bold text-rs-ink`}
              >
                {isSubmitting ? <Spinner size="sm" /> : 'Confirmar e Enviar'}
              </Button>
              <Button
                isDisabled={isSubmitting}
                onPress={onClose}
                variant="bordered"
                className={`${fontOpenSans.className} w-full rounded-full border-2 border-rs-gold bg-transparent text-[14px] font-bold text-rs-gold`}
              >
                Voltar e Editar
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  )
}
