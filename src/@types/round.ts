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
