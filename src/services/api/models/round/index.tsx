import { get } from '../../methods/get'
import { post } from '../../methods/post'

export default async function RoundService() {
  async function create(data: INewRound): Promise<{ roundId: string }> {
    const payload = JSON.stringify(data)
    const response = await post<{ roundId: string }, string>('/round', payload)
    return response
  }
  async function fetchRoundsByStatus(
    status: string,
  ): Promise<IRoundWithMatchsAndChampionship[]> {
    const response = await get<{ rounds: IRoundWithMatchsAndChampionship[] }>(
      `/rounds/status/${status}`,
    )
    return response.rounds
  }
  async function fetchRoundsByStatusAndChampionship(
    champId: string,
    status: string,
  ): Promise<IRound[]> {
    const response = await get<{ rounds: IRound[] }>(
      `/rounds/${champId}/status/${status}`,
    )
    return response.rounds
  }

  async function fetchRounds(data: IFetchActiveRounds, token: string) {
    const response = await get<IFetchActiveRoundsResponse>(
      `/rounds/${data.champId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    )

    return response
  }

  return {
    create,

    fetchRounds,

    fetchRoundsByStatusAndChampionship,
    fetchRoundsByStatus,
  }
}
