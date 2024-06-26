
import { get } from "../../methods/get";
import { post } from "../../methods/post";

export default async function RoundService() {
  async function create(data: INewRound): Promise<{ roundId: string }> {
    const payload = JSON.stringify(data)
    const response = await post<{ roundId: string }, string>('/round', payload)
    return response
  }
  async function fetchRoundsByStatus(champId: string, status: string): Promise<IRound[]> {
    const response = await get<{rounds: IRound[]}>(
      `/rounds/${champId}/status/${status}`
    );
    return response.rounds;
  }


  return {
    create,
    fetchRoundsByStatus
  };
}
