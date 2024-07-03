import { get } from '../../methods/get'
import { post } from '../../methods/post'

export default async function ChampionshipService() {
  async function create(data: INewChampionship): Promise<IChampionship> {
    const payload = JSON.stringify(data)
    const response = await post<{ championship: IChampionship }, string>(
      '/championship',
      payload,
    )
    return response.championship
  }

  async function fetchChampionshipsWithRounds(
    token: string,
  ): Promise<IChampionshipWithRounds[]> {
    const response = await get<{ championships: IChampionshipWithRounds[] }>(
      '/championship/waiting-rounds',
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    )

    return response.championships
  }

  async function fetchChampionships(): Promise<IChampionship[]> {
    const response = await get<{ championships: IChampionship[] }>(
      '/championship',
    )

    return response.championships
  }

  return {
    create,
    fetchChampionshipsWithRounds,
    fetchChampionships,
  }
}
