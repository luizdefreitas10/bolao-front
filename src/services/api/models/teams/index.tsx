import { get } from '../../methods/get'
import { post } from '../../methods/post'

export default async function TeamService() {
  async function create(
    data: INewTeam,
  ): Promise<{ teamId: string; teamName: string }> {
    const payload = JSON.stringify(data)
    const response = await post<{ teamId: string; teamName: string }, string>(
      '/team',
      payload,
    )
    return response
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
