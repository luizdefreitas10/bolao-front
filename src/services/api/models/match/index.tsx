import { post } from "../../methods/post";

export default async function MatchService() {
  async function create(data: INewMatch): Promise<{matchId: string}> {
    console.log(data.date)
    const payload = JSON.stringify(data);
    const response = await post<{matchId:string}, string>("/match", payload);
    return response
  }

  return {
    create,
  };
}
