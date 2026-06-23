declare interface ITeam {
  id: string
  name: string
  logoUrl?: string | null
  createdAt?: Date
}

declare interface INewTeamsForm {
  names: { name: string }[]
}

declare interface INewTeam {
  name: string
}
