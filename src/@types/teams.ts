declare interface ITeam{
    id: string
    name: string
    status: string
    createdAt?: Date
}

declare interface INewTeams{
    names: { name: string }[];
}