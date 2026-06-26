'use client'

import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { getPredictions } from '@/app/(home)/home-user/actions'
import { formatMatchDateTime } from '@/utils/formatDate'
import { getLogo, isDefaultLogo } from '@/utils/getLogo'
import { getPlayerPhoto } from '@/utils/getPlayerPhoto'
import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Image,
  Spinner,
} from '@nextui-org/react'
import { Open_Sans as OpenSans } from 'next/font/google'
import { parseCookies } from 'nookies'
import toast from 'react-hot-toast'

const fontOpenSans = OpenSans({ subsets: ['latin'] })

const PAGE_SIZE = 10

type HistoryFilter = 'all' | 'HIT' | 'MISS' | 'PENDING'

function getTeamName(
  team: string | { name: string; logoUrl?: string | null },
): string {
  return typeof team === 'string' ? team : team.name
}

function getTeamLogoUrl(
  team: string | { name: string; logoUrl?: string | null },
): string | null | undefined {
  return typeof team === 'string' ? undefined : team.logoUrl
}

/** True only when match is DONE and both applicable predictions hit */
function isPredictionHit(prediction: IPredictionsGetResponse): boolean {
  if (prediction.match.status !== 'DONE') return false
  const scoreHit = prediction.predictionScore?.status === 'HIT'
  const hasPlayer = !!prediction.predictionPlayer?.player
  if (hasPlayer) {
    return scoreHit && prediction.predictionPlayer?.status === 'HIT'
  }
  return scoreHit
}

/** True only when match is DONE and at least one prediction missed */
function isPredictionMiss(prediction: IPredictionsGetResponse): boolean {
  if (prediction.match.status !== 'DONE') return false
  return (
    prediction.predictionScore?.status === 'MISS' ||
    prediction.predictionPlayer?.status === 'MISS'
  )
}

function isPredictionPending(prediction: IPredictionsGetResponse): boolean {
  return prediction.match.status !== 'DONE'
}

interface CustomModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function MyHistoryModal({ isOpen, onClose }: CustomModalProps) {
  const [userPredictions, setUserPredictions] = useState<
    IPredictionsGetResponse[]
  >([])
  const [loading, setLoading] = useState(false)
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE)
  const [historyFilter, setHistoryFilter] = useState<HistoryFilter>('all')
  const { 'qxute-bolao:x-token': token } = parseCookies()

  const loadPredictions = useCallback(
    async (t: string) => {
      setLoading(true)
      try {
        const result = await getPredictions(t)
        if (result.isError || !result.predictions) {
          toast.error('Não foi possível carregar o histórico. Tente novamente.')
          return
        }
        setUserPredictions(result.predictions)
      } finally {
        setLoading(false)
      }
    },
    [],
  )

  useEffect(() => {
    if (!isOpen) {
      setHistoryFilter('all')
      setVisibleCount(PAGE_SIZE)
      return
    }
    loadPredictions(token)
  }, [isOpen, token, loadPredictions])

  const totalCorrect = useMemo(
    () => userPredictions.filter(isPredictionHit).length,
    [userPredictions],
  )
  const totalIncorrect = useMemo(
    () => userPredictions.filter(isPredictionMiss).length,
    [userPredictions],
  )
  const totalPending = useMemo(
    () => userPredictions.filter(isPredictionPending).length,
    [userPredictions],
  )

  const filteredPredictions = useMemo(() => {
    switch (historyFilter) {
      case 'HIT':
        return userPredictions.filter(isPredictionHit)
      case 'MISS':
        return userPredictions.filter(isPredictionMiss)
      case 'PENDING':
        return userPredictions.filter(isPredictionPending)
      default:
        return userPredictions
    }
  }, [userPredictions, historyFilter])

  const visiblePredictions = filteredPredictions.slice(0, visibleCount)
  const hasMore = visibleCount < filteredPredictions.length

  const filterOptions: { value: HistoryFilter; label: string; count: number }[] =
    [
      { value: 'all', label: 'Todos', count: userPredictions.length },
      { value: 'HIT', label: 'Acertos', count: totalCorrect },
      { value: 'MISS', label: 'Erros', count: totalIncorrect },
      { value: 'PENDING', label: 'Pendentes', count: totalPending },
    ]

  return (
    <Modal
      scrollBehavior="inside"
      isOpen={isOpen}
      onOpenChange={onClose}
      size="4xl"
      closeButton={<img src="/closeicon.png" alt="close" />}
    >
      <ModalContent
        className={`${fontOpenSans.className} border border-rs-border bg-rs-modal text-rs-heading`}
      >
        {(onModalClose) => (
          <>
            <ModalHeader className="flex items-center space-x-2 text-rs-heading">
              <Image src="/historyicon.svg" alt="histórico" />
              <h1>Meu histórico</h1>
            </ModalHeader>

            <ModalBody className="space-y-4 text-rs-muted">
              <p className="text-sm text-rs-muted">
                Todos os seus palpites — finalizados e aguardando resultado.
              </p>

              {/* Stats row */}
              <div className="flex justify-around">
                <button
                  type="button"
                  onClick={() => setHistoryFilter('HIT')}
                  className="flex flex-col items-center gap-1.5 text-rs-heading"
                >
                  <span className="text-xs text-rs-muted">Acertos</span>
                  <span className="flex w-12 items-center justify-center rounded border border-rs-gold/40 bg-rs-gold py-1.5 text-base font-bold text-rs-ink">
                    {totalCorrect}
                  </span>
                </button>
                <button
                  type="button"
                  onClick={() => setHistoryFilter('MISS')}
                  className="flex flex-col items-center gap-1.5 text-rs-heading"
                >
                  <span className="text-xs text-rs-muted">Erros</span>
                  <span className="flex w-12 items-center justify-center rounded border border-[#E40000]/40 bg-[#E40000] py-1.5 text-base font-bold text-white">
                    {totalIncorrect}
                  </span>
                </button>
                <button
                  type="button"
                  onClick={() => setHistoryFilter('PENDING')}
                  className="flex flex-col items-center gap-1.5 text-rs-heading"
                >
                  <span className="text-xs text-rs-muted">Pendentes</span>
                  <span className="flex w-12 items-center justify-center rounded border border-rs-border bg-rs-card-elevated py-1.5 text-base font-bold text-rs-heading">
                    {totalPending}
                  </span>
                </button>
              </div>

              {/* Filter chips */}
              <div className="flex flex-wrap gap-2">
                {filterOptions.map((option) => (
                  <Button
                    key={option.value}
                    size="sm"
                    variant={
                      historyFilter === option.value ? 'solid' : 'bordered'
                    }
                    className={`rounded-full text-[12px] font-bold ${
                      historyFilter === option.value
                        ? option.value === 'MISS'
                          ? 'bg-[#E40000] text-white'
                          : option.value === 'PENDING'
                            ? 'bg-rs-card-elevated text-rs-heading'
                            : 'bg-rs-gold text-rs-ink'
                        : 'border-rs-border bg-transparent text-rs-muted'
                    }`}
                    onPress={() => {
                      setHistoryFilter(option.value)
                      setVisibleCount(PAGE_SIZE)
                    }}
                  >
                    {option.label}
                    {option.count > 0 && (
                      <span className="ml-1 opacity-70">({option.count})</span>
                    )}
                  </Button>
                ))}
              </div>

              {/* List */}
              {loading ? (
                <div className="flex justify-center py-8">
                  <Spinner color="warning" />
                </div>
              ) : filteredPredictions.length === 0 ? (
                <p className="py-8 text-center text-sm text-rs-muted">
                  {historyFilter === 'HIT'
                    ? 'Nenhum palpite acertado ainda.'
                    : historyFilter === 'MISS'
                      ? 'Nenhum palpite errado ainda.'
                      : historyFilter === 'PENDING'
                        ? 'Nenhum palpite pendente.'
                        : 'Nenhum palpite encontrado.'}
                </p>
              ) : (
                <div className="flex flex-col gap-3">
                  {visiblePredictions.map((pred, index) => {
                    const isPending = isPredictionPending(pred)
                    const isHit = isPredictionHit(pred)
                    const predKey =
                      pred.matchId ??
                      `${getTeamName(pred.match.teamHome)}-${getTeamName(pred.match.teamAway)}-${index}`

                    return (
                      <div
                        key={predKey}
                        className="mx-auto flex w-full flex-col rounded-xl border border-rs-gold/20 bg-rs-ink p-4 text-white"
                      >
                        {/* Header */}
                        <div className="flex w-full flex-wrap items-start justify-between gap-1">
                          <div className="flex min-w-0 items-center space-x-1.5">
                            <Image
                              src="/sportsicon.png"
                              alt="sports icon"
                              width={16}
                              height={16}
                            />
                            <span className="max-w-[150px] truncate text-[11px] text-white sm:max-w-none">
                              {pred.match.roundName}
                            </span>
                          </div>
                          <span className="whitespace-nowrap text-[11px] text-white">
                            {formatMatchDateTime(pred.match.date)}
                          </span>
                        </div>

                        {/* Teams + Scores */}
                        <div className="mt-4 flex items-center justify-between">
                          <div className="flex flex-col items-center gap-1.5">
                            <Image
                              src={getLogo(
                                getTeamName(pred.match.teamHome),
                                getTeamLogoUrl(pred.match.teamHome),
                              )}
                              alt={getTeamName(pred.match.teamHome)}
                              className={`h-9 w-9 rounded-full object-cover ${isDefaultLogo(getLogo(getTeamName(pred.match.teamHome), getTeamLogoUrl(pred.match.teamHome))) ? 'bg-white p-1' : ''}`}
                            />
                            <span className="max-w-[72px] text-center text-[11px] leading-tight text-white">
                              {getTeamName(pred.match.teamHome)}
                            </span>
                            <span className="text-base font-semibold text-white">
                              {pred.predictionScore?.predictionHome ?? '–'}
                            </span>
                          </div>

                          <div className="flex flex-col items-center gap-0.5">
                            <span className="text-lg font-bold text-rs-gold">
                              ×
                            </span>
                            {!isPending && (
                              <span className="text-[10px] text-rs-muted">
                                resultado
                              </span>
                            )}
                            {!isPending && (
                              <span className="text-[11px] font-semibold text-rs-gold">
                                {pred.match.scoreHome ?? '?'} –{' '}
                                {pred.match.scoreAway ?? '?'}
                              </span>
                            )}
                          </div>

                          <div className="flex flex-col items-center gap-1.5">
                            <Image
                              src={getLogo(
                                getTeamName(pred.match.teamAway),
                                getTeamLogoUrl(pred.match.teamAway),
                              )}
                              alt={getTeamName(pred.match.teamAway)}
                              className={`h-9 w-9 rounded-full object-cover ${isDefaultLogo(getLogo(getTeamName(pred.match.teamAway), getTeamLogoUrl(pred.match.teamAway))) ? 'bg-white p-1' : ''}`}
                            />
                            <span className="max-w-[72px] text-center text-[11px] leading-tight text-white">
                              {getTeamName(pred.match.teamAway)}
                            </span>
                            <span className="text-base font-semibold text-white">
                              {pred.predictionScore?.predictionAway ?? '–'}
                            </span>
                          </div>
                        </div>

                        {/* Player prediction */}
                        {pred.predictionPlayer?.player && (
                          <div className="mt-3 w-full">
                            <hr className="border-t border-rs-gold/30" />
                            <p className="mt-2 text-center text-[11px] font-semibold text-rs-gold">
                              Último gol —{' '}
                              {pred.predictionPlayer.team ??
                                getTeamName(pred.match.teamHome)}
                            </p>
                            <div className="mt-2 flex items-center justify-center gap-2">
                              <Image
                                src={getPlayerPhoto(
                                  pred.predictionPlayer.photoUrl,
                                )}
                                alt={pred.predictionPlayer.player}
                                className="h-7 w-7 rounded-full object-cover"
                              />
                              <span className="text-[13px] text-white">
                                {pred.predictionPlayer.player}
                              </span>
                              {!isPending &&
                                pred.predictionPlayer.status === 'HIT' && (
                                  <Image
                                    src="/checkicon.svg"
                                    alt="acertou"
                                    width={16}
                                    height={16}
                                  />
                                )}
                              {!isPending &&
                                pred.predictionPlayer.status === 'MISS' && (
                                  <Image
                                    src="/wrongicon.svg"
                                    alt="errou"
                                    width={16}
                                    height={16}
                                  />
                                )}
                            </div>
                            {!isPending && pred.match.lastPlayer && (
                              <p className="mt-1 text-center text-[10px] text-rs-muted">
                                Goleador real: {pred.match.lastPlayer}
                              </p>
                            )}
                          </div>
                        )}

                        {/* Result banner */}
                        <hr className="mt-3 border-t border-rs-gold/30" />
                        {isPending ? (
                          <p className="mt-3 text-center text-[12px] text-rs-muted">
                            ⏳ Aguardando resultado
                          </p>
                        ) : isHit ? (
                          <p className="mt-3 flex items-center justify-center gap-1.5 text-[13px]">
                            <Image
                              src="/checkicon.svg"
                              alt="check"
                              width={16}
                              height={16}
                            />
                            Você acertou o palpite!
                          </p>
                        ) : (
                          <p className="mt-3 flex items-center justify-center gap-1.5 text-[13px]">
                            <Image
                              src="/wrongicon.svg"
                              alt="errou"
                              width={16}
                              height={16}
                            />
                            Você errou o palpite.
                          </p>
                        )}
                      </div>
                    )
                  })}

                  {/* Load more */}
                  {hasMore && (
                    <Button
                      variant="bordered"
                      className="mx-auto mt-1 w-full rounded-full border border-rs-gold bg-transparent text-[13px] font-bold text-rs-gold"
                      onPress={() => setVisibleCount((c) => c + PAGE_SIZE)}
                    >
                      Carregar mais ({filteredPredictions.length - visibleCount}{' '}
                      restantes)
                    </Button>
                  )}
                </div>
              )}
            </ModalBody>

            <ModalFooter>
              <Button
                onPress={onModalClose}
                className={`${fontOpenSans.className} w-full rounded-full bg-rs-gold text-[14px] font-bold text-rs-ink`}
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
