import React from 'react'
import { formatDateToCustomString } from '@/utils/formatDate'
import { Button, Image, useDisclosure } from '@nextui-org/react'
import { MdEdit, MdPerson } from 'react-icons/md'
import SetResultModal from '../SetResultModal/SetResultModal'
import { useEventsContext } from '@/context/EventsContext'
import { getLogo } from '@/utils/getLogo'
import EditMatchModal from '../EditMatch/EditMatch'

type RoundMatchsCardAdmin = {
  round: IRoundWithMatchsAndChampionship
  isDone?: boolean
}

export default function RoundMatchsCardAdmin({
  round,
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

  return (
    <>
      {round.matchs.length > 0 && (
        <div className="flex flex-col gap-4 w-full">
          {round.matchs.map((match) => (
            <div
              key={match.id}
              className="flex flex-col gap-4 p-4 my-[16px] bg-[#00409F] rounded-lg w-[90%] mx-auto"
            >
              <div className="flex w-full justify-between">
                <div className="flex space-x-2">
                  <Image src="/sportsicon.png" alt="sports icon" />
                  <h1 className="text-white text-[12px] font-normal">
                    {round.championship.name} - {round.name}{' '}
                  </h1>
                </div>
                <h1 className="text-white text-[12px] font-normal">
                  {formatDateToCustomString(new Date(match.date))}
                </h1>
              </div>
              <div className="flex items-center justify-evenly">
                <div className="flex flex-col items-center">
                  <p>{match.teamHome.name}</p>
                  <p>{match.scoreHome}</p>
                </div>
                <p>X</p>
                <div className="flex flex-col items-center">
                  <p>{match.teamAway.name}</p>
                  <p>{match.scoreAway}</p>
                </div>
              </div>
              {match.lastPlayerTeam && (
                <div className="flex flex-col">
                  <div className="flex space-x-2 items-center">
                    <div
                      className={`rounded-full w-[28px] h-[28px] ${getLogo(match.lastPlayerTeam?.name) === '/defaultlogo.svg' && 'bg-[#fff]'} `}
                    >
                      <Image
                        src={getLogo(match.lastPlayerTeam?.name)}
                        alt="sport logo"
                        className="w-[28px] h-[28px]"
                      />
                    </div>
                    <h1 className="text-white text-[12px] font-normal">
                      Marcador do último gol do {match.lastPlayerTeam?.name}
                    </h1>
                  </div>
                  <hr className="w-full h-[1px] bg-white my-4" />
                  <div className="flex space-x-2 items-center bg-[#1F67CE] p-2">
                    <div
                      className={`w-[28px] h-[28px] rounded-2xl ${getLogo(match.lastPlayerTeam?.name) === '/defaultlogo.svg' && 'bg-[#fff]'} `}
                    >
                      <Image
                        src={getLogo(match.lastPlayerTeam?.name)}
                        alt="sport logo"
                        className="w-[28px] h-[28px]"
                      />
                    </div>

                    <h1 className="text-white text-[12px] font-normal">
                      {match.lastPlayerToScore?.name || 'Nome do jogador'}
                    </h1>
                  </div>
                </div>
              )}

              <div className="flex items-center gap-3">
                <MdPerson />
                <p className="text-white text-[12px] font-normal">
                  {match.creator?.fullName}
                </p>
              </div>
              <div className="flex flex-col gap-4">
                {!isDone && (
                  <Button
                    variant="bordered"
                    className={`text-[14px] text-white font-bold border-white rounded-full`}
                    onPress={() => {
                      onOpenEditMatchModal()
                      setEditSelectedMatch(match)
                    }}
                  >
                    <p className="flex gap-3 items-center">
                      <MdEdit /> Editar evento
                    </p>
                  </Button>
                )}

                <Button
                  onClick={() => handleSetResult(round, match)}
                  type="submit"
                  className={`text-[14px] text-white font-bold bg-[#00764B] rounded-full`}
                >
                  {isDone ? 'Editar Resultado' : 'Definir resultado'}
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
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
