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


declare enum RoundStatus {
  "WAITING",
  "IN_PROGRESS",
  "DONE",
  "CANCELED",
  "INACTIVE",
}

