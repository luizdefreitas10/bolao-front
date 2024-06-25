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
  const modalSteps = ['championship', 'rounds', 'teams', 'matches']

  const handleNextModal = () => {
    if (currentModalIndex < modalSteps.length - 1) {
      setCurrentModalIndex(currentModalIndex + 1)
    }
  }

  const handlePreviousModal = () => {
    if (currentModalIndex > 0) {
      setCurrentModalIndex(currentModalIndex - 1)
    }
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
