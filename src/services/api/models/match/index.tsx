import { patch } from '../../methods/patch'
import { post } from '../../methods/post'
import { put } from '../../methods/put'

export default async function MatchService() {
  async function create(data: INewMatch): Promise<{ matchId: string }> {
    return await post<{ matchId: string }, INewMatch>('/match', data)
  }

  async function updateScore(data: IPayloadSetResutMatch): Promise<void> {
    await put('/match', data)
  }

  async function updateDateMatch(matchId: string, date: Date): Promise<void> {
    await patch('/match/update-date', { matchId, date })
  }

  return {
    create,
    updateScore,
    updateDateMatch,
  }
}
