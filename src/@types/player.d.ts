declare interface IPlayer {
  name: string
  id: string
  photoUrl?: string | null
}

declare interface INewPlayer {
  name: string
  teamId: string
  matchId: string
}
