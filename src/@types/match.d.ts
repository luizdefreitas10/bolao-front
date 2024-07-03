declare interface INewMatch {
  teamIdHome: string
  teamIdAway: string
  roundId: string
  date: string | Date
  lastPlayerTeamId?: string
}

declare interface ISetResultMatch {
  scoreAway: number
  scoreHome: number
  lastPlayerId?: string
}

declare interface IPayloadSetResutMatch {
  scoreAway: number
  scoreHome: number
  lastPlayerId?: string
  matchId: string
}
