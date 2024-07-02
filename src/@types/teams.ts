declare interface ITeam {
  id: string
  name: string
  createdAt?: Date
}

declare interface INewTeamsForm {
  names: { name: string }[]
}

declare interface INewTeam {
  name: string
}
