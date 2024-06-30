import { get } from "../../methods/get";

export default async function PlayerService() {
  async function fetchPlayersByRoundAndTeam(
    roundId: string,
    teamId: string
  ): Promise<IPlayer[]> {
    const response = await get<{ players: IPlayer[] }>(
      `/player/round/${roundId}/team/${teamId}`
    );
    return response.players;
  }

  return {
    fetchPlayersByRoundAndTeam,
  };
}
