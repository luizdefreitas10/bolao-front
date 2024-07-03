import React from 'react'
import { Modal, ModalContent } from '@nextui-org/react'

import CreateChampionshipModal from '../CreateChampionshipModal/CreateChampionshipModal'
import { useEventsContext } from '@/context/EventsContext'
import CreateRoundsModal from '../CreateRoundsModal/CreateRoundsModal'
import CreateTeamsModal from '../CreateTeamsModal/CreateTeamsModal'
import CreateMatchesModal from '../CreateMatchesModal/CreateMatchesModal'

interface CustomModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function CreateEventModal({
  isOpen,
  onClose,
}: CustomModalProps) {
  const { currentModalIndex } = useEventsContext()

  return (
    <Modal
      scrollBehavior="outside"
      isOpen={isOpen}
      onOpenChange={onClose}
      size="4xl"
      closeButton={<img src="/closeicon.png" alt="close" />}
    >
      <ModalContent className={`bg-[#1F67CE]`}>
        {(onClose) => (
          <>
            {currentModalIndex === 0 && (
              <>
                <CreateChampionshipModal onClose={onClose} />
              </>
            )}
            {currentModalIndex === 1 && (
              <>
                <CreateRoundsModal onClose={onClose} />
              </>
            )}
            {currentModalIndex === 2 && (
              <>
                <CreateTeamsModal onClose={onClose} />
              </>
            )}
            {currentModalIndex === 3 && (
              <>
                <CreateMatchesModal onClose={onClose} />
              </>
            )}
          </>
        )}
      </ModalContent>
    </Modal>
  )
}
