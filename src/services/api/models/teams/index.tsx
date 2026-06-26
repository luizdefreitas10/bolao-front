import { get } from '../../methods/get'
import { post } from '../../methods/post'

export default async function TeamService() {
  async function create(
    data: INewTeam,
  ): Promise<{ teamId: string; teamName: string }> {
    return await post<{ teamId: string; teamName: string }, INewTeam>(
      '/team',
      data,
    )
  }

  async function fetchTeams(): Promise<ITeam[]> {
    const response = await get<{ teams: ITeam[] }>('/team')
    return response.teams
  }

  return {
    create,
    fetchTeams,
  }
}
