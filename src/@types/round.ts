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
