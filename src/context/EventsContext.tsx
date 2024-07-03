import React, { createContext, useContext, useState, ReactNode } from 'react'

interface EventsContextType {
  selectedChampionship: string | null
  setSelectedChampionship: React.Dispatch<React.SetStateAction<string | null>>
  newChampionshipName: string
  setNewChampionshipName: React.Dispatch<React.SetStateAction<string>>
  isDisabledInput: boolean
  setIsDisabledInput: React.Dispatch<React.SetStateAction<boolean>>
  isDisabledCheckbox: boolean
  setIsDisabledCheckbox: React.Dispatch<React.SetStateAction<boolean>>
  currentModalIndex: number
  setCurrentModalIndex: React.Dispatch<React.SetStateAction<number>>
  handleNextModal: () => void
  handlePreviousModal: () => void
  selectedTeams: ITeam[]
  handleSetSelectedTeams: (teams: ITeam[]) => void
  selectedRound?: string
  handleSetSelectedRound: (id: string) => void
  setSelectedTeams: React.Dispatch<React.SetStateAction<ITeam[]>>
  selectedMatchSetResult?: IRoundWithMatchAndChampionship
  setSelectedMatchSetResult: React.Dispatch<
    React.SetStateAction<IRoundWithMatchAndChampionship | undefined>
  >
  refreshRounds: boolean
  setRefreshRounds: React.Dispatch<React.SetStateAction<boolean>>
  editSelectedMatch?: IMatchRound
  setEditSelectedMatch: React.Dispatch<
    React.SetStateAction<IMatchRound | undefined>
  >
}

const EventsContext = createContext<EventsContextType | undefined>(undefined)

interface ProviderProps {
  children: ReactNode
}

export const EventsProvider = ({ children }: ProviderProps) => {
  const [selectedChampionship, setSelectedChampionship] = useState<
    string | null
  >(null)
  const [newChampionshipName, setNewChampionshipName] = useState<string>('')
  const [isDisabledInput, setIsDisabledInput] = useState<boolean>(true)
  const [isDisabledCheckbox, setIsDisabledCheckbox] = useState<boolean>(false)
  const [currentModalIndex, setCurrentModalIndex] = useState<number>(0)
  const [selectedRound, setSelectedRound] = useState<string>()
  const [refreshRounds, setRefreshRounds] = useState(true)
  const [editSelectedMatch, setEditSelectedMatch] = useState<
    IMatchRound | undefined
  >()

  const [selectedMatchSetResult, setSelectedMatchSetResult] =
    useState<IRoundWithMatchAndChampionship>()

  const modalSteps = ['championship', 'rounds', 'teams', 'matches']

  const [selectedTeams, setSelectedTeams] = useState<ITeam[]>([])

  const handleNextModal = () => {
    if (currentModalIndex < modalSteps.length - 1) {
      setCurrentModalIndex(currentModalIndex + 1)
    }
  }

  const handleSetSelectedRound = (id: string) => {
    setSelectedRound(id)
  }

  const handlePreviousModal = () => {
    if (currentModalIndex > 0) {
      setCurrentModalIndex(currentModalIndex - 1)
    }
  }

  const handleSetSelectedTeams = (teams: ITeam[]) => {
    setSelectedTeams(teams)
  }

  return (
    <EventsContext.Provider
      value={{
        selectedChampionship,
        setSelectedChampionship,
        newChampionshipName,
        setNewChampionshipName,
        isDisabledInput,
        setIsDisabledInput,
        isDisabledCheckbox,
        setIsDisabledCheckbox,
        currentModalIndex,
        setCurrentModalIndex,
        handleNextModal,
        handlePreviousModal,
        selectedTeams,
        handleSetSelectedTeams,
        selectedRound,
        handleSetSelectedRound,
        setSelectedTeams,
        selectedMatchSetResult,
        setSelectedMatchSetResult,
        refreshRounds,
        setRefreshRounds,
        editSelectedMatch,
        setEditSelectedMatch,
      }}
    >
      {children}
    </EventsContext.Provider>
  )
}

export const useEventsContext = () => {
  const context = useContext(EventsContext)
  if (context === undefined) {
    throw new Error('useEventsContext must be used within a EventsProvider')
  }
  return context
}
