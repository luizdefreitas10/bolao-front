import React, { useMemo } from 'react'
import { formatDateToCustomString } from '@/utils/formatDate'
import { Button, Image, useDisclosure } from '@nextui-org/react'
import { MdEdit } from 'react-icons/md'
import SetResultModal from '../SetResultModal/SetResultModal'
import { useEventsContext } from '@/context/EventsContext'
import { getLogo, isDefaultLogo } from '@/utils/getLogo'
import { getPlayerPhoto } from '@/utils/getPlayerPhoto'
import EditMatchModal from '../EditMatch/EditMatch'
import SportsIcon from '../SportsIcon/SportsIcon'

type RoundMatchsCardAdmin = {
  rounds: IRoundWithMatchsAndChampionship[]
  isDone?: boolean
}

type AdminMatchItem = {
  round: IRoundWithMatchsAndChampionship
  match: IMatchRound
}

function teamLogoClassName(name?: string, logoUrl?: string | null) {
  const logo = getLogo(name, logoUrl)
  return `h-10 w-10 rounded-full object-cover ${isDefaultLogo(logo) ? 'bg-white p-1' : ''}`
}

function getLastScorerPhotoUrl(match: IMatchRound) {
  if (match.lastPlayerToScore?.photoUrl) {
    return match.lastPlayerToScore.photoUrl
  }

  const player = match.players?.find(
    (item) => item.id === match.lastPlayerToScore?.id,
  )

  return player?.photoUrl
}

function sortMatchesByDate(
  rounds: IRoundWithMatchsAndChampionship[],
): AdminMatchItem[] {
  return rounds
    .flatMap((round) =>
      round.matchs.map((match) => ({
        round,
        match,
      })),
    )
    .sort(
      (a, b) =>
        new Date(a.match.date).getTime() - new Date(b.match.date).getTime(),
    )
}

export default function RoundMatchsCardAdmin({
  rounds,
  isDone,
}: RoundMatchsCardAdmin) {
  const { setSelectedMatchSetResult, setEditSelectedMatch } = useEventsContext()
  const {
    isOpen: isOpenSetResultModal,
    onOpen: onOpenSetResultModal,
    onOpenChange: onOpenChangeSetResultModal,
  } = useDisclosure()

  const {
    isOpen: isOpenEditMatchModal,
    onOpen: onOpenEditMatchModal,
    onOpenChange: onOpenChangeEditMatchModal,
  } = useDisclosure()

  const sortedMatches = useMemo(() => sortMatchesByDate(rounds), [rounds])

  function handleSetResult(
    round: IRoundWithMatchsAndChampionship,
    match: IMatchRound,
  ) {
    setSelectedMatchSetResult({
      id: round.id,
      name: round.name,
      status: round.status,
      championship: round.championship,
      createdAt: round.createdAt,
      match,
    })
    onOpenSetResultModal()
  }

  if (sortedMatches.length === 0) {
    return null
  }

  return (
    <>
      <div className="flex w-full flex-col gap-4">
        {sortedMatches.map(({ round, match }) => {
          const homeLogo = getLogo(match.teamHome.name, match.teamHome.logoUrl)
          const awayLogo = getLogo(match.teamAway.name, match.teamAway.logoUrl)

          return (
            <div
              key={match.id}
              className="mx-auto my-[16px] flex w-[90%] flex-col gap-4 rounded-lg bg-rs-card-elevated p-4 text-rs-heading"
            >
              <div className="flex w-full justify-between">
                <div className="flex space-x-2">
                  <SportsIcon />
                  <h1 className="text-[12px] font-normal">
                    {round.championship.name} - {round.name}{' '}
                  </h1>
                </div>
                <h1 className="text-[12px] font-normal">
                  {formatDateToCustomString(new Date(match.date))}
                </h1>
              </div>
              <div className="flex items-center justify-evenly">
                <div className="flex flex-col items-center gap-2">
                  <Image
                    src={homeLogo}
                    alt={match.teamHome.name}
                    className={teamLogoClassName(
                      match.teamHome.name,
                      match.teamHome.logoUrl,
                    )}
                  />
                  <p>{match.teamHome.name}</p>
                  <p className="text-base font-semibold">{match.scoreHome}</p>
                </div>
                <p className="text-rs-muted">X</p>
                <div className="flex flex-col items-center gap-2">
                  <Image
                    src={awayLogo}
                    alt={match.teamAway.name}
                    className={teamLogoClassName(
                      match.teamAway.name,
                      match.teamAway.logoUrl,
                    )}
                  />
                  <p>{match.teamAway.name}</p>
                  <p className="text-base font-semibold">{match.scoreAway}</p>
                </div>
              </div>
              {isDone && match.lastPlayerToScore && (
                <>
                  <hr className="h-px w-full border-0 bg-rs-border" />
                  <div className="flex flex-col gap-2">
                    <p className="text-[12px] font-semibold text-rs-muted">
                      {match.lastPlayerTeam
                        ? `Marcador do último gol do ${match.lastPlayerTeam.name}`
                        : 'Último marcador'}
                    </p>
                    <div className="flex items-center gap-2 rounded-lg border border-rs-border bg-rs-modal p-2">
                      <Image
                        src={getPlayerPhoto(
                          getLastScorerPhotoUrl(match),
                          match.lastPlayerToScore.name,
                        )}
                        alt={match.lastPlayerToScore.name}
                        className="h-8 w-8 rounded-full object-cover"
                      />
                      <p className="text-[14px] font-medium">
                        {match.lastPlayerToScore.name}
                      </p>
                    </div>
                  </div>
                </>
              )}
              <div className="flex flex-col gap-4">
                {!isDone && (
                  <Button
                    variant="bordered"
                    className="rounded-full border-rs-heading text-[14px] font-bold text-rs-heading"
                    onPress={() => {
                      onOpenEditMatchModal()
                      setEditSelectedMatch(match)
                    }}
                  >
                    <p className="flex items-center gap-3">
                      <MdEdit /> Editar evento
                    </p>
                  </Button>
                )}

                <Button
                  onClick={() => handleSetResult(round, match)}
                  type="submit"
                  className="rounded-full bg-rs-gold text-[14px] font-bold text-rs-ink"
                >
                  {isDone ? 'Editar Resultado' : 'Definir resultado'}
                </Button>
              </div>
            </div>
          )
        })}
      </div>
      <SetResultModal
        isOpen={isOpenSetResultModal}
        onClose={onOpenChangeSetResultModal}
      />

      <EditMatchModal
        isOpen={isOpenEditMatchModal}
        onClose={onOpenChangeEditMatchModal}
      />
    </>
  )
}
