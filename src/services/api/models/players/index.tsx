import { get } from '../../methods/get'
import { post } from '../../methods/post'
import { put } from '../../methods/put'

export default async function PlayerService() {
  async function create(data: INewPlayer): Promise<{ playerId: string }> {
    const payload = JSON.stringify(data)
    const response = await post<{ playerId: string }, string>(
      '/player',
      payload,
    )
    return response
  }
  async function fetchPlayersByMatchAndTeam(
    roundId: string,
    teamId: string,
  ): Promise<IPlayer[]> {
    const response = await get<{ players: IPlayer[] }>(
      `/player/match/${roundId}/team/${teamId}`,
    )
    return response.players
  }

  async function fetchPlayersByTeam(teamId: string): Promise<IPlayer[]> {
    const response = await get<{ players: IPlayer[] }>(`/player/team/${teamId}`)
    return response.players
  }

  async function updatePlayersMatch(
    matchId: string,
    lastPlayerTeamId: string,
    players: string[],
  ): Promise<void> {
    const payload = JSON.stringify({ matchId, lastPlayerTeamId, players })
    await put(`/player`, payload)
  }

  return {
    fetchPlayersByMatchAndTeam,
    create,
    fetchPlayersByTeam,
    updatePlayersMatch,
  }
}
