declare interface IRound {
  id: string
  name: string
  status: string
  createdAt?: Date
}

declare interface INewRound {
  name: string
  championshipId: string
}

declare interface INewRoundForm {
  name: string
}

declare interface IRoundWithMatchsAndChampionship {
  id: string
  name: string
  status: string
  createdAt?: Date
  matchs: IMatchRound[]
  championship: {
    name: string
  }
}

declare interface IRoundWithMatchAndChampionship {
  id: string
  name: string
  status: string
  createdAt?: Date
  match: IMatchRound
  championship: {
    name: string
  }
}

declare interface IMatchRound {
  id: string
  creator: {
    fullName: string
  } | null
  lastPlayerTeam: {
    id: string
    name: string
    logoUrl?: string | null
  } | null
  scoreAway: number
  scoreHome: number
  status: string
  date: string
  teamAway: {
    name: string
    id: string
    logoUrl?: string | null
  }
  teamHome: {
    name: string
    id: string
    logoUrl?: string | null
  }
  players: {
    name: string
    id: string
    photoUrl?: string | null
  }[]
  lastPlayerToScore?: {
    id: string
    name: string
    photoUrl?: string | null
  }
}

declare enum RoundStatus {
  'WAITING',
  'IN_PROGRESS',
  'DONE',
  'CANCELED',
  'INACTIVE',
}

declare interface IFetchActiveRounds {
  champId: string
  page?: string
}

declare interface IFetchActiveRoundsResponse {
  rounds: {
    id: string
    name: string
    status: string
    matchs: {
      scoreAway: number
      scoreHome: number
      status: string
      date: Date
      teamAway: {
        name: string
      }
      teamHome: {
        name: string
      }
    }[]
  }[]
}

declare interface IRounds {
  id: string
  name: string
  status: string
  matchs: {
    scoreAway: number
    scoreHome: number
    status: string
    date: Date
    teamAway: {
      name: string
    }
    teamHome: {
      name: string
    }
  }[]
}
