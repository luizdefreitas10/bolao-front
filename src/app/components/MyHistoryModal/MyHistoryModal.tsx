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

function isZeroZeroDraw(prediction: IPredictionsGetResponse): boolean {
  if (prediction.match.status !== 'DONE') return false
  return (
    (prediction.match.scoreHome ?? 0) === 0 &&
    (prediction.match.scoreAway ?? 0) === 0
  )
}

/**
 * Acerto completo:
 * - Placar correto AND jogador correto (quando há goleador)
 * - Em jogos 0×0: apenas placar importa (ninguém marcou gol)
 */
function isPredictionHit(prediction: IPredictionsGetResponse): boolean {
  if (prediction.match.status !== 'DONE') return false

  const scoreHit = prediction.predictionScore?.status === 'HIT'

  // Empate 0×0 — nenhum gol, portanto apenas o placar é avaliado
  if (isZeroZeroDraw(prediction)) return scoreHit

  const hasPlayerPred = !!prediction.predictionPlayer?.player
  if (hasPlayerPred) {
    return scoreHit && prediction.predictionPlayer?.status === 'HIT'
  }
  return scoreHit
}

/** Erro: partida finalizada e pelo menos uma previsão errada */
function isPredictionMiss(prediction: IPredictionsGetResponse): boolean {
  if (prediction.match.status !== 'DONE') return false

  if (isZeroZeroDraw(prediction)) {
    return prediction.predictionScore?.status !== 'HIT'
  }

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

  const loadPredictions = useCallback(async (t: string) => {
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
  }, [])

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

  const filterOptions: {
    value: HistoryFilter
    label: string
    count: number
  }[] = [
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
                    const isZeroZero = isZeroZeroDraw(pred)
                    const predKey =
                      pred.matchId ??
                      `${getTeamName(pred.match.teamHome)}-${getTeamName(pred.match.teamAway)}-${index}`

                    const scoreHit = pred.predictionScore?.status === 'HIT'
                    const hasUserPlayerPred = !!pred.predictionPlayer?.player
                    const hasActualScorer = !!pred.match.lastPlayer
                    const playerHit = pred.predictionPlayer?.status === 'HIT'

                    // Exibe seção de jogador se: não for 0×0 e houver palpite
                    // de jogador OU goleador real conhecido (apenas quando finalizado)
                    const showPlayerSection =
                      !isZeroZero &&
                      (hasUserPlayerPred || (!isPending && hasActualScorer))

                    return (
                      <div
                        key={predKey}
                        className="mx-auto flex w-full flex-col rounded-xl border border-rs-gold/20 bg-rs-ink text-white overflow-hidden"
                      >
                        {/* Header */}
                        <div className="flex w-full flex-wrap items-start justify-between gap-1 px-4 pt-3 pb-0">
                          <div className="flex min-w-0 items-center space-x-1.5">
                            <Image
                              src="/sportsicon.png"
                              alt="sports icon"
                              width={16}
                              height={16}
                            />
                            <span className="max-w-[150px] truncate text-[11px] text-white/60 sm:max-w-none">
                              {pred.match.roundName}
                            </span>
                          </div>
                          <span className="whitespace-nowrap text-[11px] text-white/60">
                            {formatMatchDateTime(pred.match.date)}
                          </span>
                        </div>

                        {/* Teams + Scores */}
                        <div className="mt-4 flex items-center justify-between px-4 pb-3">
                          {/* Home team */}
                          <div className="flex flex-col items-center gap-1.5 w-[30%]">
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

                          {/* Center: placar palpitado × resultado real */}
                          <div className="flex flex-col items-center gap-0.5 flex-1">
                            <span className="text-[9px] uppercase tracking-wide text-white/40">
                              palpite
                            </span>
                            <span className="text-lg font-bold text-rs-gold">
                              ×
                            </span>
                            {!isPending && (
                              <>
                                <span className="text-[9px] uppercase tracking-wide text-white/40">
                                  resultado
                                </span>
                                <div className="flex items-center gap-1">
                                  <span
                                    className={`text-[13px] font-bold ${scoreHit ? 'text-green-400' : 'text-[#E40000]'}`}
                                  >
                                    {pred.match.scoreHome ?? '?'}&nbsp;–&nbsp;
                                    {pred.match.scoreAway ?? '?'}
                                  </span>
                                  <Image
                                    src={
                                      scoreHit
                                        ? '/checkicon.svg'
                                        : '/wrongicon.svg'
                                    }
                                    alt={scoreHit ? '✓' : '✗'}
                                    width={13}
                                    height={13}
                                  />
                                </div>
                              </>
                            )}
                          </div>

                          {/* Away team */}
                          <div className="flex flex-col items-center gap-1.5 w-[30%]">
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

                        {/* Nota 0×0 */}
                        {isZeroZero && (
                          <p className="pb-2 text-center text-[10px] text-white/40">
                            Nenhum gol marcado — empate 0×0
                          </p>
                        )}

                        {/* Seção de Último Gol */}
                        {showPlayerSection && (
                          <div className="border-t border-rs-gold/20 px-4 py-3">
                            <p className="mb-2 text-center text-[11px] font-semibold text-rs-gold">
                              Último gol —{' '}
                              {pred.predictionPlayer?.team ??
                                getTeamName(pred.match.teamHome)}
                            </p>

                            <div className="flex items-start justify-around gap-2">
                              {/* Palpite do usuário */}
                              <div className="flex min-w-0 flex-1 flex-col items-center gap-1">
                                <span className="text-[9px] uppercase tracking-wide text-white/40">
                                  Seu palpite
                                </span>
                                {hasUserPlayerPred ? (
                                  <div className="flex flex-col items-center gap-1">
                                    <Image
                                      src={getPlayerPhoto(
                                        pred.predictionPlayer!.photoUrl,
                                      )}
                                      alt={pred.predictionPlayer!.player!}
                                      className="h-8 w-8 rounded-full object-cover"
                                    />
                                    <span className="max-w-[80px] text-center text-[11px] leading-tight text-white">
                                      {pred.predictionPlayer!.player}
                                    </span>
                                  </div>
                                ) : (
                                  <span className="text-[12px] text-white/30">
                                    —
                                  </span>
                                )}
                              </div>

                              {/* Ícone HIT/MISS (somente quando finalizado e usuário fez palpite) */}
                              {!isPending && (
                                <div className="flex flex-col items-center justify-center pt-5">
                                  {hasUserPlayerPred ? (
                                    <Image
                                      src={
                                        playerHit
                                          ? '/checkicon.svg'
                                          : '/wrongicon.svg'
                                      }
                                      alt={playerHit ? '✓' : '✗'}
                                      width={16}
                                      height={16}
                                    />
                                  ) : (
                                    <span className="text-[11px] text-white/30">
                                      vs
                                    </span>
                                  )}
                                </div>
                              )}

                              {/* Goleador real — sempre exibido quando finalizado */}
                              {!isPending && (
                                <div className="flex min-w-0 flex-1 flex-col items-center gap-1">
                                  <span className="text-[9px] uppercase tracking-wide text-white/40">
                                    Goleador real
                                  </span>
                                  {hasActualScorer ? (
                                    <span
                                      className={`max-w-[80px] text-center text-[11px] leading-tight font-medium ${playerHit && hasUserPlayerPred ? 'text-green-400' : 'text-rs-gold'}`}
                                    >
                                      {pred.match.lastPlayer}
                                    </span>
                                  ) : (
                                    <span className="text-[11px] text-white/30">
                                      —
                                    </span>
                                  )}
                                </div>
                              )}
                            </div>
                          </div>
                        )}

                        {/* Result banner */}
                        <div className="border-t border-rs-gold/20 px-4 py-3 text-center">
                          {isPending ? (
                            <p className="text-[12px] text-rs-muted">
                              ⏳ Aguardando resultado
                            </p>
                          ) : isHit ? (
                            <p className="flex items-center justify-center gap-1.5 text-[13px] text-green-400">
                              <Image
                                src="/checkicon.svg"
                                alt="check"
                                width={16}
                                height={16}
                              />
                              Você acertou o palpite!
                            </p>
                          ) : (
                            <p className="flex items-center justify-center gap-1.5 text-[13px] text-[#E40000]">
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
