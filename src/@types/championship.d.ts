declare interface IChampionship {
  id: string
  name: string
  status: string
  createdAt?: Date
}

declare interface INewChampionship {
  name: string
}

declare interface IChampionshipWithRounds {
  id: string
  name: string
  status: string
  rounds: {
    name: string
    status: string
    createdAt: string
    updatedAt: string
    matchs: {
      id: string
      scoreAway: number
      scoreHome: number
      status: string
      date: Date
      players: {
        name: string
        id: string
        photoUrl?: string | null
      }[]
      lastPlayerTeam: {
        id: string
        name: string
        logoUrl?: string | null
      }
      teamAway: {
        name: string
        logoUrl?: string | null
      }
      teamHome: {
        name: string
        logoUrl?: string | null
      }
      predictions: {
        id: string
        createdAt: Date
        updatedAt: Date
        lastPlayerToScore: {
          createdAt: Date
          id: string
          name: string
          status: string
          teamId: string
          updatedAt: Date | null
        } | null
        lastPlayerToScoreId: string | null
        predictionHome: number
        predictionAway: number
        predictionType: 'PLAYER' | 'SCORE'
      }[]
    }[]
  }[]
}
